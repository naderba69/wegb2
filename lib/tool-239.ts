/**
 * 239 — Summatives Assessment — التقويم الختامي
 * Family: تقويم | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_239 = {
  id: 239,
  titleDe: "Summatives Assessment",
  titleAr: "التقويم الختامي",
  family: "تقويم",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Bloom 1969",
  rule: "Teste nur was gelehrt wurde",
} as const;

export function summativeWeight(type: string): number { const m: Record<string,number>={quiz:0.2, midterm:0.3, final:0.5}; return m[type]??0.2; }
export function isSummative(day: number): boolean { return day % 28 === 0; }
