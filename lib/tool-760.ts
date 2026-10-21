/**
 * 760 — Imagined Communities Kanno — مجتمعات متخيلة كانو
 * Kanno 2003: classroom application
 * Level: B1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_760 = { id: 760, titleDe: "Imagined Communities Kanno", titleAr: "مجتمعات متخيلة كانو", family: "SLA", bloom: "فهم", level: "B1-B2", research: "Kanno 2003", desc: "Imagined Communities Kanno" } as const;
export function tool760Gain(a:boolean):number{return a?1.2:1.0;}
export function tool760Check(v:number):boolean{return v>0;}
