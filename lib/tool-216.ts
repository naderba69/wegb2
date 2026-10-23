/**
 * 216 — TBLT (Aufgabenbasiert) — التعلّم بالمهام
 * Family: طرائق | Bloom: أنشئ | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
