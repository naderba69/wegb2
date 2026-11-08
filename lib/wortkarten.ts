import { countNewCardsIntroducedToday, isDue, newCardCap, wasIntroducedToday } from "./srs";
import type { SrsState, Tempo, VocabCard } from "./types";

/**
 * حزمة بطاقات قابلة للاختبار بمعزل عن React.
 *
 * الأولوية داخل الدفعة: مراجعات مستحقة، ثم بطاقات ظهرت اليوم ولم تُقيَّم، ثم
 * بطاقات جديدة ضمن السقف اليومي العام. البطاقات ذات المعرّف المكرر تُحتسب مرة
 * واحدة فقط، ولا تُخلط البطاقة المستقبلية مع المستحقّة.
 */
export interface WortkartenPlan<T extends Pick<VocabCard, "id"> = VocabCard> {
  queue: T[];
  stats: {
    due: number;
    pending: number;
    fresh: number;
    cap: number;
    introduced: number;
  };
}

export function planeWortkarten<T extends Pick<VocabCard, "id">>(
  cards: readonly T[],
  srs: Record<string, SrsState>,
  allCardIds: Iterable<string>,
  tempo: Tempo,
  now = new Date(),
  batchSize = 10,
): WortkartenPlan<T> {
  const seen = new Set<string>();
  const uniqueCards = cards.filter((card) => {
    if (!card.id || seen.has(card.id)) return false;
    seen.add(card.id);
    return true;
  });
  const limit = Number.isFinite(batchSize)
    ? Math.max(0, Math.min(10, Math.floor(batchSize)))
    : 10;

  const pending = uniqueCards.filter((card) => srs[card.id]?.reps === 0 && wasIntroducedToday(srs[card.id], now));
  const pendingIds = new Set(pending.map((card) => card.id));
  const due = uniqueCards.filter((card) => Boolean(srs[card.id]) && isDue(srs[card.id], now) && !pendingIds.has(card.id));
  const fresh = uniqueCards.filter((card) => !srs[card.id]);
  const cap = newCardCap(tempo);
  const introduced = countNewCardsIntroducedToday(srs, allCardIds, now);
  const roomForNew = Math.max(0, cap - introduced);

  // المستحق أولاً فعلاً حتى عند ازدحام البطاقات غير المقيّمة؛ ثم نستأنف ما ظهر
  // اليوم، ولا يزاحم الجديد أياً من المسارين.
  const dueToday = due.slice(0, limit);
  const pendingToday = pending.slice(0, Math.max(0, limit - dueToday.length));
  const newSlots = Math.min(roomForNew, Math.max(0, limit - dueToday.length - pendingToday.length));
  const queue = [...dueToday, ...pendingToday, ...fresh.slice(0, newSlots)].slice(0, limit);

  return {
    queue,
    stats: {
      due: due.length,
      pending: pending.length,
      fresh: fresh.length,
      cap,
      introduced,
    },
  };
}
