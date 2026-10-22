/**
 * 422 — Jigsaw Listening — استماع تركيبي
 * Aronson 1978: classroom application with tasks
 * Level: A2-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_422 = {
  id: 422,
  titleDe: "Jigsaw Listening",
  titleAr: "استماع تركيبي",
  family: "طرائق",
  bloom: "حلّل",
  level: "A2-B2",
  research: "Aronson 1978",
  desc: "Jigsaw Listening classroom",
} as const;
export function tool422Gain(a:boolean):number{return a?1.2:1.0;}
export function tool422Check(v:number):boolean{return v>0;}
