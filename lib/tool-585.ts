/**
 * 585 — Boredom Kruk — ملل
 * Family: تلقين | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_585 = {
  id: 585,
  titleDe: "Boredom Kruk",
  titleAr: "ملل",
  family: "تلقين",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Pawlak 2021",
  desc: "Boredom Kruk",
} as const;

export function tool585Gain(a:boolean):number{return a?1.2:1.0;}
export function tool585Check(v:number):boolean{return v>0;}
