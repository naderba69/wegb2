"use client";
import type { Level } from "@/lib/types";
import { LEVEL_COLORS } from "@/lib/types";

export function LevelBadge({ level, small }: { level: Level | "ALL"; small?: boolean }) {
  const color = level === "ALL" ? "var(--color-ink2)" : LEVEL_COLORS[level];
  return (
    <span
      className="chip"
      style={{
        color,
        borderColor: color,
        fontSize: small ? "0.7rem" : "0.8rem",
        padding: small ? "0.1rem 0.5rem" : undefined,
      }}
    >
      {level}
    </span>
  );
}

import { diffWoerter } from "@/lib/grader";

/** 💡 مؤشر الثقة (Modul S) — يتحرّك حيّاً أثناء الكتابة */
export function VertrauensBalken({ wert, live }: { wert: number; live?: boolean }) {
  const pct = Math.round(wert * 100);
  const farbe = pct >= 90 ? "var(--color-a1)" : pct >= 60 ? "var(--color-gold)" : "var(--color-mid)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem" }}>
      <span style={{ color: "var(--color-ink2)" }}>{live ? "💡 ثقة الإجابة" : "💡 الثقة"}</span>
      <span className="progressbar" style={{ flex: 1, height: 7, maxWidth: "9rem" }}>
        <span style={{ display: "block", width: `${pct}%`, height: "100%", background: farbe, transition: "width .25s" }} />
      </span>
      <span className="rtl-num" style={{ color: farbe, fontWeight: 800 }}>{pct}%</span>
    </div>
  );
}

/** 🔍 المقارنة كلمةً كلمة: أخضر مطابق · أصفر ناقص · أحمر زائد/خاطئ */
export function AntwortDiff({ gegeben, referenz }: { gegeben: string; referenz: string }) {
  const tokens = diffWoerter(gegeben, referenz);
  return (
    <div dir="ltr" style={{ fontFamily: "monospace", fontSize: "0.88rem", lineHeight: 1.9, background: "var(--color-paper2, #f7f2e4)", borderRadius: "0.5rem", padding: "0.45rem 0.7rem", marginTop: "0.3rem" }}>
      {tokens.map((t, i) => (
        <span
          key={i}
          style={{
            padding: "0.05rem 0.28rem",
            borderRadius: 4,
            marginRight: 5,
            background: t.s === "ok" ? "rgba(53,94,59,.12)" : t.s === "fehlt" ? "rgba(184,134,11,.2)" : "rgba(176,58,46,.16)",
            color: t.s === "ok" ? "var(--color-a1)" : t.s === "fehlt" ? "#8a6d0b" : "var(--color-mid)",
            textDecoration: t.s === "falsch" ? "line-through" : undefined,
          }}
        >
          {t.w}
        </span>
      ))}
      <div style={{ fontSize: "0.7rem", color: "var(--color-ink2)", marginTop: "0.25rem", direction: "rtl" }}>
        <span style={{ color: "var(--color-a1)" }}>■</span> مطابق · <span style={{ color: "#8a6d0b" }}>■</span> ناقص · <span style={{ color: "var(--color-mid)" }}>■</span> زائد/خاطئ
      </div>
    </div>
  );
}

export function ProgressBar({ pct, color }: { pct: number; color?: string }) {

  return (
    <div className="progressbar">
      <div style={{ width: `${pct}%`, background: color ?? "var(--color-cola)" }} />
    </div>
  );
}

export function StreakFlame({ count }: { count: number }) {
  return (
    <span className="chip" style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}>
      🔥 <span className="rtl-num">{count}</span>
    </span>
  );
}
