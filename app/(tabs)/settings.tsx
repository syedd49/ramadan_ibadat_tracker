import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { useLang } from "../../src/context/LanguageContext";
import { Screen } from "../../src/components/Screen";

export default function SettingsTab() {
  const { lang, setLang } = useLang();

  const EMAIL = "syedd49@gmail.com"; // 🔥 replace

  const openFeedback = () => {
    const subject = "Ramadan Ibadat Tracker Feedback";
    const body =
      "Assalamu alaikum,\n\nI would like to share the following feedback:\n";

    const url = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url);
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* LANGUAGE */}
        <Text style={styles.heading}>Language 🌐</Text>

        <Pressable
          style={[styles.option, lang === "en" && styles.active]}
          onPress={() => setLang("en")}
        >
          <Text style={styles.text}>English</Text>
        </Pressable>

        <Pressable
          style={[styles.option, lang === "ur" && styles.active]}
          onPress={() => setLang("ur")}
        >
          <Text style={styles.text}>اردو</Text>
        </Pressable>

        {/* FEEDBACK */}
        <Text style={[styles.heading, { marginTop: 30 }]}>
          Feedback ✉️
        </Text>

        <View style={styles.feedbackCard}>
          <Text style={styles.emailText}>
            {EMAIL}
          </Text>

          <Pressable style={styles.btn} onPress={openFeedback}>
            <Text style={styles.btnText}>
              Send Feedback
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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

  feedbackCard: {
    backgroundColor: "#1A2F26",
    padding: 16,
    borderRadius: 14,
  },

  emailText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
  },

  btn: {
    backgroundColor: "#4AA3DF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
