/**
 * 260 — AI Tutor Ethics — أخلاقيات المدرّس الذكي
 * Holmes 2019: AI tutor must be transparent, fair, human-in-the-loop
 * Level: B1-B2 | Bloom: قيّم | Family: Ethik
 */
export const TOOL_260 = {
  id: 260,
  titleDe: "KI-Tutor Ethik",
  titleAr: "أخلاقيات المدرّس الذكي",
  family: "Ethik",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Holmes 2019",
  rules: "Kein Bias, Erklärungspflicht, Mensch entscheidet",
} as const;
export function aiEthicsCheck(biased: boolean, explainable: boolean): boolean { return !biased && explainable; }
export function humanInLoop(automated: boolean): boolean { return !automated; }
