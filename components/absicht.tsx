"use client";
// 🎯 A19 (R284): نية تنفيذ أسبوعية (متى/أين/ماذا) ومراجعة الأسبوع الماضي — محلية، من سجلّك
import { useState } from "react";
import { useProgress } from "@/lib/store";
import { absichtStatus, isoWoche } from "@/lib/absicht";

export function AbsichtKarte() {
  const { progress, update } = useProgress();
  const status = absichtStatus(progress);
  const [wann, setWann] = useState("");
  const [wo, setWo] = useState("");
  const [was, setWas] = useState("");
  const alt = progress.absicht;

  const speichern = () => {
    if (!wann.trim() || !wo.trim() || !was.trim()) return;
    update((p) => ({ ...p, absicht: { woche: isoWoche(new Date()), wann: wann.trim(), wo: wo.trim(), was: was.trim() } }));
  };
  const bewerten = (ok: boolean) => update((p) => (p.absicht ? { ...p, absicht: { ...p.absicht, erfuellt: ok } } : p));
  const erfuelltSetzen = (ok: boolean) => update((p) => (p.absicht ? { ...p, absicht: { ...p.absicht, erfuellt: ok } } : p));

  return (
    <section className="card" data-testid="absicht-karte" style={{ padding: "0.85rem 1rem", display: "grid", gap: "0.5rem" }}>
      <strong>🎯 نية تنفيذ هذا الأسبوع ({status.woche})</strong>
      {status.rueckblickOffen && alt && (
        <div style={{ fontSize: "0.88rem", background: "var(--color-paper)", borderRadius: 10, padding: "0.55rem 0.8rem" }}>
          📅 مراجعة أسبوع {alt.woche}: خطّطتَ «{alt.was}» — {alt.wann}، في {alt.wo}. هل نفّذتها؟
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
            <button className="btn btn-primary" data-testid="absicht-rueckblick-ja" onClick={() => bewerten(true)}>نعم نفّذتها ✅</button>
            <button className="btn btn-ghost" onClick={() => bewerten(false)}>لم تتحقق — بلا لوم، خطّط من جديد</button>
          </div>
        </div>
      )}
      {status.aktuelle ? (
        <div style={{ fontSize: "0.9rem" }}>
          <div>خطّتك: <strong>{status.aktuelle.was}</strong></div>
          <div style={{ color: "var(--color-ink2)" }}>متى: {status.aktuelle.wann} · أين: {status.aktuelle.wo}</div>
          {status.aktuelle.erfuellt === undefined ? (
            <button className="btn btn-primary" data-testid="absicht-erfuellt" style={{ marginTop: "0.4rem" }} onClick={() => erfuelltSetzen(true)}>نفّذتُ نيّتي هذا الأسبوع ✅</button>
          ) : (
            <div style={{ marginTop: "0.3rem" }}>{status.aktuelle.erfuellt ? "✅ سُجّلت منفّذة — أحسنت." : "سُجّلت غير منفّذة — الأسبوع القادم فرصة جديدة."}</div>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.4rem" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>النية المحددة تُنفَّذ أكثر من الأمنية العامة: «سأدرس X، في وقت Y، في مكان Z».</div>
          <input data-testid="absicht-was" value={was} onChange={(e) => setWas(e.target.value)} placeholder="ماذا؟ مثال: 20 بطاقة + إملاء واحد" style={{ minHeight: 40, borderRadius: 8, padding: "0.3rem 0.6rem" }} />
          <input data-testid="absicht-wann" value={wann} onChange={(e) => setWann(e.target.value)} placeholder="متى؟ مثال: بعد الفطور 7:30" style={{ minHeight: 40, borderRadius: 8, padding: "0.3rem 0.6rem" }} />
          <input data-testid="absicht-wo" value={wo} onChange={(e) => setWo(e.target.value)} placeholder="أين؟ مثال: مكتبي بالسماعات" style={{ minHeight: 40, borderRadius: 8, padding: "0.3rem 0.6rem" }} />
          <button className="btn btn-primary" data-testid="absicht-speichern" disabled={!wann.trim() || !wo.trim() || !was.trim()} onClick={speichern}>احفظ نية الأسبوع</button>
        </div>
      )}
    </section>
  );
}
