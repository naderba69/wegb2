/**
 * 698 — Implicit Pragmatic Instruction — تداولي ضمني
 * Taguchi 2015: classroom application
 * Level: B1-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_698 = { id: 698, titleDe: "Implicit Pragmatic Instruction", titleAr: "تداولي ضمني", family: "طرائق", bloom: "طبّق", level: "B1-B2", research: "Taguchi 2015", desc: "Implicit Pragmatic Instruction" } as const;
export function tool698Gain(a:boolean):number{return a?1.2:1.0;}
export function tool698Check(v:number):boolean{return v>0;}
