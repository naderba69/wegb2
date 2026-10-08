#!/usr/bin/env python3
"""<R128> Review B2 dialogues d-b2-16..d-b2-18 (VHS-Kurstausch · Arbeitgeber/Weiterbildung · Kündigung Krankenkasse).

19 Arabic-only corrections; German/who/questions/answers/explanations/dictation untouched.
Lock counts: 24 DE lines · 9 mc questions (3+3+3) · 6 dictations (2+2+2).
No new warnings (W1–W6 remain open)."""
import json
from pathlib import Path

DIALOGUES = Path("content/dialogues.json")
data = json.loads(DIALOGUES.read_text(encoding="utf-8"))
target = {"d-b2-16", "d-b2-17", "d-b2-18"}

FIXES = {
    "d-b2-16": [
        # L0: kollidiert mit = يتعارض مع (witness d-b1-19.L4)؛ gegen einen Tausch wäre offen? = هل أنتم منفتحون على التبديل؟
        ("موعدُ السبتِ يتصادمُ مع مناوبتي — أيجوزُ تبديلٌ؟",
         "موعدُ السبت يتعارض مع مناوبتي — هل أنتم منفتحون على تبديل؟"),
        # L1: Umbuchung kostet 15 Euro = إعادة الحجز تكلّف 15 يورو
        ("مقاعدُ شاغرةٌ في مجموعةِ الخميسِ من الساعة 18؛ والتحويلُ بـ15 يورو.",
         "أماكن شاغرة في مجموعة الخميس من الساعة 18؛ وإعادةُ الحجز تكلّف 15 يورو."),
        # L2: Füllen der Warteliste = ملء قائمة الانتظار؛ erlassen = إعفاء من الرسم
        ("إن أعنتُ في استكمالِ قائمةِ الانتظار — فتتنازلون عنِ الرسم؟",
         "إن ساعدتُ في ملء قائمة الانتظار — أتعفونني من الرسم؟"),
        # L3: "bleibt heilig" = غير قابل للإسقاط (تعبير إداري)؛ Tausch ohne Gebühr = تبديل بلا رسم
        ("منصف — بلا رسوم، لكنَّ إلزامَ الحضورِ يبقى مقدَّسًا.",
         "منصف — إذن تبديل بلا رسم، لكنّ إلزامَ الحضور يظلّ غيرَ قابل للإسقاط."),
        # L5: Das Zertifikat setzt 80% voraus = تتطلب الشهادة حضور ثمانين بالمئة على الأقل
        ("يشترطُ الختامُ ثمانينَ بالمئةِ حضورًا لا أقلّ.",
         "تتطلّب الشهادةُ حضورَ ثمانينَ بالمئة على الأقلّ."),
    ],
    "d-b2-17": [
        # L0: trägt die Firma einen Teil? = هل تتحمّل الشركة جزءاً؟ (تصحيح همزة "أيتحمّل")
        ("دوراتُ الاعتمادِ بـ2.400 يورو — أيتحمَّلُ المصنعُ جزءاً؟",
         "دوراتُ الاعتماد بـ2.400 يورو — هل تتحمَّل الشركةُ جزءاً؟"),
        # L1: Bei Branchennähe ja = نعم إن كانت ذات صلة بالمجال؛ Rückzahlungsklausel = شرط استرداد
        ("لصلتها بمجالنا — بنُدَّ عنك إن انتقلتَ قبلَ أربعةَ وعشرين شهراً.",
         "نعم، إن كانت ذات صلةٍ بمجال عملنا؛ ويوجد شرطُ استردادٍ إن تركتَ الشركة قبل أربعة وعشرين شهراً."),
        # L3: Zwei Tage pro Monat frei gegen Bindung an ein Jahr = يومان شهرياً إجازة مقابل التزام بسنة
        ("يومانِ شهريّاً بإجازةٍ مدفوعةٍ مقابلَ ارتباطِ سنةٍ كاملة.",
         "يومانِ شهرياً إجازةً مدفوعةً مقابل التزامٍ بسنة تدريب."),
        # L4: Elterngeld … Aussetzen? = تعليق/إيقاف الاستحقاق بدلاً من «مجمدة» (مجمّدة مجمدة)
        ("وإن أخذتُ بدلَ الوالدية أثناءَ الدورة — نُبقيها مجمَّدة؟",
         "وإن أخذتُ بدلَ الوالدية أثناء الدورة — هل يُوقَف الاستحقاق؟"),
        # L5: nicht die Kosten = لا التكاليف (لا نمدّد التسديد/الكلفة)؛ Bindung um die Pause = نمدد الالتزام بمدة التوقف
        ("يتوقفُ الاستحقاق؛ نُطيلُ الارتباطَ بمقدارِ الغيابِ لا المال.",
         "يتوقّف الاستحقاق؛ نُمدّد فترة الالتزام بمدة التوقف، لا التكاليف."),
        # L6: schriftliche Vereinbarung über beides = اتفاق خطي يغطي كلا الأمرين
        ("اتفاقٌ خطيٌّ للاثنين، وحينئذٍ أسجِّلُ اسمي.",
         "اتفاقٌ خطيّ يغطّي كلا الأمرَين، وعندها أسجّل نفسي."),
        # L7: Sie → ستصلكم؛ Zusatzstunden = الساعات الإضافية؛ Personalbüro = قسم شؤون الأفراد
        ("غداً في قسمِ الأفراد، وستُدرَجُ الساعاتُ الإضافيةُ في عقدك.",
         "غداً في قسم شؤون الأفراد، وستصلكم الأوراق بعد إدراج الساعات الإضافية في عقدكم."),
    ],
    "d-b2-18": [
        # L1: Frist läuft = المهلة سارية/جارية (ليست الميعاد جار)؛ reicht die Kündigung digital ein = تتولى تقديم طلب الإنهاء رقميًا
        ("الميعادُ جارٍ؛ وصندوقُك الجديدُ يتولّى الإبلاغَ رقمياً.",
         "المهلةُ لا تزال سارية؛ والصندوق الجديد يتولّى تقديمَ طلبِ الإنهاء رقميّاً."),
        # L2: Bonusheft = دفتر نقاط المكافآت (Bonusprogramm der Krankenkasse) أو "دفتر المكافآت" يكفي
        ("ماذا يحدثُ لدفترِ المكافآتِ والأدويةِ المزمنة؟",
         "ماذا يحدث لدفترِ نقاطِ المكافآت وأدوية الأمراض المزمنة؟"),
        # L3: Medikamente laufen über die el. Verordnung = تُصرف عبر الوصفة الإلكترونية دون انقطاع (لا تنتقل)
        ("يبقى الدفترُ سارياً، والأدويةُ تنتقلُ دونَ انقطاعٍ عبرَ الوصفةِ الإلكترونية.",
         "يبقى الدفترُ سارياً، وتُصرفُ الأدويةُ دون انقطاع عبر الوصفة الإلكترونية."),
        # L4: Lückenlos versichert = بلا فجوة تأمينية/التغطية متواصلة
        ("تغطيةٌ متواصلة — أأذهبُ للطبيبِ في شهرِ العبور؟",
         "التغطيةُ بلا فجوات — هل أستطيع زيارة الطبيب في شهر الانتقال؟"),
        # L5: Versicherungsschutz = التغطية التأمينية
        ("نعم — تظلُّ الحمايةُ ساريةً إلى آخرِ يومٍ من العقد.",
         "نعم — التغطيةُ التأمينية تظلُّ سارية حتى آخر يوم من العقد."),
        # L6: Beitragsanteile des Arbeitgebers = حصة صاحب العمل من الاشتراكات؛ wer rechnet ab؟ = من يجري التسوية المحاسبية؟
        ("وحصةُ صاحبِ العملِ من الاشتراكات — مَن يُسَوِّيها؟",
         "أما حصة صاحب العمل من الاشتراكات فمن يجري تسويتَها محاسبياً؟"),
        # L7: Buchhaltung beider Kassen unter sich = محاسبا الصندوقين تتساوى الأمر بينهما / تتساوى الحسابات بينهما (لا يتصالح)؛ Sammelbescheinigung = شهادة إجمالية موحّدة (حسناً)؛ Sie → ستصلكم
        ("يتصالحُ محاسبو الصندوقَين بينهما، وتصلُك شهادةٌ إجماليةٌ موحَّدة.",
         "يقوم محاسبا الصندوقين بتسوية الحسابات فيما بينهما، وستصلكم شهادةٌ إجمالية."),
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
    for i, ln in enumerate(dial["lines"]):
        for old, new in FIXES.get(did, []):
            if ln["ar"] == old:
                ln["ar"] = new
                applied += 1
                print(f"  {did} L{i}: fixed")

DIALOGUES.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

data2 = json.loads(DIALOGUES.read_text(encoding="utf-8"))
remaining = 0
for dial in data2:
    if dial["id"] in target:
        for ln in dial["lines"]:
            for old, _ in FIXES.get(dial["id"], []):
                if old in ln["ar"]:
                    remaining += 1
print(f"\n<R128> patch complete · changes applied: {applied} · locked DE lines: {locked_de} · remaining old strings: {remaining}")
assert applied in (19, 0), f"expected 19 fixes (or 0 when already patched), applied {applied}"
assert remaining == 0, f"still {remaining} old strings present"
