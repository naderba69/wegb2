/**
 * 593 — Writing Anxiety — قلق كتابة
 * Cheng 2004: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_593 = { id: 593, titleDe: "Writing Anxiety", titleAr: "قلق كتابة", family: "SLA", bloom: "حلّل", level: "B1-B2", research: "Cheng 2004", desc: "Writing Anxiety" } as const;
export function tool593Gain(a:boolean):number{return a?1.2:1.0;}
export function tool593Check(v:number):boolean{return v>0;}
