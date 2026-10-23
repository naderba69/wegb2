/**
 * 250 — Gamification Basics — أساسيات التلعيب
 * Family: Gamification | Bloom: طبّق | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
