/**
 * 591 — Listening Anxiety — قلق استماع
 * Vogely 1998: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_591 = { id: 591, titleDe: "Listening Anxiety", titleAr: "قلق استماع", family: "SLA", bloom: "حلّل", level: "A1-B2", research: "Vogely 1998", desc: "Listening Anxiety" } as const;
export function tool591Gain(a:boolean):number{return a?1.2:1.0;}
export function tool591Check(v:number):boolean{return v>0;}
