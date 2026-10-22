/**
 * 569 — Cultural Intelligence — ذكاء ثقافي
 * Earley 2003: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: Immersion
 */
export const TOOL_569 = { id: 569, titleDe: "Cultural Intelligence", titleAr: "ذكاء ثقافي", family: "Immersion", bloom: "حلّل", level: "B1-B2", research: "Earley 2003", desc: "Cultural Intelligence" } as const;
export function tool569Gain(a:boolean):number{return a?1.2:1.0;}
export function tool569Check(v:number):boolean{return v>0;}
