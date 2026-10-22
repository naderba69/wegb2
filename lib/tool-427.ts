/**
 * 427 — Role Play Advanced — لعب أدوار متقدم
 * Ladousse 2004: classroom application with tasks
 * Level: A1-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_427 = {
  id: 427,
  titleDe: "Role Play Advanced",
  titleAr: "لعب أدوار متقدم",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Ladousse 2004",
  desc: "Role Play Advanced classroom",
} as const;
export function tool427Gain(a:boolean):number{return a?1.2:1.0;}
export function tool427Check(v:number):boolean{return v>0;}
