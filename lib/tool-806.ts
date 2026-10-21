/**
 * 806 — Dialogic Teaching — تدريس حواري
 * Alexander 2008: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_806 = { id: 806, titleDe: "Dialogic Teaching", titleAr: "تدريس حواري", family: "طرائق", bloom: "أنشئ", level: "A1-B2", research: "Alexander 2008", desc: "Dialogic Teaching" } as const;
export function tool806Gain(a:boolean):number{return a?1.2:1.0;}
export function tool806Check(v:number):boolean{return v>0;}
