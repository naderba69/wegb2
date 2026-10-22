/**
 * 251 — Points & Levels — النقاط والمستويات
 * Hamari 2014: points systems increase activity when tied to meaningful goals
 * Level: A0-B2 | Bloom: طبّق | Family: Gamification
 */
export const TOOL_251 = {
  id: 251,
  titleDe: "Punkte & Level",
  titleAr: "النقاط والمستويات",
  family: "Gamification",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Hamari 2014",
  levels: "A0 Novize → B2 Meister (10 Level)",
} as const;
export function levelFromPoints(points: number): number { return Math.floor(points/100)+1; }
export function pointsFor(task: string): number { const m: Record<string,number>={lesen:10, hoeren:15, schreiben:20, sprechen:25}; return m[task]??10; }
