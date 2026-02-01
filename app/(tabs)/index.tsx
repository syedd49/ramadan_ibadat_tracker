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
        const days = Object.keys(all)
          .map(Number)
          .sort((a, b) => a - b);

        let todayScore = 0;
        let streak = 0;
        let missedIbadat: string[] = [];

        // Latest active day
        const latestDay = days[days.length - 1];
        const todayState = all[latestDay] ?? {};

        [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
          if (todayState[i.id]) {
            todayScore += i.score;
          } else {
            missedIbadat.push(i.id);
          }
        });

        // Streak calculation
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
    <ScrollView
  style={styles.container}
  contentContainerStyle={{ paddingTop: 24 }}
>
      <Text style={styles.heading}>Assalamu Alaikum 🌙</Text>

      <Text style={styles.subHeading}>
        Aaj ki ibadat ka safar yahin se shuru hota hai
      </Text>

      {/* 🔔 AI SMART REMINDER */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Smart Reminder</Text>
        <Text style={styles.cardText}>{aiMessage}</Text>
      </View>

      {/* 🕊️ DEENI NOTE */}
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Note 🤍</Text>

        <Text style={styles.noteText}>
          Yeh app sirf aapko ibadat ki taraf motivate aur
          yaad-dihani ke liye hai.
        </Text>

        <Text style={styles.noteText}>
          Beshak ALLAH hi hamari ibadaton ko qubool
          farmane wale hain. ALLAH PAAK numbers ko
          nahi, balki aapki Niyyat, Ikhlas aur Koshish
          ko dekh kar ajar ata farmata hain.
        </Text>

        <Text style={styles.noteText}>
          ALLAH TA’ALA aapki har jayez Dua, Zikr,
          Qur’an, Namaz, Sadqa aur Roza qubool
          farmaye, aur is chhoti si koshish ko aapke
          liye sadaqah-e-jariyah bana de.
        </Text>

        <Text style={styles.ameen}>Aameen 🤲</Text>
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

  /* AI Card */
  card: {
    backgroundColor: "#1F7A4D",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
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

  /* Note Card */
  noteCard: {
    backgroundColor: "#162922",
    padding: 18,
    borderRadius: 16,
  },
  noteTitle: {
    color: "#F5F5DC",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noteText: {
    color: "#C7D2CC",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  ameen: {
    color: "#1F7A4D",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 6,
  },
});
