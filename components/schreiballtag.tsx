"use client";
// ✉️ A11 (R283): كتابة عملية يومية — نموذج يُكشف بعد محاولتك، وفحص ذاتي بقائمة، بلا درجات مُخترعة
import { useMemo, useState } from "react";
import { SCHREIB_ALLTAG } from "@/lib/schreiballtag";

const woerter = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

export function SchreibAlltag() {
  const [sel, setSel] = useState(SCHREIB_ALLTAG[0].id);
  const [texte, setTexte] = useState<Record<string, string>>({});
  const [musterOffen, setMusterOffen] = useState<Record<string, boolean>>({});
  const [haken, setHaken] = useState<Record<string, boolean>>({});
  const [fertig, setFertig] = useState<Record<string, boolean>>({});

  const item = useMemo(() => SCHREIB_ALLTAG.find((x) => x.id === sel) ?? SCHREIB_ALLTAG[0], [sel]);
  const text = texte[sel] ?? "";
  const w = woerter(text);
  const darfMuster = w >= 30;

  return (
    <div data-testid="schreiballtag" style={{ marginTop: "1rem", borderTop: "2px dashed var(--color-line)", paddingTop: "0.9rem" }}>
      <div style={{ fontWeight: 900 }}>✉️ كتابة عملية للحياة اليومية (A11) — {SCHREIB_ALLTAG.length} موقفًا</div>
      <p style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>
        رسائل الحياة الحقيقية لا الامتحان فقط. اكتب نصّك أولًا (30 كلمة على الأقل) ثم قارن بالنموذج وافحص نفسك بالقائمة — التقييم ذاتي صادق، لا درجة آلية مُخترعة.
      </p>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.5rem 0" }}>
        {SCHREIB_ALLTAG.map((x) => (
          <button key={x.id} className="chip" style={{ cursor: "pointer", fontWeight: sel === x.id ? 900 : 400 }} onClick={() => setSel(x.id)}>
            {fertig[x.id] ? "✅ " : ""}{x.genreAr} · {x.stufe}
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: "0.9rem 1.1rem", background: "var(--color-paper)" }}>
        <div style={{ fontWeight: 800 }}>{item.genreAr} <span style={{ color: "var(--color-ink2)", fontWeight: 400 }}>· {item.genreDe} · {item.stufe}</span></div>
        <p style={{ fontSize: "0.88rem" }}>{item.situationAr}</p>
        <p className="de" dir="ltr" style={{ fontSize: "0.88rem", textAlign: "left", background: "var(--color-card)", borderRadius: 8, padding: "0.5rem 0.7rem" }}>{item.aufgabeDe}</p>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", margin: "0.5rem 0" }}>
          {item.bausteine.map((b) => (
            <button key={b} className="chip" style={{ cursor: "pointer" }} title="أدرج في نصّك" onClick={() => setTexte((t) => ({ ...t, [sel]: (t[sel] ?? "") + (t[sel] ? " " : "") + b }))}>
              {b}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setTexte((t) => ({ ...t, [sel]: e.target.value }))}
          rows={8}
          placeholder="اكتب رسالتك هنا بالألمانية…"
          style={{ width: "100%", borderRadius: 10, padding: "0.6rem 0.8rem", fontFamily: "inherit" }}
        />
        <div style={{ fontSize: "0.8rem", color: "var(--color-ink2)" }}>
          <span className="rtl-num">{w}</span> كلمة {darfMuster ? "— يمكنك الآن مقارنة النموذج" : `— اكتب ${30 - w} كلمة أخرى لتفتح النموذج (محاولتك أولًا)`}
        </div>
        <button className="btn btn-ghost" data-testid="schreiballtag-muster" disabled={!darfMuster} onClick={() => setMusterOffen((m) => ({ ...m, [sel]: !m[sel] }))}>
          {musterOffen[sel] ? "🙈 أخفِ النموذج" : "📜 أظهر النموذج للمقارنة"}
        </button>
        {musterOffen[sel] && darfMuster && (
          <pre className="de" dir="ltr" style={{ textAlign: "left", whiteSpace: "pre-wrap", background: "var(--color-card)", borderRadius: 10, padding: "0.7rem 0.9rem", fontSize: "0.85rem", lineHeight: 1.7 }}>{item.muster}</pre>
        )}
        <div style={{ marginTop: "0.6rem" }}>
          <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>🔍 افحص نصّك بنفسك:</div>
          {item.checkliste.map((c, i) => {
            const key = `${sel}-${i}`;
            return (
              <label key={key} style={{ display: "flex", gap: "0.45rem", alignItems: "center", fontSize: "0.85rem", padding: "0.2rem 0", cursor: "pointer" }}>
                <input type="checkbox" checked={!!haken[key]} onChange={(e) => setHaken((h) => ({ ...h, [key]: e.target.checked }))} />
                {c}
              </label>
            );
          })}
          <button
            className="btn btn-primary"
            disabled={!item.checkliste.every((_, i) => haken[`${sel}-${i}`])}
            onClick={() => setFertig((f) => ({ ...f, [sel]: true }))}
            style={{ marginTop: "0.4rem" }}
          >
            {fertig[sel] ? "✅ أتممتَ هذا الموقف (فحص ذاتي)" : "أتمّ الفحص الذاتي أولًا ثم علّمه منجزًا"}
          </button>
        </div>
      </div>
    </div>
  );
}
