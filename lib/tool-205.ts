/**
 * 205 — Kooperatives Lernen — التعلّم التعاوني
 * Family: Gamification | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_205 = {
  id: 205,
  titleDe: "Kooperatives Lernen",
  titleAr: "التعلّم التعاوني",
  family: "Gamification",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Johnson 2009 d=0.54",
  group: "3-4 Personen, Rollen verteilen",
} as const;

export function groupSize(level: string): number {
  return level === "B2" ? 4 : 3;
}
export function coopGain(cooperative: boolean): number {
  return cooperative ? 1.2 : 1.0;
}
