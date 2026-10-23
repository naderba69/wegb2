/**
 * 365 — Learning Styles Myth — أسطورة أنماط التعلّم
 * Family: تلقين | Bloom: قيّم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_365 = {
  id: 365,
  titleDe: "Learning Styles Myth",
  titleAr: "أسطورة أنماط التعلّم",
  family: "تلقين",
  bloom: "قيّم",
  level: "A0-B2",
  research: "Pashler 2008",
  desc: "Learning Styles Myth classroom application",
} as const;

export function tool365Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool365Check(v: number): boolean { return v>0; }
