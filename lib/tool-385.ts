/**
 * 385 — Working Memory — الذاكرة العاملة
 * Family: الذاكرة | Bloom: فهم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_385 = {
  id: 385,
  titleDe: "Working Memory",
  titleAr: "الذاكرة العاملة",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A0-B2",
  research: "Baddeley 2000",
  desc: "Working Memory classroom",
} as const;

export function tool385Gain(a: boolean): number { return a?1.2:1.0; }
export function tool385Check(v:number):boolean { return v>0; }
