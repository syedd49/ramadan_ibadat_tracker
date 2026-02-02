import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "DAILY_IBADAT_DATA";

export type DailyIbadatState = Record<string, boolean>;
export type AllDailyIbadat = Record<number, DailyIbadatState>;

/**
 * Load all daily ibadat data
 */
export async function loadAllDailyIbadat(): Promise<AllDailyIbadat> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

/**
 * Save all daily ibadat data (FULL OBJECT)
 * ✅ This is the missing function causing red errors
 */
export async function saveAllDailyIbadat(
  data: AllDailyIbadat
): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

/**
 * Optional helper (safe)
 * Save single day ibadat
 */
export async function saveDailyIbadat(
  day: number,
  state: DailyIbadatState
): Promise<void> {
  const all = await loadAllDailyIbadat();
  all[day] = state;
  await saveAllDailyIbadat(all);
}
