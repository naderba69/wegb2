/**
 * 238 — Formatives Assessment — التقويم التكويني
 * Family: تقويم | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_238 = {
  id: 238,
  titleDe: "Formatives Assessment",
  titleAr: "التقويم التكويني",
  family: "تقويم",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Black 1998 d=0.7",
  cycle: "Ziel → Feedback → anpassen",
} as const;

export function formativeCycle(goal: string): string { return `Ziel: ${goal} → Feedback → anpassen`; }
export function formativeGain(feedbackGiven: boolean): number { return feedbackGiven?1.25:1.0; }
