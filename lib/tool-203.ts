/**
 * 203 — Ausgearbeitete Beispiele (Fading) — تلاشي الأمثلة المحلولة
 * Family: طرائق | Bloom: طبّق | Level: A1-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_203 = {
  id: 203,
  titleDe: "Ausgearbeitete Beispiele (Fading)",
  titleAr: "تلاشي الأمثلة المحلولة",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B1",
  research: "Renkl 2002",
  fade: "voll → Lücke → selbst lösen",
} as const;

export type FadeStage = "voll" | "luecke" | "selbst";
export function fadeStage(reps: number): FadeStage {
  if (reps < 2) return "voll";
  if (reps < 5) return "luecke";
  return "selbst";
}
export function shouldFade(stage: FadeStage): boolean {
  return stage !== "voll";
}
