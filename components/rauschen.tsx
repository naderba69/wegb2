"use client";
// 🔊 A32 (R292): ضجيج خلفية مولّد محليًا (WebAudio) — تدريب استماع أصعب بلا ملفات
import { useEffect, useRef, useState } from "react";
import { RAUSCH_VORLAGEN, rauschenPuffer } from "@/lib/rauschen";

export function RauschSteuerung() {
  const [an, setAn] = useState(false);
  const [vorlageId, setVorlageId] = useState(RAUSCH_VORLAGEN[0].id);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const verfuegbar = typeof window !== "undefined" && (typeof window.AudioContext !== "undefined" || typeof (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext !== "undefined");

  const stopp = () => {
    try { void ctxRef.current?.close(); } catch { /* bereits zu */ }
    ctxRef.current = null;
    gainRef.current = null;
  };

  const start = () => {
    if (!verfuegbar) return;
    stopp();
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const daten = rauschenPuffer(42, 2, ctx.sampleRate);
    const puffer = ctx.createBuffer(1, daten.length, ctx.sampleRate);
    puffer.copyToChannel(daten as Float32Array<ArrayBuffer>, 0);
    const quelle = ctx.createBufferSource();
    quelle.buffer = puffer;
    quelle.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = RAUSCH_VORLAGEN.find((v) => v.id === vorlageId)?.gain ?? 0.05;
    quelle.connect(gain).connect(ctx.destination);
    quelle.start();
    ctxRef.current = ctx;
    gainRef.current = gain;
  };

  useEffect(() => () => stopp(), []);
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = RAUSCH_VORLAGEN.find((v) => v.id === vorlageId)?.gain ?? 0.05;
  }, [vorlageId]);

  if (!verfuegbar) {
    return <span className="small" data-testid="rauschen-aus">🔇 متصفحك لا يدعم توليد الصوت — ضجيج التدريب غير متاح هنا.</span>;
  }
  return (
    <span style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
      <button
        type="button"
        className="btn btn-ghost"
        data-testid="rauschen-toggle"
        onClick={() => { if (an) { stopp(); setAn(false); } else { start(); setAn(true); } }}
      >
        {an ? "🔊 الضجيج يعمل — أوقفه" : "🔉 شغّل ضجيجًا مولّدًا"}
      </button>
      <label className="small">
        المحيط:{" "}
        <select data-testid="rauschen-vorlage" value={vorlageId} onChange={(e) => setVorlageId(e.target.value)}>
          {RAUSCH_VORLAGEN.map((v) => (
            <option key={v.id} value={v.id}>{v.nameAr}</option>
          ))}
        </select>
      </label>
    </span>
  );
}
