/**
 * 249 — Rubric Design — تصميم سلم التقدير
 * Moskal 2000: analytic rubrics > holistic for formative; 3-5 criteria optimal
 * Level: A1-B2 | Bloom: أنشئ | Family: تقويم
 */
export const TOOL_249 = {
  id: 249,
  titleDe: "Rubric-Design",
  titleAr: "تصميم سلم التقدير",
  family: "تقويم",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Moskal 2000",
  criteria: "3-5 Kriterien, je 4 Stufen",
} as const;
export function rubricCriteria(task: string): string[] { return [`${task}: Inhalt`,`Sprache`,`Organisation`,`Aufgaben-Erfüllung`]; }
export function rubricScore(criteria: number[]): number { return criteria.reduce((a,b)=>a+b,0)/Math.max(criteria.length,1); }
