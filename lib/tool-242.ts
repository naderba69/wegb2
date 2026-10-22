/**
 * 242 — Self-Assessment — التقويم الذاتي
 * Oscarson 1989: learner self-rates predict proficiency r=0.6; boosts autonomy
 * Level: A1-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_242 = {
  id: 242,
  titleDe: "Selbsteinschätzung",
  titleAr: "التقويم الذاتي",
  family: "تقويم",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Oscarson 1989 r=0.6",
  scale: "★★★/★★☆/★☆☆",
} as const;
export function selfRate(skill: string, stars: number): string { return `${skill}: ${"★".repeat(stars)}${"☆".repeat(3-stars)}`; }
export function calibrate(self: number, teacher: number): number { return Math.abs(self-teacher); }
