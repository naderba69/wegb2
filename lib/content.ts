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
import grammarRaw from "@/content/grammar.json";
import brueckenRaw from "@/content/eselsbruecken.json";
import sprichwortAudioRaw from "@/content/sprichwort-audio.json";
import vocabRaw from "@/content/vocab.json";
import sentencesRaw from "@/content/sentences.json";
import textsRaw from "@/content/texts.json";
import langB2a from "@/content/lang/b2-01-10.json";
import langB2b from "@/content/lang/b2-11-20.json";
import langB1a from "@/content/lang/b1-01-10.json";
import langB1b from "@/content/lang/b1-11-20.json";
import langA2a from "@/content/lang/a2-01-10.json";
import langA2b from "@/content/lang/a2-11-20.json";
import langA1a from "@/content/lang/a1-01-10.json";
import langA1b from "@/content/lang/a1-11-20.json";
import dialoguesRaw from "@/content/dialogues.json";
import writingRaw from "@/content/writing.json";
import candoRaw from "@/content/cando.json";
import fehlerRaw from "@/content/fehler.json";
import mnemonikRaw from "@/content/mnemonik.json";
import verbenRaw from "@/content/verben.json";
import haerteRaw from "@/content/haerte.json";
import muendlichRaw from "@/content/muendlich.json";
import vortragRaw from "@/content/vortrag.json";
import hoerenAudioRaw from "@/content/hoeren-audio.json";
import lueckenRaw from "@/content/luecken.json";
import diktatAudioRaw from "@/content/diktat-audio.json";
import dialogAudioRaw from "@/content/dialog-audio.json";
import arenaRaw from "@/content/arena.json";
import tiefenlexRaw from "@/content/tiefenlex.json";
import szenarienRaw from "@/content/szenarien.json";
import paketeRaw from "@/content/pakete.json";

export const grammarMap = grammarRaw as unknown as Record<string, GrammarTopic>;
export const vocabMap = vocabRaw as unknown as Record<
  string,
  { id: string; titleDe: string; titleAr: string; level: Level; cards: VocabCard[] }
>;
export const sentences = sentencesRaw as unknown as Satz[];
/** العمق المعجمي (Modul P): Nuancen · Verb+Präp · Funktionsverbgefüge */
export const tiefenlex = tiefenlexRaw as unknown as Tiefenlex;
/** سيناريوهات الحياة الستة (Modul Q): طوارئ · بلدية · بنك · سكن · عمل · جامعة */
export const szenarien = (szenarienRaw as unknown as { szenarien: import("./types").Szenario[] }).szenarien;
/** حزم السياق الحيوي (Modul R): سفر · مقابلة · بحث عن سكن */
export const pakete = (paketeRaw as unknown as { pakete: import("./types").KontextPaket[] }).pakete;
/** كل بطاقات المفردات مسطّحة — تغذّي محركات الاختيار والتوليد */
export const alleVokabeln: VocabCard[] = Object.values(
  vocabRaw as unknown as Record<string, { cards: VocabCard[] }>
).flatMap((g) => g.cards);

/** صيغة الاسم الكاملة/العنصر دون تكرار أداة التعريف المخزّنة في de. */
export function deFormOf(card: VocabCard, includeArticle = true): string {
  const prefix = card.article ? `${card.article} ` : "";
  const full = prefix && !card.de.startsWith(prefix) ? `${prefix}${card.de}` : card.de;
  return includeArticle || !prefix ? full : full.slice(prefix.length);
}

const langfassungen: Record<string, Langfassung> = { ...(langB2a as Record<string, Langfassung>), ...(langB2b as Record<string, Langfassung>), ...(langB1a as Record<string, Langfassung>), ...(langB1b as Record<string, Langfassung>), ...(langA2a as Record<string, Langfassung>), ...(langA2b as Record<string, Langfassung>), ...(langA1a as Record<string, Langfassung>), ...(langA1b as Record<string, Langfassung>) };
/** النصوص؛ مَن له نسخة طويلة يحملها في `lang` — وقراءة B2 تعرضها (المهمّة lesen) بينما يبقى `de` نصَّ الصوت */
export const texts = (textsRaw as unknown as Lesetext[]).map((t) => (langfassungen[t.id] ? { ...t, lang: langfassungen[t.id] } : t));
/** نصُّ القراءةِ الفعليّ: الطويلُ إن وُجد وما لم يُطلَب القصير (تدرّج نسبة النصوص الأصلية 30→80٪) */
export function leseText(t: Lesetext): { de: string; ar: string; questions: Exercise[]; lang: boolean } {
  if (t.lang && !t.__weg_useShort) return { ...t.lang, lang: true };
  return { de: t.de, ar: t.ar, questions: t.questions, lang: false };
}
export const dialogues = dialoguesRaw as unknown as Hoerdialog[];
export const writingTasks = writingRaw as unknown as Schreibaufgabe[];
export const candoMap = candoRaw as unknown as Record<
  Level,
  { id: string; de: string; ar: string }[]
>;
/** بنك أنماط التصحيح الألمانية (مترابط بمحرّك دفتر الأخطاء) */
export const fehlerList = fehlerRaw as unknown as (FehlerEintrag & { id: string; kat: string })[];
/** حيل الحفظ السريع لكل كلمة (كلمة مفتاحية/قصة/جذر عربي) */
export const mnemonikMap = mnemonikRaw as unknown as Record<
  string,
  { art: "schluessel" | "geschichte" | "arabisch" | "farbe"; tipp: string }
>;

/** أصواتُ الأمثالِ الثمانيةِ — ملفاتٌ من الدارِ بصوتِ voice-01 */
export const sprichwortAudio = sprichwortAudioRaw as unknown as Record<
  string,
  { id: string; file: string; bytes: number; voice: string; de: string; ar: string }
>;
/** مسارُ صوتِ مثلٍ بعينِه — أو null إن لم يُفرَغْ بعد (تراجعٌ معلَنٌ لا صمت) */
export function sprichwortSrc(id: string): string | null {
  return sprichwortAudio[id]?.file ?? null;
}

/** بنكُ التركاتِ والشفراتِ والأمثال — كلُّ تركةٍ معلَّقةٌ بدرسِ قواعدَ مضيف */
export const eselsbruecken = brueckenRaw as unknown as Eselsbruecke[];
/** تركاتُ درسٍ بعينِه — المستهلِكُ الوحيدُ لبطاقةِ القاعدة */
export function getBrueckenFor(gramId: string): Eselsbruecke[] {
  return eselsbruecken.filter((b) => b.gramIds.includes(gramId));
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
export const verben = verbenRaw as unknown as VerbParadigmen[];

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
export const haerte: HaerteRung[] = (haerteRaw as unknown as { rungen: HaerteRung[] }).rungen;

export interface MuendlichEinwand {
  id: string;
  de: string;
  ar: string;
}
export interface MuendlichKarte {
  id: string;
  teil: 2 | 3;
  titel_de: string;
  titel_ar: string;
  auftrag_de: string;
  stuetzen: string[];
  kriterien: { ar: string; de: string }[];
  zeit_s: number;
  /** B2 discussion only: unseen objections for the timed pressure round. */
  einwaende?: MuendlichEinwand[];
}
/** 🗣️ مختبر الشفهي — 12 بطاقة: 6 وصف صورة + 6 مناقشة (Modul AA) */
export const muendlich: MuendlichKarte[] = (muendlichRaw as unknown as { karten: MuendlichKarte[] }).karten;
export const partnerKarten: {id:string;level:string;situationDe:string;situationAr:string;vorschlagA:string;vorschlagB:string;redemittel:string[];tippAr:string}[] = (muendlichRaw as unknown as { partner?: {id:string;level:string;situationDe:string;situationAr:string;vorschlagA:string;vorschlagB:string;redemittel:string[];tippAr:string}[] }).partner ?? [];

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
export const vortrag: VortragThema[] = (vortragRaw as unknown as { themen: VortragThema[] }).themen;

export interface HoerAudio { id: string; file: string; voice: string; level: string; bytes: number }
/** 🧩 Lückendiktat — فراغُ الاستماع: جُمَلٌ من البنك مُبيَّضةُ الكلمة، وشريطُها النصُّ نفسه */
export interface LkGap { id: string; sent: string; blanked: string; answer: string }
export interface LkItem { id: string; textId: string; level: "B1" | "B2"; titleDe: string; titleAr: string; gaps: LkGap[] }
export const luecken = (lueckenRaw as unknown as { items: LkItem[] }).items;
export const hoerenAudio: Record<string, HoerAudio> = Object.fromEntries(
  (hoerenAudioRaw as unknown as { einaetze?: HoerAudio[]; einsaetze: HoerAudio[] }).einsaetze.map((e) => [e.id, e])
);
export const diktatAudio: Record<string, HoerAudio> = Object.fromEntries(
  (diktatAudioRaw as unknown as { einsaetze: HoerAudio[] }).einsaetze.map((e) => [e.id, e])
);
/** مصدر صوت الإملاء: ملفٌ من الدار أو لا شيء — واللاشيء معلنٌ لا مكتوم */
export function diktatSrc(id: string): string | null {
  return diktatAudio[id]?.file ?? null;
}
/** 💬 ξ7 — حوارٌ كاملٌ بصوتٍ واحد من الدار (B1/B2 الوافدة): ملفٌّ أو لا شيء — والتراجعُ إلى TTS معلنٌ في الواجهة */
export const dialogAudio: Record<string, HoerAudio> = Object.fromEntries(
  (dialogAudioRaw as unknown as { einsaetze: HoerAudio[] }).einsaetze.map((e) => [e.id, e])
);
export function dialogAudioSrc(id: string): string | null {
  return dialogAudio[id]?.file ?? null;
}

export const arenaMap = arenaRaw as unknown as {
  nomen: ArenaNomen[];
  konnektoren: ArenaKonnektor[];
  passiv: ArenaPassiv[];
};
