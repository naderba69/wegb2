/**
 * 183 — Schwierigkeitskalibrierung — معايرة الصعوبة
 * Family: الذاكرة | Bloom: حلّل | Level: B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_183 = {
  id: 183,
  titleDe: "Schwierigkeitskalibrierung",
  titleAr: "معايرة الصعوبة",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "B1",
  optimalErrorRate: 0.18,
  range: [0.15,0.25],
} as const;

export function adjustDifficulty(currentErrorRate: number, currentDifficulty: number): number {
  const _target = TOOL_183.optimalErrorRate;
  void _target;
  if (currentErrorRate < 0.12) return currentDifficulty * 1.15; // too easy → harder
  if (currentErrorRate > 0.28) return currentDifficulty * 0.85; // too hard → easier
  return currentDifficulty;
}

export function isDesirableDifficulty(errorRate: number): boolean {
  return errorRate >= 0.15 && errorRate <= 0.25;
}
