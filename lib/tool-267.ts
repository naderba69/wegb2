/**
 * 267 — Dual Coding (Audio) — الترميز المزدوج بالصوت
 * Family: الذاكرة | Bloom: فهم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
