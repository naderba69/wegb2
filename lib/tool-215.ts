/**
 * 215 — Focus on Form — التركيز على الشكل ضمن المعنى
 * Long 1991: brief attention to form within communicative task > isolated drill
 * Level: A2-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_215 = {
  id: 215,
  titleDe: "Focus on Form",
  titleAr: "التركيز على الشكل",
  family: "SLA",
  bloom: "حلّل",
  level: "A2-B2",
  research: "Long 1991",
  vs: "Focus on Forms (isoliert) < Focus on Form (integriert)",
} as const;
export function focusOnForm(task: string, form: string): string { return `${task} — achte dabei auf: ${form}`; }
export function isFocusOnForm(communicative: boolean, formAttention: boolean): boolean { return communicative && formAttention; }
