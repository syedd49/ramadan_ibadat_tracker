import AsyncStorage from "@react-native-async-storage/async-storage";

const PREF_KEY = "USER_PREFERENCES";

export type Preferences = {
  theme: "dark" | "amoled" | "light";
  haptics: boolean;
  sound: boolean;
};

export const DEFAULT_PREFS: Preferences = {
  theme: "dark",
  haptics: true,
  sound: true,
};

export async function loadPreferences(): Promise<Preferences> {
  const data = await AsyncStorage.getItem(PREF_KEY);
  return data ? JSON.parse(data) : DEFAULT_PREFS;
}

export async function savePreferences(prefs: Preferences) {
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}
