/**
 * 938 — Digital Competence DigComp — كفاءة رقمية
 * Ferrari 2013: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: Immersion
 */
export const TOOL_938 = { id: 938, titleDe: "Digital Competence DigComp", titleAr: "كفاءة رقمية", family: "Immersion", bloom: "فهم", level: "A1-B2", research: "Ferrari 2013", desc: "Digital Competence DigComp" } as const;
export function tool938Gain(a:boolean):number{return a?1.2:1.0;}
export function tool938Check(v:number):boolean{return v>0;}
