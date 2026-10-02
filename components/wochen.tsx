"use client";
/** لوح الأسبوع والتقارير المنزلية — Stundenplan + Abzeichen/XP + Elternbericht */
import type { DayType, Progress, TaskKind } from "@/lib/types";
import { TOTAL_DAYS } from "@/lib/types";
import { buildDay } from "@/lib/plan";
import { elternBrief } from "@/lib/fehler";
import { levelOfXp, ABZEICHEN } from "@/lib/spiel";
import { ArbeitsblattButton } from "./blatt";

const TYPE_LABEL: Record<DayType, string> = {
  lerntag: "يوم تعلّم",
  festigung: "يوم تثبيت",
  wochencheck: "فحص أسبوعي",
  abschluss: "يوم ختامي",
};
const TYPE_ICON: Record<DayType, string> = {
  lerntag: "📘",
  festigung: "🛠️",
  wochencheck: "📝",
  abschluss: "🎓",
};

function kindIcon(kind: TaskKind) {
  switch (kind) {
    case "wiederholen":
      return "🔁";
    case "grammatik":
      return "📘";
    case "wortschatz":
      return "🃏";
    case "hoeren":
      return "🎧";
    case "lesen":
      return "📖";
    case "schreiben":
      return "✍️";
    case "sprechen":
      return "🗣️";
    default:
      return "✅";
  }
}

// ── ⭐ شريط XP والمستويات ──────────────────────────────────────────────
export function XpBar({ progress }: { progress: Progress }) {
  const xp = progress.xp ?? 0;
  const lv = levelOfXp(xp);
  return (
    <div style={{ marginTop: "0.55rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          marginBottom: "0.2rem",
          flexWrap: "wrap",
          gap: "0.3rem",
        }}
      >
        <strong>
          {lv.icon} {lv.name} · {lv.ar} — المستوى <span className="rtl-num">{lv.index}</span>
        </strong>
        <span className="rtl-num" style={{ color: "var(--color-ink2)" }}>
          ⭐ {xp} XP{lv.next ? ` · يبق ${lv.next.xp - xp} للمستوى التالي` : " · أعلى مستوى!"}
        </span>
      </div>
      <div className="progressbar" style={{ height: 8 }}>
        <div style={{ width: `${lv.pct}%`, background: "var(--color-gold)" }} />
      </div>
    </div>
  );
}

// ── 🗓 جدول الأسبوع (Stundenplan + واجبات اليوم) ───────────────────────
export function Wochenplan({ progress }: { progress: Progress }) {
  const day = Math.min(progress.plan.day, TOTAL_DAYS);
  const week = Math.ceil(day / 7);
  const start = (week - 1) * 7 + 1;
  // نظرة تقويمية حتمية: التعويضات خاصّة باليوم الحالي فقط
  const calm: Progress = { ...progress, plan: { ...progress.plan, debt: [] }, weak: {} };
  const days: number[] = [];
  for (let d = start; d < Math.min(start + 7, TOTAL_DAYS + 1); d++) days.push(d);
  return (
    <details className="card" style={{ padding: "0.8rem 1.1rem" }}>
      <summary style={{ cursor: "pointer", fontWeight: 800 }}>
        🗓 جدول الأسبوع <span className="rtl-num">{week}</span> — Stundenplan والواجبات (اضغط للفتح)
      </summary>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(9.5rem, 1fr))",
          gap: "0.5rem",
          marginTop: "0.7rem",
        }}
      >
        {days.map((d) => {
          const p = buildDay(d, calm);
          const r = progress.plan.days[d];
          const isNow = d === progress.plan.day;
          const closed = !!r?.closed;
          const minutes = p.tasks.reduce((a, t) => a + t.minutes, 0);
          return (
            <div
              key={d}
              style={{
                background: isNow ? "var(--color-gold-soft)" : "var(--color-paper2)",
                border: isNow ? "2px solid var(--color-gold)" : "1px solid var(--color-line)",
                borderRadius: "0.7rem",
                padding: "0.5rem 0.6rem",
                opacity: d > progress.plan.day && !isNow ? 0.65 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>
                  اليوم <span className="rtl-num">{d}</span>
                </strong>
                <span>{closed ? "✅" : isNow ? "▶️" : d < progress.plan.day ? "⌛" : "🔒"}</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-ink2)", margin: "0.15rem 0" }}>
                {TYPE_ICON[p.type]} {TYPE_LABEL[p.type]} · {p.phase} · <span className="rtl-num">{minutes}</span>د
              </div>
              <div style={{ fontSize: "0.9rem", letterSpacing: 1 }}>
                {p.tasks.slice(0, 6).map((t) => kindIcon(t.kind)).join(" ")}
              </div>
              {closed && (
                <div className="rtl-num" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-a1)" }}>
                  {Math.round((r!.score / Math.max(r!.total, 1)) * 100)}%
                </div>
              )}
              {isNow && progress.plan.debt.length > 0 && (
                <div style={{ fontSize: "0.72rem", color: "var(--color-cola)", fontWeight: 700 }}>
                  📥 {progress.plan.debt.length} تعويض
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "0.5rem" }}>
        ✅ مُغلق · ▶️ يومك الحالي · ⌛ انقضى دون إغلاق · 🔒 لم يحن بعد — الخطة حتمية: كل يوم يظهر بنفس مهامه.
      </div>
      <ArbeitsblattButton progress={progress} />
    </details>
  );
}

// ── 🏅 الأوسمة ─────────────────────────────────────────────────────────
export function AbzeichenKarte({ progress }: { progress: Progress }) {
  const owned = progress.abzeichen ?? {};
  const count = Object.keys(owned).length;
  return (
    <section className="card" style={{ padding: "1.3rem" }}>
      <h2 style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🏅 الأوسمة — Abzeichen</h2>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginBottom: "0.7rem" }}>
        <span className="rtl-num">{count}</span> / <span className="rtl-num">{ABZEICHEN.length}</span> — تُمنح
        تلقائياً بإنجازاتك الحقيقية (حتمية، بلا غش).
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))", gap: "0.5rem" }}>
        {ABZEICHEN.map((a) => {
          const got = owned[a.id];
          return (
            <div
              key={a.id}
              title={a.ar}
              style={{
                background: got ? "var(--color-gold-soft)" : "var(--color-paper2)",
                border: got ? "2px solid var(--color-gold)" : "1px dashed var(--color-line)",
                borderRadius: "0.7rem",
                padding: "0.55rem 0.6rem",
                textAlign: "center",
                opacity: got ? 1 : 0.55,
              }}
            >
              <div style={{ fontSize: "1.6rem" }}>{a.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "0.82rem" }}>{a.de}</div>
              <div style={{ fontSize: "0.74rem", color: "var(--color-ink2)" }}>{a.ar}</div>
              {got && (
                <div className="rtl-num" style={{ fontSize: "0.7rem", color: "var(--color-gold)", fontWeight: 700 }}>
                  {got}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 💌 تقرير وليّ الأمر (ثنائي — للطباعة) ──────────────────────────────
export function ElternBriefView({ progress }: { progress: Progress }) {
  const b = elternBrief(progress);
  return (
    <section className="card" style={{ padding: "1.3rem", background: "var(--color-paper2)" }}>
      <style>{`@media print { .weg-print-hide { display: none !important; } }`}</style>
      <h2 style={{ fontWeight: 800, marginBottom: "0.3rem" }}>💌 تقرير لوليّ الأمر — Bericht für Eltern</h2>
      <p style={{ fontSize: "0.88rem", color: "var(--color-ink2)", marginBottom: "0.7rem" }}>
        رسالة جاهزة للطباعة أو القراءة — ألمانية وعربية، حتمية من نتائج الطالب الحقيقية.
      </p>
      <div className="grid2" style={{ gap: "0.8rem" }} dir="ltr">
        <div style={{ background: "var(--color-card)", borderRadius: "0.7rem", padding: "0.8rem 0.9rem" }}>
          <strong style={{ fontSize: "0.85rem" }}>🇩🇪 Deutsch</strong>
          <ul style={{ margin: "0.4rem 0 0", paddingInlineStart: "1.1rem", fontSize: "0.88rem", lineHeight: 1.8 }}>
            {b.de.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
        <div style={{ background: "var(--color-card)", borderRadius: "0.7rem", padding: "0.8rem 0.9rem" }} dir="rtl">
          <strong style={{ fontSize: "0.85rem" }}>🇸🇦 العربية</strong>
          <ul style={{ margin: "0.4rem 0 0", paddingInlineStart: "1.1rem", fontSize: "0.88rem", lineHeight: 1.8 }}>
            {b.ar.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
      <button className="btn btn-gold weg-print-hide" style={{ marginTop: "0.7rem" }} onClick={() => window.print()}>
        🖨️ اطبع التقرير / احفظه PDF
      </button>
    </section>
  );
}
