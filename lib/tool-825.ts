/**
 * 825 — i+1 Krashen — مدخلات+1
 * Krashen 1982: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_825 = { id: 825, titleDe: "i+1 Krashen", titleAr: "مدخلات+1", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Krashen 1982", desc: "i+1 Krashen" } as const;
export function tool825Gain(a:boolean):number{return a?1.2:1.0;}
export function tool825Check(v:number):boolean{return v>0;}
