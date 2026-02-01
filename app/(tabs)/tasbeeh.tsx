import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";

import { Screen } from "../../src/components/Screen";
import {
  incrementTasbeeh,
  getTodayTasbeeh,
} from "../../src/storage/tasbeehStorage";
import { getActiveTasbeeh } from "../../src/tasbeeh/tasbeehStore";

export default function TasbeehScreen() {
  const [count, setCount] = useState(0);
  const [tasbeeh, setTasbeeh] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const active = await getActiveTasbeeh();
        setTasbeeh(active);

        const todayCount = await getTodayTasbeeh(active.id);
        setCount(todayCount);
      })();
    }, [])
  );

  const onPlus = async () => {
    if (!tasbeeh) return;

    setCount(prev => prev + 1);
    await incrementTasbeeh(tasbeeh.id, 1);
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* View Tasbeeh */}
        <Pressable
          style={styles.viewBtn}
          onPress={() => router.push("/tasbeeh-list")}
        >
          <Text style={styles.viewText}>View Tasbeeh →</Text>
        </Pressable>

        {/* Active Tasbeeh */}
        {tasbeeh && (
          <>
            <Text style={styles.tasbeeh}>{tasbeeh.label}</Text>
            <Text style={styles.meaning}>{tasbeeh.meaning}</Text>
          </>
        )}

        {/* Count */}
        <Text style={styles.count}>{count}</Text>

        {/* Plus */}
        <Pressable style={styles.plus} onPress={onPlus}>
          <Text style={styles.plusText}>+</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  viewBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  viewText: {
    color: "#A6E3C3",
    fontSize: 14,
  },
  tasbeeh: {
    color: "#1F7A4D",
    fontSize: 26,
    fontWeight: "bold",
  },
  meaning: {
    color: "#C7D2CC",
    fontSize: 13,
    marginBottom: 20,
  },
  count: {
    color: "#FFFFFF",
    fontSize: 48,
    marginVertical: 20,
  },
  plus: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1F7A4D",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "bold",
  },
});
