import { generateDailyInsight } from "./insightEngine";

/* 🔐 TYPES */
export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

/* 🔧 FEATURE FLAG */
const USE_LOCAL_AI = true;

/* Ollama config */
const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "phi3:mini";

/* 🧠 MAIN FUNCTION — THIS WAS MISSING */
export async function getAIReply(
  history: ChatMessage[]
): Promise<string> {
  // Fallback if AI off
  if (!USE_LOCAL_AI) {
    return fallbackReply(history);
  }

  try {
    const prompt = buildChatPrompt(history);

    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error("AI request failed");
    }

    const data = await res.json();

    if (typeof data?.response === "string") {
      return data.response.trim();
    }

    throw new Error("Invalid AI response");
  } catch {
    // ❌ AI fail → SAFE fallback
    return fallbackReply(history);
  }
}

/* 🧠 PROMPT BUILDER */
function buildChatPrompt(history: ChatMessage[]): string {
  return `
You are a gentle Islamic habit coach.

Rules:
- No fatwa
- No judgement
- No Quran/Hadith invention
- Short, conversational replies
- Ask one follow-up question

Conversation:
${history.map(h => `${h.role}: ${h.text}`).join("\n")}

Assistant:
`.trim();
}

/* 🔄 FALLBACK (no AI dependency) */
function fallbackReply(history: ChatMessage[]): string {
  const lastUser = [...history]
    .reverse()
    .find(h => h.role === "user");

  if (!lastUser) {
    return "Aaj ibadat ke baare me kya mehsoos kar rahe ho?";
  }

  return `Samajh raha hoon. Isme sabse mushkil part kya lag raha hai?`;
}
