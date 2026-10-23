/**
 * 931 — Formulaic Competence — كفاءة صيغية
 * Family: تقويم | Bloom: تذكّر | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_931 = {
  id: 931,
  titleDe: "Formulaic Competence",
  titleAr: "كفاءة صيغية",
  family: "تقويم",
  bloom: "تذكّر",
  level: "A2-B2",
  research: "Wray 2002",
  desc: "Formulaic Competence",
} as const;

export function tool931Gain(a:boolean):number{return a?1.2:1.0;}
export function tool931Check(v:number):boolean{return v>0;}
