/**
 * 851 — Testing Effect Karpicke — أثر اختبار كاربيكي
 * Family: الذاكرة | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_851 = {
  id: 851,
  titleDe: "Testing Effect Karpicke",
  titleAr: "أثر اختبار كاربيكي",
  family: "الذاكرة",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Karpicke 2008",
  desc: "Testing Effect Karpicke",
} as const;

export function tool851Gain(a:boolean):number{return a?1.2:1.0;}
export function tool851Check(v:number):boolean{return v>0;}
