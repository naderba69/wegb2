/**
 * 223 — Graded Readers — القراءات المتدرجة
 * Family: طرائق | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_223 = {
  id: 223,
  titleDe: "Graded Readers",
  titleAr: "القراءات المتدرجة",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Nation 2009",
  coverage: "95-98% bekannt = ideal",
} as const;

export function gradedLevel(knownPercent: number): string {
  if (knownPercent >= 98) return "zu leicht";
  if (knownPercent >= 95) return "ideal";
  return "zu schwer";
}
export function wordsPerBook(level: string): number { const m: Record<string,number>={A1:800,A2:1200,B1:2500,B2:5000}; return m[level]??1200; }
