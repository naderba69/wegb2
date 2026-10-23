/**
 * 536 — Involvement Load — عبء انخراط
 * Family: الذاكرة | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_536 = {
  id: 536,
  titleDe: "Involvement Load",
  titleAr: "عبء انخراط",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Laufer 2001",
  desc: "Involvement Load",
} as const;

export function tool536Gain(a:boolean):number{return a?1.2:1.0;}
export function tool536Check(v:number):boolean{return v>0;}
