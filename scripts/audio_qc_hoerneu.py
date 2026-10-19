# -*- coding: utf-8 -*-
# R179 (C5): Maschinelle akustische QC der 10 neuen Hoer-MP3s (KI-Stimmen) — dieselben
# Schwellen und dieselbe Ehrlichkeitsgrenze wie scripts/audio_qc_r169.py:
# geprueft werden Dekodierbarkeit, Vollstaendigkeit (Dauer/Zeichen-Tempo), Stille,
# Pegel/Clipping. KEIN menschliches Anhoeren, kein Aussprache-Urteil.
# Braucht: miniaudio (Werkzeug-venv /tmp/qcenv).
import json, math, os, statistics, sys
import miniaudio

ROOT = os.path.join(os.path.dirname(__file__), "..")
bank = json.load(open(os.path.join(ROOT, "content/hoerneu.json"), encoding="utf-8"))

SCHWELLEN = {
    "minDauerS": 3.0,
    "maxStilleAnteil": 0.65,
    "maxStilleLochS": 4.0,
    "maxAnklangS": 2.5,
    "maxAbklangS": 3.0,
    "minPeak": 0.10,
    "maxClipAnteil": 0.005,
    "minRmsDb": -45.0,
    "zeichenProSekunde": [5.0, 22.0],
}

CLIP_DATEIEN = {
    ("hn-01", 0): "ki-hn-01.mp3", ("hn-02", 0): "ki-hn-02.mp3", ("hn-03", 0): "ki-hn-03.mp3",
    ("hn-04", 0): "ki-hn-04.mp3", ("hn-05", 0): "ki-hn-05.mp3", ("hn-06", 0): "ki-hn-06.mp3",
    ("hn-07", 0): "ki-hn-07a.mp3", ("hn-07", 1): "ki-hn-07b.mp3",
    ("hn-08", 0): "ki-hn-08a.mp3", ("hn-08", 1): "ki-hn-08b.mp3",
}
STIMMEN = {"A": "voice-04 (de-DE, Arena TTS, KI)", "B": "voice-05 (de-DE, Arena TTS, KI)"}

def analysiere(pfad):
    d = miniaudio.decode_file(pfad)
    s = [int(x) for x in d.samples]
    sr, ch = d.sample_rate, max(d.nchannels, 1)
    n = len(s)
    frames = n // ch
    dauer = frames / sr
    peak = max((abs(x) for x in s), default=0) / 32768.0
    rms = math.sqrt(sum(x * x for x in s) / n) / 32768.0 if n else 0.0
    rms_db = 20 * math.log10(rms) if rms > 0 else -99.0
    still = sum(1 for x in s if abs(x) < 104) / n if n else 1.0
    laengste, lauf = 0, 0
    for x in s:
        if abs(x) < 104:
            lauf += 1
            laengste = max(laengste, lauf)
        else:
            lauf = 0
    laengste_s = (laengste / ch) / sr if n else 0.0
    clip = sum(1 for x in s if abs(x) >= 32700) / n if n else 0.0
    w = max(1, int(sr * 0.01)) * ch
    def laut(i):
        return any(abs(x) >= 104 for x in s[i:i + w])
    erste, letzte = 0, n
    while erste < n and not laut(erste):
        erste += w
    while letzte > 0 and not laut(letzte - w):
        letzte -= w
    anklang = (erste / ch) / sr
    abklang = ((n - letzte) / ch) / sr
    return dauer, peak, rms_db, still, clip, anklang, abklang, laengste_s

dateien, anomalien = [], []
for item in bank["items"]:
    for ci, clip in enumerate(item["clips"]):
        datei = CLIP_DATEIEN[(item["id"], ci)]
        pfad = os.path.join(ROOT, "public", "audio", "hoerneu", datei)
        text = " ".join(item["zeilen"][z]["de"] for z in clip["zeilen"])
        zeichen = len(text)
        dauer, peak, rms_db, still, clipA, anklang, abklang, laengste_s = analysiere(pfad)
        cps = zeichen / dauer if dauer else 0.0
        fehler = []
        if dauer < SCHWELLEN["minDauerS"]: fehler.append("dauer")
        if still > SCHWELLEN["maxStilleAnteil"] or laengste_s > SCHWELLEN["maxStilleLochS"]: fehler.append("stille")
        if anklang > SCHWELLEN["maxAnklangS"]: fehler.append("anklang")
        if abklang > SCHWELLEN["maxAbklangS"]: fehler.append("abklang")
        if peak < SCHWELLEN["minPeak"]: fehler.append("peak")
        if clipA > SCHWELLEN["maxClipAnteil"]: fehler.append("clipping")
        if rms_db < SCHWELLEN["minRmsDb"]: fehler.append("rms")
        if not (SCHWELLEN["zeichenProSekunde"][0] <= cps <= SCHWELLEN["zeichenProSekunde"][1]): fehler.append("tempo")
        eintrag = {"id": datei[:-4], "item": item["id"], "voice": STIMMEN[clip["stimme"]], "art": "ki",
                   "dauerS": round(dauer, 2), "zeichen": zeichen, "zeichenProSekunde": round(cps, 2),
                   "peak": round(peak, 3), "rmsDb": round(rms_db, 1), "stilleAnteil": round(still, 3),
                   "laengsteStilleS": round(laengste_s, 2), "clipAnteil": round(clipA, 5),
                   "anklangS": round(anklang, 2), "abklangS": round(abklang, 2),
                   "ok": not fehler, "fehler": fehler}
        dateien.append(eintrag)
        if fehler: anomalien.append(eintrag)

bericht = {
    "werkzeug": "scripts/audio_qc_hoerneu.py (miniaudio-Dekodierung, 16-bit PCM; Schwellen wie R169)",
    "datum": "2026-10-16",
    "gegenstand": "Alle 10 KI-Hoerclips aus content/hoerneu.json (public/audio/hoerneu/) — R179/C5",
    "schwellen": SCHWELLEN,
    "gruppen": {"ki": {"anzahl": len(dateien), "anomalien": sum(1 for f in dateien if not f["ok"]),
                       "dauerMedianS": round(statistics.median(f["dauerS"] for f in dateien), 2),
                       "zeichenProSekundeMedian": round(statistics.median(f["zeichenProSekunde"] for f in dateien), 2),
                       "stilleMedian": round(statistics.median(f["stilleAnteil"] for f in dateien), 3)}},
    "anomalienGesamt": len(anomalien),
    "grenzEhrlichkeit": "Maschinelle QC: Vollständigkeit/Hörbarkeit/Tempo. Kein menschliches Anhören, kein Aussprache-/Natürlichkeitsurteil; der gelesene Text ist zeichengleich der Banktext (content/hoerneu.json).",
    "dateien": dateien,
}
out = os.path.join(ROOT, "docs/audio-qc-hoerneu-2026-10-16.json")
json.dump(bericht, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps({"gruppe": bericht["gruppen"]["ki"], "anomalienGesamt": len(anomalien),
                  "anomalien": [a["id"] + ":" + ",".join(a["fehler"]) for a in anomalien]}, ensure_ascii=False, indent=1))
print("→", out)

# Finalisiere die Bank: datei/stimmeLabel/bytes pro Clip eintragen
for item in bank["items"]:
    for ci, clip in enumerate(item["clips"]):
        datei = CLIP_DATEIEN[(item["id"], ci)]
        clip["datei"] = "/audio/hoerneu/" + datei
        clip["stimmeLabel"] = STIMMEN[clip["stimme"]] + " · صوت مولّد بالذكاء الاصطناعي"
        clip["bytes"] = os.path.getsize(os.path.join(ROOT, "public", "audio", "hoerneu", datei))
json.dump(bank, open(os.path.join(ROOT, "content/hoerneu.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("Bank finalisiert")
