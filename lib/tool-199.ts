/**
 * 199 — Pre-testing / Unsuccessful Retrieval — الاختبار القبلي
 * Kornell 2009: attempting answer before study improves later recall even when wrong
 * Level: B1 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_199 = {
  id: 199,
  titleDe: "Vortest",
  titleAr: "الاختبار القبلي",
  family: "تقويم",
  bloom: "قيّم",
  level: "B1",
  research: "Kornell 2009",
  instruction: "rate vor dem Lernen — Fehler sind ok",
} as const;

export function pretestBenefit(attempted: boolean): number {
  return attempted ? 1.15 : 1.0;
}
export function pretestPrompt(topicDe: string): string {
  return `Vortest: Was weißt du über ${topicDe}? (Raten erlaubt!)`;
}
