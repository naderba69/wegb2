/**
 * 962 — Flow Csikszentmihalyi — تدفق تشيكسنتميهالي
 * Csikszentmihalyi 1990: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_962 = { id: 962, titleDe: "Flow Csikszentmihalyi", titleAr: "تدفق تشيكسنتميهالي", family: "تلقين", bloom: "فهم", level: "A1-B2", research: "Csikszentmihalyi 1990", desc: "Flow Csikszentmihalyi" } as const;
export function tool962Gain(a:boolean):number{return a?1.2:1.0;}
export function tool962Check(v:number):boolean{return v>0;}
