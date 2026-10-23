/**
 * 271 — Kontext-Variation — تغاير السياق
 * Family: طرائق | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
