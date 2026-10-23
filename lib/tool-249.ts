/**
 * 249 — Rubric-Design — تصميم سلم التقدير
 * Family: تقويم | Bloom: أنشئ | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
