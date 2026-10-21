/**
 * 795 — Visual Literacy — محو بصري
 * Kress 2006: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_795 = { id: 795, titleDe: "Visual Literacy", titleAr: "محو بصري", family: "طرائق", bloom: "فهم", level: "A1-B2", research: "Kress 2006", desc: "Visual Literacy" } as const;
export function tool795Gain(a:boolean):number{return a?1.2:1.0;}
export function tool795Check(v:number):boolean{return v>0;}
