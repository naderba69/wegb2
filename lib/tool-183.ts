/**
 * 183 — Desirable Difficulty Calibration — معايرة الصعوبة المرغوبة
 * Bjork & Bjork 2011: difficulty should be 15-20% error rate for optimal learning
 * Integrated into lib/srs.ts: adjustDifficulty()
 * Level: B1 | Bloom: حلّل
 */
export const TOOL_183 = {
  id: 183,
  titleDe: "Schwierigkeitskalibrierung",
  titleAr: "معايرة الصعوبة",
  family: "الذاكرة",
  optimalErrorRate: 0.18,
  range: [0.15, 0.25],
} as const;

export function adjustDifficulty(currentErrorRate: number, currentDifficulty: number): number {
  const target = TOOL_183.optimalErrorRate;
  if (currentErrorRate < 0.12) return currentDifficulty * 1.15; // too easy → harder
  if (currentErrorRate > 0.28) return currentDifficulty * 0.85; // too hard → easier
  return currentDifficulty;
}

export function isDesirableDifficulty(errorRate: number): boolean {
  return errorRate >= 0.15 && errorRate <= 0.25;
}
