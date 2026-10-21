/**
 * 721 — Intelligent Tutoring — تدريس ذكي
 * VanLehn 2011: classroom application
 * Level: A1-B2 | Bloom: طبّق | Family: Gamification
 */
export const TOOL_721 = { id: 721, titleDe: "Intelligent Tutoring", titleAr: "تدريس ذكي", family: "Gamification", bloom: "طبّق", level: "A1-B2", research: "VanLehn 2011", desc: "Intelligent Tutoring" } as const;
export function tool721Gain(a:boolean):number{return a?1.2:1.0;}
export function tool721Check(v:number):boolean{return v>0;}
