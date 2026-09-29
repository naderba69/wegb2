import type { SrsState } from "./types";

/** SM-2 مبسّط — تكرار متباعد يعمل بالكامل في المتصفح */

const DAY = 24 * 60 * 60 * 1000;

export function newCard(): SrsState {
  return { ease: 2.5, interval: 0, due: new Date().toISOString(), reps: 0, lapses: 0, learning: true };
}

/** quality: 0 = لم أعرف · 2 = بجهد · 4 = عرفت بسهولة */
export function reviewCard(state: SrsState, quality: 0 | 2 | 4): SrsState {
  const s = { ...state };
  s.reps += 1;
  if (quality < 2) {
    s.lapses += 1;
    s.learning = true;
    s.interval = 0;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.due = new Date(Date.now() + 0.2 * DAY).toISOString();
    return s;
  }
  s.ease = Math.max(1.3, s.ease + (quality === 4 ? 0.1 : -0.05));
  if (s.learning) {
    s.learning = false;
    s.interval = 1;
  } else if (s.interval <= 1) {
    s.interval = 3;
  } else {
    // سقف 90 يوماً: النمو ×ease بلا كبح كان ينفجر بـ Date بعد عشرات المراجعات المثالية
    // (ضبطه اختبار scripts/engine_smoke.ts — القسم E6)
    s.interval = Math.min(90, Math.round(s.interval * s.ease));
  }
  s.due = new Date(Date.now() + Math.min(90, s.interval) * DAY).toISOString();
  return s;
}

export function isDue(state: SrsState, now = new Date()): boolean {
  return new Date(state.due).getTime() <= now.getTime();
}
