/**
 * 843 — Vocabulary Notebook — دفتر مفردات
 * Family: الذاكرة | Bloom: أنشئ | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_843 = {
  id: 843,
  titleDe: "Vocabulary Notebook",
  titleAr: "دفتر مفردات",
  family: "الذاكرة",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Walters 2004",
  desc: "Vocabulary Notebook",
} as const;

export function tool843Gain(a:boolean):number{return a?1.2:1.0;}
export function tool843Check(v:number):boolean{return v>0;}
