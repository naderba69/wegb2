/**
 * 493 — Curriculum Evaluation — تقويم منهج
 * Brown 1995: classroom application
 * Level: A0-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_493 = { id: 493, titleDe: "Curriculum Evaluation", titleAr: "تقويم منهج", family: "تقويم", bloom: "قيّم", level: "A0-B2", research: "Brown 1995", desc: "Curriculum Evaluation" } as const;
export function tool493Gain(a:boolean):number{return a?1.2:1.0;}
export function tool493Check(v:number):boolean{return v>0;}
