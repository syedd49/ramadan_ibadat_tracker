import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { getRamadanDay } from "../../src/logic/date";

export default function SummaryTab() {
  const [completedDays, setCompletedDays] = useState(0);
  const [missedDays, setMissedDays] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();
        const today = getRamadanDay() ?? 0;

        const dayNumbers = Object.keys(all)
          .map(Number)
          .sort((a, b) => a - b);

        const scores = dayNumbers.map((day) => {
          let total = 0;
          [...SALAH_LIST, ...IBADAT_LIST].forEach((i) => {
            if (all[day][i.id]) total += i.score;
          });
          return { day, total };
        });

        const completed = scores.filter((d) => d.total > 0).length;
        const average =
          scores.reduce((a, b) => a + b.total, 0) /
          (scores.length || 1);

        // streak calculation (from latest backwards)
        let currentStreak = 0;
        for (let d = today; d >= 1; d--) {
          const found = scores.find((s) => s.day === d);
          if (found && found.total > 0) currentStreak++;
          else break;
        }

        setCompletedDays(completed);
        setMissedDays(Math.max(0, today - completed));
        setAvgScore(Math.round(average));
        setStreak(currentStreak);
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ramadan Summary 🌙</Text>

      <Stat label="Completed Days" value={completedDays} />
      <Stat label="Missed Days" value={missedDays} />
      <Stat label="Final Streak" value={`${streak} days`} />
      <Stat label="Average Score" value={`${avgScore} / 100`} />

      <View style={styles.reflectionBox}>
        <Text style={styles.reflection}>
          Ramadan is about consistency, not perfection. Carry what you built
          forward 🤍
        </Text>
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1A14",
    padding: 20,
  },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  stat: {
    backgroundColor: "#162922",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  statLabel: {
    color: "#C7D2CC",
    fontSize: 14,
  },
  statValue: {
    color: "#1F7A4D",
    fontSize: 20,
    fontWeight: "bold",
  },
  reflectionBox: {
    backgroundColor: "#12251F",
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
  },
  reflection: {
    color: "#E0EDE7",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
});
