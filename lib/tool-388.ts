/**
 * 388 — Episodic Buffer — المخزن العرضي
 * Family: الذاكرة | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_388 = {
  id: 388,
  titleDe: "Episodic Buffer",
  titleAr: "المخزن العرضي",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A1-B2",
  research: "Baddeley 2000",
  desc: "Episodic Buffer classroom",
} as const;

export function tool388Gain(a: boolean): number { return a?1.2:1.0; }
export function tool388Check(v:number):boolean { return v>0; }
