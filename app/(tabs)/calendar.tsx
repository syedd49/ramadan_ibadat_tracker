import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";

type DayScore = { day: number; score: number };

export default function CalendarTab() {
  const [days, setDays] = useState<DayScore[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();

        const result: DayScore[] = Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const state = all[day] ?? {};
          let score = 0;

          [...SALAH_LIST, ...IBADAT_LIST].forEach(it => {
            if (state[it.id]) score += it.score;
          });

          return { day, score };
        });

        setDays(result);
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ramadan Calendar 🌙</Text>

      <FlatList
        data={days}
        numColumns={5}
        keyExtractor={item => item.day.toString()}
        renderItem={({ item }) => (
          <View style={styles.dayBox}>
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1A14", padding: 16 },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  dayBox: {
    width: 62,
    height: 62,
    margin: 6,
    borderRadius: 12,
    backgroundColor: "#162922",
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  scoreText: { color: "#1F7A4D", fontSize: 12 },
});
