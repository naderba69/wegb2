/**
 * 601 — EMI — تدريس بالإنجليزية
 * Dearden 2015: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_601 = { id: 601, titleDe: "EMI", titleAr: "تدريس بالإنجليزية", family: "طرائق", bloom: "فهم", level: "B1-B2", research: "Dearden 2015", desc: "EMI" } as const;
export function tool601Gain(a:boolean):number{return a?1.2:1.0;}
export function tool601Check(v:number):boolean{return v>0;}
