/**
 * 240 — CEFR Selbsteinschätzung — التقويم الذاتي CEFR
 * Family: تقويم | Bloom: قيّم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_240 = {
  id: 240,
  titleDe: "CEFR Selbsteinschätzung",
  titleAr: "التقويم الذاتي CEFR",
  family: "تقويم",
  bloom: "قيّم",
  level: "A0-B2",
  research: "CEFR 2001",
  scale: "Ich kann ... mit Hilfe / selbstständig / flüssig",
} as const;

export function canDo(level: string, skill: string): string { return `Ich kann auf ${level} ${skill}`; }
export function selfAssessLevel(score: number): string { if(score>=0.8) return "flüssig"; if(score>=0.6) return "selbstständig"; return "mit Hilfe"; }
