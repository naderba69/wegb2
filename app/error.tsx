"use client";

/**
 * 🛟 R305/ب12+ب13: حدّ أخطاء على مستوى المسار (اصطلاح Next.js نفسه) — يغطي تلقائيًا
 * كل صفحة تحت app/ (اليوم، تدرّب، اختبر، تقدّمي، الإعدادات، المسار، الطباعة) دون حاجة
 * للفّ كل صفحة يدويًا بـFehlerGrenze (الذي كان يغطي «الدرس»/«تدرّب» فقط فعليًا بعد R303).
 * عطل في أي شاشة لا يُسقط التطبيق كله بصفحة بيضاء بلا رسالة.
 */
export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      dir="rtl"
      style={{
        display: "grid",
        gap: "0.9rem",
        placeItems: "center",
        textAlign: "center",
        padding: "3rem 1.5rem",
        minHeight: "50vh",
      }}
    >
      <p style={{ fontSize: "2.5rem", margin: 0 }}>⚠️</p>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 900, margin: 0 }}>حدث عطل في هذه الصفحة</h1>
      <p style={{ fontSize: "0.9rem", color: "var(--color-ink2)", maxWidth: "30rem", lineHeight: 1.9, margin: 0 }}>
        بقية التطبيق وتقدّمك سليمة — العطل هنا فقط. جرّب إعادة فتح الصفحة، وإن تكرّر أعد تحميل
        التطبيق كاملاً.
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" className="btn btn-primary" style={{ minHeight: "46px" }} onClick={() => reset()}>
          🔄 أعد فتح الصفحة
        </button>
        <button type="button" className="btn btn-ghost" style={{ minHeight: "46px" }} onClick={() => window.location.assign("/")}>
          ↩ عُد إلى «اليوم»
        </button>
      </div>
    </div>
  );
}
