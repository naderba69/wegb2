/**
 * Isomorpher Bank-Lader (R163).
 * - Node (Smoke/Interaktiv/Prerender): liest `content/**.json` synchron von der Platte —
 *   die Tests fahren exakt denselben Datenpfad wie bisher, ohne Netz und ohne Kopie.
 * - Browser: holt einmalig `/banks.json` (von `scripts/copy_banks.mjs` aus `content/` erzeugt)
 *   und füllt dieselben Rohdaten; Container in `lib/content.ts` werden an Ort und Stelle befüllt.
 * Webpack ersetzt `fs`/`path` im Client-Bundle durch Leermodule (next.config) — `fsDa` erkennt das.
 */
import { readFileSync } from "fs";
import { join } from "path";

export const BANK_DATEIEN: string[] = [
  "arena.json", "cando.json", "dialog-audio.json", "dialogues.json", "diktat-audio.json",
  "eselsbruecken.json", "fehler.json", "grammar.json", "haerte.json", "hoeren-audio.json", "hoerneu.json",
  "kollokationen.json", "kollok-vertiefung.json", "leseleiter.json", "luecken.json", "mnemonik.json", "muendlich.json", "pakete.json", "redemittel.json",
  "sentences.json", "sprichwort-audio.json", "synonyme-kontext.json", "synonym-vertiefung.json", "szenarien.json",
  "texts.json", "tiefenlex.json", "verben.json", "vertiefung.json", "vocab.json", "vortrag.json", "writing.json",
  "lang/a1-01-10.json", "lang/a1-11-20.json", "lang/a1-21-25.json", "lang/a1-26-30.json", "lang/a1-31-35.json",
  "lang/a2-01-10.json", "lang/a2-11-20.json", "lang/a2-21-26.json", "lang/a2-27-32.json",
  "lang/b1-01-10.json", "lang/b1-11-20.json", "lang/b1-21-25.json", "lang/b1-26-30.json", "lang/b1-31-35.json",
  "lang/b2-01-10.json", "lang/b2-11-20.json", "lang/b2-21-25.json", "lang/b2-26-30.json", "lang/b2-31-35.json", "lang/b2-36-40.json",
];

const roh: Record<string, unknown> = {};
let bereit = false;
const wartende: (() => void)[] = [];

const fsDa = typeof readFileSync === "function";

function ladeSync(): boolean {
  if (!fsDa) return false;
  try {
    for (const name of BANK_DATEIEN) {
      roh[name] = JSON.parse(readFileSync(join(process.cwd(), "content", ...name.split("/")), "utf8"));
    }
    bereit = true;
    return true;
  } catch {
    return false;
  }
}
ladeSync();

/** Rohdaten einer Bank (undefined, bis der Browser-Fetch durch ist). */
export function bankRoh(name: string): unknown {
  return roh[name];
}

/** true, sobald alle Banken verfügbar sind (in Node sofort). */
export function bankenBereit(): boolean {
  return bereit;
}

/** Führt `fn` aus, sobald die Banken da sind (in Node sofort beim Registrieren). */
export function beiBankenBereit(fn: () => void): void {
  if (bereit) fn();
  else wartende.push(fn);
}

/** Browser-Bootstrap: lädt /banks.json einmalig und weckt alle registrierten Füller. */
export async function initialisiereBanken(): Promise<void> {
  if (bereit) return;
  const res = await fetch("/banks.json");
  if (!res.ok) throw new Error(`/banks.json: HTTP ${res.status}`);
  const alle = (await res.json()) as Record<string, unknown>;
  for (const name of BANK_DATEIEN) roh[name] = alle[name];
  bereit = true;
  for (const fn of wartende.splice(0)) fn();
}
