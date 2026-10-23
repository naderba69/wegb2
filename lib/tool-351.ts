/**
 * 351 — Hörstrategien Top-Down — استراتيجيات استماع علوية
 * Family: طرائق | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_351 = {
  id: 351,
  titleDe: "Hörstrategien Top-Down",
  titleAr: "استراتيجيات استماع علوية",
  family: "طرائق",
  bloom: "فهم",
  level: "A1-B2",
  research: "Vandergrift 1999",
  desc: "Hörstrategien Top-Down classroom application",
} as const;

export function tool351Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool351Check(v: number): boolean { return v>0; }
