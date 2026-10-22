/**
 * 836 — SIOP Model — نموذج سيوب
 * Echevarria 2008: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_836 = { id: 836, titleDe: "SIOP Model", titleAr: "نموذج سيوب", family: "طرائق", bloom: "حلّل", level: "B1-B2", research: "Echevarria 2008", desc: "SIOP Model" } as const;
export function tool836Gain(a:boolean):number{return a?1.2:1.0;}
export function tool836Check(v:number):boolean{return v>0;}
