/**
 * 408 — Peer Correction — تصحيح الأقران
 * Edge 1989: classroom application with tasks
 * Level: A2-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_408 = {
  id: 408,
  titleDe: "Peer Correction",
  titleAr: "تصحيح الأقران",
  family: "تقويم",
  bloom: "قيّم",
  level: "A2-B2",
  research: "Edge 1989",
  desc: "Peer Correction classroom",
} as const;
export function tool408Gain(a:boolean):number{return a?1.2:1.0;}
export function tool408Check(v:number):boolean{return v>0;}
