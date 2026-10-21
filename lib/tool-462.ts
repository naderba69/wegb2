/**
 * 462 — Jigsaw Expert — خبيرة التركيب
 * Aronson 1978: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_462 = { id: 462, titleDe: "Jigsaw Expert", titleAr: "خبيرة التركيب", family: "طرائق", bloom: "حلّل", level: "B1-B2", research: "Aronson 1978", desc: "Jigsaw Expert" } as const;
export function tool462Gain(a:boolean):number{return a?1.2:1.0;}
export function tool462Check(v:number):boolean{return v>0;}
