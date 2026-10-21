/**
 * 962 — Tool 962 Concept — مفهوم 962
 * Research 962: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_962 = { id: 962, titleDe: "Tool 962 Concept", titleAr: "مفهوم 962", family: "طرائق", bloom: "فهم", level: "A1-B2", research: "Research 962", desc: "Tool 962" } as const;
export function tool962Gain(a:boolean):number{return a?1.2:1.0;}
export function tool962Check(v:number):boolean{return v>0;}
