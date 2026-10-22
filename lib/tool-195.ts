/**
 * 195 — Production Effect — أثر الإنتاج (القراءة بصوت عالٍ)
 * MacLeod 2010: reading aloud > silent, +15% distinctiveness
 * Level: A0-A2 | Bloom: طبّق | Family: الذاكرة
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
