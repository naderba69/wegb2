/**
 * 479 — Tandem Online — ثنائي عبر إنترنت
 * O Rourke 2007: classroom application
 * Level: A2-B2 | Bloom: طبّق | Family: Immersion
 */
export const TOOL_479 = { id: 479, titleDe: "Tandem Online", titleAr: "ثنائي عبر إنترنت", family: "Immersion", bloom: "طبّق", level: "A2-B2", research: "O Rourke 2007", desc: "Tandem Online" } as const;
export function tool479Gain(a:boolean):number{return a?1.2:1.0;}
export function tool479Check(v:number):boolean{return v>0;}
