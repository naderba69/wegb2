/**
 * 260 — KI-Tutor Ethik — أخلاقيات المدرّس الذكي
 * Family: Ethik | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
