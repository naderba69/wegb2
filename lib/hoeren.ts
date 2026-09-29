/**
 * ============================================================
 *  🎧 محرّك معمل الاستماع — HörLabor (Modul AF)
 * ============================================================
 *  طبقة نقية حتمية بالكامل: لا DOM، لا ساعة، لا عشوائية.
 *  تستهلك بنك texts.json نفسه (نصوص B1/B2...) — لا محتوى موازٍ:
 *  القراءة الصوتية للتدريب هي نفسها مادة القراءة الصامتة.
 *  الصرامة الامتحانية تعيش هنا: darfSpielen/modus هي القانون؛
 *  الواجهة تنفّذه فقط، فتستطيع البوابة K24 محاكمته بلا متصفح.
 * ============================================================
 */
import { texts } from "./content";
import type { Exercise } from "./types";
import { levelOf, rng, pickN } from "./plan";
import { normalize } from "./grader";
import type { Level } from "./types";

export type Modus = "training" | "pruefung";
export type Tempo = "lern" | "pruefung";

/** المعدّلان النظاميان وحدهما — لا منزلق فوضى */
export const RATE: Record<Tempo, number> = { lern: 0.7, pruefung: 0.95 };

export interface HoerItem {
  id: string;
  promptDe: string;
  /** null ⇒ إدخال نصّي (fill) — غير ذلك أزرار اختيار */
  options: string[] | null;
  /** قائمة الصيغ المقبولة كلها (normalize) */
  answers: string[];
  explanationAr: string;
}

export interface HoerRunde {
  textId: string;
  titleDe: string;
  titleAr: string;
  de: string;
  level: Level;
  items: HoerItem[];
  /** بصمة اليوم والمستوى — للعرض والبروتوكول */
  saat: string;
}

function zuItem(q: Exercise): HoerItem {
  if (q.type === "fill") {
    const a = Array.isArray(q.answer) ? q.answer : [String(q.answer)];
    return { id: q.id, promptDe: q.promptDe, options: null, answers: a.map(normalize), explanationAr: q.explanationAr ?? "" };
  }
  const opts = q.options && q.options.length >= 2 ? q.options : ["richtig", "falsch"];
  return { id: q.id, promptDe: q.promptDe, options: opts, answers: [normalize(String(q.answer))], explanationAr: q.explanationAr ?? "" };
}

/** جولة اليوم حتمية: نفس (tag, level) ⇒ نفس النص ونفس ترتيب الأسئلة */
export function bauHoerRunde(tag: number, level?: Level): HoerRunde {
  const lv = level ?? levelOf(Math.min(tag, 270));
  const pool = texts.filter((t) => t.level === lv);
  const r = rng(tag * 41 + 17);
  const picked = pickN(pool, 1, r)[0] ?? pool[0];
  const items = picked.questions.map(zuItem);
  return {
    textId: picked.id,
    titleDe: picked.titleDe,
    titleAr: picked.titleAr,
    de: picked.de,
    level: lv,
    items,
    saat: `Tag ${tag} · ${lv}`,
  };
}

/** القانون: في وضع الامتحان استماعة واحدة لا غير — لا «أخيرة قبل التسليم» */
export function darfSpielen(modus: Modus, plays: number): boolean {
  return modus === "training" ? true : plays < 1;
}

/** الأسئلة لا تُفتح قبل استماعة كاملة واحدة على الأقل — منع الغش بالقراءة المسبقة */
export function fragenFrei(plays: number): boolean {
  return plays >= 1;
}

export function werteItem(item: HoerItem, eingabe: string): boolean {
  const e = normalize(eingabe);
  return item.answers.includes(e);
}

/** نتيجة الجولة: عدد صحيح من أصل الكل */
export function werteRunde(items: HoerItem[], antworten: Record<string, string>): { ok: number; n: number } {
  const ok = items.filter((it) => werteItem(it, antworten[it.id] ?? "")).length;
  return { ok, n: items.length };
}

/** درجة Goethe المصغّرة: نسبة مئوية ← نفس مقياس المذكرة 60% نجاح */
export function hoerNote(prozent: number): { note: string; bestanden: boolean } {
  const n = prozent >= 95 ? "sehr gut" : prozent >= 80 ? "gut" : prozent >= 65 ? "bestanden" : prozent >= 60 ? "knapp bestanden" : "nicht bestanden";
  return { note: n, bestanden: prozent >= 60 };
}
