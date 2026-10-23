/**
 * 196 — Handlung & Geste — التجسيد والإيماء
 * Family: طرائق | Bloom: طبّق | Level: A1-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_196 = {
  id: 196,
  titleDe: "Handlung & Geste",
  titleAr: "التجسيد والإيماء",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B1",
  research: "Engelkamp 1998",
  gain: "+25% for action phrases",
} as const;

export function enactmentCue(verbDe: string): string {
  return `Gestikuliere: ${verbDe} — zeige die Handlung!`;
}
export function isActionVerb(pos: string): boolean {
  return pos === "verb" || pos === "Verb";
}
