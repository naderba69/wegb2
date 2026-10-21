/**
 * 246 — Benchmarking — المعايرة المرجعية
 * North 2000: CEFR benchmarks enable cross-institution comparability
 * Level: A0-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_246 = {
  id: 246,
  titleDe: "Benchmarking",
  titleAr: "المعايرة المرجعية",
  family: "تقويم",
  bloom: "قيّم",
  level: "A0-B2",
  research: "North 2000",
  method: "Anker-Beispiele, Standard-Setting",
} as const;
export function benchmarkLevel(score: number): string { if(score>=90) return "B2"; if(score>=75) return "B1"; if(score>=60) return "A2"; if(score>=40) return "A1"; return "A0"; }
export function isBenchmarked(score: number, level: string): boolean { return benchmarkLevel(score)===level; }
