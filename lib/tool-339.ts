/**
 * 339 — Study Abroad Prep — التحضير للدراسة بالخارج
 * Kinginger 2009: applied to German teaching — classroom integration via tasks
 * Level: B1-B2 | Bloom: قيّم | Family: Immersion
 */
export const TOOL_339 = {
  id: 339,
  titleDe: "Study Abroad Prep",
  titleAr: "التحضير للدراسة بالخارج",
  family: "Immersion",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Kinginger 2009",
  desc: "Study Abroad Prep applied in classroom",
} as const;
export function tool339Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool339Check(v: number): boolean { return v>0; }
