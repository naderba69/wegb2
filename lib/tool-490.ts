/**
 * 490 — Sociolinguistic Competence — كفاءة اجتماعية لغوية
 * Canale 1983: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_490 = { id: 490, titleDe: "Sociolinguistic Competence", titleAr: "كفاءة اجتماعية لغوية", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Canale 1983", desc: "Sociolinguistic Competence" } as const;
export function tool490Gain(a:boolean):number{return a?1.2:1.0;}
export function tool490Check(v:number):boolean{return v>0;}
