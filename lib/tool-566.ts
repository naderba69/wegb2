/**
 * 566 — Tandem 2.0 — ثنائي 2.0
 * Telles 2015: classroom application
 * Level: A2-B2 | Bloom: طبّق | Family: Immersion
 */
export const TOOL_566 = { id: 566, titleDe: "Tandem 2.0", titleAr: "ثنائي 2.0", family: "Immersion", bloom: "طبّق", level: "A2-B2", research: "Telles 2015", desc: "Tandem 2.0" } as const;
export function tool566Gain(a:boolean):number{return a?1.2:1.0;}
export function tool566Check(v:number):boolean{return v>0;}
