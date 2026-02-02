import { View, Text, StyleSheet } from "react-native";

export function AICard({ text }: { text: string }) {
  if (!text) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today’s Guidance</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#12251E",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#4AA3DF",
  },
  title: {
    color: "#4AA3DF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  text: {
    color: "#F5F5DC",
    fontSize: 15,
    lineHeight: 22,
  },
});
