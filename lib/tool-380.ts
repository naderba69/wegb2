/**
 * 380 — Implicit vs Explicit — ضمني مقابل صريح
 * DeKeyser 2003: classroom application with task integration
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_380 = {
  id: 380,
  titleDe: "Implicit vs Explicit",
  titleAr: "ضمني مقابل صريح",
  family: "SLA",
  bloom: "حلّل",
  level: "A1-B2",
  research: "DeKeyser 2003",
  desc: "Implicit vs Explicit classroom",
} as const;
export function tool380Gain(a: boolean): number { return a?1.2:1.0; }
export function tool380Check(v:number):boolean { return v>0; }
