/**
 * 699 — Conventional Expressions — تعابير اصطلاحية تداولية
 * Bardovi-Harlig 2008: classroom application
 * Level: B1-B2 | Bloom: تذكّر | Family: طرائق
 */
export const TOOL_699 = { id: 699, titleDe: "Conventional Expressions", titleAr: "تعابير اصطلاحية تداولية", family: "طرائق", bloom: "تذكّر", level: "B1-B2", research: "Bardovi-Harlig 2008", desc: "Conventional Expressions" } as const;
export function tool699Gain(a:boolean):number{return a?1.2:1.0;}
export function tool699Check(v:number):boolean{return v>0;}
