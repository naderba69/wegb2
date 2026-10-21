/**
 * 466 — Flipped Classroom — صف مقلوب
 * Bergmann 2012: classroom application
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_466 = { id: 466, titleDe: "Flipped Classroom", titleAr: "صف مقلوب", family: "طرائق", bloom: "أنشئ", level: "A1-B2", research: "Bergmann 2012", desc: "Flipped Classroom" } as const;
export function tool466Gain(a:boolean):number{return a?1.2:1.0;}
export function tool466Check(v:number):boolean{return v>0;}
