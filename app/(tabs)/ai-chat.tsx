// /RAMADAN-IBADAT_TRACKER/app/(tabs)/a-chat.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef, useEffect } from "react";

import { Screen } from "../../src/components/Screen";
import {
  ChatMessage,
  getAIReply,
  AISource,
} from "../../src/ai/chatEngine";

export default function AIChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "Assalamu alaikum. Aaj ibadat ke baare me kaisa mehsoos kar rahe ho?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<AISource>("quran");
  const [dots, setDots] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) {
      setDots("");
      return;
    }

    const i = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    return () => clearInterval(i);
  }, [loading]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: input,
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const reply = await getAIReply(updatedHistory, source);
      setMessages([
        ...updatedHistory,
        { role: "assistant", text: reply },
      ]);
    } catch {
      setMessages([
        ...updatedHistory,
        {
          role: "assistant",
          text:
            "Kuch technical masla aa gaya hai. Thoda baad phir try karein.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View style={styles.container}>
          <ScrollView
            ref={scrollRef}
            style={styles.chat}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((m, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  m.role === "assistant"
                    ? styles.ai
                    : styles.user,
                ]}
              >
                <Text style={styles.text}>{m.text}</Text>
              </View>
            ))}

            {loading && (
              <Text style={styles.typing}>
                AI soch raha hai{dots}
              </Text>
            )}
          </ScrollView>

          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setSource("quran")}
              style={[
                styles.toggleBtn,
                source === "quran" && styles.activeToggle,
              ]}
            >
              <Text style={styles.toggleText}>Quran</Text>
            </Pressable>

            <Pressable
              onPress={() => setSource("hadees")}
              style={[
                styles.toggleBtn,
                source === "hadees" && styles.activeToggle,
              ]}
            >
              <Text style={styles.toggleText}>Hadees</Text>
            </Pressable>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={`Type ${source} question...`}
              placeholderTextColor="#9FB9B2"
              style={styles.input}
              multiline
            />
            <Pressable onPress={send} style={styles.send}>
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
  chat: { padding: 16 },

  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  ai: { backgroundColor: "#1B2F26", alignSelf: "flex-start" },
  user: { backgroundColor: "#4AA3DF", alignSelf: "flex-end" },

  text: {
    color: "#F5F5DC",
    fontSize: 14,
    lineHeight: 20,
  },

  typing: {
    color: "#9FB9B2",
    fontSize: 12,
    marginTop: 6,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: "#1B2F26",
  },

  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4AA3DF",
  },

  activeToggle: { backgroundColor: "#4AA3DF" },

  toggleText: {
    color: "#F5F5DC",
    fontWeight: "600",
  },

  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#1B2F26",
  },

  input: {
    flex: 1,
    backgroundColor: "#12251E",
    color: "#F5F5DC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
  },

  send: {
    marginLeft: 10,
    backgroundColor: "#4AA3DF",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  sendText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
