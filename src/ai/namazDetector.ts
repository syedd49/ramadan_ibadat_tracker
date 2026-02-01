import { Namaz } from "./namazTasbeehMap";

export function detectCurrentNamaz(date = new Date()): Namaz {
  const hour = date.getHours();

  if (hour >= 4 && hour < 7) return "fajr";
  if (hour >= 12 && hour < 15) return "dhuhr";
  if (hour >= 15 && hour < 18) return "asr";
  if (hour >= 18 && hour < 20) return "maghrib";
  return "isha";
}
