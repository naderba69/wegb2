/**
 * 208 — Dynamic Assessment ZPD — التقويم الديناميكي
 * Lantolf 2004: graduated prompts reveal ZPD; predict future learning
 * Level: A2-B2 | Bloom: حلّل | Family: تقويم
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
