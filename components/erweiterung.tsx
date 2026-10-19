"use client";
// 📚 R298: محطة توسعة B2 الاستقبالية — تعرّف على كلمات الحزم الجديدة وأدخلها في مراجعتك
import { useMemo, useState } from "react";
import { useProgress } from "@/lib/store";
import { erweiterungDecks, erweiterungFortschritt, erweiterungSitzung, erweiterungLuecken } from "@/lib/erweiterung";
import { logK } from "@/lib/kompetenz";
import { newCard, reviewCard } from "@/lib/srs";
import { De } from "@/components/De";

export function ErweiterungStation() {
  const { progress, update } = useProgress();
  const decks = useMemo(() => erweiterungDecks(), []);
  const [deckId, setDeckId] = useState<string | null>(null);
  const [samen, setSamen] = useState(1);
  const [nr, setNr] = useState(0);
  const [wahl, setWahl] = useState<string | null>(null);
  const [punkte, setPunkte] = useState(0);
  const [modus, setModus] = useState<"erkennen" | "luecke">("erkennen");
  const [lNr, setLNr] = useState(0);
  const [lWahl, setLWahl] = useState<string | null>(null);
  const [lPunkte, setLPunkte] = useState(0);
  const luecken = useMemo(
    () => (deckId ? erweiterungLuecken(deckId, progress, progress.plan.day * 31 + samen * 7) : []),
    [deckId, samen, progress]
  );
  const luecke = luecken[lNr] ?? null;
  const lFertig = deckId !== null && modus === "luecke" && lNr >= luecken.length && luecken.length > 0;
  const sitzung = useMemo(
    () => (deckId ? erweiterungSitzung(deckId, progress, progress.plan.day * 31 + samen * 7) : []),
    [deckId, samen, progress]
  );
  const fortschritt = erweiterungFortschritt(progress);
  const frage = sitzung[nr] ?? null;
  const fertig = deckId !== null && nr >= sitzung.length && sitzung.length > 0;

  const waehle = (opt: string) => {
    if (!frage || wahl) return;
    setWahl(opt);
    const ok = opt === frage.richtig;
    if (ok) setPunkte((x) => x + 1);
    update((p) => ({
      ...p,
      srs: { ...p.srs, [frage.karte.id]: reviewCard(p.srs[frage.karte.id] ?? newCard(), ok ? 4 : 0) },
    }));
  };

  const waehleL = (opt: string) => {
    if (!luecke || lWahl) return;
    setLWahl(opt);
    const ok = opt === luecke.richtig;
    if (ok) setLPunkte((x) => x + 1);
    update((p) => {
      const mitSrs = { ...p, srs: { ...p.srs, [luecke.karte.id]: reviewCard(p.srs[luecke.karte.id] ?? newCard(), ok ? 4 : 0) } };
      return logK(mitSrs, "Wortschatz", ok);
    });
  };

  return (
    <section className="card" data-testid="erweiterung-station" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem" }}>
      <strong>📚 توسعة B2 الاستقبالية (912 كلمة جديدة في 16 حزمة موضوعية)</strong>
      <div style={{ fontSize: "0.84rem", color: "var(--color-ink2)", lineHeight: 1.9 }}>
        أغلقنا فجوة الكلمات التي كانت معلنة: اختر حزمة وتعرّف على كلماتها. كل إجابة صحيحة تُدخل الكلمة
        في مراجعتك المتباعدة كمعرفة استقبالية (تقرأها فتفهمها). الإتقان الإنتاجي يبقى من بطاقات الخطة ومحطات الإنتاج.
        أُدخلت حتى الآن <strong className="rtl-num">{fortschritt.eingefuehrt}</strong> من <strong className="rtl-num">{fortschritt.gesamt}</strong> كلمة.
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {decks.map((d) => (
          <button key={d.id} type="button" className="chip" data-testid={`erweiterung-deck-${d.id}`}
            onClick={() => { setDeckId(d.id); setNr(0); setWahl(null); setPunkte(0); setLNr(0); setLWahl(null); setLPunkte(0); }}
            style={{ cursor: "pointer", minHeight: "44px", background: deckId === d.id ? "var(--color-gold)" : undefined, color: deckId === d.id ? "var(--ui-on-accent)" : undefined }}>
            {d.titleAr} (<span className="rtl-num">{d.anzahl}</span>)
          </button>
        ))}
      </div>

      {modus === "erkennen" && frage && (
        <div style={{ display: "grid", gap: "0.5rem" }} data-testid="erweiterung-frage">
          <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
            كلمة <span className="rtl-num">{nr + 1}</span> من <span className="rtl-num">{sitzung.length}</span> · نتيجتك: <span className="rtl-num">{punkte}</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", flexWrap: "wrap" }}>
            <De style={{ fontSize: "1.35rem", fontWeight: 800 }}>{frage.karte.de}</De>
            {frage.karte.plural && <span style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>الجمع: <De>{frage.karte.plural}</De></span>}
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {frage.optionen.map((opt) => {
              const istRichtig = wahl !== null && opt === frage.richtig;
              const istFalsch = wahl === opt && opt !== frage.richtig;
              return (
                <button key={opt} type="button" className="btn btn-ghost" data-testid={`erweiterung-opt-${opt}`}
                  onClick={() => waehle(opt)} disabled={wahl !== null}
                  style={{ minHeight: "48px", textAlign: "start", background: istRichtig ? "var(--color-mint, #d1fae5)" : istFalsch ? "var(--color-blush, #fee2e2)" : undefined }}>
                  {opt} {istRichtig ? "✓" : istFalsch ? "✗" : ""}
                </button>
              );
            })}
          </div>
          {wahl && (
            <div style={{ fontSize: "0.85rem", lineHeight: 1.9 }}>
              <De style={{ fontWeight: 700 }}>{frage.karte.exampleDe}</De> — {frage.karte.exampleAr}
              <div>
                <button type="button" className="btn btn-primary" data-testid="erweiterung-weiter" style={{ minHeight: "44px", marginTop: "0.3rem" }}
                  onClick={() => { setNr((x) => x + 1); setWahl(null); }}>
                  {nr + 1 >= sitzung.length ? "إنهاء الجلسة" : "التالي ⬅"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {deckId && (
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          <button type="button" className="chip" data-testid="erweiterung-modus-erkennen" style={{ cursor: "pointer", minHeight: "44px", background: modus === "erkennen" ? "var(--color-gold)" : undefined, color: modus === "erkennen" ? "var(--ui-on-accent)" : undefined }}
            onClick={() => setModus("erkennen")}>👀 تعرّف (اختر المعنى)</button>
          <button type="button" className="chip" data-testid="erweiterung-modus-luecke" style={{ cursor: "pointer", minHeight: "44px", background: modus === "luecke" ? "var(--color-gold)" : undefined, color: modus === "luecke" ? "var(--ui-on-accent)" : undefined }}
            onClick={() => setModus("luecke")}>✍️ إنتاج (أكمل الجملة)</button>
        </div>
      )}

      {modus === "luecke" && luecke && (
        <div style={{ display: "grid", gap: "0.5rem" }} data-testid="erweiterung-luecke-frage">
          <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
            جملة <span className="rtl-num">{lNr + 1}</span> من <span className="rtl-num">{luecken.length}</span> · نتيجتك: <span className="rtl-num">{lPunkte}</span> — أكمل الكلمة الناقصة من الجملة نفسها
          </div>
          <De style={{ fontSize: "1.15rem", lineHeight: 2 }}>{luecke.vorher}<strong style={{ color: "var(--color-gold-deep, #b8860b)" }}> _____ </strong>{luecke.nachher}</De>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {luecke.optionen.map((opt) => {
              const istRichtig = lWahl !== null && opt === luecke.richtig;
              const istFalsch = lWahl === opt && opt !== luecke.richtig;
              return (
                <button key={opt} type="button" className="btn btn-ghost" data-testid={`erweiterung-luecke-opt-${opt}`}
                  onClick={() => waehleL(opt)} disabled={lWahl !== null}
                  style={{ minHeight: "48px", textAlign: "start", background: istRichtig ? "var(--color-mint, #d1fae5)" : istFalsch ? "var(--color-blush, #fee2e2)" : undefined }}>
                  <De>{opt}</De> {istRichtig ? "✓" : istFalsch ? "✗" : ""}
                </button>
              );
            })}
          </div>
          {lWahl && (
            <div style={{ fontSize: "0.85rem", lineHeight: 1.9 }}>
              <De style={{ fontWeight: 700 }}>{luecke.karte.de}</De> = {luecke.karte.ar}
              <div style={{ color: "var(--color-ink2)" }}>{luecke.karte.exampleAr}</div>
              <div>
                <button type="button" className="btn btn-primary" data-testid="erweiterung-luecke-weiter" style={{ minHeight: "44px", marginTop: "0.3rem" }}
                  onClick={() => { setLNr((x) => x + 1); setLWahl(null); }}>
                  {lNr + 1 >= luecken.length ? "إنهاء الجولة" : "التالي ⬅"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {modus === "luecke" && deckId && !luecke && !lFertig && (
        <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>لا جمل قابلة للإكمال في هذه الحزمة بعد — جرّب وضع التعرّف أو حزمة أخرى.</div>
      )}

      {lFertig && (
        <div data-testid="erweiterung-luecke-fertig" style={{ display: "grid", gap: "0.4rem" }}>
          <div>🏁 انتهت جولة الإنتاج: <strong className="rtl-num">{lPunkte}</strong> من <strong className="rtl-num">{luecken.length}</strong> كلمات في جملها الحقيقية.</div>
          <button type="button" className="btn" data-testid="erweiterung-luecke-nochmal" style={{ minHeight: "44px", justifySelf: "start" }}
            onClick={() => { setSamen((s) => s + 1); setLNr(0); setLWahl(null); setLPunkte(0); }}>
            🔀 جولة إنتاج أخرى
          </button>
        </div>
      )}

      {modus === "erkennen" && fertig && (
        <div data-testid="erweiterung-fertig" style={{ display: "grid", gap: "0.4rem" }}>
          <div>🏁 انتهت الجلسة: <strong className="rtl-num">{punkte}</strong> من <strong className="rtl-num">{sitzung.length}</strong> صحيحة. الكلمات التي عرفتها دخلت مراجعتك المتباعدة.</div>
          <button type="button" className="btn" data-testid="erweiterung-nochmal" style={{ minHeight: "44px", justifySelf: "start" }}
            onClick={() => { setSamen((s) => s + 1); setNr(0); setWahl(null); setPunkte(0); }}>
            🔀 جلسة أخرى من الحزمة نفسها
          </button>
        </div>
      )}
    </section>
  );
}
