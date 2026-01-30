export function generateRamadanInsight(
  streak: number,
  missedDays: number[],
  averageScore: number
) {
  if (streak >= 7)
    return `MashaAllah 🌙 You are consistent for ${streak} days straight. This is how habits are built.`;

  if (missedDays.length > 5)
    return "You’ve missed a few days, but Ramadan is about return, not perfection 🤲 Start again today.";

  if (averageScore >= 80)
    return "Strong effort overall. You are maintaining quality ibadat, not just ticking boxes.";

  if (averageScore < 40)
    return "Start small. One Salah on time today can change the whole direction.";

  return "Consistency beats intensity. Stay present, stay sincere 🌱";
}
