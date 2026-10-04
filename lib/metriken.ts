// 📊 مقاييس النجاح الثلاثة (R34/HANDOFF §10) — دوالّ نقية حتمية من بيانات Progress:
//   M1 نسبة المهام الحرّة المسلَّمة بتقييم مسجّل (الهدف ≥90٪)
//   M2 شفاء أخطاء الدفتر خلال 3 إعادات (العالق = 3+ تعثّر بلا نجاح)
//   M3 منحنى امتحانات المراحل + الوحدات المعادة مرتين (خلل في تصميمنا)
import type { Progress } from "./types";

export const FREI_ARTEN: readonly string[] = ["schreiben", "sprechen", "aussprache"];

export function feedbackQuote(p: Progress): { done: number; graded: number; pct: number | null } {
  const tasks = Object.values(p.plan.tasks ?? {}).filter(
    (t) => t.done && FREI_ARTEN.includes(t.kind ?? "")
  );
  const graded = tasks.filter((t) => t.total > 0).length;
  return { done: tasks.length, graded, pct: tasks.length ? Math.round((graded / tasks.length) * 100) : null };
}

export function fehlerHeilung(p: Progress): { total: number; geheilt: number; stuck: number; pct: number | null } {
  const alle = Object.values(p.fehler ?? {});
  const geheilt = alle.filter((f) => f.treffer === 0 && (f.srs?.reps ?? 0) > 0).length;
  const stuck = alle.filter((f) => f.treffer >= 3).length;
  return { total: alle.length, geheilt, stuck, pct: alle.length ? Math.round((geheilt / alle.length) * 100) : null };
}

export type KurvenTrend = "steigend" | "fallend" | "stabil" | null;

export function pruefungsKurve(p: Progress): {
  punkte: { day: number; score: number }[];
  trend: KurvenTrend;
  wiederholt: number[];
} {
  const alle = Object.entries(p.exams ?? {})
    .map(([d, e]) => ({ day: Number(d), score: e.score }))
    .sort((a, b) => a.day - b.day);
  let trend: KurvenTrend = null;
  if (alle.length >= 2) {
    const halb = Math.floor(alle.length / 2);
    const avg = (xs: { score: number }[]) => xs.reduce((n, x) => n + x.score, 0) / xs.length;
    const d = avg(alle.slice(halb)) - avg(alle.slice(0, halb));
    trend = d >= 5 ? "steigend" : d <= -5 ? "fallend" : "stabil";
  }
  const wiederholt = Object.entries(p.modulPruefungen ?? {})
    .filter(([, m]) => m.versuche >= 3)
    .map(([n]) => Number(n))
    .sort((a, b) => a - b);
  return { punkte: alle.slice(-8), trend, wiederholt };
}
