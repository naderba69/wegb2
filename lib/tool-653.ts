/**
 * 653 — Technical Vocabulary — مفردات تقنية
 * Nation 2016: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_653 = { id: 653, titleDe: "Technical Vocabulary", titleAr: "مفردات تقنية", family: "طرائق", bloom: "فهم", level: "B1-B2", research: "Nation 2016", desc: "Technical Vocabulary" } as const;
export function tool653Gain(a:boolean):number{return a?1.2:1.0;}
export function tool653Check(v:number):boolean{return v>0;}
