/**
 * 273 — Bild-Mnemonik (tief) — التصور الذهني العميق
 * Family: الذاكرة | Bloom: طبّق | Level: A0-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
