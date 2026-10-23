/**
 * 743 — Teletandem — تبادل عن بعد
 * Family: Immersion | Bloom: طبّق | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_743 = {
  id: 743,
  titleDe: "Teletandem",
  titleAr: "تبادل عن بعد",
  family: "Immersion",
  bloom: "طبّق",
  level: "B1-B2",
  research: "Telles 2009",
  desc: "Teletandem",
} as const;

export function tool743Gain(a:boolean):number{return a?1.2:1.0;}
export function tool743Check(v:number):boolean{return v>0;}
