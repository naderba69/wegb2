/**
 * 863 — Production Effect MacLeod — أثر إنتاج ماكليود
 * Family: الذاكرة | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_863 = {
  id: 863,
  titleDe: "Production Effect MacLeod",
  titleAr: "أثر إنتاج ماكليود",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-B2",
  research: "MacLeod 2010",
  desc: "Production Effect MacLeod",
} as const;

export function tool863Gain(a:boolean):number{return a?1.2:1.0;}
export function tool863Check(v:number):boolean{return v>0;}
