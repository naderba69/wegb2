/**
 * 233 — Elicitierung — الاستنباط
 * Family: طرائق | Bloom: أنشئ | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_233 = {
  id: 233,
  titleDe: "Elicitierung",
  titleAr: "الاستنباط",
  family: "طرائق",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Thornbury 1999",
  prompts: "Wie sagt man ...? Was ist Gegenteil von ...?",
} as const;

export function elicitationPrompt(topic: string): string { return `Wie sagt man auf Deutsch: ${topic}?`; }
export function elicitationGain(elicited: boolean): number { return elicited?1.25:1.0; }
