/**
 * 365 — Learning Styles Myth — أسطورة أنماط التعلّم
 * Pashler 2008: classroom-ready application with tasks
 * Level: A0-B2 | Bloom: قيّم | Family: تلقين
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
