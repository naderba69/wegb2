/**
 * 🏷️ M12 (R283, Experten-Audit ← N41): Genus-Doppelkodierung — Farbe PLUS Form
 * und Buchstabe (der ● m · die ▲ f · das ■ n), damit die Information auch ohne
 * Farbsehen (Farbfehlsichtigkeit) vollstaendig bleibt.
 */
export const GENUS_CODE: Record<string, { symbol: string; letter: string; ar: string }> = {
  der: { symbol: "●", letter: "m", ar: "مذكّر" },
  die: { symbol: "▲", letter: "f", ar: "مؤنّث" },
  das: { symbol: "■", letter: "n", ar: "محايد" },
};

export function genusCode(article?: string | null): { symbol: string; letter: string; ar: string } | null {
  if (!article) return null;
  return GENUS_CODE[article.trim().toLowerCase()] ?? null;
}
