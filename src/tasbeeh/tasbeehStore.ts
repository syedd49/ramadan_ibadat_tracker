import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tasbeeh } from "./tasbeehList";

const KEY = "ACTIVE_TASBEEH";

export async function setActiveTasbeeh(tasbeeh: Tasbeeh) {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasbeeh));
}

export async function getActiveTasbeeh(): Promise<Tasbeeh> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);

  // default
  return {
    id: "allahuakbar",
    label: "Allahu Akbar",
    meaning: "Allah sabse bada hai",
  };
}
