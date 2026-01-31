import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { getRamadanDay } from "../../src/logic/date";

type DayItem = {
  day: number;
  score: number;
};

export default function CalendarTab() {
  const systemToday = getRamadanDay() ?? 1;

  const [days, setDays] = useState<DayItem[]>([]);
  const [activeDay, setActiveDay] = useState<number>(systemToday);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();

        let lastActiveDay = 0;

        const result: DayItem[] = Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const state = all[day] ?? {};
          let score = 0;

          [...SALAH_LIST, ...IBADAT_LIST].forEach(item => {
            if (state[item.id]) score += item.score;
          });

          if (score > 0) lastActiveDay = day;

          return { day, score };
        });

        setDays(result);

        // 🔑 decide highlight day
        if (lastActiveDay > 0) {
          setActiveDay(lastActiveDay);
        } else {
          setActiveDay(systemToday);
        }
      })();
    }, [])
  );

  const renderItem = ({ item }: { item: DayItem }) => {
    const isActive = item.day === activeDay;
    const isCompleted = item.score > 0;
    const isFuture = item.day > activeDay;

    return (
      <View
        style={[
          styles.dayBox,
          isActive && styles.activeBox,
          isCompleted && styles.completedBox,
          isFuture && styles.futureBox,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            isActive && styles.activeText,
            isFuture && styles.futureText,
          ]}
        >
          {item.day}
        </Text>
        <Text
          style={[
            styles.scoreText,
            isFuture && styles.futureText,
          ]}
        >
          {item.score}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ramadan Calendar 🌙</Text>

      <FlatList
        data={days}
        numColumns={5}
        keyExtractor={item => item.day.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* LEGEND */}
      <View style={styles.legend}>
        <Legend color="#1F7A4D" label="Active Day" />
        <Legend color="#162922" label="Completed" />
        <Legend color="#0B1511" label="Future" />
      </View>
    </View>
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

  /* ACTIVE (LAST TRACKED DAY) */
  activeBox: {
    backgroundColor: "#1F7A4D",
    borderWidth: 2,
    borderColor: "#A6E3C3",
  },

  /* COMPLETED */
  completedBox: {
    backgroundColor: "#162922",
  },

  /* FUTURE */
  futureBox: {
    backgroundColor: "#0B1511",
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

  activeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  futureText: {
    color: "#4B6B5F",
  },

  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
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
