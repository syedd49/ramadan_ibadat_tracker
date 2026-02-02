export function generateWeeklyInsight(params: {
  totalDays: number;
  activeDays: number;
  bestDay?: number;
}) {
  const { totalDays, activeDays, bestDay } = params;

  let msg = `Is haftay tum ${activeDays}/${totalDays} din active rahe. `;

  if (activeDays >= 5) {
    msg += "Yeh strong consistency ka sign hai. ";
  } else {
    msg += "Thoda aur rhythm banane ki gunjaish hai. ";
  }

  if (bestDay) {
    msg += `Tumhara sabse behtar din day ${bestDay} raha.`;
  }

  return msg;
}
