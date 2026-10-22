/**
 * 261 — SRS Leitner vs FSRS — مقارنة أنظمة التكرار
 * Leitner 1972 boxes vs FSRS 2023 ML: FSRS 15% more efficient (same retention/time)
 * Level: A0-B2 | Bloom: حلّل | Family: الذاكرة
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
