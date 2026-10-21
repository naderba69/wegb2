/**
 * 441 — Usage-Based Acquisition — اكتساب قائم على الاستعمال
 * Tomasello 2003: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_441 = { id: 441, titleDe: "Usage-Based Acquisition", titleAr: "اكتساب قائم على الاستعمال", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Tomasello 2003", desc: "Usage-Based Acquisition" } as const;
export function tool441Gain(a:boolean):number{return a?1.2:1.0;}
export function tool441Check(v:number):boolean{return v>0;}
