/**
 * 761 — Language Socialization — تنشئة لغوية
 * Ochs 1988: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_761 = { id: 761, titleDe: "Language Socialization", titleAr: "تنشئة لغوية", family: "SLA", bloom: "فهم", level: "A1-B2", research: "Ochs 1988", desc: "Language Socialization" } as const;
export function tool761Gain(a:boolean):number{return a?1.2:1.0;}
export function tool761Check(v:number):boolean{return v>0;}
