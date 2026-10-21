/**
 * 796 — Critical Literacy Freire — محو نقدي فريري
 * Freire 1970: classroom application
 * Level: B1-B2 | Bloom: قيّم | Family: طرائق
 */
export const TOOL_796 = { id: 796, titleDe: "Critical Literacy Freire", titleAr: "محو نقدي فريري", family: "طرائق", bloom: "قيّم", level: "B1-B2", research: "Freire 1970", desc: "Critical Literacy Freire" } as const;
export function tool796Gain(a:boolean):number{return a?1.2:1.0;}
export function tool796Check(v:number):boolean{return v>0;}
