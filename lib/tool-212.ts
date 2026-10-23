/**
 * 212 — Noticing-Hypothese — فرضية الانتباه
 * Family: SLA | Bloom: فهم | Level: A2-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
