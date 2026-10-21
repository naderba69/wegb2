/**
 * 279 — Automatization — الأتمتة
 * DeKeyser 2007: declarative → procedural via systematic practice → automatized
 * Level: A2-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_279 = {
  id: 279,
  titleDe: "Automatisierung",
  titleAr: "الأتمتة",
  family: "SLA",
  bloom: "طبّق",
  level: "A2-B2",
  research: "DeKeyser 2007",
  path: "deklarativ → prozedural → automatisiert",
} as const;
export function automatizationStage(reps: number): string { if(reps<5) return "deklarativ"; if(reps<20) return "prozedural"; return "automatisiert"; }
export function needsPractice(reps: number): boolean { return reps<20; }
