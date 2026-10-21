/**
 * 984 — Case-Based Learning — تعلم مبني حالة
 * Herreid 2011: classroom application
 * Level: B1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_984 = { id: 984, titleDe: "Case-Based Learning", titleAr: "تعلم مبني حالة", family: "طرائق", bloom: "أنشئ", level: "B1-B2", research: "Herreid 2011", desc: "Case-Based Learning" } as const;
export function tool984Gain(a:boolean):number{return a?1.2:1.0;}
export function tool984Check(v:number):boolean{return v>0;}
