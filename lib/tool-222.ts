/**
 * 222 — Narrow Reading — القراءة الضيقة
 * Family: طرائق | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_222 = {
  id: 222,
  titleDe: "Narrow Reading",
  titleAr: "القراءة الضيقة",
  family: "طرائق",
  bloom: "فهم",
  level: "B1-B2",
  research: "Krashen 2004",
  method: "3 Texte zum selben Thema nacheinander",
} as const;

export function narrowSet(topic: string): string { return `Narrow Set: 3 Texte zu ${topic}`; }
export function recyclingGain(repetitions: number): number { return Math.min(1.4, 1 + repetitions * 0.1); }
