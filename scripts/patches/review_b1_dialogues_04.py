#!/usr/bin/env python3
"""R117 — review patch for fourth B1 batch d-b1-13..d-b1-15.

Scope: 3 dialogues (Handwerkertermin verschieben, Im Büro krankmelden, EC-Karte verloren bei der Bank).
Structure: 8+8+8 = 24 lines; 3+3+3 = 9 questions; 2+2+2 = 6 dictations; no waisen.
Approx units: 3 metadata + 24 lines ×3 + 9 questions (multi-field) + 6 dictations ≈ 147.

Confirmed Arabic corrections (formal-Sie agreement, meaning accuracy, removing overly-free renderings):

d-b1-13 (Handwerkertermin — both sides use Sie per L6 "für Sie" and L7 "Ihre Flexibilität"):
  L5 ar: "وأحتاجُ مفتاحَ القبو." → "وأحتاج الدخول إلى القبو."
    (German says Zugang zum Keller = access to the cellar, not "Schlüssel"; the key is
     mentioned only in L6.)
  L6 ar: "الاستقبالُ يُبقي المفتاحَ مُعَدّاً لك." → "يُجهّز الاستقبالُ المفتاحَ لكم."
    ("für Sie" is formal Sie → plural "لكم", not singular "لك". Also "يُبقي مُعدّاً لك"
     is awkward; "يُجهّز لكم" matches "hält … für Sie bereit" more naturally.)
  L7 ar: "شكراً لمرونتِك!" → "شكراً لمرونتكم!" (Ihre → plural لكم, not feminine singular ـكِ).

d-b1-14 (Krankmelden — Chef uses "Sie" with employee Rania):
  L2 ar: "سيتولّى طارق، والأوراقُ تصلُه قبلَ العاشرة." → "سيتولّى طارق، والشرائحُ سأرسلها له قبل العاشرة."
    (die Folien = presentation slides, not "الأوراق" (papers); also German "sende ich ihm"
     is first-person future "I'll send him" not impersonal "تصلُه" (reach him).)
  L5 ar: "اراحي إذن — فالصحةُ تُقدَّمُ على الموعد." → "استريحوا إذن — فالصحّةُ تقدَّم على المهلة."
    (Chef says "ruhen Sie aus" with formal Sie → plural imperative "استريحوا" not feminine
     singular "اراحي" (which would be du-form to a female); "Frist" = deadline/مهلة not
     appointment/موعد, since Steuerunterlagen für Montag is a deadline.)
  L6 ar: "شكراً — وسأُخطِرُك متى استطعت." → "شكراً — سأخطركم حالما أستطيع."
    (Rania uses formal Sie to Chef → plural "أخطركم"; "sobald" = "حالما" more direct
     than "متى".)
  L7 ar: "لا كلمةَ عَجَلٍ تُثقلُك — ارتَحْ جيّدًا!" → "لا داعي للعجلة — استريحوا جيّداً!"
    (Chef's "erholen Sie sich gut" is formal Sie → plural "استريحوا" not masculine
     singular "ارتَحْ"; the rendering "لا كلمة عجل تثقلك" is overly literary/free —
     simplified to B1-appropriate "لا داعي للعجلة".)

d-b1-15 (Bank — Berater uses formal Sie with customer Imen):
  L1 ar: "أُلغِيَت. متى وأين آخرُ استعمال؟" → "أُوقِفَت. متى وأين آخرُ استعمال؟"
    ("sperren" = block/suspend a card → أوقف/حظر; "أُلغِيَت" = cancelled/revoked, which
     implies permanent cancellation, not the temporary block described.)
  L4 ar: "كم يكلِّفُ التعليقُ؟" → "كم يكلف الإيقاف؟" (consistent with L1: Sperrung = إيقاف).
  L7 ar: "ستةٌ إذن. ولا تنسَ هويّتك عند الاستلام." → "ستة يورو إذن. وأحضروا بطاقة هويتكم عند الاستلام."
    ("Den Ausweis … mitbringen" is formal-Sie imperative → plural "أحضروا"; not du-form
     "تنسَ/هويتك". Added "يورو" and "بطاقة" for clarity consistent with B1 banking register.)
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-13": {
        5: {"ar": "التاسعةُ مناسبة. وأحتاج الدخول إلى القبو."},
        6: {"ar": "يُجهّز الاستقبالُ المفتاحَ لكم."},
        7: {"ar": "شكراً لمرونتكم!"},
    },
    "d-b1-14": {
        2: {"ar": "سيتولّى طارق، والشرائحُ سأرسلها له قبل العاشرة."},
        5: {"ar": "استريحوا إذن — فالصحّةُ تقدَّم على المهلة."},
        6: {"ar": "شكراً — سأخطركم حالما أستطيع."},
        7: {"ar": "لا داعي للعجلة — استريحوا جيّداً!"},
    },
    "d-b1-15": {
        1: {"ar": "أُوقِفَت. متى وأين آخرُ استعمال؟"},
        4: {"ar": "كم يكلف الإيقاف؟"},
        7: {"ar": "ستة يورو إذن. وأحضروا بطاقة هويتكم عند الاستلام."},
    },
}

EXPECTED: dict[str, dict] = {
    "d-b1-13": {
        "level": "B1", "titleDe": "Den Handwerkertermin verschieben", "titleAr": "تأجيلُ موعدِ الصانع",
        "lines": [
            ("Frau Krause","Mein Termin für die Heizung am Dienstag — ich muss ihn verschieben."),
            ("Sami",       "Warum? Ich plane sonst den Tag umsonst."),
            ("Frau Krause","Mein Chef gab mir unerwartet einen dringenden Auftrag."),
            ("Sami",       "Donnerstag wäre frei — oder Montag um neun."),
            ("Frau Krause","Montag, aber nicht vor neun: erst die Kinder in die Kita."),
            ("Sami",       "Neun Uhr passt. Ich brauche Zugang zum Keller."),
            ("Frau Krause","Den Schlüssel hält die Rezeption für Sie bereit."),
            ("Sami",       "Danke für Ihre Flexibilität!"),
        ],
        "questions": [
            ("mc","Ihr Chef gab ihr einen dringenden Auftrag."),
            ("mc","Montag um neun"),
            ("mc","Zugang zum Keller"),
        ],
        "dictation": [
            "Neun Uhr passt. Ich brauche Zugang zum Keller.",
            "Montag, aber nicht vor neun: erst die Kinder in die Kita.",
        ],
    },
    "d-b1-14": {
        "level": "B1", "titleDe": "Im Büro krankmelden", "titleAr": "إبلاغُ المكتبِ بالمرض",
        "lines": [
            ("Rania",     "Ich melde mich für heute krank — starke Kopfschmerzen."),
            ("Chef Linke","Gute Besserung! Kann das Meeting um elf warten?"),
            ("Rania",     "Tarek übernimmt; die Folien sende ich ihm vor zehn."),
            ("Chef Linke","Und die Steuerunterlagen für Montag?"),
            ("Rania",     "Längst im gemeinsamen Ordner, seit gestern Abend."),
            ("Chef Linke","Dann ruhen Sie aus — die Gesundheit geht vor der Frist."),
            ("Rania",     "Vielen Dank — ich melde mich, sobald ich wieder kann."),
            ("Chef Linke","Kein Wort der Eile — erholen Sie sich gut!"),
        ],
        "questions": [
            ("mc","Tarek"),
            ("mc","Sie liegen seit gestern im gemeinsamen Ordner."),
            ("mc","die Gesundheit vor der Frist"),
        ],
        "dictation": [
            "Dann ruhen Sie aus — die Gesundheit geht vor der Frist.",
            "Längst im gemeinsamen Ordner, seit gestern Abend.",
        ],
    },
    "d-b1-15": {
        "level": "B1", "titleDe": "Karte verloren — die Bank", "titleAr": "بطاقةٌ ضائعة — المصرف",
        "lines": [
            ("Imen",         "Ich habe meine EC-Karte verloren — bitte sofort sperren!"),
            ("Berater Vogel","Die Karte ist gesperrt. Wann und wo zuletzt benutzt?"),
            ("Imen",         "Gestern Vormittag, Automat am Hauptbahnhof."),
            ("Berater Vogel","Kein Missbrauch vermerkt. Die neue Karte kommt in vierzehn Tagen."),
            ("Imen",         "Was kostet die Sperrung?"),
            ("Berater Vogel","Zwanzig Euro bei Diebstahl, sechs bei Verlust — verloren, richtig?"),
            ("Imen",         "Leider Verlust — gestohlen wurde sie nicht."),
            ("Berater Vogel","Dann sechs Euro. Den Ausweis bitte zum Abholen mitbringen."),
        ],
        "questions": [
            ("mc","Die Karte wird gesperrt."),
            ("mc","sechs Euro"),
            ("mc","in vierzehn Tagen"),
        ],
        "dictation": [
            "Zwanzig Euro bei Diebstahl, sechs bei Verlust — verloren, richtig?",
            "Kein Missbrauch vermerkt. Die neue Karte kommt in vierzehn Tagen.",
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
    print("<R117> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
