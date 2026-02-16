import { ZIKR_LIST, Zikr } from "@/src/constants/zikr";

export type Mood =
  | "stress"
  | "anxiety"
  | "sadness"
  | "guilt"
  | "confusion"
  | "low-iman"
  | "calm";

export type TimeSlot =
  | "afterFajr"
  | "afterDhuhr"
  | "afterAsr"
  | "afterMaghrib"
  | "afterIsha"
  | "tahajjud"
  | "beforeSleep"
  | "night"
  | "any";

/**
 * Core AI function
 * - time is mandatory
 * - mood is optional
 */
export function suggestZikr(
  time: TimeSlot,
  mood?: Mood,
  limit: number = 3
): Zikr[] {
  const filtered = ZIKR_LIST.filter((zikr) => {
    const timeMatch =
      zikr.recommendedTimes?.includes(time) ||
      zikr.recommendedTimes?.includes("any");

    const moodMatch = mood
      ? zikr.mood?.includes(mood)
      : true;

    return timeMatch && moodMatch;
  });

  // fallback: agar kuch bhi match na ho
  if (filtered.length === 0) {
    return ZIKR_LIST.slice(0, limit);
  }

  return filtered.slice(0, limit);
}
