import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLang } from "../../src/context/LanguageContext";
import { Screen } from "../../src/components/Screen";

export default function SettingsTab() {
  const { lang, setLang } = useLang();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.heading}>Language 🌐</Text>

        <Pressable
          style={[
            styles.option,
            lang === "en" && styles.active,
          ]}
          onPress={() => setLang("en")}
        >
          <Text style={styles.text}>English</Text>
        </Pressable>

        <Pressable
          style={[
            styles.option,
            lang === "ur" && styles.active,
          ]}
          onPress={() => setLang("ur")}
        >
          <Text style={styles.text}>اردو</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    color: "#F5F5DC",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  option: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#162922",
    marginBottom: 10,
  },
  active: {
    borderWidth: 1,
    borderColor: "#1F7A4D",
  },
  text: {
    color: "#F5F5DC",
    fontSize: 16,
  },
});
