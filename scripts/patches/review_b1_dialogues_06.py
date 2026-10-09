#!/usr/bin/env python3
"""R119 — review patch for sixth B1 batch d-b1-19..d-b1-21.

Scope: 3 dialogues (Termin bei der Ausländerbehörde verschieben, Apotheke: Notdienst,
Studiovertrag kündigen).
Structure: 8+8+8 = 24 lines; 3+3+3 = 9 questions; 2+2+2 = 6 dictations; no waisen.
Approx units: 4 metadata + 24 lines ×3 + 9 questions (multi-field) + 6 dictations ≈ 153.

Confirmed Arabic corrections (register agreement with explicit Sie, meaning accuracy,
gender agreement, wrong numbers omitted/mistranslated, and invented additions):

d-b1-19 (Ausländerbehörde — the German is impersonal; no Sie/du pronouns appear):
  L0 ar: "موعدي الجمعةَ يتصادمُ مع امتحاني — أبعدَه شهراً؟"
      → "موعدي يومَ الجمعةِ يتعارضُ مع امتحاني — هل يمكنُ تأجيلُه شهراً؟"
    ("ein Monat später?" is a request/question about a postponement; «أبعدَه» is not a
     standard Arabic form for postponing (تأجيل), and «يتصادم» (collide) is replaced by
     the established «يتعارض» for clashing appointments.)
  L1 ar: "التأجيلُ خطّيٌّ فقط، والهاتِ دليلَ العذر."
      → "التأجيلُ خطّيٌّ فقط، مع إثباتِ السبب."
    ((أ) «الهاتِ» imperative addresses a female (Amira) in the masculine form — the
     German sentence is impersonal ("den Grund bitte nachweisen") and carries no
     address at all. (ب) «Grund» = السبب، not «العذر» (excuse); «nachweisen» = إثبات.)
  L2 ar: "تفضَّلي إشعارَ امتحانِ الجامعةِ مطبوعاً."
      → "هذا إشعارُ تسجيلِ امتحانِ الجامعةِ."
    ((أ) «تفضَّلي» is a feminine imperative addressing Hedi, who is male in the project
     data (content/vocab.json: «Hedi kümmert sich um seinen Vater…»). (ب) «Hier ist …»
     = هذا … (تقديم) لا أمرٌ بالتقديم. (ج) «مطبوعاً» (printed) is an addition absent
     from the German; «Prüfungsanmeldung» = إشعار تسجيل الامتحان.)
  L3 ar: "الجديد: أولَ الشهرِ التالي، الثانيةَ عشرةَ والنصف — وبهذه الرسالةِ يدخلُ صاحبُها."
      → "الموعدُ الجديد: أولَ الشهرِ التالي، الساعةَ الثانيةَ والنصفَ بعدَ الظهر — وبهذه الرسالةِ يدخلُ صاحبُها."
    ((أ) «الجديد:» بترٌ لعنوان «Neuer Termin:» → «الموعدُ الجديد:». (ب) «vierzehn Uhr
     dreißig» = الثانية والنصف بعد الظهر، وليست «الثانية عشرة والنصف»؛ والملف نفسه يتبع
     هذا في d-a2-09: «Um vierzehn Uhr dreißig» → «الساعة الثانية والنصف بعد الظهر».)
  L4 ar: "أأُعيدُ كلَّ الوثائق؟"
      → "أأُحضرُ الوثائقَ كلَّها مرةً أخرى؟"
    ("Die Unterlagen wieder in voller Zahl?" = إحضار الوثائق كلها مرة أخرى؛ و«أُعيد»
     يحمل معنى الإرجاع/التكرار من المتكلم لا الإحضار الجديد، و«in voller Zahl» = العدد
     الكامل.)
  L5 ar: "جوازٌ وإقامةٌ وعقدُ إيجارٍ وتأمين — كما في الزيارةِ الأولى."
      → "جوازُ سفرٍ وتصريحُ إقامةٍ وعقدُ إيجارٍ وإثباتُ تأمينٍ — كما في المرةِ الأولى."
    ((أ) «Aufenthaltstitel» مصطلح إداري = تصريح الإقامة، لا «إقامة» مجرّدة. (ب)
     «Versicherungsnachweis» = إثباتُ تأمين (Nachweis = إثبات/مستند إثبات) لا «تأمين»
     وحده. (ج) «beim ersten Mal» = المرة الأولى لا «الزيارة الأولى».)

d-b1-20 (Apotheke — Firas addresses Frau Seidl with Sie: L1 "Was benötigen Sie?"):
  L0 ar: "أنوبتُكم الليلة؟ طبيبُ الأطفالِ وجَّهني إليكم."
      → "هل تقدّمون خدمةَ الطوارئِ الليلة؟ طبيبُ الأطفالِ وجَّهني إليكم."
    («Ist heute Nacht Notdienst?» سؤال عن وجود مناوبة/خدمة طوارئ الليلة؛ و«أنوبتُكم»
     صياغة غير سليمة (لا فعل «أنابَ» بهذا المعنى). السؤال الرسمي يبقى جمعاً مع Sie.)
  L1 ar: "نعم — حتى الثامنةِ فجراً. ما مطلوبُك؟"
      → "نعم — حتى الثامنةِ صباحاً. ماذا تحتاجون؟"
    ((أ) «acht Uhr früh» = الثامنة صباحاً؛ «فجراً» تعني وقت الفجر لا الثامنة، وشرح Q0
     نفسه يقول «المناوبة تنتهي في الثامنة صباحاً». (ب) «Was benötigen Sie?» يحمل ضمير
     Sie صراحةً → «تحتاجون» جمع، و«ما مطلوبُك» صياغة ملتبسة تعني «ما المطلوب منك».)
  L2 ar: "خافِضُ حرارةٍ لعاشرةِ أعوامٍ — بلا وصفة؟"
      → "خافضُ حرارةٍ لطفلةٍ في العاشرةِ من عمرها — بلا وصفة؟"
    (die Kleine في L7 مؤنثة، فالطفلة بنت: «لعاشرة أعوام» توحي بامرأة عشرينية لا بطفلة
     في العاشرة.)
  L3 ar: "ثمانيةٌ ونصفٌ باليورو — واقرأ نشرةَ العبوةِ بدقة."
      → "ثمانيةٌ وخمسون يورو — مع قراءةِ النشرةِ الداخليةِ بعناية، من فضلك."
    ((أ) حُذف الرقم كلّياً: «acht Euro fünfzig» = ثمانية وخمسون يورو. (ب) «die Beilage»
     في الصيدلية = النشرة الداخلية (Beipackzettel) لا «نشرة العبوة». (ج) الأمر «واقرأ»
     مذكر والمخاطَبة Frau Seidl مؤنثة، والألماني غير شخصي (durchlesen) → صيغة محايدة.)
  L6 ar: "أَأُتمُّ وصفةَ الطفلِ غداً؟"
      → "هل يمكنني إحضارُ وصفةِ الطفلِ غداً؟"
    («bringen» = إحضار؛ و«أُتمُّ الوصفة» تعني استكمالها لا إحضارها، فيختلط المعنى مع
     جواب الصيدلي «Rezepte gelten bundesweit».)
  L7 ar: "وصفاتُ الأطباءِ نافذةٌ في البلادِ كلها — وفي الصغيرِ عافية."
      → "وصفاتُ الأطباءِ نافذةٌ في البلادِ كلها — وألفُ عافيةٍ للصغيرة!"
    ((أ) «die Kleine» مؤنثة (الطفلة) لا «الصغير» مذكراً. (ب) «gute Besserung» دعاء
     شفاء، وأُبقيت الصيغة نفسها المستعملة في الملف (d-b1-14: «ألف عافية»).)

d-b1-21 (Studio — the German has no Sie/du pronouns; Arabic keeps the polite plural):
  L1 ar: "ستةُ أسابيع خطيّاً كما وردَ في العقد."
      → "المهلةُ ستةُ أسابيع، والإنهاءُ خطّيٌّ — كما في العقد."
    ((أ) «Die Frist beträgt …» جملة اسمية كاملة: «المهلة ستة أسابيع»؛ الصياغة القديمة
     ناقصة المبتدأ. (ب) «schriftlich» صفة للإنهاء (Schriftform بحسب Q0) لا حال للزمن،
     و«siehe Vertrag» = كما في العقد لا «كما ورد في العقد» بالمعنى الغائم.)
  L2 ar: "اتصلتُ قبلَ أسبوعَين، ولم تصلني بطاقةُ تأكيد."
      → "اتصلتُ قبلَ أسبوعَين، ولم يصلني أيُّ تأكيدٍ."
    («keine Bestätigung kam» = لم يصل أيُّ تأكيد؛ «بطاقة تأكيد» (a confirmation card)
     إضافة غير موجودة في الألماني.)
  L3 ar: "الهاتفُ وحدَه لا يُعتَدّ. أختمُ بريدَك بالاستلامِ ختماً."
      → "الاتصالُ الهاتفيُّ وحدَه لا يكفي — لا بدَّ أن يكونَ خطّيّاً، وعندها يُعتَدُّ به."
    ((أ) «Telefon allein genügt nicht» = لا يكفي، لا «لا يُعتَدّ» المجرّدة. (ب)
     «schriftlich muss es vorliegen, dann zählt es» = لا بد أن يكون مُقدَّماً خطيّاً
     عندها يُعتَدّ به؛ وجملة «أختمُ بريدَك بالاستلام ختماً» مشهد ختم عند الاستقبال
     غير موجود في الألماني إطلاقاً فحُذف.)
  L4 ar: "ولم خصمتم بعدُ وقد أعلمت؟"
      → "ولماذا خصمتم المبلغَ مسبقاً وقد أنهيتُ العقدَ؟"
    ((أ) الاستفهام بـ«لم» يستوجب مضارعاً مجزوماً («لم خصمتم» خطأ نحوي) → «ولماذا
     خصمتم». (ب) «Warum wurde schon abgebucht» = لماذا خُصم/خُصمتم المبلغ مسبقاً؛
     «بعدُ» تعني «حتى الآن» في النفي لا «schon». (ج) «obwohl ich kündigte» = وقد
     أنهيتُ العقد (وليس «أعلمت» العامّة).)
  L5 ar: "نوقفُ بانتهاءِ المدة، والمُدفَعُ فوقَها يُعادُ إليك."
      → "نوقفُ الخصمَ عندَ انتهاءِ المهلة، وما دُفِعَ زيادةً يُرَدُّ."
    ((أ) «mit Fristablauf» = عند انتهاء المهلة، وبقيت «المهلة» موحّدة مع L1 بدل «المدة».
     (ب) الألماني غير شخصي (wird erstattet) فحُوّل إلى «يُرَدُّ» بلا ضمير مخاطبة مفرد
     «إليك»، لأن الحوار لا يحمل أي مؤشر Sie/du. (ج) «zu viel Gezahltes» = ما دُفع
     زيادةً لا «المُدفَع فوقها».)
  L7 ar: "خمسةَ عشرَ تُرَدُّ خلالَ أسبوعَين من التسليم."
      → "خمسةَ عشرَ يورو تُرَدُّ خلالَ أربعةَ عشرَ يوماً من التسليم."
    ((أ) «Fünfzehn Euro» نصّ صريح على العملة فتُذكر «يورو» (كما فُعل في d-b1-15).
     (ب) «vierzehn Tagen» = أربعة عشر يوماً، والعدد 14 محور فخّ Q2 («vierzehn Euro»)،
     والصياغة «أسبوعَين» تُخفي الرقم المُختبَر؛ وملف المشروع يستعمل «أربعة عشر يوماً»
     في d-a1-15/d-a2-26/d-a2-31.))
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-19": {
        0: {"ar": "موعدي يومَ الجمعةِ يتعارضُ مع امتحاني — هل يمكنُ تأجيلُه شهراً؟"},
        1: {"ar": "التأجيلُ خطّيٌّ فقط، مع إثباتِ السبب."},
        2: {"ar": "هذا إشعارُ تسجيلِ امتحانِ الجامعةِ."},
        3: {"ar": "الموعدُ الجديد: أولَ الشهرِ التالي، الساعةَ الثانيةَ والنصفَ بعدَ الظهر — وبهذه الرسالةِ يدخلُ صاحبُها."},
        4: {"ar": "أأُحضرُ الوثائقَ كلَّها مرةً أخرى؟"},
        5: {"ar": "جوازُ سفرٍ وتصريحُ إقامةٍ وعقدُ إيجارٍ وإثباتُ تأمينٍ — كما في المرةِ الأولى."},
    },
    "d-b1-20": {
        0: {"ar": "هل تقدّمون خدمةَ الطوارئِ الليلة؟ طبيبُ الأطفالِ وجَّهني إليكم."},
        1: {"ar": "نعم — حتى الثامنةِ صباحاً. ماذا تحتاجون؟"},
        2: {"ar": "خافضُ حرارةٍ لطفلةٍ في العاشرةِ من عمرها — بلا وصفة؟"},
        3: {"ar": "ثمانيةٌ وخمسون يورو — مع قراءةِ النشرةِ الداخليةِ بعناية، من فضلك."},
        6: {"ar": "هل يمكنني إحضارُ وصفةِ الطفلِ غداً؟"},
        7: {"ar": "وصفاتُ الأطباءِ نافذةٌ في البلادِ كلها — وألفُ عافيةٍ للصغيرة!"},
    },
    "d-b1-21": {
        1: {"ar": "المهلةُ ستةُ أسابيع، والإنهاءُ خطّيٌّ — كما في العقد."},
        2: {"ar": "اتصلتُ قبلَ أسبوعَين، ولم يصلني أيُّ تأكيدٍ."},
        3: {"ar": "الاتصالُ الهاتفيُّ وحدَه لا يكفي — لا بدَّ أن يكونَ خطّيّاً، وعندها يُعتَدُّ به."},
        4: {"ar": "ولماذا خصمتم المبلغَ مسبقاً وقد أنهيتُ العقدَ؟"},
        5: {"ar": "نوقفُ الخصمَ عندَ انتهاءِ المهلة، وما دُفِعَ زيادةً يُرَدُّ."},
        7: {"ar": "خمسةَ عشرَ يورو تُرَدُّ خلالَ أربعةَ عشرَ يوماً من التسليم."},
    },
}

EXPECTED: dict[str, dict] = {
    "d-b1-19": {
        "level": "B1", "titleDe": "Termin bei der Ausländerbehörde verschieben", "titleAr": "تأجيلُ موعدِ مكتبِ الأجانب",
        "lines": [
            ("Amira", "Mein Freitagtermin fällt mit meiner Prüfung zusammen — ein Monat später?"),
            ("Hedi",  "Verschiebungen nur schriftlich; den Grund bitte nachweisen."),
            ("Amira", "Hier ist die Prüfungsanmeldung der Universität."),
            ("Hedi",  "Neuer Termin: Erster des Folgemonats, vierzehn Uhr dreißig — nur mit diesem Brief."),
            ("Amira", "Die Unterlagen wieder in voller Zahl?"),
            ("Hedi",  "Pass, Aufenthaltstitel, Mietvertrag, Versicherungsnachweis — wie beim ersten Mal."),
            ("Amira", "Verstanden — dann bin ich sicher da; und was folgt bei zweitem Versäumnis?"),
            ("Hedi",  "Bei zweitem Versäumnis: Ablehnung, neue Gebühr."),
        ],
        "questions": [
            ("mc", "nur schriftlich mit Nachweis des Grundes"),
            ("mc", "alle Unterlagen wie beim ersten Mal"),
            ("mc", "Ablehnung und eine neue Gebühr"),
        ],
        "dictation": [
            "Verschiebungen nur schriftlich; den Grund bitte nachweisen.",
            "Bei zweitem Versäumnis: Ablehnung, neue Gebühr.",
        ],
    },
    "d-b1-20": {
        "level": "B1", "titleDe": "Apotheke: Notdienst", "titleAr": "الصيدلية: خدمةُ الطوارئ",
        "lines": [
            ("Frau Seidl", "Ist heute Nacht Notdienst? Der Kinderarzt schickte mich."),
            ("Firas",      "Ja — bis acht Uhr früh. Was benötigen Sie?"),
            ("Frau Seidl", "Ein Fiebermittel für ein zehnjähriges Kind, rezeptfrei?"),
            ("Firas",      "Acht Euro fünfzig — die Beilage genau durchlesen, bitte."),
            ("Frau Seidl", "Und etwas gegen nächtlichen Husten?"),
            ("Firas",      "Nicht kombinieren bei Kindern: nur ein Mittel zur Zeit."),
            ("Frau Seidl", "Das Rezept fürs Kind kann ich morgen bringen?"),
            ("Firas",      "Rezepte gelten bundesweit — gute Besserung für die Kleine!"),
        ],
        "questions": [
            ("mc", "bis acht Uhr früh"),
            ("mc", "nur ein Mittel zur Zeit"),
            ("mc", "Ja, Rezepte gelten bundesweit."),
        ],
        "dictation": [
            "Nicht kombinieren bei Kindern: nur ein Mittel zur Zeit.",
            "Acht Euro fünfzig — die Beilage genau durchlesen, bitte.",
        ],
    },
    "d-b1-21": {
        "level": "B1", "titleDe": "Studiovertrag kündigen", "titleAr": "فسخُ عقدِ الناديِ الرياضي",
        "lines": [
            ("Riadh",        "Ich kündige meinen Vertrag zum Monatsende."),
            ("Studioleiter", "Die Frist beträgt sechs Wochen, schriftlich — siehe Vertrag."),
            ("Riadh",        "Ich telefonierte vor zwei Wochen; keine Bestätigung kam."),
            ("Studioleiter", "Telefon allein genügt nicht — schriftlich muss es vorliegen, dann zählt es."),
            ("Riadh",        "Warum wurde schon abgebucht, obwohl ich kündigte?"),
            ("Studioleiter", "Wir stoppen mit Fristablauf — zu viel Gezahltes wird erstattet."),
            ("Riadh",        "Und meine Schlüsselkaution?"),
            ("Studioleiter", "Fünfzehn Euro zurück, binnen vierzehn Tagen nach Übergabe."),
        ],
        "questions": [
            ("mc", "Schriftform mit sechs Wochen Frist"),
            ("mc", "Sie wird erstattet."),
            ("mc", "fünfzehn Euro"),
        ],
        "dictation": [
            "Wir stoppen mit Fristablauf — zu viel Gezahltes wird erstattet.",
            "Telefon allein genügt nicht — schriftlich muss es vorliegen, dann zählt es.",
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
    print("<R119> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
