#!/usr/bin/env python3
"""R112 patch: review d-a2-25, d-a2-26, d-a2-27.

Confirmed Arabic fixes (all Arabic-only; German/keys/explanations untouched):
1. d-a2-26.lines[2].ar: «هذا في عرض خاص» → «هذه في عرض خاص» (diese referring to
   feminine die Hose = البنطال).
2. d-a2-26.lines[3].ar: «هل لديكم منه بالأزرق الداكن؟» →
   «هل لديكم منها بالأزرق الداكن؟» (anaphoric pronoun for feminine die Hose).
3. d-a2-26.lines[4].ar: «جرّبيه» → «جرّبيها» (feminine object for Hose).
4. d-a2-26.lines[5].ar: «مريح. سآخذه … إن لم يناسب» → «مريحة. سآخذها … إن لم تناسب»
   (feminine agreement with die Hose).
5. d-a2-25.lines[7].ar: «شكراً لأنك مهذب» → «شكراً لأنكِ مهذبة» (second-person
   feminine for Rania speaking to a male Kontrolleur; Ar agreement corrected).

Context notes (NOT text edits):
- d-a2-25's 7-Euro Nachzeigen simplification (showing a newly purchased card
  after the fact) applies strictly to personalized, non-transferable season
  tickets forgotten at home; this is recorded as a pedagogical note.
- d-a2-26's 14-day return policy in the shop is shop goodwill (Kulanz), not a
  legal right; recorded as context.
"""
from __future__ import annotations

import json, re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content/dialogues.json"
TARGET_IDS = ("d-a2-25", "d-a2-26", "d-a2-27")

CORRECTIONS: list[dict[str, Any]] = [
    {"dialogue_id": "d-a2-26", "line_index": 2, "field": "ar",
     "before": "هذا في عرض خاص: 29 بدل 49 يورو. رخيص جداً.",
     "after":  "هذه في عرض خاص: 29 بدل 49 يورو. رخيص جداً."},
    {"dialogue_id": "d-a2-26", "line_index": 3, "field": "ar",
     "before": "اللون قديم الطراز قليلاً. هل لديكم منه بالأزرق الداكن؟",
     "after":  "اللون قديم الطراز قليلاً. هل لديكم منها بالأزرق الداكن؟"},
    {"dialogue_id": "d-a2-26", "line_index": 4, "field": "ar",
     "before": "نعم، مقاس 38. غرفة القياس في الخلف يساراً. جرّبيه.",
     "after":  "نعم، مقاس 38. غرفة القياس في الخلف يساراً. جرّبيها."},
    {"dialogue_id": "d-a2-26", "line_index": 5, "field": "ar",
     "before": "مريح. سآخذه. وكيف الإرجاع إن لم يناسب في النهاية؟",
     "after":  "مريحة. سآخذها. وكيف الإرجاع إن لم تناسب في النهاية؟"},
]

EXPECTED: dict[str, dict[str, Any]] = {
    "d-a2-25": {
        "titleDe": "Im Zug ohne Ticket",
        "titleAr": "في القطار بلا تذكرة",
        "lines_de": [
            "Fahrkartenkontrolle, bitte. Ihr Ticket?",
            "Hier ist meine Monatskarte.",
            "Die ist seit gestern nicht mehr gültig. Der Monat ist zu Ende.",
            "Oh nein! Das habe ich vergessen. Ich wollte nicht schwarzfahren.",
            "Das glaube ich Ihnen. Aber die Regel ist die Regel: 60 Euro.",
            "Kann ich die neue Monatskarte nachher zeigen? Dann zahle ich weniger, oder?",
            "Ja, innerhalb von einer Woche im Kundenzentrum. Dann sind es nur sieben Euro.",
            "Danke, dass Sie so höflich sind. Noch eine Auskunft bitte: Wegen der Umleitung heute, erreiche ich meine Verbindung am Hauptbahnhof?",
        ],
        "who": ["Kontrolleur","Rania","Kontrolleur","Rania","Kontrolleur","Rania","Kontrolleur","Rania"],
        "questions": [
            {"id":"d-a2-25-q1","type":"mc","answer":"Der Monat ist zu Ende."},
            {"id":"d-a2-25-q2","type":"mc","answer":"sieben Euro"},
            {"id":"d-a2-25-q3","type":"fill","answer":["schwarzfahren"]},
        ],
        "dictation": [
            "Die ist seit gestern nicht mehr gültig.",
            "Aber die Regel ist die Regel: 60 Euro.",
        ],
    },
    "d-a2-26": {
        "titleDe": "Klamotten kaufen",
        "titleAr": "شراء ملابس",
        "lines_de": [
            "Kann ich Ihnen helfen?",
            "Ja, ich suche eine Hose für die Arbeit. Nicht zu teuer.",
            "Diese hier ist im Sonderangebot: 29 statt 49 Euro. Sehr preiswert.",
            "Die Farbe ist ein bisschen altmodisch. Haben Sie sie auch in Dunkelblau?",
            "Ja, Größe 38. Die Umkleidekabine ist hinten links. Probieren Sie sie an.",
            "Sie sitzt bequem. Ich nehme sie. Und wie ist die Rückgabe, falls sie doch nicht passt?",
            "Vierzehn Tage, aber nur mit Quittung. Heben Sie die Quittung also gut auf.",
            "Mache ich. Den Schmuck dort schaue ich mir auch noch an.",
        ],
        "who": ["Verkäuferin","Mira","Verkäuferin","Mira","Verkäuferin","Mira","Verkäuferin","Mira"],
        "questions": [
            {"id":"d-a2-26-q1","type":"mc","answer":"29 Euro"},
            {"id":"d-a2-26-q2","type":"mc","answer":"die Quittung"},
            {"id":"d-a2-26-q3","type":"truefalse","answer":"richtig"},
        ],
        "dictation": [
            "Die Umkleidekabine ist hinten links.",
            "Heben Sie die Quittung also gut auf.",
        ],
    },
    "d-a2-27": {
        "titleDe": "Erinnerungen an die Kindheit",
        "titleAr": "ذكريات الطفولة",
        "lines_de": [
            "Oma, erzähl mir von deiner Kindheit in Sousse.",
            "Damals gab es kein Internet und nur ein Telefon im ganzen Haus. Wir haben draußen gespielt, bis es dunkel war.",
            "Was war das schönste Erlebnis?",
            "Der Höhepunkt war jeden Sommer die Reise ans Meer mit der ganzen Familie.",
            "Und hat sich die Stadt inzwischen sehr verändert?",
            "Sehr. Neulich war ich dort: neue Straßen, hohe Gebäude. Nur das Meer ist gleich geblieben.",
            "Vermisst du die Vergangenheit?",
            "Manchmal. Aber man gewöhnt sich an alles, auch an Handys.",
        ],
        "who": ["Enkelin","Oma","Enkelin","Oma","Enkelin","Oma","Enkelin","Oma"],
        "questions": [
            {"id":"d-a2-27-q1","type":"mc","answer":"die Reise ans Meer mit der Familie"},
            {"id":"d-a2-27-q2","type":"mc","answer":"das Meer"},
            {"id":"d-a2-27-q3","type":"fill","answer":["an"]},
        ],
        "dictation": [
            "Damals gab es kein Internet und nur ein Telefon im ganzen Haus.",
            "Nur das Meer ist gleich geblieben.",
        ],
    },
}


def leaf_changes(before: Any, after: Any, path: str = "") -> set[str]:
    out: set[str] = set()
    if type(before) != type(after):
        out.add(path); return out
    if isinstance(before, dict):
        bkeys, akeys = set(before), set(after)
        for k in bkeys - akeys: out.add(f"{path}.{k}" if path else k)
        for k in akeys - bkeys: out.add(f"{path}.{k}" if path else k)
        for k in bkeys & akeys:
            sub = f"{path}.{k}" if path else k
            out |= leaf_changes(before[k], after[k], sub)
    elif isinstance(before, list):
        if len(before) != len(after): out.add(path)
        else:
            for i, (b, a) in enumerate(zip(before, after)):
                out |= leaf_changes(b, a, f"{path}[{i}]")
    else:
        if before != after: out.add(path)
    return out


def guarded_update(container: dict, field: str, before: str, after: str, loc: str) -> None:
    current = container.get(field)
    if current == after: return
    if current != before:
        raise SystemExit(f"Guard mismatch at {loc}: expected {before!r}, found {current!r}")
    container[field] = after


def main() -> None:
    dialogue_raw = DIALOGUES_PATH.read_text(encoding="utf-8")
    dialogues = json.loads(dialogue_raw)
    before_dialogues = json.loads(dialogue_raw)
    by_id = {d["id"]: d for d in dialogues if isinstance(d, dict) and "id" in d}

    for tid, exp in EXPECTED.items():
        d = by_id.get(tid)
        if d is None: raise SystemExit(f"Missing dialogue {tid}")
        if d.get("titleDe") != exp["titleDe"] or d.get("titleAr") != exp["titleAr"]:
            raise SystemExit(f"Unexpected title for {tid}")
        if len(d.get("lines", [])) != len(exp["lines_de"]):
            raise SystemExit(f"Unexpected line count for {tid}")
        for i, exp_de in enumerate(exp["lines_de"]):
            line = d["lines"][i]
            if line.get("who") != exp["who"][i] or line.get("de") != exp_de:
                raise SystemExit(f"{tid}.lines[{i}] who/de drifted")
        if len(d.get("questions", [])) != len(exp["questions"]):
            raise SystemExit(f"Unexpected question count for {tid}")
        for qi, exp_q in enumerate(exp["questions"]):
            q = d["questions"][qi]
            if q.get("id") != exp_q["id"] or q.get("type") != exp_q["type"] or q.get("answer") != exp_q["answer"]:
                raise SystemExit(f"{tid} question[{qi}] id/type/answer mismatch")
        if d.get("dictation", []) != exp["dictation"]:
            raise SystemExit(f"{tid} dictation drifted")

    for c in CORRECTIONS:
        target_d = by_id[c["dialogue_id"]]
        guarded_update(target_d["lines"][c["line_index"]], c["field"], c["before"], c["after"],
                       f"{c['dialogue_id']}.lines[{c['line_index']}].{c['field']}")

    changed_leaves = leaf_changes(before_dialogues, dialogues)
    changed_paths = {re.sub(r"\[\d+\]$", "", p) for p in changed_leaves}
    expected_paths = set()
    for c in CORRECTIONS:
        idx = next(i for i, item in enumerate(dialogues) if item.get("id") == c["dialogue_id"])
        expected_paths.add(f"[{idx}].lines[{c['line_index']}].ar")
    if changed_paths and changed_paths != expected_paths:
        raise SystemExit(f"Unexpected diff: changed={sorted(changed_paths)} expected={sorted(expected_paths)}")

    out = json.dumps(dialogues, ensure_ascii=False, indent=2) + "\n"
    if dialogue_raw != out:
        DIALOGUES_PATH.write_text(out, encoding="utf-8")
        print("R112 patch applied; changed fields:")
        for c in CORRECTIONS:
            idx = next(i for i, item in enumerate(dialogues) if item.get("id") == c["dialogue_id"])
            print(f"  [{idx}].lines[{c['line_index']}].ar")
    else:
        print("R112 patch complete; dialogue fields changed=0, files written=none (already applied)")


if __name__ == "__main__":
    main()
