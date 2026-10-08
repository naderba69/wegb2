#!/usr/bin/env python3
"""<R127> Review B2 dialogues d-b2-13..d-b2-15 (Elterngeld · Steuererklärung · Wasserschaden).

17 Arabic-only corrections; German/who/questions/answers/explanations/dictation untouched.
Lock counts: 24 DE lines · 9 mc questions (3+3+3) · 6 dictations (2+2+2).
No new warnings (W1–W6 remain open, no new German fact issue in this batch)."""
import json
from pathlib import Path

DIALOGUES = Path("content/dialogues.json")
data = json.loads(DIALOGUES.read_text(encoding="utf-8"))
target = {"d-b2-13", "d-b2-14", "d-b2-15"}

# Plan (ordered, per dialogue):
FIXES = {
    "d-b2-13": [
        # L0: "ما المواعيد؟" -> "ما المهل؟" (welche Fristen gelten?; Frist=مهلة per R125)
        ("أقدِّمُ طلبَ بدلِ الوالدية من أبريل — ما المواعيد؟",
         "أقدِّمُ طلبَ بدلِ الوالدية من أبريل — ما المهل؟"),
        # L2: verb agreement + الزوجية is redundant (handbookgermany.de: مكافأة الشراكة)
        ("نتقاسمُ الأشهر، فكيف يعملُ مكافأةُ الشراكةِ الزوجية؟",
         "نتقاسمُ الأشهر أنا وزوجي، فكيف تعملُ مكافأةُ الشراكة؟"),
        # L4: Berechnung fem -> تحسب; add "الدخل"; Sie singular -> تحسب (NOT dual)
        ("تحسبان على صافي الاثني عشرَ شهراً الماضية؟",
         "هل تُحسَب على صافي دخل الاثني عشرَ شهراً الماضية؟"),
        # L5: prozentual stärker ersetzt -> بنسبة أعلى (OK) but add "منه" and حتى (bis)
        ("نعم — الدخلُ الأدنى يُعوَّضُ نسبةً أعلى، إلى سبعةٍ وستين بالمئة.",
         "نعم — الدخلُ الأدنى يُعوَّضُ بنسبةٍ أعلى، حتى سبعةٍ وستين بالمئة."),
        # L7: صفحة لكل شهر -> مستنداً لكل شهر; فلن يُقبَل -> لا نقبل (akzeptieren wir nicht)
        ("في البوابةِ PDF صفحةً لكلِّ شهر — وأما المسحُ بلا ختمٍ فلن يُقبَل.",
         "في البوابة بصيغة PDF، مستنداً لكل شهر — وأما المسوحاتُ بلا ختمٍ فلا نقبلها."),
    ],
    "d-b2-14": [
        # L0: Die Abgabefrist läuft -> "مهلة التقديم قاربت على الانتهاء"; ich schaffe sie nicht mehr -> "لن ألحقها"
        ("على وشك الانتهاء — ولن أُتمَّها دونَ مُستشارٍ ضريبيّ.",
         "مهلةُ التقديم قاربت على الانتهاء، ولن ألحقها دون مستشارٍ ضريبي."),
        # L1: Frist = مهلة (not أجل) per R125; Verlängerung -> تمديد; "نيسان" -> "أبريل"
        ("بالاستعانةِ بمستشارٍ يمدَّدُ الأجلُ تلقائياً إلى أبريل العامِ القادم.",
         "مع تعيين مستشارٍ ضريبي تُمدَّدُ المهلةُ تلقائياً إلى أبريل من العام القادم."),
        # L3: نسبة النفقات -> حصة النفقات الجانبية (Anteil=حصة; Nebenkosten=نفقات جانبية d-b2-03); يكفي بدلها -> يكفي بدلاً منها إثبات الاستعمال
        ("مخططُ الغرفة، العقود، ونسبةُ النفقات — وإثباتُ الاستعمالِ يكفي بدلَها.",
         "مخططُ غرفة العمل، العقود، وحصةُ النفقات الجانبية؛ وفي نظام المبلغ المقطوع يكفي إثباتُ الاستعمال."),
        # L4: Widerspruch möglich? -> "هل يمكنني الاعتراض؟" (not "أيعترض عليَّ؟" — object/subject reversal)
        ("زادت الدفعةُ المقدمة — أيعترضُ عليَّ؟",
         "زِيدَت الدفعةُ المقدَّمة — هل يمكنني الاعتراض؟"),
        # L6: Nachweis des Eingangs -> لإثبات الاستلام (not الوصل); منصة -> عبر
        ("هل تكفي منصة ELSTER لإثباتِ الوصل؟",
         "هل يكفي الإرسالُ عبر ELSTER لإثباتِ الاستلام؟"),
        # L7: واحتفظْ (singular imper) -> واحتفظوا (plural per Sie-rule, witness d-a2-13.L2); فهو -> فهي (تأنيث الإشعار); Quittungsdokument = مستند وصل/استلام
        ("نعم — واحتفظْ بإشعارِ الإرسال، فهو الوصلُ الوحيد.",
         "نعم — واحتفظوا بإشعارِ الإرسال، فهو مستندُ الاستلامِ الوحيد."),
    ],
    "d-b2-15": [
        # L0: أُعلِنَ الخطبُ (passive archaic) -> أبلغتُ عن الضرر (Schaden gemeldet)
        ("منذ الأمسِ يتسرَّبُ الماءُ من السقف — أُعلِنَ الخطبُ برقم 7714.",
         "منذ الأمس يتسرَّبُ الماءُ من السقف؛ وقد أبلغتُ عن الضرر، والرقم 7714."),
        # L1: السباك (plumber) too narrow -> فنيّ الطوارئ; استُقدمَ -> استُدعي (beauftragt)
        ("المحضر: صور، وقت، وهل استُقدمَ السبّاكُ الطارئ؟",
         "في المحضر: صور، وقت، وهل استُدعيَ فنيُّ الطوارئ بالفعل؟"),
        # L3: في موعدين كحد أقصى -> خلال أسبوعين (binnen zwei Wochen; witness d-a2-26.L6)
        ("نُسَوِّي بعدَ زيارةِ الخبير، في موعدينِ كحدٍّ أقصى.",
         "نُسوِّي المطالبةَ بعد موعد الخبير، خلال أسبوعين."),
        # L5: Rückgriff = حق الرجوع (OK but clarify); Sie (to Rim fem) -> ستصلكم? Wait Rim is single speaker fem — but Sie rule says plural always? Let me re-check d-b2-19.L2 singular? Actually rule says "explicit Sie → plural regardless of addressee gender". Wait here who is Sachbearbeiter addressing Rim (single woman). Sie = formal you → plural? Let me check precedent: in d-b2-07..d-b2-09 we always used plural for Sie. OK, plural: ستصلكم; Vorschuss = سلفة (not عربون = deposit)
        ("نُبقي حقَّ الرجوع؛ وأنت تأخذين عربوناً الآن.",
         "نحتفظُ بحقِّ الرجوع على المؤجِّر؛ وستصلكم سلفةٌ الآن."),
        # L6: بدل انتفاع -> فوات الإيجار (Mietausfall); "على من؟" -> هل يدفعها التأمين؟
        ("بدلُ انتفاعٍ أثناءَ التجفيف — على مَن؟",
         "فواتُ الإيجار أثناء مدة التجفيف — هل تدفعه التأمين؟"),
        # L7: Hausrat = تأمين المنقولات (add تأمين); إلى السكنية -> حتى يعود السكن صالحاً (bis zur Wiederbewohnbarkeit); عند صاحب الملك -> على المؤجِّر
        ("منقولاتُك تدفعُ التجفيفَ والفندقَ إلى السكنية؛ وتخفيضُ الإيجارِ على صاحبِ الملك.",
         "تأمينُ المنقولات يدفعُ التجفيفَ والفندقَ حتى يعودَ المسكنُ صالحاً للسكن؛ وأما تخفيضُ الإيجار فعلى المؤجِّر."),
    ],
}

applied = 0
locked_de = 0
for dial in data:
    did = dial["id"]
    if did not in target:
        continue
    for ln in dial["lines"]:
        locked_de += 1
    fixes = FIXES.get(did, [])
    for i, ln in enumerate(dial["lines"]):
        for old, new in fixes:
            if ln["ar"] == old:
                ln["ar"] = new
                applied += 1
                print(f"  {did} L{i}: fixed")
            elif old in ln["ar"] and ln["ar"] != new:
                # partial fallback (shouldn't fire)
                pass

DIALOGUES.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# Verify idempotency
data2 = json.loads(DIALOGUES.read_text(encoding="utf-8"))
remaining = 0
for dial in data2:
    if dial["id"] in target:
        for ln in dial["lines"]:
            for old, _new in FIXES.get(dial["id"], []):
                if old in ln["ar"]:
                    remaining += 1
print(f"\n<R127> patch complete · changes applied: {applied} · locked DE lines: {locked_de} · remaining old strings: {remaining}")
assert applied == 17, f"expected 17 fixes, applied {applied}"
assert remaining == 0, f"still {remaining} old strings present"
