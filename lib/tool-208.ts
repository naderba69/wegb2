/**
 * 208 — Dynamisches Assessment (ZPD) — التقويم الديناميكي
 * Family: تقويم | Bloom: حلّل | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_208 = {
  id: 208,
  titleDe: "Dynamisches Assessment (ZPD)",
  titleAr: "التقويم الديناميكي",
  family: "تقويم",
  bloom: "حلّل",
  level: "A2-B2",
  research: "Lantolf 2004",
  prompts: "Hinweis 1 (allgemein) → Hinweis 3 (konkret)",
} as const;

export function zpdPromptLevel(attempt: number): number {
  return Math.min(3, attempt);
}
export function inZPD(withHelp: boolean, withoutHelp: boolean): boolean {
  return withHelp && !withoutHelp;
}
