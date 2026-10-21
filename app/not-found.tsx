import Link from "next/link";

/**
 * 🧭 R305/ت14: صفحة 404 عربية — قبلها كانت الصفحة الافتراضية لـNext (إنجليزية بالكامل)
 * تكسر الغمر العربي RTL لأي مستخدم يُخطئ مسارًا أو يفتح رابطًا قديمًا.
 */
export default function NotFound() {
  return (
    <div
      dir="rtl"
      style={{
        display: "grid",
        gap: "1rem",
        placeItems: "center",
        textAlign: "center",
        padding: "4rem 1.5rem",
        minHeight: "60vh",
      }}
    >
      <p style={{ fontSize: "3rem", margin: 0 }}>🧭</p>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 900, margin: 0 }}>لم نجد هذه الصفحة</h1>
      <p style={{ fontSize: "0.95rem", color: "var(--color-ink2)", maxWidth: "32rem", lineHeight: 1.9, margin: 0 }}>
        الرابط الذي فتحته غير موجود — ربما كان قديمًا أو كُتب خطأً. تقدّمك محفوظ في هذا المتصفح
        كما هو، ولم يحدث له شيء.
      </p>
      <Link href="/" className="btn btn-primary" style={{ minHeight: "46px", display: "inline-flex", alignItems: "center", padding: "0 1.2rem" }}>
        ↩ عُد إلى «اليوم»
      </Link>
    </div>
  );
}
