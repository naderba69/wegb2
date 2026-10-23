/**
 * 275 — Chunking (fortgeschritten) — التكتيل المتقدم
 * Family: الذاكرة | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
