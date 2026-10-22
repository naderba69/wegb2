/**
 * 259 — Digital Ethics — الأخلاق الرقمية
 * Floridi 2013: informierte Einwilligung, Datenschutz bei Lern-Analytics
 * Level: A0-B2 | Bloom: قيّم | Family: Ethik
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
