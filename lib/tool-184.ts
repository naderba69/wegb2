/**
 * 184 — Retrieval Practice Scheduling — جدولة الاسترجاع الموسع
 * Karpicke & Roediger 2008: expanding schedule 1-3-7-14 outperforms equal intervals
 * Level: B2 | Bloom: قيّم
 */
export const TOOL_184 = {
  id: 184,
  titleDe: "Expanding Retrieval",
  titleAr: "استرجاع موسع",
  schedule: [1, 3, 7, 14, 30], // days
} as const;

export function getNextRetrievalInterval(successCount: number): number {
  return TOOL_184.schedule[Math.min(successCount, TOOL_184.schedule.length - 1)];
}

export function shouldExpand(lastInterval: number, success: boolean): number {
  if (!success) return 1; // reset
  const idx = (TOOL_184.schedule as readonly number[]).indexOf(lastInterval);
  return (TOOL_184.schedule as readonly number[])[Math.min(idx + 1, TOOL_184.schedule.length - 1)] ?? lastInterval * 2;
}
