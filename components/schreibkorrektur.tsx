"use client";
// ✍️ التصحيح ثلاثيّ الأعمدة + الحلقة العلاجية: خطأ ← قاعدة ← ثلاثة تمارين ← دفتر الأخطاء
import { useMemo, useState } from "react";
import { De } from "@/components/De";
import { loadProgress, saveProgress, disputeRegel } from "@/lib/store";
import { upsertFehler } from "@/lib/fehler";
import { grammarMap } from "@/lib/content";
import {
  pruefeText, pruefeBrief, bewerteSchreiben, heilUebungen, effektiveSchwere, DISPUT_SCHWELLE,
  SPALTE_AR, SCHWERE_AR, type Befund, type Spalte,
} from "@/lib/schreibpruefer";

const SPALTEN: Spalte[] = ["grammatik", "syntax", "wortwahl"];
const FARBE: Record<Spalte, string> = { grammatik: "#be123c", syntax: "#b45309", wortwahl: "#1d4ed8" };

export default function SchreibKorrektur({ minWoerter = 50, aufgabeAr, level = "B1" }: { minWoerter?: number; aufgabeAr?: string; level?: "A0"|"A1"|"A2"|"B1"|"B2" }) {
  const [text, setText] = useState("");
  const [geprueft, setGeprueft] = useState(false);
  const befunde = useMemo(() => {
    if (!geprueft) return [];
    const alle = [...pruefeText(text), ...pruefeBrief(text, minWoerter)];
    // K-StilLayer: طبقة الأسلوب لا تُفعَّل قبل B1 (لا إحباط مبكر على الأناقة)
    if (level === "A0" || level === "A1" || level === "A2") return alle.filter((b) => b.schwere !== "stil");
    return alle;
  }, [geprueft, text, minWoerter, level]);
  const [disputes, setDisputes] = useState<Record<string, number>>(() => loadProgress().disputiert ?? {});
  const eff = useMemo(() => befunde.map((b) => ({ ...b, orig: b.schwere, schwere: effektiveSchwere(b, disputes) })), [befunde, disputes]);
  const note = bewerteSchreiben(befunde, disputes);
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;

  const insDefter = () => {
    let p = loadProgress();
    for (const f of eff.filter((x) => x.schwere !== "stil")) {
      p = upsertFehler(p, {
        falsch: f.stelle, richtig: f.vorschlagDe ?? "—", ar: f.meldungAr,
        art: f.spalte === "syntax" ? "wortstellung" : f.spalte === "wortwahl" ? "wortschatz" : "konstruktion",
        quelle: "Schreibkorrektur",
      });
    }
    saveProgress(p);
    setGespeichert(true);
  };
  const [gespeichert, setGespeichert] = useState(false);

  return (
    <section className="card" data-test="schreibkorrektur" style={{ padding: "1rem 1.2rem", display: "grid", gap: "0.6rem" }}>
      <h3 style={{ margin: 0 }}>✍️ التصحيح ثلاثيّ الأعمدة</h3>
      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-ink2)", background: "var(--color-warn-soft, #fff7ed)", padding: "0.45rem 0.6rem", borderRadius: "0.5rem", border: "1px dashed var(--color-warn, #f59e0b)" }}>
        ⚠️ هذا كاشف أنماط يرى الشكل ولا يرى المعنى — يلتقط الأخطاءَ التركيبية والصرفية والهجائية، لكنّه لا يفهم قصدك ولا يقيّم جودة الأفكار.
      </p>
      {aufgabeAr && <p style={{ margin: 0, fontSize: "0.88rem" }}>{aufgabeAr}</p>}
      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-ink2)" }}>
        اكتب نصّك ثم اضغط «صحِّح». <strong>هذا كاشفُ أنماطٍ يرى الشكل ولا يرى المعنى</strong> — يلتقط ما بُرمِج له فقط.
      </p>

      <textarea
        dir="ltr" rows={7} value={text} onChange={(e) => { setText(e.target.value); setGeprueft(false); setGespeichert(false); }}
        placeholder="Sehr geehrte Damen und Herren, …"
        style={{ width: "100%", padding: "0.5rem", fontSize: "0.95rem", borderRadius: "0.5rem" }}
      />
      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => setGeprueft(true)} disabled={!text.trim()}>🔍 صحِّح</button>
        <span style={{ fontSize: "0.84rem", color: woerter < minWoerter ? "#be123c" : "#15803d" }}>
          الكلمات: {woerter} / {minWoerter}
        </span>
        {geprueft && <span data-test="note" style={{ fontWeight: 900 }}>الدرجة: {note}/100</span>}
      </div>

      {geprueft && (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <thead>
                <tr>
                  {SPALTEN.map((s) => (
                    <th key={s} style={{ borderBottom: `3px solid ${FARBE[s]}`, color: FARBE[s], padding: "0.4rem", textAlign: "start", width: "33%" }}>
                      {SPALTE_AR[s]} ({eff.filter((b) => b.spalte === s).length})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {SPALTEN.map((s) => (
                    <td key={s} style={{ verticalAlign: "top", padding: "0.4rem", borderInlineEnd: "1px solid var(--color-line)" }}>
                      {eff.filter((b) => b.spalte === s).length === 0 && <span style={{ color: "#15803d" }}>✓ لا شيء</span>}
                      {eff.filter((b) => b.spalte === s).map((b, i) => (
                        <div key={i} style={{ marginBottom: "0.5rem" }}>
                          <div>{SCHWERE_AR[b.schwere]} <De style={{ fontWeight: 700 }}>{b.stelle}</De></div>
                          <div style={{ color: "var(--color-ink2)" }}>{b.meldungAr}</div>
                          {b.vorschlagDe && <div>↩ <De style={{ color: "#15803d" }}>{b.vorschlagDe}</De></div>}
                          {b.regelId && grammarMap[b.regelId] && (
                            <div style={{ fontSize: "0.78rem" }}>📘 القاعدة: {grammarMap[b.regelId].titleAr}</div>
                          )}
                          {b.orig !== b.schwere && (
                            <div data-test="disput-hinweis" style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>⬇ خُفّضت حدّته بعد {DISPUT_SCHWELLE} اعتراضات — الكاشف يتعلّم منك.</div>
                          )}
                          {b.regelId && b.schwere !== "stil" && (
                            <button className="chip" style={{ cursor: "pointer", marginTop: "0.25rem" }} data-test={`disput-${b.regelId}`} onClick={() => { disputeRegel(b.regelId!); setDisputes(loadProgress().disputiert ?? {}); }}>
                              🤔 ليس خطأً؟{(disputes[b.regelId] ?? 0) > 0 ? ` (${disputes[b.regelId]})` : ""}
                            </button>
                          )}
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {eff.filter((b) => b.schwere !== "stil").slice(0, 3).map((b, i) => (
            <div key={i} className="card" style={{ padding: "0.5rem 0.7rem", background: "var(--color-paper2)", fontSize: "0.84rem" }}>
              <div style={{ fontWeight: 800 }}>🛠️ علاجُ «{b.stelle}»</div>
              <ol style={{ margin: "0.2rem 1rem" }}>
                {heilUebungen(b).map((u, j) => <li key={j}>{u}</li>)}
              </ol>
            </div>
          ))}

          {eff.some((b) => b.schwere !== "stil") && (
            <button className="btn" onClick={insDefter} disabled={gespeichert}>
              {gespeichert ? "✅ أُضيفت إلى دفتر الأخطاء" : "📓 أضِف الأخطاء إلى دفتري (تعود بعد ٣ أيام)"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
