/**
 * 206 — Peer Feedback — تغذية الأقران الراجعة
 * Topping 2009: peer feedback improves both giver and receiver
 * Level: B1-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_206 = {
  id: 206,
  titleDe: "Peer-Feedback",
  titleAr: "تغذية الأقران",
  family: "تقويم",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Topping 2009",
  rule: "2 Sterne + 1 Wunsch",
} as const;

export function peerFeedbackTemplate(): string {
  return "2 Sterne (was gut) + 1 Wunsch (was besser)";
}
export function peerGain(gaveFeedback: boolean): number {
  return gaveFeedback ? 1.15 : 1.0;
}
