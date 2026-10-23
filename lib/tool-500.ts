/**
 * 500 — DSH Prep — تحضير DSH
 * Family: تقويم | Bloom: طبّق | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_500 = {
  id: 500,
  titleDe: "DSH Prep",
  titleAr: "تحضير DSH",
  family: "تقويم",
  bloom: "طبّق",
  level: "B1-B2",
  research: "DSH 2019",
  desc: "DSH Prep",
} as const;

export function tool500Gain(a:boolean):number{return a?1.2:1.0;}
export function tool500Check(v:number):boolean{return v>0;}
