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
