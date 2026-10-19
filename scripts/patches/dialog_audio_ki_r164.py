# R164: KI-generierte Dialog-Audios (ehrlich als "ki-*" etikettiert, NICHT Hausstimmen).
# plan  -> gibt die naechste Batch (id, Tool-Stimme) aus; die MP3s erzeugt der Agent per generate_speech.
# sync  -> traegt alle auf Platte vorhandenen geplanten Dateien mit echten Bytes ins Manifest ein (idempotent).
import json, os, sys
ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
dlg = json.load(open(os.path.join(ROOT, "content/dialogues.json"), encoding="utf-8"))
man_p = os.path.join(ROOT, "content/dialog-audio.json")
man = json.load(open(man_p, encoding="utf-8"))
have = {e["id"] for e in man["einsaetze"]}
ohne = [d for d in dlg if d["id"] not in have]
FEMW = {"Frau","Mutter","Oma","Tante","Schwester","Tochter","Lehrerin","Ärztin","Chefin","Freundin","Nachbarin",
"Verkäuferin","Sekretärin","Mieterin","Meteorologin","Sachbearbeiterin","Beraterin","Enkelin","Rezeptionistin",
"Mitarbeiterin","Kundin","Frau Mansour","Frau Becker","Frau Kaya","Lina","Fatma","Nadia","Salma","Lena","Mira","Rania","Amira"}
def fem(w): return w in FEMW or w.endswith("in")
# Plan: Stimme nach Geschlecht der ersten Sprecherin/des ersten Sprechers, je Geschlecht alternierend
plan, cf, cm = [], 0, 0
for d in ohne:
    spr = []
    for l in d["lines"]:
        if l["who"] not in spr: spr.append(l["who"])
    if fem(spr[0]):
        label, tool = ("ki-f1", "voice-00") if cf % 2 == 0 else ("ki-f2", "voice-02"); cf += 1
    else:
        label, tool = ("ki-m1", "voice-01") if cm % 2 == 0 else ("ki-m2", "voice-03"); cm += 1
    plan.append({"id": d["id"], "level": d["level"], "label": label, "tool": tool, "erste": spr[0]})
if sys.argv[1] == "plan":
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    done = {e["id"] for e in man["einsaetze"]}
    rest = [p for p in plan if p["id"] not in done]
    print(f"offen: {len(rest)} von {len(plan)}")
    for p in rest[:n]: print(p["id"], p["level"], p["label"], p["tool"], "| erste Stimme:", p["erste"])
elif sys.argv[1] == "sync":
    ids = {e["id"] for e in man["einsaetze"]}
    neu = 0
    for p in plan:
        fp = os.path.join(ROOT, "public", "audio", "dialog", p["id"] + ".mp3")
        if p["id"] not in ids and os.path.exists(fp):
            man["einsaetze"].append({"id": p["id"], "file": f"/audio/dialog/{p['id']}.mp3",
                "bytes": os.path.getsize(fp), "voice": p["label"], "level": p["level"], "stimmen": 1})
            neu += 1
    man["count"] = len(man["einsaetze"])
    json.dump(man, open(man_p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"sync: +{neu} Eintraege, Manifest jetzt {man['count']}")
