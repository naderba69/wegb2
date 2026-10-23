/**
 * 224 — Dictogloss — الإملاء التفاعلي
 * Family: طرائق | Bloom: أنشئ | Level: A2-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
