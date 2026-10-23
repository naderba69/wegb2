/**
 * 464 — Gallery Walk — جولة معرض
 * Family: طرائق | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_464 = {
  id: 464,
  titleDe: "Gallery Walk",
  titleAr: "جولة معرض",
  family: "طرائق",
  bloom: "فهم",
  level: "A1-B2",
  research: "Francek 2006",
  desc: "Gallery Walk",
} as const;

export function tool464Gain(a:boolean):number{return a?1.2:1.0;}
export function tool464Check(v:number):boolean{return v>0;}
