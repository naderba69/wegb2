/**
 * 482 — Critical Incident — حادثة حرجة ثقافية
 * Wight 1995: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: Immersion
 */
export const TOOL_482 = { id: 482, titleDe: "Critical Incident", titleAr: "حادثة حرجة ثقافية", family: "Immersion", bloom: "حلّل", level: "B1-B2", research: "Wight 1995", desc: "Critical Incident" } as const;
export function tool482Gain(a:boolean):number{return a?1.2:1.0;}
export function tool482Check(v:number):boolean{return v>0;}
