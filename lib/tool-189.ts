/**
 * 189 — Variation Theory (Marton) — نظرية التباين
 * Marton & Booth 1997: learning = discerning variation (same vs different)
 * Level: B1 | Bloom: حلّل
 */
export const TOOL_189 = {
  id: 189,
  titleDe: "Variationstheorie",
  titleAr: "نظرية التباين",
  principle: "Zeige was gleich bleibt und was variiert",
} as const;

export interface VariationPair {
  invariant: string; // stays same
  variant: string; // changes
  frageAr: string;
}

export function variationFrage(invariant: string, variant: string): VariationPair {
  return {
    invariant,
    variant,
    frageAr: `ما الذي تغيّر بين "${invariant}" و "${variant}"؟`,
  };
}
