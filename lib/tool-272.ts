/**
 * 272 — Keyword Method Variants — تنويعات الكلمة المفتاحية
 * Atkinson 1975: foreign word → keyword (similar sounding L1) → image linking
 * Level: A1-A2 | Bloom: طبّق | Family: الذاكرة
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
