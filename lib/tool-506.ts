/**
 * 506 — fMRI Language — تصوير دماغي
 * Ullman 2005: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: الذاكرة
 */
export const TOOL_506 = { id: 506, titleDe: "fMRI Language", titleAr: "تصوير دماغي", family: "الذاكرة", bloom: "حلّل", level: "A1-B2", research: "Ullman 2005", desc: "fMRI Language" } as const;
export function tool506Gain(a:boolean):number{return a?1.2:1.0;}
export function tool506Check(v:number):boolean{return v>0;}
