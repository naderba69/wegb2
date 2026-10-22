/**
 * 996 — Assessment Literacy Stiggins — محو تقويمي ستيغنز
 * Stiggins 1991: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_996 = { id: 996, titleDe: "Assessment Literacy Stiggins", titleAr: "محو تقويمي ستيغنز", family: "تقويم", bloom: "قيّم", level: "B1-B2", research: "Stiggins 1991", desc: "Assessment Literacy Stiggins" } as const;
export function tool996Gain(a:boolean):number{return a?1.2:1.0;}
export function tool996Check(v:number):boolean{return v>0;}
