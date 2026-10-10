#!/usr/bin/env python3
"""R114 — review patch for first six B1 dialogues d-b1-01..d-b1-06.

Scope: 67 units (6 metadata + 31 lines + 12 questions + 18 dictations).
Zero orphan cards (no 'waisen' field on these dialogues); waisen check skipped.

Confirmed correction:
- d-b1-01.lines[3].ar: German «Wenn die Firma gute Regeln hätte, würde ich zustimmen»
  uses Konjunktiv II of 'zustimmen' (to agree/consent), not 'erfolgreich sein/succeed'.
  Old ar «لو كانت لدى الشركة قواعد جيدة لوفّقت» = "I would have succeeded/consummated",
  which is the wrong root (وفّق = to reconcile/succeed/marry off).
  New ar «لو كانت لدى الشركة قواعد جيدة لوافقتُ» = "I would agree/consent", matching
  'würde ich zustimmen'. The hamza on ـُو and tanween-free spelling matches
  the existing formal/educational style in other dialogues.

All DE, questions, answers, dictations are locked unchanged. Style/context notes
go into report (see report_b1_dialogues_01.py) — notably d-b1-06 Meldebescheinigung
vs real Wohnungsgeberbestätigung requirement is a pedagogical simplification and
is NOT patched here.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-01": {
        3: {
            "ar": "لو كانت لدى الشركة قواعد جيدة لوافقتُ",
        },
    },
}

# Locks: for each dialogue, expected structure (line count, question count, dictation count)
# and exact DE/who for every line plus exact answer for every question, exact dictation strings.
EXPECTED: dict[str, dict] = {
    "d-b1-01": {
        "level": "B1", "titleDe": "Diskussion: Homeoffice", "titleAr": "نقاش: العمل من المنزل",
        "lines": [
            ("Mara", "Meiner Meinung nach ist Homeoffice die Zukunft der Arbeit."),
            ("Tim",  "Da bin ich nicht ganz einverstanden. Zwar spart man Zeit, aber man verliert den Kontakt."),
            ("Mara", "Trotzdem glaube ich, dass die Flexibilität überwiegt."),
            ("Tim",  "Wenn die Firma gute Regeln hätte, würde ich zustimmen."),
            ("Mara", "Also: eine Mischung wäre die beste Lösung."),
        ],
        "questions": [
            ("mc",   "Man verliert den Kontakt."),
            ("fill", ["hätte", "haette"]),
        ],
        "dictation": [
            "Meiner Meinung nach ist Homeoffice die Zukunft der Arbeit.",
            "Trotzdem glaube ich, dass die Flexibilität überwiegt.",
            "Eine Mischung wäre die beste Lösung.",
        ],
    },
    "d-b1-02": {
        "level": "B1", "titleDe": "Bewerbungsgespräch", "titleAr": "مقابلة توظيف",
        "lines": [
            ("Chefin",       "Erzählen Sie kurz etwas über sich."),
            ("Bewerber",     "Gern. Ich habe drei Jahre als Techniker gearbeitet und spreche Deutsch auf B1-Niveau."),
            ("Chefin",       "Warum möchten Sie wechseln?"),
            ("Bewerber",     "Ich möchte neue Erfahrungen sammeln und mehr Verantwortung übernehmen."),
            ("Chefin",       "Gut. Wir melden uns nächste Woche bei Ihnen."),
        ],
        "questions": [
            ("fill", ["Verantwortung"]),
            ("mc",   "Die Firma meldet sich."),
        ],
        "dictation": [
            "Ich habe drei Jahre als Techniker gearbeitet.",
            "Ich möchte neue Erfahrungen sammeln.",
            "Wir melden uns nächste Woche bei Ihnen.",
        ],
    },
    "d-b1-03": {
        "level": "B1", "titleDe": "Nachrichten am Morgen", "titleAr": "أخبار الصباح",
        "lines": [
            ("Lea",   "Hast du die Nachrichten gehört? Der Streik geht weiter."),
            ("Yusuf", "Ja, die Züge fahren heute wieder nicht."),
            ("Lea",   "Ich habe gelesen, die Verhandlungen hätten gestern begonnen."),
            ("Yusuf", "Hoffentlich finden sie bald eine Lösung."),
            ("Lea",   "Sonst muss ich jeden Tag mit dem Rad fahren."),
        ],
        "questions": [
            ("mc",   "Es gibt einen Streik."),
            ("fill", ["Lösung"]),
        ],
        "dictation": [
            "Der Streik geht weiter.",
            "Die Verhandlungen hätten gestern begonnen.",
            "Hoffentlich finden sie bald eine Lösung.",
        ],
    },
    "d-b1-04": {
        "level": "B1", "titleDe": "Beim Umzug helfen", "titleAr": "مساعدة الانتقال",
        "lines": [
            ("Paul", "Danke, dass du mir beim Umzug hilfst!"),
            ("Rana", "Gern! Was sollen wir zuerst tragen?"),
            ("Paul", "Die Bücher sind am schwersten. Die Kartons stehen schon im Flur."),
            ("Rana", "Alles klar. Achtung, die Tür ist eng!"),
            ("Paul", "Danke dir. Nachher essen wir Pizza — mein Angebot!"),
        ],
        "questions": [
            ("mc",   "die Bücher"),
            ("fill", ["Pizza"]),
        ],
        "dictation": [
            "Danke, dass du mir beim Umzug hilfst!",
            "Die Bücher sind am schwersten.",
            "Mein Angebot!",
        ],
    },
    "d-b1-05": {
        "level": "B1", "titleDe": "Pläne für die Zukunft", "titleAr": "خطط للمستقبل",
        "lines": [
            ("Ali",   "Was hast du vor, nach der Prüfung zu machen?"),
            ("Mira",  "Ich würde gern ein Praktikum in einer Klinik machen."),
            ("Ali",   "Das ist eine gute Idee! Wo willst du dich bewerben?"),
            ("Mira",  "Vielleicht in Köln. Dort hätte ich bessere Chancen."),
            ("Ali",   "Ich drücke dir die Daumen!"),
        ],
        "questions": [
            ("mc",   "ein Praktikum in einer Klinik machen"),
            ("fill", ["Daumen"]),
        ],
        "dictation": [
            "Ich würde gern ein Praktikum in einer Klinik machen.",
            "Dort hätte ich bessere Chancen.",
            "Ich drücke dir die Daumen!",
        ],
    },
    "d-b1-06": {
        "level": "B1", "titleDe": "Termin beim Amt", "titleAr": "موعد في الدائرة الرسمية",
        "lines": [
            ("Bürgerin",       "Guten Tag. Ich möchte einen Termin zur Anmeldung vereinbaren."),
            ("Sachbearbeiter", "Gern. Haben Sie alle Unterlagen schon mitgebracht?"),
            ("Bürgerin",       "Ich habe Pass und Mietvertrag dabei. Fehlt noch etwas?"),
            ("Sachbearbeiter", "Eine Meldebescheinigung wäre noch nötig."),
            ("Bürgerin",       "Alles klar. Könnte der Termin am Donnerstag sein?"),
            ("Sachbearbeiter", "Ja, um 11:30 Uhr. Bitte kommen Sie pünktlich."),
        ],
        "questions": [
            ("fill", ["Meldebescheinigung"]),
            ("mc",   "Donnerstag um 11:30 Uhr"),
        ],
        "dictation": [
            "Ich möchte einen Termin vereinbaren.",
            "Eine Meldebescheinigung wäre noch nötig.",
            "Bitte kommen Sie pünktlich.",
        ],
    },
}


def apply_patch() -> dict:
    data = json.loads(D_PATH.read_text(encoding="utf-8"))
    changes = []
    locked = {"linesDE": 0, "questions": 0, "dictations": 0}

    by_id = {d["id"]: d for d in data}
    for did, exp in EXPECTED.items():
        dlg = by_id[did]
        assert dlg["level"] == exp["level"], f"{did} level mismatch"
        assert dlg["titleDe"] == exp["titleDe"], f"{did} titleDe mismatch"
        assert dlg["titleAr"] == exp["titleAr"], f"{did} titleAr mismatch"
        assert "waisen" not in dlg or dlg["waisen"] in (None, [], {}), f"{did} unexpected waisen field"

        assert len(dlg["lines"]) == len(exp["lines"]), f"{did} line count mismatch"
        assert len(dlg["questions"]) == len(exp["questions"]), f"{did} question count mismatch"
        assert len(dlg.get("dictation") or []) == len(exp["dictation"]), f"{did} dictation count mismatch"

        for i, (who, de) in enumerate(exp["lines"]):
            ln = dlg["lines"][i]
            assert ln["who"] == who, f"{did}.lines[{i}] who mismatch: {ln['who']!r} vs {who!r}"
            assert ln["de"] == de, f"{did}.lines[{i}] de mismatch: {ln['de']!r} vs {de!r}"
            locked["linesDE"] += 1
        for i, (qtype, ans) in enumerate(exp["questions"]):
            q = dlg["questions"][i]
            assert q["type"] == qtype, f"{did}.q{i} type mismatch"
            assert q["answer"] == ans, f"{did}.q{i} answer mismatch"
            locked["questions"] += 1
        for i, s in enumerate(exp["dictation"]):
            assert dlg["dictation"][i] == s, f"{did}.dict[{i}] mismatch"
            locked["dictations"] += 1

        # apply Arabic corrections only
        if did in CORRECTIONS:
            for idx, patch in CORRECTIONS[did].items():
                ln = dlg["lines"][idx]
                if ln["ar"] != patch["ar"]:
                    changes.append({"unit": f"{did}.lines[{idx}].ar", "old": ln["ar"], "new": patch["ar"]})
                    ln["ar"] = patch["ar"]

    D_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"changes": changes, "locked": locked}


def main() -> None:
    result = apply_patch()
    print("<R114> patch complete")
    print(f"  changes applied: {len(result['changes'])}")
    for c in result["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {result['locked']['linesDE']}")
    print(f"  locked questions: {result['locked']['questions']}")
    print(f"  locked dictations: {result['locked']['dictations']}")


if __name__ == "__main__":
    main()
