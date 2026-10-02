import type { SrsState, Progress, Tempo } from "./types";
import { NEW_CARDS_PER_DAY } from "./types";

/**
 * SRS 2.0 — SM-2 مبسّط مع الضمانات التربوية:
 *  • أول مراجعة بعد 24 ساعة (ليست فورية ولا أقل من يوم).
 *  • بعد 3 إخفاقات (lapses) على البطاقة تُعاد تهيئتها (rewrite) بدل تكديس الفواصل.
 *  • سقف مراجعات يومية 150 بطاقة لمنع الانهيار.
 *  • سقف بطاقات جديدة يومية حسب الوتيرة (3 / 5 / 10).
 */

const DAY = 24 * 60 * 60 * 1000;
export const MAX_REVIEWS_PER_DAY = 150;
export const MAX_LAPSES_BEFORE_REWRITE = 3;

export function newCard(): SrsState {
  return {
    ease: 2.5,
    interval: 0,
    // أول ظهور للبطاقة: بعد الدرس مباشرة، والمراجعة الأولى بعد 24 ساعة
    due: new Date(Date.now() + DAY).toISOString(),
    reps: 0,
    lapses: 0,
    learning: true,
    introduced: new Date().toISOString(),
  };
}

/** quality: 0 = لم أعرف · 2 = بجهد · 4 = عرفت بسهولة */
export function reviewCard(state: SrsState, quality: 0 | 2 | 4): SrsState {
  let s = { ...state };
  s.reps += 1;
  if (quality < 2) {
    s.lapses += 1;
    // بعد 3 إخفاقات: إعادة كتابة كاملة (rewrite)
    if (s.lapses >= MAX_LAPSES_BEFORE_REWRITE) {
      return { ...newCard(), lapses: s.lapses };
    }
    s.learning = true;
    s.interval = 0;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.due = new Date(Date.now() + 0.2 * DAY).toISOString();
    return s;
  }
  s.ease = Math.max(1.3, s.ease + (quality === 4 ? 0.1 : -0.05));
  if (s.learning) {
    s.learning = false;
    s.interval = 1; // مراجعة أولى بعد 24 ساعة بالضبط
  } else if (s.interval <= 1) {
    s.interval = 3;
  } else {
    s.interval = Math.min(90, Math.round(s.interval * s.ease));
  }
  s.due = new Date(Date.now() + Math.min(90, s.interval) * DAY).toISOString();
  return s;
}

export function isDue(state: SrsState, now = new Date()): boolean {
  return new Date(state.due).getTime() <= now.getTime();
}

/** عدد البطاقات الجديدة المسموح بها اليوم حسب الوتيرة */
export function newCardCap(tempo: Tempo): number {
  return NEW_CARDS_PER_DAY[tempo];
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
  due.sort(); // حتمية
  notStarted.sort();
  return {
    due: due.slice(0, MAX_REVIEWS_PER_DAY),
    newCards: notStarted.slice(0, newCardCap(tempo)),
  };
}
