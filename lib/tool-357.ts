/**
 * 357 — Peer Review Schreiben — مراجعة الأقران للكتابة
 * Family: تقويم | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_357 = {
  id: 357,
  titleDe: "Peer Review Schreiben",
  titleAr: "مراجعة الأقران للكتابة",
  family: "تقويم",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Ferris 2003",
  desc: "Peer Review Schreiben classroom application",
} as const;

export function tool357Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool357Check(v: number): boolean { return v>0; }
