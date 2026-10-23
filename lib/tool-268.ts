/**
 * 268 — Freier Abruf — الاستدعاء الحر
 * Family: الذاكرة | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_268 = {
  id: 268,
  titleDe: "Freier Abruf",
  titleAr: "الاستدعاء الحر",
  family: "الذاكرة",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Tulving 1968",
  task: "Schreibe alle Wörter zum Thema ... auf!",
} as const;

export function freeRecallPrompt(topic: string): string { return `Freier Abruf: Alle Wörter zu ${topic} — los!`; }
export function recallScore(recalled: number, total: number): number { return total?recalled/total:0; }
