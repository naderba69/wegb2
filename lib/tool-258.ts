/**
 * 258 — Tandem Learning — التعلّم الثنائي
 * Brammerts 1996: native speaker exchange → authentic input + cultural
 * Level: A2-B2 | Bloom: طبّق | Family: Immersion
 */
export const TOOL_258 = {
  id: 258,
  titleDe: "Tandem-Lernen",
  titleAr: "التعلّم الثنائي",
  family: "Immersion",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Brammerts 1996",
  rule: "50% Deutsch, 50% Arabisch",
} as const;
export function tandemPair(l1: string, l2: string): string { return `Tandem: ${l1} ↔ ${l2} (je 30 Min)`; }
export function tandemTopic(level: string): string { const m: Record<string,string>={A2:"Familie",B1:"Arbeit",B2:"Politik"}; return m[level]??"Hobbys"; }
