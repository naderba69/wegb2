/**
 * 774 — Language Triptych — ثلاثية لغوية
 * Coyle 2010: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_774 = { id: 774, titleDe: "Language Triptych", titleAr: "ثلاثية لغوية", family: "طرائق", bloom: "فهم", level: "B1-B2", research: "Coyle 2010", desc: "Language Triptych" } as const;
export function tool774Gain(a:boolean):number{return a?1.2:1.0;}
export function tool774Check(v:number):boolean{return v>0;}
