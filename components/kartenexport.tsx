"use client";
// 🗂️ مصدّر البطاقات: الحقول الستّة + كتلة CSV بفاصلة منقوطة (Anki / Google Sheets)
import { useMemo, useState } from "react";
import { vocabMap } from "@/lib/content";
import { exportKarten, karteninCsv, allesInCsv } from "@/lib/karten-export";
import { De } from "@/components/De";

const FARB_STIL: Record<string, string> = { BLAU: "#1d4ed8", ROT: "#be123c", "GRÜN": "#15803d" };

export default function KartenExport() {
  const decks = useMemo(
    () => Object.entries(vocabMap as Record<string, { titleAr?: string; level: string; cards: unknown[] }>)
      .map(([id, d]) => ({ id, titel: d.titleAr ?? id, level: d.level, n: d.cards.length }))
      .sort((a, b) => (a.level + a.id).localeCompare(b.level + b.id)),
    []
  );
  const [deckId, setDeckId] = useState(decks[0]?.id ?? "");
  const [offen, setOffen] = useState(false);
  const karten = useMemo(() => exportKarten(deckId), [deckId]);
  const csv = useMemo(() => karteninCsv(deckId), [deckId]);

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

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr>
              {["الوجه", "مرساة اللون", "الظهر", "الكتلة السياقية", "مرادفات سياقية", "النطق"].map((h) => (
                <th key={h} style={{ borderBottom: "2px solid var(--color-line)", padding: "0.35rem", textAlign: "start" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {karten.slice(0, 12).map((k, i) => (
              <tr key={i}>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>
                  <De style={{ fontWeight: 800, color: FARB_STIL[k.farbe.split(" ")[0]] ?? "inherit" }}>{k.vorne}</De>
                </td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>{k.farbe}</td>
                <td style={{ padding: "0.35rem", borderBottom: "1px solid var(--color-line)" }}>{k.hinten}</td>
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
      </div>

      {offen && (
        <pre dir="ltr" style={{ maxHeight: "260px", overflow: "auto", background: "var(--color-paper2)", padding: "0.6rem", borderRadius: "0.6rem", fontSize: "0.74rem", whiteSpace: "pre" }}>
          {csv}
        </pre>
      )}
    </section>
  );
}
