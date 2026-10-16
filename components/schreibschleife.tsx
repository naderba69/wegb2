"use client";
/**
 * 🔁 M5/R185 — حلقة الكتابة: مسودّة ← تصحيح (محلي/اختياري بمفتاحك) ←
 * إعادة كتابة ← مقارنة نسختين بالفرق الكلمي. النسختان محفوظتان في
 * تقدّمك المحلي فقط (آخر ٨ حلقات)، والمقارنة وصفٌ لما تغيّر — لا
 * ادّعاء أنّ النسخة الثانية «صحيحة» ولا أنّ التصحيح بشري.
 */
import { useMemo, useState } from "react";
import { useProgress } from "@/lib/store";
import { wortDiff, diffStatistik } from "@/lib/textdiff";

const MAX_LOOPS = 8;

export function SchreibSchleife({ taskId, v1 }: { taskId: string; v1: string }) {
  const { progress, update } = useProgress();
  const [laufId, setLaufId] = useState<string | null>(null);
  const [v2, setV2] = useState("");
  const [phase, setPhase] = useState<"start" | "schreiben" | "vergleich">("start");

  const lauf = useMemo(
    () => progress.schreibEntwuerfe?.find((e) => e.id === laufId),
    [progress.schreibEntwuerfe, laufId],
  );
  const diff = useMemo(
    () => (lauf?.v2 ? wortDiff(lauf.v1, lauf.v2) : []),
    [lauf],
  );
  const statistik = useMemo(
    () => (lauf?.v2 ? diffStatistik(lauf.v1, lauf.v2) : null),
    [lauf],
  );

  const beginnen = () => {
    const id = `sl-${taskId}-${Date.now()}`;
    update((p) => ({
      ...p,
      schreibEntwuerfe: [
        { id, taskId, datum: new Date().toISOString().slice(0, 10), v1 },
        ...(p.schreibEntwuerfe ?? []),
      ].slice(0, MAX_LOOPS),
    }));
    setLaufId(id);
    setV2(v1);
    setPhase("schreiben");
  };

  const speichernV2 = () => {
    if (!laufId || v2.trim().length < 10) return;
    update((p) => ({
      ...p,
      schreibEntwuerfe: (p.schreibEntwuerfe ?? []).map((e) =>
        e.id === laufId ? { ...e, v2 } : e,
      ),
    }));
    setPhase("vergleich");
  };

  if (phase === "start") {
    return (
      <div style={{ marginTop: "0.7rem", borderTop: "1px dashed var(--color-line, #ccc)", paddingTop: "0.6rem" }}>
        <button type="button" className="btn btn-gold" onClick={beginnen}>
          🔁 احفظ المسودّة وابدأ إعادة الكتابة (حلقة M5)
        </button>
        <p className="tiny muted" style={{ margin: "0.35rem 0 0", lineHeight: 1.9 }}>
          ستُحفظ مسودّتك في جهازك، تعيد كتابتها بعد مراجعة المؤشرات والتصحيح أعلاه،
          ثم ترى الفرق بين النسختين كلمةً كلمة. الحفظ محلي فقط، والمقارنة تصف ما تغيّر — لا تحكم أنّ التغيير صواب.
        </p>
      </div>
    );
  }

  if (phase === "schreiben") {
    return (
      <div style={{ marginTop: "0.7rem", borderTop: "1px dashed var(--color-line, #ccc)", paddingTop: "0.6rem" }} data-testid="schreibschleife">
        <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>✍️ إعادة الكتابة — النسخة الثانية</div>
        <p className="tiny muted" style={{ margin: "0 0 0.4rem", lineHeight: 1.9 }}>
          بدأت من مسودّتك؛ طبّق ما اقترحته المؤشرات المحلية (والتصحيح المولّد بمفتاحك إن فعّلته — وهو ليس تصحيحًا بشريًا).
        </p>
        <textarea
          className="field"
          rows={9}
          dir="ltr"
          style={{ lineHeight: 1.8, width: "100%" }}
          value={v2}
          onChange={(e) => setV2(e.target.value)}
          aria-label="النسخة الثانية"
        />
        <div style={{ fontSize: "0.85rem", margin: "0.3rem 0" }}>
          {v2.trim().split(/\s+/).filter(Boolean).length} كلمة
        </div>
        <button type="button" className="btn btn-primary" disabled={v2.trim().length < 10} onClick={speichernV2}>
          احفظ النسخة الثانية وقارن →
        </button>
      </div>
    );
  }

  // vergleich
  return (
    <div style={{ marginTop: "0.7rem", borderTop: "1px dashed var(--color-line, #ccc)", paddingTop: "0.6rem" }} data-testid="schreibschleife-vergleich">
      <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🔍 مقارنة النسختين</div>
      {statistik && (
        <p style={{ fontSize: "0.9rem", margin: "0 0 0.5rem", lineHeight: 1.9 }}>
          الأولى {statistik.woerterV1} كلمة ← الثانية {statistik.woerterV2} كلمة ·
          بقي {statistik.gleich} · حُذف {statistik.entfernt} · أُضيف {statistik.hinzugefuegt} ·
          نسبة الكلمات المتغيّرة {Math.round(statistik.geaendertAnteil * 100)}٪ (وصف للتغيير، لا درجة صواب)
        </p>
      )}
      <article dir="ltr" style={{ background: "var(--color-paper2)", padding: "0.8rem", borderRadius: "0.6rem", lineHeight: 2, textAlign: "left" }}>
        {diff.map((s, i) =>
          s.art === "gleich" ? (
            <span key={i}>{s.text} </span>
          ) : s.art === "weg" ? (
            <span key={i} style={{ background: "#f8d7da", textDecoration: "line-through", borderRadius: "3px", padding: "0 2px" }}>{s.text} </span>
          ) : (
            <span key={i} style={{ background: "#d4edda", borderRadius: "3px", padding: "0 2px" }}>{s.text} </span>
          ),
        )}
      </article>
      <p className="tiny muted" style={{ margin: "0.4rem 0 0" }}>
        <span style={{ background: "#f8d7da", padding: "0 3px", borderRadius: "3px" }}>محذوف من الأولى</span>{" "}
        <span style={{ background: "#d4edda", padding: "0 3px", borderRadius: "3px" }}>مضاف في الثانية</span>{" "}
        — النسختان محفوظتان في تقدّمك على هذا الجهاز (آخر {MAX_LOOPS} حلقات) ولا تغادرانه.
      </p>
    </div>
  );
}
