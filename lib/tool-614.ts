/**
 * 614 — Legitimate Peripheral Participation — مشاركة هامشية
 * Lave 1991: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_614 = { id: 614, titleDe: "Legitimate Peripheral Participation", titleAr: "مشاركة هامشية", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Lave 1991", desc: "Legitimate Peripheral Participation" } as const;
export function tool614Gain(a:boolean):number{return a?1.2:1.0;}
export function tool614Check(v:number):boolean{return v>0;}
