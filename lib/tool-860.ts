/**
 * 860 — Grounded Cognition Barsalou — معرفة مؤرضة
 * Barsalou 2008: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_860 = { id: 860, titleDe: "Grounded Cognition Barsalou", titleAr: "معرفة مؤرضة", family: "تلقين", bloom: "فهم", level: "A1-B2", research: "Barsalou 2008", desc: "Grounded Cognition Barsalou" } as const;
export function tool860Gain(a:boolean):number{return a?1.2:1.0;}
export function tool860Check(v:number):boolean{return v>0;}
