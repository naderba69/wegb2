"use client";
/**
 * 📅 U6/R192 — بطاقة الإيقاع نحو الامتحان: ما يلزمك يوميًا من دقائق
 * الخطة المخطّطة، داخل سقوف الأيام كما هي. فوق حدّ الاحتمال نقول
 * «غير واقعي» بصوتٍ عالٍ ونعطي أقرب موعدٍ ممكن — لا نضغط ولا نحذف.
 */
import { useMemo } from "react";
import type { Progress } from "@/lib/types";
import { zielTempo, ZIEL_MINUTEN_OK, ZIEL_MINUTEN_MAX } from "@/lib/zieltempo";

function heuteIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ZielTempoKarte({ progress }: { progress: Progress }) {
  const z = useMemo(() => zielTempo(progress, heuteIso()), [progress]);

  if (z.status === "kein-datum") return null;

  return (
    <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.4rem" }} data-testid="ziel-tempo">
      {z.status === "vorbei" && (
        <p style={{ margin: 0, lineHeight: 2 }}>
          📅 انقضى الموعد المضبوط ({progress.settings.examDate}). حدّث التاريخ ليعيد التطبيق حساب إيقاعك.
        </p>
      )}
      {z.status === "fertig" && (
        <p style={{ margin: 0, lineHeight: 2 }}>
          📅 أنهيت أيام الخطة الـ378 — الإيقاع لم يعد مسألة؛ ركّز على المحاكاة والمراجعة.
        </p>
      )}
      {(z.status === "ruhig" || z.status === "eng" || z.status === "unrealistisch") && (
        <>
          <p style={{ margin: 0, lineHeight: 2 }}>
            📅 بقي <strong>{z.restPlanTage}</strong> يوم خطة في <strong>{z.kalenderTage}</strong> يومًا تقويميًا:
            إيقاع مطلوب <strong>{z.tempoProTag}</strong> يوم خطة/يوم، أي نحو{" "}
            <strong>{z.minutenProTag} دقيقة مخططة يوميًا</strong> (متوسط يوم خطتك القادم {z.minutenJePlanTag} دقيقة).
          </p>
          {z.status === "ruhig" && (
            <p style={{ margin: 0, lineHeight: 2 }}>
              ✅ داخل الاحتمال المستدام (حتى {ZIEL_MINUTEN_OK} دقيقة مخططة يوميًا) — وسقوف أيام الخطة وتغطيتها كما هي دون أيّ ضغط.
            </p>
          )}
          {z.status === "eng" && (
            <p style={{ margin: 0, lineHeight: 2 }}>
              ⚠️ إيقاع مشدود ({ZIEL_MINUTEN_OK}–{ZIEL_MINUTEN_MAX} دقيقة يوميًا): ممكن لفترة قصيرة، لكنّه فوق
              إيقاع الاستدامة. إن استمرّ التعب فالموعد لا الإيقاع هو ما يجب أن يتحرّك.
            </p>
          )}
          {z.status === "unrealistisch" && (
            <p style={{ margin: 0, lineHeight: 2 }}>
              ⛔ بصراحة: بهذا الموعد يلزم أكثر من {ZIEL_MINUTEN_MAX} دقيقة مخططة كلّ يوم — لا نعرضه كخطة
              واقعية، ولن نكسر سقوف الأيام ولا نحذف تغطية لنجعله يبدو ممكنًا.
              {z.fruehestesRuhigesDatum && (
                <> أقرب موعدٍ تبلغ فيه النهاية بإيقاعٍ مستدام ({ZIEL_MINUTEN_OK} د/يوم): <strong>{z.fruehestesRuhigesDatum}</strong>.</>
              )}
            </p>
          )}
          <p className="tiny muted" style={{ margin: 0, lineHeight: 1.9 }}>
            الدقائق تقديرات الخطة المخطّطة (buildDay) لا وعود زمن حقيقي؛ والإيقاع حسابٌ من موضعك الحالي — كلّ يومٍ تُغلقه يعيد حسابه.
          </p>
        </>
      )}
    </div>
  );
}
