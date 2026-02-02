import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";

import { Screen } from "../../src/components/Screen";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { useLang } from "../../src/context/LanguageContext";
import { useDay } from "../../src/context/DayContext";

type SummaryBlock = {
  days: number;
  score: number;
};

export default function SummaryTab() {
  const { t, lang } = useLang();
  const isRTL = lang === "ur";
  const { day: currentDay } = useDay();

  const [today, setToday] = useState<SummaryBlock>({
    days: 1,
    score: 0,
  });
  const [week, setWeek] = useState<SummaryBlock>({
    days: 0,
    score: 0,
  });
  const [month, setMonth] = useState<SummaryBlock>({
    days: 0,
    score: 0,
  });

  useEffect(() => {
    (async () => {
      const all = await loadAllDailyIbadat();

      let todayScore = 0;
      let weekScore = 0;
      let monthScore = 0;

      let weekDays = 0;
      let monthDays = 0;

      // 🔹 TODAY
      [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
        if (all[currentDay]?.[i.id]) {
          todayScore += i.score;
        }
      });

      // 🔹 WEEK (last 7 days incl today)
      for (let d = currentDay; d > currentDay - 7 && d > 0; d--) {
        let score = 0;

        [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
          if (all[d]?.[i.id]) score += i.score;
        });

        if (score > 0) {
          weekDays++;
          weekScore += score;
        }
      }

      // 🔹 MONTH (all available days)
      Object.keys(all).forEach(key => {
        const d = Number(key);
        if (!Number.isFinite(d)) return;

        let score = 0;
        [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
          if (all[d]?.[i.id]) score += i.score;
        });

        if (score > 0) {
          monthDays++;
          monthScore += score;
        }
      });

      setToday({ days: 1, score: todayScore });
      setWeek({ days: weekDays, score: weekScore });
      setMonth({ days: monthDays, score: monthScore });
    })();
  }, [currentDay]);

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 24 }}
      >
        <Text
          style={[
            styles.heading,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("summary_heading")}
        </Text>

        {/* 🔹 DAILY */}
        <SummaryCard
          title={t("summary_today")}
          days={today.days}
          score={today.score}
        />

        {/* 🔹 WEEKLY */}
        <SummaryCard
          title={t("summary_week")}
          days={week.days}
          score={week.score}
        />

        {/* 🔹 MONTHLY */}
        <SummaryCard
          title={t("summary_month")}
          days={month.days}
          score={month.score}
        />
      </ScrollView>
    </Screen>
  );
}

function SummaryCard({
  title,
  days,
  score,
}: {
  title: string;
  days: number;
  score: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>
        Days: {days}
      </Text>
      <Text style={styles.cardText}>
        Score: {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#162922",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },

  cardTitle: {
    color: "#1F7A4D",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  cardText: {
    color: "#F5F5DC",
    fontSize: 14,
    marginBottom: 4,
  },
});
