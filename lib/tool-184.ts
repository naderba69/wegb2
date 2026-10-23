/**
 * 184 — Expanding Retrieval — استرجاع موسع
 * Family: الذاكرة | Bloom: قيّم | Level: B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_184 = {
  id: 184,
  titleDe: "Expanding Retrieval",
  titleAr: "استرجاع موسع",
  family: "الذاكرة",
  bloom: "قيّم",
  level: "B2",
  schedule: [1,3,7,14,30],
} as const;

export function getNextRetrievalInterval(successCount: number): number {
  return TOOL_184.schedule[Math.min(successCount, TOOL_184.schedule.length - 1)];
}

export function shouldExpand(lastInterval: number, success: boolean): number {
  if (!success) return 1; // reset
  const idx = (TOOL_184.schedule as readonly number[]).indexOf(lastInterval);
  return (TOOL_184.schedule as readonly number[])[Math.min(idx + 1, TOOL_184.schedule.length - 1)] ?? lastInterval * 2;
}
