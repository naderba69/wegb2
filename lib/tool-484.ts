/**
 * 484 — Idiomatic Awareness — وعي اصطلاحي
 * Boers 2008: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_484 = { id: 484, titleDe: "Idiomatic Awareness", titleAr: "وعي اصطلاحي", family: "طرائق", bloom: "فهم", level: "B1-B2", research: "Boers 2008", desc: "Idiomatic Awareness" } as const;
export function tool484Gain(a:boolean):number{return a?1.2:1.0;}
export function tool484Check(v:number):boolean{return v>0;}
