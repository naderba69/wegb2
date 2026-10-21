/**
 * 222 — Narrow Reading — القراءة الضيقة
 * Krashen 2004: same topic/author repeatedly → lexical recycling, comprehension boost
 * Level: B1-B2 | Bloom: فهم | Family: طرائق
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
