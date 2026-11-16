import { lokalesDatum, lokalesDatumPlus } from "./datum";
import {
  evidenceWeightOf,
  isMeasuredEvidence,
  KOMPETENZEN,
  MIN_MEASURED_PER_SKILL,
} from "./kompetenz";
import type { Kompetenz, Progress, SkillRemediationCycle } from "./types";

/**
 * PA-021 — limited, safe personalization.
 * Only recent, unassisted measured/external evidence may create a remedial dose.
 * The dose is optional and additive: it never removes or reorders a core-plan goal.
 * Completion is an activity report; effectiveness needs fresh independent evidence
 * no earlier than three local calendar days later.
 */
export const SKILL_WINDOW_DAYS = 28;
export const SKILL_VERIFY_DELAY_DAYS = 3;
export const SKILL_VERIFY_MIN_WEIGHT = 3;
export const SKILL_TARGET_SCORE = 80;

export type SkillStation = "lesestoff" | "hoeren" | "briefe" | "muendlich" | "uebungen" | "wortreview";

export interface SkillFoerderdosis {
  hand: Kompetenz;
  wert: number;
  measuredWeight: number;
  minuten: 10 | 15 | 20;
  station: SkillStation;
}

export interface SkillFoerderplan {
  fensterTage: number;
  mindestGewicht: number;
  auswertbareSkills: number;
  dosen: SkillFoerderdosis[];
}

export type SkillVerifyStatus = "waiting" | "due" | "passed" | "repeat";
export interface SkillVerifikation {
  hand: Kompetenz;
  cycle: SkillRemediationCycle;
  status: SkillVerifyStatus;
  measuredWeight: number;
  score: number | null;
}

const STATION: Record<Kompetenz, SkillStation> = {
  Lesen: "lesestoff",
  Hoeren: "hoeren",
  Schreiben: "briefe",
  Sprechen: "muendlich",
  Grammatik: "uebungen",
  Wortschatz: "wortreview",
};

function scoreOf(entries: NonNullable<Progress["kompetenzLog"]>): { score: number; weight: number } {
  let weight = 0;
  let success = 0;
  for (const entry of entries) {
    const w = evidenceWeightOf(entry);
    weight += w;
    success += entry.ok ? w : 0;
  }
  return {
    score: weight > 0 ? Math.round(success * 100 / weight) : 0,
    weight: Math.round(weight * 1000) / 1000,
  };
}

function dosisMinuten(score: number): 10 | 15 | 20 {
  if (score < 50) return 20;
  if (score < 65) return 15;
  return 10;
}

/** At most two weak skills; absent/legacy/self-report/activity/assisted data stay unknown. */
export function skillFoerderplan(p: Progress, now = new Date()): SkillFoerderplan {
  const today = lokalesDatum(now);
  const from = lokalesDatumPlus(-(SKILL_WINDOW_DAYS - 1), now);
  const rows = KOMPETENZEN.map((hand) => {
    const entries = (p.kompetenzLog ?? []).filter((entry) =>
      entry.h === hand
      && !!entry.d
      && entry.d >= from
      && entry.d <= today
      && isMeasuredEvidence(entry),
    );
    const result = scoreOf(entries);
    return { hand, ...result };
  });
  const eligible = rows.filter((row) => row.weight >= MIN_MEASURED_PER_SKILL);
  const dosen = eligible
    .filter((row) => row.score < SKILL_TARGET_SCORE)
    .sort((a, b) => a.score - b.score || b.weight - a.weight || a.hand.localeCompare(b.hand))
    .slice(0, 2)
    .map((row): SkillFoerderdosis => ({
      hand: row.hand,
      wert: row.score,
      measuredWeight: row.weight,
      minuten: dosisMinuten(row.score),
      station: STATION[row.hand],
    }));
  return {
    fensterTage: SKILL_WINDOW_DAYS,
    mindestGewicht: MIN_MEASURED_PER_SKILL,
    auswertbareSkills: eligible.length,
    dosen,
  };
}

/** Learner-reported dose completion schedules a later check; it is not measured evidence. */
export function registriereSkillDosis(p: Progress, hand: Kompetenz, now = new Date()): Progress {
  const dose = skillFoerderplan(p, now).dosen.find((entry) => entry.hand === hand);
  if (!dose) return p;
  const current = skillVerifikationen(p, now).find((entry) => entry.hand === hand);
  if (current?.status === "waiting" || current?.status === "due") return p;
  const completedDate = lokalesDatum(now);
  const cycle: SkillRemediationCycle = {
    completedDate,
    verifyDueDate: lokalesDatumPlus(SKILL_VERIFY_DELAY_DAYS, now),
    baselineScore: dose.wert,
    doseMinutes: dose.minuten,
    sourceWindowDays: SKILL_WINDOW_DAYS,
  };
  return {
    ...p,
    skillRemediation: { ...(p.skillRemediation ?? {}), [hand]: cycle },
  };
}

/**
 * A check is independent only when fresh eligible evidence is dated on/after dueDate.
 * Three effective evidence units are required; immediate practice and assisted work do not count.
 */
export function skillVerifikationen(p: Progress, now = new Date()): SkillVerifikation[] {
  const today = lokalesDatum(now);
  const checks: SkillVerifikation[] = [];
  for (const hand of KOMPETENZEN) {
    const cycle = p.skillRemediation?.[hand];
    if (!cycle) continue;
    if (today < cycle.verifyDueDate) {
      checks.push({ hand, cycle, status: "waiting", measuredWeight: 0, score: null });
      continue;
    }
    const entries = (p.kompetenzLog ?? []).filter((entry) =>
      entry.h === hand
      && !!entry.d
      && entry.d >= cycle.verifyDueDate
      && entry.d <= today
      && isMeasuredEvidence(entry),
    );
    const result = scoreOf(entries);
    if (result.weight < SKILL_VERIFY_MIN_WEIGHT) {
      checks.push({ hand, cycle, status: "due", measuredWeight: result.weight, score: null });
      continue;
    }
    checks.push({
      hand,
      cycle,
      status: result.score >= SKILL_TARGET_SCORE ? "passed" : "repeat",
      measuredWeight: result.weight,
      score: result.score,
    });
  }
  return checks;
}
