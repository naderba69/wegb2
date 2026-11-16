"use client";
/**
 * 📅 U6/R192 — بطاقة الإيقاع نحو الامتحان: ما يلزمك يوميًا من دقائق
 * المسار الأساسي المخطّط. الحدود داخلية محافظة وغير مثبتة ميدانياً؛
 * فوقها نقول إن الموعد خارج الحد الداخلي بدل ضغط المحتوى أو حذفه.
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
            <strong>{z.minutenProTag} دقيقة من المسار الأساسي يوميًا</strong> (متوسط يومك الأساسي القادم {z.minutenJePlanTag} دقيقة).
          </p>
          {z.status === "ruhig" && (
            <p style={{ margin: 0, lineHeight: 2 }}>
              ✅ داخل حد التخطيط الداخلي المحافظ (حتى {ZIEL_MINUTEN_OK} دقيقة أساسية يوميًا). هذا ليس إثبات استدامة أو تعب ميداني.
            </p>
          )}
          {z.status === "eng" && (
            <p style={{ margin: 0, lineHeight: 2 }}>
              ⚠️ إيقاع فوق الحد المحافظ ({ZIEL_MINUTEN_OK}–{ZIEL_MINUTEN_MAX} دقيقة أساسية يوميًا). لا ندّعي أنه مستدام؛ راقب تعبك وحرّك الموعد بدلاً من ضغط أيام متعددة باستمرار.
            </p>
          )}
          {z.status === "unrealistisch" && (
            <p style={{ margin: 0, lineHeight: 2 }}>
              ⛔ بصراحة: بهذا الموعد يلزم أكثر من {ZIEL_MINUTEN_MAX} دقيقة أساسية كلّ يوم — خارج حدنا الداخلي، ولن نضغط الأيام أو نحذف محتوى لنجعله يبدو ممكناً.
              {z.fruehestesRuhigesDatum && (
                <> أقرب موعدٍ يقع عند الحد المحافظ ({ZIEL_MINUTEN_OK} د/يوم): <strong>{z.fruehestesRuhigesDatum}</strong>.</>
              )}
            </p>
          )}
          <p className="tiny muted" style={{ margin: 0, lineHeight: 1.9 }}>
            الدقائق تقديرات المسار الأساسي من buildDay لا وعود زمن حقيقي؛ التعميق الاختياري غير داخل الحساب، ولا توجد بعد دراسة التزام ميدانية.
          </p>
        </>
      )}
    </div>
  );
}
