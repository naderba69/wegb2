/**
 * 930 — Interactional Competence — كفاءة تفاعلية
 * Young 1999: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: تقويم
 */
export const TOOL_930 = { id: 930, titleDe: "Interactional Competence", titleAr: "كفاءة تفاعلية", family: "تقويم", bloom: "أنشئ", level: "A1-B2", research: "Young 1999", desc: "Interactional Competence" } as const;
export function tool930Gain(a:boolean):number{return a?1.2:1.0;}
export function tool930Check(v:number):boolean{return v>0;}
