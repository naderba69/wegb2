#!/usr/bin/env python3
"""R118 — review patch for fifth B1 batch d-b1-16..d-b1-18.

Scope: 3 dialogues (Am Bahnschalter: Verspätung, Elternabend in der Schule,
Lärm mit den Nachbarn klären).
Structure: 8+8+7 = 23 lines; 3+3+3 = 9 questions; 2+2+2 = 6 dictations; no waisen.
Approx units: 4 metadata + 23 lines ×3 + 9 questions (multi-field) + 6 dictations ≈ 150.

Confirmed Arabic corrections (formal-Sie agreement, meaning accuracy, removing
invented additions that are absent from the German, and removing one free rendering):

d-b1-16 (Bahnschalter: Schaffnerin Weiß uses formal Sie with Amir — L5 "bewahren Sie"):
  L1 ar: "بخمسينَ لك خمسةَ عشرَ بالمئةِ من الثمن." → "عند خمسين دقيقة يحقّ لكم خمسةَ عشرَ بالمئةِ من الثمن."
    ("stehen Ihnen … zu" = يحقّ لكم: the fragment «بخمسينَ لك» is neither a
     conditional nor an entitlement phrase, and «Ihnen» is formal Sie → plural
     «لكم» in Arabic, not singular «لك».)
  L3 ar: "عبِّئْ نموذجَ «استردادِ المال» على الشبكة، والعِوَضُ ينزلُ حسابَك."
      → "عبِّئوا نموذجَ «استرداد المال» على الشبكة، والعِوَضُ ينزلُ حسابَكم."
    (formal imperative "ausfüllen" → «عبِّئوا» and "aufs Konto" addressed to Amir
     with Sie → «حسابَكم», not singular «حسابَك».)
  L5 ar: "نسخةٌ تكفي، واحتفظْ بالأصل." → "نسخةٌ تكفي، واحتفظوا بالأصل."
    ("bewahren Sie das Original auf" = formal imperative → plural «احتفظوا».)
  L6 ar: "وقد فاتني القطارُ الموالي لهذا السبب!" → "وأُلغي القطارُ الموالي أيضاً!"
    ("Der Anschlusszug fiel auch aus" = the connecting train was cancelled
     (ausfallen), not "I missed it" (verpassen/entgehen); the Arabic also dropped
     «auch» = أيضاً and invented «لهذا السبب» (for this reason). The key/explanations
     already say الإلغاء: Q3 «kein Anspruch, weil der Anschlusszug ausfiel».)
  L7 ar: "يسري إذنِ التالي بلا زيادةٍ في الثمن — دوَّناه في النظام."
      → "يسري إذن القطارُ التالي بلا زيادةٍ في الثمن — دوَّناه."
    ("der nächste Zug" names the train, so «القطار» is restored to the vague
     «التالي»، and «في النظام» is an addition absent from "wir haben es vermerkt"
     (we noted it) — removed.)

d-b1-17 (Elternabend — Lehrerin Kern uses formal Sie):
  L2 ar: "وبعضُ الآباءِ يقرؤون مع الأطفالَ أسبوعياً."
      → "ويمكن للآباء أيضاً المساعدة في القراءة بصوتٍ عالٍ."
    ("Eltern können auch beim Vorlesen helfen" = parents can also help with
     reading aloud; the Arabic turned it into a factual claim about «بعض الآباء»
     (some parents) and invented «أسبوعياً» (weekly), while dropping the modal
     «können … helfen» (can help). Q1 explanation already calls it
     «القراءة بصوت عالٍ اقتراح المعلّمة».)
  L4 ar: "وحفلُ الختامِ نجعلُه مجموعةَ عملٍ يومَ الجمعة."
      → "وحفلُ الختامِ فنُخطِّطُ له في مجموعةِ عملٍ يومَ الجمعة."
    ("planen wir als Arbeitsgruppe" = we plan (in) a working group — «نجعلُه»
     (we make it) reverses the meaning: the celebration does not become a working
     group, the working group does the planning on Friday.)
  L7 ar: "الرسالةُ تُرسَل، وهم يُسجِّلون أطفالَ الأداءِ عندهم."
      → "الدعوةُ تُرسَل، وهي تُسجِّل أطفالَها المشاركين في العرضِ."
    ("Die Einladung" = الدعوة (invitation), not «الرسالة» (letter); «sie» is the
     feminine singular Partnerschule → «هي»، و«عندهم» is an addition absent from
     the German; «Auftrittskinder» is clarified as «أطفالها المشاركين في العرض»
     (children who take part in the performance).)

d-b1-18 (Nachbarn — both sides use formal Sie: L3 "dass Sie sprechen", L5 "klopfen Sie"):
  L0 ar: "أمسَ بعدَ منتصفِ الليل علتِ الأصوات، ونظامُ البنايةِ يعرفُ سكوناً."
      → "أمسَ بعد منتصفِ الليل علتِ الأصوات، وتنصُّ لائحةُ البنايةِ على أوقاتِ السكون."
    ("die Hausordnung kennt Ruhezeiten" = the house rules stipulate quiet hours;
     «يعرفُ سكوناً» translated "kennt" literally and turned the plural
     «Ruhezeiten» (أوقات) into a singular «سكوناً». Q2's key confirms 22:00.)
  L1 ar: "كان بثَّ مباراةِ أخي عبرَ مكبِّرٍ صوتيّ." → "كان بثُّ أخي مضخَّماً بصوتٍ عالٍ."
    («مباراة» (a match) is invented — the German says only "die Übertragung meines
     Bruders"; "laut verstärkt" is «مضخَّماً بصوتٍ عالٍ», and «laut» was dropped in
     the old rendering.)
  L3 ar: "عذراً — أحسنتَ بالكلامِ بدلَ الشكاة. لن تعودَ المباراةُ المنقولة."
      → "عذراً — أحسنتم بالكلامِ بدلَ التوبيخ. وسيظلُّ البثُّ متوقفاً من الآن فصاعداً."
    ((أ) "dass Sie sprechen" is formal Sie → plural «أحسنتم»، not singular «أحسنتَ».
     (ب) "schelten" = tadeln/Vorwürfe machen (Duden/DWDS) = توبيخ، not «الشكاة»
     (complaining). (ج) «المباراة» is again invented for "die Übertragung"، and
     "bleibt künftig aus" (stays off from now on) was rendered as «لن تعودَ»
     — corrected to «وسيظلُّ البثُّ متوقفاً من الآن فصاعداً».)
  L4 ar: "وإن نزلَ ضيوف، فأُنذِرُك قبلَها بعشرينَ دقيقة."
      → "وإن نزلَ ضيوف، أُخبِرُكم قبلَ وصولهم بعشرينَ دقيقة."
    ((أ) "Bescheid sagen" = inform/notify → «أُخبِرُكم»، not «أُنذِرُك» (warn), and
     Frau Dittrich addresses Oussama with formal Sie → plural. (ب) «قبلَها» had no
     antecedent (Arabic feminine); "zwanzig Minuten vorher" = twenty minutes before
     the guests arrive → «قبلَ وصولهم».)
  L5 ar: "وإن تسرَّبَ منّا لحنٌ، فقَرِعَ مرّةً — نُخفِّضُه حالاً."
      → "وإن تسرَّبت منّا موسيقى عبرَ الجدار، فاطرقوا مرّةً — نُخفِّضُها حالاً."
    ((أ) "Musik" = موسيقى، not «لحن» (a tune); Q0's explanation already says
     «الموسيقى احتمال مستقبلي». (ب) "klopfen Sie einmal" is a formal imperative →
     «فاطرقوا»، not the 3rd-person past «فقَرِعَ» (so he knocked). (ج) «عبرَ الجدار»
     restores "durch die Wand" and makes the knocking refer to the shared wall.)
  L6 ar: "عَهدٌ مُتفَق — الدرجَ والصمتَ نتقاسمهما." → "اتّفقنا — الدرجَ والهدوءَ نتقاسمهما."
    («عَهدٌ مُتفَق» is an unnatural calque of the one-word "Abgemacht" (اتفقنا/تمّ
     الاتفاق)، and "Ruhe" in house-rules context is هدوء (quiet), not «صمت» (silence).)
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-16": {
        1: {"ar": "عند خمسين دقيقة يحقّ لكم خمسةَ عشرَ بالمئةِ من الثمن."},
        3: {"ar": "عبِّئوا نموذجَ «استرداد المال» على الشبكة، والعِوَضُ ينزلُ حسابَكم."},
        5: {"ar": "نسخةٌ تكفي، واحتفظوا بالأصل."},
        6: {"ar": "وأُلغي القطارُ الموالي أيضاً!"},
        7: {"ar": "يسري إذن القطارُ التالي بلا زيادةٍ في الثمن — دوَّناه."},
    },
    "d-b1-17": {
        2: {"ar": "ويمكن للآباء أيضاً المساعدة في القراءة بصوتٍ عالٍ."},
        4: {"ar": "وحفلُ الختامِ فنُخطِّطُ له في مجموعةِ عملٍ يومَ الجمعة."},
        7: {"ar": "الدعوةُ تُرسَل، وهي تُسجِّل أطفالَها المشاركين في العرضِ."},
    },
    "d-b1-18": {
        0: {"ar": "أمسَ بعد منتصفِ الليل علتِ الأصوات، وتنصُّ لائحةُ البنايةِ على أوقاتِ السكون."},
        1: {"ar": "كان بثُّ أخي مضخَّماً بصوتٍ عالٍ."},
        3: {"ar": "عذراً — أحسنتم بالكلامِ بدلَ التوبيخ. وسيظلُّ البثُّ متوقفاً من الآن فصاعداً."},
        4: {"ar": "وإن نزلَ ضيوف، أُخبِرُكم قبلَ وصولهم بعشرينَ دقيقة."},
        5: {"ar": "وإن تسرَّبت منّا موسيقى عبرَ الجدار، فاطرقوا مرّةً — نُخفِّضُها حالاً."},
        6: {"ar": "اتّفقنا — الدرجَ والهدوءَ نتقاسمهما."},
    },
}

EXPECTED: dict[str, dict] = {
    "d-b1-16": {
        "level": "B1", "titleDe": "Am Bahnschalter: Verspätung", "titleAr": "شباكُ القطار: تأخُّر",
        "lines": [
            ("Amir",            "Mein Zug nach München hatte fünfzig Minuten Verspätung — Fahrgastrechte bitte."),
            ("Schaffnerin Weiß","Bei fünfzig Minuten stehen Ihnen fünfzehn Prozent des Preises zu."),
            ("Amir",            "Bar oder aufs Konto?"),
            ("Schaffnerin Weiß","Das Formular „Geld zurück“ online ausfüllen — die Erstattung geht aufs Konto."),
            ("Amir",            "Muss ich die Fahrkarte beilegen?"),
            ("Schaffnerin Weiß","Eine Kopie genügt — bewahren Sie das Original auf."),
            ("Amir",            "Der Anschlusszug fiel auch aus!"),
            ("Schaffnerin Weiß","Dann gilt der nächste Zug ohne Aufpreis — wir haben es vermerkt."),
        ],
        "questions": [
            ("mc", "fünfzehn Prozent des Preises"),
            ("mc", "das Onlineformular und eine Kopie der Fahrkarte"),
            ("mc", "der nächste Zug ohne Aufpreis"),
        ],
        "dictation": [
            "Dann gilt der nächste Zug ohne Aufpreis — wir haben es vermerkt.",
            "Bei fünfzig Minuten stehen Ihnen fünfzehn Prozent des Preises zu.",
        ],
    },
    "d-b1-17": {
        "level": "B1", "titleDe": "Elternabend in der Schule", "titleAr": "لقاءُ أولياءِ الأمور",
        "lines": [
            ("Lehrerin Kern", "Willkommen — wie steht es um unseren Lesetag?"),
            ("Selim",         "Die Leseecke ist fertig; für die Bibliothek fehlt ein Sponsor."),
            ("Lehrerin Kern", "Eltern können auch beim Vorlesen helfen."),
            ("Selim",         "Ich melde mich: einmal monatlich, samstags vor zehn."),
            ("Lehrerin Kern", "Die Abschlussfeier planen wir als Arbeitsgruppe am Freitag."),
            ("Selim",         "Freitag passt erst nach siebzehn — mein Dienst beginnt früher."),
            ("Lehrerin Kern", "Wer lädt unsere Partnerschule ein?"),
            ("Selim",         "Die Einladung geht raus; sie meldet ihre Auftrittskinder an."),
        ],
        "questions": [
            ("mc", "ein Sponsor"),
            ("mc", "einmal monatlich, samstags vor zehn"),
            ("mc", "die Abschlussfeier"),
        ],
        "dictation": [
            "Die Leseecke ist fertig; für die Bibliothek fehlt ein Sponsor.",
            "Die Einladung geht raus; sie meldet ihre Auftrittskinder an.",
        ],
    },
    "d-b1-18": {
        "level": "B1", "titleDe": "Lärm mit den Nachbarn klären", "titleAr": "فضُّ ضجيجِ الجيرة",
        "lines": [
            ("Frau Dittrich", "Gestern nach Mitternacht war es laut — die Hausordnung kennt Ruhezeiten."),
            ("Oussama",       "Das war die Übertragung meines Bruders, laut verstärkt."),
            ("Frau Dittrich", "Das bleibt einmalig — ich erwarte eine Entschuldigung, und Nachtruhe ab zweiundzwanzig."),
            ("Oussama",       "Entschuldigung — schön, dass Sie sprechen statt zu schelten. Die Übertragung bleibt künftig aus."),
            ("Frau Dittrich", "Bei Gästen sage ich Bescheid — zwanzig Minuten vorher."),
            ("Oussama",       "Dringt bei uns Musik durch die Wand, klopfen Sie einmal — wir drehen sofort leiser."),
            ("Frau Dittrich", "Abgemacht — Treppe und Ruhe teilen wir uns."),
        ],
        "questions": [
            ("mc", "die laut verstärkte Übertragung des Bruders"),
            ("mc", "um zweiundzwanzig Uhr"),
            ("mc", "Die Übertragung bleibt künftig aus."),
        ],
        "dictation": [
            "Das bleibt einmalig — ich erwarte eine Entschuldigung, und Nachtruhe ab zweiundzwanzig.",
            "Bei Gästen sage ich Bescheid — zwanzig Minuten vorher.",
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
        for idx, patch in CORRECTIONS[did].items():
            ln = dlg["lines"][idx]
            if ln["ar"] != patch["ar"]:
                changes.append({"unit": f"{did}.lines[{idx}].ar", "old": ln["ar"], "new": patch["ar"]})
                ln["ar"] = patch["ar"]
    D_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"changes": changes, "locked": locked}


def main() -> None:
    r = apply_patch()
    print("<R118> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
