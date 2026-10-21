/**
 * 563 — 360 Video — فيديو 360
 * Shadiev 2020: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: Immersion
 */
export const TOOL_563 = { id: 563, titleDe: "360 Video", titleAr: "فيديو 360", family: "Immersion", bloom: "فهم", level: "A1-B2", research: "Shadiev 2020", desc: "360 Video" } as const;
export function tool563Gain(a:boolean):number{return a?1.2:1.0;}
export function tool563Check(v:number):boolean{return v>0;}
