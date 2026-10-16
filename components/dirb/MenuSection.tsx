import type { ReactNode } from "react";
import { UiBadge, UiSurface } from "@/components/dirb/DesignSystem";

type MenuSectionProps = {
  id: string;
  title: string;
  description: string;
  count: number;
  children: ReactNode;
  /** R195: المجموعة قابلة للطي (الأولى مفتوحة، والباقي مطوي لتخفيف الازدحام) */
  einklappbar?: boolean;
  /** ابدأ مفتوحة رغم قابليتها للطي */
  startOffen?: boolean;
};

/** مجموعة مرئية موحّدة لعناصر التنقّل، بعناوين دلالية وعددٍ مساعد. */
export function MenuSection({ id, title, description, count, children, einklappbar, startOffen }: MenuSectionProps) {
  const kopf = (
    <>
      <div className="dirb-menu-group-copy">
        <h2 className="dirb-menu-group-title" id={`${id}-heading`}>{title}</h2>
        <p className="dirb-menu-group-description">{description}</p>
      </div>
      <UiBadge className="dirb-menu-count" aria-label={`عدد الخيارات: ${count}`}>{count}</UiBadge>
    </>
  );
  if (einklappbar) {
    return (
      <UiSurface className="dirb-menu-group" data-testid={`menu-group-${id}`} aria-labelledby={`${id}-heading`}>
        <details {...(startOffen ? { open: true } : {})}>
          <summary
            className="dirb-menu-group-head"
            style={{ cursor: "pointer", listStyle: "none", minHeight: "48px" }}
            aria-label={`${title} — ${startOffen ? "مفتوحة" : "اطوِ/افتح"}`}
          >
            {kopf}
            <span aria-hidden style={{ fontWeight: 900 }}>▾</span>
          </summary>
          <div className="dirb-menu">{children}</div>
        </details>
      </UiSurface>
    );
  }
  return (
    <UiSurface className="dirb-menu-group" data-testid={`menu-group-${id}`} aria-labelledby={`${id}-heading`}>
      <div className="dirb-menu-group-head">
        {kopf}
      </div>
      <div className="dirb-menu">{children}</div>
    </UiSurface>
  );
}
