/**
 * 202 — Selbsterklärung — الشرح الذاتي
 * Family: تلقين | Bloom: حلّل | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_202 = {
  id: 202,
  titleDe: "Selbsterklärung",
  titleAr: "الشرح الذاتي",
  family: "تلقين",
  bloom: "حلّل",
  level: "A2-B2",
  research: "Chi 1989",
  prompt: "Warum gilt diese Regel hier?",
} as const;

export function selfExplainPrompt(topicDe: string): string {
  return `Erkläre dir selbst: Warum ${topicDe}?`;
}
export function selfExplainGain(explained: boolean): number {
  return explained ? 1.3 : 1.0;
}
