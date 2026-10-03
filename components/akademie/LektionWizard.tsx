"use client";
/**
 * 🎓 معالج الدرس الخمسي — الوجهة «الدرس» (P2):
 * خمّن ← قاعدة ← أمثلة ← تطبيق ← خلاصة.
 *
 * الميثاق: كل خطوة ≤ نصف شاشة · الأمام مقفل حتى تفاعلٍ حقيقيّ (والقفل يذكر
 * سببه) · ≤3 تمارين في التطبيق · الخلاصة تجمع الملخّص والفخاخ وشفرة الحفظ ·
 * موضعك محفوظ (البدء البارد يستأنف مهمّته) · وباب الرجوع الوحيد «اليوم».
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { grammarMap, getBrueckenFor, candoMap } from "@/lib/content";
import { entdeckungsFrage, induktionMoeglich, ergebnisText, type EntdeckungsErgebnis } from "@/lib/induktion";
import { speakAny } from "@/lib/speech";
import { De } from "@/components/De";
import ExerciseSet from "@/components/exercises";

/** الخطوات الخمس — الترتيب نفسه هو الميثاق (K108a) */
const SCHRITTE = ["خمّن", "قاعدة", "أمثلة", "تطبيق", "خلاصة"] as const;

export function LektionWizard({ topicId }: { topicId: string }) {
  const topic = grammarMap[topicId];
  const speicher = `weg-wizard-${topicId}`;
  const [schritt, setSchritt] = useState(0);
  const [erledigt, setErledigt] = useState<boolean[]>([false, false, false, false, false]);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [ergebnis, setErgebnis] = useState<EntdeckungsErgebnis | null>(null);
  const [geladen, setGeladen] = useState(false);

  // ⏳ البدء البارد يستأنف الموضع (الميثاق: لا يضيع مهمّة)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(speicher);
      if (raw) {
        const z = JSON.parse(raw) as { schritt?: number; erledigt?: boolean[] };
        if (typeof z.schritt === "number") setSchritt(Math.min(Math.max(z.schritt, 0), 4));
        if (Array.isArray(z.erledigt) && z.erledigt.length === 5) setErledigt(z.erledigt);
      }
    } catch { /* تخزينٌ فاسدٌ = بدايةٌ جديدة */ }
    setGeladen(true);
  }, [speicher]);
  useEffect(() => {
    if (!geladen) return;
    try { localStorage.setItem(speicher, JSON.stringify({ schritt, erledigt })); } catch { /* ممتلئ = نanship */ }
  }, [geladen, speicher, schritt, erledigt]);

  // ➕ الزائدُ عن 3 تمارينٍ يَرتحِلُ إلى «تدريب إضافي» في تبويب تدرّب (K114a)
  useEffect(() => {
    const t = grammarMap[topicId];
    if (t && t.exercises.length > 3) {
      try { localStorage.setItem(`weg-park-${topicId}`, JSON.stringify(t.exercises.slice(3).map((e) => e.id))); } catch { /* ممتلئ */ }
    } else {
      try { localStorage.removeItem(`weg-park-${topicId}`); } catch { /* لا شيء */ }
    }
  }, [topicId]);

  const seed = useMemo(() => Array.from(topicId).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11), [topicId]);
  const frage = useMemo(() => (topic ? entdeckungsFrage(topic, Object.values(grammarMap), seed) : null), [topic, seed]);
  const entdecken = !!frage && !!topic && induktionMoeglich(topic);
  const bruecken = useMemo(() => getBrueckenFor(topicId).slice(0, 2), [topicId]);

  if (!topic) {
    return (
      <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ marginBottom: "1rem" }}>لا درسَ قواعدَ مجدولٍ اليوم.</p>
        <Link href="/" className="btn btn-primary" style={{ minHeight: "44px", textDecoration: "none" }}>
          ↩ العودة إلى «اليوم»
        </Link>
      </div>
    );
  }

  const tuer = (i: number) => setErledigt((e) => e.map((v, j) => (j === i ? true : v)));
  const waehle = (i: number) => {
    if (gewaehlt !== null || !frage) return;
    setGewaehlt(i);
    const r: EntdeckungsErgebnis = i === frage.richtigIndex ? "richtig" : "falsch";
    setErgebnis(r);
    tuer(0);
  };
  const kannZu = (i: number) => i === 0 || i <= schritt || erledigt[schritt];

  return (
    <section className="card" data-testid="lektion-wizard" style={{ padding: "1.1rem 1.2rem", display: "grid", gap: "0.8rem" }}>
      {/* ── مؤشّر الخطوات: مقاعد الطابور لا أبوابٌ متفرّقة ── */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }} role="tablist" aria-label="خطوات الدرس">
        {SCHRITTE.map((st, i) => (
          <button
            key={st}
            type="button"
            role="tab"
            aria-selected={i === schritt}
            data-testid={`wizard-schritt-${i}`}
            className="chip"
            disabled={!kannZu(i)}
            title={kannZu(i) ? undefined : "أكمل الخطوات السابقة أولًا"}
            onClick={() => kannZu(i) && setSchritt(i)}
            style={{
              minHeight: "44px",
              cursor: kannZu(i) ? "pointer" : "not-allowed",
              opacity: kannZu(i) ? 1 : 0.5,
              fontWeight: i === schritt ? 900 : 600,
              background: erledigt[i] ? "var(--color-a1)" : i === schritt ? "var(--color-cola)" : undefined,
              color: erledigt[i] || i === schritt ? "white" : undefined,
            }}
          >
            {erledigt[i] ? "✓ " : `${i + 1}· `}{st}
          </button>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>
        <span style={{ color: "var(--color-cola)" }}>{topic.titleAr}</span>
        {" — "}<De>{topic.titleDe}</De>
      </div>

      {/* ── 🎯 معيار الدرس: الهدف أولاً، ثم المتطلب السابق ── */}
      {topic.ziel && (
        <div data-testid="wizard-ziel" className="card" style={{ padding: "0.6rem 0.9rem", background: "var(--color-a1-soft)", borderInlineStart: "5px solid var(--color-a1)", fontSize: "0.9rem" }}>
          🎯 <strong>هدف هذا الدرس:</strong> {topic.ziel}
        </div>
      )}
      {topic.voraus && topic.voraus.length > 0 && (
        <div data-testid="wizard-voraus" style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
          🧱 يبني على: {topic.voraus.map((v) => grammarMap[v]?.titleAr ?? v).join(" · ")}
        </div>
      )}

      {/* ── جسم الخطوة: ≤ نصف شاشة + تمريرٌ داخليّ (K108b) ── */}
      <div data-testid={`wizard-body-${schritt}`} style={{ maxHeight: "52dvh", overflowY: "auto", display: "grid", gap: "0.7rem", paddingInlineEnd: "0.2rem" }}>
        {/* ① خمّن — الاستقراء قبل القاعدة (lib/induktion) */}
        {schritt === 0 && (entdecken && frage ? (
          <div data-testid="wizard-induktion" style={{ display: "grid", gap: "0.55rem" }}>
            <strong>🔍 اكتشف القاعدة قبل أن تقرأها</strong>
            <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)", margin: 0 }}>
              اقرأ الأمثلة ثم خمّن: ما القاعدة المشتركة؟ الخطأ لا يُخصم — بل يجهّز ذهنك للشرح.
            </p>
            {topic.examples.map((ex) => (
              <div key={ex.de} style={{ borderInlineStart: "3px solid var(--color-gold)", paddingInlineStart: "0.7rem" }}>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De>{ex.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
              </div>
            ))}
            <div style={{ fontWeight: 700 }}>ما القاعدة التي تراها في هذه الأمثلة؟</div>
            {frage.optionen.map((o, i) => (
              <button
                key={i}
                type="button"
                className="btn btn-ghost"
                data-testid={`wizard-option-${i}`}
                disabled={gewaehlt !== null}
                style={{ textAlign: "start", justifyContent: "flex-start" }}
                onClick={() => waehle(i)}
              >
                <span>
                  <De style={{ fontWeight: 700 }}>{o.de}</De>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--color-ink2)" }}>{o.ar}</span>
                </span>
              </button>
            ))}
            {ergebnis !== null && (
              <div data-testid="wizard-ergebnis" className="card" style={{ padding: "0.6rem 0.9rem", background: "var(--color-paper2)", borderInlineStart: "5px solid var(--color-gold)", fontSize: "0.88rem" }}>
                <strong>{ergebnis === "richtig" ? "✅ " : ergebnis === "falsch" ? "↪️ " : "⏭ "}{ergebnisText(ergebnis)}</strong>
                <div style={{ marginTop: "0.2rem" }}>القاعدة: <De style={{ fontWeight: 700 }}>{frage.optionen[frage.richtigIndex].de}</De></div>
              </div>
            )}
            <button type="button" className="btn btn-ghost" style={{ fontSize: "0.82rem" }} data-testid="wizard-ueberspringen" onClick={() => { setErgebnis("uebersprungen"); tuer(0); }}>
              أرني القاعدة مباشرة (يُسجَّل تخطّياً، بلا نقطة)
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <strong>👀 لاحظ النمط في الأمثلة</strong>
            {topic.examples.map((ex) => (
              <div key={ex.de} style={{ borderInlineStart: "3px solid var(--color-gold)", paddingInlineStart: "0.7rem" }}>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De>{ex.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" data-testid="wizard-beobachtet" onClick={() => tuer(0)}>
              لاحظتُ النمط — افتح القاعدة
            </button>
          </div>
        ))}

        {/* ② القاعدة — ما يُشرح بعد الفجوة */}
        {schritt === 1 && (
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <strong>📐 القاعدة</strong>
            {topic.rules.map((r) => (
              <div key={r.de} className="card" style={{ padding: "0.6rem 0.85rem", borderInlineStart: "5px solid var(--color-cola)" }}>
                <De style={{ fontWeight: 800 }}>{r.de}</De>
                <div style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginTop: "0.2rem" }}>{r.ar}</div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" data-testid="wizard-regel-gelesen" onClick={() => tuer(1)}>
              قرأتُ القاعدة
            </button>
          </div>
        )}

        {/* ③ الأمثلة — ما شوهد في خطوة 1 يُثبَّت هنا مشروحاً */}
        {schritt === 2 && (
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <strong>🧩 الأمثلة مشروحة</strong>
            {topic.examples.map((ex) => (
              <div key={ex.de} className="card" style={{ padding: "0.55rem 0.8rem" }}>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De style={{ fontWeight: 700 }}>{ex.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "44px" }} onClick={() => speakAny(ex.de)} aria-label="استمع">🔊</button>
                </div>
                <div style={{ fontSize: "0.86rem", color: "var(--color-ink2)" }}>{ex.ar}</div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" data-testid="wizard-beispiele-gesehen" onClick={() => tuer(2)}>
              ثبّتُّ الأمثلة
            </button>
          </div>
        )}

        {/* ④ التطبيق — ≤3 تمارين (K108c) */}
        {schritt === 3 && (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <strong>✍️ طبّق — ثلاثُ تمارينَ بالضبط</strong>
            <ExerciseSet items={topic.exercises.slice(0, 3)} onPoints={() => tuer(3)} />
            {!erledigt[3] && (
              <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: 0 }}>
                🔒 الأمامُ مقفلٌ حتى تحاول تمريناً واحداً على الأقل.
              </p>
            )}
          </div>
        )}

        {/* ⑤ الخلاصة — الملخّص + الفخاخ + شفرة الحفظ (K110) */}
        {schritt === 4 && (
          <div style={{ display: "grid", gap: "0.65rem" }} data-testid="wizard-zusammenfassung">
            <strong>🧾 الخلاصة</strong>
            <div className="card" style={{ padding: "0.7rem 0.9rem", background: "var(--color-paper2)" }}>{topic.summaryAr}</div>
            {topic.pitfalls && topic.pitfalls.length > 0 && (
              <div className="card" style={{ padding: "0.6rem 0.85rem", borderInlineStart: "5px solid var(--color-die)" }}>
                <div style={{ fontWeight: 800, marginBottom: "0.3rem", color: "var(--color-die)" }}>⚠️ فخاخُ هذا الدرس الشائعة</div>
                {topic.pitfalls.map((p) => (
                  <div key={p.de} style={{ fontSize: "0.86rem", marginBottom: "0.35rem" }}>
                    <De style={{ textDecoration: "line-through", color: "var(--color-die)" }}>{p.de}</De>
                    <div style={{ color: "var(--color-ink2)" }}>{p.ar}</div>
                  </div>
                ))}
              </div>
            )}
            {bruecken.length > 0 && (
              <div className="card" style={{ padding: "0.6rem 0.85rem", borderInlineStart: "5px solid var(--color-gold)" }}>
                <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🧠 شفرةُ الحفظ</div>
                {bruecken.map((b) => (
                  <div key={b.id} style={{ marginBottom: "0.45rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--color-b1)" }}>{b.emoji} {b.titleAr}</div>
                    <p style={{ fontSize: "0.86rem", lineHeight: 1.7, color: "var(--color-ink2)", margin: "0.15rem 0 0.3rem" }}>{b.storyAr}</p>
                    {(b.zeilen ?? []).slice(0, 3).map((z, zi) => (
                      <div key={zi} style={{ background: "var(--color-paper2)", padding: "0.35rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.8rem", border: "1px solid var(--color-gold)", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 900, color: "var(--color-b1)" }}>{z.code} ➔ </span>
                        <De style={{ fontWeight: 800 }}>{z.de}</De>
                        <div style={{ color: "var(--color-ink2)", fontSize: "0.75rem" }}>{z.ar}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {/* ── 🚀 مهمة الاستقلال: استخدامٌ حقيقي جديد — تُحفَظ للتحقق المؤجل ── */}
            {topic.anwendung && (
              <div data-testid="wizard-anwendung" className="card" style={{ padding: "0.7rem 0.9rem", borderInlineStart: "5px solid var(--color-b1)" }}>
                <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🚀 مهمة الاستقلال — جرّب وحدك بلا خيارات</div>
                <De style={{ fontWeight: 700 }}>{topic.anwendung.de}</De>
                <div style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginTop: "0.2rem", lineHeight: 1.9 }}>{topic.anwendung.ar}</div>
                {(topic.anwendung.candoIds ?? []).length > 0 && (
                  <div style={{ fontSize: "0.78rem", color: "var(--color-b1)", marginTop: "0.35rem" }}>
                    ✓ تُحقِّق: {(topic.anwendung.candoIds ?? []).map((c) => {
                      const hit = (Object.values(candoMap) as { id: string; ar: string }[][]).flat().find((x) => x.id === c);
                      return hit ? hit.ar : c;
                    }).join(" · ")}
                  </div>
                )}
                <div style={{ fontSize: "0.76rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>
                  تُحفَظ محاولتك هنا تدريباً — والتحقق من الاستقلال بمهمة جديدة بعد 3 أيام.
                </div>
              </div>
            )}
            <Link href="/" className="btn btn-primary" data-testid="wizard-zurueck-heute" style={{ minHeight: "44px", textDecoration: "none" }} onClick={() => tuer(4)}>
              ✅ أنهيتُ الدرس — عُد إلى «اليوم»
            </Link>
          </div>
        )}
      </div>

      {/* ── شريط التنقّل: الأمام مقفل حتى إتمام الخطوة، والقفل يذكر سببه ── */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", alignItems: "center" }}>
        <button type="button" className="btn btn-ghost" data-testid="wizard-zurueck" disabled={schritt === 0} onClick={() => setSchritt((s) => Math.max(0, s - 1))} style={{ minHeight: "44px" }}>
          → السابقة
        </button>
        {!erledigt[schritt] && schritt < 4 && (
          <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }} data-testid="wizard-sperre">🔒 أنجز الخطوة أولاً</span>
        )}
        {schritt < 4 && (
          <button
            type="button"
            className="btn btn-primary"
            data-testid="wizard-next"
            disabled={!erledigt[schritt]}
            title={erledigt[schritt] ? "التالي" : "أنجز الخطوة أولاً — لا تخطٍّ بلا تفاعل"}
            onClick={() => setSchritt((s) => Math.min(4, s + 1))}
            style={{ minHeight: "44px" }}
          >
            التالية ←
          </button>
        )}
      </div>
    </section>
  );
}
