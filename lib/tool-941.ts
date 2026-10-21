/**
 * 941 — Task Design Ellis — تصميم مهام إليس
 * Ellis 2003: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_941 = { id: 941, titleDe: "Task Design Ellis", titleAr: "تصميم مهام إليس", family: "طرائق", bloom: "أنشئ", level: "B1-B2", research: "Ellis 2003", desc: "Task Design Ellis" } as const;
export function tool941Gain(a:boolean):number{return a?1.2:1.0;}
export function tool941Check(v:number):boolean{return v>0;}
