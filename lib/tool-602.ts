/**
 * 602 — Tool 602 Concept — مفهوم 602
 * Research 602: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_602 = { id: 602, titleDe: "Tool 602 Concept", titleAr: "مفهوم 602", family: "طرائق", bloom: "فهم", level: "A1-B2", research: "Research 602", desc: "Tool 602" } as const;
export function tool602Gain(a:boolean):number{return a?1.2:1.0;}
export function tool602Check(v:number):boolean{return v>0;}
