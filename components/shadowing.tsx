"use client";
/**
 * 🎙️ M4/R184 — محطة التظليل: اسمع النموذج، ردّد مسجّلًا محليًا، وقارن
 * الموجة والزمن. مقارنة إيقاع وتوقيت فقط — لا حكم على النطق إطلاقًا.
 * لا رفع شبكي؛ التسجيل Blob محلي يعيش في الجلسة، وتنزيله بيد المتعلّم.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  schattenEinheiten, vergleicheSchatten, type SchattenEinheit, type SchattenVergleich,
} from "@/lib/shadowing";
import type { Level } from "@/lib/types";

function WellenCanvas({ kurve, farbe }: { kurve: number[]; farbe: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const w = cv.width; const h = cv.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = farbe;
    const balken = Math.max(1, Math.floor(w / kurve.length));
    kurve.forEach((v, i) => {
      const bh = Math.max(1, v * (h - 4));
      ctx.fillRect(i * balken, (h - bh) / 2, Math.max(1, balken - 1), bh);
    });
  }, [kurve, farbe]);
  return <canvas ref={ref} width={560} height={64} style={{ width: "100%", height: "64px", background: "var(--color-card2, #f6f1e7)", borderRadius: "8px" }} aria-hidden="true" />;
}

export function ShadowingStation() {
  const einheiten = useMemo(() => schattenEinheiten(), []);
  const [stufe, setStufe] = useState<Level | "alle">("alle");
  const sichtbar = einheiten.filter((e) => stufe === "alle" || e.level === stufe);
  const [einheit, setEinheit] = useState<SchattenEinheit | null>(null);
  const [status, setStatus] = useState<"bereit" | "laeuft" | "fertig" | "fehler">("bereit");
  const [meldung, setMeldung] = useState("");
  const [vergleich, setVergleich] = useState<SchattenVergleich | null>(null);
  const [aufnahmeUrl, setAufnahmeUrl] = useState<string | null>(null);
  const [zeigeText, setZeigeText] = useState(false);
  const chunks = useRef<Blob[]>([]);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recRef.current && recRef.current.state !== "inactive") { try { recRef.current.stop(); } catch { /* durch */ } }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const waehle = (e: SchattenEinheit) => {
    setEinheit(e);
    setVergleich(null);
    setStatus("bereit");
    setMeldung("");
    setZeigeText(false);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setAufnahmeUrl(null);
  };

  const start = async () => {
    if (!einheit) return;
    setVergleich(null);
    setMeldung("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("fehler");
      setMeldung("متصفحك لا يوفّر التسجيل المحلي. يمكنك الاستماع والترديد بصوتك دون قياس — ولن نصدر أيّ حكم على نطقك.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { stream.getTracks().forEach((t) => t.stop()); return; }
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunks.current = [];
      rec.ondataavailable = (ev) => { if (ev.data?.size) chunks.current.push(ev.data); };
      rec.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (!mounted.current || !einheit) return;
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        if (!blob.size) {
          setStatus("fehler");
          setMeldung("لم يُلتقط صوت قابل للتشغيل — لم يُحتسب ذلك خطأً لغويًا.");
          return;
        }
        const url = URL.createObjectURL(blob);
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;
        setAufnahmeUrl(url);
        let ctx: AudioContext | null = null;
        try {
          const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!Ctx) throw new Error("kein-context");
          ctx = new Ctx();
          const [origBuf, aufnBuf] = await Promise.all([
            fetch(einheit.audioSrc).then((r) => r.arrayBuffer()).then((b) => ctx!.decodeAudioData(b)),
            ctx.decodeAudioData(await blob.arrayBuffer()),
          ]);
          if (!mounted.current) return;
          setVergleich(vergleicheSchatten(
            origBuf.getChannelData(0), origBuf.sampleRate,
            aufnBuf.getChannelData(0), aufnBuf.sampleRate,
          ));
          setStatus("fertig");
        } catch {
          if (!mounted.current) return;
          setStatus("fehler");
          setMeldung("حُفظ تسجيلك محليًا ويمكنك سماعه، لكن تعذّرت المقارنة الموجية لصيغته — ليست هذه ملاحظة على أدائك.");
        } finally {
          if (ctx && ctx.state !== "closed") { try { await ctx.close(); } catch { /* durch */ } }
        }
      };
      rec.start();
      setStatus("laeuft");
    } catch {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (mounted.current) {
        setStatus("fehler");
        setMeldung("تعذّر فتح الميكروفون. تابع الاستماع والترديد دون تسجيل إن شئت.");
      }
    }
  };

  const stop = () => { if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop(); };

  return (
    <div style={{ display: "grid", gap: "0.9rem" }} data-testid="shadowing">
      <p style={{ margin: 0, lineHeight: 2 }}>
        التظليل: اسمع النموذج وردّد معه بصوتك في اللحظة نفسها تقريبًا، ثم قارن موجتك بموجته زمنيًا.
        <strong> هذه مقارنة إيقاع وتوقيت وموجة صوتية فقط — ليست حكمًا على مخارج الحروف ولا على صحة نطقك.</strong>
      </p>
      <p className="tiny muted" style={{ margin: 0 }}>
        🔒 لا يُرفع أيّ صوت إلى الشبكة، ولا يُخزَّن تسجيلك في التطبيق؛ يعيش في جلستك فقط، وزرّ التنزيل يجعله ملفًا بيدك وحدك.
      </p>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {(["alle", "A2", "B1", "B2"] as const).map((l) => (
          <button key={l} type="button" className="btn" onClick={() => setStufe(l)} aria-pressed={stufe === l} style={{ minHeight: "40px" }}>
            {l === "alle" ? "كل المستويات" : l}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: "0.4rem", maxHeight: "220px", overflowY: "auto" }}>
        {sichtbar.map((e) => (
          <button
            key={e.id}
            type="button"
            className="btn"
            onClick={() => waehle(e)}
            aria-pressed={einheit?.id === e.id}
            style={{ minHeight: "44px", textAlign: "start" }}
          >
            {e.level} · <span dir="ltr">{e.titelDe}</span> — {e.titelAr} {e.ki ? "· 🔊 صوت KI موسوم" : "· صوت الدار"}
          </button>
        ))}
      </div>
      {einheit && (
        <section style={{ display: "grid", gap: "0.7rem", borderTop: "1px solid var(--color-line, #ddd)", paddingTop: "0.8rem" }}>
          <div style={{ fontWeight: 800 }}>
            <span dir="ltr">{einheit.titelDe}</span> ({einheit.level})
            {einheit.ki && <span className="tiny muted"> · النموذج بصوت مولّد آليًا (KI) كما هو موسوم في بنك الاستماع</span>}
          </div>
          <audio controls src={einheit.audioSrc} style={{ width: "100%" }} preload="none" />
          <button type="button" className="btn" onClick={() => setZeigeText(!zeigeText)} style={{ minHeight: "40px", justifySelf: "start" }}>
            {zeigeText ? "إخفاء النص" : "إظهار نص النموذج"}
          </button>
          {zeigeText && <p dir="ltr" style={{ margin: 0, lineHeight: 1.9, textAlign: "left" }}>{einheit.textDe}</p>}
          {status !== "laeuft" ? (
            <button type="button" className="btn primary" onClick={start} style={{ minHeight: "48px", justifySelf: "start" }}>
              🎙️ سجّل تظليلك الآن
            </button>
          ) : (
            <button type="button" className="btn primary" onClick={stop} style={{ minHeight: "48px", justifySelf: "start" }}>
              ⏹️ أوقف وقارن
            </button>
          )}
          {meldung && <p className="tiny" role="status" style={{ margin: 0 }}>{meldung}</p>}
          {aufnahmeUrl && (
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <span className="tiny muted">تسجيلك (محلي):</span>
              <audio controls src={aufnahmeUrl} style={{ width: "100%" }} />
              <a href={aufnahmeUrl} download={`shadowing-${einheit.id}.webm`} className="tiny">
                ⬇️ نزّل تسجيلك إلى جهازك (يبقى بيدك)
              </a>
            </div>
          )}
          {vergleich && status === "fertig" && (
            <div style={{ display: "grid", gap: "0.6rem" }} data-testid="shadowing-vergleich">
              <div>
                <div className="tiny muted">موجة النموذج ({vergleich.dauerOriginalS} ث · {vergleich.pausenOriginal} وقفة)</div>
                <WellenCanvas kurve={vergleich.kurveOriginal} farbe="#8a6d3b" />
              </div>
              <div>
                <div className="tiny muted">موجة ترديدك ({vergleich.dauerAufnahmeS} ث · {vergleich.pausenAufnahme} وقفة)</div>
                <WellenCanvas kurve={vergleich.kurveAufnahme} farbe="#2e6f5e" />
              </div>
              <ul style={{ margin: 0, lineHeight: 2 }}>
                <li>نسبة المدّة: <strong>{vergleich.verhaeltnis}</strong>
                  {vergleich.verhaeltnis >= 0.85 && vergleich.verhaeltnis <= 1.15
                    ? " — قريب من إيقاع النموذج زمنيًا."
                    : vergleich.verhaeltnis < 0.85
                      ? " — أسرع من النموذج؛ جرّب إبطاء الترديد قليلًا وملاحقة الوقفات."
                      : " — أبطأ من النموذج؛ جرّب رفع الإيقاع تدريجيًا مع بقاء الوقفات في أماكنها."}
                </li>
                <li>تشابه مغلف الإيقاع بعد المحاذاة: <strong>{vergleich.rhythmusAehnlichkeit}</strong> (من −١ إلى ١؛ يقيس تطابق نمط الصعود والهبوت والسكوت زمنيًا، لا الأصوات نفسها).</li>
                <li>الوقفات: النموذج {vergleich.pausenOriginal} · ترديدك {vergleich.pausenAufnahme} — مكان الوقفة جزء من الإيقاع، وعددها مؤشر تقريبي لا درجة.</li>
              </ul>
              <p className="tiny muted" style={{ margin: 0 }}>
                تذكير صريح: لا يقيس هذا نطق ü/ch/r ولا صحة أيّ صوت؛ راجع أذنك بتسجيلك، وحكّم معلّمًا بشريًا عند الحاجة الحقيقية للنطق.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
