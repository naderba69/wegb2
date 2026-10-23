/**
 * 826 — Affective Filter — مرشح وجداني
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_826 = {
  id: 826,
  titleDe: "Affective Filter",
  titleAr: "مرشح وجداني",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Krashen 1982",
  desc: "Affective Filter",
} as const;

export function tool826Gain(a:boolean):number{return a?1.2:1.0;}
export function tool826Check(v:number):boolean{return v>0;}
