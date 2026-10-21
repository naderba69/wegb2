/**
 * 703 — Rhetorical Structure — بنية بلاغية
 * Mann 1988: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_703 = { id: 703, titleDe: "Rhetorical Structure", titleAr: "بنية بلاغية", family: "طرائق", bloom: "حلّل", level: "B1-B2", research: "Mann 1988", desc: "Rhetorical Structure" } as const;
export function tool703Gain(a:boolean):number{return a?1.2:1.0;}
export function tool703Check(v:number):boolean{return v>0;}
