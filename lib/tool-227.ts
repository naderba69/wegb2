/**
 * 227 — Peer Teaching — التدريس المتبادل
 * Bargh & Schul 1980: explaining to others → deeper processing (protégé effect)
 * Level: A2-B2 | Bloom: قيّم | Family: طرائق
 */
export const TOOL_227 = {
  id: 227,
  titleDe: "Peer Teaching",
  titleAr: "التدريس المتبادل",
  family: "طرائق",
  bloom: "قيّم",
  level: "A2-B2",
  research: "Bargh 1980",
  effect: "Wer lehrt, lernt besser",
} as const;
export function peerTeachPrompt(topic: string): string { return `Erkläre ${topic} einem Partner — er stellt Fragen!`; }
export function teachingGain(explained: boolean): number { return explained?1.35:1.0; }
