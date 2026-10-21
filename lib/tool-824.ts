/**
 * 824 — Comprehensible Output Swain — مخرجات مفهومة
 * Swain 1985: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: SLA
 */
export const TOOL_824 = { id: 824, titleDe: "Comprehensible Output Swain", titleAr: "مخرجات مفهومة", family: "SLA", bloom: "أنشئ", level: "A1-B2", research: "Swain 1985", desc: "Comprehensible Output Swain" } as const;
export function tool824Gain(a:boolean):number{return a?1.2:1.0;}
export function tool824Check(v:number):boolean{return v>0;}
