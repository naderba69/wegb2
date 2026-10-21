/**
 * 346 — Passiv Syntax — المبني للمجهول
 * Hinkel 2004: classroom-ready application with tasks
 * Level: B1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_346 = {
  id: 346,
  titleDe: "Passiv Syntax",
  titleAr: "المبني للمجهول",
  family: "SLA",
  bloom: "طبّق",
  level: "B1-B2",
  research: "Hinkel 2004",
  desc: "Passiv Syntax classroom application",
} as const;
export function tool346Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool346Check(v: number): boolean { return v>0; }
