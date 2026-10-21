/**
 * 706 — Intercultural Rhetoric — بلاغة بين ثقافية
 * Connor 2011: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: Immersion
 */
export const TOOL_706 = { id: 706, titleDe: "Intercultural Rhetoric", titleAr: "بلاغة بين ثقافية", family: "Immersion", bloom: "حلّل", level: "B1-B2", research: "Connor 2011", desc: "Intercultural Rhetoric" } as const;
export function tool706Gain(a:boolean):number{return a?1.2:1.0;}
export function tool706Check(v:number):boolean{return v>0;}
