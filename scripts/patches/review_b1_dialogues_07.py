#!/usr/bin/env python3
"""R120 — review patch for seventh B1 batch d-b1-22..d-b1-24.

Scope: 3 dialogues (Beschwerde im Restaurant, Studienberatung: Stundenplan,
Fundstelle auf dem Revier).
Structure: 8+8+8 = 24 lines; 3+3+3 = 9 questions; 2+2+2 = 6 dictations; no waisen.
Approx units: 4 metadata + 24 lines ×3 + 9 questions (multi-field) + 6 dictations ≈ 153.

Confirmed Arabic corrections (explicit Sie agreement, meaning accuracy, gender/register,
and removing invented additions):

d-b1-22 (Restaurant — the waiter uses explicit Sie: L1 "Sie haben recht", L2 "korrigieren Sie"):
  L1 ar: "أُراجِعُ النظام… لكِ الحق، إنها الطاولةُ المجاورة."
      → "أُراجِعُ النظام… لكم الحق — الصنفُ يخصُّ الطاولةَ المجاورة."
    ((أ) "Sie haben recht" رسمي صريح (ويؤكده L2 "Bitte korrigieren Sie") → «لكم» جمعاً
     لا «لكِ» مفرداً. (ب) "das ging an den Nebentisch" فاعلُه الصنفُ لا الطاولة؛ «إنها
     الطاولة المجاورة» تُسند الحكم إلى الطاولة بدل البند، وشرح Q1 نفسه يقول «الطاولة
     المجاورة صاحبة الماء».)
  L2 ar: "أصلِحوا المجموعَ من فضلكم قبلَ الدفع."
      → "أصلِحوا المبلغَ من فضلكم قبلَ الدفع."
    ("Betrag" = المبلغ وهو ما يستعمله شرح Q3 («المبلغ الخاطئ»)؛ «المجموع» حاصلُ الجمع
     لا المبلغ المطالَب به.)
  L5 ar: "الحلوى من حسابِ الدار، والمطبخُ أُبلِغَ رسمياً."
      → "الحلوى من حسابِ الدار، والمطبخُ أُبلِغَ داخلياً."
    ("intern gemeldet" = أُبلِغَ داخلياً؛ «رسمياً» = officially وهي عكس المعنى تماماً،
     فالتنبيه إجراء داخلي لا رسمي.)
  L6 ar: "بالإنصافِ نعودُ غداً — شكراً."
      → "بالإنصافِ نعودُ — شكراً."
    ("Mit Fairness kommt man wieder" لا يذكر موعداً؛ «غداً» إضافة غير موجودة في الألماني.)
  L7 ar: "وإلى اللقاء، وسهرةً طيبة!"
      → "وإلى اللقاء، وليلةً سعيدة!"
    ("gute Nacht" تحيةُ ليلٍ عند الوداع = ليلة سعيدة؛ «سهرة طيبة» تعني أمسيةً ممتعة
     (schönen Abend) لا تصبح-على-خير.)

d-b1-23 (Studienberatung — the advisor uses Sie with student Maha):
  L0 ar: "أُعيدُ صياغةَ جدولٍ ضاقَ عن موعدين."
      → "عليَّ إعادةُ ترتيبِ جدولِ المحاضرات: المحاضرةُ مقابلَ التدريبِ العمليّ."
    ((أ) "Stundenplan umbauen" = إعادة ترتيب/بناء الجدول لا «إعادة صياغة» نصّية. (ب)
     «ضاقَ عن موعدين» اختراعٌ لا مقابل له في الألماني؛ والنص يسمّي التعارض صراحةً:
     "Vorlesung gegen Praktikum" وهو مفتاح Q0.)
  L1 ar: "ما ساعاتُ تدريبِكِ العمليّ؟"
      → "متى يقعُ تدريبُكِ العمليُّ؟"
    ("Wann liegt das Praktikum?" سؤالٌ عن وقت التدريب لا عن عدد الساعات، وجوابُ مها
     نفسه زمنيّ: «يومياً من الثامنة إلى الثانية عشرة».)
  L3 ar: "محاضرتُك تُنزَّلُ مسجَّلة — فنحوِّلُك إلى القسمِ باء."
      → "المحاضرةُ متوفّرةٌ كتسجيلٍ — وسنسجِّلُك في الدورةِ باء."
    ((أ) "gibt es als Aufzeichnung" = متوفّرة كتسجيل لا «تُنزَّلُ» (تنزيل/تحميل). (ب)
     "wir buchen Kurs B" = نسجّلك في الدورة (وشرح Q0 يقول «Kurs B والتسجيل هما الحلّ»)،
     لا «نحوِّلُك إلى القسم» نقلٌ إداري؛ و«القسم» ليست "Kurs" والملف يترجمها «دورة»
     في d-b1-10 وd-b1-27.)
  L4 ar: "أالمنشأةُ معترفٌ بتدريبِها عندكم؟"
      → "وهل يجبُ على الجامعةِ أن تعترفَ بالتدريبِ العمليّ؟"
    ((أ) "die Uni" = الجامعة لا «المنشأة» (التي تقابل Firma في L5–L6) — انقلابُ فاعل.
     (ب) "Muss die Uni das Praktikum anerkennen?" = هل يجب على الجامعة أن تعترف/تحتسب
     التدريب؛ والصياغة القديمة مبنية للمجهول وبمعنى اعتماد المنشأة عند «كم».)
  L5 ar: "نعم: رسالةُ اعتمادٍ بالمواعيد، وحدُّها ثلاثونَ ساعةً أسبوعياً."
      → "نعم: تأكيدٌ من الشركةِ بالمواعيد، بحدٍّ أقصى ثلاثونَ ساعةً أسبوعياً."
    ((أ) "Bestätigung" = تأكيد (وهو ما يستعمله شرح Q2: «التأكيد بالأوقات هو الأصل
     المفقود») لا «رسالة اعتماد». (ب) "der Firma" تسقط في الصياغة القديمة، والملف
     يترجم Firma بـ«الشركة» (d-b1-01، d-a2-13، d-b2-09).)
  L6 ar: "وإن لم تُصدِرِ المنشأةُ كتاباً؟"
      → "وإن لم تُصدِرِ الشركةُ خطاباً؟"
    ((أ) Firma = الشركة على اتساق الملف، وهو الاتساق نفسه بين L5 وL6. (ب) "Schreiben"
     = خطاب/رسالة؛ «كتاباً» تعني book في الاستعمال الحديث فتلتبس.)
  L7 ar: "بريدُ المديرةِ بموضوعٍ وساعاتٍ يكفيه غيرُ مُختم."
      → "بريدُ المديرةِ الإلكترونيُّ — بلا صيغةٍ رسمية، لكن خطّيّ — يكفي."
    ((أ) "formlos" = بلا صيغة/شكل مفروض لا «غيرُ مُختم». (ب) «بموضوعٍ وساعاتٍ» مضمونٌ
     مخترع لا يذكره الألماني. (ج) «يكفيه» ركيكة، والفاعل البريد → «يكفي». (د)
     "schriftlich" يلزم إبرازها لأنها فخّ Q2 («يجب أن يكون schriftlich»).)

d-b1-24 (Revier — the officer uses explicit Sie: L7 "kommen Sie pünktlich"):
  L0 ar: "أمسَ أضعتُ في الحافلةِ حقيبةً وفيها حاسوبي."
      → "أمسِ مساءً أضعتُ في الحافلةِ حقيبةَ الحاسوبِ."
    ((أ) "Gestern Abend" = أمس مساءً؛ «مساءً» كانت مُسقطة. (ب) «وفيها حاسوبي» تفصيلٌ
     غير موجود في الألماني (Laptoptasche فقط) فحُذف.)
  L1 ar: "الرقمُ والمحطة — بدقّةٍ رجاءً."
      → "الخطُّ والمحطة — بدقّةٍ، رجاءً."
    ("Linie" = الخط لا «الرقم»؛ وL2 نفسه يقول «الخطُّ ستةٌ وعشرون» فالتعارض داخلي،
     والملف يترجمها «الخط» في d-a1-06.)
  L3 ar: "وِجادةٌ أُبلِغَ عنها العشرينُ والعشرون، فوافقَها وصفُك."
      → "معثورٌ عليه أُبلِغَ عنه الساعةَ الثامنةَ وعشرينَ دقيقةً مساءً — والوصفُ مطابق."
    ((أ) "Ein Fund" = غرضٌ معثور عليه (لقطة)؛ «وِجادة» ليست مصطلحاً مألوفاً للمعثورات.
     (ب) "gemeldet um zwanzig zwanzig" = 20:20 → الساعة الثامنة وعشرين دقيقة مساءً على
     نمط d-a2-09 (14:30 = الثانية والنصف بعد الظهر)؛ و«العشرينُ والعشرون» ليست تعبيراً
     صحيحاً عن وقت. (ج) "Beschreibung passt" = الوصف مطابق؛ و«فوافقَها وصفُك» ركيكة
     وتضيف ضمير «ك» غير موجود.)
  L5 ar: "التاسعة: الهويّةُ وإثباتُ ملكية: فاتورةٌ أو صور."
      → "من التاسعة — الهويّةُ وإثباتُ الملكية: فاتورةٌ أو صور."
    ((أ) "Ab neun" = من التاسعة (بداية الاستلام) لا «التاسعة» وحدها؛ وشرح Q2 يقول
     «الفخّ 1: التاسعة بداية الاستلام». (ب) «إثباتُ الملكية» بتعريف أدقّ.)
  L6 ar: "سأجيءُ بالفاتورةِ ولقطاتٍ من حاسوبي."
      → "سأجيءُ بالفاتورةِ ولقطاتٍ للجهاز."
    ("Screenshots des Geräts" = لقطاتٌ للجهاز؛ «من حاسوبي» تضميرٌ مخترع ولا تنقل
     "des Geräts". واللقطات شكلٌ من إثبات الملكية يقبله مكتب المفقودات (freiburg.de).)
  L7 ar: "أسبوعانِ في خزانتِنا ثم مزاد — فلتأتِ باكراً."
      → "أربعةَ عشرَ يوماً للحفظ، ثم مخزنُ المزادِ — فلتحضروا في الموعد."
    ((أ) "Vierzehn Tage" = أربعة عشر يوماً (والرقم فخّ Q2) على اتساق d-a1-15/d-a2-26/
     d-a2-31 وd-b1-21 المصحَّح في R119. (ب) «خزانتِنا» تفصيلٌ مخترع، و"Aufbewahrung"
     = حفظ. (ج) "Versteigerungslager" = مخزن المزاد لا «مزاد» وحدها. (د) "kommen Sie
     pünktlich" صيغة Sie صريحة → «فلتحضروا» على نمط d-b1-06 («Bitte kommen Sie
     pünktlich» → «حضروا في الموعد»)؛ و"pünktlich" = في الموعد لا «باكراً».)

ملاحظة تحذير محتوى (لا تُعدَّل الألمانية/الأسئلة/الإملاءات): «Vierzehn Tage
Aufbewahrung, dann Versteigerungslager» يخالف §§ 973/979 BGB (حفظ لا يقلّ عن ستة
أشهر قبل التملّك/البيع العلني) إن قُرئ حدّاً للاسترداد؛ يُسجَّل W2 في التقرير مع
القراءة البديلة (نقلٌ داخلي إلى مخزن المزاد ثم استمرار المهلة القانونية).
الترقيع في هذه الدفعة عربيٌّ فقط.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

CORRECTIONS: dict[str, dict[int, dict[str, str]]] = {
    "d-b1-22": {
        1: {"ar": "أُراجِعُ النظام… لكم الحق — الصنفُ يخصُّ الطاولةَ المجاورة."},
        2: {"ar": "أصلِحوا المبلغَ من فضلكم قبلَ الدفع."},
        5: {"ar": "الحلوى من حسابِ الدار، والمطبخُ أُبلِغَ داخلياً."},
        6: {"ar": "بالإنصافِ نعودُ — شكراً."},
        7: {"ar": "وإلى اللقاء، وليلةً سعيدة!"},
    },
    "d-b1-23": {
        0: {"ar": "عليَّ إعادةُ ترتيبِ جدولِ المحاضرات: المحاضرةُ مقابلَ التدريبِ العمليّ."},
        1: {"ar": "متى يقعُ تدريبُكِ العمليُّ؟"},
        3: {"ar": "المحاضرةُ متوفّرةٌ كتسجيلٍ — وسنسجِّلُك في الدورةِ باء."},
        4: {"ar": "وهل يجبُ على الجامعةِ أن تعترفَ بالتدريبِ العمليّ؟"},
        5: {"ar": "نعم: تأكيدٌ من الشركةِ بالمواعيد، بحدٍّ أقصى ثلاثونَ ساعةً أسبوعياً."},
        6: {"ar": "وإن لم تُصدِرِ الشركةُ خطاباً؟"},
        7: {"ar": "بريدُ المديرةِ الإلكترونيُّ — بلا صيغةٍ رسمية، لكن خطّيّ — يكفي."},
    },
    "d-b1-24": {
        0: {"ar": "أمسِ مساءً أضعتُ في الحافلةِ حقيبةَ الحاسوبِ."},
        1: {"ar": "الخطُّ والمحطة — بدقّةٍ، رجاءً."},
        3: {"ar": "غرضٌ معثورٌ عليه أُبلِغَ عنه الساعةَ الثامنةَ وعشرينَ دقيقةً مساءً — والوصفُ مطابق."},
        5: {"ar": "من التاسعة — الهويّةُ وإثباتُ الملكية: فاتورةٌ أو صور."},
        6: {"ar": "سأجيءُ بالفاتورةِ ولقطاتٍ للجهاز."},
        7: {"ar": "أربعةَ عشرَ يوماً للحفظ، ثم مخزنُ المزادِ — فلتحضروا في الموعد."},
    },
}

EXPECTED: dict[str, dict] = {
    "d-b1-22": {
        "level": "B1", "titleDe": "Beschwerde im Restaurant", "titleAr": "اعتراضٌ في المطعم",
        "lines": [
            ("Leila", "Auf der Rechnung steht Mineralwasser — wir haben nichts bestellt."),
            ("Ober",  "Ich prüfe das System … Sie haben recht — das ging an den Nebentisch."),
            ("Leila", "Bitte korrigieren Sie den Betrag vor dem Bezahlen."),
            ("Ober",  "Zwölf Euro weniger: sechsundzwanzig statt achtunddreißig."),
            ("Leila", "Außerdem kam die Hauptspeise kalt."),
            ("Ober",  "Das Dessert geht aufs Haus — Küche ist intern gemeldet."),
            ("Leila", "Mit Fairness kommt man wieder — danke."),
            ("Ober",  "Bis zum nächsten Besuch, gute Nacht!"),
        ],
        "questions": [
            ("mc", "das Mineralwasser"),
            ("mc", "mit einem Dessert aufs Haus"),
            ("mc", "sechsundzwanzig Euro"),
        ],
        "dictation": [
            "Zwölf Euro weniger: sechsundzwanzig statt achtunddreißig.",
            "Das Dessert geht aufs Haus — Küche ist intern gemeldet.",
        ],
    },
    "d-b1-23": {
        "level": "B1", "titleDe": "Studienberatung: Stundenplan", "titleAr": "الإرشادُ الجامعي: جدولُ المحاضرات",
        "lines": [
            ("Maha",      "Ich muss den Stundenplan umbauen: Vorlesung gegen Praktikum."),
            ("Beraterin", "Wann liegt das Praktikum?"),
            ("Maha",      "Täglich acht bis zwölf — Fabrik im Industriegebiet."),
            ("Beraterin", "Die Vorlesung gibt es als Aufzeichnung; wir buchen Kurs B."),
            ("Maha",      "Muss die Uni das Praktikum anerkennen?"),
            ("Beraterin", "Ja: Bestätigung der Firma mit Zeiten, maximal dreißig Wochenstunden."),
            ("Maha",      "Und wenn die Firma kein Schreiben ausstellt?"),
            ("Beraterin", "Eine E-Mail der Chefin — formlos, aber schriftlich — genügt."),
        ],
        "questions": [
            ("mc", "die Vorlesung und das Praktikum"),
            ("mc", "dreißig Wochenstunden"),
            ("mc", "eine formlose E-Mail der Chefin"),
        ],
        "dictation": [
            "Ja: Bestätigung der Firma mit Zeiten, maximal dreißig Wochenstunden.",
            "Eine E-Mail der Chefin — formlos, aber schriftlich — genügt.",
        ],
    },
    "d-b1-24": {
        "level": "B1", "titleDe": "Fundstelle auf dem Revier", "titleAr": "مكتبُ المفقوداتِ في القسم",
        "lines": [
            ("Wassim",   "Gestern Abend verlor ich im Bus die Laptoptasche."),
            ("Polizist", "Linie und Haltestelle — genau, bitte."),
            ("Wassim",   "Linie sechsundzwanzig, Endhaltestelle, Sitz hinten links."),
            ("Polizist", "Ein Fund, gemeldet um zwanzig zwanzig — Beschreibung passt."),
            ("Wassim",   "Wann kann ich abholen?"),
            ("Polizist", "Ab neun — Ausweis und Eigentumsnachweis: Rechnung oder Fotos."),
            ("Wassim",   "Ich bringe Rechnung und Screenshots des Geräts."),
            ("Polizist", "Vierzehn Tage Aufbewahrung, dann Versteigerungslager — kommen Sie pünktlich."),
        ],
        "questions": [
            ("mc", "Verlust im Bus"),
            ("mc", "Ausweis und Eigentumsnachweis"),
            ("mc", "vierzehn Tage"),
        ],
        "dictation": [
            "Ein Fund, gemeldet um zwanzig zwanzig — Beschreibung passt.",
            "Vierzehn Tage Aufbewahrung, dann Versteigerungslager — kommen Sie pünktlich.",
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
    print("<R120> patch complete")
    print(f"  changes applied: {len(r['changes'])}")
    for c in r["changes"]:
        print(f"    - {c['unit']}: {c['old']!r} -> {c['new']!r}")
    print(f"  locked DE lines: {r['locked']['linesDE']}")
    print(f"  locked questions: {r['locked']['questions']}")
    print(f"  locked dictations: {r['locked']['dictations']}")


if __name__ == "__main__":
    main()
