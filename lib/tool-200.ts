/**
 * 200 — Feedback Timing — توقيت التغذية الراجعة
 * Butler 2007: immediate feedback for low performers, delayed for high performers (desirable difficulty)
 * Level: A2-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_200 = {
  id: 200,
  titleDe: "Feedback-Timing",
  titleAr: "توقيت التغذية الراجعة",
  family: "تقويم",
  bloom: "قيّم",
  level: "A2-B2",
  research: "Butler 2007",
  rule: "sofort bei Fehlerquote>40%, verzögert sonst",
} as const;

export type FeedbackTiming = "sofort" | "verzoegert";

export function feedbackTiming(errorRate: number): FeedbackTiming {
  return errorRate > 0.4 ? "sofort" : "verzoegert";
}
export function feedbackDelayMinutes(timing: FeedbackTiming): number {
  return timing === "sofort" ? 0 : 10;
}
