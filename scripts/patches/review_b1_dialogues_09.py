#!/usr/bin/env python3
"""R122 — review patch for ninth (final) B1 batch d-b1-31..d-b1-32.

Scope: 2 dialogues of the B1 remainder (Konflikt im Team / Beim Elternabend),
after the documented ID gap 28-30.
Structure: 5+5 = 10 lines; 3+2 = 5 questions; 3+3 = 6 dictations; no waisen.
Approx units: 4 metadata + 10 lines x3 + 5 questions (7 fields) + 6 dictations ≈ 79.

Confirmed Arabic corrections (meaning accuracy, dropped particle, adverb scope,
missing subject) — all evidence-checked against in-file precedent and official
dictionaries:

d-b1-31 (Konflikt im Team — Nadia kritisiert Jonas, er gelobt Besserung):
  L2 ar: "أتفهَّمُ ذلك. ومع هذا كانت مكالمةٌ قصيرةٌ لتكفي."
      -> "أتفهَّمُ ذلك. ومع ذلك كانت تكفي مكالمةٌ قصيرة."
    ((أ) "hätte gereicht" = Konjunktiv II der Vergangenheit (irreal): الفعل الواقعي
     لم يقع؛ و«كانت … لتكفي» (كان + لام + مضارع منصوب) تفيد التحقيق/القدر لا المخالفة
     للواقع، فيُصلَح إلى «كانت تكفي» (نمط الملف: d-b1-01.L3 «لو كانت … لوافقتُ»،
     d-a2-21.L1 «لولا … لكنّا فزنا»). (ب) "Trotzdem" يُترجَم في الملف «ومع ذلك»
     (d-b1-01.L2) لا «ومع هذا».)
  L4 ar: "حسناً. نثبّتُ الأمرَ هكذا."
      -> "حسناً. إذن نثبّتُ الأمرَ هكذا."
    ("Dann halten wir das so fest": «Dann» سقط في العربية؛ ونمط الملف في ترجمتها
     «إذن» (d-b1-14.L5 «استريحوا إذن»، d-b2-02.L4 «إذن نواصل مع الجدول»).)

d-b1-32 (Beim Elternabend — Lehrerin berät den Vater):
  L2 ar: "هذا يزولُ غالباً. المهمُّ أن يقرأَ بصوتٍ عالٍ أكثر."
      -> "هذا يزولُ غالباً. المهمُّ أن يُكثِرَ من القراءةِ بصوتٍ عالٍ."
    ("öfter laut liest": öfter = Komparativ zu oft (häufiger، تكرار أعلى)، وليس
     زيادة في علوّ الصوت كما تُوهم «عالٍ أكثر»؛ «يُكثِر من القراءة» ينقل التكرار.)
  L4 ar: "خمسَ عشرةَ دقيقةً تكفي إن كانَ بانتظام."
      -> "خمسَ عشرةَ دقيقةً تكفي إن كانَ ذلك بانتظامٍ."
    ("wenn es regelmäßig geschieht": فاعل «es» غائب في العربية؛ «كان» بلا مرفوع
     تُقرأ عاميّة، فيُضاف «ذلك» ويُتمّ التنوين «بانتظامٍ».)

Locked and never touched: all de/who fields, question answers/options/types,
dictations, titles, level. Idempotent: re-running applies zero changes.
"""
from __future__ import annotations

import json
from pathlib import Path

D_PATH = Path(__file__).resolve().parents[2] / "content" / "dialogues.json"

EXPECTED = {
    "d-b1-31": {
        "level": "B1",
        "titleDe": "Konflikt im Team",
        "titleAr": "نزاعٌ داخلَ الفريق",
        "lines": [
            ("Nadia", "Mir ist aufgefallen, dass du die Absprache nicht eingehalten hast."),
            ("Jonas", "Das stimmt, aber ich war unter großem Zeitdruck."),
            ("Nadia", "Das kann ich nachvollziehen. Trotzdem hätte ein kurzer Anruf gereicht."),
            ("Jonas", "Da hast du recht. Ich melde mich beim nächsten Mal früher."),
            ("Nadia", "Gut. Dann halten wir das so fest."),
        ],
        "questions": [
            ("mc", "Sie versteht sie, kritisiert aber trotzdem.",
             ["Sie lehnt sie ab, weil er unter Zeitdruck war.",
              "Sie hält die Absprache selbst nicht ein.",
              "Sie versteht sie, kritisiert aber trotzdem."]),
            ("fill", ["Trotzdem"], None),
            ("truefalse", "falsch", ["richtig", "falsch"]),
        ],
        "dictation": [
            "Mir ist aufgefallen, dass du die Absprache nicht eingehalten hast.",
            "Das stimmt, aber ich war unter großem Zeitdruck.",
            "Das kann ich nachvollziehen. Trotzdem hätte ein kurzer Anruf gereicht.",
        ],
    },
    "d-b1-32": {
        "level": "B1",
        "titleDe": "Beim Elternabend",
        "titleAr": "في اجتماعِ أولياءِ الأمور",
        "lines": [
            ("Lehrerin", "Ihr Sohn arbeitet gut mit, aber er meldet sich selten."),
            ("Vater", "Zu Hause erzählt er viel. In der Klasse ist er wohl schüchtern."),
            ("Lehrerin", "Das legt sich meistens. Wichtig wäre, dass er öfter laut liest."),
            ("Vater", "Wie viel sollte er täglich üben?"),
            ("Lehrerin", "Fünfzehn Minuten reichen, wenn es regelmäßig geschieht."),
        ],
        "questions": [
            ("mc", "dass er täglich fünfzehn Minuten laut liest",
             ["dass er täglich fünfzehn Minuten laut liest",
              "dass er zu Hause weniger erzählt",
              "dass er sich in der Klasse seltener meldet"]),
            ("fill", ["regelmäßig"], None),
        ],
        "dictation": [
            "Ihr Sohn arbeitet gut mit, aber er meldet sich selten.",
            "Zu Hause erzählt er viel. In der Klasse ist er wohl schüchtern.",
            "Das legt sich meistens. Wichtig wäre, dass er öfter laut liest.",
        ],
    },
}

CORRECTIONS = {
    "d-b1-31": {
        2: {
            "old": "أتفهَّمُ ذلك. ومع هذا كانت مكالمةٌ قصيرةٌ لتكفي.",
            "ar": "أتفهَّمُ ذلك. ومع ذلك كانت تكفي مكالمةٌ قصيرة.",
        },
        4: {
            "old": "حسناً. نثبّتُ الأمرَ هكذا.",
            "ar": "حسناً. إذن نثبّتُ الأمرَ هكذا.",
        },
    },
    "d-b1-32": {
        2: {
            "old": "هذا يزولُ غالباً. المهمُّ أن يقرأَ بصوتٍ عالٍ أكثر.",
            "ar": "هذا يزولُ غالباً. المهمُّ أن يُكثِرَ من القراءةِ بصوتٍ عالٍ.",
        },
        4: {
            "old": "خمسَ عشرةَ دقيقةً تكفي إن كانَ بانتظام.",
            "ar": "خمسَ عشرةَ دقيقةً تكفي إن كانَ ذلك بانتظامٍ.",
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
    print("<R122> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
