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
import { bankRoh, beiBankenBereit, BANK_DATEIEN } from "./bankload";

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
/** 🗣️ مختبر الشفهي — 12 بطاقة: 6 وصف صورة + 6 مناقشة (Modul AA) */
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
/** 📚 نصّ تذوّقٍ C1 (C2/R178): مكتبةُ إثراءٍ ما بعد B2 — خارجَ خطّة الـ378 يومًا تمامًا */
export interface VertiefungText {
  id: string;
  level: "C1";
  titelDe: string;
  titelAr: string;
  de: string;
  ar: string;
  glossar: { de: string; ar: string }[];
  fragen: { id: string; promptDe: string; promptAr: string; options: string[]; answer: string; explanationAr: string }[];
}
/** 💬 حوار تذوّقٍ C1 (C2/R178) */
export interface VertiefungDialog {
  id: string;
  level: "C1";
  titelDe: string;
  titelAr: string;
  lines: { who: string; de: string; ar: string }[];
  fragen: { id: string; promptDe: string; promptAr: string; options: string[]; answer: string; explanationAr: string }[];
}
export const vertiefungTexte: VertiefungText[] = [];
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
export const vertiefungDialoge: VertiefungDialog[] = [];
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

/** R163: Die Container oben werden an Ort und Stelle befüllt — in Node synchron beim
 *  Import (Tests/Prerender lesen content/ von der Platte), im Browser nach dem einmaligen
 *  /banks.json-Fetch über beiBankenBereit. Referenzen der Konsumenten bleiben gültig. */
function fuelleAusBanken(): void {
  if (!bankRoh("grammar.json")) return;
  Object.assign(grammarMap, bankRoh("grammar.json"));
  Object.assign(vocabMap, bankRoh("vocab.json"));
  const saetze = bankRoh("sentences.json") as Satz[];
  sentences.splice(0, sentences.length, ...saetze);
  Object.assign(tiefenlex, bankRoh("tiefenlex.json"));
  const sz = bankRoh("szenarien.json") as { szenarien: import("./types").Szenario[] };
  szenarien.splice(0, szenarien.length, ...sz.szenarien);
  const pk = bankRoh("pakete.json") as { pakete: import("./types").KontextPaket[] };
  pakete.splice(0, pakete.length, ...pk.pakete);
  alleVokabeln.splice(0, alleVokabeln.length, ...Object.values(vocabMap).flatMap((g) => g.cards));
  for (const name of BANK_DATEIEN) {
    if (name.startsWith("lang/")) Object.assign(langfassungen, bankRoh(name));
  }
  const texteRoh = bankRoh("texts.json") as Lesetext[];
  texts.splice(0, texts.length, ...texteRoh.map((t) => (langfassungen[t.id] ? { ...t, lang: langfassungen[t.id] } : t)));
  const dlg = bankRoh("dialogues.json") as Hoerdialog[];
  dialogues.splice(0, dialogues.length, ...dlg);
  const wt = bankRoh("writing.json") as Schreibaufgabe[];
  writingTasks.splice(0, writingTasks.length, ...wt);
  Object.assign(candoMap, bankRoh("cando.json"));
  const fl = bankRoh("fehler.json") as (FehlerEintrag & { id: string; kat: string })[];
  fehlerList.splice(0, fehlerList.length, ...fl);
  Object.assign(mnemonikMap, bankRoh("mnemonik.json"));
  Object.assign(sprichwortAudio, bankRoh("sprichwort-audio.json"));
  const eb = bankRoh("eselsbruecken.json") as Eselsbruecke[];
  eselsbruecken.splice(0, eselsbruecken.length, ...eb);
  const vb = bankRoh("verben.json") as VerbParadigmen[];
  verben.splice(0, verben.length, ...vb);
  haerte.splice(0, haerte.length, ...(bankRoh("haerte.json") as { rungen: HaerteRung[] }).rungen);
  const mu = bankRoh("muendlich.json") as { karten: MuendlichKarte[]; partner?: PartnerKarte[]; kontakt?: KontaktKarte[] };
  muendlich.splice(0, muendlich.length, ...mu.karten);
  partnerKarten.splice(0, partnerKarten.length, ...(mu.partner ?? []));
  kontaktKarten.splice(0, kontaktKarten.length, ...(mu.kontakt ?? []));
  vortrag.splice(0, vortrag.length, ...(bankRoh("vortrag.json") as { themen: VortragThema[] }).themen);
  luecken.splice(0, luecken.length, ...(bankRoh("luecken.json") as { items: LkItem[] }).items);
  leseleiter.splice(0, leseleiter.length, ...((bankRoh("leseleiter.json") as { texte: LeiterText[] } | undefined)?.texte ?? []));
  redemittelBank.splice(0, redemittelBank.length, ...((bankRoh("redemittel.json") as { items: RedemittelItem[] } | undefined)?.items ?? []));
  vertiefungTexte.splice(0, vertiefungTexte.length, ...((bankRoh("vertiefung.json") as { texte: VertiefungText[] } | undefined)?.texte ?? []));
  vertiefungDialoge.splice(0, vertiefungDialoge.length, ...((bankRoh("vertiefung.json") as { dialoge: VertiefungDialog[] } | undefined)?.dialoge ?? []));
  hoerneu.splice(0, hoerneu.length, ...((bankRoh("hoerneu.json") as { items: HoerNeuItem[] } | undefined)?.items ?? []));
  kollokVertiefung.splice(0, kollokVertiefung.length, ...((bankRoh("kollok-vertiefung.json") as { items: KollokVertiefungItem[] } | undefined)?.items ?? []));
  synonymVertiefung.splice(0, synonymVertiefung.length, ...((bankRoh("synonym-vertiefung.json") as { items: SynonymVertiefungItem[] } | undefined)?.items ?? []));
  const hoer = bankRoh("hoeren-audio.json") as { einaetze?: HoerAudio[]; einsaetze: HoerAudio[] };
  Object.assign(hoerenAudio, Object.fromEntries(hoer.einsaetze.map((e) => [e.id, e])));
  const dik = bankRoh("diktat-audio.json") as { einsaetze: HoerAudio[] };
  Object.assign(diktatAudio, Object.fromEntries(dik.einsaetze.map((e) => [e.id, e])));
  const dia = bankRoh("dialog-audio.json") as { einsaetze: HoerAudio[] };
  Object.assign(dialogAudio, Object.fromEntries(dia.einsaetze.map((e) => [e.id, e])));
  Object.assign(arenaMap, bankRoh("arena.json"));
}
fuelleAusBanken();
beiBankenBereit(fuelleAusBanken);
