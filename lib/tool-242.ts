/**
 * 242 — Selbsteinschätzung — التقويم الذاتي
 * Family: تقويم | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
