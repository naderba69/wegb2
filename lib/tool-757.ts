/**
 * 757 — Narrative Inquiry — سرد استقصائي
 * Barkhuizen 2014: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: تلقين
 */
export const TOOL_757 = { id: 757, titleDe: "Narrative Inquiry", titleAr: "سرد استقصائي", family: "تلقين", bloom: "حلّل", level: "B1-B2", research: "Barkhuizen 2014", desc: "Narrative Inquiry" } as const;
export function tool757Gain(a:boolean):number{return a?1.2:1.0;}
export function tool757Check(v:number):boolean{return v>0;}
