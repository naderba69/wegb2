/**
 * 272 — Schlüsselwort-Methode (Varianten) — طريقة الكلمة المفتاحية
 * Family: الذاكرة | Bloom: طبّق | Level: A1-A2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_272 = {
  id: 272,
  titleDe: "Schlüsselwort-Methode (Varianten)",
  titleAr: "طريقة الكلمة المفتاحية",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-A2",
  research: "Atkinson 1975",
  steps: "Fremdwort → Schlüsselwort → Bild",
} as const;

export function keywordFor(de: string, ar: string): string { return `${de} klingt wie ${ar} → Bild: ${de} + ${ar}`; }
export function keywordGain(used: boolean): number { return used?1.4:1.0; }
