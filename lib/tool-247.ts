/**
 * 247 — Positiver Washback — الأثر الارتجاعي الإيجابي
 * Family: تقويم | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
