/**
 * 963 — Grit Duckworth — مثابرة دكوورث
 * Family: تلقين | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_963 = {
  id: 963,
  titleDe: "Grit Duckworth",
  titleAr: "مثابرة دكوورث",
  family: "تلقين",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Duckworth 2007",
  desc: "Grit Duckworth",
} as const;

export function tool963Gain(a:boolean):number{return a?1.2:1.0;}
export function tool963Check(v:number):boolean{return v>0;}
