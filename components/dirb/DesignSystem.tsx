import type { HTMLAttributes } from "react";

type UiDataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };
type UiShellProps = HTMLAttributes<HTMLDivElement> & UiDataAttributes;

/** Shared application frame and semantic surfaces for the DirB visual system. */
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

export function UiPageHeading({ className = "", children, ...props }: UiSurfaceProps) {
  return (
    <header className={`ui-page-heading ${className}`.trim()} {...props}>
      {children}
    </header>
  );
}
