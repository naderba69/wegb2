/**
 * 248 — Moderation — المواءمة التقييمية
 * Family: تقويم | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_248 = {
  id: 248,
  titleDe: "Moderation",
  titleAr: "المواءمة التقييمية",
  family: "تقويم",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Harlen 2005",
  process: "gemeinsam bewerten → diskutieren → angleichen",
} as const;

export function moderationGain(participants: number): number { return Math.min(1.3,1+participants*0.05); }
export function needsModeration(variance: number): boolean { return variance>0.3; }
