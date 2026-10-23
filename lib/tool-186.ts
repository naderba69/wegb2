/**
 * 186 — Warum-Fragen Elaboration — إسهاب لماذا
 * Family: تلقين | Bloom: حلّل | Level: B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_186 = {
  id: 186,
  titleDe: "Warum-Fragen Elaboration",
  titleAr: "إسهاب لماذا",
  family: "تلقين",
  bloom: "حلّل",
  level: "B1",
  gain: "+20% Verständnis",
} as const;

export function generateWhyQuestion(rule: string): string {
  return `Warum gilt: "${rule}"? Erkläre in eigenen Worten.`;
}

export function elaborationPrompt(de: string, ar: string): { de: string; ar: string } {
  return {
    de: `${de} — Warum?`,
    ar: `${ar} — لماذا؟ اشرح بكلماتك`,
  };
}
