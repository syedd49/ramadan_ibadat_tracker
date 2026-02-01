import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { Screen } from "../../src/components/Screen";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { getTasbeehHistory } from "../../src/storage/tasbeehStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";

/* ---------- DATE HELPERS ---------- */
function dateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function addDays(base: Date, offset: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d;
}

/* ---------- MAIN ---------- */
export default function SummaryTab() {
  const [daily, setDaily] = useState({ score: 0, tasbeeh: 0 });
  const [weekly, setWeekly] = useState({
    activeDays: 0,
    totalScore: 0,
    totalTasbeeh: 0,
  });
  const [monthly, setMonthly] = useState({
    activeDays: 0,
    totalScore: 0,
    totalTasbeeh: 0,
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const ibadatByDayIndex = await loadAllDailyIbadat();
        const tasbeehHistory = await getTasbeehHistory();

        /* ======================================
           STEP 1: BUILD DATE → IBADAT SCORE MAP
        ====================================== */
        const scoreByDate: Record<string, number> = {};

        Object.keys(ibadatByDayIndex).forEach(dayIndexStr => {
          const dayIndex = Number(dayIndexStr);

          // Assume day 1 = app start date
          const appStartDate = new Date();
          appStartDate.setDate(
            appStartDate.getDate() - (dayIndex - 1)
          );

          const key = dateKey(appStartDate);

          let score = 0;
          [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
            if (ibadatByDayIndex[dayIndex]?.[i.id]) {
              score += i.score;
            }
          });

          scoreByDate[key] = score;
        });

        /* ======================================
           TODAY
        ====================================== */
        const todayKey = dateKey(new Date());

        const todayScore = scoreByDate[todayKey] || 0;
        const todayTasbeeh = tasbeehHistory[todayKey]
          ? Object.values(tasbeehHistory[todayKey]).reduce(
              (a, b) => a + b,
              0
            )
          : 0;

        setDaily({
          score: todayScore,
          tasbeeh: todayTasbeeh,
        });

        /* ======================================
           WEEK (LAST 7 DAYS INCLUDING TODAY)
        ====================================== */
        let weekScore = 0;
        let weekTasbeeh = 0;
        let weekActiveDays = 0;

        for (let i = 0; i < 7; i++) {
          const d = dateKey(addDays(new Date(), -i));
          const s = scoreByDate[d] || 0;

          if (s > 0) weekActiveDays++;
          weekScore += s;

          if (tasbeehHistory[d]) {
            weekTasbeeh += Object.values(
              tasbeehHistory[d]
            ).reduce((a, b) => a + b, 0);
          }
        }

        setWeekly({
          activeDays: weekActiveDays,
          totalScore: weekScore,
          totalTasbeeh: weekTasbeeh,
        });

        /* ======================================
           MONTH (CURRENT MONTH)
        ====================================== */
        const currentMonth =
          todayKey.slice(0, 7); // YYYY-MM

        let monthScore = 0;
        let monthTasbeeh = 0;
        let monthActiveDays = 0;

        Object.keys(scoreByDate)
          .filter(d => d.startsWith(currentMonth))
          .forEach(d => {
            const s = scoreByDate[d];
            if (s > 0) monthActiveDays++;
            monthScore += s;

            if (tasbeehHistory[d]) {
              monthTasbeeh += Object.values(
                tasbeehHistory[d]
              ).reduce((a, b) => a + b, 0);
            }
          });

        setMonthly({
          activeDays: monthActiveDays,
          totalScore: monthScore,
          totalTasbeeh: monthTasbeeh,
        });
      })();
    }, [])
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Section title="Today 📅">
          <Item label="Ibadat Score" value={daily.score} />
          <Item label="Tasbeeh Count" value={daily.tasbeeh} />
        </Section>

        <Section title="This Week 📊">
          <Item label="Active Days" value={weekly.activeDays} />
          <Item label="Total Score" value={weekly.totalScore} />
          <Item label="Total Tasbeeh" value={weekly.totalTasbeeh} />
        </Section>

        <Section title="This Month 🌙">
          <Item label="Active Days" value={monthly.activeDays} />
          <Item label="Total Score" value={monthly.totalScore} />
          <Item label="Total Tasbeeh" value={monthly.totalTasbeeh} />
        </Section>
      </ScrollView>
    </Screen>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {children}
    </View>
  );
}

function Item({ label, value }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: {
    backgroundColor: "#162922",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  heading: {
    color: "#F5F5DC",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    color: "#C7D2CC",
    fontSize: 14,
  },
  value: {
    color: "#1F7A4D",
    fontSize: 16,
    fontWeight: "600",
  },
});
