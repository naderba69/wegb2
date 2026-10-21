/**
 * 871 — Spacing Effect Ebbinghaus — أثر تباعد إبنغهاوس
 * Ebbinghaus 1885: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: الذاكرة
 */
export const TOOL_871 = { id: 871, titleDe: "Spacing Effect Ebbinghaus", titleAr: "أثر تباعد إبنغهاوس", family: "الذاكرة", bloom: "طبّق", level: "A1-B2", research: "Ebbinghaus 1885", desc: "Spacing Effect Ebbinghaus" } as const;
export function tool871Gain(a:boolean):number{return a?1.2:1.0;}
export function tool871Check(v:number):boolean{return v>0;}
