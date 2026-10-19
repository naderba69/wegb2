import { alleVokabeln } from "./content";
import { frequenzStufe } from "./frequenz";
import type { Level, Progress, VocabCard } from "./types";

/**
 * 📚 A21 + A29 (R295, Experten-Audit): Frequenz-/Bestandsprüfung gegen
 * eingebettete Referenzgrößen. Referenz: veröffentlichte ungefähre
 * Umfänge der Goethe-Wortlisten (A1–B1); für B2 gibt es keine amtliche
 * Einheitsliste — Literaturspanne, als solche gekennzeichnet.
 * Keine externen Daten, keine erfundene Präzision.
 */
export interface ReferenzZeile {
  level: Level;
  kartenHier: number;
  kumuliert: number;
  referenz: string;
  status: "darueber" | "darunter" | "offen";
}

const REFERENZ: Partial<Record<Level, { ca: number; quelleAr: string }>> = {
  A1: { ca: 650, quelleAr: "قائمة Goethe A1 المنشورة (تقريبي)" },
  A2: { ca: 1300, quelleAr: "قائمة Goethe A2 المنشورة (تقريبي)" },
  B1: { ca: 2400, quelleAr: "قائمة Goethe B1 المنشورة (تقريبي)" },
  B2: { ca: 4500, quelleAr: "نطاق أدبيات CEFR لـB2 الاستقبالي (لا قائمة رسمية موحّدة)" },
};

const STUFEN: Level[] = ["A0", "A1", "A2", "B1", "B2"];

export function referenzBericht(): ReferenzZeile[] {
  let kum = 0;
  return STUFEN.map((level) => {
    const n = alleVokabeln.filter((k) => k.level === level).length;
    kum += n;
    const ref = REFERENZ[level];
    return {
      level,
      kartenHier: n,
      kumuliert: kum,
      referenz: ref ? `≈${ref.ca} — ${ref.quelleAr}` : "مقدمة قبل A1",
      status: !ref ? "offen" : kum >= ref.ca ? "darueber" : "darunter",
    };
  });
}

/** Häufig im App-Korpus, aber erst spät (B2) einsortiert — Prüffälle, keine Fehlerurteile */
export function frequenzAnomalien(limit = 8): { karte: VocabCard; n: number }[] {
  return alleVokabeln
    .map((karte) => ({ karte, n: frequenzStufe(karte).n }))
    .filter((x) => x.karte.level === "B2" && x.n >= 15)
    .sort((a, b) => b.n - a.n)
    .slice(0, limit);
}

/** A29: schnellster Zuwachs — häufigste, noch nicht eingeführte Karten */
export function schnellsteRezeptiv(p: Progress, limit = 12): { karte: VocabCard; n: number }[] {
  return alleVokabeln
    .filter((k) => !p.srs[k.id])
    .map((karte) => ({ karte, n: frequenzStufe(karte).n }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.karte.de.localeCompare(b.karte.de))
    .slice(0, limit);
}

export function b2Luecke(): { kumuliert: number; zielCa: number; luecke: number } {
  const kumuliert = alleVokabeln.length;
  const zielCa = REFERENZ.B2?.ca ?? 4500;
  return { kumuliert, zielCa, luecke: Math.max(0, zielCa - kumuliert) };
}
