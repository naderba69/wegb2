/**
 * 520 — Vocabulary Size Test — اختبار حجم مفردات
 * Nation 2012: classroom application
 * Level: A0-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_520 = { id: 520, titleDe: "Vocabulary Size Test", titleAr: "اختبار حجم مفردات", family: "تقويم", bloom: "قيّم", level: "A0-B2", research: "Nation 2012", desc: "Vocabulary Size Test" } as const;
export function tool520Gain(a:boolean):number{return a?1.2:1.0;}
export function tool520Check(v:number):boolean{return v>0;}
