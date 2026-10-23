/**
 * 194 — Generationseffekt — أثر التوليد
 * Family: تلقين | Bloom: أنشئ | Level: A2-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_194 = {
  id: 194,
  titleDe: "Generationseffekt",
  titleAr: "أثر التوليد",
  family: "تلقين",
  bloom: "أنشئ",
  level: "A2-B1",
  research: "Slamecka 1978",
  gain: "+20% recall when generate vs read",
} as const;

export function generationPrompt(wordDe: string): string {
  return `Ergänze: ${wordDe.slice(0,2)}___ (Rate!)`;
}
export function generationBonus(generated: boolean): number {
  return generated ? 1.25 : 1.0;
}
