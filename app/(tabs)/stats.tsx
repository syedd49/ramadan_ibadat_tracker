import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { generateWeeklySummary } from "../../src/ai/weeklySummary";
import { Screen } from "../../src/components/Screen";

const MAX_BAR_HEIGHT = 150;
const MIN_BAR_HEIGHT = 6;

export default function StatsTab() {
  const [scores, setScores] = useState<number[]>([]);
  const [summary, setSummary] = useState("");

  const animatedBars = useRef<Animated.Value[]>([]).current;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();

        const days = Object.keys(all)
          .map(Number)
          .sort((a, b) => a - b);

        let lastActiveDay = 0;
        const scoreByDay: Record<number, number> = {};

        days.forEach(day => {
          let total = 0;
          [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
            if (all[day]?.[i.id]) total += i.score;
          });
          scoreByDay[day] = total;
          if (total > 0) lastActiveDay = Math.max(lastActiveDay, day);
        });

        const timeline: number[] = [];
        for (let d = 1; d <= lastActiveDay; d++) {
          timeline.push(scoreByDay[d] ?? 0);
        }

        // weekly summary
        const last7 = timeline.slice(-7);
        let completed = last7.filter(s => s > 0).length;
        let avg = last7.reduce((a, b) => a + b, 0) / Math.max(last7.length, 1);

        setSummary(
          generateWeeklySummary({
            totalDays: last7.length,
            completedDays: completed,
            avgScore: avg,
            mostMissed: null,
          })
        );

        setScores(timeline);

        // setup animated values
        animatedBars.length = 0;
        timeline.forEach(() => animatedBars.push(new Animated.Value(0)));

        // animate bars
        Animated.stagger(
          40,
          animatedBars.map((anim, index) =>
            Animated.timing(anim, {
              toValue:
                timeline[index] === 0
                  ? MIN_BAR_HEIGHT
                  : Math.max(
                      (timeline[index] / 100) * MAX_BAR_HEIGHT,
                      MIN_BAR_HEIGHT
                    ),
              duration: 600,
              useNativeDriver: false,
            })
          )
        ).start();
      })();
    }, [])
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Weekly Summary 🧠</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        <Text style={styles.heading}>Progress</Text>

        <View style={styles.graph}>
          {scores.map((score, index) => {
            const isMissed = score === 0;

            return (
              <View key={index} style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: isMissed ? "#C0392B" : "#1F7A4D",
                      height: animatedBars[index] || MIN_BAR_HEIGHT,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.legend}>
          <Legend color="#1F7A4D" label="Completed" />
          <Legend color="#C0392B" label="Missed" />
        </View>
      </ScrollView>
    </Screen>
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
    padding: 20,
  },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: "#1C3D5A",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  summaryText: {
    color: "#F5F5DC",
    fontSize: 14,
    lineHeight: 20,
  },
  graph: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 20,
    marginBottom: 20,
  },
  barWrapper: {
    width: 14,
    alignItems: "center",
    marginHorizontal: 2,
  },
  bar: {
    width: 10,
    borderRadius: 6,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
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
