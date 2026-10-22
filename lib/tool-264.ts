/**
 * 264 — Elaborative Interrogation — الاستجواب التفصيلي
 * Seifert 1993: Why-questions generate explanations → +25% recall
 * Level: B1-B2 | Bloom: حلّل | Family: تلقين
 */
export const TOOL_264 = {
  id: 264,
  titleDe: "Elaborative Interrogation",
  titleAr: "الاستجواب التفصيلي",
  family: "تلقين",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Seifert 1993",
  prompt: "Warum ...? Wie hängt ... zusammen?",
} as const;
export function elaborativeWhy(fact: string): string { return `Warum gilt: ${fact}? Erkläre den Zusammenhang!`; }
export function elaborationGain(explained: boolean): number { return explained?1.25:1.0; }
