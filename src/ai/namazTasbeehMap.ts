export type Namaz =
  | "fajr"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";

export const NAMAZ_TASBEEH_MAP: Record<
  Namaz,
  {
    tasbeeh: string;
    reason: string;
  }
> = {
  fajr: {
    tasbeeh: "SubhanAllah",
    reason:
      "Din ki shuruaat Allah ki paaki bayaan karne se hoti hai.",
  },
  dhuhr: {
    tasbeeh: "Alhamdulillah",
    reason:
      "Rozmarra ki masroofiyat ke baad shukr ka izhar zaroori hota hai.",
  },
  asr: {
    tasbeeh: "Astaghfirullah",
    reason:
      "Asr ke baad apne aamal ka jaiza lena behtar hota hai.",
  },
  maghrib: {
    tasbeeh: "SubhanAllah",
    reason:
      "Din ke ikhtitam par khamosh tasbeeh dil ko sukoon deti hai.",
  },
  isha: {
    tasbeeh: "Allahu Akbar",
    reason:
      "Raat ke waqt Allah ki azmat ka ehsaas tawakkul paida karta hai.",
  },
};
