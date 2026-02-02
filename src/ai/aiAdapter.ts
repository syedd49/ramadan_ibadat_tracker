import { generateDailyInsight } from "./insightEngine";

const USE_LOCAL_AI = true;
const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "phi3:mini";

type DailyInsightInput = {
  day: number;
  completed: string[];
  missed: string[];
  streak: number;
};

export async function getDailyAIInsight(
  input: DailyInsightInput
): Promise<string> {
  if (!USE_LOCAL_AI) {
    return generateDailyInsight(input);
  }

  try {
    const prompt = buildSmartPrompt(input);

    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!res.ok) throw new Error("AI failed");

    const data = await res.json();
    if (typeof data?.response === "string") {
      return data.response.trim();
    }

    throw new Error("Bad AI payload");
  } catch {
    return generateDailyInsight(input);
  }
}

/* 🧠 SMART PROMPT */
function buildSmartPrompt(input: DailyInsightInput): string {
  const { completed, missed, streak } = input;

  return `
You are a practical Islamic habit coach.

Rules:
- No fatwa
- No judgement
- No Quran/Hadith invention
- Be specific and actionable
- Max 4 short lines

User data:
Completed today: ${completed.join(", ") || "None"}
Missed today: ${missed.join(", ") || "None"}
Current streak: ${streak}

Tasks:
1. Identify ONE likely struggle (time, energy, routine).
2. Suggest ONE small action for next salah.
3. End with ONE gentle reminder or dua line.

Output plain text only.
`.trim();
}
