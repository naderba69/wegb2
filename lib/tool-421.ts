/**
 * 421 — Text Reconstruction — إعادة بناء نص
 * Storch 1999: classroom application with tasks
 * Level: B1-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_421 = {
  id: 421,
  titleDe: "Text Reconstruction",
  titleAr: "إعادة بناء نص",
  family: "طرائق",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Storch 1999",
  desc: "Text Reconstruction classroom",
} as const;
export function tool421Gain(a:boolean):number{return a?1.2:1.0;}
export function tool421Check(v:number):boolean{return v>0;}
