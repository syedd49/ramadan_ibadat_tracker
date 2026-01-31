import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Svg, { Rect } from "react-native-svg";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";

export default function StatsTab() {
  const [scores, setScores] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  const MAX_BAR_HEIGHT = 150;
  const MIN_BAR_HEIGHT = 6;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();

        const scoreByDay: Record<number, number> = {};
        let lastActiveDay = 0;

        Object.keys(all).forEach(key => {
          const day = Number(key);
          let total = 0;

          [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
            if (all[day][i.id]) total += i.score;
          });

          scoreByDay[day] = total;

          if (total > 0 && day > lastActiveDay) {
            lastActiveDay = day;
          }
        });

        // build continuous timeline
        const timeline: number[] = [];
        for (let d = 1; d <= lastActiveDay; d++) {
          timeline.push(scoreByDay[d] ?? 0);
        }

        // calculate streak
        let currentStreak = 0;
        for (let i = timeline.length - 1; i >= 0; i--) {
          if (timeline[i] > 0) currentStreak++;
          else break;
        }

        setScores(timeline);
        setStreak(currentStreak);
      })();
    }, [])
  );

  const maxScore = Math.max(...scores, 100);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Progress</Text>
      <Text style={styles.streak}>
        🔥 Current Streak: {streak} days
      </Text>

      <Svg height={180} width="100%">
        {scores.map((score, index) => {
          const isMissed = score === 0;

          const barHeight = isMissed
            ? MIN_BAR_HEIGHT
            : Math.max(
                (score / maxScore) * MAX_BAR_HEIGHT,
                MIN_BAR_HEIGHT
              );

          return (
            <Rect
              key={index}
              x={index * 14}
              y={160 - barHeight}
              width={10}
              height={barHeight}
              fill={isMissed ? "#C0392B" : "#1F7A4D"}
            />
          );
        })}
      </Svg>

      {/* LEGEND */}
      <View style={styles.legend}>
        <Legend color="#1F7A4D" label="Completed" />
        <Legend color="#C0392B" label="Missed" />
      </View>

      <Text style={styles.caption}>
        Your progress graph shows your commitment to Ramadan. Aim to maintain and improve your ibadat daily!
        May Almighty Allah accept your efforts.
      </Text>
    </ScrollView>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
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
  },
  streak: {
    color: "#1F7A4D",
    fontSize: 18,
    marginVertical: 10,
  },
  caption: {
    color: "#C7D2CC",
    textAlign: "center",
    marginTop: 8,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: "#C7D2CC",
    fontSize: 12,
  },
});
