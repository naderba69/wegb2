/**
 * 423 — Information Gap Listening — فجوة معلومات استماع
 * Pica 1994: classroom application with tasks
 * Level: A1-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_423 = {
  id: 423,
  titleDe: "Information Gap Listening",
  titleAr: "فجوة معلومات استماع",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Pica 1994",
  desc: "Information Gap Listening classroom",
} as const;
export function tool423Gain(a:boolean):number{return a?1.2:1.0;}
export function tool423Check(v:number):boolean{return v>0;}
