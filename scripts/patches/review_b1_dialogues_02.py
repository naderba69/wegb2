#!/usr/bin/env python3
"""R115 — review patch for second B1 batch d-b1-07..d-b1-09."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-07": {
        2: {
            "ar": "ينبغي أن تعملوا أقل أمام الشاشة وتأخذوا استراحات.",
        },
    },
    "d-b1-09": {
        4: {
            "ar": "وهل يمكنكم تغيير الغرفة ربما؟",
        },
    },
}

EXPECTED: dict[str, dict] = {
    "d-b1-07": {
        "level": "B1", "titleDe": "Ärztin erklärt den Befund", "titleAr": "الطبيبة تشرح التشخيص",
        "lines": [
            ("Ärztin",  "Die Untersuchung zeigt: Es ist nichts Schlimmes."),
            ("Patient", "Gott sei Dank! Was soll ich denn tun?"),
            ("Ärztin",  "Sie sollten weniger am Bildschirm arbeiten und Pausen machen."),
            ("Patient", "Und wenn die Schmerzen zurückkommen?"),
            ("Ärztin",  "Dann kommen Sie bitte sofort wieder."),
        ],
        "questions": [
            ("mc",   "nichts Schlimmes"),
            ("fill", ["Bildschirm"]),
        ],
        "dictation": [
            "Es ist nichts Schlimmes.",
            "Sie sollten Pausen machen.",
            "Dann kommen Sie bitte sofort wieder.",
        ],
    },
    "d-b1-08": {
        "level": "B1", "titleDe": "Das WG-Gespräch", "titleAr": "حديث الشقة المشتركة",
        "lines": [
            ("Paul", "Nina, können wir über die Küche reden?"),
            ("Nina", "Gern. Ich finde, es ist zu unordentlich."),
            ("Paul", "Du hast recht. Ich schlage einen Putzplan vor."),
            ("Nina", "Gute Idee! Jeder macht einmal pro Woche sauber."),
            ("Paul", "Und der Einkauf? Sollen wir zusammen kaufen?"),
            ("Nina", "Ja, das spart Geld. Ich schreibe eine Liste."),
        ],
        "questions": [
            ("mc", "einen Putzplan"),
            ("mc", "Das spart Geld."),
        ],
        "dictation": [
            "Ich schlage einen Putzplan vor.",
            "Jeder macht einmal pro Woche sauber.",
        ],
    },
    "d-b1-09": {
        "level": "B1", "titleDe": "Reklamation im Hotel", "titleAr": "شكوى في الفندق",
        "lines": [
            ("Anwar",     "Guten Abend. Ich habe ein Problem mit meinem Zimmer."),
            ("Rezeption", "Was ist denn los, mein Herr?"),
            ("Anwar",     "Die Heizung funktioniert nicht, und es ist sehr kalt."),
            ("Rezeption", "Das tut mir leid. Ich schicke sofort einen Techniker."),
            ("Anwar",     "Und könnten Sie vielleicht das Zimmer wechseln?"),
            ("Rezeption", "Natürlich. Zimmer 205 ist frei und warm."),
        ],
        "questions": [
            ("mc", "Die Heizung funktioniert nicht."),
            ("mc", "ein anderes Zimmer, Nummer 205"),
        ],
        "dictation": [
            "Die Heizung funktioniert nicht.",
            "Ich schicke sofort einen Techniker.",
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
        assert "waisen" not in dlg or dlg["waisen"] in (None, [], {})
        assert len(dlg["lines"]) == len(exp["lines"])
        assert len(dlg["questions"]) == len(exp["questions"])
        assert len(dlg.get("dictation") or []) == len(exp["dictation"])
        for i, (who, de) in enumerate(exp["lines"]):
            ln = dlg["lines"][i]
            assert ln["who"] == who, f"{did}.lines[{i}] who: {ln['who']!r} vs {who!r}"
            assert ln["de"] == de, f"{did}.lines[{i}] de mismatch"
            locked["linesDE"] += 1
        for i, (qtype, ans) in enumerate(exp["questions"]):
            q = dlg["questions"][i]
            assert q["type"] == qtype and q["answer"] == ans, f"{did}.q{i} mismatch"
            locked["questions"] += 1
        for i, s in enumerate(exp["dictation"]):
            assert dlg["dictation"][i] == s, f"{did}.dict[{i}] mismatch"
            locked["dictations"] += 1
        if did in CORRECTIONS:
            for idx, patch in CORRECTIONS[did].items():
                ln = dlg["lines"][idx]
                if ln["ar"] != patch["ar"]:
                    changes.append({"unit": f"{did}.lines[{idx}].ar", "old": ln["ar"], "new": patch["ar"]})
                    ln["ar"] = patch["ar"]
    D_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"changes": changes, "locked": locked}


def main() -> None:
    r = apply_patch()
    print("<R115> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
