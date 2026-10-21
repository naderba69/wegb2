/**
 * 262 — Desirable Difficulty Calibration — معايرة الصعوبة المرغوبة
 * Bjork 1994: optimal difficulty = 70-85% success; too easy/hard harms learning
 * Level: A1-B2 | Bloom: حلّل | Family: الذاكرة
 */
export const TOOL_262 = {
  id: 262,
  titleDe: "Desirable Difficulty",
  titleAr: "الصعوبة المرغوبة",
  family: "الذاكرة",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Bjork 1994",
  sweet: "70-85% Erfolgsquote = optimal",
} as const;
export function isDesirable(successRate: number): boolean { return successRate>=0.7 && successRate<=0.85; }
export function adjustDifficulty(successRate: number, difficulty: number): number { if(successRate>0.85) return difficulty*1.1; if(successRate<0.7) return difficulty*0.9; return difficulty; }
