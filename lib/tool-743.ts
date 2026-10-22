/**
 * 743 — Teletandem — تبادل عن بعد
 * Telles 2009: classroom application
 * Level: B1-B2 | Bloom: طبّق | Family: Immersion
 */
export const TOOL_743 = { id: 743, titleDe: "Teletandem", titleAr: "تبادل عن بعد", family: "Immersion", bloom: "طبّق", level: "B1-B2", research: "Telles 2009", desc: "Teletandem" } as const;
export function tool743Gain(a:boolean):number{return a?1.2:1.0;}
export function tool743Check(v:number):boolean{return v>0;}
