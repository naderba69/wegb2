/**
 * 835 — Sheltered Instruction — تعليم محمي
 * Echevarria 1998: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_835 = { id: 835, titleDe: "Sheltered Instruction", titleAr: "تعليم محمي", family: "طرائق", bloom: "فهم", level: "B1-B2", research: "Echevarria 1998", desc: "Sheltered Instruction" } as const;
export function tool835Gain(a:boolean):number{return a?1.2:1.0;}
export function tool835Check(v:number):boolean{return v>0;}
