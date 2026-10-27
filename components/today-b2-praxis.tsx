"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useProgress } from "@/lib/store";
import { buildDay } from "@/lib/plan";
import { texts as alleTexte, writingTasks as alleWriting } from "@/lib/content";

const BAMF_MAP: Record<string, { id: string; label: string; emoji: string; filter: string }> = {
  wohnen: { id: "wohnen", label: "السكن", emoji: "🏠", filter: "wohnen" },
  behoerde: { id: "behoerde", label: "الجهات الرسمية", emoji: "🏛️", filter: "behoerde" },
  gesundheit: { id: "gesundheit", label: "الصحة", emoji: "🏥", filter: "gesundheit" },
  arbeit: { id: "arbeit", label: "العمل", emoji: "💼", filter: "arbeit" },
  familie: { id: "familie", label: "العائلة", emoji: "👨‍👩‍👧", filter: "familie" },
  mobilitaet: { id: "mobilitaet", label: "التنقّل", emoji: "🚃", filter: "mobilitaet" },
  alltag: { id: "alltag", label: "الحياة اليومية", emoji: "📅", filter: "alltag" },
};

// خريطة موضوعات النصوص/الحوارات إلى BAMF — تبسيط عملي
function bamfForTask(titleDe: string): (typeof BAMF_MAP)[string] | null {
  const l = titleDe.toLowerCase();
  if (l.includes("wohnung") || l.includes("miete") || l.includes("haus")) return BAMF_MAP.wohnen;
  if (l.includes("amt") || l.includes("behörde") || l.includes("anmeldung") || l.includes("visum")) return BAMF_MAP.behoerde;
  if (l.includes("arzt") || l.includes("krank") || l.includes("apotheke")) return BAMF_MAP.gesundheit;
  if (l.includes("arbeit") || l.includes("bewerbung") || l.includes("job") || l.includes("betrieb")) return BAMF_MAP.arbeit;
  if (l.includes("kind") || l.includes("familie") || l.includes("kita") || l.includes("schule")) return BAMF_MAP.familie;
  if (l.includes("ticket") || l.includes("bahn") || l.includes("verkehr") || l.includes("führerschein")) return BAMF_MAP.mobilitaet;
  return BAMF_MAP.alltag;
}

export function TodayB2Praxis() {
  const { progress } = useProgress();
  const plan = useMemo(() => buildDay(progress.plan.day, progress), [progress]);
  const b2Counts = useMemo(() => {
    const b2Texte = (alleTexte as any[]).filter((t:any)=>t.level==="B2");
    const b2Write = (alleWriting as any[]).filter((w:any)=>w.level==="B2");
    // B2 texts 250-500w approximation: text length proxy
    const long = b2Texte.filter((t:any)=> (t.wortCount?? (t.text??"").split(/\s+/).length) >= 180).length;
    return { b2Texte: b2Texte.length, b2Write: b2Write.length, long };
  }, []);
  const themes = useMemo(() => {
    const seen = new Set<string>();
    const out: { taskId: string; titleDe: string; bamf: (typeof BAMF_MAP)[string] }[] = [];
    for (const t of plan.tasks) {
      const b = bamfForTask(t.titleDe);
      if (b && !seen.has(b.id)) {
        seen.add(b.id);
        out.push({ taskId: t.id, titleDe: t.titleDe, bamf: b });
      }
      if (out.length >= 4) break;
    }
    return out;
  }, [plan]);

  if (themes.length === 0) return null;

  return (
    <section
      data-testid="today-b2-praxis"
      className="card"
      style={{
        padding: "0.8rem 1rem",
        background: "linear-gradient(180deg, #FFFCF0, #FDF8E8)",
        borderInlineStart: "5px solid var(--color-b2)",
        display: "grid",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <div style={{ fontWeight: 900, color: "#0F2A44" }}>🌍 B2-Praxis heute — مواقف حياتية حقيقية</div>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, background: "#4A148C", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>B2 {b2Counts.b2Texte} نصوص · {b2Counts.b2Write} كتابة · {b2Counts.long} 250-500w</span>
      </div>
      <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", lineHeight: 1.8 }}>
        كل مهمة مرتبطة بميدان BAMF — اضغط للانتقال إلى التدريب المصفّى حسب المجال.
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {themes.map(({ taskId, titleDe, bamf }) => (
          <Link
            key={taskId}
            href={`/ueben?filter=${bamf.filter}`}
            data-testid={`today-b2-praxis-${bamf.id}`}
            className="chip"
            style={{
              textDecoration: "none",
              background: "var(--color-paper)",
              borderColor: "var(--color-line)",
              fontWeight: 800,
              minHeight: "36px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
            title={titleDe}
          >
            <span>{bamf.emoji}</span> {bamf.label} · {titleDe.slice(0, 28)}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", fontSize: "0.75rem" }}>
        <Link href="/ueben?filter=b2" className="chip" style={{ textDecoration: "none", background: "var(--color-paper)", minHeight: "32px", display: "inline-flex", alignItems: "center", fontWeight: 800 }}>✍️ كتابة B2: 250-500 كلمة (Goethe)</Link>
        <Link href="/pruefen?typ=lesen" className="chip" style={{ textDecoration: "none", background: "var(--color-paper)", minHeight: "32px", display: "inline-flex", alignItems: "center", fontWeight: 800 }}>📖 قراءة B2 — 30د</Link>
        <Link href="/pruefen?typ=hoeren" className="chip" style={{ textDecoration: "none", background: "var(--color-paper)", minHeight: "32px", display: "inline-flex", alignItems: "center", fontWeight: 800 }}>🎧 استماع B2 — 30/100P</Link>
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--ui-muted)" }}>
        13 Lebenswelt-Karten في <Link href="/ueben">تدرّب → Lebenswelt</Link> · BAMF I-VI Handlungsfelder · Verifikation D+3
      </div>
    </section>
  );
}
