import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { getSmartReminder } from "../../src/ai/smartReminder";

export default function HomeScreen() {
  const [aiMessage, setAiMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();
        const days = Object.keys(all).map(Number).sort((a, b) => a - b);

        let todayScore = 0;
        let streak = 0;
        let missedIbadat: string[] = [];

        // Calculate today score (last active day)
        const latestDay = days[days.length - 1];
        const todayState = all[latestDay] ?? {};

        [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
          if (todayState[i.id]) {
            todayScore += i.score;
          } else {
            missedIbadat.push(i.id);
          }
        });

        // Calculate streak
        for (let i = days.length - 1; i >= 0; i--) {
          const day = days[i];
          let score = 0;

          [...SALAH_LIST, ...IBADAT_LIST].forEach(it => {
            if (all[day]?.[it.id]) score += it.score;
          });

          if (score > 0) streak++;
          else break;
        }

        const message = getSmartReminder({
          todayScore,
          streak,
          missedIbadat,
        });

        setAiMessage(message);
      })();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Assalamu Alaikum 🌙</Text>
      <Text style={styles.subHeading}>
        Aaj ki ibadat ka safar yahin se shuru hota hai
      </Text>

      {/* 🔔 AI SMART REMINDER */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Smart Reminder</Text>
        <Text style={styles.cardText}>{aiMessage}</Text>
      </View>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeading: {
    color: "#C7D2CC",
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1F7A4D",
    padding: 18,
    borderRadius: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardText: {
    color: "#F5F5DC",
    fontSize: 14,
    lineHeight: 20,
  },
});
