/**
 * 724 — Adaptive Learning — تعلم تكيفي
 * Brusilovsky 2001: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_724 = { id: 724, titleDe: "Adaptive Learning", titleAr: "تعلم تكيفي", family: "طرائق", bloom: "أنشئ", level: "A1-B2", research: "Brusilovsky 2001", desc: "Adaptive Learning" } as const;
export function tool724Gain(a:boolean):number{return a?1.2:1.0;}
export function tool724Check(v:number):boolean{return v>0;}
