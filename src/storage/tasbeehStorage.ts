import AsyncStorage from "@react-native-async-storage/async-storage";
import { appEvents, EVENTS } from "../events/appEvents";

const DAILY_KEY_PREFIX = "tasbeeh_daily_";
const TOTAL_KEY_PREFIX = "tasbeeh_total_";
const HISTORY_KEY_PREFIX = "tasbeeh_history_";

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export async function incrementTasbeeh(
  tasbeehId: string
): Promise<void> {
  const dailyKey = `${DAILY_KEY_PREFIX}${tasbeehId}`;
  const totalKey = `${TOTAL_KEY_PREFIX}${tasbeehId}`;
  const historyKey = `${HISTORY_KEY_PREFIX}${tasbeehId}`;

  const daily = Number(await AsyncStorage.getItem(dailyKey)) || 0;
  const total = Number(await AsyncStorage.getItem(totalKey)) || 0;

  const rawHistory = await AsyncStorage.getItem(historyKey);
  const history: Record<string, number> = rawHistory
    ? JSON.parse(rawHistory)
    : {};

  const today = todayDate();
  history[today] = (history[today] || 0) + 1;

  await AsyncStorage.multiSet([
    [dailyKey, String(daily + 1)],
    [totalKey, String(total + 1)],
    [historyKey, JSON.stringify(history)],
  ]);

  /* 🔔 NOTIFY STATS */
  appEvents.emit(EVENTS.STATS_UPDATED);
}

export async function getDailyTasbeeh(tasbeehId: string): Promise<number> {
  return (
    Number(
      await AsyncStorage.getItem(`${DAILY_KEY_PREFIX}${tasbeehId}`)
    ) || 0
  );
}

export async function getTotalTasbeeh(tasbeehId: string): Promise<number> {
  return (
    Number(
      await AsyncStorage.getItem(`${TOTAL_KEY_PREFIX}${tasbeehId}`)
    ) || 0
  );
}

export async function resetDailyTasbeeh(tasbeehId: string): Promise<void> {
  await AsyncStorage.setItem(
    `${DAILY_KEY_PREFIX}${tasbeehId}`,
    "0"
  );

  /* 🔔 NOTIFY STATS */
  appEvents.emit(EVENTS.STATS_UPDATED);
}

export async function getTasbeehLast7Days(
  tasbeehId: string
): Promise<Record<string, number>> {
  const raw = await AsyncStorage.getItem(
    `${HISTORY_KEY_PREFIX}${tasbeehId}`
  );
  if (!raw) return {};

  const history: Record<string, number> = JSON.parse(raw);
  const days = Object.keys(history).sort().slice(-7);

  const result: Record<string, number> = {};
  days.forEach(day => {
    result[day] = history[day];
  });

  return result;
}
