import { ScrollView, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Screen } from "../../src/components/Screen";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { generateWeeklyInsight } from "../../src/ai/weeklyInsightEngine";

export default function WeeklyReport() {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    (async () => {
      const all = await loadAllDailyIbadat();
      const days = Object.keys(all).map(Number).slice(-7);

      const activeDays = days.filter(d =>
        Object.values(all[d] || {}).some(Boolean)
      ).length;

      setSummary(
        generateWeeklyInsight({
          totalDays: 7,
          activeDays,
          bestDay: days[0],
        })
      );
    })();
  }, []);

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Weekly AI Report</Text>
        <Text style={styles.text}>{summary}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    color: "#F5F5DC",
    fontSize: 16,
    lineHeight: 22,
  },
});
