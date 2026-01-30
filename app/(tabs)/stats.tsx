import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Svg, { Rect } from "react-native-svg";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";

export default function StatsTab() {
  const [scores, setScores] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();
        const days = Object.keys(all).map(Number).sort((a, b) => a - b);

        const dailyScores = days.map(day => {
          let total = 0;
          [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
            if (all[day][i.id]) total += i.score;
          });
          return total;
        });

        // streak from last day
        let s = 0;
        for (let i = dailyScores.length - 1; i >= 0; i--) {
          if (dailyScores[i] > 0) s++;
          else break;
        }

        setScores(dailyScores);
        setStreak(s);
      })();
    }, [])
  );

  const max = Math.max(...scores, 100);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Progress</Text>
      <Text style={styles.streak}>🔥 Current Streak: {streak} days</Text>

      <Svg height={160} width="100%">
        {scores.map((s, i) => (
          <Rect
            key={i}
            x={i * 12}
            y={160 - (s / max) * 140}
            width={10}
            height={(s / max) * 140}
            fill="#1F7A4D"
          />
        ))}
      </Svg>

      <Text style={styles.caption}>Daily Score Graph</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1A14", padding: 20 },
  heading: { color: "#F5F5DC", fontSize: 22, fontWeight: "bold" },
  streak: { color: "#1F7A4D", fontSize: 18, marginVertical: 10 },
  caption: { color: "#C7D2CC", textAlign: "center", marginTop: 8 },
});
