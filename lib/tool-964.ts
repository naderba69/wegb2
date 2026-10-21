/**
 * 964 — Mindset Dweck — عقلية دويك
 * Dweck 2006: classroom application
 * Level: A1-B2 | Bloom: قيّم | Family: تلقين
 */
export const TOOL_964 = { id: 964, titleDe: "Mindset Dweck", titleAr: "عقلية دويك", family: "تلقين", bloom: "قيّم", level: "A1-B2", research: "Dweck 2006", desc: "Mindset Dweck" } as const;
export function tool964Gain(a:boolean):number{return a?1.2:1.0;}
export function tool964Check(v:number):boolean{return v>0;}
