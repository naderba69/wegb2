"use client";
// 🎙️ مدرّب النطق: اسمع النموذج → سجّل محلياً → استمع إلى نفسك → حلّل الإيقاع.
// الصوت يبقى في الجهاز؛ هذا التحليل لا يزعم قياس مخارج ü/ch أو صحة كل فونيم.
import { useEffect, useRef, useState } from "react";
import { De } from "@/components/De";
import { analysiere, bewerteAussprache, zielDauer, silbenImText, type Analyse, type Bewertung, type Level } from "@/lib/aussprache";
import { speakDe, speechAvailable, stopSpeech } from "@/lib/speech";

export type AusspracheAbschluss = { measured: boolean; score: number | null };

export default function AusspracheTrainer({
  satz,
  ar,
  level = "A1",
  voiceName,
  rate,
  onPracticeComplete,
}: {
  satz: string;
  ar?: string;
  level?: Level;
  voiceName?: string;
  rate?: number;
  onPracticeComplete?: (result: AusspracheAbschluss) => void;
}) {
  const [status, setStatus] = useState<"bereit" | "laeuft" | "fertig" | "kein-mikro" | "analyse-fehler" | "ohne-messung">("bereit");
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [urteil, setUrteil] = useState<Bewertung | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const chunks = useRef<Blob[]>([]);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingUrlRef = useRef<string | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopSpeech();
      const rec = recRef.current;
      if (rec && rec.state !== "inactive") {
        try { rec.stop(); } catch { /* انتهى التسجيل بالفعل */ }
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
      recordingUrlRef.current = null;
    };
  }, []);

  const clearRecording = () => {
    if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
    recordingUrlRef.current = null;
    setRecordingUrl(null);
  };

  const start = async () => {
    setAnalyse(null);
    setUrteil(null);
    setMessage("");
    clearRecording();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("kein-mikro");
      setMessage("هذا المتصفح لا يوفّر التسجيل المحلي المطلوب. استمع إلى النموذج وكرّر الجملة؛ لا يُصدر التطبيق حكماً على النطق.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunks.current = [];
      rec.ondataavailable = (event) => {
        if (event.data?.size) chunks.current.push(event.data);
      };
      rec.onstop = async () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        // A late MediaRecorder stop event must not allocate a blob URL after unmount.
        if (!mountedRef.current) return;
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        if (!blob.size) {
          if (mountedRef.current) {
            setStatus("analyse-fehler");
            setMessage("لم يلتقط التسجيل صوتاً قابلاً للتشغيل؛ لم نحتسبه خطأً لغوياً.");
            onPracticeComplete?.({ measured: false, score: null });
          }
          return;
        }

        const url = URL.createObjectURL(blob);
        if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
        recordingUrlRef.current = url;
        if (mountedRef.current) setRecordingUrl(url);

        let ctx: AudioContext | null = null;
        try {
          const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!Ctx) throw new Error("audio-context-unavailable");
          ctx = new Ctx();
          const audio = await ctx.decodeAudioData(await blob.arrayBuffer());
          const measured = analysiere(audio.getChannelData(0), audio.sampleRate);
          const result = bewerteAussprache(measured, satz, level);
          if (mountedRef.current) {
            setAnalyse(measured);
            setUrteil(result);
            setStatus("fertig");
            onPracticeComplete?.({ measured: true, score: result.punkte });
          }
        } catch {
          if (mountedRef.current) {
            setStatus("analyse-fehler");
            setMessage("حُفظ تسجيلك محلياً ويمكنك الاستماع إليه، لكن تعذّر تحليل صيغته. لا يُعدّ ذلك حكماً على نطقك.");
            onPracticeComplete?.({ measured: false, score: null });
          }
        } finally {
          if (ctx && ctx.state !== "closed") {
            try { await ctx.close(); } catch { /* إغلاق الصوت لا يغيّر نتيجة التدريب */ }
          }
        }
      };
      rec.start();
      setStatus("laeuft");
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (mountedRef.current) {
        setStatus("kein-mikro");
        setMessage("تعذّر فتح الميكروفون. بإمكانك متابعة الترديد دون تسجيل؛ لن نصدر حكماً على نطقك.");
      }
    }
  };

  const stop = () => {
    const rec = recRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
  };

  const markUnmeasuredPractice = () => {
    setStatus("ohne-messung");
    setMessage("سُجّل إنجاز الترديد فقط؛ لا توجد درجة أو دعوى بقياس صحة النطق.");
    onPracticeComplete?.({ measured: false, score: null });
  };

  const ziel = zielDauer(satz, level);
  const canPlayModel = speechAvailable();

  return (
    <section className="card" data-test="aussprache" style={{ padding: "1rem 1.2rem", display: "grid", gap: "0.6rem" }}>
      <h3 style={{ margin: 0 }}>🎙️ مدرّب النطق — اسمع، كرّر، ثم راجع تسجيلك</h3>
      <div className="card" style={{ padding: "0.5rem 0.75rem", background: "var(--color-warn-soft, #fff7ed)", border: "1px dashed var(--color-warn, #f59e0b)", fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        ⚠️ التدريب اختياري ولا يغيّر درجة الامتحان أو فتح المراحل. التحليل يقدّر الإيقاع والوقفات والمقاطع فقط؛ لا يقيس بعدُ مخارج الأصوات المفردة (ü / ch) ولا يثبت صحة كل فونيم.
      </div>
      <div className="card" style={{ padding: "0.6rem 0.8rem", background: "var(--color-paper2)" }}>
        <De style={{ fontWeight: 800, fontSize: "1.02rem" }}>{satz}</De>
        {ar && <div style={{ fontSize: "0.86rem", color: "var(--color-ink2)" }}>{ar}</div>}
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
          المقاطع المتوقّعة: {silbenImText(satz)} · زمن النموذج التقريبي: {ziel} ثانية
        </div>
      </div>

      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        <strong>صوتك لا يغادر جهازك.</strong> المثال التالي نطقٌ اصطناعي من متصفحك، وقد تختلف جودته باختلاف الجهاز. تسجيلك لا يُرفع ولا يُحفَظ كتقدّم.
      </p>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-ghost" data-testid="aussprache-model" disabled={!canPlayModel} onClick={() => speakDe(satz, { voiceName, rate: rate ?? 0.9 })}>
          🔊 اسمع النموذج
        </button>
        {status !== "laeuft" && <button type="button" className="btn btn-primary" data-testid="aussprache-record" onClick={start}>🔴 سجّل محلياً</button>}
        {status === "laeuft" && <button type="button" className="btn" data-testid="aussprache-stop" onClick={stop}>⏹️ أوقف التسجيل وحلّل</button>}
      </div>

      {recordingUrl && (
        <div className="card" data-testid="aussprache-playback" style={{ padding: "0.65rem 0.8rem" }}>
          <strong style={{ display: "block", marginBottom: "0.35rem" }}>استمع إلى تسجيلك وقارنه بالنموذج</strong>
          <audio controls preload="metadata" src={recordingUrl} aria-label="تشغيل تسجيل النطق المحلي" style={{ width: "100%" }} />
          <small>ملف مؤقت داخل هذه الجلسة؛ يُزال عند مغادرة البطاقة أو إعادة التسجيل.</small>
        </div>
      )}

      {status === "kein-mikro" && (
        <div className="card" style={{ padding: "0.6rem", background: "var(--color-amber-soft)", fontSize: "0.86rem" }}>
          {message || "تعذّر الوصول إلى الميكروفون."} القراءة بصوت عالٍ تبقى تدريباً مفيداً، لكنها ليست قياساً.
        </div>
      )}
      {status === "analyse-fehler" && message && (
        <div className="card" role="status" style={{ padding: "0.6rem", background: "var(--color-amber-soft)", fontSize: "0.86rem" }}>{message}</div>
      )}
      {status === "ohne-messung" && message && (
        <div className="card" role="status" style={{ padding: "0.6rem", background: "var(--color-paper2)", fontSize: "0.86rem" }}>{message}</div>
      )}

      {(status === "kein-mikro" || status === "analyse-fehler" || status === "bereit") && (
        <button type="button" className="btn btn-ghost" data-testid="aussprache-self-attest" onClick={markUnmeasuredPractice}>
          ✅ كرّرت الجملة بصوت عالٍ دون قياس
        </button>
      )}

      {analyse && urteil && (
        <div className="card" data-test="aussprache-ergebnis" style={{ padding: "0.7rem 0.9rem", background: urteil.band === "mit_muehe" ? "var(--ui-gold-soft)" : "var(--ui-green-soft)", borderColor: urteil.band === "mit_muehe" ? "var(--ui-gold)" : "var(--ui-green)" }}>
          <div style={{ fontWeight: 900 }}>{urteil.bandAr} — {urteil.punkte}/100 <span style={{ fontWeight: 500 }}>تقدير إيقاع، لا درجة فونيمات</span></div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
            مدّتك {analyse.dauerS}s مقابل {ziel}s · مقاطع {analyse.silben}/{silbenImText(satz)} · وقفات {analyse.pausen} · نسبة الكلام {Math.round(analyse.sprechAnteil * 100)}٪
          </div>
          <ul style={{ margin: "0.35rem 1rem", fontSize: "0.86rem" }}>
            {urteil.hinweise.map((hint, index) => (
              <li key={index}><strong>{hint.kurz}</strong> — {hint.tatAr}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
