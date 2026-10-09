"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { recordStudyMinutes } from "@/lib/store";
import { PROFILE_WILL_CHANGE, progressKeyActive } from "@/lib/profiles";
import {
  advanceSessionClock,
  emptySessionClock,
  extendSessionClock,
  markSessionClockSynced,
  normalizeSessionClock,
  pendingSessionMinutes,
  sessionGoalReached,
  sessionMinuteTenth,
  sessionTaskMinutes,
  SESSION_IDLE_TIMEOUT_MS,
  MAX_SESSION_TICK_MS,
  type SessionClock,
} from "@/lib/session-clock";

const SAVE_EVERY_MS = 5_000;
const SYNC_EVERY_MS = 30_000;

function persistClock(key: string, clock: SessionClock) {
  try { window.localStorage.setItem(key, JSON.stringify(clock)); } catch { /* keep the current tab usable if storage is blocked */ }
}

export interface SessionClockController {
  clock: SessionClock;
  loaded: boolean;
  running: boolean;
  pauseReason: "manual" | "idle" | "goal" | null;
  start: () => void;
  pause: () => SessionClock;
  extend: () => void;
  checkpoint: () => SessionClock;
  taskMinutes: (taskId: string) => number;
}

/**
 * Measures foreground session time independently from task estimates.
 * Time is accumulated only after the learner starts, stops while the page is
 * hidden, auto-pauses after prolonged inactivity, and resumes only by choice.
 */
export function useSessionClock(day: number, taskId?: string, enabled = true): SessionClockController {
  const key = `${progressKeyActive()}:study-clock:${day}`;
  const [clock, setClock] = useState<SessionClock>(() => emptySessionClock(day));
  const clockRef = useRef<SessionClock>(emptySessionClock(day));
  const keyRef = useRef(key);
  const taskIdRef = useRef(taskId);
  const dayRef = useRef(day);
  keyRef.current = key;
  taskIdRef.current = taskId;
  dayRef.current = day;

  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const [pauseReason, setPauseReason] = useState<"manual" | "idle" | "goal" | null>(null);
  const lastTickRef = useRef(0);
  const lastActivityRef = useRef(0);
  const lastSavedAtRef = useRef(0);
  const lastSyncedAtRef = useRef(0);
  const lastShownTenthRef = useRef(0);
  const tickRef = useRef<(now: number, allowHidden: boolean) => SessionClock>(() => clockRef.current);
  const pauseRef = useRef<() => SessionClock>(() => clockRef.current);

  const publish = useCallback((next: SessionClock, force = false) => {
    const prev = clockRef.current;
    clockRef.current = next;
    const tenth = sessionMinuteTenth(next.totalMs);
    if (force || tenth !== lastShownTenthRef.current || next.goalMinutes !== prev.goalMinutes) {
      lastShownTenthRef.current = tenth;
      setClock(next);
    }
  }, []);

  const syncPending = useCallback((snapshot: SessionClock, storageKey = keyRef.current): SessionClock => {
    let next = snapshot;
    const pending = pendingSessionMinutes(snapshot);
    if (pending > 0) {
      const saved = recordStudyMinutes(snapshot.day, pending);
      if (saved > 0) next = markSessionClockSynced(snapshot);
    }
    publish(next, true);
    persistClock(storageKey, next);
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    lastSavedAtRef.current = now;
    lastSyncedAtRef.current = now;
    return next;
  }, [publish]);

  useEffect(() => {
    if (!enabled) return;
    runningRef.current = false;
    setRunning(false);
    setPauseReason(null);
    let loaded = emptySessionClock(day);
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) loaded = normalizeSessionClock(JSON.parse(raw) as unknown, day);
    } catch { /* corrupt or unavailable timer data starts a fresh, unpenalized clock */ }

    // Recover the last short interval if the browser closed before its next sync.
    const pending = pendingSessionMinutes(loaded);
    if (pending > 0 && recordStudyMinutes(day, pending) > 0) loaded = markSessionClockSynced(loaded);
    clockRef.current = loaded;
    setClock(loaded);
    lastShownTenthRef.current = sessionMinuteTenth(loaded.totalMs);
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    lastSavedAtRef.current = now;
    lastSyncedAtRef.current = now;
    persistClock(key, loaded);
    setLoadedKey(key);
  }, [enabled, key, day]);

  const tick = useCallback((now: number, allowHidden: boolean): SessionClock => {
    const before = clockRef.current;
    if (!runningRef.current || before.day !== dayRef.current) return before;

    const previousAt = lastTickRef.current || now;
    lastTickRef.current = now;
    const hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
    if (hidden && !allowHidden) return before;

    const idleAt = lastActivityRef.current + SESSION_IDLE_TIMEOUT_MS;
    const idle = now >= idleAt;
    const measuredUntil = idle ? Math.min(now, idleAt) : now;
    const rawDelta = Math.max(0, measuredUntil - previousAt);
    const delta = Math.min(rawDelta, MAX_SESSION_TICK_MS);
    const next = advanceSessionClock(before, delta, taskIdRef.current);
    const reachedGoal = sessionGoalReached(next);
    const bucketChanged = sessionMinuteTenth(next.totalMs) !== lastShownTenthRef.current;

    clockRef.current = next;
    const shouldSave = now - lastSavedAtRef.current >= SAVE_EVERY_MS || reachedGoal || idle;
    if (shouldSave) {
      persistClock(keyRef.current, next);
      lastSavedAtRef.current = now;
    }
    if (bucketChanged || reachedGoal || idle) publish(next, true);

    if (now - lastSyncedAtRef.current >= SYNC_EVERY_MS || reachedGoal || idle) {
      // Use elapsed unsynced time, not task estimates; syncPending is idempotent.
      if (pendingSessionMinutes(next) > 0) syncPending(next);
    }
    if (reachedGoal || idle) {
      runningRef.current = false;
      setRunning(false);
      setPauseReason(reachedGoal ? "goal" : "idle");
      syncPending(clockRef.current);
    }
    return clockRef.current;
  }, [publish, syncPending]);
  tickRef.current = tick;

  const start = useCallback(() => {
    if (!enabled || loadedKey !== key) return;
    const current = clockRef.current;
    if (current.day !== day || sessionGoalReached(current)) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    runningRef.current = true;
    setRunning(true);
    setPauseReason(null);
    lastTickRef.current = now;
    lastActivityRef.current = now;
  }, [enabled, loadedKey, key, day]);

  const pause = useCallback((): SessionClock => {
    const wasRunning = runningRef.current;
    if (wasRunning) tickRef.current(typeof performance !== "undefined" ? performance.now() : Date.now(), true);
    const shouldMarkManual = wasRunning && runningRef.current && !sessionGoalReached(clockRef.current);
    const current = clockRef.current;
    runningRef.current = false;
    setRunning(false);
    if (shouldMarkManual) setPauseReason("manual");
    return syncPending(current);
  }, [syncPending]);
  pauseRef.current = pause;

  const checkpoint = useCallback((): SessionClock => {
    if (runningRef.current) tickRef.current(typeof performance !== "undefined" ? performance.now() : Date.now(), true);
    return syncPending(clockRef.current);
  }, [syncPending]);

  const extend = useCallback(() => {
    const current = clockRef.current;
    if (!sessionGoalReached(current)) return;
    const next = extendSessionClock(current);
    publish(next, true);
    persistClock(keyRef.current, next);
    setPauseReason(null);
    start();
  }, [publish, start]);

  useEffect(() => {
    if (!enabled || loadedKey !== key) return;
    const interval = window.setInterval(() => tickRef.current(performance.now(), false), 1_000);
    const markActivity = () => {
      if (runningRef.current) lastActivityRef.current = performance.now();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") pauseRef.current();
    };
    const onPageHide = () => pauseRef.current();
    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "input", "scroll"];
    for (const event of activityEvents) window.addEventListener(event, markActivity, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener(PROFILE_WILL_CHANGE, onPageHide);
    return () => {
      window.clearInterval(interval);
      for (const event of activityEvents) window.removeEventListener(event, markActivity);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener(PROFILE_WILL_CHANGE, onPageHide);
      if (keyRef.current === key) {
        pauseRef.current();
        return;
      }

      // Day/profile changes run cleanup after render has already updated keyRef.
      // Never copy the old clock into the next day's/profile's storage key.
      runningRef.current = false;
      setRunning(false);
      const oldProfileKey = key.split(":study-clock:")[0];
      const activeProfileKey = keyRef.current.split(":study-clock:")[0];
      if (oldProfileKey === activeProfileKey && clockRef.current.day === day) {
        syncPending(clockRef.current, key);
      }
    };
  }, [enabled, loadedKey, key, syncPending]);

  const visibleClock = clock.day === day ? clock : emptySessionClock(day);
  return {
    clock: visibleClock,
    loaded: loadedKey === key,
    running: running && loadedKey === key,
    pauseReason,
    start,
    pause,
    extend,
    checkpoint,
    taskMinutes: (id: string) => sessionTaskMinutes(clockRef.current, id),
  };
}
