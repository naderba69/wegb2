/**
 * 953 — Ought-to L2 Self 2 — ذات يجب 2
 * Dörnyei 2009: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_953 = { id: 953, titleDe: "Ought-to L2 Self 2", titleAr: "ذات يجب 2", family: "تلقين", bloom: "فهم", level: "A1-B2", research: "Dörnyei 2009", desc: "Ought-to L2 Self 2" } as const;
export function tool953Gain(a:boolean):number{return a?1.2:1.0;}
export function tool953Check(v:number):boolean{return v>0;}
