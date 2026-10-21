/**
 * 961 — Engagement Philp — انخراط فيلب
 * Philp 2013: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: تلقين
 */
export const TOOL_961 = { id: 961, titleDe: "Engagement Philp", titleAr: "انخراط فيلب", family: "تلقين", bloom: "أنشئ", level: "A1-B2", research: "Philp 2013", desc: "Engagement Philp" } as const;
export function tool961Gain(a:boolean):number{return a?1.2:1.0;}
export function tool961Check(v:number):boolean{return v>0;}
