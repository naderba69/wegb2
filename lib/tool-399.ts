/**
 * 399 — Retrieval Effort — جهد الاسترجاع
 * Family: الذاكرة | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_399 = {
  id: 399,
  titleDe: "Retrieval Effort",
  titleAr: "جهد الاسترجاع",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Bjork 2011",
  desc: "Retrieval Effort classroom",
} as const;

export function tool399Gain(a: boolean): number { return a?1.2:1.0; }
export function tool399Check(v:number):boolean { return v>0; }
