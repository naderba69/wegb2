/**
 * 214 — Output Hypothesis — فرضية الإخراج
 * Swain 1985: producing language forces syntactic processing; noticing gaps
 * Level: B1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_214 = {
  id: 214,
  titleDe: "Output-Hypothese",
  titleAr: "فرضية الإخراج",
  family: "SLA",
  bloom: "طبّق",
  level: "B1-B2",
  research: "Swain 1985",
  functions: "noticing, hypothesis testing, metalinguistic",
} as const;
export function outputPrompt(topic: string): string { return `Produziere: Schreibe 3 Sätze über ${topic}`; }
export function pushedOutput(complexity: number): boolean { return complexity > 0.6; }
