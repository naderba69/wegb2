/**
 * ═══════════════════════════════════════════════════════════════════
 *  🧑‍🏫 U4/R190 · وضع المعلّم — نظرة صفّ من ملفات محلية فقط
 * ═══════════════════════════════════════════════════════════════════
 *  الجهاز الواحد قد يحمل عدّة متعلّمين (ملفات profiles المحلية).
 *  هذه الطبقة تلخّص كلّ ملفٍّ من سجلّه نفسه: أين يقف في الخطة، كم
 *  أغلق، متى كان آخر نشاط، امتحاناته المجتازة، وأضعف نمط خطأ لديه.
 *  لا خادم ولا رفع: التصدير ملفّات تُنزَّل على الجهاز (JSON/HTML
 *  قابل للطباعة) وتبقى بيد المعلّم.
 * ═══════════════════════════════════════════════════════════════════
 */
import { fehlerFamilien } from "./fehler";
import { levelOf } from "./plan";
import type { Progress } from "./types";

export interface LernendenZeile {
  id: string;
  name: string;
  emoji: string;
  aktiv: boolean;
  tag: number;
  phase: string;
  geschlosseneTage: number;
  letztesDatum?: string;
  minutenGemessen: number;
  pruefungenBestanden: number;
  pruefungenGesamt: number;
  schwaechstesMuster?: string;
  fehlerGesamt: number;
}

/** سطر متعلّم واحد من تقدّمه الخام — اشتقاق نقي قابل لإعادة الحساب */
export function lernendenZeile(
  info: { id: string; name: string; emoji: string },
  progress: Progress,
  aktivId: string,
): LernendenZeile {
  const tage = Object.values(progress.plan.days).filter((d) => d.closed);
  const letztes = tage.map((d) => d.at).filter(Boolean).sort().pop();
  const pruefungen = Object.values(progress.exams ?? {});
  const fams = fehlerFamilien(progress);
  return {
    id: info.id,
    name: info.name,
    emoji: info.emoji,
    aktiv: info.id === aktivId,
    tag: progress.plan.day,
    phase: levelOf(Math.min(progress.plan.day, 378)),
    geschlosseneTage: tage.length,
    letztesDatum: letztes ? letztes.slice(0, 10) : undefined,
    // الدقائق المقاسة بالمؤقّت بحسب يوم الخطة (DayResult ينقلها عند الإغلاق — لا جمع مزدوج)
    minutenGemessen: Math.round(
      Object.values(progress.plan.minutenEffektivTage ?? {}).reduce((s, v) => s + v, 0),
    ),
    pruefungenBestanden: pruefungen.filter((e) => e.passed).length,
    pruefungenGesamt: pruefungen.length,
    schwaechstesMuster: fams[0] ? `${fams[0].titel} (${fams[0].gl.length})` : undefined,
    fehlerGesamt: Object.keys(progress.fehler ?? {}).length,
  };
}
