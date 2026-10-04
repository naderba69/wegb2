"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon, type NavIconName } from "@/components/dirb/icons";

/**
 * 🧭 التنقّل الرئيسي: خمس وجهات ثابتة — اليوم، الدرس، تدرّب، اختبر، تقدّمي.
 * يستبدل لوح #101318 القديم بمتغيرات نظام DirB من دون تغيير المسارات.
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
