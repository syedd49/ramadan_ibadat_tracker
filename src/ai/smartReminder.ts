type ReminderInput = {
  todayScore: number;
  streak: number;
  missedIbadat: string[];
};

export function getSmartReminder({
  todayScore,
  streak,
  missedIbadat,
}: ReminderInput): string {
  // 🌱 No activity today
  if (todayScore === 0 && streak === 0) {
    return "Aaj se shuru karna bhi ek ibadat hai. Allah niyyat ko dekhta hai 🤍";
  }

  // 🔥 Streak risk
  if (todayScore === 0 && streak >= 3) {
    return "Aapki streak toot sakti hai. Sirf chhoti si ibadat bhi kaafi hoti hai 🌿";
  }

  // 📿 Zikr missed
  if (missedIbadat.includes("zikr")) {
    return "Zikr thoda miss ho raha hai. Sirf 1 minute bhi kaafi hai 🌙";
  }

  // 🙏 Namaz missed
  if (missedIbadat.includes("fajr")) {
    return "Fajr se din me barkat aati hai. Kal ek nayi shuruat karein 🤍";
  }

  // ✅ Default positive reinforcement
  return "Aaj aap Allah ke kareeb rehne ki koshish kar rahe ho. Yehi kaafi hai ✨";
}
