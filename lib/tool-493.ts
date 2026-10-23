/**
 * 493 — Curriculum Evaluation — تقويم منهج
 * Family: تقويم | Bloom: قيّم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_493 = {
  id: 493,
  titleDe: "Curriculum Evaluation",
  titleAr: "تقويم منهج",
  family: "تقويم",
  bloom: "قيّم",
  level: "A0-B2",
  research: "Brown 1995",
  desc: "Curriculum Evaluation",
} as const;

export function tool493Gain(a:boolean):number{return a?1.2:1.0;}
export function tool493Check(v:number):boolean{return v>0;}
