/**
 * ═══════════════════════════════════════════════════════════════════
 *  🔐 قفل بدء الجلسة — Startritual («اختبرني في القديم قبل أن تُريني الجديد»)
 * ═══════════════════════════════════════════════════════════════════
 *  ثغرةُ المدرّس البشري التي كانت مفتوحة: كلُّ يومِ تعلُّمٍ يبدأ بمهمّة
 *  «Wiederholung & Abruf» (بطاقات + جمل + 3 أسئلة من درس الأمس)، لكنّ
 *  المتعلّم كان يستطيع القفز فوقها إلى القاعدة الجديدة بنقرة. فالاسترجاع
 *  — أقوى أثرٍ موثَّق في علم التعلّم (Roediger & Karpicke 2006؛ Dunlosky
 *  et al. 2013: «practice testing» في أعلى فئة فائدة) — كان اختيارياً فعلياً.
 *
 *  القاعدة (نقية حتمية: (plan, progress) ← حكم):
 *   • بوابةُ اليوم = المقطعُ الافتتاحي من المهام: التعويضاتُ الإلزامية ثم
 *     مهمّةُ (مهام) الاسترجاع المتتالية في رأس القائمة.
 *   • ما بعد البوابة مقفولٌ (لا يُعرَض محتواه) حتى تُسلَّم كلُّ مهام البوابة —
 *     التسليمُ لا النجاح: البوابةُ تضمن **المحاولة الصادقة**، لا تعاقب النسيان
 *     (النسيان مادّة الدرس لا جريمته). الرسوب يُرحَّل تعويضاً كالمعتاد.
 *   • استثناءات صريحة، لا ضمنية:
 *       – اليوم 1: لا «أمس» يُسترجَع ⇒ لا بوابة.
 *       – الفحص الأسبوعي (wochencheck): يبدأ بالامتحان نفسه — وهو استرجاعٌ
 *         بذاته ⇒ لا بوابة.
 *       – يوم بلا مهمّة استرجاع في رأسه ⇒ لا بوابة (لا نخترع قفلاً بلا مفتاح).
 * ═══════════════════════════════════════════════════════════════════
 */

import type { DayPlan, DayTask, Progress } from "./types";

export interface RitualUrteil {
  /** هل لليوم بوابة أصلاً؟ */
  aktiv: boolean;
  /** فهارس مهام البوابة (متتالية من الصفر) */
  torIndizes: number[];
  /** أوّل فهرسٍ بعد البوابة (= عدد مهام البوابة) */
  ersteFreie: number;
  /** كم مهمّة بوابة لم تُسلَّم بعد */
  offen: number;
  /** مقفول = بوابة نشطة وفيها مهمّة لم تُسلَّم */
  gesperrt: boolean;
  /** سبب غياب البوابة — للشفافية على الشاشة */
  grund?: "tag1" | "wochencheck" | "keinAbruf";
}

/** مهام البوابة: التعويضات الإلزامية في الرأس ثم مهام الاسترجاع المتتالية */
export function torAufgaben(tasks: DayTask[]): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < tasks.length && tasks[i].mandatory) out.push(i++);
  let abruf = 0;
  while (i < tasks.length && tasks[i].kind === "wiederholen") { out.push(i++); abruf++; }
  return abruf === 0 ? [] : out;
}

export function ritualUrteil(plan: DayPlan, progress: Progress): RitualUrteil {
  const keine = (grund: RitualUrteil["grund"]): RitualUrteil => ({ aktiv: false, torIndizes: [], ersteFreie: 0, offen: 0, gesperrt: false, grund });
  if (plan.day <= 1) return keine("tag1");
  if (plan.type === "wochencheck") return keine("wochencheck");
  const tor = torAufgaben(plan.tasks);
  if (tor.length === 0) return keine("keinAbruf");
  const offen = tor.filter((i) => !progress.plan.tasks[plan.tasks[i].id]).length;
  return { aktiv: true, torIndizes: tor, ersteFreie: tor.length, offen, gesperrt: offen > 0 };
}

/** هل المهمّة ذات الفهرس `index` مقفولةٌ الآن؟ */
export function aufgabeGesperrt(u: RitualUrteil, index: number): boolean {
  return u.gesperrt && index >= u.ersteFreie;
}

/** نصّ القفل — يسمّي ما ينقص بالضبط، لا «ممنوع» مبهمة */
export function sperrText(u: RitualUrteil): string {
  if (!u.gesperrt) return "";
  return u.offen === 1
    ? "بوابة الجلسة: سلِّم مهمّة الاسترجاع أولاً — ثمّ يُفتح الجديد."
    : `بوابة الجلسة: بقيت ${u.offen} مهامَّ في الرأس (تعويض/استرجاع) — سلِّمها ثمّ يُفتح الجديد.`;
}
