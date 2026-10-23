/**
 * 281 — Cognitive Load Theory — العبء المعرفي
 * Family: طرائق | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_281 = {
  id: 281,
  titleDe: "Cognitive Load Theory",
  titleAr: "العبء المعرفي",
  family: "طرائق",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Sweller 1988",
  desc: "load = intrinsic + extraneous + germane; keep extraneous low",
} as const;

export function tool281Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool281Check(v: number): boolean { return v > 0; }
