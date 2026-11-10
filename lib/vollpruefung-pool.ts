/**
 * Transparente Zählung des Hördialog-Pools der internen Mini-Prüfung.
 * Die Funktion ist rein, damit Browser-Lader, Qualitätsseite und Tests dieselbe
 * Zulassungsregel verwenden: mindestens eine auswertbare MC-Frage plus Audio.
 */
export const VP_B2_REFERENZ_ITEMS = { lesen: 30, hoeren: 30 } as const;

export interface VpPoolFrage {
  options?: readonly unknown[];
  answer?: unknown;
}

export interface VpPoolDialog {
  id: string;
  level: string;
  questions?: readonly VpPoolFrage[];
}

export interface VpDialogPoolZaehler {
  gesamt: number;
  akzeptiert: number;
  ausgeschlossen: number;
  ohneAudio: number;
  mitAudioOhneMc: number;
  mitEinerMc: number;
  mcFragen: number;
  sonstigeFragen: number;
}

export interface VpDialogPoolTransparenz {
  gesamt: VpDialogPoolZaehler;
  nachStufe: Record<string, VpDialogPoolZaehler>;
}

function leer(): VpDialogPoolZaehler {
  return {
    gesamt: 0,
    akzeptiert: 0,
    ausgeschlossen: 0,
    ohneAudio: 0,
    mitAudioOhneMc: 0,
    mitEinerMc: 0,
    mcFragen: 0,
    sonstigeFragen: 0,
  };
}

export function istVpMcFrage(frage: VpPoolFrage): boolean {
  return Array.isArray(frage.options) && frage.options.length >= 3 &&
    typeof frage.answer === "string" && frage.answer.trim().length > 0;
}

export function zaehleVpDialogPool(
  dialoge: readonly VpPoolDialog[],
  audioIds: ReadonlySet<string>
): VpDialogPoolTransparenz {
  const gesamt = leer();
  const nachStufe: Record<string, VpDialogPoolZaehler> = {};

  for (const dialog of dialoge) {
    const stufe = nachStufe[dialog.level] ?? (nachStufe[dialog.level] = leer());
    const fragen = dialog.questions ?? [];
    const mcAnzahl = fragen.filter(istVpMcFrage).length;
    const hatAudio = audioIds.has(dialog.id);

    for (const zaehler of [gesamt, stufe]) {
      zaehler.gesamt += 1;
      zaehler.mcFragen += mcAnzahl;
      zaehler.sonstigeFragen += fragen.length - mcAnzahl;
      if (!hatAudio) zaehler.ohneAudio += 1;
      else if (mcAnzahl === 0) zaehler.mitAudioOhneMc += 1;
      else {
        zaehler.akzeptiert += 1;
        if (mcAnzahl === 1) zaehler.mitEinerMc += 1;
      }
    }
  }

  for (const zaehler of [gesamt, ...Object.values(nachStufe)]) {
    zaehler.ausgeschlossen = zaehler.gesamt - zaehler.akzeptiert;
  }
  return { gesamt, nachStufe };
}
