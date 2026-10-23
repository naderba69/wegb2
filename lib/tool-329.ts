/**
 * 329 — Argumentation Toulmin — الحجاج
 * Family: طرائق | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_329 = {
  id: 329,
  titleDe: "Argumentation Toulmin",
  titleAr: "الحجاج",
  family: "طرائق",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Toulmin 1958",
  desc: "Argumentation Toulmin applied in classroom",
} as const;

export function tool329Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool329Check(v: number): boolean { return v>0; }
