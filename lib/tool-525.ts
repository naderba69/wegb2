/**
 * 525 — Dogme Unplugged — تعليم بلا كتاب
 * Family: طرائق | Bloom: أنشئ | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_525 = {
  id: 525,
  titleDe: "Dogme Unplugged",
  titleAr: "تعليم بلا كتاب",
  family: "طرائق",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Meddings 2009",
  desc: "Dogme Unplugged",
} as const;

export function tool525Gain(a:boolean):number{return a?1.2:1.0;}
export function tool525Check(v:number):boolean{return v>0;}
