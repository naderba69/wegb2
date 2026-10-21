/**
 * 927 — Sociolinguistic Competence — كفاءة اجتماعية
 * Canale 1983: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_927 = { id: 927, titleDe: "Sociolinguistic Competence", titleAr: "كفاءة اجتماعية", family: "تقويم", bloom: "قيّم", level: "B1-B2", research: "Canale 1983", desc: "Sociolinguistic Competence" } as const;
export function tool927Gain(a:boolean):number{return a?1.2:1.0;}
export function tool927Check(v:number):boolean{return v>0;}
