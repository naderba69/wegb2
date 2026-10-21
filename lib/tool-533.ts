/**
 * 533 — Explicit Learning — تعلم صريح
 * Ellis 2015: classroom application with research-based tasks
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_533 = { id: 533, titleDe: "Explicit Learning", titleAr: "تعلم صريح", family: "SLA", bloom: "حلّل", level: "A1-B2", research: "Ellis 2015", desc: "Explicit Learning" } as const;
export function tool533Gain(a:boolean):number{return a?1.2:1.0;}
export function tool533Check(v:number):boolean{return v>0;}
