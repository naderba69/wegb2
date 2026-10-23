/**
 * 217 — PPP (Präsentation-Übung-Produktion) — العرض-الممارسة-الإنتاج
 * Family: طرائق | Bloom: طبّق | Level: A0-A2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_217 = {
  id: 217,
  titleDe: "PPP (Präsentation-Übung-Produktion)",
  titleAr: "العرض-الممارسة-الإنتاج",
  family: "طرائق",
  bloom: "طبّق",
  level: "A0-A2",
  research: "Byrne 1986",
  when: "Anfänger: PPP gut; Fortgeschrittene: TBLT besser",
} as const;

export type PppPhase = "presentation" | "practice" | "production";
export function pppPhase(dayInWeek: number): PppPhase { return dayInWeek<=2?"presentation":dayInWeek<=4?"practice":"production"; }
