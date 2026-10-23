/**
 * 592 — Speaking Anxiety — قلق تحدث
 * Family: SLA | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_592 = {
  id: 592,
  titleDe: "Speaking Anxiety",
  titleAr: "قلق تحدث",
  family: "SLA",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Woodrow 2006",
  desc: "Speaking Anxiety",
} as const;

export function tool592Gain(a:boolean):number{return a?1.2:1.0;}
export function tool592Check(v:number):boolean{return v>0;}
