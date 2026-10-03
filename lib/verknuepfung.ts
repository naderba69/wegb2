import type { VocabCard, Lesetext, Hoerdialog } from "./types";
import { alleVokabeln, texts, dialogues, leseText, sentences } from "./content";
import { kollokationen, partnerWort } from "./kollokationen";
import { baueLexikon, zerlege, type Zerlegung } from "./komposita";

/**
 * فهرسُ الترابطِ الديناميكيّ — يُبنى وقتَ التشغيلِ من الجذوع، بلا ملفٍّ يدويّ:
 *  كلمةٌ في نصٍّ/حوار ← بطاقتُها (+ مثالُها + متلازماتُها)   |   بطاقةٌ ← النصوصُ والحواراتُ التي تظهرُ فيها
 * الجذعُ = الكلمةُ بلا أداةٍ، مقطوعةً إلى max(4, len-2) أحرف — نفسُ قاعدةِ K76c.
 */
const norm = (s: string) => s.toLowerCase().replace(/é/g, "e").replace(/[^a-zäöüß0-9 -]/g, " ").replace(/\s+/g, " ").trim();
export const stammVon = (w: string) => { const x = norm(w).replace(/^(der|die|das|sich|jdn|jdm) /, "").replace(/^etwas /, "").split(" ")[0] ?? ""; return x.length < 3 ? "" : x.slice(0, Math.max(4, x.length - 2)); };

const STOPP = new Set(["eine", "einen", "einer", "eines", "einem", "nicht", "dass", "wird", "werden", "wenn", "aber", "auch", "sich", "über", "ohne", "nach", "durch", "oder", "noch", "dann", "beim", "vom", "zum", "zur", "mit", "und", "der", "die", "das", "den", "dem", "des", "als", "für", "auf", "ist", "sind", "war", "weil", "damit", "statt", "trotz", "nur", "sein", "seine", "ihre", "kein", "keine", "sehr", "mehr", "schon", "erst", "ganz", "alle", "diese", "dieser", "jede", "jeden", "heute", "morgen", "gestern", "hier", "dort", "jetzt", "immer", "haben", "hatte", "hat", "habe", "bin", "bist", "sind", "wir", "ihr", "sie", "ich", "man", "was", "wer", "wie", "wo"]);

/** جدولُ الأبلاوتِ للأفعالِ القويّةِ الشائعة: الجذعُ المصرَّفُ → جذعُ المصدر. صريحٌ ومحدود — لا تخمين */
const ABLAUT: [string, string][] = [["gesprochen", "sprech"], ["sprach", "sprech"], ["geschrieben", "schreib"], ["schrieb", "schreib"], ["gegeben", "geb"], ["gab", "geb"], ["genommen", "nehm"], ["nahm", "nehm"], ["gekommen", "komm"], ["kam", "komm"], ["gegangen", "geh"], ["ging", "geh"], ["gefahren", "fahr"], ["fuhr", "fahr"], ["gelesen", "les"], ["las", "les"], ["gesehen", "seh"], ["sah", "seh"], ["getrunken", "trink"], ["trank", "trink"], ["gefunden", "find"], ["fand", "find"], ["geholfen", "helf"], ["half", "helf"], ["geblieben", "bleib"], ["blieb", "bleib"], ["gestanden", "steh"], ["stand", "steh"], ["geboten", "biet"], ["bot", "biet"], ["geflogen", "flieg"], ["flog", "flieg"], ["gelaufen", "lauf"], ["lief", "lauf"], ["gerufen", "ruf"], ["rief", "ruf"], ["getragen", "trag"], ["trug", "trag"], ["geschlossen", "schließ"], ["schloss", "schließ"], ["getroffen", "treff"], ["traf", "treff"], ["gewusst", "wiss"], ["wusste", "wiss"], ["gebracht", "bring"], ["brachte", "bring"], ["gedacht", "denk"], ["dachte", "denk"], ["gegessen", "ess"], ["aß", "ess"], ["gehabt", "hab"], ["hatte", "hab"], ["geworden", "werd"], ["wurde", "werd"], ["gewonnen", "gewinn"], ["gewann", "gewinn"], ["verloren", "verlier"], ["verlor", "verlier"], ["begonnen", "beginn"], ["begann", "beginn"], ["entschieden", "entscheid"], ["entschied", "entscheid"], ["geschlafen", "schlaf"], ["schlief", "schlaf"], ["gestiegen", "steig"], ["stieg", "steig"], ["gezogen", "zieh"], ["zog", "zieh"], ["gebacken", "back"], ["gewaschen", "wasch"], ["wusch", "wasch"], ["gesungen", "sing"], ["sang", "sing"], ["geschwommen", "schwimm"], ["schwamm", "schwimm"], ["gesessen", "sitz"], ["saß", "sitz"], ["gelegen", "lieg"], ["lag", "lieg"], ["gehalten", "halt"], ["hielt", "halt"], ["gelassen", "lass"], ["ließ", "lass"], ["gefallen", "fall"], ["fiel", "fall"], ["gebeten", "bitt"], ["bat", "bitt"], ["empfohlen", "empfehl"], ["empfahl", "empfehl"], ["verstanden", "versteh"], ["verstand", "versteh"], ["vergessen", "vergess"], ["vergaß", "vergess"], ["angeboten", "anbiet"], ["angefangen", "anfang"], ["fing", "fang"], ["eingeladen", "einlad"], ["lud", "lad"], ["mitgebracht", "mitbring"], ["angerufen", "anruf"], ["aufgestanden", "aufsteh"], ["umgezogen", "umzieh"], ["ausgezogen", "auszieh"], ["eingezogen", "einzieh"], ["bestanden", "besteh"], ["gesprungen", "spring"], ["gestorben", "sterb"], ["starb", "sterb"], ["geschnitten", "schneid"], ["schnitt", "schneid"], ["gebunden", "bind"], ["band", "bind"], ["gegriffen", "greif"], ["griff", "greif"], ["gewachsen", "wachs"], ["wuchs", "wachs"], ["gestohlen", "stehl"], ["stahl", "stehl"], ["geschienen", "schein"], ["schien", "schein"], ["gesunken", "sink"], ["sank", "sink"], ["gestritten", "streit"], ["stritt", "streit"], ["verglichen", "vergleich"], ["verglich", "vergleich"], ["geschossen", "schieß"], ["bewiesen", "beweis"], ["bewies", "beweis"], ["gelogen", "lüg"], ["log", "lüg"]];
function ablaut(w: string): string {
  for (const [von, zu] of ABLAUT) { if (w === von || w.startsWith(von) && w.length - von.length <= 2) return zu; }
  return w;
}

interface Index {
  /** جذع → بطاقات (قد تتعدّد: Karte/Karteikarte) — الأقصرُ أوّلاً */
  karten: Map<string, VocabCard[]>;
  /** بطاقة → معرِّفاتُ النصوصِ والحواراتِ من مستواها التي تحوي جذعَها */
  vorkommen: Map<string, { texte: string[]; dialoge: string[]; saetze: string[] }>;
}
let _idx: Index | null = null;

/** المدوّنةُ لكلِّ مستوى: نصوصُه (قصيرةً وطويلة) + حواراتُه + جملُ تمرينِه — كلُّها يقابلُها المتعلّمُ فعلاً في الخطة */
function korpusVon(level: string): { texte: [string, string][]; dialoge: [string, string][]; saetze: [string, string][] } {
  return {
    texte: texts.filter((t) => t.level === level).map((t) => [t.id, norm(leseText(t).de + " " + t.de)] as [string, string]),
    dialoge: dialogues.filter((d) => d.level === level).map((d) => [d.id, norm(d.lines.map((l) => l.de).join(" "))] as [string, string]),
    saetze: sentences.filter((x) => x.level === level).map((x) => [x.id, norm(x.de)] as [string, string]),
  };
}

export function index(): Index {
  if (_idx) return _idx;
  const karten = new Map<string, VocabCard[]>();
  for (const c of alleVokabeln) {
    const st = stammVon(c.de);
    if (!st || STOPP.has(st)) continue;
    const l = karten.get(st) ?? []; l.push(c); karten.set(st, l);
  }
  for (const l of karten.values()) l.sort((a, b) => a.de.length - b.de.length);
  const vorkommen = new Map<string, { texte: string[]; dialoge: string[]; saetze: string[] }>();
  const korpora: Record<string, ReturnType<typeof korpusVon>> = {};
  for (const c of alleVokabeln) {
    const st = stammVon(c.de); if (!st) continue;
    const k = (korpora[c.level] ??= korpusVon(c.level));
    vorkommen.set(c.id, { texte: k.texte.filter(([, de]) => de.includes(st)).map(([id]) => id), dialoge: k.dialoge.filter(([, de]) => de.includes(st)).map(([id]) => id), saetze: k.saetze.filter(([, de]) => de.includes(st)).map(([id]) => id) });
  }
  _idx = { karten, vorkommen };
  return _idx;
}

/** البطاقةُ التي تشرحُ كلمةً من نصّ — ترتيبٌ صريح: مطابقةٌ معجميّةٌ تامّة › الكلمةُ تبدأُ بالبطاقة › البطاقةُ تبدأُ بالكلمة › الجذع؛ ثم مستوى النصِّ أو الأدنى؛ ثم الأقصر */
export function karteFuerWort(wort: string, level?: string): VocabCard | null {
  const w = norm(wort).replace(/[^a-zäöüß-]/g, "");
  if (w.length < 3 || STOPP.has(w)) return null;
  const idx = index();
  const rang: Record<string, number> = { A0: -1, A1: 0, A2: 1, B1: 2, B2: 3 };
  const max = level ? rang[level] ?? 3 : 3;
  const kern = (c: VocabCard) => norm(c.de).replace(/^(der|die|das|sich) /, "").split(" ")[0] ?? "";
  // صيغٌ مرشَّحة: الكلمةُ نفسُها، بلا ge- (Partizip)، بلا لواحقِ التصريف، وبعدَ ردِّ الأبلاوت (gesprochen→sprech)
  const ab = ablaut(w);
  const varianten = [...new Set([w, ab, w.replace(/^ge/, ""), w.replace(/(en|st|et|er|em|es|e|t|n)$/, ""), w.replace(/^ge/, "").replace(/(en|t|e)$/, ""), ab.replace(/(en|t|e)$/, "")])].filter((v) => v.length >= 3);
  const kandidaten = new Map<string, { c: VocabCard; score: number }>();
  const add = (c: VocabCard, score: number) => { const alt = kandidaten.get(c.id); if (!alt || alt.score > score) kandidaten.set(c.id, { c, score }); };
  for (const v of varianten) {
    for (let n = v.length; n >= 4; n--) {
      const st = v.slice(0, n); const l = idx.karten.get(st); if (!l) continue;
      for (const c of l) {
        const k = kern(c);
        if (k === v) add(c, 0);
        else if (v.startsWith(k) && v.length - k.length <= 3) add(c, 1);
        else if (k.startsWith(v) && k.length - v.length <= 3) add(c, 2);
        else if (k.slice(0, Math.max(4, k.length - 2)) === st && st.length >= 5) add(c, 3);
      }
      if (kandidaten.size) break;
    }
    if ([...kandidaten.values()].some((x) => x.score <= 1)) break;
  }
  if (!kandidaten.size) return null;
  const sortiert = [...kandidaten.values()].sort((a, b) => a.score - b.score || (((rang[a.c.level] ?? 3) <= max ? 0 : 1) - ((rang[b.c.level] ?? 3) <= max ? 0 : 1)) || a.c.de.length - b.c.de.length || (rang[b.c.level] ?? 3) - (rang[a.c.level] ?? 3));
  return sortiert[0].c;
}

export interface Verknuepfung {
  karte: VocabCard;
  kollokationen: string[];
  texte: Lesetext[];
  dialoge: Hoerdialog[];
  saetze: { id: string; de: string; ar: string }[];
  komposita?: Zerlegung | null;
  partnerKarten: VocabCard[];
}

let _kompLex: ReturnType<typeof baueLexikon> | null = null;
function getKompLex() {
  if (!_kompLex) _kompLex = baueLexikon(alleVokabeln);
  return _kompLex;
}

/** كلُّ ما يرتبطُ ببطاقة: متلازماتُها، النصوصُ والحواراتُ من مستواها، تفكيكُ المركّبِ، وبطاقاتُ الشركاءِ */
export function verknuepfung(card: VocabCard): Verknuepfung {
  const v = index().vorkommen.get(card.id) ?? { texte: [], dialoge: [], saetze: [] };
  const ks = kollokationen[card.id] ?? [];
  const z = zerlege(card.de, getKompLex());
  const komp = z.sicher && z.teile.length > 1 ? z : null;

  const partnerKarten: VocabCard[] = [];
  for (const k of ks) {
    const pw = partnerWort(card, k);
    if (pw) {
      const pc = karteFuerWort(pw, card.level);
      if (pc && pc.id !== card.id && !partnerKarten.some((p) => p.id === pc.id)) {
        partnerKarten.push(pc);
      }
    }
  }

  return {
    karte: card,
    kollokationen: ks,
    texte: texts.filter((t) => v.texte.includes(t.id)),
    dialoge: dialogues.filter((d) => v.dialoge.includes(d.id)),
    saetze: sentences.filter((x) => v.saetze.includes(x.id)),
    komposita: komp,
    partnerKarten,
  };
}

/** البطاقاتُ اليتيمة: لا تظهرُ كلمتُها في أيِّ نصٍّ أو حوارٍ من مستواها — مدخلُ إنتاجِ الحواراتِ الجديدة */
export function verwaiste(level: string): VocabCard[] {
  const idx = index();
  return alleVokabeln.filter((c) => c.level === level && stammVon(c.de) && !STOPP.has(stammVon(c.de))).filter((c) => { const v = idx.vorkommen.get(c.id)!; return v.texte.length === 0 && v.dialoge.length === 0 && v.saetze.length === 0; });
}

/** نسبةُ الترابطِ لكلِّ مستوى — نفسُ الرقمِ الذي تعرضُه K76c */
export function abdeckung(level: string): { mit: number; gesamt: number; prozent: number } {
  const idx = index();
  const cs = alleVokabeln.filter((c) => c.level === level);
  const mit = cs.filter((c) => { const v = idx.vorkommen.get(c.id); return v && (v.texte.length || v.dialoge.length || v.saetze.length); }).length;
  return { mit, gesamt: cs.length, prozent: cs.length ? Math.floor((100 * mit) / cs.length) : 0 };
}
