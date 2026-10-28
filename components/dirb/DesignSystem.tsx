/**
 * DesignSystem v1 — المصدر الوحيد للحقيقة (P1 design/system)
 * Docs: docs/UX_BLUEPRINT_PROFI_2026-10-22.md §1-6 + app/globals.css لayers ①-⑥
 * المبدأ: كل توكن جديد يولد في :root (--ui-*) وglobals.css §②، وAliases --color-* في §② فقط.
 * لا Tailwind متضارب: @theme جسْر legacy فقط، لا لون جديد هنا. الأيقونات عبر KindIcon SVG + إيموجي مؤقت.
 * الوصولية: :focus-visible حلقة خضراء 3px + 44px targets (P1 a11y/focus-ring) — موثق في globals.css:1254
 */
export const DS_TOKENS = {
  colors: { navy: "#0b1020", green: "#22c55e", gold: "#f2c866", paper2: "#111a2b", ink: "#f3f6fb", ink2: "#a4b2c7" },
  radii: { card: "1.15rem", control: "0.85rem" },
  focus: "3px solid #86efac offset 3px + 4px glow (WCAG AA)",
  targets: "44px minHeight",
  icons: "KindIcon (SVG) + fallback emoji — unified via components/dirb/icons.tsx",
} as const;

import type { HTMLAttributes } from "react";

type UiDataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };
type UiShellProps = HTMLAttributes<HTMLDivElement> & UiDataAttributes;

/**
 * UiAppShell — الإطار العام (Blueprint §6.1):
 * — يحمل skip-link + main + nav + footer في shell واحد 78rem centered
 * — خلفية navy ثابتة + تدرّجات شعاعية خفيفة (لا وميض عند التنقل)
 * — لا منطق، لا حالة — مجرد هيكل دلالي
 */
export function UiAppShell({ className = "", children, ...props }: UiShellProps) {
  return (
    <div className={`ui-app-shell ${className}`.trim()} {...props}>
      <a className="ui-skip-link" href="#main-content">انتقل إلى المحتوى</a>
      {children}
    </div>
  );
}

type UiSurfaceProps = HTMLAttributes<HTMLElement> & UiDataAttributes;

export function UiSurface({ className = "", children, ...props }: UiSurfaceProps) {
  return (
    <section className={`ui-surface ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}

export function UiBadge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement> & UiDataAttributes) {
  return <span className={`ui-badge ${className}`.trim()} {...props} />;
}

/** UiPageHeading — رأس صفحة دلالي (Blueprint §6.2): عنوان + وصف + kicker اختياري */
export function UiPageHeading({ className = "", children, ...props }: UiSurfaceProps) {
  return (
    <header className={`ui-page-heading ${className}`.trim()} {...props}>
      {children}
    </header>
  );
}
