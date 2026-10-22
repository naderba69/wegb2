/**
 * 726 — Differentiated Instruction — تعليم متمايز
 * Tomlinson 2014: classroom application
 * Level: A0-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_726 = { id: 726, titleDe: "Differentiated Instruction", titleAr: "تعليم متمايز", family: "طرائق", bloom: "أنشئ", level: "A0-B2", research: "Tomlinson 2014", desc: "Differentiated Instruction" } as const;
export function tool726Gain(a:boolean):number{return a?1.2:1.0;}
export function tool726Check(v:number):boolean{return v>0;}
