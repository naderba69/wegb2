/**
 * 221 — Extensives Lesen — القراءة الموسعة
 * Family: طرائق | Bloom: فهم | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_221 = {
  id: 221,
  titleDe: "Extensives Lesen",
  titleAr: "القراءة الموسعة",
  family: "طرائق",
  bloom: "فهم",
  level: "A2-B2",
  research: "Day & Bamford 1998",
  rule: "viel lesen, leicht, mit Vergnügen",
} as const;

export function extensiveTarget(level: string): number {
  const map: Record<string, number> = { A1: 500, A2: 1000, B1: 2000, B2: 4000 };
  return map[level] ?? 1000; // Wörter/Woche
}
export function isExtensive(textLevel: string, learnerLevel: string): boolean { return textLevel <= learnerLevel; }
