/**
 * 212 — Noticing Hypothesis — فرضية الانتباه
 * Schmidt 1990: noticing is necessary for intake; intake → acquisition
 * Level: A2-B1 | Bloom: فهم | Family: SLA
 */
export const TOOL_212 = {
  id: 212,
  titleDe: "Noticing-Hypothese",
  titleAr: "فرضية الانتباه",
  family: "SLA",
  bloom: "فهم",
  level: "A2-B1",
  research: "Schmidt 1990",
  rule: "bemerken → aufnehmen → erwerben",
} as const;
export function noticingPrompt(formDe: string): string { return `Bemerke: ${formDe} — wo steht es im Satz?`; }
export function noticedToIntake(noticed: boolean, understood: boolean): boolean { return noticed && understood; }
