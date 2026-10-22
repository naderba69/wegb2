/**
 * 186 — Elaboration with Why-Questions — إسهاب بأسئلة لماذا
 * Pressley et al. 1988: "Warum gilt das?" improves comprehension 20%
 * Level: A0-B2 | Bloom: تذكّر
 */
export const TOOL_186 = {
  id: 186,
  titleDe: "Warum-Fragen Elaboration",
  titleAr: "إسهاب لماذا",
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
