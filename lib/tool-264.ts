/**
 * 264 — Elaborative Interrogation — الاستجواب التفصيلي
 * Family: تلقين | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
