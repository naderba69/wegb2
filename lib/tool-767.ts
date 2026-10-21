/**
 * 767 — English as Lingua Franca — إنجليزية كوسيط
 * Seidlhofer 2011: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: Immersion
 */
export const TOOL_767 = { id: 767, titleDe: "English as Lingua Franca", titleAr: "إنجليزية كوسيط", family: "Immersion", bloom: "فهم", level: "B1-B2", research: "Seidlhofer 2011", desc: "English as Lingua Franca" } as const;
export function tool767Gain(a:boolean):number{return a?1.2:1.0;}
export function tool767Check(v:number):boolean{return v>0;}
