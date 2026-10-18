import { levelAmTag } from "./phasen";
import type { Level, Progress } from "./types";

/**
 * 🔊 M7 (R287, Experten-Audit): Standard-Abspieltempo nach Niveau —
 * A0 0.85 · A1 0.90 · A2 0.95 · B1 1.00 · B2 1.05.
 * Die manuelle Wahl bleibt jederzeit möglich und wird gespeichert.
 * Altbestand ohne rateMode: exakt der bisherige Standard 0.85 gilt als
 * „automatisch“, jede abweichende gespeicherte Wahl als manuell.
 */
export const RATE_STUFEN: Record<Level, number> = {
  A0: 0.85,
  A1: 0.9,
  A2: 0.95,
  B1: 1,
  B2: 1.05,
};

export function rateFuerLevel(level: Level): number {
  return RATE_STUFEN[level];
}

export function rateModus(settings: Progress["settings"]): "auto" | "manual" {
  if (settings.rateMode) return settings.rateMode;
  return Math.abs((settings.rate ?? 0.85) - 0.85) < 0.001 ? "auto" : "manual";
}

export function effektiveRate(p: Progress): number {
  const level = levelAmTag(Math.min(Math.max(p.plan.day, 1), 378));
  if (rateModus(p.settings) === "manual") {
    return Math.min(1.1, Math.max(0.65, p.settings.rate ?? RATE_STUFEN[level]));
  }
  return RATE_STUFEN[level];
}
