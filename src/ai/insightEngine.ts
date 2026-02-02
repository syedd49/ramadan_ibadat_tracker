// src/ai/insightEngine.ts

type DailyIbadatInput = {
  day: number;
  completed: string[];
  missed: string[];
  streak: number;
};

export function generateDailyInsight(
  input: DailyIbadatInput
): string {
  const { completed, missed, streak } = input;

  let message = "";

  if (completed.length > 0) {
    message += `Aaj tumne ${completed.join(
      " aur "
    )} complete ki — yeh achhi consistency hai. `;
  }

  if (missed.length > 0) {
    message += ` ${missed.join(
      " aur "
    )} reh gayi. Kabhi kabhi routine tight ho jata hai, koi baat nahi. `;
  }

  if (streak >= 3) {
    message += ` Tumhara ${streak} din ka streak chal raha hai — isko kal bhi continue karne ki koshish karein.`;
  } else {
    message += ` Kal ek chhota goal set karte hain, bas ek ibadat pe focus.`;
  }

  return message.trim();
}
