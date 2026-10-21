/**
 * 819 — Implicit Feedback — تغذية ضمنية
 * Ellis 2016: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_819 = { id: 819, titleDe: "Implicit Feedback", titleAr: "تغذية ضمنية", family: "SLA", bloom: "طبّق", level: "A1-B2", research: "Ellis 2016", desc: "Implicit Feedback" } as const;
export function tool819Gain(a:boolean):number{return a?1.2:1.0;}
export function tool819Check(v:number):boolean{return v>0;}
