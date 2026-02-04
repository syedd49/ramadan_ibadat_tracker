import AsyncStorage from "@react-native-async-storage/async-storage";
import { TASBEEH_DATASET } from "./tasbeehDataset";

const MIGRATION_KEY = "tasbeeh_dataset_migrated";
const TASBEEH_LIST_KEY = "tasbeeh_list";
const ACTIVE_TASBEEH_KEY = "active_tasbeeh";

export async function migrateTasbeehDatasetOnce() {
  const migrated = await AsyncStorage.getItem(MIGRATION_KEY);
  if (migrated === "true") return;

  // Save new dataset
  await AsyncStorage.setItem(
    TASBEEH_LIST_KEY,
    JSON.stringify(TASBEEH_DATASET)
  );

  // Set default active tasbeeh if none
  const active = await AsyncStorage.getItem(ACTIVE_TASBEEH_KEY);
  if (!active && TASBEEH_DATASET.length > 0) {
    await AsyncStorage.setItem(
      ACTIVE_TASBEEH_KEY,
      JSON.stringify(TASBEEH_DATASET[0])
    );
  }

  await AsyncStorage.setItem(MIGRATION_KEY, "true");
}
