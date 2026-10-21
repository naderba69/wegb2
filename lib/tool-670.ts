/**
 * 670 — Ideophones — كلمات تصويرية
 * Dingemanse 2018: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_670 = { id: 670, titleDe: "Ideophones", titleAr: "كلمات تصويرية", family: "طرائق", bloom: "فهم", level: "A1-B2", research: "Dingemanse 2018", desc: "Ideophones" } as const;
export function tool670Gain(a:boolean):number{return a?1.2:1.0;}
export function tool670Check(v:number):boolean{return v>0;}
