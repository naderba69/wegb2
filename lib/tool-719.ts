/**
 * 719 — Self-Feedback — تغذية ذاتية
 * Family: تلقين | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_719 = {
  id: 719,
  titleDe: "Self-Feedback",
  titleAr: "تغذية ذاتية",
  family: "تلقين",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Boud 1995",
  desc: "Self-Feedback",
} as const;

export function tool719Gain(a:boolean):number{return a?1.2:1.0;}
export function tool719Check(v:number):boolean{return v>0;}
