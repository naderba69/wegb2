/**
 * 581 — WTC MacIntyre — استعداد تواصل
 * MacIntyre 1998: classroom application
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_581 = { id: 581, titleDe: "WTC MacIntyre", titleAr: "استعداد تواصل", family: "SLA", bloom: "حلّل", level: "B1-B2", research: "MacIntyre 1998", desc: "WTC MacIntyre" } as const;
export function tool581Gain(a:boolean):number{return a?1.2:1.0;}
export function tool581Check(v:number):boolean{return v>0;}
