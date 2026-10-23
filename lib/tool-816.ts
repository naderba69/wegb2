/**
 * 816 — Prompts Lyster — توجيه ليستر
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_816 = {
  id: 816,
  titleDe: "Prompts Lyster",
  titleAr: "توجيه ليستر",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lyster 2004",
  desc: "Prompts Lyster",
} as const;

export function tool816Gain(a:boolean):number{return a?1.2:1.0;}
export function tool816Check(v:number):boolean{return v>0;}
