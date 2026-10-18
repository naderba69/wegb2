# -*- coding: utf-8 -*-
# R272: Vollstaendige maschinelle Audio-QC fuer den GESAMTEN Audio-Bestand
# (public/audio/{dialog,diktat,hoeren,hoerneu,sprichwort} = alle MP3s des Projekts).
# Ersetzt fuer den Gesamtbestand die Teilskripte audio_qc_r169.py (nur Dialoge)
# und audio_qc_hoerneu.py (nur HoerNeu); deren historische Berichte bleiben gueltig.
#
# Geprueft wird pro Datei: Dekodierbarkeit, Dauer, Zeichen-Tempo gegen den
# Banktext, Stille-Anteil, laengstes Stille-Loch, An-/Abklang, Peak, RMS,
# Clipping. Schwellen wie R169; die Stille-Regel des Projekts bleibt:
# geflaggt wird nur Stille-Anteil > 0.65 oder ein Loch > 4.0 s.
# Ehrlichkeitsgrenze: Das ist eine MASCHINELLE Messung (Vollstaendigkeit/
# Hoerbarkeit/Tempo). Kein menschliches Anhoeren, kein Aussprache-/
# Natuerlichkeitsurteil. Der gelesene Text ist der Banktext der jeweiligen
# content/*.json (zeichengleich per Konstruktion der Manifeste).
#
# Ausfuehrung (miniaudio+numpy in einem Werkzeug-venv, PEP-668-sicher):
#   python3 -m venv /tmp/qcenv && /tmp/qcenv/bin/pip install miniaudio numpy
#   /tmp/qcenv/bin/python scripts/audio_qc_all.py
# Schreibt docs/audio-qc-all-2026-10-18.json; K304 im Smoke pinnt Bericht,
# Abdeckung (jede MP3 auf der Platte genau einmal) und Anomalienzahl.
import json, math, os, statistics, sys
import miniaudio
import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), "..")
DATUM = "2026-10-18"
STILLE_SCHWELLE = 104          # |sample| < 104  (~ -50 dBFS) gilt als still
FENSTER_S = 0.01               # 10-ms-Fenster fuer Loch/An-/Abklang

GEMEINSAM = {
    "maxStilleAnteil": 0.65,
    "maxStilleLochS": 4.0,
    "maxAnklangS": 2.5,
    "maxAbklangS": 3.0,
    "minPeak": 0.10,
    "maxClipAnteil": 0.005,
    "minRmsDb": -45.0,
}
SCHWELLEN = {
    # Kurze Diktat-Saetze (z. B. "Hallo!") brauchen ehrliche Untergrenzen.
    "diktat":     dict(GEMEINSAM, minDauerS=0.4, zeichenProSekunde=[3.5, 30.0]),
    "sprichwort": dict(GEMEINSAM, minDauerS=0.8, zeichenProSekunde=[3.5, 30.0]),
    # R169-Stand, dort mit 0 Anomalien an 164 Dialogen belegt.
    "dialog":     dict(GEMEINSAM, minDauerS=3.0, zeichenProSekunde=[5.0, 22.0]),
    "hoeren":     dict(GEMEINSAM, minDauerS=5.0, zeichenProSekunde=[5.0, 22.0]),
    "hoerneu":    dict(GEMEINSAM, minDauerS=3.0, zeichenProSekunde=[5.0, 22.0]),
}
GRUPPEN_DATEIEN = {  # gruppe -> (verzeichnis, erwartete anzahl)
    "dialog": ("dialog", 164), "diktat": ("diktat", 674), "hoeren": ("hoeren", 157),
    "hoerneu": ("hoerneu", 16), "sprichwort": ("sprichwort", 8),
}


def lade(name):
    return json.load(open(os.path.join(ROOT, "content", name), encoding="utf-8"))


def texte_und_stimmen():
    """id -> (dateiname, gruppe, stimme, text) aus den Bank-Manifesten."""
    out = {}
    sents = lade("sentences.json")
    s_de = {x["id"]: x["de"] for x in sents}
    for e in lade("diktat-audio.json")["einsaetze"]:
        out[e["file"].split("/")[-1]] = (e["id"], "diktat", e["voice"], s_de.get(e["id"], ""))
    dlg_de = {d["id"]: " ".join(z["de"] for z in d["lines"]) for d in lade("dialogues.json")}
    for e in lade("dialog-audio.json")["einsaetze"]:
        out[e["file"].split("/")[-1]] = (e["id"], "dialog", e["voice"], dlg_de.get(e["id"], ""))
    txt_de = {t["id"]: t["de"] for t in lade("texts.json")}
    for e in lade("hoeren-audio.json")["einsaetze"]:
        out[e["file"].split("/")[-1]] = (e["id"], "hoeren", e["voice"], txt_de.get(e["id"], ""))
    for item in lade("hoerneu.json")["items"]:
        for clip in item["clips"]:
            text = " ".join(item["zeilen"][z]["de"] for z in clip["zeilen"])
            out[clip["datei"].split("/")[-1]] = (item["id"], "hoerneu", clip["stimmeLabel"], text)
    for e in lade("sprichwort-audio.json").values():
        out[e["file"].split("/")[-1]] = (e["id"], "sprichwort", e["voice"], e["de"])
    return out


def segmente(data):
    """Haus-Dialoge sind Konkatenationen einzelner MP3-Segmente (je Zeile eins,
    jedes mit eigenem ID3v2-Tag). Ein einfacher Dekodierer stoppt nach Segment 1
    und meldet das File faelschlich als 'zu kurz' (historischer Fehlalarm) —
    darum segmentweise dekodieren und die Samples aneinanderhaengen."""
    pos, i = [], 0
    while True:
        j = data.find(b"ID3", i)
        if j < 0:
            break
        # echter ID3v2-Header: Major-Version 2/3/4, Revision 0, synchsafe Groesse.
        # (Blosses "ID3" kommt auch zufaellig in Frame-Daten vor — Fehlalarm-Falle.)
        if j + 10 <= len(data) and data[j + 3] in (2, 3, 4) and data[j + 4] == 0 \
                and all(b < 0x80 for b in data[j + 6:j + 10]):
            pos.append(j)
        i = j + 3
    if not pos or pos[0] != 0:
        return [data]
    return [data[pos[k]:(pos[k + 1] if k + 1 < len(pos) else len(data))] for k in range(len(pos))]


def analysiere(pfad):
    roh = open(pfad, "rb").read()
    teile = []
    for chunk in segmente(roh):
        d = miniaudio.decode(chunk, output_format=miniaudio.SampleFormat.SIGNED16,
                             nchannels=1, sample_rate=44100)
        teile.append(np.frombuffer(bytes(d.samples), dtype=np.int16).astype(np.int32))
    mono = np.concatenate(teile) if teile else np.zeros(0, dtype=np.int32)
    sr = 44100
    n = len(mono)
    dauer = n / sr
    a = np.abs(mono)
    peak = float(a.max()) / 32768.0 if n else 0.0
    rms = float(np.sqrt(np.mean(mono.astype(np.float64) ** 2))) / 32768.0 if n else 0.0
    rms_db = 20 * math.log10(rms) if rms > 0 else -99.0
    still_anteil = float(np.mean(a < STILLE_SCHWELLE)) if n else 1.0
    clip_anteil = float(np.mean(a >= 32700)) if n else 0.0
    # Fensterstatistik (10 ms) fuer Loch + An-/Abklang
    w = max(1, int(sr * FENSTER_S))
    nf = n // w
    if nf:
        fr = a[: nf * w].reshape(nf, w)
        laut = fr.max(axis=1) >= STILLE_SCHWELLE
        # laengster Still-Lauf
        laengste, lauf = 0, 0
        for x in laut:
            lauf = 0 if x else lauf + 1
            laengste = max(laengste, lauf)
        laengste_s = laengste * FENSTER_S
        idx = np.flatnonzero(laut)
        anklang = (idx[0] * FENSTER_S) if len(idx) else dauer
        abklang = ((nf - 1 - idx[-1]) * FENSTER_S) if len(idx) else dauer
    else:
        laengste_s, anklang, abklang = dauer, dauer, dauer
    return dauer, peak, rms_db, still_anteil, clip_anteil, anklang, abklang, laengste_s


def main():
    meta = texte_und_stimmen()
    dateien, anomalien = [], []
    abdeckung_fehlt = []
    for gruppe, (verz, soll) in GRUPPEN_DATEIEN.items():
        pfad_verz = os.path.join(ROOT, "public", "audio", verz)
        auf_platte = sorted(f for f in os.listdir(pfad_verz) if f.endswith(".mp3"))
        if len(auf_platte) != soll:
            abdeckung_fehlt.append(f"{gruppe}: {len(auf_platte)} statt {soll} auf Platte")
        for datei in auf_platte:
            sid, grp, stimme, text = meta.get(datei, (datei[:-4], gruppe, "?", ""))
            if grp != gruppe:
                abdeckung_fehlt.append(f"{datei}: Manifest-Gruppe {grp} != Verzeichnis {gruppe}")
            pfad = os.path.join(pfad_verz, datei)
            schw = SCHWELLEN[gruppe]
            fehler = []
            try:
                dauer, peak, rms_db, still, clipA, anklang, abklang, loch = analysiere(pfad)
            except Exception as ex:  # Dekodierfehler ist ein Befund, kein Absturz
                dauer, peak, rms_db, still, clipA, anklang, abklang, loch = 0, 0, -99, 1, 0, 0, 0, 0
                fehler.append("dekodierung:" + type(ex).__name__)
            zeichen = len(text)
            cps = zeichen / dauer if dauer else 0.0
            if dauer < schw["minDauerS"]: fehler.append("dauer")
            if still > schw["maxStilleAnteil"] or loch > schw["maxStilleLochS"]: fehler.append("stille")
            if anklang > schw["maxAnklangS"]: fehler.append("anklang")
            if abklang > schw["maxAbklangS"]: fehler.append("abklang")
            if peak < schw["minPeak"]: fehler.append("peak")
            if clipA > schw["maxClipAnteil"]: fehler.append("clipping")
            if rms_db < schw["minRmsDb"]: fehler.append("rms")
            if zeichen and not (schw["zeichenProSekunde"][0] <= cps <= schw["zeichenProSekunde"][1]):
                fehler.append("tempo")
            if not zeichen: fehler.append("text-fehlt")
            e = {"id": sid, "gruppe": gruppe, "datei": f"/audio/{verz}/{datei}", "voice": stimme,
                 "bytes": os.path.getsize(pfad), "dauerS": round(dauer, 2), "zeichen": zeichen,
                 "zeichenProSekunde": round(cps, 2), "peak": round(peak, 3), "rmsDb": round(rms_db, 1),
                 "stilleAnteil": round(still, 3), "laengsteStilleS": round(loch, 2),
                 "clipAnteil": round(clipA, 5), "anklangS": round(anklang, 2), "abklangS": round(abklang, 2),
                 "ok": not fehler, "fehler": fehler}
            dateien.append(e)
            if fehler: anomalien.append(e)
    gruppen = {}
    for gruppe in GRUPPEN_DATEIEN:
        g = [e for e in dateien if e["gruppe"] == gruppe]
        gruppen[gruppe] = {
            "anzahl": len(g), "anomalien": sum(1 for e in g if not e["ok"]),
            "dauerMedianS": round(statistics.median(e["dauerS"] for e in g), 2) if g else 0,
            "zeichenProSekundeMedian": round(statistics.median(e["zeichenProSekunde"] for e in g), 2) if g else 0,
            "stilleMedian": round(statistics.median(e["stilleAnteil"] for e in g), 3) if g else 0,
        }
    bericht = {
        "werkzeug": "scripts/audio_qc_all.py (miniaudio-Dekodierung, 16-bit PCM, numpy; Schwellen wie R169, Stille-Regel 0.65/4.0s)",
        "datum": DATUM,
        "gegenstand": "Gesamter Audio-Bestand: public/audio/{dialog,diktat,hoeren,hoerneu,sprichwort} — jede MP3 genau einmal geprueft (R272).",
        "schwellen": SCHWELLEN,
        "abdeckung": {"dateienGeprueft": len(dateien), "luecken": abdeckung_fehlt},
        "gruppen": gruppen,
        "anomalienGesamt": len(anomalien),
        "grenzEhrlichkeit": "Maschinelle QC: Dekodierbarkeit, Vollständigkeit (Dauer/Tempo gegen Banktext), Stille, Pegel/Clipping. Kein menschliches Anhören, kein Aussprache-/Natürlichkeitsurteil; der gelesene Text ist der jeweilige Banktext (content/*.json).",
        "dateien": dateien,
    }
    out = os.path.join(ROOT, "docs", f"audio-qc-all-{DATUM}.json")
    json.dump(bericht, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps({"gruppen": gruppen, "anomalienGesamt": len(anomalien),
                      "luecken": abdeckung_fehlt,
                      "anomalien": [a["datei"] + ":" + ",".join(a["fehler"]) for a in anomalien]},
                     ensure_ascii=False, indent=1))
    print("→", out)
    return 1 if (anomalien or abdeckung_fehlt) else 0


if __name__ == "__main__":
    sys.exit(main())
