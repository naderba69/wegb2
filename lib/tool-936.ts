/**
 * 936 — Mediation Competence — كفاءة وساطة
 * Family: طرائق | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_936 = {
  id: 936,
  titleDe: "Mediation Competence",
  titleAr: "كفاءة وساطة",
  family: "طرائق",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Council 2018",
  desc: "Mediation Competence",
} as const;

export function tool936Gain(a:boolean):number{return a?1.2:1.0;}
export function tool936Check(v:number):boolean{return v>0;}
