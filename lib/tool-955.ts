/**
 * 955 — Directed Motivational Currents — تيارات دافعية
 * Dörnyei 2016: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: تلقين
 */
export const TOOL_955 = { id: 955, titleDe: "Directed Motivational Currents", titleAr: "تيارات دافعية", family: "تلقين", bloom: "أنشئ", level: "B1-B2", research: "Dörnyei 2016", desc: "Directed Motivational Currents" } as const;
export function tool955Gain(a:boolean):number{return a?1.2:1.0;}
export function tool955Check(v:number):boolean{return v>0;}
