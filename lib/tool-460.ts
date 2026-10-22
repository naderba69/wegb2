/**
 * 460 — Socratic Questioning — أسئلة سقراطية
 * Paul 1995: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: طرائق
 */
export const TOOL_460 = { id: 460, titleDe: "Socratic Questioning", titleAr: "أسئلة سقراطية", family: "طرائق", bloom: "قيّم", level: "B1-B2", research: "Paul 1995", desc: "Socratic Questioning" } as const;
export function tool460Gain(a:boolean):number{return a?1.2:1.0;}
export function tool460Check(v:number):boolean{return v>0;}
