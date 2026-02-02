import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";

import { Screen } from "../../src/components/Screen";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { calculateStreak } from "../../src/ai/streakEngine";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDays: 0,
    activeDays: 0,
    avgStreak: 0,
    weekly: [] as number[],
  });

  useEffect(() => {
    (async () => {
      const all = await loadAllDailyIbadat();
      const days = Object.keys(all)
        .map(Number)
        .sort((a, b) => a - b);

      const last7 = days.slice(-7);

      const weekly = last7.map(d =>
        Object.values(all[d] || {}).some(Boolean) ? 1 : 0
      );

      let active = 0;
      let streakSum = 0;

      days.forEach(d => {
        if (Object.values(all[d] || {}).some(Boolean)) {
          active++;
          streakSum += calculateStreak(all, d);
        }
      });

      setStats({
        totalDays: days.length,
        activeDays: active,
        avgStreak:
          days.length > 0
            ? Math.round(streakSum / days.length)
            : 0,
        weekly,
      });
    })();
  }, []);

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Admin Dashboard</Text>

        {/* KPI CARDS */}
        <View style={styles.card}>
          <Text style={styles.label}>Total Days</Text>
          <Text style={styles.value}>{stats.totalDays}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Active Days</Text>
          <Text style={styles.value}>{stats.activeDays}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Avg Streak</Text>
          <Text style={styles.value}>{stats.avgStreak}</Text>
        </View>

        {/* WEEKLY ACTIVITY */}
        <Text style={styles.subHeading}>
          Last 7 Days Activity
        </Text>

        <View style={styles.chartRow}>
          {stats.weekly.map((v, i) => (
            <View key={i} style={styles.chartCol}>
              <View
                style={[
                  styles.bar,
                  { height: v ? 60 : 15 },
                  { backgroundColor: v ? "#1F7A4D" : "#7A1F1F" },
                ]}
              />
              <Text style={styles.dayLabel}>
                D{i + 1}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },

  heading: {
    color: "#F5F5DC",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  subHeading: {
    color: "#9FB9B2",
    fontSize: 16,
    marginVertical: 12,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#1B2F26",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  label: {
    color: "#9FB9B2",
    fontSize: 14,
  },

  value: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },

  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  chartCol: {
    alignItems: "center",
    width: "13%",
  },

  bar: {
    width: 18,
    borderRadius: 6,
  },

  dayLabel: {
    color: "#9FB9B2",
    fontSize: 10,
    marginTop: 4,
  },
});
