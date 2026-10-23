/**
 * 386 — Phonological Loop — الحلقة الصوتية
 * Family: الذاكرة | Bloom: فهم | Level: A0-A2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_386 = {
  id: 386,
  titleDe: "Phonological Loop",
  titleAr: "الحلقة الصوتية",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A0-A2",
  research: "Baddeley 2003",
  desc: "Phonological Loop classroom",
} as const;

export function tool386Gain(a: boolean): number { return a?1.2:1.0; }
export function tool386Check(v:number):boolean { return v>0; }
