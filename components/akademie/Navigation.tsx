"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon, type NavIconName } from "@/components/dirb/icons";

/**
 * 🧭 التنقّل الرئيسي — المخطط الاحترافي (Blueprint v1):
 * خمس وجهات ثابتة — اليوم، المكتبة، تدرّب، اختبر، تقدّمي. (اليوم = المسار الخطي الموحّد؛ المكتبة = الـ87 درساً للاستكشاف الحر)
 * — يستبدل لوح #101318 القديم بمتغيرات نظام DirB من دون تغيير المسارات.
 * — الترتيب ثابت (RTL): اليوم في اليمين، تقدّمي في اليسار — لا يتغيّر أبداً.
 * — النشط: border-top 2px أخضر + gradient هادئ — واضح بلا هزّ (لا انتقال مفاجئ).
 * — الوصولية: aria-current="page" + 44px أهداف لمس + focus-visible حلقة خضراء.
 * المرجع: docs/UX_BLUEPRINT_PROFI_2026-10-22.md §1.2
 */
const ZIELE: { href: string; icon: NavIconName; label: string }[] = [
  { href: "/", icon: "home", label: "اليوم" },
  { href: "/lernen", icon: "book", label: "المكتبة" },
  { href: "/ueben", icon: "bolt", label: "تدرّب" },
  { href: "/pruefen", icon: "target", label: "اختبر" },
  { href: "/fortschritt", icon: "chart", label: "تقدّمي" },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="ui-bottom-nav" data-testid="bottom-nav" aria-label="التنقّل الرئيسي">
      <div className="dirb-nav-inner">
        {ZIELE.map((z) => {
          const aktiv = pathname === z.href;
          return (
            <Link
              key={z.href}
              href={z.href}
              aria-current={aktiv ? "page" : undefined}
              className={`dirb-nav-link${aktiv ? " is-active" : ""}`}
            >
              <NavIcon name={z.icon} className="dirb-nav-icon" />
              <span>{z.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
