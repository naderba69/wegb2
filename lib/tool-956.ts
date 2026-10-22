/**
 * 956 — Vision Theory — نظرية رؤية
 * Dörnyei 2014: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_956 = { id: 956, titleDe: "Vision Theory", titleAr: "نظرية رؤية", family: "تلقين", bloom: "فهم", level: "B1-B2", research: "Dörnyei 2014", desc: "Vision Theory" } as const;
export function tool956Gain(a:boolean):number{return a?1.2:1.0;}
export function tool956Check(v:number):boolean{return v>0;}
