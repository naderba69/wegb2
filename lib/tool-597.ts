/**
 * 597 — Self-Compassion — تعاطف ذاتي
 * Family: تلقين | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_597 = {
  id: 597,
  titleDe: "Self-Compassion",
  titleAr: "تعاطف ذاتي",
  family: "تلقين",
  bloom: "فهم",
  level: "A1-B2",
  research: "Neff 2003",
  desc: "Self-Compassion",
} as const;

export function tool597Gain(a:boolean):number{return a?1.2:1.0;}
export function tool597Check(v:number):boolean{return v>0;}
