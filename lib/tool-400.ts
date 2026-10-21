/**
 * 400 — Forgetting Curve Ebbinghaus — منحنى النسيان
 * Ebbinghaus 1885: classroom application with task integration
 * Level: A0-B2 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_400 = {
  id: 400,
  titleDe: "Forgetting Curve Ebbinghaus",
  titleAr: "منحنى النسيان",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A0-B2",
  research: "Ebbinghaus 1885",
  desc: "Forgetting Curve Ebbinghaus classroom",
} as const;
export function tool400Gain(a: boolean): number { return a?1.2:1.0; }
export function tool400Check(v:number):boolean { return v>0; }
