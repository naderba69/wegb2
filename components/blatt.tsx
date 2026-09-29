"use client";
// 🖨️ ورقة العمل الأسبوعية (Arbeitsblatt) — قابلة للطباعة، حتمية من خطة الأسبوع
import { useState } from "react";
import type { Progress } from "@/lib/types";
import { buildDay, levelOf, pickN, rng } from "@/lib/plan";
import { grammarMap, sentences, writingTasks, getDeck } from "@/lib/content";

export function ArbeitsblattButton({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn btn-gold weg-print-hide" style={{ marginTop: "0.7rem" }} onClick={() => setOpen(true)}>
        🖨️ ورقة عمل الأسبوع (Arbeitsblatt) — للطباعة
      </button>
      {open && <Arbeitsblatt progress={progress} onClose={() => setOpen(false)} />}
    </>
  );
}

function Arbeitsblatt({ progress, onClose }: { progress: Progress; onClose: () => void }) {
  const day = Math.min(progress.plan.day, 270);
  const week = Math.ceil(day / 7);
  const start = (week - 1) * 7 + 1;
  const level = levelOf(day);
  const calm: Progress = { ...progress, plan: { ...progress.plan, debt: [] }, weak: {} };
  const p1 = buildDay(start, calm);
  const p3 = buildDay(Math.min(start + 2, 270), calm);
  const topicA = p1.tasks.find((t) => t.kind === "grammatik")?.topicId;
  const topicB = p3.tasks.find((t) => t.kind === "grammatik")?.topicId;
  const deckId = p1.tasks.find((t) => t.kind === "wortschatz")?.deckId;
  const rand = rng(week * 613 + 5);
  const words = pickN(getDeck(deckId ?? "")?.cards ?? [], 10, rand);
  const saetze = pickN(sentences.filter((s) => s.level === level), 4, rand);
  const aufgabe = pickN(writingTasks.filter((w) => w.level === level), 1, rng(week * 29 + 3))[0];
  const gA = topicA ? grammarMap[topicA] : undefined;
  const gB = topicB ? grammarMap[topicB] : undefined;

  const GBlock = ({ g }: { g?: { titleDe: string; titleAr: string; rules: { de: string; ar: string }[]; examples: { de: string; ar: string }[] } }) =>
    g ? (
      <div style={{ marginBottom: "0.7rem" }}>
        <strong className="de">{g.titleDe}</strong> — <span style={{ fontSize: "0.85rem" }}>{g.titleAr}</span>
        <ol style={{ margin: "0.3rem 0 0", paddingInlineStart: "1.3rem", fontSize: "0.9rem", lineHeight: 1.7 }}>
          {g.rules.slice(0, 2).map((r) => (
            <li key={r.de}>
              <span className="de">{r.de}</span>
              <div style={{ fontSize: "0.8rem", color: "#444" }}>{r.ar}</div>
            </li>
          ))}
        </ol>
        {g.examples[0] && (
          <div style={{ fontSize: "0.88rem", margin: "0.25rem 0 0" }}>
            Beispiel: <span className="de">{g.examples[0].de}</span>
          </div>
        )}
      </div>
    ) : null;

  return (
    <div
      className="weg-print-hide"
      style={{ position: "fixed", inset: 0, background: "rgba(20,33,61,0.55)", zIndex: 50, overflow: "auto", padding: "1rem" }}
      onClick={onClose}
    >
      <style>{`@media print {
        body * { visibility: hidden !important; }
        .weg-arbeitsblatt, .weg-arbeitsblatt * { visibility: visible !important; }
        .weg-arbeitsblatt { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; max-height: none !important; overflow: visible !important; box-shadow: none !important; margin: 0 !important; }
        .weg-print-hide { display: none !important; }
      }`}</style>
      <div
        className="card weg-arbeitsblatt"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          maxWidth: "46rem",
          margin: "0 auto",
          padding: "1.4rem 1.6rem",
          lineHeight: 1.8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "3px solid var(--color-cola)", paddingBottom: "0.5rem", marginBottom: "0.8rem" }}>
          <div>
            <strong style={{ fontSize: "1.15rem" }}>🗂️ Arbeitsblatt — ورقة العمل الأسبوعية</strong>
            <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>
              Woche <span className="rtl-num">{week}</span> · Niveau {level} · طريقي إلى B2
            </div>
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            Name: ______________ · Datum: __________
          </div>
        </div>

        <Section title="A — Grammatik (القواعد)">
          <GBlock g={gA} />
          <GBlock g={gB} />
          <div style={{ fontSize: "0.88rem" }}>
            <strong>Aufgabe:</strong> اكتب جملة من إنشائك بكل قاعدة من الأعلى:
          </div>
          <Lines n={2} />
        </Section>

        <Section title="B — Wortschatz (المفردات)">
          <div className="grid2" style={{ gap: "0.3rem 1rem", fontSize: "0.92rem" }}>
            {words.map((w) => (
              <div key={w.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted #bbb", paddingBottom: "0.15rem" }}>
                <span className="de">
                  {w.article ? `${w.article} ` : ""}
                  {w.de}
                </span>
                <span style={{ color: "#888", minWidth: "7rem", textAlign: "end" }}>……………</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#666", marginTop: "0.25rem" }}>
            اكتب المعنى العربي في الفراغ (استعن ببطاقاتك إن لزم).
          </div>
        </Section>

        <Section title="C — Sätze übersetzen (ترجم)">
          {saetze.map((s, i) => (
            <div key={s.id} style={{ marginBottom: "0.4rem", fontSize: "0.92rem" }}>
              <span className="rtl-num">{i + 1}.</span> {s.ar}
              <Lines n={2} />
            </div>
          ))}
        </Section>

        <Section title="D — Schreiben (كتابة)">
          {aufgabe ? (
            <>
              <div style={{ fontSize: "0.92rem" }}>
                <strong className="de">{aufgabe.titleDe}</strong>
                <div style={{ fontSize: "0.85rem" }}>{aufgabe.taskAr}</div>
              </div>
              <Lines n={7} />
            </>
          ) : null}
        </Section>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#555", borderTop: "1px solid #ccc", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
          <span>✅ صحّح إجاباتك بالتطبيق نهاية الأسبوع (الحل في بطاقاتك ودفترك).</span>
          <span>توقيع وليّ الأمر: ______________</span>
        </div>

        <div className="weg-print-hide" style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.9rem" }}>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ اطبع / احفظ PDF</button>
          <button className="btn btn-ghost" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "0.9rem" }}>
      <h3 style={{ fontWeight: 800, fontSize: "0.98rem", margin: "0 0 0.35rem", color: "var(--color-cola)" }}>{title}</h3>
      {children}
    </section>
  );
}

function Lines({ n }: { n: number }) {
  return (
    <div style={{ margin: "0.3rem 0" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ borderBottom: "1px solid #999", height: "1.5rem" }} />
      ))}
    </div>
  );
}
