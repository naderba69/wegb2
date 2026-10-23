/**
 * 278 — Affektiver Filter — المرشح الوجداني
 * Family: SLA | Bloom: طبّق | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
