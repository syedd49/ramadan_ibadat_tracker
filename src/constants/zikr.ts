export type Zikr = {
  id: string;
  arabic: string;
  roman: string;
  urdu: string;
  meaning: string;
  tags?: string[];
  mood?: string[];
  recommendedTimes?: string[];
};

export const ZIKR_LIST: Zikr[] = [
  {
    id: "ya_hayy_ya_qayyum",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    roman: "Ya Hayyu Ya Qayyum bi rahmatika astagheeth",
    urdu: "اے زندہ، اے قائم! میں تیری رحمت سے مدد مانگتا ہوں",
    meaning: "O Ever-Living, Sustainer, I seek help through Your mercy",
    tags: ["help", "tawakkul"],
    mood: ["stress", "anxiety"],
    recommendedTimes: ["afterFajr", "afterIsha", "tahajjud"],
  },
  {
    id: "rabbi_inni_zalamtu",
    arabic: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي",
    roman: "Rabbi inni zalamtu nafsi",
    urdu: "اے میرے رب! میں نے اپنے نفس پر ظلم کیا",
    meaning: "My Lord, I have wronged myself",
    tags: ["tawbah"],
    mood: ["guilt"],
    recommendedTimes: ["afterIsha", "tahajjud"],
  },
  {
    id: "allahumma_rahmataka_arju",
    arabic: "ٱللَّٰهُمَّ رَحْمَتَكَ أَرْجُو",
    roman: "Allahumma rahmataka arju",
    urdu: "اے اللہ! میں تیری رحمت کی امید رکھتا ہوں",
    meaning: "O Allah, I hope for Your mercy",
    tags: ["hope"],
    mood: ["sadness"],
    recommendedTimes: ["night", "any"],
  },
];
