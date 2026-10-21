/**
 * 311 — Intercultural Competence — الكفاءة بين الثقافية
 * Byram 1997: applied to German teaching — classroom integration via tasks
 * Level: A1-B2 | Bloom: حلّل | Family: Immersion
 */
export const TOOL_311 = {
  id: 311,
  titleDe: "Intercultural Competence",
  titleAr: "الكفاءة بين الثقافية",
  family: "Immersion",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Byram 1997",
  desc: "Intercultural Competence applied in classroom",
} as const;
export function tool311Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool311Check(v: number): boolean { return v>0; }
