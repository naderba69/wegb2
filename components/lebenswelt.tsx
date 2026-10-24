"use client";
import { useState } from "react";
import { Landeskunde } from "./landeskunde";
import { lebensweltThemen, umgangBank, BERUFSSTART_SCHRITTE } from "@/lib/lebenswelt";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { speakAny } from "@/lib/speech";
import { De } from "@/components/De";

/**
 * 🌍 محطة الحياة في ألمانيا (R200): بطاقات مؤسسات وحياة يومية بعبارات جاهزة،
 * ومسار الاعتراف المهني بالمؤهلات (قلب هدف العمل في التمريض)، ولغة شارع بسياقها.
 * توجيه عملي عام — ليست استشارة قانونية؛ الأسعار والمهل المتغيّرة مُتحفَّظ عليها في النص.
 */
const BS_KEY = "weg-berufsstart";

// BAMF BSK B2 — 6 Handlungsfelder → filter chips für Lebenswelt
const LEBENSWELT_FILTERS: { id: string; label: string; labelDe: string; ids: string[] }[] = [
  { id: "alle", label: "الكل", labelDe: "Alle 12", ids: [] },
  { id: "wohnen", label: "🏠 السكن", labelDe: "Wohnen", ids: ["lw-01", "lw-08"] },
  { id: "behoerde", label: "🏛️ الأوراق", labelDe: "Behörde", ids: ["lw-02", "lw-03"] },
  { id: "gesundheit", label: "🏥 الصحة", labelDe: "Gesundheit", ids: ["lw-04", "lw-11"] },
  { id: "arbeit", label: "💼 العمل", labelDe: "Arbeit", ids: ["lw-05", "lw-06", "lw-07"] },
  { id: "familie", label: "👨‍👩‍👧 الأسرة", labelDe: "Familie", ids: ["lw-09"] },
  { id: "mobilitaet", label: "🚃 المواصلات", labelDe: "Mobilität", ids: ["lw-10"] },
  { id: "alltag", label: "📅 العطل & الهدوء", labelDe: "Alltag", ids: ["lw-12"] },
];

export function LebensweltStation() {
  const params = useSearchParams();
  const urlFilter = (params?.get("filter") ?? "alle") as string;
  const [umgangOffen, setUmgangOffen] = useState(false);
  const [filterId, setFilterId] = useState<string>(urlFilter);
  const [bsStand, setBsStand] = useState<Record<string, boolean>>({});
  // deep-link: ?filter=arbeit etc. from TodayB2Praxis
  useEffect(() => {
    if (urlFilter && LEBENSWELT_FILTERS.some((f) => f.id === urlFilter)) setFilterId(urlFilter);
  }, [urlFilter]);
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
  const gefiltert = filterId === "alle"
    ? lebensweltThemen
    : lebensweltThemen.filter((t) => {
        const f = LEBENSWELT_FILTERS.find((x) => x.id === filterId);
        return f ? f.ids.includes(t.id) : true;
      });
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

      {/* BAMF BSK B2 Filter — Handlungsfelder */}
      <div data-testid="lebenswelt-filter" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid var(--color-line)" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--color-ink2)" }}>🔎 فلترة BAMF:</span>
        {LEBENSWELT_FILTERS.map((f) => (
          <button key={f.id} type="button" data-testid={`lebenswelt-filter-${f.id}`}
            onClick={() => setFilterId(f.id)}
            className="chip"
            style={{ cursor: "pointer", minHeight: "36px", fontSize: "0.78rem", background: filterId === f.id ? "var(--color-a1)" : undefined, color: filterId === f.id ? "#fff" : undefined, fontWeight: filterId === f.id ? 800 : 600 }}>
            {f.label} · <span dir="ltr" style={{ opacity: 0.9 }}>{f.labelDe}</span> {f.id !== "alle" && `(${f.ids.length})`}
          </button>
        ))}
        <span style={{ fontSize: "0.74rem", color: "var(--ui-muted)", marginInlineStart: "0.3rem" }}>{gefiltert.length} بطاقة</span>
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
        {gefiltert.length === 0 && <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", padding: "0.6rem" }}>لا بطاقات في هذا الفلتر — جرّب «الكل».</div>}
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
