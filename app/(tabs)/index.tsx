import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { getSmartReminder } from "../../src/ai/smartReminder";
import { useLang } from "../../src/context/LanguageContext";

export default function HomeScreen() {
  const [aiMessage, setAiMessage] = useState("");
  const { t } = useLang(); // ✅ language hook

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

        const latestDay = days[days.length - 1];
        const todayState = all[latestDay] ?? {};

        [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
          if (todayState[i.id]) {
            todayScore += i.score;
          } else {
            missedIbadat.push(i.id);
          }
        });

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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 24 }}>
      {/* 🔹 Translated Text */}
      <Text style={styles.heading}>{t("home_greeting")}</Text>

      <Text style={styles.subHeading}>
        {t("home_subtitle")}
      </Text>

      {/* 🔔 AI SMART REMINDER */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t("ai_reminder")}
        </Text>
        <Text style={styles.cardText}>{aiMessage}</Text>
      </View>

      {/* 🕊️ NOTE */}
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>
          {t("note_title")} 🤍
        </Text>

        <Text style={styles.noteText}>
          {t("note_line_1")}
        </Text>

        <Text style={styles.noteText}>
          {t("note_line_2")}
        </Text>

        <Text style={styles.noteText}>
          {t("note_line_3")}
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
