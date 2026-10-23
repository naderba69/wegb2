/**
 * 219 — Grammatik-Übersetzung (modern) — الترجمة النحوية (حديثة)
 * Family: طرائق | Bloom: فهم | Level: A0-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
