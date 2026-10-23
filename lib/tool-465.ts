/**
 * 465 — Station Rotation — تناوب محطات
 * Family: طرائق | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_465 = {
  id: 465,
  titleDe: "Station Rotation",
  titleAr: "تناوب محطات",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Horn 2014",
  desc: "Station Rotation",
} as const;

export function tool465Gain(a:boolean):number{return a?1.2:1.0;}
export function tool465Check(v:number):boolean{return v>0;}
