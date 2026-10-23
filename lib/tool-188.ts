/**
 * 188 — Konkrete Beispiele — أمثلة ملموسة
 * Family: تلقين | Bloom: فهم | Level: A2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_188 = {
  id: 188,
  titleDe: "Konkrete Beispiele",
  titleAr: "أمثلة ملموسة",
  family: "تلقين",
  bloom: "فهم",
  level: "A2",
  minExamples: 2,
} as const;

export function needsMoreExamples(currentCount: number): boolean {
  return currentCount < TOOL_188.minExamples;
}

export function exampleTemplate(rule: string, beispiel1: string, beispiel2: string): string {
  return `${rule} → z.B. "${beispiel1}" und "${beispiel2}"`;
}
