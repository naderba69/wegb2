/**
 * 792 — Sign Language Interpreting — ترجمة إشارة
 * Napier 2006: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: Immersion
 */
export const TOOL_792 = { id: 792, titleDe: "Sign Language Interpreting", titleAr: "ترجمة إشارة", family: "Immersion", bloom: "طبّق", level: "A1-B2", research: "Napier 2006", desc: "Sign Language Interpreting" } as const;
export function tool792Gain(a:boolean):number{return a?1.2:1.0;}
export function tool792Check(v:number):boolean{return v>0;}
