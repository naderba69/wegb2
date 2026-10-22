/**
 * 273 — Image Mnemonic Deep — التصور الذهني العميق
 * Bower 1972: interactive images → recall +50%; bizarre images even stronger
 * Level: A0-B1 | Bloom: طبّق | Family: الذاكرة
 */
export const TOOL_273 = {
  id: 273,
  titleDe: "Bild-Mnemonik (tief)",
  titleAr: "التصور الذهني العميق",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A0-B1",
  research: "Bower 1972",
  tip: "je bizarrer, desto besser",
} as const;
export function bizarreImage(word: string): string { return `Bizarres Bild für ${word}: riesig, bunt, in Bewegung!`; }
export function imageStrength(bizarre: boolean): number { return bizarre?1.5:1.2; }
