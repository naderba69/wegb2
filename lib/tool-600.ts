/**
 * 600 — PERMA — نموذج بيرما
 * Family: تلقين | Bloom: أنشئ | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_600 = {
  id: 600,
  titleDe: "PERMA",
  titleAr: "نموذج بيرما",
  family: "تلقين",
  bloom: "أنشئ",
  level: "A0-B2",
  research: "Seligman 2011",
  desc: "PERMA",
} as const;

export function tool600Gain(a:boolean):number{return a?1.2:1.0;}
export function tool600Check(v:number):boolean{return v>0;}
