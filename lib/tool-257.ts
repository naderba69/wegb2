/**
 * 257 — AR Overlays — التراكب المعزز
 * Godwin-Jones 2016: AR labels on real objects → contextual vocabulary
 * Level: A0-A2 | Bloom: فهم | Family: Immersion
 */
export const TOOL_257 = {
  id: 257,
  titleDe: "AR-Overlays",
  titleAr: "التراكب المعزز",
  family: "Immersion",
  bloom: "فهم",
  level: "A0-A2",
  research: "Godwin-Jones 2016",
  use: "Kamera auf Objekt → deutsches Wort erscheint",
} as const;
export function arLabel(object: string): string { return `AR: ${object} → deutsches Wort + Artikel + Bild`; }
export function arGain(contextual: boolean): number { return contextual?1.15:1.0; }
