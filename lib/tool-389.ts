/**
 * 389 — Central Executive — المنفذ المركزي
 * Family: الذاكرة | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_389 = {
  id: 389,
  titleDe: "Central Executive",
  titleAr: "المنفذ المركزي",
  family: "الذاكرة",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Baddeley 1996",
  desc: "Central Executive classroom",
} as const;

export function tool389Gain(a: boolean): number { return a?1.2:1.0; }
export function tool389Check(v:number):boolean { return v>0; }
