import { getDailyAIInsight } from "../src/ai/aiAdapter";

async function run() {
  const res = await getDailyAIInsight({
    day: 10,
    completed: ["Fajr", "Asr"],
    missed: ["Isha"],
    streak: 4,
  });

  console.log("\nAI RESPONSE:\n", res);
}

run();
