/**
 * 718 — Peer Feedback Hyland — تغذية أقران هايلاند
 * Hyland 2006: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_718 = { id: 718, titleDe: "Peer Feedback Hyland", titleAr: "تغذية أقران هايلاند", family: "تقويم", bloom: "قيّم", level: "B1-B2", research: "Hyland 2006", desc: "Peer Feedback Hyland" } as const;
export function tool718Gain(a:boolean):number{return a?1.2:1.0;}
export function tool718Check(v:number):boolean{return v>0;}
