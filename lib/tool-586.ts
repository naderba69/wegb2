/**
 * 586 — Grit Sudina — مثابرة
 * Family: تلقين | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_586 = {
  id: 586,
  titleDe: "Grit Sudina",
  titleAr: "مثابرة",
  family: "تلقين",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Sudina 2021",
  desc: "Grit Sudina",
} as const;

export function tool586Gain(a:boolean):number{return a?1.2:1.0;}
export function tool586Check(v:number):boolean{return v>0;}
