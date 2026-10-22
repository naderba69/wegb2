/**
 * 284 — Worked Example Effect — أثر المثال المحلول
 * Sweller 2006: study worked example > solve for novices
 * Level: A0-A2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_284 = {
  id: 284,
  titleDe: "Worked Example Effect",
  titleAr: "أثر المثال المحلول",
  family: "طرائق",
  bloom: "طبّق",
  level: "A0-A2",
  research: "Sweller 2006",
  desc: "study worked example > solve for novices",
} as const;

export function tool284Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool284Check(v: number): boolean { return v > 0; }
