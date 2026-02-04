import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tasbeeh, TASBEEH_DATASET } from "./tasbeehDataset";

const ACTIVE_TASBEEH_KEY = "active_tasbeeh";

export async function getTasbeehList(): Promise<Tasbeeh[]> {
  return TASBEEH_DATASET;
}

export async function getActiveTasbeeh(): Promise<Tasbeeh | null> {
  const raw = await AsyncStorage.getItem(ACTIVE_TASBEEH_KEY);
  return raw ? JSON.parse(raw) : TASBEEH_DATASET[0];
}

export async function setActiveTasbeeh(tasbeeh: Tasbeeh) {
  await AsyncStorage.setItem(
    ACTIVE_TASBEEH_KEY,
    JSON.stringify(tasbeeh)
  );
}
