import { RamadanDay } from "../constants/ramadan";

export function calculateStreakFromCalendar(days: RamadanDay[]) {
  let streak = 0;

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].completed) streak++;
    else break;
  }

  return streak;
}

export function getMissedDays(days: RamadanDay[]) {
  return days.filter((d) => !d.completed).map((d) => d.day);
}
