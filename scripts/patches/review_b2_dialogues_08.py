#!/usr/bin/env python3
"""R130 patch: B2 d-b2-22 (Überweisung Facharzt), d-b2-23 (Betriebsrat Überstunden), d-b2-24 (Integrationskurs Prüfung).
22 Arabic-only corrections. German/who/questions/options/explanations/dictation LOCKED.
Idempotent (0 changes on already-patched file).
"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"

FIXES = {
    "d-b2-22": [
        # L0: dauert Wochen = تستغرق أسابيع; Schmerzen lassen nicht nach = الألم لا يهدأ (لا «يرحم»)
        ("التحويلةُ إلى طبيبِ الأشعةِ تمتدُّ أسابيع — وألمي لا يرحم.",
         "التحويلةُ إلى طبيبِ الأشعةِ تستغرقُ أسابيع — والألمُ لا يهدأ."),
        # L1: stufen als akut ein = نُصنّفها حادة; Dringlichkeitscode C = رمز الاستعجال C; verkürzt Wartezeit = يُقصّر مدة الانتظار (لا «يقصم ظهر»)
        ("نُدرجُها طارئة: رمزُ C على الوصفةِ يقصُمُ ظهرَ الانتظار.",
         "نُصنِّفُها حادة: رمزُ الاستعجالِ C على التحويلةِ يُقصِّرُ الانتظار."),
        # L2: Kann ... helfen? = هل تُفيد تحويلة ثانية؟ (لا «أنجدي» العامية)
        ("أنجدي تحويلَةٌ ثانيةً إلى مستشفى آخر؟",
         "هل تُفيدُ تحويلةٌ ثانيةٌ إلى مستشفى آخر؟"),
        # L3: Parallel ja = نعم بالتوازي; Akten müssen austauschbar sein = قابلة للتبادل; mit Ihrem Einverständnis = بموافقتك (خطية موقعة زائدة)
        ("متوازياً نعم، على أن تتبادَلَ الملفاتُ بموافقتكِ الخطيةِ الموقَّعة.",
         "نعم بالتوازي، لكن يجب أن تكون الملفاتُ قابلةً للتبادل — بموافقتكِ."),
        # L4: Welche Befunde braucht der Facharzt zwingend? = ما التقارير التي يحتاجها الاختصاصي إلزامياً
        ("ما النتائجُ التي لا غنى عنها للطبيبِ المختص؟",
         "ما التقاريرُ التي يحتاجُها الاختصاصيُّ إلزامياً؟"),
        # L5: Laborwerte der Woche = تحاليل هذا الأسبوع; Voraufnahmen = صور سابقة; keine Komprimierung = دون ضغط
        ("تحاليلَ الأسبوعِ الطازجة، وصورًا صيغة DICOM غيرَ مضغوطة.",
         "تحاليلُ الأسبوع، والصورُ السابقةُ بصيغةِ DICOM دون ضغط."),
        # L6: Termin bestätigt = أُكِّد الموعد; falls es früher klappt = إن حصل موعد أبكر (لا «فرَجَ الله»)
        ("حُجِزَ الموعد — وإن فرَجَ الله قبلَه، فكيف ألغي؟",
         "أُكِّد الموعد — كيف أُلغيه إن توفَّر موعدٌ أبكرُ؟"),
        # L7: Platz wandert auf Nachrückliste = يُنقل المقعد إلى قائمة الانتظار الاحتياطية (لا «يقفز الصف»)
        ("مكالمةٌ واحدة — فيقفزُ الصفُّ إلى قائمةِ المُستخلفين حالاً.",
         "مكالمةٌ واحدة تكفي — فيُنقَلُ المقعدُ فوراً إلى قائمةِ الانتظارِ الاحتياطية."),
    ],
    "d-b2-23": [
        # L1: Arbeitszeitkonto monatlich ausgeglichen = رصيد ساعات العمل شهرياً; Betriebsvereinbarung = اتفاقية المنشأة
        ("يجبُ تصفيةُ حسابِ العملِ شهريّاً؛ وقد نصَّت اتفاقُنا التنظيميُّ على ذلك.",
         "يجبُ تسويةُ رصيدِ ساعاتِ العمل شهرياً — فنحن نستندُ إلى اتفاقيةِ المنشأة."),
        # L2: Zeitschiene statt Auszahlung = جدولة زمنية بدل الدفع النقدي
        ("أتقترحون رصيداً زمنيّاً بدلَ النقد؟",
         "أتقترحون جدولةً زمنيةً بدلَ الدفع النقدي؟"),
        # L3: Frei im Block = إجازة متصلة; Zuschlag pro Überstunde laut Tarif = علاوة لكل ساعة وفق الأجرة الجماعية
        ("عطلةٌ متتابعة: يومانِ وعلاوةٌ لكلِّ ساعةٍ بحكمِ الاتفاقية.",
         "إجازةٌ متصلة: يومان، إضافةً إلى علاوةٍ عن كلِّ ساعةٍ إضافيةٍ وفقَ الاتفاقيةِ الأجرية."),
        # L4: Kontingent vor Ostern abgebaut = تصريف الرصيد قبل الفصح (لا «تفكيك»)
        ("جدولُ المناوباتِ لا يسمح — علينا تفكيكُ الرصيدِ قبلَ الفصح.",
         "جدولُ المناوباتِ لا يسمحُ بذلك — علينا تصريفُ الرصيدِ قبلَ عيدِ الفصح."),
        # L5: Liste durchsetzen = نُمرّر القائمة; verbindlich = بشكل ملزم (لا «بيقين»)
        ("سنُنَفِّذُ القائمةَ الاثنين مع قائدِ المناوبة — بيقينٍ لا مع وعود.",
         "سنُمرِّرُ القائمةَ يومَ الاثنين مع قائدِ المناوبة — بشكلٍ ملزم."),
        # L7: Einigungsstelle = هيئة التسوية; Spruch ersetzt Weigerung = قرارها يحل محل رفض صاحب العمل (لا «عناد»)
        ("إذن لجنةُ التوفيق، وحكمُها يحلُّ محلَّ عنادِ صاحبِ العمل.",
         "فهيئةُ التسوية؛ ويحلُّ قرارُها محلَّ رفضِ صاحبِ العمل."),
    ],
    "d-b2-24": [
        # L0: Zertifikat oder nicht? = هل أحصل على الشهادة؟ (لا «أليَّ» العامية)
        ("نجحتُ بفارقٍ ضئيلٍ في امتحان telc B1 — أليَّ شهادة؟",
         "نجحتُ في امتحانِ telc B1 بفارقٍ ضئيل — هل أحصلُ على الشهادة؟"),
        # L1: Bestanden ist bestanden = النجاح نجاح (لا «ولو شعرة»)
        ("نجحتَ ولو شعرة: ستصلُك الشهادةُ بالبريدِ خلالَ أربعةِ أسابيع.",
         "النجاحُ نجاح: ستصلُك الشهادةُ بالبريدِ بعدَ أربعةِ أسابيع."),
        # L2: Fehlt ... nicht der Nachweis? = ألا يلزم/يُشترط إثبات إعادة (لا «ليس مطلوباً منّي» الذي يعكس المعنى)
        ("وليس مطلوباً منّي إثباتُ إعادةٍ لإقامتي؟",
         "ألا يُشترطُ لإقامتي إثباتُ إعادةِ الامتحان؟"),
        # L3: Wiederholungen nur bei Nichtbestehen = الإعادة فقط عند الرسوب (لا «للحاصل على الراسب»)
        ("عندَ النجاحِ لا شيء؛ والإعادةُ للحاصلِ فقط على الراسب، مرتينِ كحدٍّ أقصى.",
         "عندَ النجاحِ لا شيء؛ والإعادةُ تكونُ فقط عندَ الرسوب، وبحدٍّ أقصى مرتين."),
        # L4: Volkshochschule = معهد تعليم الكبار (لا «جامعة الشعب»)
        ("وإن أردتُ B2: التسجيلُ عبرَ جامعةِ الشعب؟",
         "وإن أردتُ التقدُّمَ لامتحان B2: ألتسجيلُ عبرَ معهدِ تعليمِ الكبار؟"),
        # L5: Direkt über Sprachenzentrum; Warteliste inklusive = عبر مركز اللغات مباشرة، وتوجد قائمة انتظار (لا «مضمَّنة لك»)
        ("من مركزِ اللغاتِ مباشرة؛ موعدُ الربيع، وقائمةُ الانتظارِ مضمَّنةٌ لك.",
         "عبرَ مركزِ اللغاتِ مباشرة؛ الموعدُ في الربيع، ومعه قائمةُ انتظار."),
        # L6: Fördermittel bei wiederholtem Versuch = وسائل الدعم عند إعادة المحاولة (لا «كرَّة الفشل»)
        ("وما المنحُ لمن أُعيدَ كرَّةُ الفشل؟",
         "وما وسائلُ الدعمِ المتاحةِ عندَ إعادةِ المحاولة؟"),
        # L7: Kursträger = منظمو الدورة; Gebühren halbieren = تخفيض الرسوم إلى النصف
        ("قد يُخفِّضُ حاملو الدورةِ نصفَ الرسوم؛ فاطلبْ خلالَ أسبوعَين لا أكثر.",
         "يستطيعُ منظمو الدورةِ تخفيضَ الرسومِ إلى النصف؛ قدِّم الطلبَ خلالَ أسبوعين."),
    ],
}

D = json.loads(D_PATH.read_text(encoding="utf-8"))
by_id = {d["id"]: d for d in D}
applied = 0
locked_de = 0
locked_mc = 0
locked_dict = 0
remaining = 0
for did, pairs in FIXES.items():
    dlg = by_id[did]
    locked_de += len(dlg["lines"])
    locked_mc += len(dlg.get("questions", []))
    locked_dict += len(dlg.get("dictation", []))
    used = set()
    for old_ar, new_ar in pairs:
        found = False
        for i, ln in enumerate(dlg["lines"]):
            if i in used: continue
            if ln["ar"] == old_ar:
                ln["ar"] = new_ar; applied += 1; used.add(i); found = True; break
        if not found:
            if any(ln["ar"] == new_ar for ln in dlg["lines"]): continue
            remaining += 1; print(f"!! MISS in {did}: {old_ar[:60]}")
D_PATH.write_text(json.dumps(D, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"\n<R130> patch complete · changes applied: {applied} · locked DE lines: {locked_de} · remaining old strings: {remaining}")
assert applied in (22, 0), f"expected 22 fixes (or 0 when already patched), applied {applied}"
assert remaining == 0, f"still {remaining} old strings present"
