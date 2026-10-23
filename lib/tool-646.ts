/**
 * 646 — Vocabulary Size Nation — حجم مفردات ناشن
 * Family: الذاكرة | Bloom: قيّم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_646 = {
  id: 646,
  titleDe: "Vocabulary Size Nation",
  titleAr: "حجم مفردات ناشن",
  family: "الذاكرة",
  bloom: "قيّم",
  level: "A0-B2",
  research: "Nation 2006",
  desc: "Vocabulary Size Nation",
} as const;

export function tool646Gain(a:boolean):number{return a?1.2:1.0;}
export function tool646Check(v:number):boolean{return v>0;}
