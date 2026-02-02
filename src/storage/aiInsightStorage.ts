type AIInsight = {
  day: number;
  text: string;
  createdAt: number;
};

const KEY = "AI_INSIGHT_HISTORY";

export async function saveAIInsight(insight: AIInsight) {
  const existing = await loadAIInsights();
  existing.unshift(insight);
  localStorage.setItem(KEY, JSON.stringify(existing.slice(0, 50)));
}

export async function loadAIInsights(): Promise<AIInsight[]> {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
