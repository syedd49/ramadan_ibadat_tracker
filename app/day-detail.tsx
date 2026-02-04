import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../src/components/Screen";
import { loadAllDailyIbadat } from "../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../src/constants/ibadat";
import { useEffect, useState } from "react";

export default function DayDetailScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const all = await loadAllDailyIbadat();
      setData(all[Number(day)] || {});
    })();
  }, [day]);

  const renderItem = (item: any) => {
    const done = data?.[item.id];
    return (
      <View
        key={item.id}
        style={[
          styles.row,
          { backgroundColor: done ? "#1F7A4D" : "#7A1F1F" },
        ]}
      >
        <Text style={styles.rowText}>
          {done ? "✅" : "❌"} {item.title}
        </Text>
        <Text style={styles.score}>{item.score}</Text>
      </View>
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>📅 Day {day} Detail</Text>

        <Text style={styles.section}>🕌 Salah</Text>
        {SALAH_LIST.map(renderItem)}

        <Text style={styles.section}>🤲 Ibadat</Text>
        {IBADAT_LIST.map(renderItem)}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5F5DC",
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    color: "#A7F3D0",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowText: {
    color: "#F5F5DC",
    fontSize: 14,
  },
  score: {
    color: "#E6F0EA",
    fontSize: 14,
  },
});

