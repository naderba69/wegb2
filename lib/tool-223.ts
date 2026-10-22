/**
 * 223 — Graded Readers — القراءات المتدرجة
 * Nation 2009: 95-98% known words → i+1, vocabulary growth 5-10 per book
 * Level: A1-B2 | Bloom: طبّق | Family: طرائق
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
