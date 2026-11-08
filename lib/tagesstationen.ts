import type { DayTask } from "./types";

export type TagesStation = 1 | 2 | 3 | 4 | 5;
export type StationsStatus = "done" | "active" | "locked";

/**
 * Ordnet echte Tagesaufgaben den fünf sichtbaren Stationen zu. Pflichtschulden
 * gehören zur Abrufstation, unabhängig von ihrem ursprünglichen Aufgabentyp.
 */
export function stationFuerAufgabe(task: DayTask): TagesStation {
  if (task.mandatory || task.kind === "wiederholen" || task.verifyFor) return 1;
  if (task.kind === "grammatik") return 2;
  if (["wortschatz", "lesen", "hoeren", "aussprache"].includes(task.kind)) return 3;
  if (["schreiben", "sprechen", "partner", "briefe", "schulsim"].includes(task.kind)) return 4;
  return 5;
}

export function gruppiereTagesAufgaben(tasks: readonly DayTask[]): Map<TagesStation, DayTask[]> {
  const gruppen = new Map<TagesStation, DayTask[]>([[1, []], [2, []], [3, []], [4, []], [5, []]]);
  for (const task of tasks) gruppen.get(stationFuerAufgabe(task))!.push(task);
  return gruppen;
}

/**
 * Eine Station gilt nach der Abgabe als erledigt, auch wenn das Ergebnis nicht
 * bestanden war: Fehler werden vom bestehenden Schuld-/Wiederholungsmodell
 * behandelt. Lokale, noch nicht abgegebene Quizpunkte öffnen nichts.
 */
export function ermittleStationsStatus(
  tasks: readonly DayTask[],
  wurdeAbgegeben: (task: DayTask) => boolean,
  istRitualGesperrt: (index: number) => boolean,
): Map<TagesStation, StationsStatus> {
  const gruppen = gruppiereTagesAufgaben(tasks);
  const status = new Map<TagesStation, StationsStatus>();
  let offeneStationDavor = false;

  for (let station = 1 as TagesStation; station <= 5; station = (station + 1) as TagesStation) {
    const aufgaben = gruppen.get(station) ?? [];
    if (aufgaben.length === 0) {
      status.set(station, offeneStationDavor ? "locked" : "done");
      continue;
    }
    if (aufgaben.every(wurdeAbgegeben)) {
      status.set(station, "done");
      continue;
    }

    const offeneAufgaben = aufgaben.filter((task) => !wurdeAbgegeben(task));
    const ritualGesperrt = offeneAufgaben.length > 0 && offeneAufgaben.every((task) => {
      const index = tasks.indexOf(task);
      return index >= 0 && istRitualGesperrt(index);
    });
    if (offeneStationDavor || ritualGesperrt) {
      status.set(station, "locked");
      offeneStationDavor = true;
      continue;
    }

    status.set(station, "active");
    offeneStationDavor = true;
  }

  return status;
}
