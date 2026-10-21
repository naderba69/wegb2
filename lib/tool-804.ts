/**
 * 804 — Private Speech — كلام خاص
 * Vygotsky 1986: classroom application
 * Level: A0-B1 | Bloom: فهم | Family: SLA
 */
export const TOOL_804 = { id: 804, titleDe: "Private Speech", titleAr: "كلام خاص", family: "SLA", bloom: "فهم", level: "A0-B1", research: "Vygotsky 1986", desc: "Private Speech" } as const;
export function tool804Gain(a:boolean):number{return a?1.2:1.0;}
export function tool804Check(v:number):boolean{return v>0;}
