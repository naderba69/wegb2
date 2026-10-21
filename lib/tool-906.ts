/**
 * 906 — Code-Switching Cost — تناوب تكلفة
 * Bullock 2009: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_906 = { id: 906, titleDe: "Code-Switching Cost", titleAr: "تناوب تكلفة", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Bullock 2009", desc: "Code-Switching Cost" } as const;
export function tool906Gain(a:boolean):number{return a?1.2:1.0;}
export function tool906Check(v:number):boolean{return v>0;}
