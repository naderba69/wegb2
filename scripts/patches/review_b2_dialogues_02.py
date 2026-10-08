#!/usr/bin/env python3
"""R124 — review patch for second B2 batch d-b2-04..d-b2-06.

Scope: 3 dialogues of the second B2 batch (Gehaltsverhandlung /
Buchbesprechung / Podiumsdiskussion: KI im Unterricht).
Structure: 5+6+6 = 17 lines; 2+2+2 = 6 questions; 3+3+3 = 9 dictations; no waisen.
Approx units: 4 metadata per dialogue + lines x3 + question keys + dictations = 114.

Confirmed Arabic corrections (meaning accuracy, terminology consistency,
idiomatic particles) — evidence-checked against in-file precedent and official
dictionaries:

d-b2-04 (Gehaltsverhandlung — Mitarbeiter und Vorgesetzte, formelles Sie):
  L0 ar: "أودّ الحديث عن تعويضي."
      -> "أودّ الحديث عن أجري."
    (Vergütung = الأجر/المقابل عن العمل (DWDS: «das Bezahlen, Entlohnen einer
     (Arbeits-)Leistung … Arbeitsentgelt, Kostenerstattung»)؛ و«التعويض» في الملف
     للمقابل عن خسارةٍ أو فوات: d-b2-27.L2 «أتنازلتُ عن التعويض» (Schadensersatz)،
     d-b2-16.L6 «أفُرصةُ تعويض؟» (Nachschreibtermin)، d-b2-23.L0 «تعويضُها»
     (Ausgleich)؛ والاسم «الأجر» ثابت في d-b2-10.L1 «أجرياً» (tariflich).)
  L4 ar: "بشرط تعهد مكتوب للعام القادم أكون موافقاً."
      -> "بشرط تعهد خطي للعام القادم أكون موافقاً."
    (توحيد schriftlich بسنّة الملف «خطي»: d-b2-17.L6 «اتفاقٌ خطيٌّ»، d-b2-20.L7
     «خطيًّا»، d-b2-22.L3 «الخطيةِ»، d-b2-10.L7 «خطياً»؛ و«Zusage» = تعهد/وعد ملزم
     (Duden: «Zusicherung, sich … jemandes Wünschen entsprechend zu verhalten»؛
     DWDS: Versprechen) فبقي «تعهد» وحُدِّد النعت «خطي».)

d-b2-05 (Buchbesprechung — Helena und Karim, du):
  L1 ar: "اللغة ساحرة وإن بدت الحبكة متوقعة قليلاً."
      -> "اللغة بارعة وإن بدت الحبكة متوقعة قليلاً."
    (brillant = بارع/بديع/باهر (Duden: «glänzend, hervorragend, sehr gut»، Beispiel
     «eine brillante Rede»)؛ و«ساحرة» تنقل لون الفتنة السحرية لا الجودة الفنية.)
  L2 ar: "أنا أرى العكس. تطوّر الشخصيات يقنعني تحديداً."
      -> "أنا أرى الأمر على نحوٍ آخر. تطوّر الشخصيات تحديداً هو ما يقنعني."
    ((أ) anders = «على نحوٍ آخر/مختلف» (Duden: «auf andere, abweichende Art und
     Weise, abweichend, verschieden») لا «العكس» (Gegenteil). (ب) gerade تقييد
     قصرٍ: «تطوّر الشخصيات تحديداً هو ما يقنعني» أفصح من «يقنعني تحديداً».)
  L3 ar: "أعترف، الشخصية الرئيسية مصمّمة بطبقات معقّدة."
      -> "أعترف، الشخصية الرئيسية مصمّمة على طبقات متعددة."
    (vielschichtig حرفياً «متعدد الطبقات»؛ DWDS: «in vielen Schichten» وبالثاني
     «aus vielen verschiedenartigen Komponenten zusammengesetzt, kompliziert»؛
     و«معقّدة» تحذف «viel-» وتقدّم المعنى الثاني على الأول في وصف بناء الشخصية.)

d-b2-06 (Podiumsdiskussion: KI im Unterricht — Moderation, Prof. Weber, Dr. Saleh):
  L1 ar: "استبدال المعلّم خطأ مفاهيمي. الذكاء الاصطناعي يُعدّ لكنه لا يربّي."
      -> "استبدال المعلّم خطأ مفاهيمي. الذكاء الاصطناعي يستطيع التحضير لكنه لا يربّي."
    ((أ) «يُعدّ» المكتوبة بلا حركة على العين تلتبس بـ«يُعَدّ» (يُعتبر)، والمماثل في
     الملف بمعنى الاحتساب: d-b2-10.L4 «أَعُدُّ … إيراداً». (ب) vorbereiten هنا =
     تحضير الدروس (Duden: «der Lehrer bereitet seinen Unterricht, eine Stunde
     vor») والمصدر «التحضير» يحفظ حذف المفعول كما في «kann vorbereiten».
     (ج) «يحضّر» ثابت في الملف: d-a2-23.Q0 «الأم تحضّر الأطباق».)
  L4 ar: "في الاعتماد: من يستهلك النتائج فقط ينسى التفكير."
      -> "في الاعتماد: من يستهلك النتائج فقط يفقد القدرة على التفكير."
    (verlernen = فقدان مهارة مكتسبة بالإهمال (WAHRIG/DWDS: «etwas, das man gelernt
     hat, nicht mehr können»؛ thefreedictionary: «eine Fähigkeit durch
     Nichtgebrauch verlieren») لا مجرّد «ينسى»؛ و«يفقد» ثابت في الملف:
     d-b1-01.L1 «لكنه يفقد التواصل».)

No locked-German defect recorded in this batch (W5 d-b2-02 remains the open one).

Locked and never touched: all de/who fields, question answers/options/types/prompts,
dictations, titles, level. Idempotent: re-running applies zero changes.
"""
from __future__ import annotations

import json
from pathlib import Path

D_PATH = Path(__file__).resolve().parents[2] / "content" / "dialogues.json"

EXPECTED = {
    "d-b2-04": {
        "level": "B2",
        "titleDe": "Gehaltsverhandlung",
        "titleAr": "تفاوض على الراتب",
        "lines": [
            ("Mitarbeiter", "Ich möchte gern über meine Vergütung sprechen."),
            ("Vorgesetzte", "Gern. Welche Argumente bringen Sie vor?"),
            ("Mitarbeiter", "Ich habe das Projekt erfolgreich abgeschlossen und seit einem Jahr zusätzliche Verantwortung."),
            ("Vorgesetzte", "Das ist nachvollziehbar. Allerdings sind die Spielräume dieses Jahr begrenzt."),
            ("Mitarbeiter", "Unter der Bedingung einer schriftlichen Zusage für nächstes Jahr wäre ich einverstanden."),
        ],
        "questions": [
            ("fill", ["abgeschlossen"], None),
            ("mc", "eine schriftliche Zusage für nächstes Jahr",
             ["eine schriftliche Zusage für nächstes Jahr", "mehr Verantwortung ab nächstem Jahr", "eine sofortige Erhöhung trotz begrenzter Spielräume"]),
        ],
        "dictation": [
            "Ich möchte gern über meine Vergütung sprechen.",
            "Ich habe das Projekt erfolgreich abgeschlossen.",
            "Unter der Bedingung einer schriftlichen Zusage.",
        ],
    },
    "d-b2-05": {
        "level": "B2",
        "titleDe": "Buchbesprechung",
        "titleAr": "مناقشة كتاب",
        "lines": [
            ("Helena", "Was hältst du von dem Roman?"),
            ("Karim", "Die Sprache ist brillant, wenngleich der Plot etwas vorhersehbar wirkt."),
            ("Helena", "Das sehe ich anders. Gerade die Figurenentwicklung überzeugt mich."),
            ("Karim", "Zugegeben, die Hauptfigur ist vielschichtig angelegt."),
            ("Helena", "Also empfehlst du das Buch trotzdem?"),
            ("Karim", "Absolut. Es lohnt sich, es zweimal zu lesen."),
        ],
        "questions": [
            ("mc", "den vorhersehbaren Plot",
             ["die Sprache", "den vorhersehbaren Plot", "die Figurenentwicklung"]),
            ("fill", ["lohnt sich", "lohnt sich."], None),
        ],
        "dictation": [
            "Die Sprache ist brillant.",
            "Gerade die Figurenentwicklung überzeugt mich.",
            "Es lohnt sich, es zweimal zu lesen.",
        ],
    },
    "d-b2-06": {
        "level": "B2",
        "titleDe": "Podiumsdiskussion: KI im Unterricht",
        "titleAr": "حوار منصّة: الذكاء الاصطناعي في التعليم",
        "lines": [
            ("Moderation", "Dürfen KI-Werkzeuge den Unterricht ersetzen?"),
            ("Prof. Weber", "Einen Lehrer zu ersetzen, wäre ein Kategorienfehler. KI kann vorbereiten, aber nicht erziehen."),
            ("Dr. Saleh", "Dem stimme ich zu, sofern man KI als Werkzeug begreift."),
            ("Moderation", "Wo liegt die größte Gefahr?"),
            ("Dr. Saleh", "In der Abhängigkeit: Wer nur noch Ergebnisse konsumiert, verlernt das Denken."),
            ("Prof. Weber", "Genau darum brauchen wir Urteilskraft als Lernziel."),
        ],
        "questions": [
            ("mc", "den Lehrer durch KI zu ersetzen",
             ["KI als Werkzeug zu begreifen", "Urteilskraft als Lernziel", "den Lehrer durch KI zu ersetzen"]),
            ("fill", ["Abhängigkeit"], None),
        ],
        "dictation": [
            "Einen Lehrer zu ersetzen, wäre ein Kategorienfehler.",
            "Wer nur noch Ergebnisse konsumiert, verlernt das Denken.",
            "Wir brauchen Urteilskraft als Lernziel.",
        ],
    },
}

CORRECTIONS = {
    "d-b2-04": {
        0: {
            "old": "أودّ الحديث عن تعويضي.",
            "ar": "أودّ الحديث عن أجري.",
        },
        4: {
            "old": "بشرط تعهد مكتوب للعام القادم أكون موافقاً.",
            "ar": "بشرط تعهد خطي للعام القادم أكون موافقاً.",
        },
    },
    "d-b2-05": {
        1: {
            "old": "اللغة ساحرة وإن بدت الحبكة متوقعة قليلاً.",
            "ar": "اللغة بارعة وإن بدت الحبكة متوقعة قليلاً.",
        },
        2: {
            "old": "أنا أرى العكس. تطوّر الشخصيات يقنعني تحديداً.",
            "ar": "أنا أرى الأمر على نحوٍ آخر. تطوّر الشخصيات تحديداً هو ما يقنعني.",
        },
        3: {
            "old": "أعترف، الشخصية الرئيسية مصمّمة بطبقات معقّدة.",
            "ar": "أعترف، الشخصية الرئيسية مصمّمة على طبقات متعددة.",
        },
    },
    "d-b2-06": {
        1: {
            "old": "استبدال المعلّم خطأ مفاهيمي. الذكاء الاصطناعي يُعدّ لكنه لا يربّي.",
            "ar": "استبدال المعلّم خطأ مفاهيمي. الذكاء الاصطناعي يستطيع التحضير لكنه لا يربّي.",
        },
        4: {
            "old": "في الاعتماد: من يستهلك النتائج فقط ينسى التفكير.",
            "ar": "في الاعتماد: من يستهلك النتائج فقط يفقد القدرة على التفكير.",
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
    print("<R124> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
