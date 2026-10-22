/**
 * 725 — Personalized Learning — تعلم مخصص
 * Pane 2017: classroom application
 * Level: A0-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_725 = { id: 725, titleDe: "Personalized Learning", titleAr: "تعلم مخصص", family: "طرائق", bloom: "أنشئ", level: "A0-B2", research: "Pane 2017", desc: "Personalized Learning" } as const;
export function tool725Gain(a:boolean):number{return a?1.2:1.0;}
export function tool725Check(v:number):boolean{return v>0;}
