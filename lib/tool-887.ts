/**
 * 887 — Guessing from Context — تخمين من سياق
 * Nation 2001: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: الذاكرة
 */
export const TOOL_887 = { id: 887, titleDe: "Guessing from Context", titleAr: "تخمين من سياق", family: "الذاكرة", bloom: "طبّق", level: "A1-B2", research: "Nation 2001", desc: "Guessing from Context" } as const;
export function tool887Gain(a:boolean):number{return a?1.2:1.0;}
export function tool887Check(v:number):boolean{return v>0;}
