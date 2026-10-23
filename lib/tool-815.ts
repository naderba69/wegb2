/**
 * 815 — Recasts Lyster — إعادة صياغة ليستر
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_815 = {
  id: 815,
  titleDe: "Recasts Lyster",
  titleAr: "إعادة صياغة ليستر",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lyster 2004",
  desc: "Recasts Lyster",
} as const;

export function tool815Gain(a:boolean):number{return a?1.2:1.0;}
export function tool815Check(v:number):boolean{return v>0;}
