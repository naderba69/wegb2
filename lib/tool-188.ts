/**
 * 188 — Concrete Examples Principle — مبدأ الأمثلة الملموسة
 * Rawson et al. 2015: 2 concrete examples per rule > abstract definition alone
 * Level: A2 | Bloom: طبّق
 */
export const TOOL_188 = {
  id: 188,
  titleDe: "Konkrete Beispiele",
  titleAr: "أمثلة ملموسة",
  minExamples: 2,
} as const;

export function needsMoreExamples(currentCount: number): boolean {
  return currentCount < TOOL_188.minExamples;
}

export function exampleTemplate(rule: string, beispiel1: string, beispiel2: string): string {
  return `${rule} → z.B. "${beispiel1}" und "${beispiel2}"`;
}
