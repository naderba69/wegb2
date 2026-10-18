import { rng, pickN } from "./plan";
import type { Hoerdialog, Level, Satz } from "./types";

/**
 * 🎮 R300 (Wunsch des Besitzers: Spiele, alle Stufen) — drei freie Spiele aus
 * den eigenen Banken des Projekts (Vokabeln, Dialoge, Sätze). Deterministisch
 * per Samen, keine neuen Inhalte, keine Planänderung. Betreut über K325.
 */

/* ─────────────────────────── 1) Wortgitter (شبكة الكلمات) ─────────────────────────── */

export interface GitterWort {
  wort: string;
  ar: string;
}

export interface GitterTreffer {
  wort: string;
  ar: string;
  zellen: [number, number][];
}

export interface WortGitter {
  gitter: string[][];
  treffer: GitterTreffer[];
}

const FUELL = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ";

/** Wort fürs Gitter normalisieren: Großschrift, ß→SS, nur Buchstaben. */
export function gitterWort(raw: string): string {
  return raw
    .replace(/^(der|die|das)\s+/i, "")
    .trim()
    .toUpperCase()
    .replace(/ß/g, "SS")
    .replace(/[^A-ZÄÖÜ]/g, "");
}

export function baueWortgitter(pool: GitterWort[], seed: number, groesse = 10, maxWoerter = 8): WortGitter {
  const rand = rng(seed);
  // Kandidaten säubern, längste zuerst (leichter zu platzieren), Zufalls-Tiebreak
  const kandidaten = pool
    .map((w) => ({ wort: gitterWort(w.wort), ar: w.ar }))
    .filter((w) => w.wort.length >= 4 && w.wort.length <= groesse);
  const eindeutig = [...new Map(kandidaten.map((w) => [w.wort, w])).values()];
  eindeutig.sort((a, b) => b.wort.length - a.wort.length || rand() - 0.5);

  const gitter: string[][] = Array.from({ length: groesse }, () => Array<string>(groesse).fill(""));
  const treffer: GitterTreffer[] = [];
  const richtungen: [number, number][] = [
    [0, 1],
    [1, 0],
  ];

  for (const kandidat of eindeutig) {
    if (treffer.length >= maxWoerter) break;
    const wort = kandidat.wort;
    let platziert = false;
    for (let versuch = 0; versuch < 300 && !platziert; versuch++) {
      const [dr, dc] = richtungen[Math.floor(rand() * richtungen.length)];
      const vorzeichen = rand() < 0.5 ? 1 : -1;
      const r0 = Math.floor(rand() * groesse);
      const c0 = Math.floor(rand() * groesse);
      const zellen: [number, number][] = [];
      let ok = true;
      for (let i = 0; i < wort.length; i++) {
        const r = r0 + dr * vorzeichen * i;
        const c = c0 + dc * vorzeichen * i;
        if (r < 0 || r >= groesse || c < 0 || c >= groesse) { ok = false; break; }
        const vorhanden = gitter[r][c];
        if (vorhanden !== "" && vorhanden !== wort[i]) { ok = false; break; }
        zellen.push([r, c]);
      }
      if (!ok) continue;
      zellen.forEach(([r, c], i) => { gitter[r][c] = wort[i]; });
      treffer.push({ wort, ar: kandidat.ar, zellen });
      platziert = true;
    }
  }

  for (let r = 0; r < groesse; r++) {
    for (let c = 0; c < groesse; c++) {
      if (gitter[r][c] === "") gitter[r][c] = FUELL[Math.floor(rand() * FUELL.length)];
    }
  }
  return { gitter, treffer };
}

/* ─────────────────────────── 2) DialogLücke (أكمل الحوار) ─────────────────────────── */

export interface DialogLuecke {
  dialog: Hoerdialog;
  loch: number;
  optionen: string[];
  richtig: string;
}

export function dialogLuecke(dialoge: Hoerdialog[], seed: number): DialogLuecke | null {
  const rand = rng(seed);
  const kandidaten = dialoge.filter((d) => d.lines.length >= 6);
  if (kandidaten.length === 0) return null;
  const dialog = kandidaten[Math.floor(rand() * kandidaten.length)];
  const loch = 1 + Math.floor(rand() * (dialog.lines.length - 2));
  const richtig = dialog.lines[loch].de;

  const fremde = dialoge
    .filter((d) => d.id !== dialog.id && d.level === dialog.level)
    .flatMap((d) => d.lines.map((l) => l.de))
    .filter((de) => de !== richtig);
  const ablenker = pickN([...new Set(fremde)], 2, rand);
  const optionen = [richtig, ...ablenker];
  // Fisher-Yates mit derselben Zufallsquelle
  for (let i = optionen.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [optionen[i], optionen[j]] = [optionen[j], optionen[i]];
  }
  return { dialog, loch, optionen, richtig };
}

/* ─────────────────────────── 3) Übersetzung tippen (ترجم بنفسك) ─────────────────────────── */

function woerter(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[.,!?;:"„“”()«»\-–—]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function uebersetzRunde(saetze: Satz[], stufe: Level, seed: number): Satz | null {
  const rand = rng(seed);
  const kandidaten = saetze.filter((s) => s.level === stufe && s.de && s.ar);
  if (kandidaten.length === 0) return null;
  return kandidaten[Math.floor(rand() * kandidaten.length)];
}

/** Wort-Überlappung in Prozent (Mehrfachnennungen zählen mehrfach). */
export function uebersetzQuote(eingabe: string, soll: string): number {
  const sollWoerter = woerter(soll);
  if (sollWoerter.length === 0) return 0;
  const vorrat = new Map<string, number>();
  for (const w of woerter(eingabe)) vorrat.set(w, (vorrat.get(w) ?? 0) + 1);
  let treffer = 0;
  for (const w of sollWoerter) {
    const n = vorrat.get(w) ?? 0;
    if (n > 0) {
      treffer++;
      vorrat.set(w, n - 1);
    }
  }
  return Math.round((treffer / sollWoerter.length) * 100);
}

/** Wörter der Musterlösung, die in der Eingabe fehlen (Originalschreibweise). */
export function fehlendeWoerter(eingabe: string, soll: string): string[] {
  const norm = (w: string) =>
    w.toLowerCase().replace(/ß/g, "ss").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/[.,!?;:"„“”()«»]/g, "");
  const vorrat = new Map<string, number>();
  for (const w of woerter(eingabe)) vorrat.set(w, (vorrat.get(w) ?? 0) + 1);
  const fehlend: string[] = [];
  for (const original of soll.replace(/[.,!?;:"„“”()«»]/g, "").split(/\s+/).filter(Boolean)) {
    const key = norm(original);
    const n = vorrat.get(key) ?? 0;
    if (n > 0) vorrat.set(key, n - 1);
    else fehlend.push(original);
  }
  return fehlend;
}
