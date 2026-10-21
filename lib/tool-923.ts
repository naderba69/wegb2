/**
 * 923 — Metalinguistic Awareness — وعي فوق لغوي
 * Jessner 2008: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_923 = { id: 923, titleDe: "Metalinguistic Awareness", titleAr: "وعي فوق لغوي", family: "SLA", bloom: "حلّل", level: "A1-B2", research: "Jessner 2008", desc: "Metalinguistic Awareness" } as const;
export function tool923Gain(a:boolean):number{return a?1.2:1.0;}
export function tool923Check(v:number):boolean{return v>0;}
