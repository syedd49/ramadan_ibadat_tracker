import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { Screen } from "../../src/components/Screen";
import { loadAllDailyIbadat } from "../../src/storage/localStorage";
import {
  getTasbeehLast7Days,
  getDailyTasbeeh,
} from "../../src/storage/tasbeehStorage";
import { getActiveTasbeeh } from "../../src/tasbeeh/tasbeehStore";
import { SALAH_LIST, IBADAT_LIST } from "../../src/constants/ibadat";
import { appEvents, EVENTS } from "../../src/events/appEvents";

/* ---------- CONFIG ---------- */
const MAX_IBADAT_BAR = 150;
const MIN_BAR = 6;
const MAX_TASBEEH_BAR = 160;
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/* ---------- DAILY DUAS ---------- */
const DAILY_DUAS = [
   { arabic: "رَبِّ زِدْنِي عِلْمًا", urdu: "اے میرے رب! میرے علم میں اضافہ فرما", roman: "Rabbi zidni ilma" },
  { arabic: "اللّهُمَّ اغْفِرْ لِي", urdu: "اے اللہ! مجھے بخش دے", roman: "Allahumma ghfir li" },
  { arabic: "اللّهُمَّ ارْحَمْنِي", urdu: "اے اللہ! مجھ پر رحم فرما", roman: "Allahummar hamni" },
  { arabic: "رَبَّنَا تَقَبَّلْ مِنَّا", urdu: "اے ہمارے رب! ہم سے قبول فرما", roman: "Rabbana taqabbal minna" },
  { arabic: "اللّهُمَّ اهْدِنِي", urdu: "اے اللہ! مجھے ہدایت دے", roman: "Allahumma ihdini" },
  { arabic: "حَسْبِيَ اللَّهُ", urdu: "اللہ مجھے کافی ہے", roman: "Hasbiyallahu" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", urdu: "اے میرے رب! میرا سینہ کھول دے", roman: "Rabbi ishrah li sadri" },
  { arabic: "اللّهُمَّ صَلِّ عَلَىٰ مُحَمَّد", urdu: "اے اللہ! محمد ﷺ پر درود بھیج", roman: "Allahumma salli ala Muhammad" },
  { arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ", urdu: "اے میرے رب! مجھے اور میرے والدین کو بخش دے", roman: "Rabbi ghfir li waliwalidayya" },
  { arabic: "اللّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ", urdu: "اے اللہ! میں تجھ سے جنت مانگتا ہوں", roman: "Allahumma inni as'alukal jannah" },

  { arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا", urdu: "اے ہمارے رب! ہمارے دل ٹیڑھے نہ کر", roman: "Rabbana la tuzigh qulubana" },
  { arabic: "اللّهُمَّ بَارِكْ لِي", urdu: "اے اللہ! مجھے برکت دے", roman: "Allahumma barik li" },
  { arabic: "رَبِّ نَجِّنِي", urdu: "اے میرے رب! مجھے نجات دے", roman: "Rabbi najjini" },
  { arabic: "اللّهُمَّ طَهِّرْ قَلْبِي", urdu: "اے اللہ! میرے دل کو پاک کر", roman: "Allahumma tahhir qalbi" },
  { arabic: "رَبِّ أَعُوذُ بِكَ", urdu: "اے میرے رب! میں تیری پناہ مانگتا ہوں", roman: "Rabbi a'udhu bika" },

  { arabic: "اللّهُمَّ ارْزُقْنِي", urdu: "اے اللہ! مجھے رزق عطا فرما", roman: "Allahumma urzuqni" },
  { arabic: "رَبِّ اجْعَلْنِي صَالِحًا", urdu: "اے میرے رب! مجھے نیک بنا دے", roman: "Rabbi ij'alni salihan" },
  { arabic: "اللّهُمَّ لَا تَكِلْنِي", urdu: "اے اللہ! مجھے میرے حال پر نہ چھوڑ", roman: "Allahumma la takilni" },
  { arabic: "رَبِّ زِدْنِي إِيمَانًا", urdu: "اے میرے رب! میرے ایمان میں اضافہ فرما", roman: "Rabbi zidni imanan" },
  { arabic: "اللّهُمَّ اشْفِنِي", urdu: "اے اللہ! مجھے شفا دے", roman: "Allahumma ishfini" },

  { arabic: "رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ", urdu: "اے میرے رب! مجھے سچائی کے ساتھ داخل کر", roman: "Rabbi adkhilni mudkhala sidq" },
  { arabic: "اللّهُمَّ قَوِّنِي", urdu: "اے اللہ! مجھے طاقت دے", roman: "Allahumma qawwini" },
  { arabic: "رَبِّ هَبْ لِي حُكْمًا", urdu: "اے میرے رب! مجھے دانائی دے", roman: "Rabbi hab li hukman" },
  { arabic: "اللّهُمَّ اسْتُرْنِي", urdu: "اے اللہ! میری پردہ پوشی فرما", roman: "Allahumma usturni" },
  { arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ", urdu: "اے میرے رب! مجھے نماز قائم کرنے والا بنا", roman: "Rabbi ij'alni muqeemas salah" },

  { arabic: "اللّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ", urdu: "اے اللہ! تمام مومنوں کو بخش دے", roman: "Allahumma ghfir lil momineen" },
  { arabic: "رَبِّ زِدْنِي قُرْبًا", urdu: "اے میرے رب! مجھے اپنا قرب عطا فرما", roman: "Rabbi zidni qurban" },
  { arabic: "اللّهُمَّ تَقَبَّلْ صِيَامِي", urdu: "اے اللہ! میرا روزہ قبول فرما", roman: "Allahumma taqabbal siyami" },
  { arabic: "رَبِّ أَصْلِحْ لِي شَأْنِي كُلَّهُ", urdu: "اے میرے رب! میرا ہر معاملہ درست فرما", roman: "Rabbi aslih li sha'ni kullahu" },
];

/* ---------- AI MOTIVATION ---------- */
function generateDailyMotivation(
  completed: number,
  total: number,
  tasbeehToday: number
): string {
  if (completed === total && tasbeehToday > 0) {
    return "🌟 Aaj aapne apni ibadat ko kamal tak pahunchaya. Allah aapki mehnat qubool farmaye.";
  }
  if (completed >= total / 2) {
    return "🤍 Aaj ka din Allah ki yaad me guzra. Thodi aur koshish aapko aur qareeb le jaayegi.";
  }
  if (tasbeehToday > 0) {
    return "📿 Zikr ka ek lafz bhi zaya nahi jaata. Chhoti ibadat bhi Allah ke yahan badi hoti hai.";
  }
  return "🌙 Har din naya mauqa hota hai Allah ki taraf lautne ka. Aaj se ek chhota qadam uthaiye.";
}

export default function StatsTab() {
  const [ibadatScores, setIbadatScores] = useState<number[]>([]);
  const [ibadatLabels, setIbadatLabels] = useState<string[]>([]);
  const [tasbeehScores, setTasbeehScores] = useState<number[]>([]);
  const [tasbeehLabels, setTasbeehLabels] = useState<string[]>([]);
  const [summary, setSummary] = useState("");

  const ibadatBars = useRef<Animated.Value[]>([]).current;
  const tasbeehBars = useRef<Animated.Value[]>([]).current;

  /* ===============================
     LOAD STATS (EVENT + FOCUS)
  =============================== */
  const loadStats = async () => {
    /* ---------- IBADAT ---------- */
    const all = await loadAllDailyIbadat();
    const days = Object.keys(all).map(Number).sort((a, b) => a - b);

    let lastActiveDay = 0;
    const scoreByDay: Record<number, number> = {};

    days.forEach(day => {
      let total = 0;
      [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
        if (all[day]?.[i.id]) total += i.score;
      });
      scoreByDay[day] = total;
      if (total > 0) lastActiveDay = Math.max(lastActiveDay, day);
    });

    let completed = 0;
    [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
      if (all[lastActiveDay]?.[i.id]) completed++;
    });

    const timeline: number[] = [];
    for (let d = 1; d <= lastActiveDay; d++) {
      timeline.push(scoreByDay[d] ?? 0);
    }

    setIbadatScores(timeline);

    const today = new Date();
    setIbadatLabels(
      timeline.map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (timeline.length - 1 - i));
        return `${WEEKDAYS[date.getDay()]}\n${date.getDate()}`;
      })
    );

    /* ---------- TASBEEH ---------- */
    const active = await getActiveTasbeeh();
    if (!active) return;

    const history = await getTasbeehLast7Days(active.id);
    const daysList = Object.keys(history);
    const totals = daysList.map(d => history[d]);

    setTasbeehScores(totals);
    setTasbeehLabels(
      daysList.map(d => {
        const date = new Date(d);
        return `${WEEKDAYS[date.getDay()]}\n${date.getDate()}`;
      })
    );

    /* ---------- DAILY SUMMARY ---------- */
    const todayTasbeeh = await getDailyTasbeeh(active.id);
    const dua =
      DAILY_DUAS[Math.min(days.length, DAILY_DUAS.length - 1)];

    const motivation = generateDailyMotivation(
      completed,
      SALAH_LIST.length + IBADAT_LIST.length,
      todayTasbeeh
    );

    setSummary(
        `🕌 Ibadat completed: ${completed}/${SALAH_LIST.length + IBADAT_LIST.length}\n` +
        `📿 Tasbeeh today: ${todayTasbeeh}\n\n` +
        `🤲 Aaj ki Dua\n\n${dua.arabic}\n${dua.urdu}\n${dua.roman}\n\n` +
        `💡 Aaj ka Paighaam\n\n${motivation}`
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadStats(); // when tab opens

      const off = appEvents.on(
        EVENTS.STATS_UPDATED,
        loadStats
      );

      return () => off();
    }, [])
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Daily Summary 🌙</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        <Text style={styles.heading}>Ibadat Progress</Text>
        <View style={styles.graph}>
          {ibadatScores.map((_, i) => (
            <View key={i} style={styles.barWrap}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: Math.max(
                      (ibadatScores[i] / 100) * MAX_IBADAT_BAR,
                      MIN_BAR
                    ),
                    backgroundColor:
                      ibadatScores[i] === 0 ? "#C0392B" : "#1F7A4D",
                  },
                ]}
              />
              <Text style={styles.smallLabel}>{ibadatLabels[i]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Tasbeeh (Last 7 Days) 📿</Text>
        <View style={styles.graph}>
          {tasbeehScores.map((_, i) => (
            <View key={i} style={styles.barWrap}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: Math.min(
                      tasbeehScores[i],
                      MAX_TASBEEH_BAR
                    ),
                    backgroundColor: "#2ECC71",
                  },
                ]}
              />
              <Text style={styles.smallLabel}>
                {tasbeehLabels[i]}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: "#1C3D5A",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryText: {
    color: "#F5F5DC",
    fontSize: 14,
    lineHeight: 22,
  },
  graph: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  barWrap: {
    width: 14,
    alignItems: "center",
    marginHorizontal: 3,
  },
  bar: {
    width: 10,
    borderRadius: 6,
  },
  smallLabel: {
    color: "#C7D2CC",
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
    lineHeight: 12,
  },
});
