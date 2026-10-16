"use client";
import type { CSSProperties, ReactNode } from "react";

/** نص ألماني داخل واجهة عربية (اتجاه ltr معزول + lang="de" لقارئ الشاشة — U5/R191) */
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
    <span className={`de ${className}`} lang="de" style={style}>
      {children}
    </span>
  );
}

export function DeBlock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`de ${className}`} lang="de" style={{ display: "block", width: "100%" }}>{children}</div>;
}
