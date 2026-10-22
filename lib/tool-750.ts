/**
 * 750 — Intercomprehension — فهم متبادل لغات
 * Doyé 2005: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_750 = { id: 750, titleDe: "Intercomprehension", titleAr: "فهم متبادل لغات", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Doyé 2005", desc: "Intercomprehension" } as const;
export function tool750Gain(a:boolean):number{return a?1.2:1.0;}
export function tool750Check(v:number):boolean{return v>0;}
