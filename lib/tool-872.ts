/**
 * 872 — Lag Effect Cepeda — أثر تأخير
 * Family: الذاكرة | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_872 = {
  id: 872,
  titleDe: "Lag Effect Cepeda",
  titleAr: "أثر تأخير",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Cepeda 2008",
  desc: "Lag Effect Cepeda",
} as const;

export function tool872Gain(a:boolean):number{return a?1.2:1.0;}
export function tool872Check(v:number):boolean{return v>0;}
