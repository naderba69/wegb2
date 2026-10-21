/**
 * 867 — Animacy Effect — أثر حيوية
 * Nairne 2013: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_867 = { id: 867, titleDe: "Animacy Effect", titleAr: "أثر حيوية", family: "الذاكرة", bloom: "فهم", level: "A1-B2", research: "Nairne 2013", desc: "Animacy Effect" } as const;
export function tool867Gain(a:boolean):number{return a?1.2:1.0;}
export function tool867Check(v:number):boolean{return v>0;}
