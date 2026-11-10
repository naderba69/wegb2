"use client";

import { useSyncExternalStore } from "react";
import { abonniereBankAenderung, bankGenerationSnapshot } from "./bankload";

/**
 * Verknüpft React-Ansichten mit dem stufenweisen Bank-Lader.
 * Der Zahlenwert selbst ist unwichtig; jede neue Bank-Schicht löst eine
 * Neuberechnung der aus den mutierten Content-Containern abgeleiteten Werte aus.
 */
export function useBankGeneration(): number {
  return useSyncExternalStore(abonniereBankAenderung, bankGenerationSnapshot, () => 0);
}
