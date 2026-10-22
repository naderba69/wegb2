/**
 * 224 — Dictogloss — الإملاء التفاعلي
 * Wajnryb 1990: listen → reconstruct → compare; focus on form + meaning
 * Level: A2-B1 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_224 = {
  id: 224,
  titleDe: "Dictogloss",
  titleAr: "الإملاء التفاعلي",
  family: "طرائق",
  bloom: "أنشئ",
  level: "A2-B1",
  research: "Wajnryb 1990",
  steps: "hören → Notizen → rekonstruieren → vergleichen",
} as const;
export function dictoglossSteps(): string[] { return ["hören (2x)","Notizen","rekonstruieren","vergleichen"]; }
export function dictoglossPrompt(textTitle: string): string { return `Dictogloss: ${textTitle} — höre und rekonstruiere!`; }
