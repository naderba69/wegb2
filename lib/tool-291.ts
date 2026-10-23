/**
 * 291 — Goal Setting — تحديد الأهداف
 * Family: تلقين | Bloom: أنشئ | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_291 = {
  id: 291,
  titleDe: "Goal Setting",
  titleAr: "تحديد الأهداف",
  family: "تلقين",
  bloom: "أنشئ",
  level: "A0-B2",
  research: "Locke 1990",
  desc: "specific + challenging + feedback → performance +20%",
} as const;

export function tool291Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool291Check(v: number): boolean { return v > 0; }
