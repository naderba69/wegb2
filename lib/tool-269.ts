/**
 * 269 — Gestützter Abruf — الاستدعاء الموجه
 * Family: الذاكرة | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_269 = {
  id: 269,
  titleDe: "Gestützter Abruf",
  titleAr: "الاستدعاء الموجه",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Tulving 1973",
  cue: "Hinweis muss zum Lernen passen",
} as const;

export function cueFor(word: string): string { return `Hinweis: fängt mit "${word.slice(0,2)}" an`; }
export function cueGain(cued: boolean): number { return cued?1.3:1.0; }
