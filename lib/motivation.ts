/**
 * ═══════════════════════════════════════════════════════════════════
 *  🌡️ U2/R188 · تحفيز صادق — أرقام من السجلّ فقط
 * ═══════════════════════════════════════════════════════════════════
 *  كلّ رقم هنا يُشتقّ اشتقاقًا قابلًا لإعادة الحساب من سجلات التقدّم
 *  نفسها: أيام أُغلقت فعلًا (DayResult.at + tasksDone + minutenEffektiv
 *  المقاسة بالمؤقّت). الهدف الأسبوعي ليس رقمًا زينيًا مفروضًا: هو
 *  متوسط أيامك النشطة في أسابيعك الأربعة الماضية (مقيدًا بين 2 و6)،
 *  وعند غياب السجلّ يبدأ من 3 مع التصريح بذلك. لا نقاط ولا عملات هنا.
 * ═══════════════════════════════════════════════════════════════════
 */
import type { Progress } from "./types";

/** تاريخ ISO (YYYY-MM-DD) من طابع DayResult.at */
function datumVon(at: string): string {
  return at.slice(0, 10);
}
function plusTage(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
/** اثنين أسبوعِ تاريخٍ معطى (أسابيع ألمانية تبدأ الاثنين) */
export function wochenMontag(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  const dow = d.getUTCDay(); // 0=So
  const zurueck = (dow + 6) % 7;
  return plusTage(iso, -zurueck);
}

interface TagesFakt {
  datum: string;
  aufgaben: number;
  minuten: number;
}

/** حقائق الأيام المغلقة من السجلّ، مرتّبة بالتاريخ */
function fakten(progress: Progress): TagesFakt[] {
  return Object.values(progress.plan.days)
    .filter((d) => d.closed && d.at)
    .map((d) => ({
      datum: datumVon(d.at),
      aufgaben: d.tasksDone ?? 0,
      minuten: Math.round(d.minutenEffektiv ?? 0),
    }))
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

/** هدف الأيام الأسبوعي من إيقاع المتعلّم نفسه (آخر ٤ أسابيع كاملة قبل هذا الأسبوع) */
export function zielAusVerlauf(progress: Progress, heuteIso: string): { ziel: number; ausVerlauf: boolean } {
  const alle = fakten(progress);
  const montag = wochenMontag(heuteIso);
  const aktiveJeWoche: number[] = [];
  for (let w = 1; w <= 4; w++) {
    const start = plusTage(montag, -7 * w);
    const ende = plusTage(montag, -7 * (w - 1));
    const tage = new Set(alle.filter((f) => f.datum >= start && f.datum < ende).map((f) => f.datum));
    if (tage.size > 0) aktiveJeWoche.push(tage.size);
  }
  if (aktiveJeWoche.length === 0) return { ziel: 3, ausVerlauf: false };
  const schnitt = aktiveJeWoche.reduce((s, v) => s + v, 0) / aktiveJeWoche.length;
  return { ziel: Math.min(6, Math.max(2, Math.round(schnitt))), ausVerlauf: true };
}

export interface WochenBilanz {
  montag: string;
  /** أيام هذا الأسبوع (اثنين..أحد) وهل أُغلق فيها يوم */
  tage: { datum: string; aktiv: boolean; heute: boolean }[];
  aktiveTage: number;
  aufgabenErledigt: number;
  minutenGemessen: number;
  zielTage: number;
  zielAusVerlauf: boolean;
  zielErreicht: boolean;
}

/** ميزانية الأسبوع الحالي — كلّ حقل من سجلّ الأيام المغلقة حصرًا */
export function wochenBilanz(progress: Progress, heuteIso: string): WochenBilanz {
  const montag = wochenMontag(heuteIso);
  const alle = fakten(progress);
  const diese = alle.filter((f) => f.datum >= montag && f.datum <= plusTage(montag, 6));
  const aktivSet = new Set(diese.map((f) => f.datum));
  const { ziel, ausVerlauf } = zielAusVerlauf(progress, heuteIso);
  return {
    montag,
    tage: Array.from({ length: 7 }, (_, i) => {
      const datum = plusTage(montag, i);
      return { datum, aktiv: aktivSet.has(datum), heute: datum === heuteIso };
    }),
    aktiveTage: aktivSet.size,
    aufgabenErledigt: diese.reduce((s, f) => s + f.aufgaben, 0),
    minutenGemessen: diese.reduce((s, f) => s + f.minuten, 0),
    zielTage: ziel,
    zielAusVerlauf: ausVerlauf,
    zielErreicht: aktivSet.size >= ziel,
  };
}

/**
 * سلسلة الأيام المتتالية من السجلّ: أيام مغلقة متجاورة تنتهي اليوم
 * أو أمس (أمس مقبول كي لا تنكسر السلسلة قبل جلسة اليوم).
 */
export function streakAusVerlauf(progress: Progress, heuteIso: string): number {
  const set = new Set(fakten(progress).map((f) => f.datum));
  let cursor = set.has(heuteIso) ? heuteIso : plusTage(heuteIso, -1);
  let n = 0;
  while (set.has(cursor)) {
    n++;
    cursor = plusTage(cursor, -1);
  }
  return n;
}
