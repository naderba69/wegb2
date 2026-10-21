/**
 * 822 — Negotiation of Meaning — تفاوض معنى
 * Pica 1994: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_822 = { id: 822, titleDe: "Negotiation of Meaning", titleAr: "تفاوض معنى", family: "SLA", bloom: "حلّل", level: "A1-B2", research: "Pica 1994", desc: "Negotiation of Meaning" } as const;
export function tool822Gain(a:boolean):number{return a?1.2:1.0;}
export function tool822Check(v:number):boolean{return v>0;}
