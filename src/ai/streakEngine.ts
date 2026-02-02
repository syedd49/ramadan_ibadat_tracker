import { SALAH_LIST, IBADAT_LIST } from "../constants/ibadat";

type DailyData = Record<string, boolean>;
type AllData = Record<number, DailyData>;

export function calculateStreak(
  allData: AllData,
  uptoDay: number
): number {
  let streak = 0;

  for (let d = uptoDay; d >= 1; d--) {
    const dayData = allData[d];
    if (!dayData) break;

    let hasAny = false;

    [...SALAH_LIST, ...IBADAT_LIST].forEach(i => {
      if (dayData[i.id]) hasAny = true;
    });

    if (hasAny) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
