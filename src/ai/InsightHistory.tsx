import { ScrollView, Text, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Screen } from "../../src/components/Screen";
import { loadAIInsights } from "../../src/storage/aiInsightStorage";

export default function InsightHistory() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadAIInsights().then(setItems);
  }, []);

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>AI Insight History</Text>

        {items.map((i, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.day}>Day {i.day}</Text>
            <Text style={styles.text}>{i.text}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1B2F26",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  day: { color: "#4AA3DF", fontWeight: "700" },
  text: { color: "#F5F5DC", marginTop: 6 },
});
