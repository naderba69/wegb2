/**
 * 259 — Digitale Ethik — الأخلاق الرقمية
 * Family: Ethik | Bloom: قيّم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_259 = {
  id: 259,
  titleDe: "Digitale Ethik",
  titleAr: "الأخلاق الرقمية",
  family: "Ethik",
  bloom: "قيّم",
  level: "A0-B2",
  research: "Floridi 2013",
  principles: "Einwilligung, Transparenz, Datensparsamkeit",
} as const;

export function ethicsCheck(consent: boolean, anonymized: boolean): boolean { return consent && anonymized; }
export function dataMinimized(collected: number, needed: number): boolean { return collected <= needed*1.1; }
