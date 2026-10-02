"use client";
/**
 * 🧩 مفكِّك المركَّبات — KompositaWerkstatt
 *  تدريبُ مهارةٍ لا حفظُ درس: تُعرَضُ كلمةٌ مركَّبةٌ طويلة، يُطلَبُ من المتعلِّم
 *  (١) أن يخمِّنَ الجنسَ — ولا سبيلَ إلا أن يجدَ Grundwort،
 *  (٢) ثم يرى التفكيكَ كاملاً مع أحرفِ الوصل والمعنى.
 *  كلُّ مهمةٍ من معجمِ البطاقاتِ نفسِه، ولا سؤالَ عن كلمةٍ لا نعرفُ جوابَها بثقة.
 */
import { useMemo, useState } from "react";
import type { Level } from "@/lib/types";
import { alleVokabeln } from "@/lib/content";
import { baueLexikon, baueAufgaben, erklaereAr, zerlege, type KompositaAufgabe } from "@/lib/komposita";
import { addFehlerNow, logKN } from "@/lib/store";
import { De } from "./De";

const ART_FARBE: Record<string, string> = { der: "var(--color-b1)", die: "var(--color-cola)", das: "var(--color-ok)" };

export function KompositaWerkstatt({ level, seed, anzahl = 6 }: { level: Level; seed: number; anzahl?: number }) {
  const lex = useMemo(() => baueLexikon(alleVokabeln), []);
  const aufgaben = useMemo(() => baueAufgaben(alleVokabeln, lex, level, anzahl, seed), [lex, level, anzahl, seed]);
  const [idx, setIdx] = useState(0);
  const [wahl, setWahl] = useState<string | null>(null);
  const [richtig, setRichtig] = useState(0);
  const [frei, setFrei] = useState("");

  const a: KompositaAufgabe | undefined = aufgaben[idx];
  const fertig = idx >= aufgaben.length;

  const antworte = (art: string) => {
    if (!a || wahl) return;
    setWahl(art);
    const ok = art === a.article;
    if (ok) setRichtig((r) => r + 1);
    logKN("Wortschatz", ok);
    if (!ok) {
      addFehlerNow({
        falsch: `${art} ${a.wort}`,
        richtig: `${a.article} ${a.wort}`,
        art: "genus",
        ar: `الجنسُ من الكلمةِ الأخيرة: ${erklaereAr(a.zerlegung)}`,
        quelle: "مفكّك المركّبات",
      });
    }
  };

  const weiter = () => { setIdx((i) => i + 1); setWahl(null); };

  const freiZ = frei.trim().length >= 6 ? zerlege(frei, lex) : null;

  return (
    <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper2)" }} data-testid="komposita">
      <div style={{ fontWeight: 800, marginBottom: "0.2rem" }}>🧩 مفكِّك المركَّبات — Komposita</div>
      <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginBottom: "0.7rem" }}>
        العربيةُ لا مركَّباتَ فيها، فهذه مهارةٌ تُدرَّب: <strong>الكلمةُ الأخيرةُ تعطي الجنسَ والمعنى</strong>، وما قبلَها يُخصِّص.
        لا تحفظ الكلمةَ الطويلة — فُكَّها.
      </div>

      {!fertig && a ? (
        <div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)" }}>
            {idx + 1} / {aufgaben.length} · {a.level}
          </div>
          <div data-testid="komp-wort" style={{ margin: "0.3rem 0 0.6rem" }}>
            <De style={{ display: "block", fontSize: "1.5rem", fontWeight: 900, letterSpacing: "0.01em" }}>___ {a.wort}</De>
          </div>
          <div style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>ما جنسُها؟ ابحث عن الكلمةِ الأخيرة أوّلاً.</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {a.optionen.map((o) => (
              <button
                key={o}
                className="btn"
                disabled={!!wahl}
                onClick={() => antworte(o)}
                style={{
                  minHeight: "44px", minWidth: "5rem", fontWeight: 800,
                  background: wahl ? (o === a.article ? "var(--color-ok-soft)" : o === wahl ? "var(--color-cola-soft)" : "white") : "white",
                  borderColor: wahl && o === a.article ? "var(--color-ok)" : undefined,
                  color: ART_FARBE[o],
                }}
              >
                {o}
              </button>
            ))}
          </div>

          {wahl && (
            <div style={{ marginTop: "0.8rem" }} data-testid="komp-loesung">
              <div style={{ fontWeight: 800, color: wahl === a.article ? "var(--color-ok)" : "var(--color-cola)" }}>
                {wahl === a.article ? "✓ صحيح" : `✗ الصواب: ${a.article}`} — <De>{a.article} {a.wort}</De> · {a.ar}
              </div>
              {/* سلسلة التفكيك البصرية */}
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center", margin: "0.5rem 0" }}>
                {a.zerlegung.teile.map((t, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{
                      padding: "0.3rem 0.6rem", borderRadius: "8px", background: "var(--color-card)",
                      border: `2px solid ${t.grund ? "var(--color-gold)" : "var(--color-line)"}`,
                      fontWeight: t.grund ? 900 : 600,
                    }}>
                      <De>{t.article ? `${t.article} ` : ""}{t.lemma}</De>
                      {t.ar && <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-ink2)" }}>{t.ar.split(/[:：]/)[0].slice(0, 22)}</span>}
                      {t.grund && <span style={{ display: "block", fontSize: "0.68rem", color: "var(--color-gold)" }}>Grundwort ← الجنس</span>}
                    </span>
                    {t.fuge && <span className="chip" title="حرف الوصل — Fugenelement" style={{ fontSize: "0.72rem" }}>‹{t.fuge}›</span>}
                    {i < a.zerlegung.teile.length - 1 && <span style={{ fontWeight: 900 }}>+</span>}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>{erklaereAr(a.zerlegung)}</div>
              <button className="btn btn-primary" onClick={weiter} style={{ marginTop: "0.6rem", minHeight: "44px" }}>
                {idx + 1 < aufgaben.length ? "التالي ←" : "أنهِ الجولة"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div data-testid="komp-fertig">
          <strong>✅ انتهت الجولة: {richtig} / {aufgaben.length}</strong>
          <div style={{ fontSize: "0.82rem", color: "var(--color-ink2)", marginTop: "0.25rem" }}>
            {richtig === aufgaben.length
              ? "عينُك تجدُ Grundwort تلقائياً — هذه هي المهارة."
              : "كلُّ خطأٍ دخلَ دفترَ الأخطاءِ بتفكيكِه، وسيعودُ إليك في موعدِه."}
          </div>
        </div>
      )}

      {/* ── فكّ كلمة من عندك ── */}
      <div style={{ marginTop: "1rem", paddingTop: "0.7rem", borderTop: "1px solid var(--color-line)" }}>
        <label htmlFor="komp-frei" style={{ fontSize: "0.82rem", fontWeight: 700 }}>فُكَّ كلمةً صادفتَها:</label>
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
          <input id="komp-frei" className="field" dir="ltr" value={frei} onChange={(e) => setFrei(e.target.value)} placeholder="z. B. Wohnungsmarkt" style={{ flex: 1, minWidth: "10rem", minHeight: "44px" }} />
        </div>
        {freiZ && (
          <div style={{ fontSize: "0.82rem", marginTop: "0.4rem" }} data-testid="komp-frei-ergebnis">
            {freiZ.teile.length >= 2
              ? <>🧩 {erklaereAr(freiZ)}</>
              : <span style={{ color: "var(--color-ink2)" }}>{erklaereAr(freiZ)} <em>(المعجمُ هنا هو بطاقاتُك — ما لم تتعلَّمْه بعدُ لا أُخمِّنُه.)</em></span>}
          </div>
        )}
      </div>
    </div>
  );
}
