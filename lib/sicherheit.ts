import type { Progress, SicherheitsEintrag } from "./types";

/** تقييمُ الثقةِ قبلَ الإجابة — بلا نموذجٍ لغويّ: المتعلّمُ يعلنُ «متأكّد/غير متأكّد» قبلَ الاختيار، ثم نقيسُ المعايرة */
export const MAX_EINTRAEGE = 500;

export function logSicherheit(p: Progress, e: SicherheitsEintrag): Progress {
  const liste = [...(p.sicherheit ?? []), e].slice(-MAX_EINTRAEGE);
  return { ...p, sicherheit: liste };
}

export interface SicherheitsStatistik {
  n: number;
  sicherRichtig: number;
  /** الثقةُ الخاطئة: متأكّدٌ وأخطأ — أخطرُ فئةٍ تعليميّاً */
  sicherFalsch: number;
  unsicherRichtig: number;
  unsicherFalsch: number;
  /** نسبةُ المعايرة: (متأكّد∧صحيح + غيرُ متأكّد∧خطأ) / n — 1 = يعرفُ ما يعرف */
  kalibrierung: number;
  /** نسبةُ الثقةِ الخاطئةِ بينَ إجاباتِ «متأكّد» */
  ueberkonfidenz: number;
}

export function sicherheitsStatistik(liste: SicherheitsEintrag[] | undefined): SicherheitsStatistik {
  const l = liste ?? [];
  const sr = l.filter((e) => e.sicher && e.correct).length;
  const sf = l.filter((e) => e.sicher && !e.correct).length;
  const ur = l.filter((e) => !e.sicher && e.correct).length;
  const uf = l.filter((e) => !e.sicher && !e.correct).length;
  const n = l.length;
  return {
    n, sicherRichtig: sr, sicherFalsch: sf, unsicherRichtig: ur, unsicherFalsch: uf,
    kalibrierung: n ? (sr + uf) / n : 0,
    ueberkonfidenz: sr + sf ? sf / (sr + sf) : 0,
  };
}

/** سطرُ التقريرِ الأسبوعيّ — صريحٌ عن الحدّ: يقيسُ أسئلةَ الاختيارِ التي قُيِّمت فقط */
export function sicherheitsZeile(liste: SicherheitsEintrag[] | undefined): string | null {
  const s = sicherheitsStatistik(liste);
  if (s.n < 5) return null;
  const pct = (x: number) => Math.round(x * 100);
  if (s.ueberkonfidenz >= 0.3) return `⚠️ ثقةٌ خاطئة: في ${pct(s.ueberkonfidenz)}% من إجاباتِ «متأكّد» أخطأتَ (${s.sicherFalsch} من ${s.sicherRichtig + s.sicherFalsch}) — راجعْ هذه قبلَ غيرِها؛ المعايرةُ ${pct(s.kalibrierung)}% من ${s.n} سؤالاً مقيَّماً.`;
  return `🎯 معايرةُ الثقة ${pct(s.kalibrierung)}% من ${s.n} سؤالاً مقيَّماً — ثقةٌ خاطئة ${s.sicherFalsch}، حذرٌ زائد ${s.unsicherRichtig}.`;
}
