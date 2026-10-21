/**
 * 714 — Consciousness Raising Rutherford — رفع وعي
 * Rutherford 1987: classroom application
 * Level: A2-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_714 = { id: 714, titleDe: "Consciousness Raising Rutherford", titleAr: "رفع وعي", family: "SLA", bloom: "حلّل", level: "A2-B2", research: "Rutherford 1987", desc: "Consciousness Raising Rutherford" } as const;
export function tool714Gain(a:boolean):number{return a?1.2:1.0;}
export function tool714Check(v:number):boolean{return v>0;}
