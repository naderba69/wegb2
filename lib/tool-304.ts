/**
 * 304 — Metacognitive Strategies — ما وراء المعرفية
 * Flavell 1979: planning, monitoring, evaluating
 * Level: B1-B2 | Bloom: قيّم | Family: SLA
 */
export const TOOL_304 = {
  id: 304,
  titleDe: "Metacognitive Strategies",
  titleAr: "ما وراء المعرفية",
  family: "SLA",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Flavell 1979",
  desc: "planning, monitoring, evaluating",
} as const;

export function tool304Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool304Check(v: number): boolean { return v > 0; }
