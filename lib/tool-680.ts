/**
 * 680 — Deontic Modality — نمطية الزامي
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_680 = {
  id: 680,
  titleDe: "Deontic Modality",
  titleAr: "نمطية الزامي",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Palmer 2001",
  desc: "Deontic Modality",
} as const;

export function tool680Gain(a:boolean):number{return a?1.2:1.0;}
export function tool680Check(v:number):boolean{return v>0;}
