/**
 * 192 — Retrieval-Induced Forgetting Shield — درع النسيان المستحث بالاسترجاع
 * Anderson 1994: retrieving A inhibits B if same cue; shield by varying cues
 * Level: B1 | Bloom: حلّل | Family: الذاكرة
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
