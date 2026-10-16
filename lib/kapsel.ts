/**
 * ═══════════════════════════════════════════════════════════════════
 *  🌙 كبسولة اليوم — Tageskapsel
 * ═══════════════════════════════════════════════════════════════════
 *  مبدأ التباعد المكاني (Spaced Retrieval): صباح كلّ يوم نسترجع مزيجًا من:
 *    • جملة الأمس (1) — التقوية فوراً قبل النسيان السريع
 *    • جملة قبل أسبوع (7) — تثبيت متوسط المدى
 *    • جملة قبل شهر (30) — الذاكرة طويلة المدى
 *  هذا يُحقّق نظرية إبنجهاوس مع أقلّ عدد جمل/يوم (3 فقط) وبدون عبء إضافي.
 *  إن فات يوم (عطلة/مرض) — أقدم جملة متاحة من الفترة تملأ الفراغ.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Satz, Exercise } from "./types";
import { emptyProgress } from "./types";
import { sentences, getSatz } from "./content";

export const KAPSEL_GROESSE = 3;

/** أهداف التباعد بالأيام: 1 (أمس) / 7 (قبل أسبوع) / 30 (قبل شهر). */
const SPACING_OFFSETS = [1, 7, 30] as const;

const memo = new Map<number, string[]>();

/** يختار جملة واحدة من كبسولة مساء يوم `d` إن وُجدت، أو يتقهقر إلى آخر كبسولة متاحة. */
function pickOneFrom(day: number, taken: Set<string>): string | null {
  let d = day;
  let guard = 0;
  while (d >= 1 && guard < 90) {
    const ids = abendKapselIds(d); // نأخذ من كبسولة المساء لذلك اليوم — لا من كبسولة الصباح المتباعدة
    for (const id of ids) if (!taken.has(id) && getSatz(id)) return id;
    d--; guard++;
  }
  return null;
}

/** يكمّل الجمل بالمستوى الحالي إن عجزنا عن الوصول إلى أهداف التباعد (أول 10 أيام) */
function ergänze(day: number, out: string[]): string[] {
  const { levelOf, pickN, rng } = require("./plan") as typeof import("./plan");
  const lvl = levelOf(day);
  const pool = sentences.filter((s) => s.level === lvl && !out.includes(s.id));
  for (const s of pickN(pool, KAPSEL_GROESSE - out.length, rng(day * 131 + 3))) out.push(s.id);
  return out.slice(0, KAPSEL_GROESSE);
}

/**
 * معرّفات جمل الكبسولة لصباح يوم `day`: مزيج 1/7/30 يوم.
 * كبسولة اليوم 1 فارغة (لا أمس ولا فحوصات صباحية قبل أي جلسة).
 */
export function kapselIds(day: number): string[] {
  const d = Math.max(1, day | 0);
  if (d <= 1) return []; // اليوم 1 لا كبسولة صباحية
  const hit = memo.get(d);
  if (hit) return hit;
  const out: string[] = [];
  const taken = new Set<string>();
  for (const off of SPACING_OFFSETS) {
    const id = pickOneFrom(d - off, taken);
    if (id) { out.push(id); taken.add(id); }
  }
  const res = ergänze(d, out);
  memo.set(d, res);
  return res;
}

/** كبسولة المساء — تُختار من مهمات اليوم نفسه (لا من التاريخ). */
export function abendKapselIds(day: number): string[] {
  const d = Math.max(1, day | 0);
  const { buildDay } = require("./plan") as typeof import("./plan");
  const plan = buildDay(d, emptyProgress);
  const out: string[] = [];
  for (const t of plan.tasks) {
    if (t.kind === "wiederholen" || t.mandatory) continue;
    for (const id of t.sentenceIds ?? []) if (!out.includes(id) && getSatz(id)) out.push(id);
    if (out.length >= KAPSEL_GROESSE) break;
  }
  return ergänze(d, out);
}

/** كبسولة مساء اليوم تُستخدم في زر «اقرأ قبل النوم» على الشاشة. الصباح يقرأ من kapselIds (1/7/30). */
export function kapselIdsAbend(day: number): string[] { return abendKapselIds(day); }

export function kapselSaetze(day: number): Satz[] {
  return kapselIds(day).map((id) => getSatz(id)).filter((s): s is Satz => !!s);
}

export function kapselSaetzeAbend(day: number): Satz[] {
  return kapselIdsAbend(day).map((id) => getSatz(id)).filter((s): s is Satz => !!s);
}

/** هل جملُ كبسولةِ المساء مأخوذة من دروس اليوم فعلاً (للشفافية)؟ */
export function kapselAusTag(day: number): boolean {
  const { buildDay } = require("./plan") as typeof import("./plan");
  const eigene = new Set(buildDay(Math.max(1, day | 0), emptyProgress).tasks
    .filter((t) => t.kind !== "wiederholen" && !t.mandatory)
    .flatMap((t) => t.sentenceIds ?? []));
  return abendKapselIds(day).every((id) => eigene.has(id));
}

/* ─── بناء أسئلة الكبسولة الصباحية: نوع السؤال يتغيّر كل يوم على نفس الجملة ─── */

/**
 * يُعيد تمريناً واحداً لكل جملة من كبسولة الصباح. يتغيّر نوع التمرين دورياً بين:
 *   • cloze (املأ الفراغ)   • translate (ترجم عربي→ألماني)
 * بهذا لا يتلقّى المتعلّم نفس سؤال الأمس بنفس الصيغة — يتلقّى الاسترجاع من زوايا مختلفة.
 */
export function kapselQuiz(day: number): Exercise[] {
  return kapselQuizFuerIds(day, kapselIds(day));
}

function kapselQuizFuerIds(day: number, ids: string[]): Exercise[] {
  const { rng, clozeFromSatz, translateFromSatz } = require("./plan") as typeof import("./plan");
  const rand = rng(day * 211 + 17);
  const out: Exercise[] = [];
  ids.forEach((id, i) => {
    const s = getSatz(id);
    if (!s) return;
    const rolle = (Math.floor(rand() * 1000) + i) % 2;
    const base = rolle === 0 ? clozeFromSatz(s, i, rand) : translateFromSatz(s, i);
    out.push({ ...base, id: `q${day}-k-${i}-${base.id}` });
  });
  return out;
}

/* ─── M1 (R181): فواصل متكيفة بالأداء — 1/3/7/30/90 ───────────────────────────
   كلّ جملة تدرّبها تُحجز في kapselStand. الصواب يرفعها درجةً (1←3←7←30←90)،
   والخطأ يعيدها إلى درجة الصفر (تعود غدًا). لا جملة تُحذف: في القمّة تُستدعى
   بعد 90 يومًا من جديد. الاختيار التكيفي يقدّم المستحقّ (بحدّ فتحتين) ثم يملأ
   من كبسولة الجدولة — وفتحةٌ واحدةٌ على الأقلّ تبقى دائمًا لجملِ مساءِ أمس. */

export const KAPSEL_LEITER = [1, 3, 7, 30, 90] as const;
export interface KapselStandEintrag { s: number; t: number; f: number }
type StandMap = Record<string, KapselStandEintrag>;

/** يحجز نتيجة تدرّب جملة: صوابٌ = درجة أعلى، خطأ = عودة الغد؛ يُرجع خريطة جديدة (لا يعدّل الأصل). */
export function kapselVerbuche(stand: StandMap | undefined, id: string, day: number, ok: boolean): StandMap {
  const alt = stand?.[id];
  const s = ok ? Math.min((alt?.s ?? 0) + 1, KAPSEL_LEITER.length - 1) : 0;
  return { ...(stand ?? {}), [id]: { s, t: day, f: (alt?.f ?? 0) + (ok ? 0 : 1) } };
}

/** الجمل المستحقّة اليوم: مرّ على آخر تدرّبٍ لها فاصلُ درجتها — الأقدم استحقاقًا أولًا، ثم الأكثر خطأً. */
export function kapselFaellig(stand: StandMap | undefined, day: number, limit = 3): string[] {
  if (!stand) return [];
  return Object.entries(stand)
    .map(([id, e]) => ({ id, ueber: day - e.t - KAPSEL_LEITER[Math.min(Math.max(e.s, 0), KAPSEL_LEITER.length - 1)], f: e.f }))
    .filter((x) => x.ueber >= 0 && getSatz(x.id))
    .sort((a, b) => b.ueber - a.ueber || b.f - a.f || (a.id < b.id ? -1 : 1))
    .slice(0, Math.max(0, limit))
    .map((x) => x.id);
}

type MitStand = { kapselStand?: StandMap };

/** كبسولة الصباح التكيفية: مستحقّات الأداء أولًا (بحدّ فتحتين)، ثم جمل الجدولة 1/7/30.
 *  بتقدّمٍ فارغٍ تُطابق kapselIds حرفيًا (حتمية البوابات). */
export function kapselIdsAdaptiv(progress: MitStand, day: number): string[] {
  const faellig = kapselFaellig(progress?.kapselStand, day, KAPSEL_GROESSE - 1);
  const out = [...faellig];
  for (const id of kapselIds(day)) {
    if (out.length >= KAPSEL_GROESSE) break;
    if (!out.includes(id)) out.push(id);
  }
  return out;
}

export function kapselQuizAdaptiv(progress: MitStand, day: number): Exercise[] {
  return kapselQuizFuerIds(day, kapselIdsAdaptiv(progress, day));
}

/** يستخرج معرّف الجملة من معرّف تمرين استرجاع (q<tag>-k-<i>-<satz>-cz/tr<n> أو <satz>-tr<n>). */
export function satzIdAusUebung(uebungId: string): string | null {
  const m = uebungId.match(/^q\d+-k-\d+-(.+)-(?:cz|tr)\d+$/) ?? uebungId.match(/^(.+)-tr\d+$/);
  return m ? m[1] : null;
}
