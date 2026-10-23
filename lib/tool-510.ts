/**
 * 510 — Translanguaging — ترجمة لغوية
 * Family: SLA | Bloom: أنشئ | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_510 = {
  id: 510,
  titleDe: "Translanguaging",
  titleAr: "ترجمة لغوية",
  family: "SLA",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Garcia 2009",
  desc: "Translanguaging",
} as const;

export function tool510Gain(a:boolean):number{return a?1.2:1.0;}
export function tool510Check(v:number):boolean{return v>0;}
