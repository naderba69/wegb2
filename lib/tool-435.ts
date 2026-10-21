/**
 * 435 — Attention to Form — انتباه للشكل
 * Doughty 2001: classroom application
 * Level: A2-B1 | Bloom: فهم | Family: SLA
 */
export const TOOL_435 = { id: 435, titleDe: "Attention to Form", titleAr: "انتباه للشكل", family: "SLA", bloom: "فهم", level: "A2-B1", research: "Doughty 2001", desc: "Attention to Form" } as const;
export function tool435Gain(a:boolean):number{return a?1.2:1.0;}
export function tool435Check(v:number):boolean{return v>0;}
