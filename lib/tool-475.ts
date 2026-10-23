/**
 * 475 — Quest Design Advanced — تصميم مهام متقدم
 * Family: Gamification | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_475 = {
  id: 475,
  titleDe: "Quest Design Advanced",
  titleAr: "تصميم مهام متقدم",
  family: "Gamification",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Dickey 2007",
  desc: "Quest Design Advanced",
} as const;

export function tool475Gain(a:boolean):number{return a?1.2:1.0;}
export function tool475Check(v:number):boolean{return v>0;}
