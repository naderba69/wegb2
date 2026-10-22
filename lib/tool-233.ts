/**
 * 233 — Elicitation — الاستنباط
 * Thornbury 1999: eliciting > telling; learner generates form → deeper processing
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
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
