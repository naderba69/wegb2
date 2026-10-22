/**
 * 216 — TBLT — التعلّم القائم على المهام
 * Willis 1996: pre-task → task cycle → language focus
 * Level: A2-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_216 = {
  id: 216,
  titleDe: "TBLT (Aufgabenbasiert)",
  titleAr: "التعلّم بالمهام",
  family: "طرائق",
  bloom: "أنشئ",
  level: "A2-B2",
  research: "Willis 1996",
  cycle: "Pre-task → Task → Focus",
} as const;
export type TbltPhase = "pre" | "task" | "focus";
export function tbltNext(phase: TbltPhase): TbltPhase { return phase==="pre"?"task":phase==="task"?"focus":"pre"; }
export function tbltPrompt(taskDe: string): string { return `Aufgabe: ${taskDe} — löse sie auf Deutsch!`; }
