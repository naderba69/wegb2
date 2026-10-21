/**
 * 377 — Salience — البروز
 * Goldschneider 2001: classroom application with task integration
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_377 = {
  id: 377,
  titleDe: "Salience",
  titleAr: "البروز",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Goldschneider 2001",
  desc: "Salience classroom",
} as const;
export function tool377Gain(a: boolean): number { return a?1.2:1.0; }
export function tool377Check(v:number):boolean { return v>0; }
