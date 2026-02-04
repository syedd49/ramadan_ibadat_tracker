export type Tasbeeh = {
  id: string;
  arabic: string;
  roman: string;
  urdu: string;
  meaning: string;
};

export const TASBEEH_DATASET: Tasbeeh[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    roman: "Subhanallah",
    urdu: "اللہ پاک ہے",
    meaning: "Allah is free from all imperfections",
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    roman: "Alhamdulillah",
    urdu: "تمام تعریفیں اللہ کے لیے ہیں",
    meaning: "All praise is for Allah",
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    roman: "Allahu Akbar",
    urdu: "اللہ سب سے بڑا ہے",
    meaning: "Allah is the Greatest",
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    roman: "Astaghfirullah",
    urdu: "میں اللہ سے معافی مانگتا ہوں",
    meaning: "I seek forgiveness from Allah",
  },
  {
    id: "la_ilaha_illallah",
    arabic: "لَا إِلٰهَ إِلَّا اللَّهُ",
    roman: "La ilaha illallah",
    urdu: "اللہ کے سوا کوئی معبود نہیں",
    meaning: "There is no god but Allah",
  },

  // 🔁 repeat pattern (ids unique)
  ...Array.from({ length: 45 }).map((_, i) => ({
    id: `zikr_${i + 1}`,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    roman: "Subhanallahi wa bihamdihi",
    urdu: "اللہ پاک ہے اور تمام تعریفیں اسی کے لیے ہیں",
    meaning: "Glory be to Allah and praise Him",
  })),
];
