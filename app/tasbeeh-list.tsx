import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { Screen } from "../src/components/Screen";
import { getTasbeehList, setActiveTasbeeh } from "../src/tasbeeh/tasbeehStore";
import { Tasbeeh } from "../src/tasbeeh/tasbeehDataset";
import {
  getFavouriteTasbeehIds,
  toggleFavouriteTasbeeh,
} from "../src/tasbeeh/tasbeehFavorites";

export default function TasbeehList() {
  const [list, setList] = useState<Tasbeeh[]>([]);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setList(await getTasbeehList());
      setFavs(await getFavouriteTasbeehIds());
    })();
  }, []);

  const onSelect = async (t: Tasbeeh) => {
    await setActiveTasbeeh(t);
    router.back();
  };

  const onFav = async (id: string) => {
    await toggleFavouriteTasbeeh(id);
    setFavs(await getFavouriteTasbeehIds());
  };

  // ⭐ favourites first
  const sorted = [
    ...list.filter(t => favs.includes(t.id)),
    ...list.filter(t => !favs.includes(t.id)),
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {sorted.map(t => {
          const fav = favs.includes(t.id);
          return (
            <Pressable
              key={t.id}
              style={styles.card}
              onPress={() => onSelect(t)}
            >
              {/* ❤️ */}
              <Pressable
                style={styles.heart}
                onPress={() => onFav(t.id)}
              >
                <Text style={{ fontSize: 18 }}>
                  {fav ? "❤️" : "🤍"}
                </Text>
              </Pressable>

              <Text style={styles.arabic}>{t.arabic}</Text>
              <Text style={styles.roman}>{t.roman}</Text>
              <Text style={styles.urdu}>{t.urdu}</Text>
              <Text style={styles.meaning}>{t.meaning}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: "#1C3D5A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 12,
    zIndex: 10,
  },
  arabic: {
    color: "#FFFFFF",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 6,
  },
  roman: {
    color: "#A6E3C3",
    fontSize: 16,
    textAlign: "center",
  },
  urdu: {
    color: "#E0E0E0",
    fontSize: 16,
    textAlign: "center",
  },
  meaning: {
    color: "#C7D2CC",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
});
