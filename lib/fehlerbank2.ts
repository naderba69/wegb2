import type { Exercise, FehlerState, Progress, VocabCard } from "./types";
import { isDue } from "./srs";
import { kollokationen, kollokationUebung } from "./kollokationen";

/**
 * دفترُ الأخطاءِ 2.0 — بلا نموذجٍ لغويّ:
 *  1) الأولويّة: «ثقةٌ خاطئة» أوّلاً، ثم الأكثرُ تكراراً، ثم الأقدمُ استحقاقاً.
 *  2) النقل: الخطأُ لا يُعادُ بالسؤالِ نفسِه بل بتمرينٍ جديدٍ من البطاقةِ المرتبطة (متلازمةٌ أو جملةُ مثال)؛
 *     إن لم تُوجَدْ بطاقةٌ يبقى السؤالُ المباشر (صيغةٌ صحيحة/خاطئة).
 */
export const UEBERKONFIDENZ_TAG = "ثقةٌ خاطئة";

export function istUeberkonfident(f: Pick<FehlerState, "ar">): boolean {
  return (f.ar ?? "").includes(UEBERKONFIDENZ_TAG);
}

export function prioritaet(f: FehlerState): [number, number, string] {
  return [istUeberkonfident(f) ? 0 : 1, -f.treffer, f.srs.due];
}

export function dueFehlerPriorisiert(p: Progress, max = 8): FehlerState[] {
  return Object.values(p.fehler ?? {})
    .filter((f) => isDue(f.srs))
    .sort((a, b) => {
      const [a0, a1, a2] = prioritaet(a); const [b0, b1, b2] = prioritaet(b);
      return a0 - b0 || a1 - b1 || a2.localeCompare(b2);
    })
    .slice(0, max);
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const kern = (de: string) => norm(de).replace(/^(der|die|das|sich) /, "").replace(/ (um|über|auf|an|für|von|mit|bei|nach|zu|gegen|vor)$/, "");

/** البطاقةُ المرتبطةُ بالخطأ: كلمةُ البطاقةِ تساوي الصوابَ، أو الصوابُ يظهرُ في متلازماتِها/جملتِها */
export function verwandteKarte(f: Pick<FehlerState, "richtig" | "falsch" | "quelle">, alle: VocabCard[]): VocabCard | null {
  const r = norm(f.richtig);
  if (!r || r.length < 3) return null;
  const exakt = alle.find((c) => kern(c.de) === r || norm(c.de) === r);
  if (exakt) return exakt;
  const inKollok = alle.find((c) => (kollokationen[c.id] ?? []).some((k) => norm(k) === r));
  if (inKollok) return inKollok;
  const tokens = r.split(" ").filter((t) => t.length >= 4);
  if (!tokens.length) return null;
  return alle.find((c) => { const k = kern(c.de); return k.length >= 4 && tokens.includes(k); }) ?? null;
}

export type TransferArt = "kollokation" | "beispiel" | "direkt";

/** تمرينُ الجملةِ: تُخفى كلمةُ البطاقةِ (بصيغتِها الفعليّةِ في الجملة) — إجابةُ الملءِ هي الصيغةُ كما وردت */
export function beispielUebung(card: VocabCard, f: Pick<FehlerState, "key">): Exercise | null {
  if (!card.exampleDe) return null;
  const k = kern(card.de).split(" ").pop()!;
  const stamm = k.length > 5 ? k.slice(0, k.length - 2) : k.slice(0, Math.max(3, k.length - 1));
  const woerter = card.exampleDe.split(/\s+/);
  const idx = woerter.findIndex((w) => norm(w).startsWith(stamm));
  if (idx < 0) return null;
  const antwort = woerter[idx].replace(/[.,!?;:„“"]/g, "");
  if (antwort.length < 3) return null;
  const masked = woerter.map((w, i) => (i === idx ? "_____" : w)).join(" ");
  return { id: `fb2-${f.key.slice(0, 24)}-bsp`, type: "fill", promptDe: masked, promptAr: `أكمل بالكلمة المناسبة (${card.ar})`, answer: [antwort, antwort.toLowerCase()], explanationAr: `الجملة: ${card.exampleDe} — ${card.exampleAr ?? ""}`, explanationDe: card.exampleDe };
}

export function transferUebung(f: FehlerState, alle: VocabCard[], rand: () => number): { ex: Exercise; art: TransferArt; card?: VocabCard } | null {
  const card = verwandteKarte(f, alle);
  if (!card) return null;
  const k = kollokationUebung(card, alle, rand, f.treffer);
  if (k) return { ex: { ...k, id: `fb2-${f.key.slice(0, 24)}-kol` }, art: "kollokation", card };
  const b = beispielUebung(card, f);
  if (b) return { ex: b, art: "beispiel", card };
  return null;
}
