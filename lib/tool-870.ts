/**
 * 870 — Von Restorff Effect — أثر فون رسطورف
 * von Restorff 1933: classroom application
 * Level: A1-B2 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_870 = { id: 870, titleDe: "Von Restorff Effect", titleAr: "أثر فون رسطورف", family: "الذاكرة", bloom: "فهم", level: "A1-B2", research: "von Restorff 1933", desc: "Von Restorff Effect" } as const;
export function tool870Gain(a:boolean):number{return a?1.2:1.0;}
export function tool870Check(v:number):boolean{return v>0;}
