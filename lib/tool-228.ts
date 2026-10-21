/**
 * 228 — Storytelling — السرد القصصي
 * Bruner 1986: narrative organizes memory; stories > lists for retention
 * Level: A0-B2 | Bloom: أنشئ | Family: Narrative
 */
export const TOOL_228 = {
  id: 228,
  titleDe: "Storytelling",
  titleAr: "السرد القصصي",
  family: "Narrative",
  bloom: "أنشئ",
  level: "A0-B2",
  research: "Bruner 1986",
  structure: "Einleitung → Konflikt → Lösung",
} as const;
export function storyStructure(): string[] { return ["Einleitung","Konflikt","Lösung","Moral"]; }
export function storyPrompt(theme: string): string { return `Erzähle eine Geschichte über ${theme} — 5 Sätze!`; }
