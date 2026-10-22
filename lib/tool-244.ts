/**
 * 244 — Error Analysis — تحليل الأخطاء
 * Corder 1967: errors reveal interlanguage; systematic analysis → targeted remediation
 * Level: A1-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_244 = {
  id: 244,
  titleDe: "Fehleranalyse",
  titleAr: "تحليل الأخطاء",
  family: "SLA",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Corder 1967",
  types: "interlingual, intralingual, developmental",
} as const;
export function errorType(error: string): string { if(error.includes("der/die/das")) return "intralingual"; return "interlingual"; }
export function analyseFehler(errors: string[]): Map<string,number> { const m=new Map<string,number>(); for(const e of errors) m.set(e,(m.get(e)||0)+1); return m; }
