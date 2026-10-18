"use client";
// ✍️ A12 (R284): لوحة أخطاء الكتابة التراكمية من دفتر أخطائك الحقيقي — أنماط لا درجات مُخترعة
import { schreibFehlerBilanz } from "@/lib/schreibfehler";
import type { Progress } from "@/lib/types";

export function SchreibFehlerPanel({ progress }: { progress: Progress }) {
  const b = schreibFehlerBilanz(progress);
  return (
    <div data-testid="schreibfehler-panel" style={{ marginTop: "1rem", borderTop: "2px dashed var(--color-line)", paddingTop: "0.9rem" }}>
      <div style={{ fontWeight: 900 }}>✍️ أخطاء كتابتك التراكمية (A12)</div>
      {b.gesamt === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "var(--color-ink2)" }}>لا أخطاء كتابة مسجّلة بعد — تظهر هنا أنماط أخطائك من ورشة الرسائل ومهام الكتابة حين تُسجَّل في دفتر أخطائك.</p>
      ) : (
        <div style={{ fontSize: "0.88rem", display: "grid", gap: "0.3rem" }}>
          <div>المجموع: <strong className="rtl-num">{b.gesamt}</strong> خطأ كتابة · ما زال مفتوحًا للمراجعة: <strong className="rtl-num">{b.offen}</strong> · جديد في آخر 30 يومًا: <strong className="rtl-num">{b.neu30}</strong></div>
          {b.muster.map((m) => (
            <div key={m.art} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", borderTop: "1px dashed var(--color-line)", padding: "0.25rem 0" }}>
              <span>{m.ar} <span style={{ color: "var(--color-ink2)" }}>({m.art})</span></span>
              <span><span className="rtl-num">{m.n}</span> خطأ · تكرّر <span className="rtl-num">{m.treffer}</span> مرة · مفتوح <span className="rtl-num">{m.offen}</span></span>
            </div>
          ))}
          <div style={{ color: "var(--color-ink2)", fontSize: "0.78rem" }}>من دفتر أخطائك المحلي وحده — النمط الأثقل أولًا لتعرف أين تضع جهدك القادم.</div>
        </div>
      )}
    </div>
  );
}
