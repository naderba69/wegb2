// lib/leseleiter.ts — سلّم القراءة المتدرّج A0→A1 (C1/R175)
// العقد: نصوص جسرية قصيرة بعد A0، أطوالها في نطاقات معلنة لكل محطة،
// ومفرداتها مقيدة ببطاقات A0/A1 (مع قائمة كلمات وظيفية A0/A1 الموثّقة أدناه)
// وكلّ كلمة خارج ذلك تكون في مسرد النص نفسه — تفرضه بوابة K268b على البنك كله.

import { alleVokabeln, leseleiter, type LeiterText } from "./content";
import type { Progress } from "./types";

export const LEITER_STUFEN: { stufe: number; labelAr: string; minW: number; maxW: number }[] = [
  { stufe: 1, labelAr: "المحطة 1 — جمل أولى قصيرة", minW: 18, maxW: 28 },
  { stufe: 2, labelAr: "المحطة 2 — يوميات بسيطة", minW: 28, maxW: 38 },
  { stufe: 3, labelAr: "المحطة 3 — أيام وهوايات وطقس", minW: 38, maxW: 50 },
  { stufe: 4, labelAr: "المحطة 4 — سوق وعمل ومدينة", minW: 50, maxW: 65 },
  { stufe: 5, labelAr: "المحطة 5 — سفر وصحة وتسوّق", minW: 65, maxW: 82 },
  { stufe: 6, labelAr: "المحطة 6 — خطط وأهداف (باب A1)", minW: 82, maxW: 100 },
];

export const stufeBand = (stufe: number) => LEITER_STUFEN.find((s) => s.stufe === stufe) ?? LEITER_STUFEN[0];
export const texteDerStufe = (stufe: number): LeiterText[] => leseleiter.filter((t) => t.stufe === stufe);
export const woerterZaehlen = (de: string): number => de.split(/\s+/).filter(Boolean).length;

/* ── بوابة المفردات: بطاقات A0/A1 + كلمات وظيفية + مسرد النص ── */

const falte = (w: string): string => w.replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
export const tokenisiere = (de: string): string[] => de.toLowerCase().match(/[a-zäöüß]+/g) ?? [];

const IRREG: Record<string, string> = { aß: "essen", besser: "gut", beste: "gut", besten: "gut", bin: "sein", bist: "sein", darf: "dürfen", darfst: "dürfen", dürfen: "dürfen", dürft: "dürfen", esse: "essen", essen: "essen", esst: "essen", fahre: "fahren", fahren: "fahren", fahrt: "fahren", finde: "finden", finden: "finden", findet: "finden", fährst: "fahren", fährt: "fahren", gab: "geben", gebe: "geben", geben: "geben", gebt: "geben", gehe: "gehen", gehen: "gehen", geht: "gehen", gibst: "geben", gibt: "geben", habe: "haben", haben: "haben", habt: "haben", hast: "haben", hat: "haben", hatte: "haben", hatten: "haben", helfe: "helfen", helfen: "helfen", helft: "helfen", hilft: "helfen", isst: "essen", ist: "sein", kann: "können", kannst: "können", komme: "kommen", kommen: "kommen", kommt: "kommen", konnte: "können", können: "können", könnt: "können", las: "lesen", laufe: "laufen", laufen: "laufen", lauft: "laufen", lese: "lesen", lesen: "lesen", lest: "lesen", liege: "liegen", liegen: "liegen", liegt: "liegen", liest: "lesen", läufst: "laufen", läuft: "laufen", mag: "mögen", magst: "mögen", mochte: "mögen", muss: "müssen", musst: "müssen", musste: "müssen", möchte: "möchten", möchten: "möchten", möchtest: "möchten", möchtet: "möchten", mögen: "mögen", mögt: "mögen", müssen: "müssen", müsst: "müssen", nahm: "nehmen", nehme: "nehmen", nehmen: "nehmen", nehmt: "nehmen", nimmt: "nehmen", sah: "sehen", schlafe: "schlafen", schlafen: "schlafen", schlaft: "schlafen", schläfst: "schlafen", schläft: "schlafen", sehe: "sehen", sehen: "sehen", seht: "sehen", seid: "sein", siehst: "sehen", sieht: "sehen", sind: "sein", sitze: "sitzen", sitzen: "sitzen", sitzt: "sitzen", soll: "sollen", sollen: "sollen", sollst: "sollen", sollt: "sollen", sprach: "sprechen", spreche: "sprechen", sprechen: "sprechen", sprecht: "sprechen", spricht: "sprechen", stehe: "stehen", stehen: "stehen", steht: "stehen", trinke: "trinken", trinken: "trinken", trinkt: "trinken", tu: "tun", tue: "tun", tun: "tun", tut: "tun", war: "sein", waren: "sein", warst: "sein", wart: "sein", weiß: "wissen", weißt: "wissen", werde: "werden", werden: "werden", werdet: "werden", will: "wollen", willst: "wollen", wird: "werden", wirst: "werden", wissen: "wissen", wisst: "wissen", wollen: "wollen", wollt: "wollen", wollte: "wollen", wurde: "werden" };
const KONTRAKTIONEN: Record<string, string> = { am: "an", ans: "an", beim: "bei", im: "in", ins: "in", vom: "von", zum: "zu", zur: "zu" };
const FUNKTIONSWOERTER = new Set<string>(["aber", "alle", "allein", "als", "am", "an", "ans", "auch", "auf", "aus", "bei", "beim", "bis", "dann", "das", "dein", "deine", "deinem", "deinen", "dem", "den", "denn", "der", "des", "dich", "die", "dir", "dort", "du", "ein", "eine", "einem", "einen", "einer", "eines", "er", "es", "euch", "fast", "fuer", "gern", "gestern", "heute", "hier", "hinter", "ich", "ihm", "ihnen", "ihr", "ihre", "ihrem", "ihren", "im", "immer", "in", "ins", "ist", "ja", "jede", "jedem", "jeden", "jeder", "jetzt", "kein", "keine", "keinem", "keinen", "man", "manchmal", "mehr", "mein", "meine", "meinem", "meinen", "meiner", "mich", "mir", "mit", "morgen", "nach", "nein", "nicht", "noch", "nur", "oder", "oft", "schon", "sehr", "seine", "seinem", "seinen", "seiner", "seit", "sich", "sie", "ueber", "um", "und", "uns", "unter", "viel", "viele", "vom", "von", "vor", "was", "weiter", "wer", "wie", "wieder", "wir", "wo", "zu", "zum", "zur", "zusammen", "zwischen"]);

const SUFFIXE = ["en", "ern", "er", "es", "in", "e", "t", "st", "n", "s"];

function stammKandidaten(w: string): Set<string> {
  const out = new Set<string>([w, falte(w)]);
  let cur = [w];
  for (let runde = 0; runde < 2; runde++) {
    const nxt: string[] = [];
    for (const c of cur)
      for (const suf of SUFFIXE)
        if (c.endsWith(suf) && c.length - suf.length >= 3) nxt.push(c.slice(0, -suf.length));
    cur = nxt;
    for (const c of cur) { out.add(c); out.add(falte(c)); }
  }
  for (const c of [...out]) { out.add(c + "n"); out.add(c + "en"); out.add(falte(c) + "en"); }
  return out;
}

let lemmaCache: Set<string> | null = null;
/** لمّات بطاقات المفردات بمستوى A0/A1 (من vocab.json عبر alleVokabeln) */
export function erlaubteLemmata(): Set<string> {
  if (lemmaCache && alleVokabeln.length) return lemmaCache;
  const s = new Set<string>();
  for (const k of alleVokabeln) {
    if (k.level !== "A0" && k.level !== "A1") continue;
    for (const tok of tokenisiere(k.de)) { s.add(tok); s.add(falte(tok)); }
  }
  lemmaCache = s;
  return s;
}

/** كلمات النص غير المغطاة: لا بطاقة A0/A1 ولا كلمة وظيفية ولا مسرد النص — يجب أن تكون فارغة (K268b) */
export function fehlendeWoerter(text: LeiterText): string[] {
  const erlaubt = erlaubteLemmata();
  const glossar = new Set<string>();
  for (const g of text.glossar) for (const tok of tokenisiere(g.de)) glossar.add(tok);
  const fehlend = new Set<string>();
  for (const wort of tokenisiere(text.de)) {
    const kandidaten = stammKandidaten(wort);
    let ok = FUNKTIONSWOERTER.has(wort) || FUNKTIONSWOERTER.has(falte(wort));
    if (!ok) for (const k of kandidaten) if (erlaubt.has(k) || glossar.has(k)) { ok = true; break; }
    if (!ok) {
      const lemma = IRREG[wort];
      if (lemma && (erlaubt.has(lemma) || erlaubt.has(falte(lemma)) || glossar.has(lemma))) ok = true;
    }
    if (!ok) {
      const kontr = KONTRAKTIONEN[wort];
      if (kontr && erlaubt.has(kontr)) ok = true;
    }
    if (!ok) fehlend.add(wort);
  }
  return [...fehlend].sort();
}

/* ── التقدّم في السلّم ── */

export type LeiterBest = Record<string, { r: number; g: number }>;

/** نصٌّ «مجتاز» عند ثلثي أسئلته فأكثر صحيحة في أفضل محاولة */
export const textBestanden = (best: LeiterBest, id: string): boolean => {
  const e = best[id];
  return !!e && e.g > 0 && e.r / e.g >= 2 / 3;
};

export function stufeAbgeschlossen(best: LeiterBest, stufe: number): boolean {
  const texte = texteDerStufe(stufe);
  return texte.length > 0 && texte.every((t) => textBestanden(best, t.id));
}

/** المحطة 1 مفتوحة دائمًا؛ التالية تُفتح بإتمام سابقتها كلّها */
export function stufeFrei(best: LeiterBest, stufe: number): boolean {
  return stufe <= 1 || stufeAbgeschlossen(best, stufe - 1);
}

export function leiterFortschritt(best: LeiterBest): { gelesen: number; bestanden: number; gesamt: number } {
  return {
    gelesen: Object.keys(best).length,
    bestanden: leseleiter.filter((t) => textBestanden(best, t.id)).length,
    gesamt: leseleiter.length,
  };
}

export type { LeiterText };
export type LeiterProgress = Progress["leseleiter"];
