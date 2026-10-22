/**
 * 600 — PERMA — نموذج بيرما
 * Seligman 2011: classroom application
 * Level: A0-B2 | Bloom: أنشئ | Family: تلقين
 */
export const TOOL_600 = { id: 600, titleDe: "PERMA", titleAr: "نموذج بيرما", family: "تلقين", bloom: "أنشئ", level: "A0-B2", research: "Seligman 2011", desc: "PERMA" } as const;
export function tool600Gain(a:boolean):number{return a?1.2:1.0;}
export function tool600Check(v:number):boolean{return v>0;}
