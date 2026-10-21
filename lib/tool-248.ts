/**
 * 248 — Moderation — المواءمة التقييمية
 * Harlen 2005: moderation meetings align teacher judgments → reliability +0.2
 * Level: A1-B2 | Bloom: قيّم | Family: تقويم
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
