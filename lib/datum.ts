/** Kalendertage der lernenden Person — bewusst lokal, nicht UTC. */
export function lokalesDatum(datum = new Date()): string {
  const jahr = datum.getFullYear();
  const monat = String(datum.getMonth() + 1).padStart(2, "0");
  const tag = String(datum.getDate()).padStart(2, "0");
  return `${jahr}-${monat}-${tag}`;
}

/** Lokaler Kalendertag relativ zu einem Zeitpunkt; 12 Uhr vermeidet DST-Kanten. */
export function lokalesDatumPlus(tage: number, basis = new Date()): string {
  const verschoben = new Date(basis.getFullYear(), basis.getMonth(), basis.getDate() + tage, 12, 0, 0, 0);
  return lokalesDatum(verschoben);
}
