import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";

import { Screen } from "../../src/components/Screen";
import { getAIReply } from "../../src/ai/chatEngine";
import { detectCurrentNamaz } from "../../src/ai/namazDetector";

type Message = {
  from: "user" | "ai";
  text: string;
  hasCitation?: boolean;
  citationType?: "quran" | "hadith";
};

export default function AIChatScreen() {
  const [input, setInput] = useState("");
  const [showCitations, setShowCitations] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text:
        "Assalamu Alaikum 🌙\n\n" +
        "Aap tasbeeh, zikr, dua ya apna haal likh sakte ho.\n" +
        "Upar toggle se Qur’an / Hadith citations control kar sakte ho.",
    },
  ]);

  const scrollRef = useRef<ScrollView>(null);

  const send = () => {
    if (!input.trim()) return;

    const currentNamaz = detectCurrentNamaz();

    const userMsg: Message = {
      from: "user",
      text: input,
    };

    const aiText = getAIReply(input, {
      lastNamaz: currentNamaz,
      showCitations,
    });

    // ✅ reliable citation detection
    const hasCitation =
      showCitations &&
      (aiText.includes("﴿") || aiText.includes("﴾") || aiText.includes("Surah") || aiText.includes("Bukhari") || aiText.includes("Muslim"));

    const citationType: "quran" | "hadith" | undefined =
      aiText.includes("﴿") || aiText.includes("﴾") || aiText.includes("Surah")
        ? "quran"
        : aiText.includes("Bukhari") || aiText.includes("Muslim")
        ? "hadith"
        : undefined;

    const aiMsg: Message = {
      from: "ai",
      text: aiText,
      hasCitation,
      citationType,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View style={styles.container}>
          {/* 🔘 TOGGLE BAR */}
          <View style={styles.toggleBar}>
            <Text style={styles.toggleText}>
              Qur’an / Hadith citations
            </Text>
            <Switch
              value={showCitations}
              onValueChange={setShowCitations}
              trackColor={{ false: "#555", true: "#1F7A4D" }}
              thumbColor="#F5F5DC"
            />
          </View>

          {/* 💬 CHAT */}
          <ScrollView
            ref={scrollRef}
            style={styles.chat}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((m, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  m.from === "user"
                    ? styles.user
                    : styles.ai,
                ]}
              >
                <Text style={styles.text}>{m.text}</Text>

                {m.from === "ai" && m.hasCitation && (
                  <Text
                    style={styles.link}
                    onPress={() =>
                      router.push({
                        pathname: "/citation",
                        params: {
                          type: m.citationType ?? "quran",
                          reference:
                            m.citationType === "hadith"
                              ? "Sahih Hadith Collections"
                              : "Al-Qur’an",
                        },
                      })
                    }
                  >
                    View source →
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>

          {/* ⌨️ INPUT */}
          <View style={styles.inputBar}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Tasbeeh, zikr ya sawal likhiye…"
              placeholderTextColor="#889D92"
              style={styles.input}
              multiline
            />
            <Pressable style={styles.send} onPress={send}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  toggleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1F7A4D",
  },
  toggleText: {
    color: "#F5F5DC",
    fontSize: 14,
  },

  chat: { flex: 1 },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  bubble: {
    padding: 12,
    borderRadius: 14,
    marginVertical: 6,
    maxWidth: "80%",
  },
  ai: {
    backgroundColor: "#1C3D5A",
    alignSelf: "flex-start",
  },
  user: {
    backgroundColor: "#1F7A4D",
    alignSelf: "flex-end",
  },
  text: {
    color: "#F5F5DC",
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: "#A6E3C3",
    fontSize: 12,
    marginTop: 6,
  },

  inputBar: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#1F7A4D",
    backgroundColor: "#0E1A14",
  },
  input: {
    flex: 1,
    backgroundColor: "#162922",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#FFFFFF",
    maxHeight: 120,
  },
  send: {
    marginLeft: 8,
    backgroundColor: "#1F7A4D",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 12,
  },
  sendText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
