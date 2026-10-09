#!/usr/bin/env python3
"""R116 — review patch for third B1 batch d-b1-10..d-b1-12.

Scope: 3 dialogues (Anmeldung Sprachkurs, Wohnung besichtigen, Kinderarzt-Termin).
Structure: 8+8+9 = 25 lines; 3+3+3 = 9 questions; 2+2+2 = 6 dictations; no waisen.
Approx units: 3 metadata + 25 lines ×3 (who/de/ar) + 9 questions (each with id/type/
promptDe/answer + options/explanationAr/promptAr on most) + 6 dictations ≈ 140.

Confirmed Arabic corrections:
1. d-b1-10.lines[0].ar: German "Guten Tag" → Arabic "طاب يومكم" / "نهاركم سعيد",
   not "مساءُ الخير" (good evening). Reference: d-b1-06 opens "Guten Tag" → "طاب يومكم",
   d-b1-09 "Guten Abend" → "مساء الخير". The dialogue continues with "Donnerstag um neun"
   (9 AM test) consistent with daytime, not evening.
2. d-b1-10.lines[1].ar: "Haben Sie …" addresses Frau Weber (formal Sie), must be plural
   "هل أجريتم" not feminine singular "هل أجريتِ" (which would be du-form).
   Matches the project convention (d-b1-02, d-b1-06, d-b1-07 Ärztin, d-b1-09 Rezeption).
3. d-b1-11.lines[0].ar: Added "في الصور" is not present in German "die Anzeige klang
   vielversprechend". Removed the addition to avoid adding content:
   → "شكراً على الموعد — كانَ الإعلانُ واعداً." (kept "كان" for tense though German
   is simple past; this is MSA stylistic, not an error).
4. d-b1-11.lines[1].ar: "البوق" in Arabic means trumpet/horn; kitchen stove (der Herd)
   is "الموقد". Corrected to "الموقدُ والحوضُ والخزائنُ تبقى." (Per deutale.com and
   Almaany: Herd = موقد/فرن; "بوق" is wrong here.)

d-b1-12 Kinderarzt:
5. d-b1-12.lines[3].ar: "تشبه عدوى فيروسية، لا بكتيرية" is extra — German says only
   "Das sieht nach einer Virusinfektion aus" (no mention of "nicht bakteriell").
   Removed the extra clause: → "افتح فمَك رجاءً … يبدو أنَّها عدوى فيروسية."
6. d-b1-12.lines[5].ar: Arzt uses formal Sie with Karim (Elternteil); plural imperative
   needed. "فحتى" → "فإلى" (bis zwei Tage nach = حتى/إلى يومين بعد) and plural "يدخلونها"
   → "لا يدخلها" for "darf er nicht hin" (darf = لا يجوز/يُسمح له بالذهاب). The parent is
   the one who may not bring the child. Correction: → "نعم — لا يجوز له الذهاب حتى
   يومين بعد آخر ارتفاع في الحرارة." (matches Goethe/BAMF phrasing "darf nicht in die Kita").
7. d-b1-12.lines[7].ar: "خافِضوا الحرارة، أكثِروا السوائل، وراقِبوا" correctly uses
   plural imperative for Sie — confirmed correct (mirrors prior corrections).

All German text, who names, questions (prompts/answers/options/explanations), and
dictation strings are locked unchanged.

Style/context notes (NOT errors):
- d-b1-10.lines[2].ar "لمّا" is MSA/Levantine-tinged for "not yet"; full فصحى would be
  "ليس بعدُ" but "لمّا" exists in MSA (Quranic and modern) meaning "not yet"; kept.
- d-b1-10.lines[3].ar "لم تُناسِبْك المجموعة" is singular for du-form but "Sie" (formal)
  would be plural "تناسبكم". However context: the doctor/speaker Yara is talking to
  Frau Weber with Sie — but "sonst passt die Gruppe nicht" is impersonal "the group
  won't fit"; no direct pronoun for "you" — let me re-check: "passt die Gruppe nicht"
  = the group doesn't suit (her); Arabic "تُناسِبْك" singular suffix -ka implies "you
  (m.sg.)" — Frau Weber is female, so suffix should be -ki ("تناسبكِ") OR formal plural
  "تناسبكم". Wait: "sonst passt die Gruppe nicht" is generic ("the group won't be a
  good fit") — no explicit Sie on that verb. But surrounding speech is Sie-level.
  The Arabic used singular -k (you m.s.), and the patient is female ("Frau"). This
  is a pronoun/gender error. Add correction #3? Actually index 3 is L3 which is Yara
  to Frau Weber (Sie). The suffix -ك in "تناسبك" is masculine singular; should be
  either feminine singular -كِ (for du-form, but Yara uses Sie) or plural -كم (formal).
  Since d-b1-10 L7 uses "Nur Pass und Meldebescheinigung" → "جواز السفر وإثبات السكن
  فحسب" — that line has no second-person verb, can't confirm Sie/du. Check L1 which
  I am already fixing to plural "أجريتم" (Sie). After fixing L1 to plural, keep L3
  consistent → plural "تناسبكم".
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-10": {
        0: {"ar": "طابَ يومُكم، أريدُ التسجيلَ في دورةِ الألمانية."},  # Guten Tag (not Guten Abend)
        1: {"ar": "بكلِّ سرور. هل أجريتُم اختبارَ تحديدِ المستوى بعدُ؟"},  # Sie → plural
        3: {"ar": "نعم، وإلا لم تناسبكم المجموعة. الاختبارُ الخميسَ الساعةَ التاسعةَ صباحاً."},  # Sie-plural + um neun = الساعة التاسعة
    },
    "d-b1-11": {
        0: {"ar": "شكراً على الموعد — كانَ الإعلانُ واعداً."},  # remove "في الصور" (not in DE)
        1: {"ar": "بسرور. المطبخُ مؤثَّث: الموقدُ والحوضُ والخزائنُ تبقى."},  # البوق → الموقد (Herd)
    },
    "d-b1-12": {
        3: {"ar": "افتح فمَك رجاءً … يبدو أنَّها عدوى فيروسية."},  # remove extra "لا بكتيرية" (not in DE)
        5: {"ar": "نعم — لا يجوز له الذهابُ حتى يومينِ بعدَ آخرِ ارتفاعٍ في الحرارة."},  # fحتى→لا يجوز+حتى; fix "فحتى" → proper darf-nicht + bis
    },
}

EXPECTED: dict[str, dict] = {
    "d-b1-10": {
        "level": "B1", "titleDe": "Anmeldung im Sprachkurs", "titleAr": "التسجيل في دورة الألمانية",
        "lines": [
            ("Frau Weber", "Guten Tag, ich möchte mich für den Deutschkurs anmelden."),
            ("Yara",       "Sehr gern. Haben Sie den Einstufungstest schon gemacht?"),
            ("Frau Weber", "Noch nicht — ist das Pflicht?"),
            ("Yara",       "Ja, sonst passt die Gruppe nicht. Der Test ist Donnerstag um neun."),
            ("Frau Weber", "Was kostet der Kurs pro Monat?"),
            ("Yara",       "Dreiundachtzig Euro — die Prüfung ist inklusive."),
            ("Frau Weber", "Brauche ich einen Nachweis über meinen Aufenthalt?"),
            ("Yara",       "Nur Pass und Meldebescheinigung. Bis Donnerstag!"),
        ],
        "questions": [
            ("mc", "ein Einstufungstest"),
            ("mc", "83 Euro"),
            ("mc", "Pass und Meldebescheinigung"),
        ],
        "dictation": [
            "Ja, sonst passt die Gruppe nicht. Der Test ist Donnerstag um neun.",
            "Nur Pass und Meldebescheinigung. Bis Donnerstag!",
        ],
    },
    "d-b1-11": {
        "level": "B1", "titleDe": "Eine Wohnung besichtigen", "titleAr": "معاينةُ شقّة",
        "lines": [
            ("Frau Bähr", "Danke für den Termin — die Anzeige klang vielversprechend."),
            ("Nadia",     "Gern. Die Küche ist möbliert: Herd, Spüle und Schränke bleiben."),
            ("Frau Bähr", "Sind Wasser und Heizung in der Miete enthalten?"),
            ("Nadia",     "Nein — Kaltmiete vierhundertfünfzig, Nebenkosten kommen dazu."),
            ("Frau Bähr", "Die Wohnung wäre perfekt — wann wird sie frei?"),
            ("Nadia",     "Zum Ersten. Ich brauche Selbstauskunft und Schufa."),
            ("Frau Bähr", "Die Unterlagen kommen bis morgen per Mail — und die Kaution?"),
            ("Nadia",     "Zwei Monatsmieten, wie immer. Herzlich willkommen, wenn alles passt."),
        ],
        "questions": [
            ("mc", "Herd, Spüle und Schränke"),
            ("mc", "die Nebenkosten"),
            ("mc", "zwei Monatsmieten"),
        ],
        "dictation": [
            "Nein — Kaltmiete vierhundertfünfzig, Nebenkosten kommen dazu.",
            "Zwei Monatsmieten, wie immer. Herzlich willkommen, wenn alles passt.",
        ],
    },
    "d-b1-12": {
        "level": "B1", "titleDe": "Ein Termin beim Kinderarzt", "titleAr": "موعدُ طبيبِ الأطفال",
        "lines": [
            ("Karim",     "Mein Sohn hat seit gestern Fieber und einen Ausschlag."),
            ("Dr. Sommer","Seit wann genau, und hat er Ungewohntes gegessen?"),
            ("Karim",     "Seit gestern Abend — und nein, wir sind da sehr vorsichtig."),
            ("Dr. Sommer","Mund auf, bitte … Das sieht nach einer Virusinfektion aus."),
            ("Karim",     "Ist das ansteckend für die Kita?"),
            ("Dr. Sommer","Ja — bis zwei Tage nach dem letzten Fieber darf er nicht hin."),
            ("Karim",     "Soll ich ein Antibiotikum geben?"),
            ("Dr. Sommer","Nein, bei Viren wirkt es nicht. Fieber senken, viel trinken, beobachten."),
            ("Karim",     "Wenn der Ausschlag bleibt — soll ich dann sofort wieder kommen?"),
        ],
        "questions": [
            ("mc", "Fieber und einen Ausschlag"),
            ("mc", "nein, erst zwei Tage nach dem letzten Fieber"),
            ("mc", "weil es bei Viren nicht wirkt"),
        ],
        "dictation": [
            "Ja — bis zwei Tage nach dem letzten Fieber darf er nicht hin.",
            "Nein, bei Viren wirkt es nicht. Fieber senken, viel trinken, beobachten.",
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
        assert len(dlg["lines"]) == len(exp["lines"])
        assert len(dlg["questions"]) == len(exp["questions"])
        assert len(dlg.get("dictation") or []) == len(exp["dictation"])
        for i, (who, de) in enumerate(exp["lines"]):
            ln = dlg["lines"][i]
            assert ln["who"] == who, f"{did}.L{i} who: {ln['who']!r} vs {who!r}"
            assert ln["de"] == de, f"{did}.L{i} de"
            locked["linesDE"] += 1
        for i, (qtype, ans) in enumerate(exp["questions"]):
            q = dlg["questions"][i]
            assert q["type"] == qtype and q["answer"] == ans, f"{did}.q{i}"
            locked["questions"] += 1
        for i, s in enumerate(exp["dictation"]):
            assert dlg["dictation"][i] == s, f"{did}.dict[{i}]"
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
    print("<R116> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
