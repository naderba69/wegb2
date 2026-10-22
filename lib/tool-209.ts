/**
 * 209 — Error Correction Timing — توقيت تصحيح الخطأ
 * Lyster 2004: recast for fluency, explicit for accuracy; delayed > immediate for complexity
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_209 = {
  id: 209,
  titleDe: "Korrektur-Timing",
  titleAr: "توقيت تصحيح الخطأ",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lyster 2004",
  recast: "implizit bei Flüssigkeit",
  explicit: "explizit bei Genauigkeit",
} as const;

export type KorrekturArt = "recast" | "explicit";
export function korrekturArt(focus: "fluency" | "accuracy"): KorrekturArt {
  return focus === "fluency" ? "recast" : "explicit";
}
export function korrekturDelay(complexity: number): number {
  return complexity > 0.7 ? 10 : 0; // minutes
}
