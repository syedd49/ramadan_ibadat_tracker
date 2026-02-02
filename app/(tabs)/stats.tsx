import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { Screen } from "../../src/components/Screen";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { getTasbeehHistory } from "../../src/storage/tasbeehStorage";
import { generateWeeklySummary } from "../../src/ai/weeklySummary";

/* ---------- CONFIG ---------- */
const MAX_IBADAT_BAR = 150;
const MIN_BAR = 6;
const MAX_TASBEEH_BAR = 160;

export default function StatsTab() {
  const [ibadatScores, setIbadatScores] = useState<number[]>([]);
  const [tasbeehScores, setTasbeehScores] = useState<number[]>([]);
  const [summary, setSummary] = useState("");

  const ibadatBars = useRef<Animated.Value[]>([]).current;
  const tasbeehBars = useRef<Animated.Value[]>([]).current;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        /* ===============================
           IBADAT / SALAH GRAPH
        =============================== */
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

        const ibadatTimeline: number[] = [];
        for (let d = 1; d <= lastActiveDay; d++) {
          ibadatTimeline.push(scoreByDay[d] ?? 0);
        }

        setIbadatScores(ibadatTimeline);

        ibadatBars.length = 0;
        ibadatTimeline.forEach(() =>
          ibadatBars.push(new Animated.Value(0))
        );

        Animated.stagger(
          40,
          ibadatBars.map((anim, i) =>
            Animated.timing(anim, {
              toValue:
                ibadatTimeline[i] === 0
                  ? MIN_BAR
                  : Math.max(
                      (ibadatTimeline[i] / 100) *
                        MAX_IBADAT_BAR,
                      MIN_BAR
                    ),
              duration: 600,
              useNativeDriver: false,
            })
          )
        ).start();

        /* ===============================
           TASBEEH GRAPH (FIXED)
        =============================== */
        const tasbeehHistory =
          await getTasbeehHistory();

        const tasbeehDays = Object.keys(
          tasbeehHistory
        )
          .sort()
          .slice(-7);

        // 🔥 TOTAL per day (sum of all tasbeeh)
        const tasbeehTotals = tasbeehDays.map(
          day =>
            Object.values(
              tasbeehHistory[day]
            ).reduce((a, b) => a + b, 0)
        );

        setTasbeehScores(tasbeehTotals);

        tasbeehBars.length = 0;
        tasbeehTotals.forEach(() =>
          tasbeehBars.push(new Animated.Value(0))
        );

        Animated.stagger(
          50,
          tasbeehBars.map((anim, i) =>
            Animated.timing(anim, {
              toValue: Math.min(
                tasbeehTotals[i],
                MAX_TASBEEH_BAR
              ),
              duration: 600,
              useNativeDriver: false,
            })
          )
        ).start();

        /* ===============================
           WEEKLY SUMMARY
        =============================== */
        const last7Ibadat = ibadatTimeline.slice(
          -7
        );
        const completedDays =
          last7Ibadat.filter(v => v > 0).length;

        const avgScore =
          last7Ibadat.reduce((a, b) => a + b, 0) /
          Math.max(last7Ibadat.length, 1);

        const totalTasbeeh =
          tasbeehTotals.reduce(
            (a, b) => a + b,
            0
          );

        const text =
          generateWeeklySummary({
            totalDays: last7Ibadat.length,
            completedDays,
            avgScore,
            mostMissed: null,
          }) +
          `\n\n📿 Is hafte aapne total ${totalTasbeeh} tasbeeh padhi.`;

        setSummary(text);
      })();
    }, [])
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* SUMMARY */}
        <Text style={styles.heading}>
          Weekly Summary 🧠
        </Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {summary}
          </Text>
        </View>

        {/* IBADAT GRAPH */}
        <Text style={styles.heading}>
          Ibadat Progress
        </Text>
        <View style={styles.graph}>
          {ibadatScores.map((_, i) => (
            <View key={i} style={styles.barWrap}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height:
                      ibadatBars[i] || MIN_BAR,
                    backgroundColor:
                      ibadatScores[i] === 0
                        ? "#C0392B"
                        : "#1F7A4D",
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* TASBEEH GRAPH */}
        <Text style={styles.heading}>
          Tasbeeh (Last 7 Days) 📿
        </Text>
        <View style={styles.graph}>
          {tasbeehScores.map((v, i) => (
            <View key={i} style={styles.barWrap}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height:
                      tasbeehBars[i] || MIN_BAR,
                    backgroundColor:
                      "#2ECC71",
                  },
                ]}
              />
              <Text style={styles.smallLabel}>
                {v}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
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
    marginBottom: 24,
  },
  summaryText: {
    color: "#F5F5DC",
    fontSize: 14,
    lineHeight: 20,
  },
  graph: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  barWrap: {
    width: 14,
    alignItems: "center",
    marginHorizontal: 3,
  },
  bar: {
    width: 10,
    borderRadius: 6,
  },
  smallLabel: {
    color: "#C7D2CC",
    fontSize: 10,
    marginTop: 4,
  },
});
<ScrollView
  style={styles.container}
  contentContainerStyle={{ paddingTop: 24 }}
></ScrollView>