/**
 * 201 — Lernurteile (JOL) — أحكام التعلّم
 * Family: الذاكرة | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_201 = {
  id: 201,
  titleDe: "Lernurteile (JOL)",
  titleAr: "أحكام التعلّم",
  family: "الذاكرة",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Koriat 1997",
  scale: "0-100% wie sicher?",
} as const;

export function jolCalibration(jol: number, actual: number): number {
  return Math.abs(jol - actual); // lower = better calibrated
}
export function needsJolTraining(calibrationError: number): boolean {
  return calibrationError > 0.25;
}
