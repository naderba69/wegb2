import type { SrsState, Tempo } from "./types";
import { NEW_CARDS_PER_DAY } from "./types";
import { extraDueDays as overExtraDueDays, shouldOverlearn as overShould } from "./overlearning";

/**
 * SRS 3.0 — FSRS-6 (R280/M1, Experten-Audit) mit den pädagogischen Garantien des Projekts:
 *  • Algorithmus: offener FSRS-6 (Standardgewichte des Referenzprojekts, NICHT an eigene
 *    Nutzer angepasst — keine eigenen Lerndaten; ehrlich deklariert). Formelstand exakt
 *    nach der Referenzimplementierung (py-fsrs, Scheduler): Initial-Stabilitaet/-Schwierigkeit,
 *    lineare Daempfung + Mean-Reversion der Schwierigkeit, Recall-/Forget-Stabilitaet,
 *    Kurzzeit-Stabilitaet bei Bewertung am selben Tag.
 *  • Ziel-Retention 90 %. Intervall = Stabilitaet (bei 90 % exakt), gedeckelt auf 90 Tage.
 *  • Projekt-Garantien bleiben: erste Faelligkeit fruehestens nach 1 Tag, Tagesdeckel
 *    150 Reviews, Neu-Deckel nach Tempo, Rewrite nach 3 Lapses. Kein Fuzz (Determinismus).
 *  • Bewertungen der UI (0/2/4) → FSRS-Ratings Again/Good/Easy (1/3/4).
 *  • Migration: Alt-Karten ohne stab/diff bekommen S≈Intervall und D aus der alten Ease.
 *  • M2: Kartenstufen trennen Erkennen und Produktion — "produktiv" braucht Stabilitaet
 *    ≥21 Tage, ≥4 Wiederholungen und ≥2 produktive Erfolge (AR→DE in tasks.tsx).
 */

const DAY = 24 * 60 * 60 * 1000;
export const MAX_REVIEWS_PER_DAY = 150;
export const MAX_LAPSES_BEFORE_REWRITE = 3;

export function newCard(now = new Date()): SrsState {
  return {
    ease: 2.5,
    interval: 0,
    prod: 0,
    successStreak: 0,
    // أول ظهور للبطاقة: بعد الدرس مباشرة، والمراجعة الأولى بعد 24 ساعة
    due: new Date(now.getTime() + DAY).toISOString(),
    reps: 0,
    lapses: 0,
    learning: true,
    introduced: now.toISOString(),
  };
}

export const FSRS_W: readonly number[] = [
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666,
  0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542,
];
export const FSRS_ZIEL_RETENTION = 0.9;
const FSRS_DECAY = -FSRS_W[20];
const FSRS_FACTOR = Math.pow(0.9, 1 / FSRS_DECAY) - 1;
const clampZahl = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const fsrsR = (tage: number, stab: number) => Math.pow(1 + (FSRS_FACTOR * Math.max(0, tage)) / Math.max(0.01, stab), FSRS_DECAY);
const fsrsS0 = (g: number) => Math.max(0.01, FSRS_W[g - 1]);
const fsrsD0 = (g: number) => clampZahl(FSRS_W[4] - Math.exp(FSRS_W[5] * (g - 1)) + 1, 1, 10);
function fsrsNextDiff(d: number, g: number): number {
  const delta = -FSRS_W[6] * (g - 3);
  const arg2 = d + (delta * (10 - d)) / 9;
  return clampZahl(FSRS_W[7] * fsrsD0(4) + (1 - FSRS_W[7]) * arg2, 1, 10);
}
function fsrsForget(d: number, stab: number, r: number): number {
  const lang = FSRS_W[11] * Math.pow(d, -FSRS_W[12]) * (Math.pow(stab + 1, FSRS_W[13]) - 1) * Math.exp(FSRS_W[14] * (1 - r));
  const kurz = stab / Math.exp(FSRS_W[17] * FSRS_W[18]);
  return clampZahl(Math.min(lang, kurz), 0.01, 3650);
}
function fsrsRecall(d: number, stab: number, r: number, g: number): number {
  const bonus = (g === 2 ? FSRS_W[15] : 1) * (g === 4 ? FSRS_W[16] : 1);
  const faktor = 1 + Math.exp(FSRS_W[8]) * (11 - d) * Math.pow(stab, -FSRS_W[9]) * (Math.exp(FSRS_W[10] * (1 - r)) - 1) * bonus;
  return clampZahl(stab * faktor, 0.01, 3650);
}
function fsrsKurzzeit(stab: number, g: number): number {
  let zunahme = Math.exp(FSRS_W[17] * (g - 3 + FSRS_W[18])) * Math.pow(stab, -FSRS_W[19]);
  if (g >= 2) zunahme = Math.max(zunahme, 1);
  return clampZahl(stab * zunahme, 0.01, 3650);
}
const fsrsIntervall = (stab: number) => (stab / FSRS_FACTOR) * (Math.pow(FSRS_ZIEL_RETENTION, 1 / FSRS_DECAY) - 1);

/** Karten-Meisterungsstufe (M2): Produktion ist eine eigene, strengere Stufe. */
export type KarteStufe = "neu" | "erkennen" | "festigen" | "produktiv";
export const KARTENSTUFE_AR: Record<KarteStufe, string> = {
  neu: "جديدة", erkennen: "تعرّف", festigen: "تثبيت", produktiv: "إنتاج متقن",
};
export function karteStufe(st: SrsState | undefined): KarteStufe {
  if (!st || st.reps === 0) return "neu";
  const stab = st.stab ?? st.interval;
  if (stab >= 21 && st.reps >= 4 && (st.prod ?? 0) >= 2) return "produktiv";
  if (stab >= 7 && st.reps >= 3) return "festigen";
  return "erkennen";
}
export function stufenWert(st: SrsState | undefined): number {
  switch (karteStufe(st)) {
    case "produktiv": return 1;
    case "festigen": return 0.7;
    case "erkennen": return 0.35;
    default: return 0;
  }
}

/** quality: 0 = لم أعرف · 2 = بجهد · 4 = عرفت بسهولة → FSRS-Ratings Again/Good/Easy (1/3/4). */
export function reviewCard(
  state: SrsState,
  quality: 0 | 2 | 4,
  opts?: { produktiv?: boolean; now?: Date },
): SrsState {
  const now = opts?.now ?? new Date();
  const g = quality === 0 ? 1 : quality === 2 ? 3 : 4;
  // أي موعد overlearning حلّ حتى لحظة هذه المراجعة يُستهلك الآن؛ لا يبقى سبباً
  // يجعل البطاقة مستحقة إلى الأبد. المواعيد المستقبلية فقط تستمر في الطابور.
  const futureOverDue = (state.overDue ?? []).filter((due) => {
    const timestamp = new Date(due).getTime();
    return Number.isFinite(timestamp) && timestamp > now.getTime();
  });
  const successStreak = quality >= 2 ? (state.successStreak ?? 0) + 1 : 0;
  const s: SrsState = {
    ...state,
    reps: state.reps + 1,
    last: now.toISOString(),
    successStreak,
    overDue: futureOverDue.length > 0 ? futureOverDue : undefined,
  };
  if (opts?.produktiv && quality >= 2) s.prod = (state.prod ?? 0) + 1;

  if (quality < 2) {
    s.lapses = state.lapses + 1;
    s.overDue = undefined;
    if (s.lapses >= MAX_LAPSES_BEFORE_REWRITE) {
      return { ...newCard(now), lapses: s.lapses, prod: state.prod ?? 0 };
    }
    s.learning = true;
    s.interval = 0;
    if (state.stab !== undefined && state.diff !== undefined) {
      const vergangen = vergangeneTage(state, now);
      s.stab = vergangen < 1 ? fsrsKurzzeit(state.stab, g) : fsrsForget(state.diff, state.stab, fsrsR(vergangen, state.stab));
      s.diff = fsrsNextDiff(state.diff, g);
      s.ease = easeAusDiff(s.diff);
    }
    s.due = new Date(now.getTime() + 0.2 * DAY).toISOString();
    return s;
  }

  // Erfolg: Initialisierung oder Migration alter Karten
  let stab = state.stab;
  let diff = state.diff;
  if (stab === undefined || diff === undefined) {
    if (state.reps === 0) {
      stab = fsrsS0(g);
      diff = fsrsD0(g);
    } else {
      stab = Math.max(0.4, state.interval || 1);
      diff = clampZahl(5 + (2.5 - state.ease) * 2, 1, 10);
      const vergangen = vergangeneTage(state, now);
      stab = vergangen < 1 ? fsrsKurzzeit(stab, g) : fsrsRecall(diff, stab, fsrsR(vergangen, stab), g);
      diff = fsrsNextDiff(diff, g);
    }
  } else {
    const vergangen = vergangeneTage(state, now);
    if (vergangen < 1) {
      stab = fsrsKurzzeit(stab, g);
    } else {
      stab = fsrsRecall(diff, stab, fsrsR(vergangen, stab), g);
      diff = fsrsNextDiff(diff, g);
    }
  }
  s.stab = stab;
  s.diff = diff;
  s.ease = easeAusDiff(diff);
  s.learning = false;
  // FSRS-6 وحده يحدد الفاصل عند هدف الاحتفاظ المعلن؛ لا نمزجه بصيغ كتالوج غير موثقة.
  const rawInterval = Math.round(fsrsIntervall(stab));
  s.interval = Math.min(90, Math.max(1, rawInterval));
  s.due = new Date(now.getTime() + s.interval * DAY).toISOString();
  // 010 Overlearning: عند بلوغ 3 نجاحات متتالية فعلياً، أضف موعدي +2ي/+7ي مرةً واحدة.
  // استعمال now المحقون يجعل الاختبار والترحيل الزمني حتميين ولا يعتمد على ساعة الجهاز الخفية.
  if (successStreak === 3 && overShould(s.reps, successStreak)) {
    s.overDue = overExtraDueDays(now.getTime() / DAY).map((d) => new Date(d * DAY).toISOString());
  }
  return s;
}

function easeAusDiff(d: number): number {
  return Math.round(clampZahl(2.8 - ((d - 1) * 1.5) / 9, 1.3, 2.8) * 100) / 100;
}

/** Verstrichene Tage seit der letzten Bewertung (aus `last`, sonst aus due−Intervall geschaetzt). */
function vergangeneTage(state: SrsState, now: Date): number {
  const basis = state.last
    ? new Date(state.last).getTime()
    : new Date(state.due).getTime() - (state.interval || 0) * DAY;
  const t = (now.getTime() - basis) / DAY;
  return Number.isFinite(t) ? Math.max(0, t) : 999;
}

/** Aktuelle Abrufwahrscheinlichkeit (FSRS-R) einer Karte — null, wenn (noch) keine Stabilitaet bekannt. */
export function abrufbarkeit(st: SrsState | undefined, now = new Date(), plusTage = 0): number | null {
  if (!st || st.reps === 0 || st.stab === undefined) return null;
  return fsrsR(vergangeneTage(st, now) + Math.max(0, plusTage), st.stab);
}

export function isDue(state: SrsState, now = new Date()): boolean {
  if (new Date(state.due).getTime() <= now.getTime()) return true;
  // 010 Overlearning: مواعيد إضافية تُعتبر مستحقة أيضاً
  if (state.overDue?.some((d) => new Date(d).getTime() <= now.getTime())) return true;
  return false;
}

/** أقدم موعد صالح للبطاقة، بما في ذلك مواعيد overlearning. */
function oldestDueTimestamp(state: SrsState): number {
  const timestamps = [state.due, ...(state.overDue ?? [])]
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);
  return timestamps.length > 0 ? Math.min(...timestamps) : Number.POSITIVE_INFINITY;
}

/** أولوية المراجعة: الأقدم استحقاقاً، ثم الأقل قابلية للاسترجاع، ثم الأكثر سقوطاً، ثم المعرّف. */
function compareDueCards(
  a: [string, SrsState],
  b: [string, SrsState],
  now: Date,
): number {
  const dueDelta = oldestDueTimestamp(a[1]) - oldestDueTimestamp(b[1]);
  if (dueDelta !== 0) return dueDelta;
  const recallA = abrufbarkeit(a[1], now) ?? 1;
  const recallB = abrufbarkeit(b[1], now) ?? 1;
  if (recallA !== recallB) return recallA - recallB;
  if (a[1].lapses !== b[1].lapses) return b[1].lapses - a[1].lapses;
  return a[0].localeCompare(b[0]);
}

/** عدد البطاقات الجديدة المسموح بها اليوم حسب الوتيرة */
export function newCardCap(tempo: Tempo): number {
  return NEW_CARDS_PER_DAY[tempo];
}

/** هل أُدخلت البطاقة في اليوم المحلي نفسه؟ */
export function wasIntroducedToday(state: SrsState | undefined, now = new Date()): boolean {
  if (!state?.introduced) return false;
  const date = new Date(state.introduced);
  return Number.isFinite(date.getTime())
    && date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}

/** عدد بطاقات المفردات التي أُدخلت اليوم عبر جميع الحزم (وفق اليوم المحلي). */
export function countNewCardsIntroducedToday(
  srs: Record<string, SrsState>,
  cardIds: Iterable<string>,
  now = new Date(),
): number {
  const seen = new Set<string>();
  let count = 0;
  for (const id of cardIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    if (wasIntroducedToday(srs[id], now)) count++;
  }
  return count;
}

/**
 * اختيار دفعة اليوم من SRS:
 *  1. بطاقات المراجعة المستحقة (≤150 بطاقة).
 *  2. بطاقات جديدة (≤newCardCap حسب الوتيرة).
 *  لا تُعرض البطاقات قبل الدرس (cards post-lesson/weekend/due) —
 *  الدالة تُستدعى بعد تسليم أولى المهام لا قبلها.
 */
export function todayDeck(
  srs: Record<string, SrsState>,
  tempo: Tempo,
  now = new Date()
): { due: string[]; newCards: string[] } {
  const due: string[] = [];
  const notStarted: string[] = [];
  for (const [id, st] of Object.entries(srs)) {
    if (st.reps === 0) {
      notStarted.push(id);
    } else if (isDue(st, now)) {
      due.push(id);
    }
  }
  due.sort((a, b) => compareDueCards([a, srs[a]], [b, srs[b]], now));
  notStarted.sort();
  return {
    due: due.slice(0, MAX_REVIEWS_PER_DAY),
    newCards: notStarted.slice(0, newCardCap(tempo)),
  };
}
