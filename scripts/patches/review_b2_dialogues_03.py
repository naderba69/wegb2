#!/usr/bin/env python3
"""R125 — review patch for third B2 batch d-b2-07..d-b2-09.

Scope: 3 dialogues of the third B2 batch (Vertragsverhandlung /
Im Seminar / Das Vorstellungsgespräch).
Structure: 5+6+6 = 17 lines; 2+2+2 = 6 questions; 3+2+2 = 7 dictations; no waisen.
Approx units: 4 metadata per dialogue + lines x3 + question keys + dictations = 116.

Confirmed Arabic corrections (meaning accuracy, terminology consistency,
register from the locked German) — evidence-checked against in-file precedent
and official dictionaries:

d-b2-07 (Vertragsverhandlung — Einkäufer und Anbieter, formelles Sie):
  L2 ar: "في حال اختصاركم أجل التسليم نكون مستعدين لزيادة 5%."
      -> "بشرطِ أن تختصروا مهلةَ التسليم نكون مستعدين لدفع خمسةٍ بالمئة زيادةً."
    ((أ) sofern = «بشرط» (DWDS: «unter der Bedingung, Voraussetzung, dass»؛
     Duden: vorausgesetzt, dass) بنمط الملف d-b2-10.L6 «بشرطِ أن تُقَصَّرَ…» لا
     «في حال». (ب) Frist = مهلة محددة (juraforum: «Zeitraum, innerhalb dessen …
     eine bestimmte Handlung vorgenommen werden soll») وسنّة الملف «مهلة»
     (d-b1-21/d-b1-25/d-b1-26…) لا «أجل». (ج) النسب في الملف بالحروف + «بالمئة»
     (d-b2-11.L0/L2/L3، d-b2-13.L5، d-b2-16.L5) لا رمز «5%». (د) «zu … mehr
     bereit» = استعدادٌ لدفع زيادة، و«لزيادة 5%» المبهمة صارت «لدفع خمسةٍ بالمئة
     زيادةً» كما يوضحه Q0 «zu 5 Prozent mehr».)

d-b2-08 (Im Seminar — Dozentin und Layla, formelles Sie):
  L0 ar: "سيدة حداد، كيف تقيّمين هذه الدراسة؟"
      -> "سيدة حداد، كيف تقيّمون هذه الدراسة؟"
    (Sie صريح («bewerten Sie») → جمع بنمط الملف d-b2-16.L2/d-b2-20.L3 وبعد
     تصحيحات R123/R124؛ و«سيدة X» مثبَّتة أصلاً.)
  L3 ar: "النتائج يصعب تعميمها."
      -> "بالكاد يمكن تعميم النتائج."
    (kaum = بالكاد (DWDS: «fast gar nicht, so gut wie nicht»؛ «mit Mühe, knapper
     Not») بنمط d-b2-07.L0 «بالكاد تغطي»؛ و«lassen sich kaum verallgemeinern» =
     إمكان التعميم شبه معدوم لا مجرّد «صعب».)
  L4 ar: "نقطة جيدة. هل يمكنك التعمق في ذلك في الورقة؟"
      -> "نقطة جيدة. هل يمكنكم التعمق في ذلك في الورقة؟"
    (Sie صريح («Könnten Sie») → جمع.)
  L5 ar: "نعم، سأضيف فصلاً عن حدود البحث."
      -> "نعم، سأضيف قسماً عن حدود البحث."
    (Abschnitt = «Teil eines geschriebenen oder gedruckten Textes» (Duden)؛ وشرح
     Q1 في الملف نفسه يقول «القسم الناقص هو ما ستضيفه هي» — توحيد المصطلح على
     «قسم»، والـKapitel يقابله «فصل».)

d-b2-09 (Das Vorstellungsgespräch — Personalchefin und Sami, formelles Sie):
  L0 ar: "لماذا تقدّمتِ للعمل عندنا؟"
      -> "لماذا تقدّمتم للعمل عندنا؟"
    (Sie صريح («haben Sie sich beworben») والمخاطَب Sami مذكّر؛ و«تقدّمتِ»
     المؤنّثة المفردة خطأ ضميرٍ ومخاطبةٍ معاً.)
  L2 ar: "ما أكبر نقاط قوّتك؟"
      -> "ما أكبر نقاط قوّتكم؟"
    (Ihre الصريحة → جمع، كما في «شركتكم» في L1 نفسه.)
  L4 ar: "هل لديك أسئلة لنا؟"
      -> "هل لديكم أسئلة لنا؟"
    (Haben Sie صريح → جمع.)
  L5 ar: "نعم: كيف تبدو مرحلة التأهيل في الأسابيع الأولى؟"
      -> "نعم: كيف تبدو فترة التهيئة في الأسابيع الأولى؟"
    (Einarbeitung = «Einführung eines neuen Mitarbeiters in seinen Arbeits- bzw.
     Einsatzbereich» (Duden)؛ والنمط الداخلي d-a2-13.L2 «فترة التهيئة في العمل»
     (Einarbeitung)؛ و«التأهيل» للـQualifizierung لا للتعريف بالعمل.)

No locked-German defect recorded in this batch (W5 d-b2-02 remains the open one).

Locked and never touched: all de/who fields, question answers/options/types/prompts,
dictations, titles, level. Idempotent: re-running applies zero changes.
"""
from __future__ import annotations

import json
from pathlib import Path

D_PATH = Path(__file__).resolve().parents[2] / "content" / "dialogues.json"

EXPECTED = {
    "d-b2-07": {
        "level": "B2",
        "titleDe": "Vertragsverhandlung",
        "titleAr": "تفاوض على العقد",
        "lines": [
            ("Einkäufer", "Die von Ihnen angebotenen Konditionen decken unsere Kosten kaum."),
            ("Anbieter", "Angesichts der Marktlage halten wir unser Angebot für fair."),
            ("Einkäufer", "Sofern Sie die Lieferfrist verkürzen, wären wir zu 5 Prozent mehr bereit."),
            ("Anbieter", "Einverstanden, unter der Bedingung einer längeren Vertragslaufzeit."),
            ("Einkäufer", "Das können wir prüfen. Dann machen wir nächste Woche weiter."),
        ],
        "questions": [
            ("fill", ["Prozent", "prozent"], None),
            ("mc", "eine längere Vertragslaufzeit",
             ["eine längere Vertragslaufzeit", "eine kürzere Lieferfrist", "5 Prozent mehr"]),
        ],
        "dictation": [
            "Angesichts der Marktlage halten wir unser Angebot für fair.",
            "Sofern Sie die Lieferfrist verkürzen, wären wir zu 5 Prozent mehr bereit.",
            "Unter der Bedingung einer längeren Vertragslaufzeit.",
        ],
    },
    "d-b2-08": {
        "level": "B2",
        "titleDe": "Im Seminar",
        "titleAr": "في الحلقة الدراسية",
        "lines": [
            ("Dozentin", "Frau Haddad, wie bewerten Sie diese Studie?"),
            ("Layla", "Methodisch stark, aber die Stichprobe ist zu klein."),
            ("Dozentin", "Inwiefern ist das ein Problem?"),
            ("Layla", "Die Ergebnisse lassen sich kaum verallgemeinern."),
            ("Dozentin", "Guter Punkt. Könnten Sie das im Paper vertiefen?"),
            ("Layla", "Ja, ich ergänze einen Abschnitt über die Grenzen der Forschung."),
        ],
        "questions": [
            ("mc", "die zu kleine Stichprobe",
             ["die Methode der Studie", "die Verallgemeinerung durch die Dozentin",
              "den fehlenden Abschnitt im Paper", "die zu kleine Stichprobe"]),
            ("mc", "einen Abschnitt über die Grenzen der Forschung",
             ["einen Abschnitt über die Grenzen der Forschung", "eine größere Stichprobe",
              "eine Kritik an der Methode", "eine Bewertung der Dozentin"]),
        ],
        "dictation": [
            "Methodisch stark, aber die Stichprobe ist zu klein.",
            "Die Ergebnisse lassen sich kaum verallgemeinern.",
        ],
    },
    "d-b2-09": {
        "level": "B2",
        "titleDe": "Das Vorstellungsgespräch",
        "titleAr": "مقابلة العمل",
        "lines": [
            ("Personalchefin", "Warum haben Sie sich bei uns beworben?"),
            ("Sami", "Ihre Firma arbeitet an nachhaltigen Projekten – genau das interessiert mich."),
            ("Personalchefin", "Was ist Ihre größte Stärke?"),
            ("Sami", "Ich arbeite strukturiert und bleibe auch unter Druck ruhig."),
            ("Personalchefin", "Haben Sie Fragen an uns?"),
            ("Sami", "Ja: Wie sieht die Einarbeitung in den ersten Wochen aus?"),
        ],
        "questions": [
            ("mc", "wegen der nachhaltigen Projekte",
             ["wegen der Einarbeitung in den ersten Wochen", "wegen der nachhaltigen Projekte",
              "weil er unter Druck ruhig bleibt", "wegen der Personalchefin"]),
            ("mc", "strukturiertes Arbeiten und Ruhe unter Druck",
             ["Interesse an Nachhaltigkeit", "schnelle Einarbeitung",
              "strukturiertes Arbeiten und Ruhe unter Druck", "dass er viele Fragen stellt"]),
        ],
        "dictation": [
            "Was ist Ihre größte Stärke?",
            "Ich arbeite strukturiert und bleibe auch unter Druck ruhig.",
        ],
    },
}

CORRECTIONS = {
    "d-b2-07": {
        2: {
            "old": "في حال اختصاركم أجل التسليم نكون مستعدين لزيادة 5%.",
            "ar": "بشرطِ أن تختصروا مهلةَ التسليم نكون مستعدين لدفع خمسةٍ بالمئة زيادةً.",
        },
    },
    "d-b2-08": {
        0: {
            "old": "سيدة حداد، كيف تقيّمين هذه الدراسة؟",
            "ar": "سيدة حداد، كيف تقيّمون هذه الدراسة؟",
        },
        3: {
            "old": "النتائج يصعب تعميمها.",
            "ar": "بالكاد يمكن تعميم النتائج.",
        },
        4: {
            "old": "نقطة جيدة. هل يمكنك التعمق في ذلك في الورقة؟",
            "ar": "نقطة جيدة. هل يمكنكم التعمق في ذلك في الورقة؟",
        },
        5: {
            "old": "نعم، سأضيف فصلاً عن حدود البحث.",
            "ar": "نعم، سأضيف قسماً عن حدود البحث.",
        },
    },
    "d-b2-09": {
        0: {
            "old": "لماذا تقدّمتِ للعمل عندنا؟",
            "ar": "لماذا تقدّمتم للعمل عندنا؟",
        },
        2: {
            "old": "ما أكبر نقاط قوّتك؟",
            "ar": "ما أكبر نقاط قوّتكم؟",
        },
        4: {
            "old": "هل لديك أسئلة لنا؟",
            "ar": "هل لديكم أسئلة لنا؟",
        },
        5: {
            "old": "نعم: كيف تبدو مرحلة التأهيل في الأسابيع الأولى؟",
            "ar": "نعم: كيف تبدو فترة التهيئة في الأسابيع الأولى؟",
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
    print("<R125> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
