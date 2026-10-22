/**
 * 719 — Self-Feedback — تغذية ذاتية
 * Boud 1995: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: تلقين
 */
export const TOOL_719 = { id: 719, titleDe: "Self-Feedback", titleAr: "تغذية ذاتية", family: "تلقين", bloom: "قيّم", level: "B1-B2", research: "Boud 1995", desc: "Self-Feedback" } as const;
export function tool719Gain(a:boolean):number{return a?1.2:1.0;}
export function tool719Check(v:number):boolean{return v>0;}
