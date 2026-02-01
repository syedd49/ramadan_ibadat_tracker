import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "TASBEEH_HISTORY";

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

type DayTasbeeh = Record<string, number>;
type TasbeehHistory = Record<string, DayTasbeeh | number>;

async function loadHistory(): Promise<TasbeehHistory> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveHistory(data: TasbeehHistory) {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

/**
 * 🛠 Normalize old data:
 * - number -> { allahuakbar: number }
 * - object -> unchanged
 */
function normalizeDayData(
  dayData: DayTasbeeh | number
): DayTasbeeh {
  if (typeof dayData === "number") {
    return {
      allahuakbar: dayData, // default tasbeeh
    };
  }
  return dayData;
}

/** ➕ increment count for specific tasbeeh */
export async function incrementTasbeeh(
  tasbeehId: string,
  count = 1
) {
  const date = todayKey();
  const history = await loadHistory();

  // normalize existing day data if needed
  const normalized = normalizeDayData(history[date] ?? {});
  normalized[tasbeehId] =
    (normalized[tasbeehId] || 0) + count;

  history[date] = normalized;
  await saveHistory(history);
}

/** 📿 get today's count for selected tasbeeh */
export async function getTodayTasbeeh(
  tasbeehId: string
): Promise<number> {
  const history = await loadHistory();
  const dayData = history[todayKey()];

  if (!dayData) return 0;

  const normalized = normalizeDayData(dayData);
  return normalized[tasbeehId] || 0;
}

/** 📊 get full history (for stats / summary) */
export async function getTasbeehHistory(): Promise<
  Record<string, DayTasbeeh>
> {
  const history = await loadHistory();
  const normalizedHistory: Record<string, DayTasbeeh> = {};

  Object.keys(history).forEach(date => {
    normalizedHistory[date] = normalizeDayData(
      history[date]
    );
  });

  return normalizedHistory;
}
