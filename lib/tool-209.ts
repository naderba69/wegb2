/**
 * 209 — Korrektur-Timing — توقيت تصحيح الخطأ
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
