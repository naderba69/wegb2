/**
 * 266 — Dual Coding Image — الترميز المزدوج بالصورة
 * Paivio 1971: word + image → two codes → recall +50% vs word alone
 * Level: A0-B1 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_266 = {
  id: 266,
  titleDe: "Dual Coding (Bild)",
  titleAr: "الترميز المزدوج بالصورة",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A0-B1",
  research: "Paivio 1971 +50%",
  method: "Wort + Bild + Satz",
} as const;
export function dualCode(word: string, image: string): string { return `${word} ↔ 🖼️ ${image}`; }
export function dualGain(withImage: boolean): number { return withImage?1.5:1.0; }
