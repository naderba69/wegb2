/**
 * 590 — Mindfulness Mercer — يقظة
 * Family: تلقين | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_590 = {
  id: 590,
  titleDe: "Mindfulness Mercer",
  titleAr: "يقظة",
  family: "تلقين",
  bloom: "فهم",
  level: "A1-B2",
  research: "Mercer 2016",
  desc: "Mindfulness Mercer",
} as const;

export function tool590Gain(a:boolean):number{return a?1.2:1.0;}
export function tool590Check(v:number):boolean{return v>0;}
