/**
 * 582 — Willingness to Speak — استعداد كلام
 * Yashima 2002: classroom application
 * Level: B1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_582 = { id: 582, titleDe: "Willingness to Speak", titleAr: "استعداد كلام", family: "SLA", bloom: "طبّق", level: "B1-B2", research: "Yashima 2002", desc: "Willingness to Speak" } as const;
export function tool582Gain(a:boolean):number{return a?1.2:1.0;}
export function tool582Check(v:number):boolean{return v>0;}
