import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ZIKR_STATS";

export type ZikrStatRecord = {
  count: number;
  moods: string[];
};

export type ZikrStatsMap = {
  [zikrId: string]: ZikrStatRecord;
};

/**
 * Call when user recites a zikr
 */
export async function recordZikrRecitation(
  zikrId: string,
  mood?: string
) {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const data: ZikrStatsMap = raw ? JSON.parse(raw) : {};

  if (!data[zikrId]) {
    data[zikrId] = {
      count: 0,
      moods: [],
    };
  }

  data[zikrId].count += 1;

  if (mood) {
    data[zikrId].moods.push(mood);
  }

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

/**
 * Read-only stats
 */
export async function getAllZikrStats(): Promise<ZikrStatsMap> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

/**
 * Reset (optional, Ramadan reset)
 */
export async function resetZikrStats() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
