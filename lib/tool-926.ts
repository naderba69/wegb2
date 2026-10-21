/**
 * 926 — Critical Language Awareness — وعي نقدي
 * Fairclough 1992: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: Immersion
 */
export const TOOL_926 = { id: 926, titleDe: "Critical Language Awareness", titleAr: "وعي نقدي", family: "Immersion", bloom: "قيّم", level: "B1-B2", research: "Fairclough 1992", desc: "Critical Language Awareness" } as const;
export function tool926Gain(a:boolean):number{return a?1.2:1.0;}
export function tool926Check(v:number):boolean{return v>0;}
