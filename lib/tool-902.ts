/**
 * 902 — Back-Formation — اشتقاق عكسي
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_902 = {
  id: 902,
  titleDe: "Back-Formation",
  titleAr: "اشتقاق عكسي",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Becker 1993",
  desc: "Back-Formation",
} as const;

export function tool902Gain(a:boolean):number{return a?1.2:1.0;}
export function tool902Check(v:number):boolean{return v>0;}
