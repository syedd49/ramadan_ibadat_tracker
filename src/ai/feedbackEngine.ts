import { getTasbeehHistory } from "../storage/tasbeehStorage";
import { loadAllDailyIbadat } from "../storage/localStorage";
import { SALAH_LIST } from "../constants/ibadat";

export async function getAIFeedback(): Promise<
  string | null
> {
  const tasbeehHistory =
    await getTasbeehHistory();
  const ibadat =
    await loadAllDailyIbadat();

  /* ===============================
     TASBEEH AVERAGE (FIXED)
  =============================== */
  const tasbeehDays = Object.keys(
    tasbeehHistory
  ).slice(-7);

  const dailyTotals = tasbeehDays.map(
    day =>
      Object.values(
        tasbeehHistory[day]
      ).reduce((a, b) => a + b, 0)
  );

  const tasbeehAvg =
    dailyTotals.reduce((a, b) => a + b, 0) /
    Math.max(dailyTotals.length, 1);

  /* ===============================
     NAMAZ CONSISTENCY
  =============================== */
  let namazDays = 0;

  Object.values(ibadat)
    .slice(-7)
    .forEach(day => {
      const prayed = SALAH_LIST.some(
        s => day?.[s.id]
      );
      if (prayed) namazDays++;
    });

  if (tasbeehAvg > 100 && namazDays < 4) {
    return (
      "📿 Aapka zikr mashAllah strong hai.\n" +
      "🕌 Ab namaz ki consistency par thoda focus karein — dono ka balance ibadat ko mukammal karta hai 🤍"
    );
  }

  return null;
}
