/**
 * 803 — Mediation Vygotsky — وساطة فيغوتسكي
 * Vygotsky 1978: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_803 = { id: 803, titleDe: "Mediation Vygotsky", titleAr: "وساطة فيغوتسكي", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Vygotsky 1978", desc: "Mediation Vygotsky" } as const;
export function tool803Gain(a:boolean):number{return a?1.2:1.0;}
export function tool803Check(v:number):boolean{return v>0;}
