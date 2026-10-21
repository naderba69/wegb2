"use client";
/**
 * 🗺️ R193 — مسار التعلّم (LernPfad): خريطة طريق بصرية من A0 إلى B2
 * بدل البطاقات المكدّسة في الرئيسية. الوحدة الحالية مفتوحة بعُقد
 * أيامها (أُغلق ✓ · اليوم · قادم)، وبقية الوحدات صفوف مختصرة قابلة
 * للفتح. المسار عرضٌ أمين من سجلّ الأيام المغلقة — لا ينقل يومك
 * ولا يمنح إنجازًا؛ زرّ اليوم يهبط بك إلى مشغّل الجلسة.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Progress } from "@/lib/types";
import { TOTAL_DAYS } from "@/lib/types";
import { CURRICULUM_SECTIONS, curriculumSectionForDay } from "@/lib/curriculum";

export function LernPfad({ progress }: { progress: Progress }) {
  const day = Math.min(Math.max(progress.plan.day, 1), TOTAL_DAYS);
  const aktuell = curriculumSectionForDay(day);
  const [offenId, setOffenId] = useState<string | null>(aktuell?.id ?? null);

  const fortschritt = useMemo(() => {
    const m = new Map<string, { geschlossen: number; gesamt: number }>();
    for (const s of CURRICULUM_SECTIONS) {
      let g = 0;
      for (let d = s.from; d <= s.to; d++) if (progress.plan.days[d]?.closed) g++;
      m.set(s.id, { geschlossen: g, gesamt: s.to - s.from + 1 });
    }
    return m;
  }, [progress]);

  const zuHeute = () => {
    document.getElementById("aufgabe-spieler")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section data-testid="lern-pfad" aria-label="مسار التعلم" style={{ display: "grid", gap: "0.55rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.4rem" }}>
        <strong style={{ fontSize: "1.05rem" }}>🗺️ مسارك إلى B2</strong>
        <Link href="/masar" className="tiny" style={{ fontWeight: 700 }}>
          استكشف المنهج كاملًا ←
        </Link>
      </div>

      {CURRICULUM_SECTIONS.map((s) => {
        const f = fortschritt.get(s.id)!;
        const istAktuell = s.id === aktuell?.id;
        const offen = offenId === s.id;
        return (
          <div
            key={s.id}
            style={{
              border: istAktuell ? "2px solid var(--color-cola)" : "1px solid var(--color-line)",
              borderRadius: "0.9rem",
              padding: "0.6rem 0.75rem",
              background: istAktuell ? "var(--color-paper2)" : undefined,
            }}
          >
            <button
              type="button"
              onClick={() => setOffenId(offen ? null : s.id)}
              aria-expanded={offen}
              data-testid={`pfad-abschnitt-${s.id}`}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem",
                width: "100%", background: "none", border: 0, cursor: "pointer", color: "inherit",
                font: "inherit", minHeight: "44px", textAlign: "start", padding: 0,
              }}
            >
              <span>
                <strong>{s.level} · {s.titleAr}</strong>{" "}
                <small style={{ color: "var(--color-ink2)" }}>
                  الأيام {s.from}–{s.to}
                  {istAktuell ? " · أنت هنا" : ""}
                </small>
              </span>
              <span className="tiny" style={{ whiteSpace: "nowrap" }}>
                أُغلق {f.geschlossen}/{f.gesamt} {offen ? "▲" : "▼"}
              </span>
            </button>

            {offen && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }} role="list" aria-label={`أيام ${s.titleAr}`}>
                {Array.from({ length: s.to - s.from + 1 }, (_, i) => s.from + i).map((d) => {
                  const zu = !!progress.plan.days[d]?.closed;
                  const heute = d === day;
                  const basis: React.CSSProperties = {
                    width: "44px", height: "44px", borderRadius: "50%",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.82rem", flex: "0 0 auto",
                    border: heute ? "3px solid var(--color-gold)" : "1px solid var(--color-line)",
                    background: zu ? "var(--color-a1)" : heute ? "var(--color-cola)" : "transparent",
                    color: zu || heute ? "var(--ui-on-accent)" : "var(--color-ink2)",
                    opacity: !zu && !heute && d > day ? 0.45 : 1,
                  };
                  if (heute) {
                    // ♿ R305/ب14: role="listitem" انتقل من <button> نفسه إلى غلاف غير تفاعلي
                    return (
                      <div key={d} role="listitem" style={{ display: "contents" }}>
                        <button
                          type="button"
                          data-testid="pfad-heute"
                          onClick={zuHeute}
                          aria-label={`اليوم ${d} — يومك الحالي، انزل إلى الجلسة`}
                          title={`اليوم ${d} — انزل إلى جلستك`}
                          style={{ ...basis, cursor: "pointer" }}
                        >
                          {zu ? "✓" : d}
                        </button>
                      </div>
                    );
                  }
                  return (
                    <span
                      key={d}
                      role="listitem"
                      data-testid={zu ? "pfad-zu" : "pfad-offen"}
                      aria-label={`اليوم ${d}${zu ? " — مغلق" : d < day ? " — سابق لم يُغلق" : " — قادم"}`}
                      title={`اليوم ${d}`}
                      style={basis}
                    >
                      {zu ? "✓" : d}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <p className="tiny muted" style={{ margin: 0, lineHeight: 1.9 }}>
        العُقد من سجلّ أيامك المغلقة نفسه: ✓ أغلقته فعلًا، والمذهّبة يومك الحالي.
        المسار لا ينقلك بين الأيام — يومك يتقدّم بإغلاقه من الجلسة في الأسفل، والمحتوى يُستكشف من «مسار المنهج».
      </p>
    </section>
  );
}
