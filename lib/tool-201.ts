/**
 * 201 — Judgments of Learning — أحكام التعلّم
 * Koriat 1997: JOL accuracy predicts retention; training JOL improves calibration
 * Level: B1-B2 | Bloom: قيّم | Family: الذاكرة
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
