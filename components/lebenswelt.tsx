"use client";
import { useState } from "react";
import { lebensweltThemen, umgangBank } from "@/lib/lebenswelt";
import { speakAny } from "@/lib/speech";
import { De } from "@/components/De";

/**
 * 🌍 محطة الحياة في ألمانيا (R200): بطاقات مؤسسات وحياة يومية بعبارات جاهزة،
 * ومسار الاعتراف المهني بالمؤهلات (قلب هدف العمل في التمريض)، ولغة شارع بسياقها.
 * توجيه عملي عام — ليست استشارة قانونية؛ الأسعار والمهل المتغيّرة مُتحفَّظ عليها في النص.
 */
export function LebensweltStation() {
  const [umgangOffen, setUmgangOffen] = useState(false);
  return (
    <div data-testid="lebenswelt-station" style={{ display: "grid", gap: "1rem" }}>
      <p style={{ fontSize: "0.86rem", color: "var(--color-ink2)", margin: 0 }}>
        🌍 اللغة لا تكفي وحدها للعيش والعمل: هنا المؤسسات والأوراق والعادات التي ستواجهك فعلًا —
        وبطاقة الاعتراف بمؤهّل التمريض في الصدارة لأنها بوابة عملك. توجيه عملي عام لا استشارة قانونية.
      </p>

      <section style={{ display: "grid", gap: "0.55rem" }}>
        {lebensweltThemen.map((t) => (
          <details key={t.id} className="card" style={{ padding: "0.7rem 0.9rem" }} data-testid={`lebenswelt-${t.id}`}>
            <summary style={{ cursor: "pointer", fontWeight: 800, minHeight: "44px", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <De>{t.titel}</De>
              <span style={{ fontSize: "0.84rem", color: "var(--color-ink2)" }}>{t.ar}</span>
            </summary>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.9, margin: "0.5rem 0" }}>{t.textAr}</p>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {t.saetze.map((s) => (
                <div key={s.de} style={{ display: "flex", gap: "0.45rem", alignItems: "center", flexWrap: "wrap", borderInlineStart: "3px solid var(--color-gold)", paddingInlineStart: "0.6rem" }}>
                  <De style={{ fontWeight: 600 }}>{s.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px" }} onClick={() => speakAny(s.de)} aria-label="استمع إلى العبارة">🔊</button>
                  <span style={{ fontSize: "0.83rem", color: "var(--color-ink2)" }}>{s.ar}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </section>

      <section>
        <button type="button" className="btn btn-ghost" style={{ minHeight: "46px" }} data-testid="umgang-toggle"
          onClick={() => setUmgangOffen((o) => !o)}>
          {umgangOffen ? "🙈 أخفِ لغة الشارع" : "🗨️ لغة الشارع اليومية (Umgangssprache) — 16 تعبيرًا بسياقها"}
        </button>
        {umgangOffen && (
          <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.6rem" }}>
            {umgangBank.map((u) => (
              <article key={u.de} className="card" style={{ padding: "0.6rem 0.8rem" }} data-testid="umgang-eintrag">
                <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", flexWrap: "wrap" }}>
                  <De style={{ fontWeight: 800 }}>{u.de}</De>
                  <button type="button" className="chip" style={{ cursor: "pointer", minHeight: "36px" }} onClick={() => speakAny(u.de)} aria-label="استمع إلى التعبير">🔊</button>
                  <strong style={{ fontSize: "0.88rem" }}>{u.ar}</strong>
                </div>
                <div style={{ fontSize: "0.83rem", color: "var(--color-ink2)" }}>{u.situationAr}</div>
                <div style={{ fontSize: "0.86rem" }}>
                  <De>{u.bsp}</De> <span style={{ color: "var(--color-ink2)" }}>— {u.bspAr}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
