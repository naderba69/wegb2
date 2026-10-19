"use client";
// 🗂️ مصدّر البطاقات: الحقول الستّة + كتلة CSV بفاصلة منقوطة (Anki / Google Sheets)
import { useMemo, useState } from "react";
import { vocabMap } from "@/lib/content";
import { exportKarten, karteninCsv, allesInCsv } from "@/lib/karten-export";
import { frequenzVonWort, FREQUENZ_AR } from "@/lib/frequenz";
import { De } from "@/components/De";

const FARB_STIL: Record<string, string> = { BLAU: "#1d4ed8", ROT: "#be123c", "GRÜN": "#15803d" };
const FARB_SYMBOL: Record<string, string> = { BLAU: "● m", ROT: "▲ f", "GRÜN": "■ n" }; // M12: Form+Buchstabe neben der Farbe

export default function KartenExport() {
  const decks = useMemo(
    () => Object.entries(vocabMap as Record<string, { titleAr?: string; level: string; cards: unknown[] }>)
      .map(([id, d]) => ({ id, titel: d.titleAr ?? id, level: d.level, n: d.cards.length }))
      .sort((a, b) => (a.level + a.id).localeCompare(b.level + b.id)),
    []
  );
  const [deckId, setDeckId] = useState(decks[0]?.id ?? "");
  const [nachFrequenz, setNachFrequenz] = useState(false);
  const [offen, setOffen] = useState(false);
  const kartenRoh = useMemo(() => exportKarten(deckId), [deckId]);
  const karten = useMemo(
    () => (nachFrequenz ? [...kartenRoh].sort((a, b) => frequenzVonWort(b.vorne).n - frequenzVonWort(a.vorne).n) : kartenRoh),
    [kartenRoh, nachFrequenz]
  );
  const csv = useMemo(() => karteninCsv(deckId), [deckId]);

  // 🖨 R301: ورقة بطاقات قابلة للطباعة والقصّ (نافذة طباعة مستقلة — الوجه والظهر في كل بطاقة)
  const drucken = () => {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const zellen = karten
      .map(
        (k) => `<div class="karte">
          <div class="vorne">${esc(k.vorne)}</div>
          <div class="farbe">${esc(k.farbe)}</div>
          <div class="hinten">${esc(k.hinten)}</div>
          ${k.chunk ? `<div class="chunk">${esc(k.chunk)}</div>` : ""}
        </div>`
      )
      .join("");
    const html = `<!doctype html><html lang="ar"><head><meta charset="utf-8">
<title>بطاقات مطبوعة — طريقي إلى B2</title>
<style>
  body { font-family: "Segoe UI", Arial, sans-serif; margin: 12mm; color: #111; }
  h1 { font-size: 14pt; margin: 0 0 4mm; }
  p { font-size: 9pt; color: #444; margin: 0 0 6mm; }
  .blatt { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .karte { border: 1px solid #999; border-radius: 3mm; padding: 4mm; page-break-inside: avoid; }
  .vorne { font-size: 14pt; font-weight: 800; direction: ltr; text-align: left; }
  .farbe { font-size: 8pt; color: #555; }
  .hinten { font-size: 12pt; margin-top: 2mm; }
  .chunk { font-size: 9pt; color: #333; direction: ltr; text-align: left; margin-top: 1mm; }
</style></head><body>
<h1>🂡 بطاقات ورقية (${karten.length}) — قصّها وراجِع بعيدًا عن الشاشة</h1>
<p>طريقي إلى B2 · كل بطاقة: الكلمة الألمانية ووجهها اللوني وظهرها العربي · اطبع واطوِ أو قصّ كما تشاء.</p>
<div class="blatt">${zellen}</div>
<script>window.onload = () => window.print();</` + `script>
</body></html>`;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  const kopieren = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* المتصفّحُ قد يمنع — النصُّ ظاهرٌ للنسخِ اليدويّ */ }
  };

  return (
    <section className="card" style={{ padding: "1rem 1.2rem", display: "grid", gap: "0.7rem" }}>
      <h3 style={{ margin: 0 }}>🗂️ تصدير البطاقات — ستّة أعمدة + CSV</h3>
      <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--color-ink2)" }}>
        اختر الحزمة، ثمّ انسخ كتلة CSV والصقها في Google Sheets (بيانات ← تقسيم النص) أو في Anki (استيراد ← الفاصل «؛»). لا يظهر المرادف إلا مع أمثلة توضّح سياقه والفرق في الاستعمال.
      </p>

      <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.9rem" }}>
        الحزمة:
        <select value={deckId} onChange={(e) => setDeckId(e.target.value)} style={{ padding: "0.5rem", borderRadius: "0.5rem", minHeight: "44px" }}>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>{d.level} · {d.titel} ({d.n})</option>
          ))}
        </select>
      </label>

      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--color-ink2)" }}>الترتيب:</span>
        <button className="chip" style={{ cursor: "pointer", fontWeight: nachFrequenz ? 400 : 900 }} onClick={() => setNachFrequenz(false)}>كما في الحزمة</button>
        <button className="chip" data-testid="kartenexport-frequenz" style={{ cursor: "pointer", fontWeight: nachFrequenz ? 900 : 400 }} onClick={() => setNachFrequenz(true)}>📊 حسب ترددها في نصوص التطبيق (M11)</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr>
              {["الوجه", "مرساة اللون", "الظهر", "التردد", "الكتلة السياقية", "مرادفات سياقية", "النطق"].map((h) => (
                <th key={h} style={{ borderBottom: "2px solid var(--color-line)", padding: "0.35rem", textAlign: "start" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {karten.slice(0, 12).map((k, i) => (
              <tr key={i}>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>
                  <De style={{ fontWeight: 800, color: FARB_STIL[k.farbe.split(" ")[0]] ?? "inherit" }}>{FARB_SYMBOL[k.farbe.split(" ")[0]] ? `${FARB_SYMBOL[k.farbe.split(" ")[0]]} · ` : ""}{k.vorne}</De>
                </td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>{k.farbe}</td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>{k.hinten}</td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}><span className="chip" style={{ fontSize: "0.68rem" }}>📊 {FREQUENZ_AR[frequenzVonWort(k.vorne).stufe]}</span></td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>{k.chunk}</td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>{k.synonyme}</td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>{k.aussprache}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {karten.length > 12 && (
          <div style={{ fontSize: "0.78rem", color: "var(--color-ink2)", padding: "0.3rem" }}>
            تُعرَض 12 بطاقة للمعاينة — وكتلةُ CSV تحوي {karten.length} بطاقة كاملة.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => { setOffen(true); void kopieren(csv); }}>
          📋 انسخ CSV لهذه الحزمة
        </button>
        <button className="btn" onClick={() => { setOffen(true); void kopieren(allesInCsv()); }}>
          📦 انسخ كل الحزم في ملف واحد
        </button>
        <button className="btn" data-testid="kartenexport-drucken" onClick={drucken}>
          🖨 اطبع الحزمة كبطاقات ورقية
        </button>
      </div>

      {offen && (
        <pre dir="ltr" style={{ maxHeight: "260px", overflow: "auto", background: "var(--color-paper2)", padding: "0.6rem", borderRadius: "0.6rem", fontSize: "0.74rem", whiteSpace: "pre" }}>
          {csv}
        </pre>
      )}
    </section>
  );
}
