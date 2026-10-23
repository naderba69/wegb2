/**
 * 322 — Colligation — التصاحب النحوي
 * Family: طرائق | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_322 = {
  id: 322,
  titleDe: "Colligation",
  titleAr: "التصاحب النحوي",
  family: "طرائق",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Firth 1957",
  desc: "Colligation applied in classroom",
} as const;

export function tool322Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool322Check(v: number): boolean { return v>0; }
