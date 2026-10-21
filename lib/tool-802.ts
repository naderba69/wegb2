/**
 * 802 — Zone of Proximal Development 2 — منطقة قريبة 2
 * Vygotsky 1978: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_802 = { id: 802, titleDe: "Zone of Proximal Development 2", titleAr: "منطقة قريبة 2", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Vygotsky 1978", desc: "Zone of Proximal Development 2" } as const;
export function tool802Gain(a:boolean):number{return a?1.2:1.0;}
export function tool802Check(v:number):boolean{return v>0;}
