/**
 * 278 — Affective Filter — المرشح الوجداني
 * Krashen 1982: low anxiety + motivation + self-confidence → lower filter → more intake
 * Level: A0-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_278 = {
  id: 278,
  titleDe: "Affektiver Filter",
  titleAr: "المرشح الوجداني",
  family: "SLA",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Krashen 1982",
  lowers: "Spiel, Humor, Ermutigung, Wahlfreiheit",
} as const;
export function filterLevel(anxiety: number, motivation: number): number { return Math.max(0, anxiety - motivation*0.5); }
export function lowerFilter(humour: boolean): number { return humour?0.7:1.0; }
