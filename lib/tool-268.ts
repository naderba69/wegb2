/**
 * 268 — Free Recall — الاستدعاء الحر
 * Tulving 1968: free recall reveals organization; clustering shows learning
 * Level: B1-B2 | Bloom: أنشئ | Family: الذاكرة
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
