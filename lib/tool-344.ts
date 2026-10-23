/**
 * 344 — Syntax V2 Wortstellung — ترتيب الكلمات V2
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_344 = {
  id: 344,
  titleDe: "Syntax V2 Wortstellung",
  titleAr: "ترتيب الكلمات V2",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Clahsen 1986",
  desc: "Syntax V2 Wortstellung classroom application",
} as const;

export function tool344Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool344Check(v: number): boolean { return v>0; }
