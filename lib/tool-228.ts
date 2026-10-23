/**
 * 228 — Storytelling — السرد القصصي
 * Family: Narrative | Bloom: أنشئ | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
