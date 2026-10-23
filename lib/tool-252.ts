/**
 * 252 — Abzeichen — الشارات
 * Family: Gamification | Bloom: تذكّر | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_252 = {
  id: 252,
  titleDe: "Abzeichen",
  titleAr: "الشارات",
  family: "Gamification",
  bloom: "تذكّر",
  level: "A0-B2",
  research: "Gibson 2015",
  examples: "Wortmeister, Grammatik-Champion, Lese-Adler",
} as const;

export function badgeFor(milestone: string): string { const m: Record<string,string>={ "10Woerter":"Wortmeister", "Perfekt":"Grammatik-Champion"}; return m[milestone]??"Fleiß-Stern"; }
export function hasBadge(badges: string[], name: string): boolean { return badges.includes(name); }
