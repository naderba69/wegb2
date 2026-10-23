/**
 * 513 — Multilingual Lexicon — معجم متعدد
 * Family: الذاكرة | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_513 = {
  id: 513,
  titleDe: "Multilingual Lexicon",
  titleAr: "معجم متعدد",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A1-B2",
  research: "Singleton 1999",
  desc: "Multilingual Lexicon",
} as const;

export function tool513Gain(a:boolean):number{return a?1.2:1.0;}
export function tool513Check(v:number):boolean{return v>0;}
