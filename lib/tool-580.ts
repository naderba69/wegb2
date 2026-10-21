/**
 * 580 — Ought-to L2 Self — ذات يجب
 * Dörnyei 2005: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_580 = { id: 580, titleDe: "Ought-to L2 Self", titleAr: "ذات يجب", family: "تلقين", bloom: "فهم", level: "A1-B2", research: "Dörnyei 2005", desc: "Ought-to L2 Self" } as const;
export function tool580Gain(a:boolean):number{return a?1.2:1.0;}
export function tool580Check(v:number):boolean{return v>0;}
