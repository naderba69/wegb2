/**
 * 374 — Processing Instruction — تعليم المعالجة
 * Family: SLA | Bloom: طبّق | Level: A2-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_374 = {
  id: 374,
  titleDe: "Processing Instruction",
  titleAr: "تعليم المعالجة",
  family: "SLA",
  bloom: "طبّق",
  level: "A2-B1",
  research: "VanPatten 2004",
  desc: "Processing Instruction classroom",
} as const;

export function tool374Gain(a: boolean): number { return a?1.2:1.0; }
export function tool374Check(v:number):boolean { return v>0; }
