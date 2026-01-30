import { IBADAT_LIST } from "../constants/ibadat";

const RAMADAN_TOTAL_DAYS = 30;

/**
 * Safe Ramadan start for dev & prod testing
 * (App works any day of year)
 */
const today = new Date();
const RAMADAN_START = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

/**
 * Returns Ramadan day number (1–30) or null
 */
export function getRamadanDay(): number | null {
  const now = new Date();
  const diff =
    Math.floor(
      (now.getTime() - RAMADAN_START.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  if (diff < 1 || diff > RAMADAN_TOTAL_DAYS) return null;
  return diff;
}

/**
 * Always returns [1..30]
 */
export function getRamadanDays(): number[] {
  return Array.from({ length: RAMADAN_TOTAL_DAYS }, (_, i) => i + 1);
}

/**
 * TRUE only if ALL ibadat are explicitly true
 */
export function isDayComplete(dayData: {
  [ibadatId: string]: boolean;
}): boolean {
  return IBADAT_LIST.every(
    (i) => dayData[i.id] === true
  );
}

/**
 * A day is editable ONLY if it is today
 */
export function canEditDay(
  day: number,
  today: number | null
): boolean {
  if (!today) return false;
  return day === today;
}
