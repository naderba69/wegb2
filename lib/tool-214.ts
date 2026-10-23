/**
 * 214 — Output-Hypothese — فرضية الإخراج
 * Family: SLA | Bloom: طبّق | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
