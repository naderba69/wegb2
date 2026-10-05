"use client";
/**
 * شريط المحطات الست لدرس اليوم — مع تمييز المحطة النشطة (activeStation).
 * K: محطات الدرس الست: إحماء · ظل/نطق · مفردات · قواعد استقرائية · استماع/قراءة · إنتاج.
 */
import type { DayTask } from "@/lib/types";

export type Station = "warmup" | "aussprache" | "wortschatz" | "grammatik" | "rezeption" | "produktion";

export const STATIONEN: Record<Station, { id: Station; de: string; ar: string; icon: string; kinds: string[] }> = {
  warmup:      { id: "warmup",      de: "Aufwärmen",       ar: "إحماء",          icon: "☀️", kinds: ["ritual", "wiederholen"] },
  aussprache:  { id: "aussprache",  de: "Aussprache",      ar: "نطق وظل",        icon: "🎙️", kinds: ["aussprache", "shadowing"] },
  wortschatz:  { id: "wortschatz",  de: "Wortschatz",      ar: "مفردات",         icon: "🧩", kinds: ["wortschatz", "vokabel"] },
  grammatik:   { id: "grammatik",   de: "Grammatik",       ar: "قواعد (استكشاف)", icon: "🧠", kinds: ["grammatik"] },
  rezeption:   { id: "rezeption",   de: "Hören & Lesen",   ar: "استماع وقراءة",  icon: "👂📖", kinds: ["hoeren", "lesen"] },
  produktion:  { id: "produktion",  de: "Sprechen & Schreiben", ar: "إنتاج (تحدث/كتابة)", icon: "✍️🗣", kinds: ["schreiben", "sprechen"] },
};

export function stationOfTask(task: Pick<DayTask, "kind">): Station {
  const k = task.kind;
  for (const s of Object.values(STATIONEN)) {
    if (s.kinds.includes(k)) return s.id;
  }
  if (k === "check") return "rezeption";
  return "warmup";
}

export function activeStationFromStep(tasks: DayTask[], step: number): Station {
  const t = tasks[step];
  return t ? stationOfTask(t) : "warmup";
}

interface Props {
  tasks: DayTask[];
  step: number;
  zielMin?: number;
}

export default function StationsLeiste({ tasks, step, zielMin }: Props) {
  const stations: Station[] = ["warmup", "aussprache", "wortschatz", "grammatik", "rezeption", "produktion"];
  const active = activeStationFromStep(tasks, step);
  // تقدّم المحطات (كم من محطة وُصل إليها)
  const activeIdx = stations.indexOf(active);
  return (
    <div
      className="stations-bar"
      role="navigation"
      aria-label="محطات الدرس الست"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 6,
        margin: "0.75rem 0 1rem",
        direction: "rtl",
      }}
    >
      {stations.map((s, i) => {
        const info = STATIONEN[s];
        const done = i < activeIdx;
        const isActive = s === active;
        return (
          <div
            key={s}
            className={`station ${isActive ? "station--active" : ""} ${done ? "station--done" : ""}`}
            style={{
              padding: "0.5rem 0.35rem",
              textAlign: "center",
              borderRadius: "0.65rem",
              border: isActive
                ? "2px solid var(--ui-gold)"
                : "1px solid var(--ui-border)",
              background: isActive
                ? "linear-gradient(180deg, rgb(242 200 102 / 0.16), rgb(242 200 102 / 0.06))"
                : done
                ? "var(--ui-green-soft)"
                : "var(--ui-surface-raised)",
              boxShadow: isActive ? "0 4px 14px rgb(242 200 102 / 0.16)" : "none",
              transform: isActive ? "translateY(-2px)" : "none",
              transition: "all 0.2s ease",
              fontSize: "0.78rem",
            }}
          >
            <div style={{ fontSize: "1.2rem", marginBottom: 2 }}>{info.icon}</div>
            <div style={{ fontWeight: isActive ? 800 : 600, color: "var(--color-ink)" }}>{info.ar}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--color-ink2)", marginTop: 1 }}>{info.de}</div>
          </div>
        );
      })}
      {zielMin != null && (
        <div style={{ gridColumn: "1/-1", textAlign: "center", fontSize: "0.75rem", color: "var(--color-ink2)", marginTop: 4 }}>
          🎯 هدف الجلسة: <strong>{zielMin} دقيقة</strong> · مستقلٌّ عن مجموع تقديرات المهام.
        </div>
      )}
    </div>
  );
}
