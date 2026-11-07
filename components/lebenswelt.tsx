"use client";
import { useState, useMemo } from "react";
import { Landeskunde } from "./landeskunde";
import { lebensweltThemen, umgangBank, BERUFSSTART_SCHRITTE } from "@/lib/lebenswelt";
import { useEffect } from "react";
import { speakAny } from "@/lib/speech";
import { De } from "@/components/De";
import { useSearchParams } from "next/navigation";

/**
 * 🌍 محطة الحياة في ألمانيا (R200): بطاقات مؤسسات وحياة يومية بعبارات جاهزة،
 * ومسار الاعتراف المهني بالمؤهلات (قلب هدف العمل في التمريض)، ولغة شارع بسياقها.
 * توجيه عملي عام — ليست استشارة قانونية؛ الأسعار والمهل المتغيّرة مُتحفَّظ عليها في النص.
 */
const BS_KEY = "weg-berufsstart";

const FILTERS: { id: string; label: string; emoji: string; match: (id: string) => boolean }[] = [
  { id: "alle", label: "الكل", emoji: "✨", match: () => true },
  { id: "wohnen", label: "السكن", emoji: "🏠", match: (id) => id === "lw-01" || id === "lw-08" },
  { id: "behoerde", label: "الجهات الرسمية", emoji: "🏛️", match: (id) => id === "lw-02" || id === "lw-03" },
  { id: "gesundheit", label: "الصحة", emoji: "🏥", match: (id) => id === "lw-04" || id === "lw-11" },
  { id: "arbeit", label: "العمل", emoji: "💼", match: (id) => ["lw-05", "lw-06", "lw-07", "lw-13"].includes(id) },
  { id: "familie", label: "العائلة", emoji: "👨‍👩‍👧", match: (id) => id === "lw-09" },
  { id: "mobilitaet", label: "التنقّل", emoji: "🚃", match: (id) => id === "lw-10" },
  { id: "alltag", label: "الحياة اليومية", emoji: "📅", match: (id) => id === "lw-12" },
];

export function LebensweltStation() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams?.get("filter") ?? "alle";
  const [filterId, setFilterId] = useState(initialFilter);
  useEffect(() => {
    const f = searchParams?.get("filter");
    if (f && FILTERS.some((x) => x.id === f)) setFilterId(f);
  }, [searchParams]);
  const gefiltert = useMemo(() => lebensweltThemen.filter((t) => FILTERS.find((f) => f.id === filterId)?.match(t.id) ?? true), [filterId]);
  const [umgangOffen, setUmgangOffen] = useState(false);
  const [bsStand, setBsStand] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const roh = localStorage.getItem(BS_KEY);
      if (roh) setBsStand(JSON.parse(roh) as Record<string, boolean>);
    } catch { /* قائمة محلية اختيارية */ }
  }, []);
  const bsToggle = (id: string) => {
    setBsStand((s) => {
      const neu = { ...s, [id]: !s[id] };
      try { localStorage.setItem(BS_KEY, JSON.stringify(neu)); } catch { /* ignore */ }
      return neu;
    });
  };
  const bsFertig = BERUFSSTART_SCHRITTE.filter((s) => bsStand[s.id]).length;
  return (
    <div data-testid="lebenswelt-station" style={{ display: "grid", gap: "1rem" }}>
      <p style={{ fontSize: "0.86rem", color: "var(--color-ink2)", margin: 0 }}>
        🌍 اللغة لا تكفي وحدها للعيش والعمل: هنا المؤسسات والأوراق والعادات التي ستواجهك فعلًا —
        وبطاقة الاعتراف بمؤهّل التمريض في الصدارة لأنها بوابة عملك. توجيه عملي عام لا استشارة قانونية.
      </p>

      {/* 🚀 خطة البدء المهني — قائمة بيد المتعلم، لا تدخل في نتائج الخطة */}
      <section className="card" style={{ padding: "0.8rem 0.95rem" }} data-testid="berufsstart">
        <h3 style={{ fontWeight: 800, margin: "0 0 0.3rem" }}>🚀 خطّتي للبدء المهني في التمريض</h3>
        <p style={{ fontSize: "0.84rem", color: "var(--color-ink2)", margin: "0 0 0.6rem" }}>
          ثماني خطوات من مستواك اليوم إلى أول عقد عمل. علّم ما تُنجزه — تُحفظ العلامات في متصفحك فقط
          ولا تدخل في نتائج الخطة. أنجزتَ {bsFertig} من {BERUFSSTART_SCHRITTE.length}.
        </p>
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {BERUFSSTART_SCHRITTE.map((s, i) => (
            <label key={s.id} data-testid={`berufsstart-${s.id}`}
              aria-label={`${i + 1}. ${s.titelAr} — ${s.detailAr}`}
              style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", minHeight: "44px", cursor: "pointer", padding: "0.45rem 0.55rem", borderRadius: "0.55rem", background: bsStand[s.id] ? "var(--color-paper2)" : undefined }}>
              <input type="checkbox" checked={!!bsStand[s.id]} onChange={() => bsToggle(s.id)}
                style={{ width: "22px", height: "22px", marginTop: "0.15rem", flexShrink: 0 }} />
              <span>
                <strong style={{ textDecoration: bsStand[s.id] ? "line-through" : undefined }}>{i + 1}. {s.titelAr}</strong>
                <span style={{ display: "block", fontSize: "0.83rem", color: "var(--color-ink2)" }}>{s.detailAr}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div data-testid="lebenswelt-filter-bar" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            data-testid={`lebenswelt-filter-${f.id}`}
            onClick={() => setFilterId(f.id)}
            className="chip"
            style={{
              minHeight: "36px",
              fontWeight: filterId === f.id ? 900 : 600,
              background: filterId === f.id ? "var(--color-a1)" : undefined,
              color: filterId === f.id ? "var(--ui-on-accent)" : undefined,
            }}
          >
            {f.emoji} {f.label} {f.id !== "alle" && <span style={{ fontSize: "0.68rem", opacity: 0.8 }}>({lebensweltThemen.filter((x) => f.match(x.id)).length})</span>}
          </button>
        ))}
        <span className="chip" style={{ fontSize: "0.7rem" }}>{gefiltert.length} بطاقة</span>
      </div>

      <section style={{ display: "grid", gap: "0.55rem" }}>
        {gefiltert.map((t) => (
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
      <Landeskunde />
    </div>
  );
}
