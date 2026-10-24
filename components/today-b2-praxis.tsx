"use client";
import Link from "next/link";
import { useMemo } from "react";
import type { DayPlan } from "@/lib/types";
import { getText, getDialogue } from "@/lib/content";

function bamfForTheme(theme: string): { id: string; label: string } | null {
  const t = theme.toLowerCase();
  if (t.includes("wohnen") || t.includes("miete") || t.includes("stadt")) return { id: "wohnen", label: "🏠 Wohnen" };
  if (t.includes("arbeit") || t.includes("beruf") || t.includes("digital")) return { id: "arbeit", label: "💼 Arbeit" };
  if (t.includes("mobilität") || t.includes("verkehr") || t.includes("pendeln")) return { id: "mobilitaet", label: "🚃 Mobilität" };
  if (t.includes("notruf") || t.includes("gesund") || t.includes("pflege")) return { id: "gesundheit", label: "🏥 Gesundheit" };
  if (t.includes("kita") || t.includes("schule") || t.includes("familie")) return { id: "familie", label: "👨‍👩‍👧 Familie" };
  if (t.includes("behörde") || t.includes("anerkennung") || t.includes("bürgeramt")) return { id: "behoerde", label: "🏛️ Behörde" };
  if (t.includes("feiertag") || t.includes("urlaub") || t.includes("alltag")) return { id: "alltag", label: "📅 Alltag" };
  if (t.includes("recht")) return { id: "wohnen", label: "🏠 Wohnen" };
  return null;
}

export function TodayB2Praxis({ plan }: { plan: DayPlan }) {
  const themen = useMemo(() => {
    const set = new Map<string, { theme: string; bamf: { id: string; label: string } | null; id: string }>();
    for (const tk of plan.tasks) {
      let theme: string | undefined;
      let id: string | undefined;
      if (tk.textId) {
        const txt = getText(tk.textId) as any;
        if (txt) { theme = txt.theme ?? txt.titleDe; id = txt.id; }
      } else if (tk.dialogueId) {
        const dlg = getDialogue(tk.dialogueId) as any;
        if (dlg) { theme = dlg.theme ?? dlg.titleDe; id = dlg.id; }
      }
      if (theme && id && !set.has(id)) {
        set.set(id, { theme, bamf: bamfForTheme(theme), id });
      }
    }
    return [...set.values()];
  }, [plan]);

  if (themen.length === 0) return null;

  // Show up to 3 B2-Themen today
  const bamfChips = [...new Set(themen.map((t) => t.bamf?.label).filter(Boolean) as string[])];

  return (
    <section className="card" data-testid="today-b2-praxis" style={{ padding: "0.7rem 0.95rem", background: "linear-gradient(135deg, #F0FDF4, #FFFBEB)", borderInlineStart: "4px solid #22c55e", display: "grid", gap: "0.4rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 900, color: "#14532d", fontSize: "0.88rem" }}>🌿 B2-Praxis heute im Fokus</span>
        <span className="chip" style={{ fontSize: "0.7rem", background: "#22c55e", color: "#fff", fontWeight: 800 }}>BAMF verknüpft</span>
        {bamfChips.length > 0 && <span style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>{bamfChips.join(" · ")}</span>}
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {themen.slice(0, 3).map((t) => (
          <span key={t.id} className="chip" style={{ fontSize: "0.76rem", background: "var(--color-paper2)" }}>
            <span dir="ltr" style={{ fontWeight: 700 }}>{t.theme}</span>
            {t.bamf && <Link href={`/ueben?filter=${t.bamf.id}`} style={{ marginInlineStart: "0.35rem", color: "#1d4ed8", fontWeight: 800, textDecoration: "underline" }}>→ {t.bamf.label}</Link>}
          </span>
        ))}
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", lineHeight: 1.7 }}>
        نفس هذه المواضيع تعمل فوراً في <Link href="/ueben" style={{ fontWeight: 800, color: "#15803d" }}>تدرّب → 🌍 الحياة</Link> (فلتر BAMF) — واليوم تطبّقها في <strong>الخطوة 3: Hören & Lesen</strong> مع 7 Konnektoren ملوّنة.
      </div>
    </section>
  );
}
