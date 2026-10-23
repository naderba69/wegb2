/**
 * 192 — Abruf-induziertes Vergessen — النسيان المستحث بالاسترجاع
 * Family: الذاكرة | Bloom: حلّل | Level: B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_192 = {
  id: 192,
  titleDe: "Abruf-induziertes Vergessen",
  titleAr: "النسيان المستحث بالاسترجاع",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "B1",
  research: "Anderson 1994",
  shield: "vary retrieval cue per card",
} as const;

export function needsCueVariation(cardsSharingCue: number): boolean {
  return cardsSharingCue >= 3;
}
export function rifRisk(retrievedCount: number, totalCueSet: number): number {
  if (totalCueSet <= 0) return 0;
  return Math.min(1, retrievedCount / totalCueSet * 0.6);
}
