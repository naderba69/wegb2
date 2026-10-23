/**
 * 261 — Leitner vs FSRS Vergleich — مقارنة Leitner و FSRS
 * Family: الذاكرة | Bloom: حلّل | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_261 = {
  id: 261,
  titleDe: "Leitner vs FSRS Vergleich",
  titleAr: "مقارنة Leitner و FSRS",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "A0-B2",
  research: "Leitner 1972, FSRS 2023",
  winner: "FSRS gewinnt bei Zeit/Behalten",
} as const;

export function leitnerBox(correctStreak: number): number { return Math.min(5, Math.floor(correctStreak/2)+1); }
export function fsrsVsLeitner(fsrsTime: number, leitnerTime: number): number { return leitnerTime/fsrsTime; }
