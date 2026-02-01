import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";

import { getAIReply } from "../../src/ai/chatEngine";
import { Screen } from "../../src/components/Screen";


type Message = {
  from: "user" | "ai";
  text: string;
};

export default function AIChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: "Assalamu Alaikum 🌙 Aap jo mehsoos kar rahe ho, yahan likh sakte ho.",
    },
  ]);

  const send = () => {
    if (!input.trim()) return;

    const userMsg: Message = { from: "user", text: input };
    const aiMsg: Message = { from: "ai", text: getAIReply(input) };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
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
                m.from === "user" ? styles.user : styles.ai,
              ]}
            >
              <Text style={styles.text}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Yahan likhiye..."
            placeholderTextColor="#889D92"
            style={styles.input}
          />
          <Pressable style={styles.send} onPress={send}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chat: { flex: 1 },
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
  },
  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#1F7A4D",
  },
  input: {
    flex: 1,
    backgroundColor: "#162922",
    borderRadius: 12,
    paddingHorizontal: 12,
    color: "#FFFFFF",
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
