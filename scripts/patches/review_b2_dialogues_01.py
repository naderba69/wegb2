#!/usr/bin/env python3
"""R123 — review patch for first B2 batch d-b2-01..d-b2-03.

Scope: 3 dialogues of the first B2 batch (Interview: Klimapolitik /
Fachgespräch: Digitalisierung / Medienkritik).
Structure: 6+5+4 = 15 lines; 2+2+2 = 6 questions; 3+3+3 = 9 dictations; no waisen.
Approx units: 4 metadata per dialogue + lines x3 + question keys + dictations = 105.

Confirmed Arabic corrections (meaning accuracy, idiomatic particles, register
address, terminology) — evidence-checked against in-file precedent and official
dictionaries:

d-b2-01 (Interview: Klimapolitik — Moderatorin und Berger, formelles Sie):
  L0 ar: "سيدتي بيرغر، كيف تقيّمون سياسة المناخ حتى الآن؟"
      -> "سيدة بيرغر، كيف تقيّمون سياسة المناخ حتى الآن؟"
    (Frau X = «سيدة X» بنمط الملف: d-b2-08.L0 «سيدة حداد»، d-a2-07.L0 «يا سيدة
     كلاين»؛ و«سيدتي» نداء تملك لا مقابل له في الألماني.)
  L3 ar: "الأمر يتعلق باستثمارات مستدامة. بدونها ستكون كل الأهداف وهمية."
      -> "الأمر يتعلق باستثمارات مستدامة. بدونها لكانت كل الأهداف وهمية."
    ("wären alle Ziele illusorisch": Konjunktiv II مخالف للواقع، و«ستكون» تقلبها
     وعداً مستقبلياً؛ النمط الداخلي: d-b1-01.L3 «لو كانت … لوافقتُ».)
  L4 ar: "الحكومة تعتبر بالأرقام أنها كافية."
      -> "في المقابل، ترى الحكومة أن الأرقام كافية."
    ("hält dagegen die Zahlen für ausreichend": (أ) dagegen = في المقابل.
     (ب) «تعتبر بالأرقام أنها» ركيكة وضميرها ملتبس؛ والصواب «ترى أن الأرقام كافية».)
  L5 ar: "هذا التفاؤل، بلطف شديد، يصعب تبريره."
      -> "هذا التفاؤل، بعبارةٍ لطيفة، يصعب فهمه."
    ((أ) gelinde gesagt = «بعبارةٍ لطيفة/وبصياغةٍ مخفَّفة» لا «بلطف شديد» (DWDS:
     «etwas mit einem gelinden Ausdruck bezeichnen»). (ب) nachvollziehbar = مفهوم،
     ونمط الملف «هذا مفهوم» (d-b2-04.L3) لا «تبريره».)

d-b2-02 (Fachgespräch: Digitalisierung — Projektleiter und Beraterin):
  L3 ar: "بالطبع. الحاسم أن التدريبات التي خططنا لها تجري موازية."
      -> "بالطبع. الحاسم أن الدورات التدريبية التي خططنا لها تجري بالتوازي."
    ((أ) Schulungen = دورات تدريبية؛ و«التدريبات» تلتبس بـ«تدريب» بمعنى Praktikum
     المستعمل في d-b1-23. (ب) «تجري موازية» بلا متعلِّق ركيكة؛ begleitend
     stattfinden = «تجري بالتوازي» (DWDS: begleitend ≈ gleichzeitig, parallel).)

d-b2-03 (Medienkritik — Jonas und Dina, du):
  L0 ar: "هل قرأت المقال؟ من المزعوم أن الشركة صفّحت الأرقام."
      -> "هل قرأت المقال؟ يُقالُ إنّ الشركةَ جمّلت الأرقام."
    ((أ) schönen = تجميل/تزيين الأرقام (Duden: schöner erscheinen lassen؛
     Synonyme: beschönigen, frisieren) لا «تصحيحها» — خطأ معنى صريح.
     (ب) angeblich = «يُقال إنّ»؛ و«من المزعوم أن» تركيب ركيك.)
  L3 ar: "بالضبط. بدون بيانات موثوقة يكون الاستنتاج بلا مصداقية."
      -> "بالضبط. بدون بيانات موثوقة يكون الاستنتاج باطلاً."
    (hinfällig = باطل/غير ذي مفعول (Duden: gegenstandslos, ungültig) لا «بلا مصداقية».)

Content defect recorded, not modified (locked German):
  W5 d-b2-02 questions[0].promptDe: "Die Digitalisung setzt eine Infrastruktur ___."
      — «Digitalisung» خطأ طباعي (الصواب «Digitalisierung» كما في السطر D0 والإملاء D0).

Locked and never touched: all de/who fields, question answers/options/types/prompts,
dictations, titles, level. Idempotent: re-running applies zero changes.
"""
from __future__ import annotations

import json
from pathlib import Path

D_PATH = Path(__file__).resolve().parents[2] / "content" / "dialogues.json"

EXPECTED = {
    "d-b2-01": {
        "level": "B2",
        "titleDe": "Interview: Klimapolitik",
        "titleAr": "حوار: سياسة المناخ",
        "lines": [
            ("Moderatorin", "Frau Berger, wie bewerten Sie die bisherige Klimapolitik?"),
            ("Berger", "Die Maßnahmen gehen in die richtige Richtung, reichen aber bei Weitem nicht aus."),
            ("Moderatorin", "Was schlagen Sie konkret vor?"),
            ("Berger", "Es geht um nachhaltige Investitionen. Ohne sie wären alle Ziele illusorisch."),
            ("Moderatorin", "Die Regierung hält dagegen die Zahlen für ausreichend."),
            ("Berger", "Dieser Optimismus ist, gelinde gesagt, schwer nachvollziehbar."),
        ],
        "questions": [
            ("mc", "die unzureichenden Maßnahmen",
             ["die unzureichenden Maßnahmen", "die Richtung der Maßnahmen", "den Optimismus der Moderatorin"]),
            ("fill", ["illusorisch"], None),
        ],
        "dictation": [
            "Die Maßnahmen reichen bei Weitem nicht aus.",
            "Es geht um nachhaltige Investitionen.",
            "Dieser Optimismus ist schwer nachvollziehbar.",
        ],
    },
    "d-b2-02": {
        "level": "B2",
        "titleDe": "Fachgespräch: Digitalisierung",
        "titleAr": "حوار مهني: الرقمنة",
        "lines": [
            ("Projektleiter", "Wo sehen Sie die größte Herausforderung?"),
            ("Beraterin", "Die Digitalisierung setzt eine Infrastruktur voraus, die viele Kommunen noch nicht haben."),
            ("Projektleiter", "Gleichwohl müssen wir anfangen."),
            ("Beraterin", "Natürlich. Entscheidend ist, dass die von uns geplanten Schulungen begleitend stattfinden."),
            ("Projektleiter", "Einverstanden. Dann machen wir weiter mit dem Zeitplan."),
        ],
        "questions": [
            ("fill", ["voraus"], None),
            ("mc", "dass die Schulungen begleitend stattfinden",
             ["dass die Kommunen zuerst die Infrastruktur bauen", "dass die Schulungen begleitend stattfinden", "dass der Zeitplan eingehalten wird"]),
        ],
        "dictation": [
            "Die Digitalisierung setzt eine Infrastruktur voraus.",
            "Gleichwohl müssen wir anfangen.",
            "Die von uns geplanten Schulungen finden begleitend statt.",
        ],
    },
    "d-b2-03": {
        "level": "B2",
        "titleDe": "Medienkritik",
        "titleAr": "نقد إعلامي",
        "lines": [
            ("Jonas", "Hast du den Artikel gelesen? Angeblich hat der Konzern die Zahlen geschönt."),
            ("Dina", "Ich habe die Quelle geprüft: Sie ist nicht besonders seriös."),
            ("Jonas", "Also sollten wir die Behauptung in Frage stellen."),
            ("Dina", "Genau. Ohne belastbare Daten ist die Schlussfolgerung hinfällig."),
        ],
        "questions": [
            ("mc", "nicht besonders seriös",
             ["seriös, aber ohne Zahlen", "seriös, die Zahlen sind aber geschönt", "nicht besonders seriös"]),
            ("fill", ["Frage"], None),
        ],
        "dictation": [
            "Angeblich hat der Konzern die Zahlen geschönt.",
            "Wir sollten die Behauptung in Frage stellen.",
            "Ohne belastbare Daten ist die Schlussfolgerung hinfällig.",
        ],
    },
}

CORRECTIONS = {
    "d-b2-01": {
        0: {
            "old": "سيدتي بيرغر، كيف تقيّمون سياسة المناخ حتى الآن؟",
            "ar": "سيدة بيرغر، كيف تقيّمون سياسة المناخ حتى الآن؟",
        },
        3: {
            "old": "الأمر يتعلق باستثمارات مستدامة. بدونها ستكون كل الأهداف وهمية.",
            "ar": "الأمر يتعلق باستثمارات مستدامة. بدونها لكانت كل الأهداف وهمية.",
        },
        4: {
            "old": "الحكومة تعتبر بالأرقام أنها كافية.",
            "ar": "في المقابل، ترى الحكومة أن الأرقام كافية.",
        },
        5: {
            "old": "هذا التفاؤل، بلطف شديد، يصعب تبريره.",
            "ar": "هذا التفاؤل، بعبارةٍ لطيفة، يصعب فهمه.",
        },
    },
    "d-b2-02": {
        3: {
            "old": "بالطبع. الحاسم أن التدريبات التي خططنا لها تجري موازية.",
            "ar": "بالطبع. الحاسم أن الدورات التدريبية التي خططنا لها تجري بالتوازي.",
        },
    },
    "d-b2-03": {
        0: {
            "old": "هل قرأت المقال؟ من المزعوم أن الشركة صفّحت الأرقام.",
            "ar": "هل قرأت المقال؟ يُقالُ إنّ الشركةَ جمّلت الأرقام.",
        },
        3: {
            "old": "بالضبط. بدون بيانات موثوقة يكون الاستنتاج بلا مصداقية.",
            "ar": "بالضبط. بدون بيانات موثوقة يكون الاستنتاج باطلاً.",
        },
    },
}


def apply_patch() -> dict:
    data = json.loads(D_PATH.read_text(encoding="utf-8"))
    changes: list[dict] = []
    locked = {"linesDE": 0, "questions": 0, "dictations": 0}
    by_id = {d["id"]: d for d in data}
    for did, exp in EXPECTED.items():
        dlg = by_id[did]
        assert dlg["level"] == exp["level"], f"{did} level"
        assert dlg["titleDe"] == exp["titleDe"], f"{did} titleDe"
        assert dlg["titleAr"] == exp["titleAr"], f"{did} titleAr"
        assert "waisen" not in dlg or dlg["waisen"] in (None, [], {})
        assert len(dlg["lines"]) == len(exp["lines"]), f"{did} line count"
        assert len(dlg["questions"]) == len(exp["questions"]), f"{did} question count"
        assert len(dlg.get("dictation") or []) == len(exp["dictation"]), f"{did} dictation count"
        for i, (who, de) in enumerate(exp["lines"]):
            ln = dlg["lines"][i]
            assert ln["who"] == who, f"{did}.L{i} who: {ln['who']!r} vs {who!r}"
            assert ln["de"] == de, f"{did}.L{i} de: {ln['de']!r} vs {de!r}"
            locked["linesDE"] += 1
        for i, (qtype, ans, opts) in enumerate(exp["questions"]):
            q = dlg["questions"][i]
            assert q["type"] == qtype and q["answer"] == ans, f"{did}.q{i} mismatch"
            assert q.get("options") == opts, f"{did}.q{i} options mismatch"
            locked["questions"] += 1
        for i, s in enumerate(exp["dictation"]):
            assert dlg["dictation"][i] == s, f"{did}.dict[{i}] mismatch"
            locked["dictations"] += 1
        for idx, patch in CORRECTIONS[did].items():
            ln = dlg["lines"][idx]
            if ln["ar"] != patch["ar"]:
                assert ln["ar"] == patch["old"], f"{did}.L{idx} unexpected ar: {ln['ar']!r}"
                changes.append({
                    "unit": f"{did}.lines[{idx}].ar",
                    "old": ln["ar"],
                    "new": patch["ar"],
                })
                ln["ar"] = patch["ar"]
    D_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"changes": changes, "locked": locked}


def main() -> None:
    r = apply_patch()
    print("<R123> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
