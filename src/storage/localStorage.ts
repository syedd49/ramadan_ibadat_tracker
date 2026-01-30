import AsyncStorage from "@react-native-async-storage/async-storage";

export type DailyIbadatState = Record<string, boolean>;
export type AllDailyIbadat = Record<number, DailyIbadatState>;

const STORAGE_KEY = "DAILY_IBADAT_BY_DAY";

export async function loadDailyIbadat(
  day: number
): Promise<DailyIbadatState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const data: AllDailyIbadat = raw ? JSON.parse(raw) : {};
  return data[day] ?? {};
}

export async function saveDailyIbadat(
  day: number,
  state: DailyIbadatState
): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const data: AllDailyIbadat = raw ? JSON.parse(raw) : {};
  data[day] = state;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function loadAllDailyIbadat(): Promise<AllDailyIbadat> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
