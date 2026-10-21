/**
 * 960 — Autonomy Little — استقلالية ليتل
 * Little 1991: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: تلقين
 */
export const TOOL_960 = { id: 960, titleDe: "Autonomy Little", titleAr: "استقلالية ليتل", family: "تلقين", bloom: "أنشئ", level: "A1-B2", research: "Little 1991", desc: "Autonomy Little" } as const;
export function tool960Gain(a:boolean):number{return a?1.2:1.0;}
export function tool960Check(v:number):boolean{return v>0;}
