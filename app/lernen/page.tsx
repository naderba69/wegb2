/**
 * 🚧 وجهة مؤقتة ضمن إعادة الهيكلة (P2) — الباب موجود ومُسجَّل في التنقّل (K101).
 * المحتوى يُبنى في الدفعة P2 وفق «وثيقة إعادة الهيكلة» docs/umstrukturierung.md.
 */
export default function LernenStub() {
  return (
    <div className="today-screen fadein card" style={{ padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem" }} aria-hidden>📖</div>
      <h1 style={{ fontWeight: 900, fontSize: "1.4rem", margin: "0.6rem 0 0.3rem" }}>الدرس</h1>
      <p style={{ color: "var(--color-ink2)", maxWidth: "30rem", margin: "0 auto", lineHeight: 1.9 }}>
        المعالج المنهجي بخمس خطوات: خمّن ← قاعدة ← أمثلة ← تطبيق ← خلاصة.
      </p>
      <p style={{ margin: "1rem 0 0" }}>
        <a className="btn btn-primary" href="/" style={{ minHeight: "44px", textDecoration: "none" }}>
          ↩ العودة إلى «اليوم»
        </a>
      </p>
      <p style={{ fontSize: "0.78rem", color: "var(--color-ink2)", marginTop: "1rem" }}>
        بابٌ في الطابور لا في الزاوية — محتواه يفتح في P2.
      </p>
    </div>
  );
}
