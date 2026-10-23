/**
 * 805 — Inner Speech — كلام داخلي
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_805 = {
  id: 805,
  titleDe: "Inner Speech",
  titleAr: "كلام داخلي",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Vygotsky 1986",
  desc: "Inner Speech",
} as const;

export function tool805Gain(a:boolean):number{return a?1.2:1.0;}
export function tool805Check(v:number):boolean{return v>0;}
