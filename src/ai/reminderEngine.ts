export function getSmartReminder({
  todayScore,
  currentStreak,
  missedIbadat,
}: {
  todayScore: number;
  currentStreak: number;
  missedIbadat: string[];
}) {
  if (todayScore === 0 && currentStreak >= 3) {
    return "Aaj streak toot sakti hai. Chhoti ibadat bhi kaafi hoti hai 🤍";
  }

  if (missedIbadat.includes("zikr")) {
    return "Zikr thoda miss ho raha hai. Sirf 1 minute bhi kaafi hai 🌿";
  }

  return "Aaj ka din Allah ke saath guzarne ka ek aur mauka hai 🌙";
}
