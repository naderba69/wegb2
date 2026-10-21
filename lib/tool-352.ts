/**
 * 352 — Hörstrategien Bottom-Up — استراتيجيات استماع سفلية
 * Vandergrift 1999: classroom-ready application with tasks
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_352 = {
  id: 352,
  titleDe: "Hörstrategien Bottom-Up",
  titleAr: "استراتيجيات استماع سفلية",
  family: "طرائق",
  bloom: "فهم",
  level: "A1-B2",
  research: "Vandergrift 1999",
  desc: "Hörstrategien Bottom-Up classroom application",
} as const;
export function tool352Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool352Check(v: number): boolean { return v>0; }
