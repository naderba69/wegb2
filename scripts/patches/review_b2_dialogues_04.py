#!/usr/bin/env python3
"""R126 — review patch for fourth B2 batch d-b2-10..d-b2-12.

Scope: Vorstellungsgespräch: Gehalt verhandeln / Mieterhöhung: schriftlich
verhandeln / Anerkennung des ausländischen Abschlusses.
Structure: 8+8+8 = 24 lines; 3+3+3 = 9 questions; 2+2+2 = 6 dictations; no waisen.
Approx units: 4 metadata per dialogue + lines x3 + question keys + dictations = 162.

16 confirmed Arabic corrections (meaning accuracy, register from the locked
German, terminology consistency) — evidence-checked against in-file precedent
and dictionaries (DWDS/Duden/gesetze-im-internet/IHK München/Uni Bremen):

d-b2-10 (7): L0 Sie→«وقتكم»; L1 «schwebt Ihnen vor» ← «يخطر ببالكم» +«الأجر»
  (DWDS vorschweben) لا «تُقَدِّمُه لنفسك»; L2 «käme ich auf» ← «أبلغُ»
  (auf eine Summe kommen؛ «تبلغ 250.000» d-b2-27.L5) لا «أقولُ»;
  L3 Rahmen ← «نطاقَنا» (DWDS؛ و«هامش المناورة» محفوظة لـSpielräume d-b2-04.L3)
  و«variabler Anteil» ← «حصةٍ متغيّرةٍ» («Anteil»=حصة d-b2-18.L6) وverhandelbar
  ← «قابلٌ للتفاوض» (عنوانا d-b2-10/d-b2-11 «مفاوضة/تفاوُض»);
  L4 Leistung ← «أداءً» (DWDS: das Geleistete؛ شرح Q1: يُحتسب لا يُدفع) لا
  «إيراداً غيرَ مباشر»; L6 begrenzen auf ← «ألّا تتجاوزَ فترةُ التجربةِ في العقدِ
  ثلاثةَ أشهر» (مفتاح Q1: höchstens؛ sofern=بشرط R125) لا «تُقَصَّرَ التجربةُ»;
  L7 Zusage ← «التعهدُ» (Duden؛ وسنّة d-b2-04.L4 بعد R124) وSie→«سيصلُكم» لا
  «ستصلُك نسخةُ العقدِ».
d-b2-11 (4): L1 Belege ← «أدلتُنا» (DWDS: Beweisstück/Nachweis؛ وشرح Q0 نفسه
  «دليل الإدارة» و«لا حجّة») +«حسابُ الجدوى» (Berechnung؛ وL3 نفسه «حسابُ رسالتك»)
  لا «حججُنا…دراسة»; L3 Sie→«رسالتكم» (Ihr Brief)؛ L5 «binnen vierzehn Tagen»
  ← «أربعةَ عشرَ يوماً» (d-a2-26.L6؛ وشرح Q2 يبني الفخّ على الرقم) وBelege
  ← «الأدلة» لا «الفواتير»; L7 «Per Mail bestätigt» ← «مؤكَّدٌ بالبريد» (Zustands-
  passiv؛ «بالبريد» سنّة d-b1-11/d-b2-19/d-b2-24) وsachlich ← «بموضوعيةٍ»
  (Duden: objektiv؛ سنّة d-b2-19.L2) وGesprächsführung ← «إدارةِ النقاشِ».
d-b2-12 (5): L1 Fächerübersicht ← «قائمةُ الموادِّ الدراسية» وحذف «سنوات» (لا
  مقابل لها في «Nachweis praktischer Tätigkeiten»)؛ L2 Prüfung ← «فحصُ الطلب»
  (شرح Q2: «مدّة فحص الطلب»؛ «فحص» سنّة d-b1-07/d-b2-03) وwährenddessen
  ← «خلاله» لا «اللجان…بين الأيادي»; L3 Berufserlaubnis ← «إذنِ مزاولةِ المهنة»
  (IHK München) وترتيب «نعم، عملٌ مقيَّد»؛ L5 Sie→«إليكم» وAnpassungslehrgang
  المفرد ← «دورةٌ تكييفية» و«16 Monate Praxis» ← «من الممارسةِ العملية» لا
  «دورات…عمليةً موجَّهة»; L7 Vorauszahlung ← «دفعةً مقدَّمة» (d-b2-14.L4
  «الدفعةُ المقدمة») لا «مقدَّماً».

Locked-German defect recorded, not modified (W6): d-b2-11.L2 states
"Genau der Mietspiegel besagt: Kappungsgrenze bei elf Prozent in drei Jahren."
— § 558 Abs. 3 BGB sets the Kappungsgrenze at 20 % (15 % in designated areas);
no 11 % value exists, and the Mietspiegel per § 558c Abs. 1 BGB is an
«Übersicht über die ortsübliche Vergleichsmiete», not the source of the cap.

Locked and untouched: de/who fields, question answers/options/types/prompts,
dictations, titles, level. Idempotent: re-running applies zero changes.
"""
from __future__ import annotations

import json
from pathlib import Path

D_PATH = Path(__file__).resolve().parents[2] / "content" / "dialogues.json"

EXPECTED = {
    "d-b2-10": {
        "level": "B2",
        "titleDe": "Vorstellungsgespräch: Gehalt verhandeln",
        "titleAr": "مقابلةُ عمل: مفاوضةُ الأجر",
        "lines": [
            ("Youssef", "Danke, dass Sie sich die Zeit nehmen — Ihre Stelle interessiert mich sehr."),
            ("Personalchefin", "Ebenso. Was schwebt Ihnen tariflich vor?"),
            ("Youssef", "Angesichts meiner Erfahrung käme ich auf 48.000 Euro brutto."),
            ("Personalchefin", "Das liegt über unserem Rahmen; 45.000 plus variabler Anteil wäre verhandelbar."),
            ("Youssef", "Auf der Zahl bestehe ich nicht — aber die Weiterbildungszeit zähle ich als Leistung."),
            ("Personalchefin", "Fair. Dann 45.500, zwei Tage Homeoffice und 400 Euro Weiterbildungsbudget."),
            ("Youssef", "Sofern der Vertrag die Probezeit auf drei Monate begrenzt, haben wir eine Übereinkunft."),
            ("Personalchefin", "Abgemacht — die Zusage bekommen Sie schriftlich morgen Vormittag."),
        ],
        "questions": [
            ("mc", "45.500 Euro mit Homeoffice und Weiterbildungsbudget",
             ["48.000 Euro, wie Youssef gefordert hat", "45.000 Euro plus variabler Anteil",
              "45.500 Euro mit Homeoffice und Weiterbildungsbudget"]),
            ("mc", "eine Probezeit von höchstens drei Monaten",
             ["eine Probezeit von höchstens drei Monaten", "zwei Tage Homeoffice",
              "dass die Weiterbildungszeit bezahlt wird"]),
            ("mc", "die Zusage über den gesamten Kompromiss",
             ["nur die Zahl 45.500 Euro", "die Zusage über den gesamten Kompromiss", "der variable Anteil"]),
        ],
        "dictation": [
            "Auf der Zahl bestehe ich nicht — aber die Weiterbildungszeit zähle ich als Leistung.",
            "Sofern der Vertrag die Probezeit auf drei Monate begrenzt, haben wir eine Übereinkunft.",
        ],
    },
    "d-b2-11": {
        "level": "B2",
        "titleDe": "Mieterhöhung: schriftlich verhandeln",
        "titleAr": "زيادةُ الإيجار: تفاوُضٌ خطّي",
        "lines": [
            ("Amel", "Die angekündigte Erhöhung um 15 Prozent übersteigt die ortsübliche Miete."),
            ("Hausverwaltung", "Unsere Belege: Mietspiegel und Wirtschaftlichkeitsberechnung."),
            ("Amel", "Genau der Mietspiegel besagt: Kappungsgrenze bei elf Prozent in drei Jahren."),
            ("Hausverwaltung", "Stimmt — Ihr Brief errechnet korrekt; wir korrigieren auf 9,8 Prozent."),
            ("Amel", "Zusätzlich wünsche ich ein Protokoll über die Nebenkostenabrechnung."),
            ("Hausverwaltung", "Das Protokoll folgt binnen vierzehn Tagen samt Belegen."),
            ("Amel", "Sofern alles eintrifft, akzeptiere ich den neuen Betrag zum Ersten."),
            ("Hausverwaltung", "Per Mail bestätigt — danke für die sachliche Gesprächsführung."),
        ],
        "questions": [
            ("mc", "auf den Mietspiegel und die Kappungsgrenze",
             ["auf die Wirtschaftlichkeitsberechnung der Verwaltung", "auf die Nebenkostenabrechnung",
              "auf den Mietspiegel und die Kappungsgrenze"]),
            ("mc", "eine korrigierte Forderung von 9,8 Prozent plus Protokoll",
             ["eine korrigierte Forderung von 9,8 Prozent plus Protokoll",
              "eine Erhöhung um 15 Prozent", "eine Erhöhung um elf Prozent"]),
            ("mc", "wenn Protokoll und Belege eingetroffen sind",
             ["sofort nach dem Gespräch", "wenn Protokoll und Belege eingetroffen sind",
              "nach vierzehn Tagen, ohne Bedingung"]),
        ],
        "dictation": [
            "Zusätzlich wünsche ich ein Protokoll über die Nebenkostenabrechnung.",
            "Stimmt — Ihr Brief errechnet korrekt; wir korrigieren auf 9,8 Prozent.",
        ],
    },
    "d-b2-12": {
        "level": "B2",
        "titleDe": "Anerkennung des ausländischen Abschlusses",
        "titleAr": "اعترافٌ بالشهادةِ الأجنبية",
        "lines": [
            ("Mehdi", "Mein tunesisches Ingenieurdiplom soll anerkannt werden — welche Dokumente?"),
            ("Sachbearbeiterin", "Beglaubigte Übersetzung, Fächerübersicht, Nachweis praktischer Tätigkeiten."),
            ("Mehdi", "Wie lange dauert die Prüfung, und kann ich währenddessen arbeiten?"),
            ("Sachbearbeiterin", "Regulär drei Monate; mit Ihrer Berufserlaubnis im Warteverfahren — ja, eingeschränkt."),
            ("Mehdi", "Und wenn die Gleichwertigkeit teilweise verneint wird?"),
            ("Sachbearbeiterin", "Dann bekommen Sie einen Anpassungslehrgang zugewiesen, höchstens 16 Monate Praxis."),
            ("Mehdi", "Die Gebühren sind mir unklar — wer trägt sie bei Erfolg?"),
            ("Sachbearbeiterin", "400 Euro Vorauszahlung; die Erstattung richtet sich nach dem Landrecht."),
        ],
        "questions": [
            ("mc", "beglaubigte Übersetzung, Fächerübersicht und Praxisnachweis",
             ["nur das tunesische Ingenieurdiplom", "eine Berufserlaubnis aus Tunesien",
              "beglaubigte Übersetzung, Fächerübersicht und Praxisnachweis"]),
            ("mc", "eingeschränkt, mit Berufserlaubnis",
             ["eingeschränkt, mit Berufserlaubnis", "ja, regulär ab dem dritten Monat",
              "erst nach dem Anpassungslehrgang"]),
            ("mc", "höchstens 16 Monate",
             ["drei Monate", "höchstens 16 Monate", "16 Wochen Praxis"]),
        ],
        "dictation": [
            "Dann bekommen Sie einen Anpassungslehrgang zugewiesen, höchstens 16 Monate Praxis.",
            "Regulär drei Monate; mit Ihrer Berufserlaubnis im Warteverfahren — ja, eingeschränkt.",
        ],
    },
}

CORRECTIONS = {
    "d-b2-10": {
        0: {
            "old": "شكراً على وقتك — وظيفتُكم تهمُّني للغاية.",
            "ar": "شكراً على وقتكم — وظيفتُكم تهمُّني للغاية.",
        },
        1: {
            "old": "وكذلك. ما الذي تُقَدِّمُه لنفسك أجرياً؟",
            "ar": "وكذلك. وما الأجرُ الذي يخطرُ ببالكم؟",
        },
        2: {
            "old": "في ضوءِ خبرتي، أقولُ 48.000 يورو إجماليّاً (ثمانيةً وأربعين ألفاً).",
            "ar": "في ضوءِ خبرتي، أبلغُ 48.000 يورو إجماليّاً (ثمانيةً وأربعين ألفاً).",
        },
        3: {
            "old": "هذا يفوقُ هامشَنا؛ خمسةٌ وأربعون ألفاً زائدُ المتغيرِ قابلٌ للنقاش.",
            "ar": "هذا يفوقُ نطاقَنا؛ خمسةٌ وأربعون ألفاً زائدُ حصةٍ متغيّرةٍ قابلٌ للتفاوض.",
        },
        4: {
            "old": "لستُ مُصمِّماً على الرقم — لكني أَعُدُّ وقتَ تدريبي إيراداً غيرَ مباشر.",
            "ar": "لستُ مُصمِّماً على الرقم — لكني أَعُدُّ وقتَ تدريبي أداءً.",
        },
        6: {
            "old": "بشرطِ أن تُقَصَّرَ التجربةُ إلى ثلاثةِ أشهر، نكونُ قد اتفقنا.",
            "ar": "بشرطِ ألّا تتجاوزَ فترةُ التجربةِ في العقدِ ثلاثةَ أشهر، نكونُ قد اتفقنا.",
        },
        7: {
            "old": "تمّ — ستصلُك نسخةُ العقدِ خطياً غدًا صباحاً.",
            "ar": "تمّ — سيصلُكم التعهدُ خطياً غدًا صباحاً.",
        },
    },
    "d-b2-11": {
        1: {
            "old": "حججُنا: مؤشّرُ الإيجاراتِ ودراسةُ الجدوى الاقتصادية.",
            "ar": "أدلتُنا: مؤشّرُ الإيجاراتِ وحسابُ الجدوى الاقتصادية.",
        },
        3: {
            "old": "صحيح — حسابُ رسالتك سليم؛ فنُصحِّحُ إلى تسعةٍ فاصلةَ ثمانية بالمئة.",
            "ar": "صحيح — حسابُ رسالتكم سليم؛ فنُصحِّحُ إلى تسعةٍ فاصلةَ ثمانية بالمئة.",
        },
        5: {
            "old": "يُرسلُ المحضرُ خلالَ أسبوعَين مع الفواتير.",
            "ar": "يُرسلُ المحضرُ خلالَ أربعةَ عشرَ يوماً مع الأدلة.",
        },
        7: {
            "old": "وصلَ التأكيدُ بالبريد — شكرًا على منهجيةِ النقاش.",
            "ar": "مؤكَّدٌ بالبريد — شكرًا على إدارةِ النقاشِ بموضوعيةٍ.",
        },
    },
    "d-b2-12": {
        1: {
            "old": "ترجمةٌ مُصدَّق عليها، وقائمةُ مواد، وإثباتُ سنواتِ الخبرةِ العملية.",
            "ar": "ترجمةٌ مُصدَّق عليها، وقائمةُ الموادِّ الدراسية، وإثباتُ الخبرةِ العملية.",
        },
        2: {
            "old": "كم تستغرقُ اللجان، وهل يحقُّ لي العملُ بين الأيادي؟",
            "ar": "كم يستغرقُ فحصُ الطلب، وهل يحقُّ لي العملُ خلاله؟",
        },
        3: {
            "old": "ثلاثةُ أشهر نظاماً؛ وبإذنِ مهنتك في وضعِ الانتظار — عملٌ مقيَّدٌ نعم.",
            "ar": "ثلاثةُ أشهر نظاماً؛ وبإذنِ مزاولةِ المهنة في وضعِ الانتظار — نعم، عملٌ مقيَّد.",
        },
        5: {
            "old": "يُسنَدُ إليك دوراتٌ تكييفية، أقصاها ستةَ عشرَ شهراً عمليةً موجَّهة.",
            "ar": "يُسنَدُ إليكم دورةٌ تكييفية، أقصاها ستةَ عشرَ شهراً من الممارسةِ العملية.",
        },
        7: {
            "old": "400 يورو مقدَّماً؛ والاستردادُ بحسبِ قانونِ الولاية.",
            "ar": "400 يورو دفعةً مقدَّمة؛ والاستردادُ بحسبِ قانونِ الولاية.",
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
    print("<R126> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
