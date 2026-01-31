import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";

export default function HomeScreen() {
  const [reflection, setReflection] = useState("");
  const [insight, setInsight] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await loadAllDailyIbadat();
        const days = Object.keys(all).map(Number);

        let completedDays = 0;
        let totalScore = 0;
        let zikrMissCount = 0;

        days.forEach(day => {
          let dayScore = 0;
          [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
            if (all[day][i.id]) {
              dayScore += i.score;
            } else if (i.id === "zikr") {
              zikrMissCount++;
            }
          });

          if (dayScore > 0) completedDays++;
          totalScore += dayScore;
        });

        // 🟢 Reflection logic
        if (completedDays === 0) {
          setReflection(
            "Aaj se shuru karna bhi ek ibadat hai. Allah niyyat ko dekhta hai 🤍"
          );
        } else if (completedDays >= 5) {
          setReflection(
            "Aap consistency bana rahe ho — Allah chhoti ibadat ko bhi pasand karta hai 🌙"
          );
        } else {
          setReflection(
            "Kabhi rukna failure nahi hota. Wapas uthna hi asal kamyabi hai ✨"
          );
        }

        // 🔵 Insight logic
        if (zikrMissCount > completedDays) {
          setInsight(
            "Zikr thoda miss ho raha hai. Kya roz sirf 1 minute se shuru karein?"
          );
        } else {
          setInsight(
            "Aapka overall progress balanced lag raha hai. Is rhythm ko barkarar rakhein."
          );
        }
      })();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Assalamu Alaikum 🌙</Text>
      <Text style={styles.subHeading}>
        Aaj ki ibadat ka safar yahin se shuru hota hai
      </Text>

      {/* 🟢 AI REFLECTION */}
      <View style={styles.cardGreen}>
        <Text style={styles.cardTitle}>AI Reflection</Text>
        <Text style={styles.cardText}>{reflection}</Text>
      </View>

      {/* 🔵 AI INSIGHT */}
      <View style={styles.cardBlue}>
        <Text style={styles.cardTitle}>AI Insight</Text>
        <Text style={styles.cardText}>{insight}</Text>
      </View>

      {/* 🟣 AI COMING SOON */}
      <View style={styles.cardPurple}>
        <Text style={styles.cardTitle}>Ask AI</Text>
        <Text style={styles.cardText}>
          Personal guidance & motivation (Coming Soon)
        </Text>
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

  cardGreen: {
    backgroundColor: "#1F7A4D",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
  },
  cardBlue: {
    backgroundColor: "#1C3D5A",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
  },
  cardPurple: {
    backgroundColor: "#3A2A4D",
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
