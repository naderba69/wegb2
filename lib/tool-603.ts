/**
 * 603 — Translanguaging Garcia — ترجمة لغوية غارسيا
 * García 2009: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: SLA
 */
export const TOOL_603 = { id: 603, titleDe: "Translanguaging Garcia", titleAr: "ترجمة لغوية غارسيا", family: "SLA", bloom: "أنشئ", level: "A1-B2", research: "García 2009", desc: "Translanguaging Garcia" } as const;
export function tool603Gain(a:boolean):number{return a?1.2:1.0;}
export function tool603Check(v:number):boolean{return v>0;}
