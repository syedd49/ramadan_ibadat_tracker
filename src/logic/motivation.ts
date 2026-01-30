export function getMotivation(score: number, streak: number) {
  if (score === 100)
    return "MashaAllah! A perfect day of worship 🌙";

  if (score >= 70)
    return "Great consistency! Stay strong till Isha 🤍";

  if (streak >= 5)
    return `Amazing! ${streak}-day streak — don’t break it today 🔥`;

  if (score === 0)
    return "A new day, a new chance. Start with one Salah 🤲";

  return "Small steps matter. One ibadat at a time 🌱";
}
