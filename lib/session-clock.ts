/**
 * Session time is deliberately independent from estimated task durations.
 * The learner starts a 90-minute target by default and may add optional
 * 30-minute blocks after reaching it. Stopping earlier is always valid.
 */
export const DEFAULT_SESSION_GOAL_MINUTES = 90;
export const SESSION_MORE_BLOCK_MINUTES = 30;
export const SESSION_IDLE_TIMEOUT_MS = 10 * 60 * 1000;
export const MAX_SESSION_TICK_MS = 5_000;

export interface SessionClock {
  day: number;
  /** Foreground active time accumulated for this day's learning session. */
  totalMs: number;
  /** Portion already recorded in Progress.plan.minutenEffektiv. */
  syncedMs: number;
  /** Starts at 90 and grows only when the learner explicitly chooses “more”. */
  goalMinutes: number;
  /** Active time attributed to each task; unfinished time remains ungraded. */
  taskMs: Record<string, number>;
}

export function emptySessionClock(day: number): SessionClock {
  return {
    day,
    totalMs: 0,
    syncedMs: 0,
    goalMinutes: DEFAULT_SESSION_GOAL_MINUTES,
    taskMs: {},
  };
}

const finiteNonNegative = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;

/** Parse and bound locally persisted clock data without treating corruption as failure. */
export function normalizeSessionClock(value: unknown, day: number): SessionClock {
  if (!value || typeof value !== "object") return emptySessionClock(day);
  const raw = value as Partial<SessionClock>;
  const totalMs = finiteNonNegative(raw.totalMs);
  const syncedMs = Math.min(totalMs, finiteNonNegative(raw.syncedMs));
  const taskMs: Record<string, number> = {};
  if (raw.taskMs && typeof raw.taskMs === "object" && !Array.isArray(raw.taskMs)) {
    for (const [id, amount] of Object.entries(raw.taskMs)) {
      const ms = finiteNonNegative(amount);
      if (id && ms > 0) taskMs[id] = Math.min(ms, totalMs);
    }
  }
  const goal = finiteNonNegative(raw.goalMinutes);
  return {
    day,
    totalMs,
    syncedMs,
    goalMinutes: Math.max(DEFAULT_SESSION_GOAL_MINUTES, goal || DEFAULT_SESSION_GOAL_MINUTES),
    taskMs,
  };
}

/** Add only time that the foreground timer actually measured, capped at the current goal. */
export function advanceSessionClock(clock: SessionClock, deltaMs: number, taskId?: string): SessionClock {
  const delta = finiteNonNegative(deltaMs);
  if (delta <= 0 || sessionGoalReached(clock)) return clock;
  const remaining = Math.max(0, clock.goalMinutes * 60_000 - clock.totalMs);
  const accepted = Math.min(delta, remaining);
  if (accepted <= 0) return clock;
  const taskMs = taskId
    ? { ...clock.taskMs, [taskId]: (clock.taskMs[taskId] ?? 0) + accepted }
    : clock.taskMs;
  return { ...clock, totalMs: clock.totalMs + accepted, taskMs };
}

export function extendSessionClock(clock: SessionClock, minutes = SESSION_MORE_BLOCK_MINUTES): SessionClock {
  const extra = finiteNonNegative(minutes);
  if (extra <= 0) return clock;
  return { ...clock, goalMinutes: clock.goalMinutes + extra };
}

export function sessionGoalReached(clock: SessionClock): boolean {
  return clock.totalMs >= clock.goalMinutes * 60_000;
}

export function pendingSessionMinutes(clock: SessionClock): number {
  return Math.max(0, clock.totalMs - clock.syncedMs) / 60_000;
}

export function markSessionClockSynced(clock: SessionClock): SessionClock {
  return { ...clock, syncedMs: clock.totalMs };
}

export function sessionTaskMinutes(clock: SessionClock, taskId: string): number {
  return Math.max(0, clock.taskMs[taskId] ?? 0) / 60_000;
}

/** A tenths-of-a-minute display bucket avoids rendering the full page every second. */
export function sessionMinuteTenth(ms: number): number {
  return Math.floor(finiteNonNegative(ms) / 6_000);
}
