/**
 * 720 — Automated Feedback — تغذية آلية
 * Shermis 2013: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: Gamification
 */
export const TOOL_720 = { id: 720, titleDe: "Automated Feedback", titleAr: "تغذية آلية", family: "Gamification", bloom: "طبّق", level: "A1-B2", research: "Shermis 2013", desc: "Automated Feedback" } as const;
export function tool720Gain(a:boolean):number{return a?1.2:1.0;}
export function tool720Check(v:number):boolean{return v>0;}
