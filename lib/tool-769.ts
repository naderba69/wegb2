/**
 * 769 — Translanguaging Space — فضاء ترجمة
 * Li Wei 2011: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: SLA
 */
export const TOOL_769 = { id: 769, titleDe: "Translanguaging Space", titleAr: "فضاء ترجمة", family: "SLA", bloom: "أنشئ", level: "A1-B2", research: "Li Wei 2011", desc: "Translanguaging Space" } as const;
export function tool769Gain(a:boolean):number{return a?1.2:1.0;}
export function tool769Check(v:number):boolean{return v>0;}
