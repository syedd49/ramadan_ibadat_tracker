import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";

import { Screen } from "../../src/components/Screen";
import {
  incrementTasbeeh,
  getDailyTasbeeh,
  getTotalTasbeeh,
  resetDailyTasbeeh,
} from "../../src/storage/tasbeehStorage";
import { getActiveTasbeeh } from "../../src/tasbeeh/tasbeehStore";
import {
  isFavouriteTasbeeh,
} from "../../src/tasbeeh/tasbeehFavorites";
import type { Tasbeeh } from "../../src/tasbeeh/tasbeehDataset";

export default function TasbeehScreen() {
  const [tasbeeh, setTasbeeh] = useState<Tasbeeh | null>(null);
  const [daily, setDaily] = useState(0);
  const [total, setTotal] = useState(0);
  const [isFav, setIsFav] = useState(false);

  /* ===============================
     LOAD ACTIVE TASBEEH
  =============================== */
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const active = await getActiveTasbeeh();
        if (!active) return;

        setTasbeeh(active);
        setDaily(await getDailyTasbeeh(active.id));
        setTotal(await getTotalTasbeeh(active.id));
        setIsFav(await isFavouriteTasbeeh(active.id));
      })();
    }, [])
  );

  /* ===============================
     INCREMENT
  =============================== */
  const onPlus = async () => {
    if (!tasbeeh) return;

    setDaily(d => d + 1);
    setTotal(t => t + 1);

    await incrementTasbeeh(tasbeeh.id);
  };

  /* ===============================
     RESET DAILY
  =============================== */
  const onResetDaily = () => {
    if (!tasbeeh || daily === 0) return;

    Alert.alert(
      "Reset Daily Count?",
      "Sirf aaj ka tasbeeh reset hoga. Total count safe rahega.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetDailyTasbeeh(tasbeeh.id);
            setDaily(0);
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.root}>
        {/* ================= TOP BAR ================= */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.push("/tasbeeh-list")}>
            <Text style={styles.viewText}>View Tasbeeh →</Text>
          </Pressable>
        </View>

        {/* ================= CENTER TASBEEH ================= */}
        <View style={styles.center}>
          {tasbeeh ? (
            <>
              {isFav && (
                <Text style={styles.favBadge}>
                  ⭐ Favourite Tasbeeh
                </Text>
              )}

              <Text style={styles.arabic}>{tasbeeh.arabic}</Text>
              <Text style={styles.roman}>{tasbeeh.roman}</Text>
              <Text style={styles.urdu}>{tasbeeh.urdu}</Text>
              <Text style={styles.meaning}>{tasbeeh.meaning}</Text>
            </>
          ) : (
            <Text style={styles.placeholder}>
              Tasbeeh select karein
            </Text>
          )}
        </View>

        {/* ================= BOTTOM CONTROLS ================= */}
        <View style={styles.bottom}>
          {/* Count */}
          <Pressable onLongPress={onResetDaily}>
            <View style={styles.countRow}>
              <Text style={styles.daily}>{daily}</Text>
              <Text style={styles.total}> / {total}</Text>
            </View>
          </Pressable>

          {/* Reset */}
          <Pressable style={styles.resetBtn} onPress={onResetDaily}>
            <Text style={styles.resetText}>Reset Daily</Text>
          </Pressable>

          {/* Plus */}
          <Pressable style={styles.plus} onPress={onPlus}>
            <Text style={styles.plusText}>+</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

/* ===============================
   STYLES
=============================== */
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  /* ---------- TOP ---------- */
  topBar: {
    paddingTop: 20,
    paddingRight: 20,
    alignItems: "flex-end",
  },
  viewText: {
    color: "#A6E3C3",
    fontSize: 14,
  },

  /* ---------- CENTER ---------- */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  favBadge: {
    color: "#FFD700",
    fontSize: 16,
    marginBottom: 6,
  },
  arabic: {
    color: "#FFFFFF",
    fontSize: 38,
    textAlign: "center",
    marginBottom: 10,
  },
  roman: {
    color: "#A6E3C3",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 6,
  },
  urdu: {
    color: "#E0E0E0",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 6,
  },
  meaning: {
    color: "#C7D2CC",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  placeholder: {
    color: "#888",
    fontSize: 18,
  },

  /* ---------- BOTTOM ---------- */
  bottom: {
    alignItems: "center",
    paddingBottom: 30,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  daily: {
    color: "#FFFFFF",
    fontSize: 52,
  },
  total: {
    color: "#A6E3C3",
    fontSize: 22,
    marginBottom: 8,
    marginLeft: 6,
  },
  resetBtn: {
    marginBottom: 16,
  },
  resetText: {
    color: "#FF8A8A",
    fontSize: 14,
  },
  plus: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#1F7A4D",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "bold",
  },
});
