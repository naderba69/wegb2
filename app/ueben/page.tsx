/**
 * 🚧 وجهة مؤقتة ضمن إعادة الهيكلة (P3) — الباب موجود ومُسجَّل في التنقّل (K101).
 * المحتوى يُبنى في الدفعة P3 وفق «وثيقة إعادة الهيكلة» docs/umstrukturierung.md.
 */
export default function UebenStub() {
  return (
    <div className="today-screen fadein card" style={{ padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem" }} aria-hidden>💪</div>
      <h1 style={{ fontWeight: 900, fontSize: "1.4rem", margin: "0.6rem 0 0.3rem" }}>تدرّب</h1>
      <p style={{ color: "var(--color-ink2)", maxWidth: "30rem", margin: "0 auto", lineHeight: 1.9 }}>
        تدريب إضافي وتقنيات الاسترجاع الحرّ — يفتح بعد إغلاق اليوم فقط (الميثاق).
      </p>
      <p style={{ margin: "1rem 0 0" }}>
        <a className="btn btn-primary" href="/" style={{ minHeight: "44px", textDecoration: "none" }}>
          ↩ العودة إلى «اليوم»
        </a>
      </p>
      <p style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "1rem" }}>
        بابٌ في الطابور لا في الزاوية — محتواه يفتح في P3.
      </p>
    </div>
  );
}
