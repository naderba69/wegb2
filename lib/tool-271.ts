/**
 * 271 — Context Variation — تغاير السياق
 * Smith 1978: varying learning context → better transfer; encoding variability
 * Level: A1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_271 = {
  id: 271,
  titleDe: "Kontext-Variation",
  titleAr: "تغاير السياق",
  family: "طرائق",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Smith 1978",
  method: "gleiches Wort in 3 Kontexten lernen",
} as const;
export function variedContexts(word: string): string[] { return [`${word} im Café`, `${word} im Büro`, `${word} zu Hause`]; }
export function transferGain(varied: boolean): number { return varied?1.3:1.0; }
