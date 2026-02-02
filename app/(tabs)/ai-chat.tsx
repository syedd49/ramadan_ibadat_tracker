import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";

import { Screen } from "../../src/components/Screen";
import {
  ChatMessage,
  getAIReply,
} from "../../src/ai/chatEngine";

export default function AIChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "Assalamu alaikum. Aaj ibadat ke baare me kaisa mehsoos kar rahe ho?",
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: input,
    };

    const updatedHistory: ChatMessage[] = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const reply = await getAIReply(updatedHistory);

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
            "Thodi der ke liye main available nahi hoon. Thoda baad try karein.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView
          style={styles.chat}
          contentContainerStyle={{ paddingBottom: 20 }}
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
              AI soch raha hai…
            </Text>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type here..."
            placeholderTextColor="#9FB9B2"
            style={styles.input}
          />
          <Pressable onPress={send} style={styles.send}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
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

  ai: {
    backgroundColor: "#1B2F26",
    alignSelf: "flex-start",
  },

  user: {
    backgroundColor: "#4AA3DF",
    alignSelf: "flex-end",
  },

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
    height: 44,
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
