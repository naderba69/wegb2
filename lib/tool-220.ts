/**
 * 220 — CLT Principles — مبادئ المقاربة التواصلية
 * Canale & Swain 1980: grammatical + sociolinguistic + strategic + discourse competence
 * Level: A1-B2 | Bloom: أنشئ | Family: طرائق
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
