/**
 * 274 — Loci-Methode (fortgeschritten) — قصر الذاكرة المتقدم
 * Family: الذاكرة | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_274 = {
  id: 274,
  titleDe: "Loci-Methode (fortgeschritten)",
  titleAr: "قصر الذاكرة المتقدم",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Yates 1966",
  palace: "20 Räume × 4 Slots = 80 Items",
} as const;

export function lociRoute(rooms: number): string[] { return Array.from({length: rooms}, (_,i)=> `Raum ${i+1}`); }
export function lociPlace(word: string, room: string): string { return `${word} → ${room}`; }
