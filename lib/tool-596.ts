/**
 * 596 — Perfectionism — كمالية
 * Gregersen 2014: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: تلقين
 */
export const TOOL_596 = { id: 596, titleDe: "Perfectionism", titleAr: "كمالية", family: "تلقين", bloom: "قيّم", level: "B1-B2", research: "Gregersen 2014", desc: "Perfectionism" } as const;
export function tool596Gain(a:boolean):number{return a?1.2:1.0;}
export function tool596Check(v:number):boolean{return v>0;}
