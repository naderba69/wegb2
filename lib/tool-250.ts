/**
 * 250 — Gamification Basics — أساسيات التلعيب
 * Deterding 2011: points/badges/leaderboards increase engagement when meaningful
 * Level: A0-B2 | Bloom: طبّق | Family: Gamification
 */
export const TOOL_250 = {
  id: 250,
  titleDe: "Gamification Basics",
  titleAr: "أساسيات التلعيب",
  family: "Gamification",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Deterding 2011",
  elements: "Punkte, Abzeichen, Rangliste, Quests",
} as const;
export function gameElements(): string[] { return ["Punkte","Abzeichen","Rangliste","Quest","Level-Up"]; }
export function gamifyPoints(taskDone: boolean): number { return taskDone?10:0; }
