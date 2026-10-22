/**
 * 736 — Languaculture Agar — ثقافة لغة
 * Agar 1994: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: Immersion
 */
export const TOOL_736 = { id: 736, titleDe: "Languaculture Agar", titleAr: "ثقافة لغة", family: "Immersion", bloom: "فهم", level: "A1-B2", research: "Agar 1994", desc: "Languaculture Agar" } as const;
export function tool736Gain(a:boolean):number{return a?1.2:1.0;}
export function tool736Check(v:number):boolean{return v>0;}
