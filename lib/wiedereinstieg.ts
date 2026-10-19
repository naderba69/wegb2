import { abrufbarkeit } from "./srs";
import type { DayPlan, Progress } from "./types";

/**
 * 🌱 M15 (R287, Experten-Audit): Wiedereinstieg nach mehr als fünf Tagen.
 * Die ersten zwei Studientage nach der Rückkehr zeigen nur Pflicht-,
 * Prüfungs- und Wiederholungsaufgaben; das Sitzungsziel halbiert sich.
 * Der kanonische Tagesplan wird nicht umgeschrieben — die reduzierte
 * Auswahl ist eine ehrliche Sitzungsansicht, ausgelassene Neuinhalte
 * werden nicht als Schulden verbucht.
 */
export interface ResumeZustand {
  aktiv: boolean;
  sitzung: number | null;
  gapDays: number;
  kritischeKarten: number;
  sitzungen: string[];
}

const heuteIso = (now: Date) => now.toISOString().slice(0, 10);
const tageZwischen = (von: string, bis: string) =>
  Math.round((new Date(`${bis}T00:00:00Z`).getTime() - new Date(`${von}T00:00:00Z`).getTime()) / 86400000);

export function kritischeKarten(p: Progress, now = new Date()): number {
  const heute = heuteIso(now);
  return Object.values(p.srs ?? {}).filter((st) => {
    if (st.reps <= 0 || !st.due || st.due.slice(0, 10) > heute) return false;
    const r = abrufbarkeit(st, now);
    return st.lapses > 0 || st.interval <= 3 || (r !== null && r <= 0.85);
  }).length;
}

export function resumeZustand(p: Progress, now = new Date()): ResumeZustand {
  const heute = heuteIso(now);
  const state = p.resume;
  const gapDays = p.streak.last ? Math.max(0, tageZwischen(p.streak.last, heute)) : 0;
  const basis: ResumeZustand = {
    aktiv: false,
    sitzung: null,
    gapDays,
    kritischeKarten: kritischeKarten(p, now),
    sitzungen: state?.sitzungen ?? [],
  };
  if (!state) {
    return gapDays > 5 && p.streak.last
      ? { ...basis, aktiv: true, sitzung: 1 }
      : basis;
  }
  const idx = state.sitzungen.indexOf(heute);
  if (idx >= 0) return { ...basis, aktiv: true, sitzung: idx + 1, gapDays: state.gapDays };
  if (state.sitzungen.length < 2) {
    return { ...basis, aktiv: true, sitzung: state.sitzungen.length + 1, gapDays: state.gapDays };
  }
  return { ...basis, gapDays: state.gapDays };
}

export function resumeAusloesen(p: Progress, now = new Date()): Progress {
  const heute = heuteIso(now);
  const gapDays = p.streak.last ? Math.max(0, tageZwischen(p.streak.last, heute)) : 0;
  const alt = p.resume;
  if (!alt) {
    if (!p.streak.last || gapDays <= 5) return p;
    return { ...p, resume: { startDatum: heute, startTag: p.plan.day, sitzungen: [heute], gapDays } };
  }
  if (gapDays > 5 && alt.startDatum !== heute && !alt.sitzungen.includes(heute)) {
    return { ...p, resume: { startDatum: heute, startTag: p.plan.day, sitzungen: [heute], gapDays } };
  }
  if (!alt.sitzungen.includes(heute) && alt.sitzungen.length < 2) {
    return { ...p, resume: { ...alt, sitzungen: [...alt.sitzungen, heute] } };
  }
  return p;
}

export function resumeBedarf(p: Progress, now = new Date()): boolean {
  return resumeAusloesen(p, now) !== p;
}

export function resumePlan(plan: DayPlan, p: Progress, now = new Date()): DayPlan {
  if (!resumeZustand(p, now).aktiv) return plan;
  const kritisch = plan.tasks.filter((t) => t.mandatory || t.exam || t.kind === "wiederholen");
  const tasks = kritisch.length > 0
    ? kritisch
    : [...plan.tasks].sort((a, b) => a.minutes - b.minutes).slice(0, 1);
  return {
    ...plan,
    tasks,
    zielMin: Math.max(20, Math.ceil(plan.zielMin / 2)),
  };
}
