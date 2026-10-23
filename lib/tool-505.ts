/**
 * 505 — ERP N400 P600 — جهد دماغي
 * Family: الذاكرة | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_505 = {
  id: 505,
  titleDe: "ERP N400 P600",
  titleAr: "جهد دماغي",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Osterhout 1997",
  desc: "ERP N400 P600",
} as const;

export function tool505Gain(a:boolean):number{return a?1.2:1.0;}
export function tool505Check(v:number):boolean{return v>0;}
