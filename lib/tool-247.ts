/**
 * 247 — Washback Design — تصميم الأثر الارتجاعي الإيجابي
 * Cheng 2005: high-stakes test washback can be positive if test is communicative
 * Level: B1-B2 | Bloom: أنشئ | Family: تقويم
 */
export const TOOL_247 = {
  id: 247,
  titleDe: "Positiver Washback",
  titleAr: "الأثر الارتجاعي الإيجابي",
  family: "تقويم",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Cheng 2005",
  design: "Teste Kommunikation, nicht nur Grammatik",
} as const;
export function washbackDesign(skill: string): string { return `Teste ${skill} kommunikativ — nicht isoliert!`; }
export function positiveWashback(communicative: boolean): number { return communicative?1.3:1.0; }
