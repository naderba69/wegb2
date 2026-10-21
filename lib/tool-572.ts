/**
 * 572 — Perspective Taking — اتخاذ منظور
 * Selman 1980: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: Immersion
 */
export const TOOL_572 = { id: 572, titleDe: "Perspective Taking", titleAr: "اتخاذ منظور", family: "Immersion", bloom: "حلّل", level: "B1-B2", research: "Selman 1980", desc: "Perspective Taking" } as const;
export function tool572Gain(a:boolean):number{return a?1.2:1.0;}
export function tool572Check(v:number):boolean{return v>0;}
