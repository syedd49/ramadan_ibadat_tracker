type WeeklyStats = {
  totalDays: number;
  completedDays: number;
  avgScore: number;
  mostMissed: string | null;
};

export function generateWeeklySummary(stats: WeeklyStats): string {
  if (stats.completedDays === 0) {
    return "Is hafte ibadat thodi kam rahi. Koi baat nahi — agla hafta nayi niyyat ke saath shuru karein 🤍";
  }

  if (stats.completedDays >= 5) {
    return "Is hafte aapki consistency strong rahi. Allah chhoti aur musalsal ibadat ko pasand karta hai 🌙";
  }

  if (stats.mostMissed) {
    return `Is hafte ${stats.mostMissed} thoda miss hua. Shayad chhota daily goal madad kare 🌱`;
  }

  return "Aapka effort notice ho raha hai. Isi tarah dheere dheere aage badhte rahein ✨";
}
