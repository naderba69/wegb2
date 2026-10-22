/**
 * 833 — Task-Based Learning Willis — تعلم مهام ويليس
 * Willis 1996: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_833 = { id: 833, titleDe: "Task-Based Learning Willis", titleAr: "تعلم مهام ويليس", family: "طرائق", bloom: "أنشئ", level: "A1-B2", research: "Willis 1996", desc: "Task-Based Learning Willis" } as const;
export function tool833Gain(a:boolean):number{return a?1.2:1.0;}
export function tool833Check(v:number):boolean{return v>0;}
