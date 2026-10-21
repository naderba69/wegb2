/**
 * 074 Peer assessment تقييم الأقران — RUBRIC مصغر للكتابة.
 */
export const PEER_KRITERIEN = ["Inhalt", "Wortschatz", "Grammatik", "Höflichkeit"] as const;
export function peerScore(bewertungen: number[]): number { return bewertungen.reduce((a,b)=>a+b,0)/bewertungen.length; }
