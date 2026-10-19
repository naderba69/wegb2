"use client";
// 📚 A21+A29 (R295): فحص مرجعي آلي + سقف استقبالي مقاس بصدق
import { useMemo } from "react";
import { b2Luecke, frequenzAnomalien, referenzBericht, schnellsteRezeptiv } from "@/lib/referenz";
import type { Progress } from "@/lib/types";

export function ReferenzPanel({ progress }: { progress: Progress }) {
  const zeilen = useMemo(() => referenzBericht(), []);
  const anomalien = useMemo(() => frequenzAnomalien(), []);
  const schnell = useMemo(() => schnellsteRezeptiv(progress), [progress]);
  const luecke = useMemo(() => b2Luecke(), []);
  return (
    <section className="card" data-testid="referenz-panel" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem", fontSize: "0.88rem" }}>
      <strong>📚 الفحص المرجعي والسقف الاستقبالي (A21/A29)</strong>
      <table style={{ borderCollapse: "collapse", fontSize: "0.84rem" }}>
        <thead>
          <tr>{["المستوى", "بطاقاتنا", "تراكمي", "المرجع المنشور", "الحالة"].map((h) => <th key={h} style={{ textAlign: "start", padding: "0.25rem 0.4rem", borderBottom: "1px solid var(--color-line)" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.level}>
              <td style={{ padding: "0.25rem 0.4rem" }}>{z.level}</td>
              <td className="rtl-num" style={{ padding: "0.25rem 0.4rem" }}>{z.kartenHier}</td>
              <td className="rtl-num" style={{ padding: "0.25rem 0.4rem" }}>{z.kumuliert}</td>
              <td style={{ padding: "0.25rem 0.4rem" }}>{z.referenz}</td>
              <td style={{ padding: "0.25rem 0.4rem" }}>{z.status === "darueber" ? "✅ فوق المرجع" : z.status === "darunter" ? "🟡 تحت المرجع" : "·"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ lineHeight: 1.9 }}>
        سقفك الاستقبالي الحالي <strong className="rtl-num">{luecke.kumuliert}</strong> بطاقة؛ نحو نطاق B2 الاستقبالي في الأدبيات (≈{luecke.zielCa}) تبقى فجوة محتوى بنحو <strong className="rtl-num">{luecke.luecke}</strong> بطاقة — معلنة لا مخفية: رفعها يحتاج تأليف دفعات جديدة مدققة، لا إعادة تسمية القائم.
      </div>
      {anomalien.length > 0 && (
        <div style={{ lineHeight: 1.9 }}>
          🔍 حالات فحص (شائعة في مدوّنتنا لكنها مصنفة B2 — راجِع لا يعيّن خطأ): {anomalien.map((a) => `${a.karte.de} (${a.n}×)`).join(" · ")}
        </div>
      )}
      {schnell.length > 0 && (
        <div style={{ lineHeight: 1.9 }}>
          🚀 أسرع رفع لسقفك: أعلى بطاقات لم تُدخلها بعد ترددًا في مدوّنة التطبيق: {schnell.map((s) => `${s.karte.de}`).join(" · ")}
        </div>
      )}
    </section>
  );
}
