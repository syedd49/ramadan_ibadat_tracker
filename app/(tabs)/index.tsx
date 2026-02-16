import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useMemo } from "react";

import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { getSmartReminder } from "../../src/ai/smartReminder";
import { useLang } from "../../src/context/LanguageContext";

// 🔹 Zikr AI
import { suggestZikr } from "../../src/logic/zikrAI";

function getTimeSlot() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 7) return "afterFajr";
  if (hour >= 12 && hour < 14) return "afterDhuhr";
  if (hour >= 16 && hour < 18) return "afterAsr";
  if (hour >= 18 && hour < 20) return "afterMaghrib";
  if (hour >= 20 && hour < 23) return "afterIsha";
  if (hour >= 2 && hour < 5) return "tahajjud";

  return "any";
}

export default function HomeScreen() {
  const [aiMessage, setAiMessage] = useState("");
  const { t } = useLang();

  const zikr = useMemo(() => {
    const timeSlot = getTimeSlot();
    return suggestZikr(timeSlot)[0];
  }, []);

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

      {/* 🤍 TODAY'S ZIKR */}
      {zikr && (
        <View style={styles.zikrCard}>
          <Text style={styles.zikrTitle}>🤍 Aaj ka Zikr</Text>
          <Text style={styles.zikrArabic}>{zikr.arabic}</Text>
          <Text style={styles.zikrRoman}>{zikr.roman}</Text>
          <Text style={styles.zikrMeaning}>{zikr.meaning}</Text>
        </View>
      )}

      {/* 🌙 SEHRI DUA */}
      <View style={styles.duaCard}>
        <Text style={styles.duaTitle}>🌙 Sehri Ki Dua</Text>
        <Text style={styles.duaArabic}>
          وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ
        </Text>
        <Text style={styles.duaRoman}>
          Wa bisawmi ghadin nawaiytu min shahri Ramadan
        </Text>
        <Text style={styles.duaMeaning}>
          I intend to keep the fast for tomorrow in the month of Ramadan.
        </Text>
      </View>

      {/* 🌅 IFTAR DUA */}
      <View style={styles.duaCard}>
        <Text style={styles.duaTitle}>🌅 Iftar Ki Dua</Text>
        <Text style={styles.duaArabic}>
          اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
        </Text>
        <Text style={styles.duaRoman}>
          Allahumma inni laka sumtu wa bika aamantu wa ‘alayka tawakkaltu wa ‘ala rizqika aftartu
        </Text>
        <Text style={styles.duaMeaning}>
          O Allah! I fasted for You, I believe in You, I put my trust in You, and I break my fast with Your sustenance.
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
    marginBottom: 20,
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
  zikrCard: {
    backgroundColor: "#13251C",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
  },
  zikrTitle: {
    color: "#E8F5E9",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  zikrArabic: {
    color: "#FFFFFF",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 10,
  },
  zikrRoman: {
    color: "#C8E6C9",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
  },
  zikrMeaning: {
    color: "#A5D6A7",
    fontSize: 14,
    textAlign: "center",
  },

  // 🌙 DUA STYLES
  duaCard: {
    backgroundColor: "#1A2F26",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
  },
  duaTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  duaArabic: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  duaRoman: {
    color: "#C8E6C9",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 6,
  },
  duaMeaning: {
    color: "#A5D6A7",
    fontSize: 13,
    textAlign: "center",
  },
});
