/**
 * 204 — Expertise Reversal Effect — انعكاس أثر الخبرة
 * Kalyuga 2003: scaffolding helps novices but harms experts — adapt to level
 * Level: A0-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_204 = {
  id: 204,
  titleDe: "Expertise-Umkehr",
  titleAr: "انعكاس الخبرة",
  family: "طرائق",
  bloom: "حلّل",
  level: "A0-B2",
  research: "Kalyuga 2003",
  rule: "viel Hilfe bei A0, wenig bei B2",
} as const;

export function scaffoldingLevel(level: string): number {
  const map: Record<string, number> = { A0: 3, A1: 2, A2: 1, B1: 0.5, B2: 0 };
  return map[level] ?? 1;
}
export function shouldReduceScaffolding(reps: number): boolean {
  return reps > 5;
}
