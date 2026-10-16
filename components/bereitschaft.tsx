"use client";
// 📈 تحليلات الاستعداد (E3/R173): صورة من سجلّ المتعلّم المسجَّل فقط — بلا تنبؤ وبلا وعود.
import { useMemo, useState } from "react";
import type { Progress } from "@/lib/types";
import { SIM_FORMATE, type SimFormatId } from "@/lib/simulation";
import {
  FERT_AR,
  FERT_SELBST,
  bereitschaftsFazit,
  fertigkeitenBilanz,
  tageBisExamen,
} from "@/lib/bereitschaft";

const TREND_AR: Record<string, string> = { steigend: "↑ يصعد", fallend: "↓ يهبط", stabil: "→ مستقر" };

export function Bereitschaft({ progress }: { progress: Progress }) {
  const [format, setFormat] = useState<SimFormatId | null>(null);
  const bilanzen = useMemo(() => fertigkeitenBilanz(progress, format ?? undefined), [progress, format]);
  const fazit = useMemo(() => bereitschaftsFazit(progress), [progress]);
  const tage = tageBisExamen(progress);
  const historie = useMemo(
    () => [...(progress.simulationen ?? [])].sort((a, b) => b.datum.localeCompare(a.datum)).slice(0, 6),
    [progress]
  );

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>📈 تحليلات الاستعداد — من سجلّك أنت</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.6rem", lineHeight: 1.8 }}>
        كل رقمٍ هنا حسابٌ من محاولات محاكاتك المحفوظة في متصفّحك، وخطّ النجاح المرجعي 60 كما في الامتحانات الرسمية.
        هذه الصورة تصف ما سجّلته حتى اليوم — وليست تنبؤًا بنتيجة امتحانٍ حقيقي، فالمحاكاة تدريبٌ لا امتحانٌ رسمي.
      </div>

      {progress.settings.examDate && (
        <div className="card" style={{ padding: "0.6rem 0.8rem", marginBottom: "0.6rem" }}>
          🎯 {progress.settings.examName ? `امتحانك: ${progress.settings.examName} · ` : "موعد امتحانك المضبوط: "}
          <b className="rtl-num">{progress.settings.examDate}</b>
          {tage !== null && (
            <span> — {tage > 0 ? `بقي ${tage} يومًا` : tage === 0 ? "اليوم هو الموعد!" : `مضى منذ ${-tage} يوم (حدّث الموعد من الإعدادات)`}</span>
          )}
        </div>
      )}
      {!progress.settings.examDate && (
        <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginBottom: "0.6rem" }}>
          💡 لم تضبط موعد امتحان بعد — يمكنك ضبطه من «الإعدادات» فيظهر هنا عدّاد الأيام المتبقية (معلومة وصفية فقط).
        </div>
      )}

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
        <button type="button" className={format === null ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setFormat(null)}>
          كلّ الصيغ
        </button>
        {SIM_FORMATE.map((f) => (
          <button key={f.id} type="button" className={format === f.id ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setFormat(f.id)}>
            {f.titelAr}
          </button>
        ))}
      </div>

      {fazit.versucheGesamt === 0 ? (
        <div className="card" style={{ padding: "0.7rem 0.9rem" }}>
          لم تُسجَّل أيّ محاولة محاكاة بعد. خُض محاكاة كاملة من بطاقة «محاكاة الامتحانات» وستظهر هنا حصيلة مهاراتك من نتائجك نفسها.
        </div>
      ) : (
        <>
          <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            أتممتَ <b className="rtl-num">{fazit.versucheGesamt}</b> محاكاة كاملة، منها{" "}
            <b className="rtl-num">{fazit.bestandenAnzahl}</b> بحكم نجاح صيغتها
            {fazit.proFormat.length > 0 && (
              <> ({fazit.proFormat.map((e) => `${e.formatAr}: ${e.bestanden}/${e.versuche}`).join(" · ")})</>
            )}
            .
          </div>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            {bilanzen.map((b) => (
              <div key={b.key} className="card" style={{ padding: "0.6rem 0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
                  <strong>{FERT_AR[b.key]}</strong>
                  <span style={{ fontWeight: 800, color: b.farbe }}>{b.bandAr}</span>
                </div>
                {b.versuche > 0 ? (
                  <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>
                    متوسط آخر {Math.min(3, b.versuche)} محاولات: <b className="rtl-num">{b.mittel}</b> من 100 · آخر محاولة:{" "}
                    <b className="rtl-num">{b.letzter}</b> · فوق خطّ 60: <b className="rtl-num">{b.ueberLinie}/{Math.min(3, b.versuche)}</b>
                    {b.trend && <> · الاتجاه: {TREND_AR[b.trend]}</>}
                    {FERT_SELBST[b.key] && <span> · (في المحاكاة: تقييم ذاتي بالشبكة — دليلٌ أخفّ من الآلي)</span>}
                  </div>
                ) : (
                  <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>لا بيانات في الصيغة المختارة.</div>
                )}
                {b.mittel !== null && (
                  <div style={{ height: 8, borderRadius: 4, background: "var(--color-paper)", marginTop: "0.4rem", position: "relative" }}>
                    <div style={{ width: `${b.mittel}%`, height: "100%", borderRadius: 4, background: b.farbe }} />
                    <div style={{ position: "absolute", top: -2, bottom: -2, insetInlineStart: "60%", width: 2, background: "var(--color-ink)" }} title="خطّ النجاح 60" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {fazit.empfehlungAr && (
            <div className="card" style={{ padding: "0.6rem 0.8rem", marginTop: "0.6rem", background: "var(--color-gold-soft)" }}>
              🧭 الرقعة التالية من سجلّك: {fazit.empfehlungAr}
            </div>
          )}

          {historie.length > 0 && (
            <div style={{ marginTop: "0.7rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>آخر المحاولات</div>
              {historie.map((v, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.2rem 0", flexWrap: "wrap", gap: "0.4rem" }}>
                  <span>
                    {v.bestanden ? "✅" : "✗"}{" "}
                    {SIM_FORMATE.find((f) => f.id === ((v.format as SimFormatId) ?? "goethe-b2"))?.titelAr ?? "Goethe-Zertifikat B2"}
                  </span>
                  <span className="rtl-num">
                    قراءة {v.punkte.lesen} · استماع {v.punkte.hoeren} · كتابة {v.punkte.schreiben} · تحدّث {v.punkte.sprechen} · {v.datum.slice(0, 10)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
