"use client";
// ✍️ Schreib-Werkstatt — كتابة بتوقيت امتحان (Teil 1: 15د · Teil 2: 28د) مع مستشار الكتابة
import { useEffect, useMemo, useState } from "react";
import type { Progress, Schreibaufgabe } from "@/lib/types";
import { TOTAL_DAYS } from "@/lib/types";
import { writingTasks } from "@/lib/content";
import { levelOf, pickN, rng } from "@/lib/plan";
import { useProgress } from "@/lib/store";
import { checkAbzeichen } from "@/lib/spiel";
import { logK } from "@/lib/kompetenz";
import { SchreibBerater } from "./lehrer";
import { De } from "./De";

type Teil = "T1" | "T2" | "T3";
const TEIL_CFG: Record<Teil, { minutes: number; ziel: number; label: string }> = {
  T1: { minutes: 15, ziel: 40, label: "Teil 1 — E-Mail/Kurztext (الهدف ≥40 كلمة)" },
  T2: { minutes: 28, ziel: 80, label: "Teil 2 — Aufsatz/Meinung (الهدف ≥80 كلمة)" },
  T3: { minutes: 75, ziel: 150, label: "Teil 3 — Meinungsforum على قياس Goethe (75 دقيقة · ≥150 كلمة)" },
};

export function SchreibWerkstatt({ progress }: { progress: Progress }) {
  const { update } = useProgress();
  const level = levelOf(Math.min(progress.plan.day, TOTAL_DAYS));
  const [teil, setTeil] = useState<Teil | null>(null);
  const [task, setTask] = useState<Schreibaufgabe | null>(null);
  const [text, setText] = useState("");
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [left, setLeft] = useState(0);
  const [done, setDone] = useState(false);

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const cfg = teil ? TEIL_CFG[teil] : null;

  useEffect(() => {
    if (!teil || done) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [teil, done]);

  const start = (t: Teil) => {
    const pool = t === "T3" ? writingTasks.filter((w) => w.level === "B2") : writingTasks.filter((w) => w.level === level);
    const seed = (Date.now() % 2147483647) + (t === "T1" ? 11 : t === "T2" ? 23 : 37);
    setTask(pickN(pool, 1, rng(seed))[0] ?? pool[0]);
    setTeil(t);
    setLeft(TEIL_CFG[t].minutes * 60);
    setText("");
    setChecks({});
    setDone(false);
  };

  const abschliessen = () => {
    setDone(true);
    update((p) =>
      logK(
        checkAbzeichen({
          ...p,
          xp: (p.xp ?? 0) + 15 + (words >= (cfg?.ziel ?? 40) ? 5 : 0),
        }),
        "Schreiben",
        words >= (cfg?.ziel ?? 40) * 0.8
      )
    );
  };

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const criteria = task?.criteria ?? [];

  if (!teil)
    return (
      <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
        <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>✍️ Schreib-Werkstatt — كتابة بتوقيت الامتحان</div>
        <div style={{ fontSize: "0.85rem", color: "var(--color-ink2)", marginBottom: "0.5rem" }}>
          مهمة من بنك كتابتك (مستوى {level}) + مؤقّت رسمي + معايير Goethe + مستشار الكتابة في النهاية.
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => start("T1")}>⏱ Teil 1 — 15 دقيقة</button>
          <button className="btn btn-gold" onClick={() => start("T2")}>⏱ Teil 2 — 28 دقيقة</button>
          <button className="btn btn-primary" onClick={() => start("T3")}>⏱ Teil 3 — 75 دقيقة · Goethe-Forum</button>
        </div>
      </div>
    );

  return (
    <div className="card" style={{ padding: "0.9rem 1rem", background: "var(--color-paper2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
        <strong>✍️ {cfg!.label}</strong>
        {!done && (
          <span className="rtl-num" style={{ fontWeight: 900, fontSize: "1.1rem", color: left < 120 ? "var(--color-cola)" : undefined }}>
            ⏱ {mmss}
          </span>
        )}
      </div>
      {task && (
        <>
          <div className="card" style={{ padding: "0.7rem 0.9rem", margin: "0.5rem 0", background: "var(--color-gold-soft)" }}>
            <De>{task.taskDe}</De>
            <div style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>{task.taskAr}</div>
          </div>
          <textarea
            className="field"
            rows={8}
            dir="ltr"
            style={{ lineHeight: 1.8, width: "100%" }}
            placeholder="Schreibe hier … (der Timer läuft!)"
            value={text}
            disabled={done}
            onChange={(e) => setText(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", margin: "0.3rem 0", flexWrap: "wrap" }}>
            <span className="rtl-num" style={{ color: words >= cfg!.ziel ? "var(--color-a1)" : "var(--color-cola)", fontWeight: 700 }}>
              {words} / {cfg!.ziel} كلمة
            </span>
            {left === 0 && !done && <strong style={{ color: "var(--color-cola)" }}>⏰ انتهى الوقت — سلّم الآن!</strong>}
          </div>
          <div style={{ fontWeight: 700, margin: "0.4rem 0 0.2rem" }}>معايير التقييم الذاتي:</div>
          {criteria.map((c, i) => (
            <label key={c} style={{ display: "flex", gap: "0.5rem", cursor: done ? "default" : "pointer", margin: "0.15rem 0" }}>
              <input type="checkbox" checked={!!checks[i]} disabled={done} onChange={() => setChecks((ch) => ({ ...ch, [i]: !ch[i] }))} />
              <span>{c}</span>
            </label>
          ))}
          {!done ? (
            <button className="btn btn-primary" style={{ marginTop: "0.6rem" }} disabled={words < 15} onClick={abschliessen}>
              سلّمت النص ✓
            </button>
          ) : (
            <div className="fadein" style={{ marginTop: "0.6rem" }}>
              <strong>
                ✅ التقييم الذاتي: <span className="rtl-num">{Object.values(checks).filter(Boolean).length}</span>/
                <span className="rtl-num">{criteria.length}</span> معايير
              </strong>
              <details style={{ marginTop: "0.5rem" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>نموذج الإجابة للمقارنة</summary>
                <article className="de" style={{ display: "block", background: "var(--color-paper2)", padding: "0.8rem", borderRadius: "0.6rem", marginTop: "0.4rem", lineHeight: 1.85 }}>
                  {task.sample}
                </article>
                {task.noteAr && task.noteAr.length > 0 ? (
                  <ul style={{ margin: "0.55rem 0 0", paddingInlineStart: "1.2rem", fontSize: "0.86rem", color: "var(--color-ink2)", lineHeight: 1.85 }}>
                    <li style={{ listStyle: "none", marginInlineStart: "-1.2rem", fontWeight: 800 }}>🧑‍🏫 لماذا نموذج؟</li>
                    {task.noteAr.map((nn, ni) => (<li key={ni}>{nn}</li>))}
                  </ul>
                ) : null}
              </details>
              <SchreibBerater text={text} taskDe={task.taskDe} />
              <button className="btn btn-ghost" style={{ marginTop: "0.6rem" }} onClick={() => setTeil(null)}>
                ← جولة جديدة
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
