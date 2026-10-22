/**
 * 873 — Forgetting Curve Ebbinghaus — منحنى نسيان
 * Ebbinghaus 1885: classroom application
 * Level: A1-B2 | Bloom: حلّل | Family: الذاكرة
 */
export const TOOL_873 = { id: 873, titleDe: "Forgetting Curve Ebbinghaus", titleAr: "منحنى نسيان", family: "الذاكرة", bloom: "حلّل", level: "A1-B2", research: "Ebbinghaus 1885", desc: "Forgetting Curve Ebbinghaus" } as const;
export function tool873Gain(a:boolean):number{return a?1.2:1.0;}
export function tool873Check(v:number):boolean{return v>0;}
