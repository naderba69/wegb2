/**
 * 390 — Long-Term Memory — الذاكرة طويلة المدى
 * Family: الذاكرة | Bloom: فهم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_390 = {
  id: 390,
  titleDe: "Long-Term Memory",
  titleAr: "الذاكرة طويلة المدى",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A0-B2",
  research: "Tulving 1972",
  desc: "Long-Term Memory classroom",
} as const;

export function tool390Gain(a: boolean): number { return a?1.2:1.0; }
export function tool390Check(v:number):boolean { return v>0; }
