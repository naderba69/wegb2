# R169: Maschinelle akustische QC aller 164 Dialog-MP3s (Ersatz-Prüfung, wo menschliches
# Anhören nicht stattgefunden hat). Prüft: Dekodierbarkeit, Dauer, Stille-Anteil, An-/Abklang,
# Pegel/Clipping und Sprechtempo (Zeichen des Banktexts / Sekunde) — getrennt nach ki-* / Haus.
# KEIN Aussprache-Urteil: Der synthetisierte Text ist der Banktext selbst (content/dialogues.json);
# geprüft wird, ob die Datei ihn vollständig und hörbar trägt. Braucht: pip install miniaudio (nur Werkzeug).
import json, math, os, statistics, sys
import miniaudio

ROOT = os.path.join(os.path.dirname(__file__), "..")
dlg = {d["id"]: d for d in json.load(open(os.path.join(ROOT, "content/dialogues.json"), encoding="utf-8"))}
man = json.load(open(os.path.join(ROOT, "content/dialog-audio.json"), encoding="utf-8"))

SCHWELLEN = {
    "minDauerS": 3.0,          # kein Dialog der Bank ist kürzer lesbar
    "maxStilleAnteil": 0.65,   # Anteil Samples unter -50 dBFS (darüber: Datei überwiegend tot)
    "maxStilleLochS": 4.0,     # längste zusammenhängende Stille im Stück (darüber: Loch, keine Sprechpause)
    "maxAnklangS": 2.5,        # führende Stille
    "maxAbklangS": 3.0,        # endende Stille
    "minPeak": 0.10,           # sonst praktisch unhörbar
    "maxClipAnteil": 0.005,    # Samples am Anschlag
    "minRmsDb": -45.0,
    "zeichenProSekunde": [5.0, 22.0],  # plausibles TTS-/Vorleseband (Deutsch, inkl. Sprechpausen)
}

def segmente(pfad):
    """Haus-Dateien sind pro Zeile erzeugte MP3-Segmente mit je eigenem ID3v2-Tag, aneinandergehängt.
    Standard-Dekoder stoppen am ersten Tag — hier wird segmentweise dekodiert und PCM konkateniert."""
    raw = open(pfad, "rb").read()
    starts = []
    i = 0
    while True:
        i = raw.find(b"ID3", i)
        if i < 0: break
        if i + 10 <= len(raw) and raw[i + 3] in (2, 3, 4) and all(b < 0x80 for b in raw[i + 6:i + 10]):
            starts.append(i)
        i += 1
    if not starts:
        return [pfad]
    import tempfile
    wege = []
    for k, st in enumerate(starts):
        ende = starts[k + 1] if k + 1 < len(starts) else len(raw)
        fd, tmp = tempfile.mkstemp(suffix=".mp3")
        with os.fdopen(fd, "wb") as f: f.write(raw[st:ende])
        wege.append(tmp)
    return wege

def analysiere(pfad):
    teile = segmente(pfad)
    samples, sr, ch = [], 0, 1
    for t in teile:
        d = miniaudio.decode_file(t)
        sr, ch = d.sample_rate, max(d.nchannels, 1)
        samples.extend(int(x) for x in d.samples)
        if t != pfad: os.unlink(t)
    class D: pass
    d = D(); d.samples = samples; d.sample_rate = sr; d.nchannels = ch
    s = d.samples  # signed 16-bit PCM (mono/stereo interleaved)
    n = len(s)
    frames = n // max(d.nchannels, 1)
    dauer = frames / sr
    peak = max((abs(x) for x in s), default=0) / 32768.0
    rms = math.sqrt(sum(int(x) * int(x) for x in s) / n) / 32768.0 if n else 0.0
    rms_db = 20 * math.log10(rms) if rms > 0 else -99.0
    still = sum(1 for x in s if abs(x) < 104) / n if n else 1.0  # < ca. -50 dBFS
    # Längste zusammenhängende Stille: Sprechpausen zwischen Zeilen (langsames A0/A1-Tempo)
    # sind didaktisch normal; ein Defekt ist totes Loch im Stück, nicht verteilte Pause.
    laengste, lauf = 0, 0
    for x in s:
        if abs(x) < 104: lauf += 1; laengste = max(laengste, lauf)
        else: lauf = 0
    laengste_s = (laengste / max(d.nchannels, 1)) / sr if n else 0.0
    clip = sum(1 for x in s if abs(x) >= 32700) / n if n else 0.0
    # An-/Abklang frameweise (10-ms-Fenster, -50 dBFS)
    w = max(1, int(sr * 0.01)) * max(d.nchannels, 1)
    def laut(i): return any(abs(x) >= 104 for x in s[i:i + w])
    erste, letzte = 0, n
    while erste < n and not laut(erste): erste += w
    while letzte > 0 and not laut(letzte - w): letzte -= w
    anklang = (erste / max(d.nchannels, 1)) / sr
    abklang = ((n - letzte) / max(d.nchannels, 1)) / sr
    return dauer, peak, rms_db, still, clip, anklang, abklang, laengste_s

dateien, anomalien = [], []
for e in man["einsaetze"]:
    did = e["id"]
    pfad = os.path.join(ROOT, "public", "audio", "dialog", did + ".mp3")
    text = " ".join(l["de"] for l in dlg[did]["lines"])
    zeichen = len(text)
    dauer, peak, rms_db, still, clip, anklang, abklang, laengste_s = analysiere(pfad)
    cps = zeichen / dauer if dauer else 0.0
    fehler = []
    if dauer < SCHWELLEN["minDauerS"]: fehler.append("dauer")
    if still > SCHWELLEN["maxStilleAnteil"] or laengste_s > SCHWELLEN["maxStilleLochS"]: fehler.append("stille")
    if anklang > SCHWELLEN["maxAnklangS"]: fehler.append("anklang")
    if abklang > SCHWELLEN["maxAbklangS"]: fehler.append("abklang")
    if peak < SCHWELLEN["minPeak"]: fehler.append("peak")
    if clip > SCHWELLEN["maxClipAnteil"]: fehler.append("clipping")
    if rms_db < SCHWELLEN["minRmsDb"]: fehler.append("rms")
    if not (SCHWELLEN["zeichenProSekunde"][0] <= cps <= SCHWELLEN["zeichenProSekunde"][1]): fehler.append("tempo")
    art = "ki" if e["voice"].startswith("ki-") else "haus"
    eintrag = {"id": did, "voice": e["voice"], "art": art, "dauerS": round(dauer, 2), "zeichen": zeichen,
               "zeichenProSekunde": round(cps, 2), "peak": round(peak, 3), "rmsDb": round(rms_db, 1),
               "stilleAnteil": round(still, 3), "laengsteStilleS": round(laengste_s, 2), "clipAnteil": round(clip, 5),
               "anklangS": round(anklang, 2), "abklangS": round(abklang, 2), "ok": not fehler, "fehler": fehler}
    dateien.append(eintrag)
    if fehler: anomalien.append(eintrag)

def gruppe(art):
    g = [f for f in dateien if f["art"] == art]
    return {"anzahl": len(g), "anomalien": sum(1 for f in g if not f["ok"]),
            "dauerMedianS": round(statistics.median(f["dauerS"] for f in g), 2),
            "zeichenProSekundeMedian": round(statistics.median(f["zeichenProSekunde"] for f in g), 2),
            "stilleMedian": round(statistics.median(f["stilleAnteil"] for f in g), 3)}

bericht = {
    "werkzeug": "scripts/audio_qc_r169.py (miniaudio-Dekodierung, 16-bit PCM)",
    "datum": "2026-10-16",
    "gegenstand": "Alle 164 Dialog-MP3s aus content/dialog-audio.json (82 Haus-Rollenspiel + 82 ki-* Einzelstimme)",
    "schwellen": SCHWELLEN,
    "gruppen": {"ki": gruppe("ki"), "haus": gruppe("haus")},
    "anomalienGesamt": len(anomalien),
    "grenzEhrlichkeit": "Maschinelle QC: Vollständigkeit/Hörbarkeit/Tempo. Kein menschliches Anhören, kein Aussprache-/Natürlichkeitsurteil; der gelesene Text ist zeichengleich der Banktext (content/dialogues.json).",
    "dateien": dateien,
}
out = os.path.join(ROOT, "docs/audio-qc-2026-10-16.json")
json.dump(bericht, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps({"gruppen": bericht["gruppen"], "anomalienGesamt": len(anomalien),
                  "anomalien": [a["id"] + ":" + ",".join(a["fehler"]) for a in anomalien]}, ensure_ascii=False, indent=1))
print("→", out)
