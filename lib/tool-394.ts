/**
 * 394 — Priming — التهيئة
 * Family: الذاكرة | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_394 = {
  id: 394,
  titleDe: "Priming",
  titleAr: "التهيئة",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A1-B2",
  research: "McNamara 2005",
  desc: "Priming classroom",
} as const;

export function tool394Gain(a: boolean): number { return a?1.2:1.0; }
export function tool394Check(v:number):boolean { return v>0; }
