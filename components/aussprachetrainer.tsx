"use client";
// 🎙️ مدرّب النطق: سجّل الجملة → تحليلٌ داخل جهازك → إيقاعٌ ووقفاتٌ ومقاطع
// الصوت لا يغادر الجهاز: لا رفع، لا خادوم، لا تعرّف سحابيّ.
import { useRef, useState } from "react";
import { De } from "@/components/De";
import { analysiere, bewerteAussprache, zielDauer, silbenImText, type Analyse, type Bewertung, type Level } from "@/lib/aussprache";

export default function AusspracheTrainer({ satz, ar, level = "A1" }: { satz: string; ar?: string; level?: Level }) {
  const [status, setStatus] = useState<"bereit" | "laeuft" | "fertig" | "kein-mikro">("bereit");
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [urteil, setUrteil] = useState<Bewertung | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recRef = useRef<MediaRecorder | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) => chunks.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: rec.mimeType });
        const buf = await blob.arrayBuffer();
        const Ctx = (window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
        const ctx = new Ctx();
        const audio = await ctx.decodeAudioData(buf);
        const a = analysiere(audio.getChannelData(0), audio.sampleRate);
        setAnalyse(a);
        setUrteil(bewerteAussprache(a, satz, level));
        setStatus("fertig");
        void ctx.close();
      };
      rec.start();
      setStatus("laeuft");
    } catch {
      setStatus("kein-mikro");
    }
  };
  const stop = () => recRef.current?.stop();

  const ziel = zielDauer(satz, level);

  return (
    <section className="card" data-test="aussprache" style={{ padding: "1rem 1.2rem", display: "grid", gap: "0.6rem" }}>
      <h3 style={{ margin: 0 }}>🎙️ مدرّب النطق — الإيقاع والطلاقة</h3>
      <div className="card" style={{ padding: "0.6rem 0.8rem", background: "var(--color-paper2)" }}>
        <De style={{ fontWeight: 800, fontSize: "1.02rem" }}>{satz}</De>
        {ar && <div style={{ fontSize: "0.86rem", color: "var(--color-ink2)" }}>{ar}</div>}
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>
          المقاطع المتوقّعة: {silbenImText(satz)} · زمن النموذج ≈ {ziel} ثانية
        </div>
      </div>

      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        <strong>صوتك لا يغادر جهازك</strong> — التحليل يجري في المتصفّح. هذه المرحلة تقيس <strong>الإيقاع والوقفات والمقاطع</strong>، ولا تحكم بعدُ على الأصوات المفردة (ü / ch).
      </p>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {status !== "laeuft" && <button className="btn btn-primary" onClick={start}>🔴 سجّل</button>}
        {status === "laeuft" && <button className="btn" onClick={stop}>⏹️ أوقف وحلّل</button>}
      </div>

      {status === "kein-mikro" && (
        <div className="card" style={{ padding: "0.6rem", background: "#fef3c7", fontSize: "0.86rem" }}>
          تعذّر الوصول إلى الميكروفون. المسار البديل: اقرأ الجملة بصوتٍ عالٍ ثلاث مرّات وقارنها بالنموذج المسموع —
          <strong> لكنّ هذه القراءة لا تُحتسَب في الدرجة</strong> لأنّها غير مقيسة.
        </div>
      )}

      {analyse && urteil && (
        <div className="card" data-test="aussprache-ergebnis" style={{ padding: "0.7rem 0.9rem", background: urteil.band === "mit_muehe" ? "#fef3c7" : "#dcfce7" }}>
          <div style={{ fontWeight: 900 }}>{urteil.bandAr} — {urteil.punkte}/100</div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
            مدّتك {analyse.dauerS}s مقابل {ziel}s · مقاطع {analyse.silben}/{silbenImText(satz)} · وقفات {analyse.pausen} · نسبة الكلام {Math.round(analyse.sprechAnteil * 100)}٪
          </div>
          <ul style={{ margin: "0.35rem 1rem", fontSize: "0.86rem" }}>
            {urteil.hinweise.map((h, i) => (
              <li key={i}><strong>{h.kurz}</strong> — {h.tatAr}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
