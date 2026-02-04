import AsyncStorage from "@react-native-async-storage/async-storage";

const FAV_KEY = "favourite_tasbeeh_ids";

export async function getFavouriteTasbeehIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function isFavouriteTasbeeh(id: string): Promise<boolean> {
  const favs = await getFavouriteTasbeehIds();
  return favs.includes(id);
}

export async function toggleFavouriteTasbeeh(id: string): Promise<void> {
  const favs = await getFavouriteTasbeehIds();

  const updated = favs.includes(id)
    ? favs.filter(x => x !== id)
    : [...favs, id];

  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updated));
}
