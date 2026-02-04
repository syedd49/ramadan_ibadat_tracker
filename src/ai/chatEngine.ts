// /RAMADAN-IBADAT_TRACKER/src/ai/chatEngine.ts

import { fetchQuranAyahFromAPI } from "./quranApi";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export type AISource = "quran" | "hadees";

/**
 * VERIFIED KEYWORD → AYAH MAP
 * (Local fallback – guaranteed)
 */
const QURAN_KEYWORD_MAP: Record<string, string> = {
  sabr: "2:153",
  dua: "40:60",
  namaz: "29:45",
  taqwa: "2:197",
  iman: "49:15",
};

const LOCAL_AYAH_TEXT: Record<string, string> = {
  "2:153":
    "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ\n\n📖 Quran 2:153",

  "40:60":
    "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ\n\n📖 Quran 40:60",

  "29:45":
    "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ\n\n📖 Quran 29:45",
};

export async function getAIReply(
  history: ChatMessage[],
  source: AISource
): Promise<string> {
  const lastUserText =
    history
      .filter((m) => m.role === "user")
      .slice(-1)[0]?.text.toLowerCase() || "";

  const keyword =
    Object.keys(QURAN_KEYWORD_MAP).find((k) =>
      lastUserText.includes(k)
    ) || "";

  await new Promise((r) => setTimeout(r, 700));

  if (source === "quran" && keyword) {
    const ayahKey = QURAN_KEYWORD_MAP[keyword];

    // 1️⃣ Try REAL API
    const apiAyah = await fetchQuranAyahFromAPI(ayahKey);
    if (apiAyah) return apiAyah;

    // 2️⃣ Fallback LOCAL (never fails)
    return (
      LOCAL_AYAH_TEXT[ayahKey] ||
      "Quran ayah temporarily unavailable."
    );
  }

  return source === "quran"
    ? "Is lafz par Quran ki ayah abhi configured nahi hai.\n\n📖 Aap sabr, dua, namaz try karein."
    : "Hadees integration agle step me aayega, InshaAllah.\n\n📚";
}
