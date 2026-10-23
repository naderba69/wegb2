/**
 * 476 — Narrative Branching — تفرع سردي
 * Family: Narrative | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_476 = {
  id: 476,
  titleDe: "Narrative Branching",
  titleAr: "تفرع سردي",
  family: "Narrative",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Cover 2010",
  desc: "Narrative Branching",
} as const;

export function tool476Gain(a:boolean):number{return a?1.2:1.0;}
export function tool476Check(v:number):boolean{return v>0;}
