import { RamadanDay } from "../constants/ramadan";

export function generateRamadanReport(
  calendar: RamadanDay[],
  scores: Record<number, number>
) {
  const completedDays = calendar.filter(d => d.completed).length;
  const missedDays = calendar.length - completedDays;

  const values = Object.values(scores);
  const avgScore =
    values.reduce((a, b) => a + b, 0) / (values.length || 1);

  return {
    completedDays,
    missedDays,
    avgScore: Math.round(avgScore),
    reflection:
      completedDays >= 20
        ? "MashaAllah 🌙 You stayed committed through Ramadan. Carry this spirit forward."
        : "Ramadan is about return, not perfection. Take what you gained and keep going 🤲",
  };
}
