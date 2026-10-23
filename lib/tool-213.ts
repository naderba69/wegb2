/**
 * 213 — Interaktionshypothese — فرضية التفاعل
 * Family: SLA | Bloom: طبّق | Level: B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_213 = {
  id: 213,
  titleDe: "Interaktionshypothese",
  titleAr: "فرضية التفاعل",
  family: "SLA",
  bloom: "طبّق",
  level: "B1",
  research: "Long 1996",
  moves: "Klärungsfrage, Wiederholung, Umformulierung",
} as const;

export function interactionMove(type: "clarify"|"recast"|"confirm"): string {
  const m = { clarify: "Wie bitte? Meinst du ...?", recast: "Ach so, du meinst ...", confirm: "Verstehe, also ..." };
  return m[type];
}
export function negotiationGain(negotiated: boolean): number { return negotiated ? 1.25 : 1.0; }
