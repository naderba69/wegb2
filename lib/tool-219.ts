/**
 * 219 — Grammar-Translation Reinterpreted — الترجمة النحوية المعاد تفسيرها
 * Modern: contrastive translation as noticing tool, not main method
 * Level: A0-B1 | Bloom: فهم | Family: طرائق
 */
export const TOOL_219 = {
  id: 219,
  titleDe: "Grammatik-Übersetzung (modern)",
  titleAr: "الترجمة النحوية (حديثة)",
  family: "طرائق",
  bloom: "فهم",
  level: "A0-B1",
  research: "Cook 2010",
  use: "Kontrastive Übersetzung als Noticing-Hilfe",
} as const;
export function contrastTranslation(de: string, ar: string): string { return `DE: ${de} ↔ AR: ${ar} — vergleiche Wortstellung!`; }
export function shouldTranslate(level: string): boolean { return level==="A0"||level==="A1"; }
