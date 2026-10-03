"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon, type NavIconName } from "@/components/dirb/icons";

/**
 * 🧭 التنقّل السفلي DirB — خمس مقاعد في الطابور فقط (K101):
 * اليوم · الدرس · تدرّب · اختبر · تقدّمي.
 * لوح الهوية الداكن #101318 + أيقونات SVG + النشط أخضر حيّ.
 */
const ZIELE: { href: string; icon: NavIconName; label: string }[] = [
  { href: "/", icon: "home", label: "اليوم" },
  { href: "/lernen", icon: "book", label: "الدرس" },
  { href: "/ueben", icon: "bolt", label: "تدرّب" },
  { href: "/pruefen", icon: "target", label: "اختبر" },
  { href: "/fortschritt", icon: "chart", label: "تقدّمي" },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav
      data-testid="bottom-nav"
      aria-label="التنقّل الرئيسي"
      style={{
        position: "fixed",
        bottom: 0,
        insetInline: 0,
        background: "#101318",
        borderTop: "1px solid #2a2f38",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 50,
        direction: "rtl",
      }}
    >
      <div className="dirb-nav-inner">
        {ZIELE.map((z) => {
          const aktiv = pathname === z.href;
          return (
            <Link
              key={z.href}
              href={z.href}
              aria-current={aktiv ? "page" : undefined}
              className="dirb-nav-link"
              style={{
                color: aktiv ? "#22c55e" : "#9aa3af",
                fontWeight: aktiv ? 900 : 600,
                borderTop: aktiv ? "3px solid #22c55e" : "3px solid transparent",
                textShadow: aktiv ? "0 0 18px rgb(34 197 94 / 0.55)" : "none",
              }}
            >
              <NavIcon name={z.icon} className="dirb-nav-icon" />
              {z.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
