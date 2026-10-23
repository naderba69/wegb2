/**
 * Isomorpher Bank-Lader (R163 + R402 P2 lazy lang + vertiefung + vocab/grammar-split).
 * - Node: liest content/**.json synchron — alle 54 Banken (vocab/grammar gesplittet)
 * - Browser: /banks.json (core 19, ~2.5M), /banks-vertiefung.json (15, ~1.5M inkl. vocab-b2+grammar-b2), /banks-lang.json (20)
 *   Core: arena,cando,dialog-audio,dialogues,diktat-audio,fehler,grammar-core,haerte,hoeren-audio,hoerneu,lebenswelt,
 *         kollokationen,leseleiter,mnemonik,redemittel,tiefenlex,verben,vocab-core,texts
 *   Vertiefung: eselsbruecken,kollok-vertiefung,luecken,muendlich,pakete,sentences,sprichwort-audio,synonyme-kontext,
 *               synonym-vertiefung,szenarien,pflege,vortrag,writing,vocab-b2,grammar-b2
 */
import { readFileSync } from "fs";
import { join } from "path";

export const BANK_DATEIEN: string[] = [
  "arena.json", "cando.json", "dialog-audio.json", "dialogues.json", "diktat-audio.json",
  "fehler.json", "grammar-core.json", "haerte.json", "hoeren-audio.json", "hoerneu.json", "lebenswelt.json",
  "kollokationen.json", "leseleiter.json", "mnemonik.json", "redemittel.json",
  "texts.json", "tiefenlex.json", "verben.json", "vocab-core.json",
];
export const VERTIEFUNG_DATEIEN: string[] = [
  "eselsbruecken.json", "kollok-vertiefung.json", "luecken.json", "muendlich.json", "pakete.json",
  "sentences.json", "sprichwort-audio.json", "synonyme-kontext.json", "synonym-vertiefung.json",
  "szenarien.json", "pflege.json", "vortrag.json", "writing.json", "vocab-b2.json", "grammar-b2.json",
];
export const LANG_DATEIEN: string[] = [
  "lang/a1-01-10.json", "lang/a1-11-20.json", "lang/a1-21-25.json", "lang/a1-26-30.json", "lang/a1-31-35.json",
  "lang/a2-01-10.json", "lang/a2-11-20.json", "lang/a2-21-26.json", "lang/a2-27-32.json",
  "lang/b1-01-10.json", "lang/b1-11-20.json", "lang/b1-21-25.json", "lang/b1-26-30.json", "lang/b1-31-35.json",
  "lang/b2-01-10.json", "lang/b2-11-20.json", "lang/b2-21-25.json", "lang/b2-26-30.json", "lang/b2-31-35.json", "lang/b2-36-40.json",
];

const roh: Record<string, unknown> = {};
let bereit = false;
let vertiefungBereit = false;
let langBereit = false;
const wartende: (() => void)[] = [];
const vertiefungWartende: (() => void)[] = [];

const fsDa = typeof readFileSync === "function";

function splitByLevel(voll: Record<string, { level: string }>, target = "B2"): { core: Record<string, unknown>; b2: Record<string, unknown> } {
  const core: Record<string, unknown> = {};
  const b2: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(voll)) {
    if ((v as { level: string }).level === target) b2[k] = v;
    else core[k] = v;
  }
  return { core, b2 };
}

function ladeSync(): boolean {
  if (!fsDa) return false;
  try {
    const vocabVoll = JSON.parse(readFileSync(join(process.cwd(), "content", "vocab.json"), "utf8")) as Record<string, { level: string }>;
    const { core: vocabCore, b2: vocabB2 } = splitByLevel(vocabVoll, "B2");
    roh["vocab-core.json"] = vocabCore;
    roh["vocab-b2.json"] = vocabB2;
    roh["vocab.json"] = vocabVoll;
    const grammarVoll = JSON.parse(readFileSync(join(process.cwd(), "content", "grammar.json"), "utf8")) as Record<string, { level: string }>;
    const { core: grammarCore, b2: grammarB2 } = splitByLevel(grammarVoll, "B2");
    roh["grammar-core.json"] = grammarCore;
    roh["grammar-b2.json"] = grammarB2;
    roh["grammar.json"] = grammarVoll;
    for (const name of [...BANK_DATEIEN, ...VERTIEFUNG_DATEIEN, ...LANG_DATEIEN]) {
      if (name === "vocab-core.json" || name === "vocab-b2.json" || name === "vocab.json" || name === "grammar-core.json" || name === "grammar-b2.json" || name === "grammar.json") continue;
      roh[name] = JSON.parse(readFileSync(join(process.cwd(), "content", ...name.split("/")), "utf8"));
    }
    bereit = true; vertiefungBereit = true; langBereit = true;
    return true;
  } catch { return false; }
}
ladeSync();

export function bankRoh(name: string): unknown { return roh[name]; }
export function bankenBereit(): boolean { return bereit; }
export function vertiefungBereitF(): boolean { return vertiefungBereit; }
export function langBankenBereit(): boolean { return langBereit; }
export function beiBankenBereit(fn: () => void): void { if (bereit) fn(); else wartende.push(fn); }
export function beiVertiefungBereit(fn: () => void): void { if (vertiefungBereit) fn(); else vertiefungWartende.push(fn); }

/** Browser-Bootstrap: lädt /banks.json (core) sofort, vertiefung/lang lazy */
export async function initialisiereBanken(): Promise<void> {
  if (bereit) return;
  const res = await fetch("/banks.json");
  if (!res.ok) throw new Error(`/banks.json: HTTP ${res.status}`);
  const alle = (await res.json()) as Record<string, unknown>;
  for (const name of BANK_DATEIEN) roh[name] = alle[name];
  if (roh["vocab-core.json"] && !roh["vocab.json"]) roh["vocab.json"] = roh["vocab-core.json"];
  if (roh["grammar-core.json"] && !roh["grammar.json"]) roh["grammar.json"] = roh["grammar-core.json"];
  bereit = true;
  for (const fn of wartende.splice(0)) fn();
  initialisiereVertiefung().catch(() => {});
  setTimeout(() => { initialisiereLangBanken().catch(() => {}); }, 3000);
}

export async function initialisiereVertiefung(): Promise<void> {
  if (vertiefungBereit) return;
  try {
    const res = await fetch("/banks-vertiefung.json");
    if (!res.ok) throw new Error(`/banks-vertiefung.json: HTTP ${res.status}`);
    const alle = (await res.json()) as Record<string, unknown>;
    for (const name of VERTIEFUNG_DATEIEN) roh[name] = alle[name];
    if (roh["vocab-core.json"] && roh["vocab-b2.json"]) {
      roh["vocab.json"] = { ...(roh["vocab-core.json"] as object), ...(roh["vocab-b2.json"] as object) };
    }
    if (roh["grammar-core.json"] && roh["grammar-b2.json"]) {
      roh["grammar.json"] = { ...(roh["grammar-core.json"] as object), ...(roh["grammar-b2.json"] as object) };
    }
    vertiefungBereit = true;
    for (const fn of vertiefungWartende.splice(0)) fn();
  } catch {}
}

export async function initialisiereLangBanken(): Promise<void> {
  if (langBereit) return;
  try {
    const res = await fetch("/banks-lang.json");
    if (!res.ok) throw new Error(`/banks-lang.json: HTTP ${res.status}`);
    const alle = (await res.json()) as Record<string, unknown>;
    for (const name of LANG_DATEIEN) roh[name] = alle[name];
    langBereit = true;
  } catch {}
}
