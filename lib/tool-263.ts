/**
 * 263 — Interleaving vs Blocking — التشابك مقابل الحجب
 * Rohrer 2012: interleaved math +29% vs blocked; applies to grammar paradigms
 * Level: A1-B2 | Bloom: طبّق | Family: الذاكرة
 */
export const TOOL_263 = {
  id: 263,
  titleDe: "Interleaving vs Blocking",
  titleAr: "التشابك مقابل الحجب",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Rohrer 2012 +29%",
  rule: "mische Kasus/Grammatik, nicht blockweise",
} as const;
export function interleave<T>(items: T[]): T[] { const a=[...items]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
export function shouldInterleave(topicCount: number): boolean { return topicCount>=3; }
