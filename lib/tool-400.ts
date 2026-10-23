/**
 * 400 — Forgetting Curve Ebbinghaus — منحنى النسيان
 * Family: الذاكرة | Bloom: فهم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
