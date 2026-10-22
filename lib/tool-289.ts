/**
 * 289 — Expertise-Appropriate — مناسب للخبرة
 * Kalyuga 2003: high guidance for novices, low for experts
 * Level: A0-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_289 = {
  id: 289,
  titleDe: "Expertise-Appropriate",
  titleAr: "مناسب للخبرة",
  family: "طرائق",
  bloom: "حلّل",
  level: "A0-B2",
  research: "Kalyuga 2003",
  desc: "high guidance for novices, low for experts",
} as const;

export function tool289Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool289Check(v: number): boolean { return v > 0; }
