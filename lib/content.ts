import type {
  GrammarTopic,
  VocabCard,
  Satz,
  Lesetext,
  Langfassung,
  Exercise,
  Hoerdialog,
  Schreibaufgabe,
  FehlerEintrag,
  Level,
  Tiefenlex,
  Eselsbruecke,
} from "./types";
import { bankRoh, beiBankenBereit, beiVertiefungBereit, BANK_DATEIEN, VERTIEFUNG_DATEIEN, LANG_DATEIEN } from "./bankload";

export const grammarMap = {} as Record<string, GrammarTopic>;
export const vocabMap = {} as Record<
  string,
  { id: string; titleDe: string; titleAr: string; level: Level; cards: VocabCard[] }
>;
export const sentences = [] as unknown as Satz[];
/** العمق المعجمي (Modul P): Nuancen · Verb+Präp · Funktionsverbgefüge */
export const tiefenlex = {} as Tiefenlex;
/** سيناريوهات الحياة الستة (Modul Q): طوارئ · بلدية · بنك · سكن · عمل · جامعة */
export const szenarien = [] as import("./types").Szenario[];
/** حزم السياق الحيوي (Modul R): سفر · مقابلة · بحث عن سكن */
export const pakete = [] as import("./types").KontextPaket[];
/** كل بطاقات المفردات مسطّحة — تغذّي محركات الاختيار والتوليد */
export const alleVokabeln: VocabCard[] = [];

/** صيغة الاسم الكاملة/العنصر دون تكرار أداة التعريف المخزّنة في de. */
export function deFormOf(card: VocabCard, includeArticle = true): string {
  const prefix = card.article ? `${card.article} ` : "";
  const full = prefix && !card.de.startsWith(prefix) ? `${prefix}${card.de}` : card.de;
  return includeArticle || !prefix ? full : full.slice(prefix.length);
}

const langfassungen: Record<string, Langfassung> = {};
/** النصوص؛ مَن له نسخة طويلة يحملها في `lang` — وقراءة B2 تعرضها (المهمّة lesen) بينما يبقى `de` نصَّ الصوت */
export const texts = [] as unknown as Lesetext[];
/** نصُّ القراءةِ الفعليّ: الطويلُ إن وُجد وما لم يُطلَب القصير (تدرّج نسبة النصوص الأصلية 30→80٪) */
export function leseText(t: Lesetext): { de: string; ar: string; questions: Exercise[]; lang: boolean } {
  if (t.lang && !t.__weg_useShort) return { ...t.lang, lang: true };
  return { de: t.de, ar: t.ar, questions: t.questions, lang: false };
}
export const dialogues = [] as unknown as Hoerdialog[];
export const writingTasks = [] as unknown as Schreibaufgabe[];
export const candoMap = {} as Record<
  Level,
  { id: string; de: string; ar: string }[]
>;
/** بنك أنماط التصحيح الألمانية (مترابط بمحرّك دفتر الأخطاء) */
export const fehlerList = [] as (FehlerEintrag & { id: string; kat: string })[];
/** حيل الحفظ السريع لكل كلمة (كلمة مفتاحية/قصة/جذر عربي) */
export const mnemonikMap = {} as Record<
  string,
  { art: "schluessel" | "geschichte" | "arabisch" | "farbe"; tipp: string }
>;

/** أصواتُ الأمثالِ الثمانيةِ — ملفاتٌ من الدارِ بصوتِ voice-01 */
export const sprichwortAudio = {} as Record<
  string,
  { id: string; file: string; bytes: number; voice: string; de: string; ar: string }
>;
/** مسارُ صوتِ مثلٍ بعينِه — أو null إن لم يُفرَغْ بعد (تراجعٌ معلَنٌ لا صمت) */
export function sprichwortSrc(id: string): string | null {
  return sprichwortAudio[id]?.file ?? null;
}

/** بنكُ التركاتِ والشفراتِ والأمثال — كلُّ تركةٍ معلَّقةٌ بدرسِ قواعدَ مضيف */
export const eselsbruecken = [] as Eselsbruecke[];
/** تركاتُ درسٍ بعينِه — المستهلِكُ الوحيدُ لبطاقةِ القاعدة */
export function getBrueckenFor(gramId: string): Eselsbruecke[] {
  return eselsbruecken.filter((b) => (b.gramIds ?? []).includes(gramId));
}
/** R138/P-22: إيجاد التركات/الشفرات التي تخص كلمة مفردة بالبحث في storyAr+zeilen عن lemma. */
export function getBrueckenForWort(wortDe: string): Eselsbruecke[] {
  if (!wortDe) return [];
  const base = wortDe.toLowerCase().replace(/\(.*?\)/g, "").trim().split(/[\s,/]/)[0];
  if (base.length < 3) return [];
  const re = new RegExp(`\\b${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return eselsbruecken.filter((b) => {
    if (re.test(b.storyAr) || re.test(b.titleAr)) return true;
    return b.zeilen.some((z) => re.test(z.de) || re.test(z.code));
  }).slice(0, 2);
}

export function getGrammar(id: string): GrammarTopic | undefined {
  return grammarMap[id];
}
export function getDeck(id: string) {
  return vocabMap[id];
}
export function getText(id: string) {
  return texts.find((t) => t.id === id);
}
export function getDialogue(id: string) {
  return dialogues.find((d) => d.id === id);
}
export function getWriting(id: string) {
  return writingTasks.find((w) => w.id === id);
}
export function getSatz(id: string) {
  return sentences.find((s) => s.id === id);
}
export function getMnemonik(de: string) {
  const hit = mnemonikMap[de];
  if (hit) return hit;
  return mnemonikMap[de.replace(/^(der|die|das)\s+/, "").trim()];
}

// ── أفعال التصريف (Konjugationstrainer) — بيانات محرك التدريب ──────────
export interface VerbParadigmen {
  inf: string;
  aux: "haben" | "sein";
  part: string;
  präs: string[]; // ich, du, er/sie/es, wir, ihr, sie/Sie
  prt: string[];
  konj: string[]; // ich, du, er/sie/es
  ar?: string; // المعنى بالعربية
  trenn?: string; // بادئةُ الفصل
  praep?: string; // التعدِّي: حرفُ الجرِّ + الحالة
  bei?: { de: string; ar: string }; // شاهدٌ من الحياة
}
export const verben = [] as VerbParadigmen[];

// ── Grammatik-Arena — بيانات التعداد والروابط والمجهول ─────────────────
export interface ArenaNomen { wort: string; gen: "m" | "f" | "n" | "pl"; ar: string }
export interface ArenaKonnektor { satz: string; options: string[]; answer: string; ar: string }
export interface ArenaPassiv { aktiv: string; options: string[]; answer: string; ar: string }
export interface HaerteRung {
  id: string;
  frage: string;
  options: string[];
  answer: number;
  ar: string;
  de: string;
  skill?: "lesen" | "hoeren" | "schreiben" | "sprechen";
}
export const haerte: HaerteRung[] = [];

export interface MuendlichEinwand {
  id: string;
  de: string;
  ar: string;
}
export interface MuendlichKarte {
  id: string;
  teil: 1 | 2 | 3;
  level?: import("./types").Level;
  titel_de: string;
  titel_ar: string;
  auftrag_de?: string;
  auftrag_ar?: string;
  situationDe?: string;
  situationAr?: string;
  stuetzen?: string[];
  kriterien?: { ar: string; de: string }[];
  zeit_s?: number;
  einwaende?: MuendlichEinwand[];
  vorschlagA?: string;
  vorschlagB?: string;
  redemittel?: string[];
  tippAr?: string;
}
export interface KontaktKarte {
  id: string;
  level: import("./types").Level;
  teil: 1;
  titel_de: string;
  titel_ar: string;
  auftrag_de: string;
  auftrag_ar: string;
  situationDe?: string;
  situationAr?: string;
  vorschlagA?: string;
  vorschlagB?: string;
  stuetzen: string[];
  kriterien: { ar: string; de: string }[];
  zeit_s: number;
}
export interface PartnerKarte {
  id: string;
  level: string;
  situationDe: string;
  situationAr: string;
  vorschlagA: string;
  vorschlagB: string;
  redemittel: string[];
  tippAr: string;
  stuetzen?: string[];
  kriterien?: { ar: string; de: string }[];
  auftrag_de?: string;
  auftrag_ar?: string;
  zeit_s?: number;
  titel_de?: string;
  titel_ar?: string;
}
/** 🗣️ مختبر الشفهي — 24 بطاقة B2 + 21 A1/A2/B1 (Modul AA): 14 وصف صورة + 10 مناقشة B2 */
export const muendlich: MuendlichKarte[] = [];
export const partnerKarten: PartnerKarte[] = [];
export const kontaktKarten: KontaktKarte[] = [];
export const monologKartenExtra = muendlich; // all monolog cards (legacy mm01–mm12 now leveled + new)

export interface VortragThema {
  id: string;
  unit: string;
  titel_de: string;
  titel_ar: string;
  auftrag_de: string;
  aspekte: string[];
  redemittel: string[];
  partnerFragen: string[];
  dauer: { vorbereitung_s: number; vortrag_s: number };
}
/** 🎤 منصة العرض — 16 موضوع Goethe (8 لوحات × 2) لقالب Kurzvortrag */
export const vortrag: VortragThema[] = [];

export interface HoerAudio { id: string; file: string; voice: string; level: string; bytes: number }
/** 🧩 Lückendiktat — فراغُ الاستماع: جُمَلٌ من البنك مُبيَّضةُ الكلمة، وشريطُها النصُّ نفسه */
export interface LkGap { id: string; sent: string; blanked: string; answer: string }
export interface LkItem { id: string; textId: string; level: "B1" | "B2"; titleDe: string; titleAr: string; gaps: LkGap[] }
/** 🪜 نصّ سلّم القراءة (C1): نصّ جسريّ قصير بعد A0 بمفردات A0/A1 ومسرد ذاتي */
export interface LeiterText {
  id: string;
  stufe: 1 | 2 | 3 | 4 | 5 | 6;
  titelDe: string;
  titelAr: string;
  de: string;
  ar: string;
  glossar: { de: string; ar: string }[];
  fragen: { id: string; promptDe: string; promptAr: string; options: string[]; answer: string; explanationAr: string }[];
}
export const leseleiter: LeiterText[] = [];
/** 🎧 مادة استماع متنوّعة (C5/R179): أخبار/إعلانات/مقابلات بصوت KI موسوم — خارج الخطة */
export interface HoerNeuItem {
  id: string;
  format: "nachrichten" | "durchsage" | "werbung" | "interview";
  level: string;
  titelDe: string;
  titelAr: string;
  zeilen: { who: string; de: string; ar: string }[];
  clips: { zeilen: number[]; stimme: "A" | "B"; datei?: string; stimmeLabel?: string; bytes?: number }[];
  fragen: { id: string; promptDe: string; promptAr: string; options: string[]; answer: string; explanationAr: string }[];
}
export const hoerneu: HoerNeuItem[] = [];
/** 🧩 تلازم B2 معمّق (C6/R180): شريك الكلمة الصحيح داخل جملة سياقية */
export interface KollokVertiefungItem {
  id: string;
  kollokation: string;
  satz: string;
  satzAr: string;
  antwort: string;
  optionen: string[];
  ar: string;
  noteAr: string;
}
/** 🪞 مرادف B2 سجلّي معمّق (C6/R180): الكلمة الأرقى للسياق الرسمي مع بيان الفرق */
export interface SynonymVertiefungItem {
  id: string;
  basis: string;
  ziel: string;
  satz: string;
  satzAr: string;
  optionen: string[];
  nuanceAr: string;
}
export const kollokVertiefung: KollokVertiefungItem[] = [];
export const synonymVertiefung: SynonymVertiefungItem[] = [];
/** 🧰 عبارة تعبير وظيفية (C3): مصنّفة بوظيفتها وبأجزاء الامتحان التي تخدمها */
export interface RedemittelItem {
  id: string;
  de: string;
  ar: string;
  beispielDe: string;
  beispielAr: string;
  funktion: string;
  teile: string[];
  level: "A2" | "B1" | "B2";
}
export const redemittelBank: RedemittelItem[] = [];
export const luecken = [] as LkItem[];
export const hoerenAudio: Record<string, HoerAudio> = {};
export const diktatAudio: Record<string, HoerAudio> = {};
/** مصدر صوت الإملاء: ملفٌ من الدار أو لا شيء — واللاشيء معلنٌ لا مكتوم */
export function diktatSrc(id: string): string | null {
  return diktatAudio[id]?.file ?? null;
}
/** 💬 ξ7 — حوارٌ كاملٌ بصوتٍ واحد من الدار (B1/B2 الوافدة): ملفٌّ أو لا شيء — والتراجعُ إلى TTS معلنٌ في الواجهة */
export const dialogAudio: Record<string, HoerAudio> = {};
export function dialogAudioSrc(id: string): string | null {
  return dialogAudio[id]?.file ?? null;
}
/** نوعُ صوتِ الحوار كما يجب أن يعرفَه المتعلم: تسجيلُ دارٍ بأداء أدوار، أو صوتُ KI أحاديٌّ موسوم */
export type DialogAudioArt = "haus" | "ki";
export function dialogAudioArt(id: string): DialogAudioArt | null {
  const eintrag = dialogAudio[id];
  if (!eintrag) return null;
  return eintrag.voice.startsWith("ki-") ? "ki" : "haus";
}
export function dialogAudioIstKi(id: string): boolean {
  return dialogAudioArt(id) === "ki";
}

export const arenaMap = { nomen: [], konnektoren: [], passiv: [] } as unknown as {
  nomen: ArenaNomen[];
  konnektoren: ArenaKonnektor[];
  passiv: ArenaPassiv[];
};

/** R163: Container werden an Ort und Stelle befüllt — Node synchron (alle 54 Banken), Browser stufenweise core→vertiefung→lang. */
function fuelleAusBanken(): void {
  // Grammar: core+ b2 gemerged (Node voll, Browser stufenweise)
  const grammarCore = bankRoh("grammar-core.json") as Record<string, unknown> | undefined;
  const grammarB2 = bankRoh("grammar-b2.json") as Record<string, unknown> | undefined;
  const grammarVoll = bankRoh("grammar.json") as Record<string, unknown> | undefined;
  const grammarRoh2 = grammarVoll ?? (grammarCore && grammarB2 ? { ...grammarCore, ...grammarB2 } : grammarCore ?? grammarB2);
  if (!grammarRoh2) return;
  Object.assign(grammarMap, grammarRoh2);
  // Vocab: core (A0-B1) sofort, B2 lazy — merge beide wenn vorhanden
  const vocabCore = bankRoh("vocab-core.json") as Record<string, unknown> | undefined;
  const vocabB2 = bankRoh("vocab-b2.json") as Record<string, unknown> | undefined;
  const vocabVoll = bankRoh("vocab.json") as Record<string, unknown> | undefined;
  const vocabRoh = vocabVoll ?? (vocabCore && vocabB2 ? { ...vocabCore, ...vocabB2 } : vocabCore ?? vocabB2);
  if (vocabRoh) { Object.assign(vocabMap, vocabRoh); alleVokabeln.splice(0, alleVokabeln.length, ...Object.values(vocabMap).flatMap((g) => (g as { cards: VocabCard[] }).cards)); }
  const tief = bankRoh("tiefenlex.json") as Tiefenlex | undefined; if (tief) Object.assign(tiefenlex, tief);
  const candoRoh = bankRoh("cando.json") as Record<string, unknown> | undefined; if (candoRoh) Object.assign(candoMap, candoRoh);
  const fehlerRoh = bankRoh("fehler.json") as unknown[] | undefined; if (fehlerRoh) fehlerList.splice(0, fehlerList.length, ...(fehlerRoh as typeof fehlerList));
  const mnemo = bankRoh("mnemonik.json") as Record<string, unknown> | undefined; if (mnemo) Object.assign(mnemonikMap, mnemo);
  const verbenRoh = bankRoh("verben.json") as VerbParadigmen[] | undefined; if (verbenRoh) verben.splice(0, verben.length, ...verbenRoh);
  const haerteRoh = bankRoh("haerte.json") as { rungen: HaerteRung[] } | undefined; if (haerteRoh) haerte.splice(0, haerte.length, ...haerteRoh.rungen);
  const arenaRoh = bankRoh("arena.json") as unknown | undefined; if (arenaRoh) Object.assign(arenaMap, arenaRoh);
  // Langfassungen — sammle aus beiden Quellen falls vorhanden (Node: bereits da, Browser: nach lang-Lazy)
  for (const name of LANG_DATEIEN) { const chunk = bankRoh(name) as Record<string, Langfassung> | undefined; if (chunk) Object.assign(langfassungen, chunk); }
  const texteRoh = bankRoh("texts.json") as Lesetext[] | undefined;
  if (texteRoh) texts.splice(0, texts.length, ...texteRoh.map((t) => (langfassungen[t.id] ? { ...t, lang: langfassungen[t.id] } : t)));
  const dlg = bankRoh("dialogues.json") as Hoerdialog[] | undefined; if (dlg) dialogues.splice(0, dialogues.length, ...dlg);
  const lese = bankRoh("leseleiter.json") as { texte: LeiterText[] } | undefined; if (lese) leseleiter.splice(0, leseleiter.length, ...lese.texte);
  const rede = bankRoh("redemittel.json") as { items: RedemittelItem[] } | undefined; if (rede) redemittelBank.splice(0, redemittelBank.length, ...rede.items);
  const hoerNeuRoh = bankRoh("hoerneu.json") as { items: HoerNeuItem[] } | undefined; if (hoerNeuRoh) hoerneu.splice(0, hoerneu.length, ...hoerNeuRoh.items);
  const hoer = bankRoh("hoeren-audio.json") as { einsaetze: HoerAudio[] } | undefined; if (hoer) Object.assign(hoerenAudio, Object.fromEntries(hoer.einsaetze.map((e) => [e.id, e])));
  const dik = bankRoh("diktat-audio.json") as { einsaetze: HoerAudio[] } | undefined; if (dik) Object.assign(diktatAudio, Object.fromEntries(dik.einsaetze.map((e) => [e.id, e])));
  const dia = bankRoh("dialog-audio.json") as { einsaetze: HoerAudio[] } | undefined; if (dia) Object.assign(dialogAudio, Object.fromEntries(dia.einsaetze.map((e) => [e.id, e])));
  const sprAudio = bankRoh("sprichwort-audio.json") as Record<string, unknown> | undefined; if (sprAudio) Object.assign(sprichwortAudio, sprAudio);
  // Vertiefung — nur wenn bereits geladen (Node: sofort, Browser: nach initialisiereVertiefung)
  const saetze = bankRoh("sentences.json") as Satz[] | undefined; if (saetze) sentences.splice(0, sentences.length, ...saetze);
  const sz = bankRoh("szenarien.json") as { szenarien: import("./types").Szenario[] } | undefined; if (sz) szenarien.splice(0, szenarien.length, ...sz.szenarien);
  const pk = bankRoh("pakete.json") as { pakete: import("./types").KontextPaket[] } | undefined; if (pk) pakete.splice(0, pakete.length, ...pk.pakete);
  const wt = bankRoh("writing.json") as Schreibaufgabe[] | undefined; if (wt) writingTasks.splice(0, writingTasks.length, ...wt);
  const eb = bankRoh("eselsbruecken.json") as Eselsbruecke[] | undefined; if (eb) eselsbruecken.splice(0, eselsbruecken.length, ...eb);
  const mu = bankRoh("muendlich.json") as { karten: MuendlichKarte[]; partner?: PartnerKarte[]; kontakt?: KontaktKarte[] } | undefined;
  if (mu) { muendlich.splice(0, muendlich.length, ...mu.karten); partnerKarten.splice(0, partnerKarten.length, ...(mu.partner ?? [])); kontaktKarten.splice(0, kontaktKarten.length, ...(mu.kontakt ?? [])); }
  const vt = bankRoh("vortrag.json") as { themen: VortragThema[] } | undefined; if (vt) vortrag.splice(0, vortrag.length, ...vt.themen);
  const lk = bankRoh("luecken.json") as { items: LkItem[] } | undefined; if (lk) luecken.splice(0, luecken.length, ...lk.items);
  const kollV = bankRoh("kollok-vertiefung.json") as { items: KollokVertiefungItem[] } | undefined; if (kollV) kollokVertiefung.splice(0, kollokVertiefung.length, ...kollV.items);
  const synV = bankRoh("synonym-vertiefung.json") as { items: SynonymVertiefungItem[] } | undefined; if (synV) synonymVertiefung.splice(0, synonymVertiefung.length, ...synV.items);
  const synK = bankRoh("synonyme-kontext.json"); // legacy name falls vorhanden
  const pflegeRoh = bankRoh("pflege.json") as unknown | undefined; // keep if exists as generic
  // pflege is optional generic — no container currently, keep for future
  void pflegeRoh; void synK; void BANK_DATEIEN; void VERTIEFUNG_DATEIEN; // silence unused
}
fuelleAusBanken();
beiBankenBereit(fuelleAusBanken);
beiVertiefungBereit(fuelleAusBanken);
