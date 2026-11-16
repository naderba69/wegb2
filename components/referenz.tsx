"use client";
// 📚 PA-020: normalized lexical inventory and app-corpus attestation; no external coverage claim.
import { useMemo } from "react";
import { frequenzAnomalien, lexikUebersicht, referenzBericht, schnellsteRezeptiv } from "@/lib/referenz";
import type { Progress } from "@/lib/types";

export function ReferenzPanel({ progress }: { progress: Progress }) {
  const zeilen = useMemo(() => referenzBericht(), []);
  const uebersicht = useMemo(() => lexikUebersicht(), []);
  const anomalien = useMemo(() => frequenzAnomalien(), []);
  const schnell = useMemo(() => schnellsteRezeptiv(progress), [progress]);
  return (
    <section className="card" data-testid="referenz-panel" style={{ padding: "1rem 1.1rem", background: "var(--color-paper2)", display: "grid", gap: "0.6rem", fontSize: "0.88rem" }}>
      <strong>📚 الجرد المعجمي وتغطية مدوّنة التطبيق</strong>
      <p style={{ margin: 0, lineHeight: 1.8 }} data-testid="lexical-scope-boundary">
        هذا جرد داخلي بعد تطبيع صيغة العرض ودمج المكرر؛ ليس مقارنة بقائمة Goethe/CEFR ولا نسبة تغطية للغة الألمانية.
        «موجود في المدونة» يعني ظهور الوحدة في نصوص التطبيق وحواراته وجمله فقط، ولا يثبت القدرة الإنتاجية.
      </p>
      <table style={{ borderCollapse: "collapse", fontSize: "0.84rem" }}>
        <thead>
          <tr>{["المستوى الأول", "وحدات فريدة", "تراكمي فريد", "كلمة/عبارة", "موثقة في المدونة", "إنتاج مقاس"].map((h) => <th key={h} style={{ textAlign: "start", padding: "0.25rem 0.4rem", borderBottom: "1px solid var(--color-line)" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.level}>
              <td style={{ padding: "0.25rem 0.4rem" }}>{z.level}</td>
              <td className="rtl-num" style={{ padding: "0.25rem 0.4rem" }}>{z.eindeutigHier}</td>
              <td className="rtl-num" style={{ padding: "0.25rem 0.4rem" }}>{z.kumuliertEindeutig}</td>
              <td className="rtl-num" style={{ padding: "0.25rem 0.4rem" }}>{z.einzelwoerter}/{z.mehrwortEinheiten}</td>
              <td className="rtl-num" style={{ padding: "0.25rem 0.4rem" }}>{z.rezeptivImAppKorpus}/{z.eindeutigHier} ({z.rezeptivAbdeckungPct}%)</td>
              <td style={{ padding: "0.25rem 0.4rem" }}>{z.produktivAusgewiesen === null ? "غير مقاس" : z.produktivAusgewiesen}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ lineHeight: 1.9 }}>
        البنك يحوي <strong className="rtl-num">{uebersicht.roheKarten}</strong> بطاقة، لكنها تصبح بعد التطبيع وإزالة التكرار{" "}
        <strong className="rtl-num">{uebersicht.eindeutigeEinheiten}</strong> وحدة معجمية فريدة: {uebersicht.einzelwoerter} كلمة مفردة و{uebersicht.mehrwortEinheiten} عبارة متعددة الكلمات.
        التغطية الاستقبالية الداخلية الصارمة: <strong className="rtl-num">{uebersicht.rezeptivImAppKorpus}/{uebersicht.eindeutigeEinheiten} ({uebersicht.rezeptivAbdeckungPct}%)</strong> في مدونة التطبيق.
        التغطية الخارجية: <strong>غير مقاسة</strong>؛ الإنتاج المقيم على مستوى الوحدة: <strong>غير مقاس</strong>.
      </div>
      {anomalien.length > 0 && (
        <div style={{ lineHeight: 1.9 }}>
          🔍 حالات فحص (شائعة في مدونتنا لكن أول بطاقة لها B2 — مرشحات مراجعة لا أحكام خطأ): {anomalien.map((a) => `${a.karte.de} (${a.n}×)`).join(" · ")}
        </div>
      )}
      {schnell.length > 0 && (
        <div style={{ lineHeight: 1.9 }}>
          🚀 وحدات فريدة غير مدخلة بعد وموثقة بكثرة في مدونة التطبيق: {schnell.map((s) => s.karte.de).join(" · ")}
        </div>
      )}
    </section>
  );
}
