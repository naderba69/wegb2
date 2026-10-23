/**
 * 211 — Input Enhancement — تعزيز المدخلات
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_211 = {
  id: 211,
  titleDe: "Input Enhancement",
  titleAr: "تعزيز المدخلات",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Sharwood Smith 1993",
  technique: "fett/ farbig markieren",
} as const;

export function enhanceInput(sentence: string, target: string): string {
  return sentence.replace(target, `**${target}**`);
}
export function enhancementGain(noticed: boolean): number { return noticed ? 1.2 : 1.0; }
