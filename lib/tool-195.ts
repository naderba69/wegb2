/**
 * 195 — Produktionseffekt — أثر الإنتاج الجهري
 * Family: الذاكرة | Bloom: طبّق | Level: A0-A2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_195 = {
  id: 195,
  titleDe: "Produktionseffekt",
  titleAr: "أثر الإنتاج الجهري",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A0-A2",
  research: "MacLeod 2010",
  instruction: "lies laut vor",
} as const;

export function productionGain(readAloud: boolean): number {
  return readAloud ? 1.15 : 1.0;
}
export function shouldProduceAloud(phase: string): boolean {
  return phase === "A0" || phase === "A1";
}
