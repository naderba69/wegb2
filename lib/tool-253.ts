/**
 * 253 — Leaderboards — لوحات الصدارة
 * Landers 2017: leaderboards motivate top 25%, demotivate bottom if not designed well
 * Level: A1-B2 | Bloom: فهم | Family: Gamification
 */
export const TOOL_253 = {
  id: 253,
  titleDe: "Ranglisten",
  titleAr: "لوحات الصدارة",
  family: "Gamification",
  bloom: "فهم",
  level: "A1-B2",
  research: "Landers 2017",
  caution: "Nur Top-10 + persönliche Bestleistung zeigen",
} as const;
export function leaderboardRank(scores: number[], myScore: number): number { return scores.filter(s=>s>myScore).length+1; }
export function showPersonalBest(current: number, best: number): boolean { return current >= best; }
