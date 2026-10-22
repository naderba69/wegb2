/**
 * 232 — Minimal Pairs — الأزواج الدنيا
 * Celce-Murcia 2010: contrasting /ɪ/-/i:/, /ʊ/-/u:/, /ç/-/x/ trains perception + production
 * Level: A1-A2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_232 = {
  id: 232,
  titleDe: "Minimalpaare",
  titleAr: "الأزواج الدنيا",
  family: "طرائق",
  bloom: "فهم",
  level: "A1-A2",
  research: "Celce-Murcia 2010",
  pairs: "bieten/bitten, Miete/Mitte, Küche/Kuchen",
} as const;
export function minimalPair(de: string): [string,string] {
  const m: Record<string,[string,string]>={ "bieten": ["bieten","bitten"], "Miete": ["Miete","Mitte"] };
  return m[de]??[de,de];
}
export function isMinimalPair(a: string,b: string): boolean { let d=0; for(let i=0;i<Math.max(a.length,b.length);i++) if(a[i]!==b[i]) d++; return d===1; }
