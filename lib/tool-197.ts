/**
 * 197 — Bilingual Dual Coding — الترميز المزدوج ثنائي اللغة
 * Paivio 1986 extended: L1+L2+image triple code stronger than L2 alone
 * Level: A0-A1 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_197 = {
  id: 197,
  titleDe: "Bilinguales Dual Coding",
  titleAr: "الترميز المزدوج ثنائي اللغة",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A0-A1",
  research: "Paivio 1986",
  triple: "صورة + كلمة ألمانية + ترجمة عربية",
} as const;

export function tripleCodeScore(hasImage: boolean, hasAr: boolean): number {
  return (hasImage ? 1 : 0) + (hasAr ? 1 : 0) + 1; // de always 1
}
export function needsImage(level: string): boolean {
  return level === "A0" || level === "A1";
}
