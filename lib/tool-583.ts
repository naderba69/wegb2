/**
 * 583 — Foreign Language Anxiety — قلق لغة أجنبية
 * Horwitz 1986: classroom application
 * Level: A0-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_583 = { id: 583, titleDe: "Foreign Language Anxiety", titleAr: "قلق لغة أجنبية", family: "SLA", bloom: "حلّل", level: "A0-B2", research: "Horwitz 1986", desc: "Foreign Language Anxiety" } as const;
export function tool583Gain(a:boolean):number{return a?1.2:1.0;}
export function tool583Check(v:number):boolean{return v>0;}
