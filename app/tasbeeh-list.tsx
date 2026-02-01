import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "../src/components/Screen";
import { TASBEEH_LIST } from "../src/tasbeeh/tasbeehList";
import { setActiveTasbeeh } from "../src/tasbeeh/tasbeehStore";

export default function TasbeehListScreen() {
  const selectTasbeeh = async (tasbeeh: any) => {
    await setActiveTasbeeh(tasbeeh);
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.heading}>Tasbeeh List 📿</Text>

        {TASBEEH_LIST.map(t => (
          <Pressable
            key={t.id}
            style={styles.card}
            onPress={() => selectTasbeeh(t)}
          >
            <Text style={styles.label}>{t.label}</Text>
            <Text style={styles.meaning}>{t.meaning}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#162922",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  label: {
    color: "#1F7A4D",
    fontSize: 18,
    fontWeight: "600",
  },
  meaning: {
    color: "#C7D2CC",
    fontSize: 13,
    marginTop: 4,
  },
});
