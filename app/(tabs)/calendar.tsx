import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useEffect, useMemo, useState } from "react";

import { Screen } from "../../src/components/Screen";
import { useDay } from "../../src/context/DayContext";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { useLang } from "../../src/context/LanguageContext";
import { AICard } from "../../src/components/AICard";
import { getDailyAIInsight } from "../../src/ai/aiAdapter";
import { calculateStreak } from "../../src/ai/streakEngine";

/* -------------------------------------------------- */
/* 🗓️ TRUE CALENDAR UTILITIES                         */
/* -------------------------------------------------- */

function getMonthMeta(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDay.getDay() + 6) % 7;

  return { year, month, daysInMonth, startOffset };
}

/* -------------------------------------------------- */

type ScoreMap = Record<number, number>;

export default function CalendarTab() {
  const {
    day: selectedDay,
    today,
    setDayByCalendar,
  } = useDay();

  const { lang } = useLang();
  const isRTL = lang === "ur";

  const realToday = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(
      realToday.getFullYear(),
      realToday.getMonth(),
      1
    )
  );

  const { year, month, daysInMonth, startOffset } =
    getMonthMeta(currentDate);

  const isCurrentMonth =
    year === realToday.getFullYear() &&
    month === realToday.getMonth();

  const [scores, setScores] = useState<ScoreMap>({});
  const [aiText, setAiText] = useState("");

  /* 📅 GRID */
  const cells = useMemo(() => {
    const totalCells =
      Math.ceil(
        (startOffset + daysInMonth) / 7
      ) * 7;

    return Array.from({ length: totalCells }).map(
      (_, i) => {
        const d = i - startOffset + 1;
        return d > 0 && d <= daysInMonth
          ? d
          : null;
      }
    );
  }, [daysInMonth, startOffset]);

  /* 🔹 Load scores */
  useEffect(() => {
    (async () => {
      const all = await loadAllDailyIbadat();
      const map: ScoreMap = {};

      Object.keys(all).forEach(k => {
        const d = Number(k);
        let score = 0;

        [...SALAH_LIST, ...IBADAT_LIST].forEach(
          i => {
            if (all[d]?.[i.id])
              score += i.score;
          }
        );

        map[d] = score;
      });

      setScores(map);
    })();
  }, [selectedDay]);

  /* 🧠 AI Insight */
  useEffect(() => {
    if (!isCurrentMonth) return;

    (async () => {
      const all = await loadAllDailyIbadat();
      const dayData = all[selectedDay] || {};

      const completed: string[] = [];
      const missed: string[] = [];

      [...SALAH_LIST, ...IBADAT_LIST].forEach(
        i => {
          if (dayData[i.id])
            completed.push(i.id);
          else missed.push(i.id);
        }
      );

      const streak = calculateStreak(
        all,
        selectedDay
      );

      const insight = await getDailyAIInsight({
        day: selectedDay,
        completed,
        missed,
        streak,
      });

      setAiText(insight);
    })();
  }, [selectedDay, isCurrentMonth]);

  const changeMonth = (dir: -1 | 1) => {
    const next = new Date(year, month + dir, 1);
    setCurrentDate(next);

    if (
      next.getFullYear() ===
        realToday.getFullYear() &&
      next.getMonth() === realToday.getMonth()
    ) {
      setDayByCalendar(today);
    } else {
      setDayByCalendar(1);
    }
  };

  /* 🔥 MAIN LOGIC CHANGE */
  const getDayStyle = (d: number) => {
    const score = scores[d] ?? 0;

    if (isCurrentMonth && d === today)
      return styles.today;

    if (isCurrentMonth && d === selectedDay)
      return styles.selected;

    if (score > 0)
      return styles.completed;

    // 🔴 MISSED DAY
    return styles.missed;
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        {/* MONTH HEADER */}
        <View style={styles.monthHeader}>
          <Pressable
            onPress={() => changeMonth(-1)}
          >
            <Text style={styles.nav}>‹</Text>
          </Pressable>

          <Text style={styles.heading}>
            {currentDate.toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </Text>

          <Pressable
            onPress={() => changeMonth(1)}
          >
            <Text style={styles.nav}>›</Text>
          </Pressable>
        </View>

        <AICard
          text={isCurrentMonth ? aiText : ""}
        />

        {/* WEEK HEADER */}
        <View style={styles.weekRow}>
          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map(d => (
            <Text key={d} style={styles.weekText}>
              {d}
            </Text>
          ))}
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {cells.map((d, i) => (
            <View key={i} style={styles.cell}>
              {d && (
                <Pressable
                  onPress={() =>
                    setDayByCalendar(d)
                  }
                  disabled={
                    isCurrentMonth && d > today
                  }
                >
                  <View
                    style={[
                      styles.dayBox,
                      getDayStyle(d),
                      isCurrentMonth &&
                        d > today && {
                          opacity: 0.4,
                        },
                    ]}
                  >
                    <Text
                      style={styles.dayNumber}
                    >
                      {d}
                    </Text>

                    {scores[d] > 0 && (
                      <Text
                        style={styles.scoreText}
                      >
                        {scores[d]}
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

/* -------------------------------------------------- */
/* STYLES                                             */
/* -------------------------------------------------- */

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },

  nav: {
    color: "#4AA3DF",
    fontSize: 32,
    fontWeight: "700",
    paddingHorizontal: 12,
  },

  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  weekText: {
    flex: 1,
    textAlign: "center",
    color: "#9FB9B2",
    fontSize: 12,
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  cell: {
    width: "14.2857%",
    alignItems: "center",
    marginBottom: 12,
  },

  dayBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  dayNumber: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },

  scoreText: {
    color: "#F5F5DC",
    fontSize: 10,
    marginTop: 2,
  },

  today: {
    borderWidth: 2,
    borderColor: "#FFD700",
    backgroundColor: "#1F3D2B",
  },

  selected: {
    borderWidth: 2,
    borderColor: "#4AA3DF",
    backgroundColor: "#162922",
  },

  completed: {
    backgroundColor: "#1F7A4D",
  },

  // 🔴 MISSED DAY STYLE
  missed: {
    backgroundColor: "#7A1F1F",
  },
});
