/**
 * 189 — Variationstheorie — نظرية التباين
 * Family: طرائق | Bloom: حلّل | Level: B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_189 = {
  id: 189,
  titleDe: "Variationstheorie",
  titleAr: "نظرية التباين",
  family: "طرائق",
  bloom: "حلّل",
  level: "B1",
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
