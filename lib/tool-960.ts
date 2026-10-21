/**
 * 960 — Tool 960 Concept — مفهوم 960
 * Research 960: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_960 = { id: 960, titleDe: "Tool 960 Concept", titleAr: "مفهوم 960", family: "طرائق", bloom: "فهم", level: "A1-B2", research: "Research 960", desc: "Tool 960" } as const;
export function tool960Gain(a:boolean):number{return a?1.2:1.0;}
export function tool960Check(v:number):boolean{return v>0;}
