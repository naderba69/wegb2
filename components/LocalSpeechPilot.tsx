"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkLocalGermanAvailability,
  installLocalGermanModel,
  startLocalGermanRecognition,
  type LocalSpeechAvailability,
} from "@/lib/local-speech";

function availabilityText(state: LocalSpeechAvailability): string {
  switch (state) {
    case "checking": return "جارٍ فحص إتاحة de-DE المحلية…";
    case "available": return "حزمة de-DE المحلية متاحة في هذا المتصفح.";
    case "downloadable": return "يمكن طلب حزمة de-DE المحلية من المتصفح بعد موافقتك المنفصلة.";
    case "downloading": return "يجري المتصفح تنزيل حزمة de-DE؛ انتظر ثم أعد الفحص.";
    case "unavailable": return "التعرّف المحلي أو حزمة de-DE غير متاحين على هذا الجهاز حالياً.";
    case "unsupported": return "هذا المتصفح لا يوفّر واجهة التعرّف المحلي المطلوبة؛ لم يُستخدم التعرّف السحابي.";
    case "error": return "تعذّر فحص الإتاحة التقنية؛ لم يُفتح الميكروفون ولم يحدث انتقال إلى السحابة.";
  }
}

export default function LocalSpeechPilot() {
  const [availability, setAvailability] = useState<LocalSpeechAvailability>("checking");
  const [consentToDownload, setConsentToDownload] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [message, setMessage] = useState("");
  const stopRef = useRef<(() => void) | null>(null);
  const receivedRef = useRef(false);
  const failedRef = useRef(false);

  const refreshAvailability = useCallback(async () => {
    setAvailability("checking");
    const result = await checkLocalGermanAvailability();
    setAvailability(result);
  }, []);

  useEffect(() => {
    void refreshAvailability();
    return () => {
      stopRef.current?.();
      stopRef.current = null;
    };
  }, [refreshAvailability]);

  const downloadLanguage = async () => {
    if (!consentToDownload || installing) return;
    setInstalling(true);
    setMessage("");
    try {
      const installed = await installLocalGermanModel(consentToDownload);
      setMessage(installed
        ? "أفاد المتصفح باكتمال التثبيت؛ أعد الفحص قبل التجربة."
        : "لم يؤكد المتصفح اكتمال التثبيت؛ أعد الفحص أو استخدم التدريب النصي.");
    } catch {
      setMessage("تعذّر تنزيل الحزمة أو رفضه المتصفح. لم يُرسل صوت أو نص ولم يُجرّب مسار سحابي.");
    } finally {
      setInstalling(false);
      await refreshAvailability();
    }
  };

  const startListening = () => {
    if (availability !== "available" || listening) return;
    setTranscript("");
    setMessage("");
    receivedRef.current = false;
    failedRef.current = false;
    setListening(true);
    stopRef.current = startLocalGermanRecognition(
      (text) => {
        receivedRef.current = true;
        setTranscript(text);
        setMessage("هذا نصٌّ تعرّف عليه المتصفح للمراجعة الذاتية فقط؛ ليس تقييماً للنطق ولا يُحفظ كتقدّم.");
      },
      (error) => {
        failedRef.current = true;
        setMessage(`تعذّر التحقق تقنياً (${error}). لم يُحكم على كلامك ولم تُسجّل نتيجة لغوية.`);
        setListening(false);
      },
      () => {
        setListening(false);
        stopRef.current = null;
        if (!receivedRef.current && !failedRef.current) {
          setMessage("لم يصل نصٌّ يمكن عرضه؛ تعذّر التحقق، وهذا ليس حكماً على النطق.");
        }
      },
    );
  };

  const stopListening = () => {
    stopRef.current?.();
    stopRef.current = null;
    setListening(false);
  };

  return (
    <section data-testid="local-asr-pilot" style={{ display: "grid", gap: "0.65rem", marginTop: "0.8rem" }}>
      <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        تجربة منفصلة للتعرّف على الكلام الألماني <code>de-DE</code> محلياً في المتصفحات التي تدعم ذلك.
        لا تدخل في دروس اليوم أو الدرجات أو دفتر الأخطاء. لا يُرسل هذا المسار الصوت أو النص للتعرّف، ولا ينتقل تلقائياً إلى خدمة سحابية.
      </p>

      <div data-testid="local-asr-state" role="status" aria-live="polite" style={{ fontSize: "0.88rem", fontWeight: 700 }}>
        {availabilityText(availability)}
      </div>

      <button type="button" className="btn btn-ghost" data-testid="local-asr-refresh" onClick={() => void refreshAvailability()} disabled={installing || listening} style={{ minHeight: "44px" }}>
        ↻ فحص إتاحة de-DE المحلية
      </button>

      {availability === "downloadable" && (
        <div className="card" style={{ padding: "0.65rem 0.8rem", display: "grid", gap: "0.55rem" }}>
          <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.8 }}>
            يحتاج المتصفح إلى تنزيل موارد لغوية إلى هذا الجهاز. قد يستهلك التنزيل بيانات الشبكة ومساحة التخزين؛ لا يبدأ تلقائياً، وموافقة السحابة لا تشمل هذا التنزيل.
          </p>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", minHeight: "44px", cursor: "pointer" }}>
            <input
              type="checkbox"
              data-testid="local-asr-download-consent"
              checked={consentToDownload}
              onChange={(event) => setConsentToDownload(event.target.checked)}
              style={{ width: "20px", height: "20px", marginTop: "0.15rem" }}
            />
            <span style={{ fontSize: "0.84rem" }}>أوافق على طلب تنزيل موارد de-DE إلى هذا الجهاز من المتصفح.</span>
          </label>
          <button
            type="button"
            className="btn btn-primary"
            data-testid="local-asr-install"
            disabled={!consentToDownload || installing}
            onClick={() => void downloadLanguage()}
            style={{ minHeight: "44px" }}
          >
            {installing ? "⏳ جارٍ طلب التنزيل…" : "⬇️ تنزيل حزمة de-DE بموافقتي"}
          </button>
        </div>
      )}

      {availability === "downloading" && (
        <p style={{ margin: 0, fontSize: "0.82rem" }}>لم يبدأ التطبيق هذا التنزيل؛ يعرض فقط أن المتصفح أفاد بأنه جارٍ. أعد الفحص بعد انتهائه.</p>
      )}

      {availability === "available" && (
        <button
          type="button"
          className={listening ? "btn btn-ghost" : "btn btn-primary"}
          data-testid={listening ? "local-asr-stop" : "local-asr-start"}
          onClick={listening ? stopListening : startListening}
          style={{ minHeight: "48px" }}
        >
          {listening ? "■ إيقاف التجربة المحلية" : "🎙️ ابدأ تجربة التعرّف المحلي"}
        </button>
      )}

      {transcript && (
        <div data-testid="local-asr-transcript" className="card" style={{ padding: "0.65rem 0.8rem", lineHeight: 1.9 }}>
          <strong>النص الذي أعاده المتصفح:</strong> {transcript}
        </div>
      )}
      {message && <div data-testid="local-asr-message" role="status" aria-live="polite" style={{ fontSize: "0.83rem", lineHeight: 1.8 }}>{message}</div>}
      <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--color-ink2)" }}>
        لا تُحفظ المحاولة أو النص، ولا يُمنح XP، ولا يثبت التعرّف سلامة النطق. عند غياب الدعم أو فشل الميكروفون تكون النتيجة «تعذّر التحقق»؛ يمكنك متابعة التدريب الكتابي.
      </p>
    </section>
  );
}
