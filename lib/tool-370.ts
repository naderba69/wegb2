/**
 * 370 — Lifelong Learning — التعلّم مدى الحياة
 * Family: تلقين | Bloom: أنشئ | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_370 = {
  id: 370,
  titleDe: "Lifelong Learning",
  titleAr: "التعلّم مدى الحياة",
  family: "تلقين",
  bloom: "أنشئ",
  level: "A0-B2",
  research: "EU 2006",
  desc: "Lifelong Learning classroom application",
} as const;

export function tool370Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool370Check(v: number): boolean { return v>0; }
