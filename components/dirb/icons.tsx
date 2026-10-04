/**
 * DirB · أيقونات SVG أصلية (stroke/currentColor) — لا إيموجي في البطل والتنقّل.
 * images/dirB-today.png: أيقونة بيضاء كبيرة في البطاقة + أيقونات سفلية رفيعة.
 */
import type { TaskKind } from "@/lib/types";

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const KIND_PATH: Record<TaskKind, React.ReactNode> = {
  hoeren: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="2.6" y="14" width="4.4" height="6.4" rx="2" />
      <rect x="17" y="14" width="4.4" height="6.4" rx="2" />
    </>
  ),
  lesen: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 4.5v14c3 0 6 .5 8 2 2-1.5 5-2 8-2v-14c-3 0-6 .5-8 2z" />
      <path d="M12 6.5v14" />
    </>
  ),
  schreiben: <path d="M4 20l1.2-4.2L16.7 4.3a2.05 2.05 0 0 1 2.9 2.9L8.2 18.8 4 20z" />,
  sprechen: (
    <>
      <rect x="9" y="2.8" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.2" />
    </>
  ),
  aussprache: (
    <>
      <path d="M4 10v4h3.5L13 18.5v-13L7.5 10H4z" />
      <path d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.6a8 8 0 0 1 0 10.8" />
    </>
  ),
  grammatik: (
    <>
      <path d="M12 4L2.5 9 12 14l9.5-5L12 4z" />
      <path d="M6.5 11.3V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.7" />
      <path d="M21.5 9v5" />
    </>
  ),
  wortschatz: (
    <>
      <rect x="4" y="7" width="13.5" height="12" rx="2" />
      <path d="M6.5 7V6a2 2 0 0 1 2-2h9.5a2 2 0 0 1 2 2v9" />
    </>
  ),
  wiederholen: (
    <>
      <path d="M4 9a8 8 0 0 1 13.6-2.6L20 8.8M20 15a8 8 0 0 1-13.6 2.6L4 15.2" />
      <path d="M20 3.5v5.3h-5.3M4 20.5v-5.3h5.3" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M8.2 12.4l2.5 2.5 5.1-5.6" />
    </>
  ),
};

export function KindIcon({ kind, className }: { kind: TaskKind; className?: string }) {
  return <Svg className={className}>{KIND_PATH[kind] ?? KIND_PATH.check}</Svg>;
}

export type NavIconName = "home" | "book" | "bolt" | "target" | "chart";

const NAV_PATH: Record<NavIconName, React.ReactNode> = {
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 4.5v14c3 0 6 .5 8 2 2-1.5 5-2 8-2v-14c-3 0-6 .5-8 2z" />
      <path d="M12 6.5v14" />
    </>
  ),
  bolt: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.3" />
    </>
  ),
  chart: (
    <>
      <path d="M5 20v-6M11 20V6M17 20v-9" />
      <path d="M3 20h18" />
    </>
  ),
};

export function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  return <Svg className={className}>{NAV_PATH[name]}</Svg>;
}
