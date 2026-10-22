/**
 * 287 — Variability Effect — أثر التنوع
 * Paas 1994: varied examples → transfer
 * Level: B1-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_287 = {
  id: 287,
  titleDe: "Variability Effect",
  titleAr: "أثر التنوع",
  family: "طرائق",
  bloom: "طبّق",
  level: "B1-B2",
  research: "Paas 1994",
  desc: "varied examples → transfer",
} as const;

export function tool287Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool287Check(v: number): boolean { return v > 0; }
