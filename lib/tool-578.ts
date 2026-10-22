/**
 * 578 — L2 Motivational Self — ذات دافعية
 * Dörnyei 2009: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: تلقين
 */
export const TOOL_578 = { id: 578, titleDe: "L2 Motivational Self", titleAr: "ذات دافعية", family: "تلقين", bloom: "حلّل", level: "A1-B2", research: "Dörnyei 2009", desc: "L2 Motivational Self" } as const;
export function tool578Gain(a:boolean):number{return a?1.2:1.0;}
export function tool578Check(v:number):boolean{return v>0;}
