/**
 * 773 — CLIL Matrix Coyle — مصفوفة كليل
 * Coyle 2010: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_773 = { id: 773, titleDe: "CLIL Matrix Coyle", titleAr: "مصفوفة كليل", family: "طرائق", bloom: "حلّل", level: "B1-B2", research: "Coyle 2010", desc: "CLIL Matrix Coyle" } as const;
export function tool773Gain(a:boolean):number{return a?1.2:1.0;}
export function tool773Check(v:number):boolean{return v>0;}
