/**
 * 829 — Silent Period — فترة صمت
 * Family: SLA | Bloom: فهم | Level: A0-A2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_829 = {
  id: 829,
  titleDe: "Silent Period",
  titleAr: "فترة صمت",
  family: "SLA",
  bloom: "فهم",
  level: "A0-A2",
  research: "Krashen 1982",
  desc: "Silent Period",
} as const;

export function tool829Gain(a:boolean):number{return a?1.2:1.0;}
export function tool829Check(v:number):boolean{return v>0;}
