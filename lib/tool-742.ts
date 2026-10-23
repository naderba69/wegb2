/**
 * 742 — Study Abroad — دراسة بالخارج
 * Family: Immersion | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_742 = {
  id: 742,
  titleDe: "Study Abroad",
  titleAr: "دراسة بالخارج",
  family: "Immersion",
  bloom: "فهم",
  level: "B1-B2",
  research: "Kinginger 2011",
  desc: "Study Abroad",
} as const;

export function tool742Gain(a:boolean):number{return a?1.2:1.0;}
export function tool742Check(v:number):boolean{return v>0;}
