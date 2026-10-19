import type { Progress } from "./types";

/**
 * 🎙️ A4 (R282, Experten-Audit ← N8): tägliches Sprechziel, gemessen aus den
 * lokal gespeicherten Sprechübungen (sprechUebungen: datum + dauerS).
 * Ehrlich begrenzt: gezählt wird aufgezeichnete Sprechzeit der Sprechkarten —
 * freies lautes Sprechen ohne Aufnahme bleibt unsichtbar und wird nicht erfunden.
 */
export const SPRECH_ZIEL_SEK = 300; // 5 Minuten aufgezeichnetes Sprechen pro Tag

export function sprechHeute(p: Progress, heuteIso?: string): { sek: number; ziel: number; erreicht: boolean; eintraege: number } {
  const heute = heuteIso ?? new Date().toISOString().slice(0, 10);
  const eintraege = (p.sprechUebungen ?? []).filter((e) => (e.datum ?? "").slice(0, 10) === heute);
  const sek = eintraege.reduce((a, e) => a + Math.max(0, e.dauerS || 0), 0);
  return { sek, ziel: SPRECH_ZIEL_SEK, erreicht: sek >= SPRECH_ZIEL_SEK, eintraege: eintraege.length };
}
