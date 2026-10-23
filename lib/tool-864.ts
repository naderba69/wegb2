/**
 * 864 — Generation Effect 2 — أثر توليد 2
 * Family: الذاكرة | Bloom: أنشئ | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_864 = {
  id: 864,
  titleDe: "Generation Effect 2",
  titleAr: "أثر توليد 2",
  family: "الذاكرة",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Bertsch 2007",
  desc: "Generation Effect 2",
} as const;

export function tool864Gain(a:boolean):number{return a?1.2:1.0;}
export function tool864Check(v:number):boolean{return v>0;}
