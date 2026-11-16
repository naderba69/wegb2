/**
 * ═══════════════════════════════════════════════════════════════════
 *  🪪 M3/R183 · تشخيص 2.0 — تحديد مستوى تكيّفي لكلّ مهارة
 * ═══════════════════════════════════════════════════════════════════
 *  أربع حزم استقبال/صيغة (قراءة/سماع/قواعد/مفردات) تُفحص مستقلّة من
 *  بنوك التطبيق نفسها. لكلّ مستوى A1..B2 أربعة بنود من أربعة مصادر
 *  مختلفة، ولا يكفي التخمين في بند واحد: الصعود يحتاج 3/4. عند 0–2/4
 *  يتوقف المسار وتكون حزمة الدخول المقترحة هي السابقة (4–16 بندًا لكل
 *  مجال). الاقتراح متحفّظ وأحاديّ الرتابة: نقطة الدخول = بداية أضعف
 *  حزمة، ولا قفز فوق امتحان مرحلة غير مجتاز.
 *  هذا فرز داخلي استقبالي/شكلي لا يقيس الكتابة أو التحدث، وليس اختبار
 *  مستوى CEFR أو اختبارًا رسميًا معتمدًا أو نموذجًا سيكومتريًا معايرًا.
 * ═══════════════════════════════════════════════════════════════════
 */
import { grammarMap, alleVokabeln, texts, dialogues, dialogAudioSrc, dialogAudioIstKi } from "./content";
import { PHASE_START, PHASEN } from "./phasen";
import type { Exercise, Level, Progress } from "./types";

export type EinstufungsSkill = "lesen" | "hoeren" | "grammatik" | "wortschatz";
export const EINSTUFUNG_SKILLS: EinstufungsSkill[] = ["lesen", "hoeren", "grammatik", "wortschatz"];
export const EINSTUFUNG_STUFEN: Level[] = ["A1", "A2", "B1", "B2"];
export const EINSTUFUNG_ITEMS_PRO_STUFE = 4;
export const EINSTUFUNG_BESTANDEN_AB = 3;
export const EINSTUFUNG_SCOPE = "receptive-form-only-v1" as const;
const STUFEN_ALLE: Level[] = ["A0", "A1", "A2", "B1", "B2"];

export interface EinstufungsFrage {
  ex: Exercise;
  skill: EinstufungsSkill;
  stufe: Level;
  /** مصدر صوت الحوار (سماع)؛ غيابه يعني بديل نطق الجهاز */
  audioSrc?: string | null;
  kiAudio?: boolean;
  /** موضوع/نص/حوار/بطاقة المصدر؛ يثبت تنوع البنود داخل حزمة المستوى. */
  sourceId: string;
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
/** أربعة مواضع متباعدة حتميًا؛ لا نكرر المصدر لتعويض نقص البنك بصمت. */
function vierAus<T>(pool: T[]): T[] {
  if (pool.length < EINSTUFUNG_ITEMS_PRO_STUFE) return [];
  return [0.125, 0.375, 0.625, 0.875].map((q) => pool[Math.min(pool.length - 1, Math.floor(pool.length * q))]);
}

/**
 * يختار أربعة مصادر مختلفة موزعة على البنك ثم بندًا واحدًا من كل مصدر.
 * ترتيب المصادر والبنود ثابت، ولذلك يمكن إعادة بناء التشخيص نفسه واختباره.
 */
function vierQuellen<T>(gruppen: Array<{ sourceId: string; items: T[] }>): Array<{ sourceId: string; item: T }> {
  return vierAus(gruppen.filter((gruppe) => gruppe.items.length > 0)).map((gruppe, index) => ({
    sourceId: gruppe.sourceId,
    item: gruppe.items[Math.min(gruppe.items.length - 1, Math.floor(gruppe.items.length * ((index + 1) / 5)))],
  }));
}

/** أربعة بنود للمستوى والمهارة — من أربعة مصادر مختلفة في بنك ذلك المستوى */
export function einstufungsPool(skill: EinstufungsSkill, stufe: Level): EinstufungsFrage[] {
  if (skill === "grammatik") {
    const gruppen = Object.values(grammarMap)
      .filter((topic) => topic.level === stufe)
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((topic) => ({
        sourceId: topic.id,
        items: topic.exercises.filter((exercise) => exercise.type === "mc" && (exercise.options?.length ?? 0) >= 3 && typeof exercise.answer === "string"),
      }));
    return vierQuellen(gruppen).map(({ sourceId, item: ex }) => ({ ex, skill, stufe, sourceId }));
  }
  if (skill === "wortschatz") {
    const karten = alleVokabeln.filter((card) => card.level === stufe).sort((a, b) => a.id.localeCompare(b.id));
    return vierAus(karten).map((card, index) => {
      const rnd = mulberry32(hash(`einst-wk-${stufe}-${card.id}`));
      const falsche: string[] = [];
      const start = karten.indexOf(card);
      for (let offset = 1; offset < karten.length && falsche.length < 3; offset++) {
        const candidate = karten[(start + offset * 13 + index * 7) % karten.length].ar;
        if (candidate !== card.ar && !falsche.includes(candidate)) falsche.push(candidate);
      }
      const options = [card.ar, ...falsche];
      for (let j = options.length - 1; j > 0; j--) {
        const other = Math.floor(rnd() * (j + 1));
        [options[j], options[other]] = [options[other], options[j]];
      }
      const ex: Exercise = {
        id: `einst-wk-${stufe}-${card.id}`,
        type: "mc",
        promptDe: `Was bedeutet „${card.de}"?`,
        promptAr: "ما معنى هذه الكلمة؟",
        options,
        answer: card.ar,
        explanationAr: `„${card.de}" = ${card.ar}`,
      };
      return { ex, skill, stufe, sourceId: card.id };
    });
  }
  if (skill === "lesen") {
    const gruppen = texts
      .filter((text) => text.level === stufe)
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((text) => ({
        sourceId: text.id,
        items: text.questions.filter((exercise) => exercise.type === "mc" && (exercise.options?.length ?? 0) >= 3),
        text: text.de,
      }));
    return vierQuellen(gruppen).map(({ sourceId, item: exercise }) => {
      const text = gruppen.find((gruppe) => gruppe.sourceId === sourceId)!.text;
      return { ex: { ...exercise, id: `einst-lesen-${exercise.id}`, text }, skill, stufe, sourceId };
    });
  }
  const gruppen = dialogues
    .filter((dialogue) => dialogue.level === stufe)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((dialogue) => ({
      sourceId: dialogue.id,
      items: dialogue.questions.filter((exercise) => exercise.type === "mc" && (exercise.options?.length ?? 0) >= 3),
      text: dialogue.lines.map((line) => line.de).join(" "),
    }));
  return vierQuellen(gruppen).map(({ sourceId, item: exercise }) => {
    const text = gruppen.find((gruppe) => gruppe.sourceId === sourceId)!.text;
    return {
      ex: { ...exercise, id: `einst-hoeren-${exercise.id}`, text },
      skill,
      stufe,
      sourceId,
      audioSrc: dialogAudioSrc(sourceId),
      kiAudio: dialogAudioIstKi(sourceId),
    };
  });
}

/** كلّ أسئلة المجال مرتبة صعودًا: أربعة لكل مستوى، وبحد أقصى 16 بندًا. */
const FRAGEN_CACHE = new Map<EinstufungsSkill, EinstufungsFrage[]>();
export function einstufungsFragen(skill: EinstufungsSkill): EinstufungsFrage[] {
  const cached = FRAGEN_CACHE.get(skill);
  if (cached) return cached;
  const fragen = EINSTUFUNG_STUFEN.flatMap((stufe) => einstufungsPool(skill, stufe));
  FRAGEN_CACHE.set(skill, fragen);
  return fragen;
}

export interface EinstufungsLauf {
  skill: EinstufungsSkill;
  antworten: Array<{ stufe: Level; ok: boolean; itemId: string; sourceId: string }>;
  fertig: boolean;
  /** Interne Einstiegspaket-Zuordnung, keine CEFR-Kompetenzfeststellung. */
  schaetzung?: Level;
}

export interface EinstufungsBandErgebnis {
  stufe: Level;
  richtig: number;
  gesamt: number;
  bestanden: boolean;
}

export function einstufungsBandErgebnisse(lauf: EinstufungsLauf): EinstufungsBandErgebnis[] {
  return EINSTUFUNG_STUFEN.flatMap((stufe) => {
    const antworten = lauf.antworten.filter((antwort) => antwort.stufe === stufe);
    if (antworten.length === 0) return [];
    const richtig = antworten.filter((antwort) => antwort.ok).length;
    return [{
      stufe,
      richtig,
      gesamt: antworten.length,
      bestanden: antworten.length === EINSTUFUNG_ITEMS_PRO_STUFE && richtig >= EINSTUFUNG_BESTANDEN_AB,
    }];
  });
}

export function einstufungStart(skill: EinstufungsSkill): EinstufungsLauf {
  return { skill, antworten: [], fertig: false };
}

/** السؤال الحالي: البند التالي في رباعية المستوى ما دمنا نصعد. */
export function einstufungAktuell(lauf: EinstufungsLauf): EinstufungsFrage | null {
  if (lauf.fertig) return null;
  const fragen = einstufungsFragen(lauf.skill);
  return fragen[lauf.antworten.length] ?? null;
}

export function einstufungAntwort(lauf: EinstufungsLauf, ok: boolean): EinstufungsLauf {
  const f = einstufungAktuell(lauf);
  if (!f) return lauf;
  const antworten = [...lauf.antworten, { stufe: f.stufe, ok, itemId: f.ex.id, sourceId: f.sourceId }];
  const neu: EinstufungsLauf = { ...lauf, antworten };
  // قرار بعد أربعة بنود كاملة: 3/4 أو 4/4 للصعود؛ 0–2/4 توقف محافظ.
  // لا ندّعي أن هذه عتبة سيكومترية؛ هي قاعدة داخلية تمنع نجاح تخمين واحد.
  if (antworten.length % EINSTUFUNG_ITEMS_PRO_STUFE === 0) {
    const band = antworten.slice(-EINSTUFUNG_ITEMS_PRO_STUFE);
    const richtig = band.filter((antwort) => antwort.ok).length;
    if (richtig < EINSTUFUNG_BESTANDEN_AB) {
      neu.fertig = true;
      const index = STUFEN_ALLE.indexOf(f.stufe);
      neu.schaetzung = STUFEN_ALLE[Math.max(0, index - 1)];
    } else if (f.stufe === "B2") {
      neu.fertig = true;
      neu.schaetzung = "B2";
    }
  }
  if (antworten.length >= einstufungsFragen(lauf.skill).length) {
    neu.fertig = true;
    const bestanden = einstufungsBandErgebnisse(neu)
      .filter((band) => band.bestanden)
      .map((band) => STUFEN_ALLE.indexOf(band.stufe));
    neu.schaetzung = STUFEN_ALLE[Math.max(0, ...bestanden)];
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
