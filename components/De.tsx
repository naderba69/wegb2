"use client";
import type { CSSProperties, ReactNode } from "react";

/** نص ألماني داخل واجهة عربية (اتجاه ltr معزول) */
export function De({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`de ${className}`} style={style}>
      {children}
    </span>
  );
}

export function DeBlock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`de ${className}`} style={{ display: "block", width: "100%" }}>{children}</div>;
}
