/**
 * 376 — Frequency Effects — أثر التكرار
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_376 = {
  id: 376,
  titleDe: "Frequency Effects",
  titleAr: "أثر التكرار",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Ellis 2002",
  desc: "Frequency Effects classroom",
} as const;

export function tool376Gain(a: boolean): number { return a?1.2:1.0; }
export function tool376Check(v:number):boolean { return v>0; }
