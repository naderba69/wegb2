/**
 * 🛠️ R301 (vom Besitzer gewünscht: Komfort) — Anzeige-Einstellungen:
 * helles Thema + Schriftgröße. Rein lokal (localStorage), kein Konto,
 * keine Plan-/Fortschrittsänderung. Reine Helfer über K326 betreut.
 */
export type KomfortThema = "dunkel" | "hell";
export type KomfortSchrift = "normal" | "gross" | "sehr";

export interface KomfortCfg {
  thema: KomfortThema;
  schrift: KomfortSchrift;
}

export const KOMFORT_KEY = "weg-komfort-v1";
export const KOMFORT_STANDARD: KomfortCfg = { thema: "dunkel", schrift: "normal" };

/** Aus beliebigem Speicherstand eine gültige Konfiguration machen (nie werfen). */
export function normalisiereKomfort(raw: unknown): KomfortCfg {
  let obj: unknown = raw;
  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw);
    } catch {
      return { ...KOMFORT_STANDARD };
    }
  }
  if (!obj || typeof obj !== "object") return { ...KOMFORT_STANDARD };
  const o = obj as { thema?: unknown; schrift?: unknown };
  return {
    thema: o.thema === "hell" ? "hell" : "dunkel",
    schrift: o.schrift === "gross" || o.schrift === "sehr" ? o.schrift : "normal",
  };
}

export function ladeKomfort(): KomfortCfg {
  try {
    return normalisiereKomfort(localStorage.getItem(KOMFORT_KEY));
  } catch {
    return { ...KOMFORT_STANDARD };
  }
}

export function speichereKomfort(cfg: KomfortCfg): void {
  try {
    localStorage.setItem(KOMFORT_KEY, JSON.stringify(cfg));
  } catch {
    /* Speicher voll/privat — Einstellung gilt dann nur für diese Sitzung */
  }
}

/** Auf das Wurzelelement anwenden (CSS: html[data-thema="hell"], html[data-schrift="gross"|"sehr"]). */
export function wendeKomfortAn(cfg: KomfortCfg): void {
  if (typeof document === "undefined") return;
  const wurzel = document.documentElement;
  wurzel.dataset.thema = cfg.thema;
  wurzel.dataset.schrift = cfg.schrift;
}
