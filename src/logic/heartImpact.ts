/**
 * Higher score = deeper emotional healing
 */
const MOOD_IMPACT_SCORE: Record<string, number> = {
  stress: 2,
  anxiety: 2,
  sadness: 2,
  guilt: 3,
  confusion: 2,
  "low-iman": 3,
  calm: 1,
};

export function calculateHeartImpact(
  moods: string[]
): number {
  if (!moods || moods.length === 0) return 0;

  return moods.reduce((total, mood) => {
    return total + (MOOD_IMPACT_SCORE[mood] || 1);
  }, 0);
}

/**
 * Optional helper
 */
export function heartImpactLevel(score: number) {
  if (score >= 30) return "🌿🌿🌿🌿🌿";
  if (score >= 20) return "🌿🌿🌿🌿";
  if (score >= 10) return "🌿🌿🌿";
  if (score >= 5) return "🌿🌿";
  return "🌿";
}
