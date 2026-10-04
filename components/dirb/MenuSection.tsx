import type { ReactNode } from "react";
import { UiBadge, UiSurface } from "@/components/dirb/DesignSystem";

type MenuSectionProps = {
  id: string;
  title: string;
  description: string;
  count: number;
  children: ReactNode;
};

/** مجموعة مرئية موحّدة لعناصر التنقّل، بعناوين دلالية وعددٍ مساعد. */
export function MenuSection({ id, title, description, count, children }: MenuSectionProps) {
  return (
    <UiSurface className="dirb-menu-group" data-testid={`menu-group-${id}`} aria-labelledby={`${id}-heading`}>
      <div className="dirb-menu-group-head">
        <div className="dirb-menu-group-copy">
          <h2 className="dirb-menu-group-title" id={`${id}-heading`}>{title}</h2>
          <p className="dirb-menu-group-description">{description}</p>
        </div>
        <UiBadge className="dirb-menu-count" aria-label={`عدد الخيارات: ${count}`}>{count}</UiBadge>
      </div>
      <div className="dirb-menu">{children}</div>
    </UiSurface>
  );
}
