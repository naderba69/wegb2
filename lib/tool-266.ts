/**
 * 266 — Dual Coding (Bild) — الترميز المزدوج بالصورة
 * Family: الذاكرة | Bloom: فهم | Level: A0-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
