/**
 * 267 — Dual Coding Audio — الترميز المزدوج بالصوت
 * Mayer 2009: spoken + written + image > written alone (but avoid redundancy overload)
 * Level: A0-B2 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_267 = {
  id: 267,
  titleDe: "Dual Coding (Audio)",
  titleAr: "الترميز المزدوج بالصوت",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A0-B2",
  research: "Mayer 2009",
  optimal: "Bild + Audio ODER Bild + Text, nicht alle drei gleichzeitig",
} as const;
export function audioDual(word: string, audio: boolean): string { return `${word} ${audio?"🔊":""} — höre + lies`; }
export function redundancyRisk(modalities: number): boolean { return modalities>2; }
