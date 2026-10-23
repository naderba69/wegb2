/**
 * 503 — Self-Paced Reading — قراءة ذاتية السرعة
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_503 = {
  id: 503,
  titleDe: "Self-Paced Reading",
  titleAr: "قراءة ذاتية السرعة",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Jiang 2007",
  desc: "Self-Paced Reading",
} as const;

export function tool503Gain(a:boolean):number{return a?1.2:1.0;}
export function tool503Check(v:number):boolean{return v>0;}
