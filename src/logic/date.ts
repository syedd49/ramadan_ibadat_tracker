const RAMADAN_DAYS = 30;

/**
 * Returns day number (1–30) based on start date
 */
export function calculateRamadanDay(
  startDate: string
): number {
  const start = new Date(startDate);
  const today = new Date();

  const diff =
    Math.floor(
      (today.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  if (diff < 1) return 1;
  if (diff > RAMADAN_DAYS) return RAMADAN_DAYS;
  return diff;
}
