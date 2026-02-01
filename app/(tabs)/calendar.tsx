import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { useDay } from "../../src/context/DayContext";

type DayItem = {
  day: number;
  score: number;
};

const NUM_COLUMNS = 5;

export default function CalendarTab() {
  const { selectedDay } = useDay();
  const [days, setDays] = useState<DayItem[]>([]);
  const listRef = useRef<FlatList<DayItem>>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();

        const result: DayItem[] = Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const state = all[day] ?? {};
          let score = 0;

          [...SALAH_LIST, ...IBADAT_LIST].forEach(item => {
            if (state[item.id]) score += item.score;
          });

          return { day, score };
        });

        setDays(result);
      })();
    }, [])
  );

  // ✅ CORRECT SCROLL FOR numColumns
  useEffect(() => {
    if (!listRef.current) return;
    if (days.length === 0) return;

    const maxRowIndex = Math.ceil(days.length / NUM_COLUMNS) - 1;
    const targetRow = Math.floor((selectedDay - 1) / NUM_COLUMNS);

    if (targetRow < 0 || targetRow > maxRowIndex) return;

    listRef.current.scrollToIndex({
      index: targetRow,
      animated: true,
    });
  }, [selectedDay, days]);

  const renderItem = ({ item }: { item: DayItem }) => {
    const isActive = item.day === selectedDay;

    return (
      <View style={[styles.dayBox, isActive && styles.activeBox]}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.scoreText}>{item.score}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ramadan Calendar 🌙</Text>

      <FlatList
        ref={listRef}
        data={days}
        numColumns={NUM_COLUMNS}
        keyExtractor={item => item.day.toString()}
        renderItem={renderItem}
        onScrollToIndexFailed={() => {
          // Safe fallback, no crash
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1A14",
    padding: 16,
  },
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
    borderRadius: 14,
    backgroundColor: "#162922",
    justifyContent: "center",
    alignItems: "center",
  },
  activeBox: {
    backgroundColor: "#1F7A4D",
    borderWidth: 2,
    borderColor: "#A6E3C3",
  },
  dayText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scoreText: {
    color: "#C7D2CC",
    fontSize: 12,
  },
});
