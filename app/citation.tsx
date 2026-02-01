import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../src/components/Screen";

export default function CitationScreen() {
  const {
    type,
    arabic,
    meaning,
    reference,
    note,
  } = useLocalSearchParams<{
    type: string;
    arabic?: string;
    meaning?: string;
    reference?: string;
    note?: string;
  }>();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>
          {type === "quran"
            ? "Qur’an Reference 📖"
            : "Hadith Reference 📚"}
        </Text>

        {arabic && (
          <Text style={styles.arabic}>{arabic}</Text>
        )}

        {meaning && (
          <Text style={styles.meaning}>
            {meaning}
          </Text>
        )}

        {reference && (
          <View style={styles.refBox}>
            <Text style={styles.refTitle}>
              Source
            </Text>
            <Text style={styles.refText}>
              {reference}
            </Text>
          </View>
        )}

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>
            Authenticity Note
          </Text>
          <Text style={styles.noteText}>
            {note ??
              "Ye reference commonly accepted authentic sources se liya gaya hai. AI sirf educational aur motivational purpose ke liye use karta hai."}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    color: "#F5F5DC",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  arabic: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 34,
    textAlign: "center",
    marginBottom: 16,
  },
  meaning: {
    color: "#C7D2CC",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  refBox: {
    backgroundColor: "#162922",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  refTitle: {
    color: "#1F7A4D",
    fontSize: 12,
    marginBottom: 4,
  },
  refText: {
    color: "#F5F5DC",
    fontSize: 14,
  },
  noteBox: {
    backgroundColor: "#1C3D5A",
    padding: 14,
    borderRadius: 12,
  },
  noteTitle: {
    color: "#F5F5DC",
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "600",
  },
  noteText: {
    color: "#C7D2CC",
    fontSize: 13,
    lineHeight: 18,
  },
});
