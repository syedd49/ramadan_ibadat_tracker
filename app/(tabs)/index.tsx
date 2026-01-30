import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../src/constants/colors";

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Ramadan Mubarak 🌙</Text>
      <Text style={styles.subtitle}>
        Stay consistent. Small steps, every day.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Focus Today</Text>
        <Text style={styles.cardText}>
          Pray on time, stay mindful, and return to Allah often 🤍
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 20,
    justifyContent: "center",
  },
  greeting: {
    color: COLORS.textMain,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSub,
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 18,
  },
  cardTitle: {
    color: COLORS.textMain,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardText: {
    color: COLORS.textSub,
    fontSize: 15,
    lineHeight: 22,
  },
});
