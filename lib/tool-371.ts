/**
 * 371 — Affective Filter Low — خفض المرشح الوجداني
 * Krashen 1982b: classroom application with task integration
 * Level: A0-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_371 = {
  id: 371,
  titleDe: "Affective Filter Low",
  titleAr: "خفض المرشح الوجداني",
  family: "SLA",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Krashen 1982b",
  desc: "Affective Filter Low classroom",
} as const;
export function tool371Gain(a: boolean): number { return a?1.2:1.0; }
export function tool371Check(v:number):boolean { return v>0; }
