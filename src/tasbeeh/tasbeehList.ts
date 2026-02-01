export type Tasbeeh = {
  id: string;
  label: string;
  meaning: string;
};

export const TASBEEH_LIST: Tasbeeh[] = [
  {
    id: "subhanallah",
    label: "SubhanAllah",
    meaning: "Allah paak hai har kami se",
  },
  {
    id: "alhamdulillah",
    label: "Alhamdulillah",
    meaning: "Sab tareef Allah ke liye hai",
  },
  {
    id: "allahuakbar",
    label: "Allahu Akbar",
    meaning: "Allah sabse bada hai",
  },
  {
    id: "astaghfirullah",
    label: "Astaghfirullah",
    meaning: "Main Allah se maafi maangta hoon",
  },
  {
    id: "laillahaillallah",
    label: "La ilaha illallah",
    meaning: "Allah ke siwa koi mabood nahi",
  },
];
