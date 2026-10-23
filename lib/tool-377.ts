/**
 * 377 — Salience — البروز
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
