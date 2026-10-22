/**
 * 275 — Chunking Advanced — التكتيل المتقدم
 * Miller 1956 7±2: chunk 7 words into 3 chunks → working memory efficiency
 * Level: A1-B2 | Bloom: فهم | Family: الذاكرة
 */
export const TOOL_275 = {
  id: 275,
  titleDe: "Chunking (fortgeschritten)",
  titleAr: "التكتيل المتقدم",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A1-B2",
  research: "Miller 1956",
  limit: "7±2 Chunks im Kurzzeitgedächtnis",
} as const;
export function chunk<T>(items: T[], size: number): T[][] { const r: T[][]=[]; for(let i=0;i<items.length;i+=size) r.push(items.slice(i,i+size)); return r; }
export function optimalChunkSize(total: number): number { return total<=7?3:4; }
