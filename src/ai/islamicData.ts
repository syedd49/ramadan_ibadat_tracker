export type IslamicContent = {
  ayah?: {
    arabic: string;
    meaning: string;
    ref: string;
  };
  hadith?: {
    text: string;
    ref: string;
  };
  tafseer: string;
};

export const ISLAMIC_LIBRARY: Record<string, IslamicContent[]> = {
  missed: [
    {
      ayah: {
        arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
        meaning:
          "Keh do: Aey mere bandon jinhone apne upar zyadti ki, Allah ki rehmat se mayoos na ho.",
        ref: "Surah Az-Zumar 39:53",
      },
      tafseer:
        "Allah yahan seedha bandon se baat kar raha hai — ghalti ke baad bhi darwaza band nahi hota.",
    },
  ],

  tired: [
    {
      hadith: {
        text:
          "Deen me wo amal sabse zyada pasandida hai jo chhota ho magar lagataar ho.",
        ref: "Sahih Bukhari",
      },
      tafseer:
        "Islam pressure nahi dalta. Thoda-thoda, magar musalsal amal hi asal kamyabi hai.",
    },
  ],

  dua: [
    {
      ayah: {
        arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
        meaning:
          "Aur tumhara Rab kehta hai: Mujhe pukaro, main tumhari dua qubool karunga.",
        ref: "Surah Ghafir 40:60",
      },
      tafseer:
        "Dua ibadat ka markaz hai — qubooliyat ka waqt aur tareeqa Allah ke ilm me hota hai.",
    },
  ],

  default: [
    {
      tafseer:
        "Allah niyyat ko dekhta hai. Aap jo koshish kar rahe ho, wahi ibadat ka asal roop hai.",
    },
  ],
};
