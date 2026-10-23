/**
 * 220 — CLT (Kommunikativ) — المقاربة التواصلية
 * Family: طرائق | Bloom: أنشئ | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_220 = {
  id: 220,
  titleDe: "CLT (Kommunikativ)",
  titleAr: "المقاربة التواصلية",
  family: "طرائق",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Canale 1980",
  competences: "grammatisch, soziolinguistisch, strategisch, Diskurs",
} as const;

export const CLT_COMPETENCES = ["grammatisch","soziolinguistisch","strategisch","Diskurs"] as const;
export function cltBalance(competences: Record<string, number>): number {
  const vals = Object.values(competences);
  if (!vals.length) return 0;
  return vals.reduce((a,b)=>a+b,0)/vals.length;
}
