/**
 * 252 — Badges — الشارات
 * Gibson 2015: digital badges signal achievement; collectible → motivation
 * Level: A0-B2 | Bloom: تذكّر | Family: Gamification
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
