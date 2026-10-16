/**
 * ═══════════════════════════════════════════════════════════════════
 *  🪪 M3/R183 · تشخيص 2.0 — تحديد مستوى تكيّفي لكلّ مهارة
 * ═══════════════════════════════════════════════════════════════════
 *  أربع مهارات (قراءة/سماع/قواعد/مفردات) تُقدَّر مستقلّة من بنوك
 *  التطبيق نفسها: لكلّ مستوى (A1..B2) سؤالا اختيارٍ من متعدّد حقيقيان
 *  من محتوى ذلك المستوى. الصعود متدرّج: من أخطأ في سؤالي مستوى توقّف
 *  (تقديره ما قبله)، ومن أصاب واحدًا على الأقلّ صعد؛ فالمسار والطول
 *  يتكيّفان (2–8 أسئلة للمهارة). الاقتراح متحفّظ وأحاديّ الرتابة:
 *  نقطة الدخول = بداية أضعف مهارة، ولا قفز فوق امتحان مرحلةٍ غير
 *  مجتاز (السقف = يوم أوّل امتحانٍ غير مُجتاز، فيبدأ المتعلّم منه).
 *  تقدير آلي من بنوك التطبيق — ليس اختبارًا رسميًا معتمدًا.
 * ═══════════════════════════════════════════════════════════════════
 */
import { grammarMap, alleVokabeln, texts, dialogues, dialogAudioSrc, dialogAudioIstKi } from "./content";
import { PHASE_START, PHASEN } from "./phasen";
import type { Exercise, Level, Progress } from "./types";

export type EinstufungsSkill = "lesen" | "hoeren" | "grammatik" | "wortschatz";
export const EINSTUFUNG_SKILLS: EinstufungsSkill[] = ["lesen", "hoeren", "grammatik", "wortschatz"];
export const EINSTUFUNG_STUFEN: Level[] = ["A1", "A2", "B1", "B2"];
const STUFEN_ALLE: Level[] = ["A0", "A1", "A2", "B1", "B2"];

export interface EinstufungsFrage {
  ex: Exercise;
  skill: EinstufungsSkill;
  stufe: Level;
  /** مصدر صوت الحوار (سماع)؛ غيابه يعني بديل نطق الجهاز */
  audioSrc?: string | null;
  kiAudio?: boolean;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
/** موضعان متباعدان حتميًا داخل تجمّع مرتّب */
function zweiAus<T>(pool: T[]): T[] {
  if (pool.length === 0) return [];
  if (pool.length === 1) return [pool[0]];
  return [pool[Math.floor(pool.length * 0.25)], pool[Math.floor(pool.length * 0.75)]];
}

/** سؤالا المستوى لمهارة — من بنوك ذلك المستوى حصرًا، بحتمية كاملة */
export function einstufungsPool(skill: EinstufungsSkill, stufe: Level): EinstufungsFrage[] {
  if (skill === "grammatik") {
    const pool = Object.values(grammarMap)
      .filter((t) => t.level === stufe)
      .sort((a, b) => a.id.localeCompare(b.id))
      .flatMap((t) => t.exercises.filter((e) => e.type === "mc" && e.options && typeof e.answer === "string"));
    return zweiAus(pool).map((ex) => ({ ex, skill, stufe }));
  }
  if (skill === "wortschatz") {
    const karten = alleVokabeln.filter((c) => c.level === stufe).sort((a, b) => a.id.localeCompare(b.id));
    return zweiAus(karten).map((c, i) => {
      const rnd = mulberry32(hash(`einst-wk-${stufe}-${c.id}`));
      const falsche: string[] = [];
      for (let k = 1; k < karten.length && falsche.length < 3; k++) {
        const cand = karten[(karten.indexOf(c) + k * 13 + i * 7) % karten.length].ar;
        if (cand !== c.ar && !falsche.includes(cand)) falsche.push(cand);
      }
      const options = [c.ar, ...falsche];
      for (let j = options.length - 1; j > 0; j--) { const m = Math.floor(rnd() * (j + 1)); [options[j], options[m]] = [options[m], options[j]]; }
      const ex: Exercise = {
        id: `einst-wk-${stufe}-${c.id}`,
        type: "mc",
        promptDe: `Was bedeutet „${c.de}"?`,
        promptAr: "ما معنى هذه الكلمة؟",
        options,
        answer: c.ar,
        explanationAr: `„${c.de}" = ${c.ar}`,
      };
      return { ex, skill, stufe };
    });
  }
  if (skill === "lesen") {
    const pool = texts
      .filter((t) => t.level === stufe)
      .sort((a, b) => a.id.localeCompare(b.id))
      .flatMap((t) => t.questions.filter((e) => e.type === "mc" && e.options).map((e) => ({ e, txt: t.de })));
    return zweiAus(pool).map(({ e, txt }) => ({ ex: { ...e, id: `einst-lesen-${e.id}`, text: txt }, skill, stufe }));
  }
  const pool = dialogues
    .filter((d) => d.level === stufe)
    .sort((a, b) => a.id.localeCompare(b.id))
    .flatMap((d) => d.questions.filter((e) => e.type === "mc" && e.options).map((e) => ({ e, d })));
  return zweiAus(pool).map(({ e, d }) => ({
    ex: { ...e, id: `einst-hoeren-${e.id}`, text: d.lines.map((l) => l.de).join(" ") },
    skill,
    stufe,
    audioSrc: dialogAudioSrc(d.id),
    kiAudio: dialogAudioIstKi(d.id),
  }));
}

/** كلّ أسئلة مهارة مرتّبة بالمستوى صعودًا (زوج لكلّ مستوى) */
export function einstufungsFragen(skill: EinstufungsSkill): EinstufungsFrage[] {
  return EINSTUFUNG_STUFEN.flatMap((s) => einstufungsPool(skill, s));
}

export interface EinstufungsLauf {
  skill: EinstufungsSkill;
  antworten: { stufe: Level; ok: boolean }[];
  fertig: boolean;
  schaetzung?: Level;
}

export function einstufungStart(skill: EinstufungsSkill): EinstufungsLauf {
  return { skill, antworten: [], fertig: false };
}

/** السؤال الحالي: الزوج التالي بالمستوى التالي ما دمنا نصعد */
export function einstufungAktuell(lauf: EinstufungsLauf): EinstufungsFrage | null {
  if (lauf.fertig) return null;
  const fragen = einstufungsFragen(lauf.skill);
  return fragen[lauf.antworten.length] ?? null;
}

export function einstufungAntwort(lauf: EinstufungsLauf, ok: boolean): EinstufungsLauf {
  const f = einstufungAktuell(lauf);
  if (!f) return lauf;
  const antworten = [...lauf.antworten, { stufe: f.stufe, ok }];
  const neu: EinstufungsLauf = { ...lauf, antworten };
  // قرار عند حدّ كلّ زوج فقط: صفر صواب ⇒ وقوف، والتقدير ما قبل هذا المستوى
  if (antworten.length % 2 === 0) {
    const paar = antworten.slice(-2);
    if (paar.every((a) => !a.ok)) {
      neu.fertig = true;
      const idx = STUFEN_ALLE.indexOf(f.stufe);
      neu.schaetzung = STUFEN_ALLE[Math.max(0, idx - 1)];
    } else if (f.stufe === "B2") {
      neu.fertig = true;
      neu.schaetzung = "B2";
    }
  }
  if (antworten.length >= einstufungsFragen(lauf.skill).length) {
    neu.fertig = true;
    // بلغنا نهاية القائمة بصعود: التقدير أعلى مستوى صعدنا إليه
    const bestanden = antworten.filter((a) => a.ok).map((a) => STUFEN_ALLE.indexOf(a.stufe));
    neu.schaetzung = STUFEN_ALLE[Math.max(1, ...bestanden)];
  }
  return neu;
}

export interface EinstiegsVorschlag {
  tag: number;
  schwachStufe: Level;
  /** يوم الامتحان الذي يقف سقفًا (إن وُجد) — يبدأ المتعلّم منه لإثبات القفزة */
  pruefungsTag?: number;
}

/**
 * نقطة الدخول الآمنة: بداية أضعف مهارة، بسقف أوّل امتحان مرحلة غير
 * مُجتاز. أحادية الرتابة: رفع أيّ مهارة لا يُنقص اليوم المقترح أبدًا.
 */
export function einstiegsVorschlag(schaetzungen: Record<EinstufungsSkill, Level>, progress: Progress): EinstiegsVorschlag {
  const schwach = EINSTUFUNG_SKILLS
    .map((s) => schaetzungen[s])
    .sort((a, b) => STUFEN_ALLE.indexOf(a) - STUFEN_ALLE.indexOf(b))[0];
  let tag = PHASE_START[schwach];
  let pruefungsTag: number | undefined;
  const zielIdx = STUFEN_ALLE.indexOf(schwach);
  for (const phase of STUFEN_ALLE.slice(0, zielIdx) as Level[]) {
    const examDay = PHASEN[phase].bis;
    if (!progress.exams?.[examDay]?.passed) {
      if (examDay < tag) { tag = examDay; pruefungsTag = examDay; }
      break;
    }
  }
  return { tag: Math.max(1, tag), schwachStufe: schwach, pruefungsTag };
}
