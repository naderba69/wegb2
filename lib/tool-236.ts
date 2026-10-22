/**
 * 236 — Drilling — التدريب التكراري
 * Richards 2015: choral → individual → substitution drills build automaticity (when meaningful)
 * Level: A0-A2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_236 = {
  id: 236,
  titleDe: "Drilling",
  titleAr: "التدريب التكراري",
  family: "طرائق",
  bloom: "طبّق",
  level: "A0-A2",
  research: "Richards 2015",
  types: "choral, individual, substitution, transformation",
} as const;
export type DrillType="choral"|"individual"|"substitution"|"transformation";
export function drillNext(type: DrillType): DrillType { const o: DrillType[]=["choral","individual","substitution","transformation"]; return o[(o.indexOf(type)+1)%o.length]; }
export function drillReps(level: string): number { return level==="A0"?5:3; }
