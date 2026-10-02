"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 🧭 التنقّل السفلي — خمس مقاعد في الطابور فقط (K101):
 * اليوم · الدرس · تدرّب · اختبر · تقدّمي.
 * لا وجهة سادسة ولا رابط محتوى — الوجهة نفسها تعرض مقعدك في الطابور.
 * في `/alt` (الحجر المؤقت) لا يُرسم — الصفحة القديمة تُعرض كما كانت.
 */
const ZIELE = [
  { href: "/", icon: "📅", label: "اليوم" },
  { href: "/lernen", icon: "📖", label: "الدرس" },
  { href: "/ueben", icon: "💪", label: "تدرّب" },
  { href: "/pruefen", icon: "🎯", label: "اختبر" },
  { href: "/fortschritt", icon: "📈", label: "تقدّمي" },
];

export default function Navigation() {
  const pathname = usePathname();
  if (pathname === "/alt" || pathname?.startsWith("/alt/")) return null;
  return (
    <nav
      data-testid="bottom-nav"
      aria-label="التنقّل الرئيسي"
      style={{
        position: "fixed",
        bottom: 0,
        insetInline: 0,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        background: "#101318",
        borderTop: "1px solid #2a2f38",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 50,
        direction: "rtl",
      }}
    >
      {ZIELE.map((z) => {
        const aktiv = pathname === z.href;
        return (
          <Link
            key={z.href}
            href={z.href}
            aria-current={aktiv ? "page" : undefined}
            style={{
              minHeight: "56px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.1rem",
              textDecoration: "none",
              fontSize: "0.72rem",
              fontWeight: aktiv ? 900 : 600,
              color: aktiv ? "#22c55e" : "#9aa3af",
              borderTop: aktiv ? "3px solid #22c55e" : "3px solid transparent",
            }}
          >
            <span aria-hidden style={{ fontSize: "1.15rem", lineHeight: 1 }}>{z.icon}</span>
            {z.label}
          </Link>
        );
      })}
    </nav>
  );
}
