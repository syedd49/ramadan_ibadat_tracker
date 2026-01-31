export function generateWeeklySummary(stats: {
  daysCompleted: number;
  avgScore: number;
  mostMissed: string;
}) {
  if (stats.daysCompleted === 0) {
    return "Is hafte ibadat thodi kam rahi. Agla hafta nayi niyyat ke saath shuru karein 🤍";
  }

  return `Is hafte aapne ${stats.daysCompleted} din ibadat ki. ${
    stats.mostMissed
  } thoda miss raha. Chhota goal rakhna madad karega 🌱`;
}
