"use client";
// 🏛️ A23+A26 (R285): وحدات حياة وظيفية ومسار تونس — خطوات وعبارات تُسمَع، توجيه عام لا استشارة قانونية
import { LANDES_EINHEITEN } from "@/lib/landeskunde";
import { speakDe } from "@/lib/speech";

function Einheit({ e }: { e: (typeof LANDES_EINHEITEN)[number] }) {
  return (
    <details className="card" style={{ padding: "0.7rem 0.9rem" }} data-testid={`landeskunde-${e.id}`}>
      <summary style={{ cursor: "pointer", fontWeight: 800, minHeight: 32 }}>
        {e.icon} {e.titelAr} <span style={{ color: "var(--color-ink2)", fontWeight: 400 }}>· {e.titelDe}</span>
      </summary>
      <p style={{ fontSize: "0.86rem" }}>{e.introAr}</p>
      <ol style={{ fontSize: "0.86rem", lineHeight: 1.9, paddingInlineStart: "1.2rem" }}>
        {e.schritte.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      <div style={{ display: "grid", gap: "0.3rem", margin: "0.5rem 0" }}>
        {e.saetze.map((s) => (
          <div key={s.de} style={{ display: "flex", gap: "0.45rem", alignItems: "center", flexWrap: "wrap", fontSize: "0.88rem" }}>
            <button className="chip" style={{ cursor: "pointer" }} onClick={() => speakDe(s.de)}>🔊</button>
            <strong dir="ltr" style={{ unicodeBidi: "isolate" }}>{s.de}</strong>
            <span style={{ color: "var(--color-ink2)" }}>{s.ar}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {e.woerter.map((w) => (
          <span key={w.de} className="chip" style={{ fontSize: "0.75rem" }}>{w.de} = {w.ar}</span>
        ))}
      </div>
    </details>
  );
}

export function Landeskunde() {
  const amt = LANDES_EINHEITEN.filter((e) => e.gruppe === "amt");
  const tn = LANDES_EINHEITEN.filter((e) => e.gruppe === "tunesien");
  return (
    <div data-testid="landeskunde" style={{ display: "grid", gap: "1rem" }}>
      <section style={{ display: "grid", gap: "0.6rem" }}>
        <h3 style={{ fontWeight: 800, margin: 0 }}>🏛️ الحياة الوظيفية في ألمانيا (A23)</h3>
        {amt.map((e) => <Einheit key={e.id} e={e} />)}
      </section>
      <section style={{ display: "grid", gap: "0.6rem" }}>
        <h3 style={{ fontWeight: 800, margin: 0 }}>🇹🇳 مسارك من تونس (A26)</h3>
        <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)", margin: 0 }}>
          خطوات إرشادية عامة من مصادر رسمية معروفة (السفارة، anabin، ‏anerkennung-in-deutschland.de) — الرسوم والمواعيد والإجراءات تتغيّر؛ تحقّق من المواقع الرسمية قبل أي خطوة أو دفع.
        </p>
        {tn.map((e) => <Einheit key={e.id} e={e} />)}
      </section>
    </div>
  );
}
