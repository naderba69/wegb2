/**
 * 197 — Bilinguales Dual Coding — الترميز المزدوج ثنائي اللغة
 * Family: الذاكرة | Bloom: فهم | Level: A0-A1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
