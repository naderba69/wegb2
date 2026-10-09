#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the auditable R108 report for A2 dialogues d-a2-13–d-a2-15.

This generator reads the live content, captures every one of the 42 review
units, validates source/waisen coverage and historical guards, and emits the
paired JSON and Markdown reports. It does not modify lesson content.
"""
from collections import Counter
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
LIVE_PATH = ROOT / "content" / "dialogues.json"
JSON_PATH = ROOT / "docs" / "content-review-a2-dialogues-06-2026-10-05.json"
MD_PATH = ROOT / "docs" / "content-review-a2-dialogues-06-2026-10-05.md"
PATCH_PATH = "scripts/patches/review_a2_dialogues_06.py"
CREATION_PATH = "scripts/patches/dialoge_a2_neu1.py"
OLD_QUESTION_PATCH_PATH = "scripts/patches/a_dialog_fallen.py"

# key, title, URL, bounded source takeaway. Lexical references establish word
# senses, not the naturalness or truth of an entire dialogue sentence.
SOURCE_ROWS = [
    ("w_einarbeitung", "Duden: Einarbeitung", "https://www.duden.de/rechtschreibung/Einarbeitung", "يعرّف Einarbeitung بأنها إدخال/تهيئة شخص في عمل جديد؛ لا يثبت مدة أربعة أسابيع الخاصة بالشركة الخيالية."),
    ("w_fortbildung", "PONS: Fortbildung", "https://en.pons.com/translate/german-arabic/Fortbildung", "يدعم معنى التعليم/التدريب المهني المستمر، ولا يحدد برنامج الشركة أو استحقاقه."),
    ("w_teamarbeit", "DWDS: Teamarbeit", "https://www.dwds.de/wb/Teamarbeit", "يعرّفها بأنها عمل تعاوني تقوم به مجموعة؛ لا يحكم على أسلوب كل ترجمة عربية."),
    ("w_kenntnisse", "PONS: Kenntnisse", "https://en.pons.com/translate/german-arabic/Kenntnisse", "يدعم معنى المعارف/المعرفة في سياق المهارات."),
    ("w_vorstellen", "PONS: vorstellen", "https://en.pons.com/translate/german-arabic/vorstellen", "يدعم معنى تقديم شخص إلى آخر في تركيب dem Team vorstellen."),
    ("w_zeitdruck", "Almaany: time pressure", "https://www.almaany.com/ar/dict/ar-en/time-pressure/", "يسجل «ضغط زمني» و«ضغط الوقت» مقابلاً لـZeitdruck؛ لا يقيم صياغة الحوار كاملة."),
    ("w_firma", "PONS: Firma", "https://en.pons.com/translate/german-arabic/Firma", "يدعم معنى الشركة."),
    ("w_puenktlich", "PONS: pünktlich", "https://en.pons.com/translate/german-arabic/pünktlich", "يدعم معنى الالتزام بالموعد/في الوقت المحدد."),
    ("w_landung", "PONS: Landung", "https://en.pons.com/translate/german-arabic/Landung", "يدعم معنى هبوط الطائرة؛ السياق هو الرحلة الجوية."),
    ("w_rezeption", "PONS: Rezeption", "https://en.pons.com/translate/german-arabic/Rezeption", "يدعم معنى مكتب الاستقبال الفندقي بحسب السياق."),
    ("w_einzelzimmer", "PONS: Einzelzimmer", "https://en.pons.com/translate/german-arabic/Einzelzimmer", "يدعم معنى غرفة مفردة/لشخص واحد."),
    ("w_uebernachtung", "PONS: Übernachtung", "https://en.pons.com/translate/german-arabic/Übernachtung", "يدعم معنى المبيت/الليلة، ولا يحكم وحده على تركيب سؤال الإقامة."),
    ("w_reisefuehrer", "PONS: Reiseführer", "https://en.pons.com/translate/german-arabic/Reiseführer", "يدعم معنى الدليل السياحي."),
    ("w_aussicht", "PONS: Aussicht", "https://en.pons.com/translate/german-arabic/Aussicht", "يدعم معنى الإطلالة/المنظر في تركيب Aussicht auf den Fluss."),
    ("w_verlaufen", "PONS: sich verlaufen", "https://en.pons.com/translate/german-arabic/verlaufen", "يدعم معنى أن يضل الشخص طريقه؛ لا يفرض مقابلاً عربياً واحداً."),
    ("w_notausgang", "PONS: Notausgang", "https://en.pons.com/translate/german-arabic/Notausgang", "يعرض معنى مخرج الطوارئ."),
    ("w_trinkgeld", "PONS: Trinkgeld", "https://en.pons.com/translate/german-arabic/Trinkgeld", "يدعم معنى الإكرامية؛ العرف والمبلغ يتوقفان على المكان والجهة."),
    ("w_gepaeck", "PONS: Gepäck", "https://en.pons.com/translate/german-arabic/Gepäck", "يدعم معنى الأمتعة بوصفها مجموعة/حمولة؛ لا يثبت عدّ قطعة منفردة."),
    ("w_zutat", "Duden: Zutat", "https://www.duden.de/rechtschreibung/Zutat", "يعرّف المكوّن المستخدم في إعداد شيء، مع أمثلة طعام."),
    ("w_mehl", "PONS: Mehl", "https://en.pons.com/translate/german-arabic/Mehl", "يدعم معنى الطحين/الدقيق."),
    ("w_braten", "PONS: braten", "https://en.pons.com/translate/german-arabic/braten", "يدعم معنى القلي/التحمير في استعمال الطهي؛ لا يثبت مقدار الزيت أو السلامة."),
    ("w_sosse", "PONS: Soße", "https://en.pons.com/translate/german-arabic/Soße", "يدعم معنى الصلصة."),
    ("w_pfeffer", "PONS: Pfeffer", "https://en.pons.com/translate/german-arabic/Pfeffer", "يدعم معنى الفلفل بوصفه مكوّناً/تابلاً."),
    ("w_backofen", "PONS: Backofen", "https://en.pons.com/translate/german-arabic/Backofen", "يدعم معنى فرن الخَبز/الفرن المنزلي."),
    ("w_vorheizen", "Duden: vorheizen", "https://www.duden.de/rechtschreibung/vorheizen", "يدعم معنى تسخين الفرن قبل الاستخدام؛ لا يقرر أن العبارة الحوارية المختصرة خطأ."),
    ("w_schuessel", "PONS: Schüssel", "https://en.pons.com/translate/german-arabic/Schüssel", "يدعم معنى الوعاء/الزبدية."),
    ("w_umruehren", "PONS: umrühren", "https://en.pons.com/translate/german-arabic/umrühren", "يدعم معنى التحريك/التقليب."),
    ("w_einfrieren", "PONS: einfrieren", "https://en.pons.com/translate/german-arabic/einfrieren", "يدعم معنى التجميد."),
    ("w_auftauen", "PONS: auftauen", "https://en.pons.com/translate/german-arabic/auftauen", "يدعم معنى الذوبان/إزالة التجميد، لا طريقة الذوبان أو سلامتها."),
    ("title_arbeitstag", "PONS: Arbeitstag", "https://en.pons.com/translate/german-arabic/Arbeitstag", "يعطي يوم عمل مقابلاً لـArbeitstag؛ يدعم عنوان أول يوم عمل."),
    ("title_ankunft", "PONS: Ankunft", "https://en.pons.com/translate/german-arabic/Ankunft", "يدعم معنى الوصول."),
    ("title_hotel", "PONS: Hotel", "https://en.pons.com/translate/german-arabic/Hotel", "يدعم معنى فندق."),
    ("title_zusammen", "PONS: zusammen", "https://en.pons.com/translate/german-arabic/zusammen", "يدعم معنى معاً."),
    ("title_kochen", "PONS: kochen", "https://en.pons.com/translate/german-arabic/kochen", "يدعم معنى الطهي/الطبخ، ومنه الاستعمال المتعدي للطعام."),
    ("duden_gepaeck", "Duden: Gepäck", "https://www.duden.de/rechtschreibung/Gepaeck", "يعرض Gepäck اسماً جمعياً للأمتعة؛ يفيد في تمييزه من قطعة معدودة."),
    ("duden_gepaeckstueck", "Duden: Gepäckstück", "https://www.duden.de/rechtschreibung/Gepaeckstueck", "يدعم Gepäckstück بوصفه قطعة/عنصراً واحداً من الأمتعة."),
    ("pons_gepaeckstueck", "PONS: Gepäckstück", "https://en.pons.com/translate/german-arabic/Gepäckstück", "يدعم المقابل العربي لحقيبة/قطعة أمتعة، ولا يحدد المقصود في الجملة الحية."),
    ("hotel_nights", "Lingoneo: booking a hotel room", "https://www.lingoneo.org/learn-german/page/learn-essential-phrases/vacation/booking-a-hotel-room/page-1838", "يعرض الصياغة الفندقية «Wie viele Nächte möchten Sie bleiben?»؛ هذا بديل اصطلاحي مؤيد لا حكم قاطع ببطلان صياغة السؤال الحية."),
    ("p_nervoes", "PONS: nervös", "https://en.pons.com/translate/german-arabic/nerv%C3%B6s", "يعرض من مقابلات nervös «متوتر»؛ لا يختار وحده بين الصيغ العربية."),
    ("p_freuen", "PONS: sich freuen", "https://en.pons.com/translate/german-arabic/freuen", "يدعم معنى السرور/الفرح في sich freuen."),
    ("p_programm", "PONS: Programm", "https://en.pons.com/translate/german-arabic/Programm", "يعرض Programm بمعنى برنامج؛ لا يحدد البرنامج الوظيفي المقصود."),
    ("p_erklaeren", "PONS: erklären", "https://en.pons.com/translate/german-arabic/erkl%C3%A4ren", "يعرض شرح/توضيح مقابلاً لـerklären."),
    ("p_chefin", "PONS: Chefin", "https://en.pons.com/translate/german-arabic/Chefin", "يدعم معنى رئيسة/مديرة بوصفها الصيغة المؤنثة لـChef."),
    ("p_kollege", "PONS: Kollege", "https://en.pons.com/translate/german-arabic/Kollege", "يدعم معنى زميل؛ يعرض أيضاً Kollegin للمؤنث."),
    ("p_geduld", "PONS: Geduld", "https://en.pons.com/translate/german-arabic/Geduld", "يدعم معنى الصبر."),
    ("p_flug", "PONS: Flug", "https://en.pons.com/translate/german-arabic/Flug", "يدعم معنى رحلة/طيران، ويعين السياق الحديث على معنى الرحلة الجوية."),
    ("p_reservieren", "PONS: reservieren", "https://en.pons.com/translate/german-arabic/reservieren", "يدعم معنى الحجز."),
    ("p_fluss", "PONS: Fluss", "https://en.pons.com/translate/german-arabic/Fluss", "يعرض النهر معنىً لـFluss؛ يدعم Aussicht auf den Fluss."),
    ("p_stock", "PONS: Stock", "https://en.pons.com/translate/german-arabic/Stock", "يفصل مدخل Stock2 عن العصا ويعرض معنى طابق/دور، المطابق لسياق مبنى الفندق."),
    ("p_zwiebel", "PONS: Zwiebel", "https://en.pons.com/translate/german-arabic/Zwiebel", "يدعم معنى البصل؛ لا يفرض إظهار الجمع في العربية مع اسم المادة."),
    ("p_tag", "PONS: Tag", "https://en.pons.com/translate/german-arabic/Tag", "يدعم معنى اليوم في Das reicht für zwei Tage."),
    ("p_willkommen", "PONS: willkommen", "https://en.pons.com/translate/german-arabic/willkommen", "يعرض مقابلات ترحيب عربية مثل مرحباً/أهلاً وسهلاً."),
    ("p_guten_abend", "PONS: Guten Abend", "https://en.pons.com/translate/german-arabic/Guten+Abend", "يعرض التحية المسائية «مساء الخير»."),
    ("hotel_tipping", "Reisereporter: Trinkgeld im Hotel", "https://www.reisereporter.de/tipps-und-tricks/wissen-fuer-reise-nerds/trinkgeld-im-hotel-so-machen-reisende-es-richtig-YFJ67IMCCDJLSIWQLC7DCSUJ6W.html", "يعرض الإكرامية الفندقية اختيارية، ويذكر نحو 1–2 يورو لعمال housekeeping بحسب الإقامة، مع أن الإكرامية للاستقبال غير معتادة غالباً؛ لا يعمم على مكان أو جهة غير محددين."),
    ("lgl_food", "LGL Bayern: Umgang mit Eiern, Milch und Fleisch", "https://www.lgl.bayern.de/lebensmittel/hygiene/hygienischer_umgang/verbrauchertipps/et_eier_milch_fleisch.htm", "يوصي بإزالة سائل ذوبان اللحوم بعناية ومنع ملامسته أطعمة أخرى، ويذكر تجنب التلوث المتبادل؛ لا يحدد نوع اللحم أو طريقة حواره."),
    ("bfr_poultry", "BfR: Fragen und Antworten zu Geflügelfleisch", "https://www.bfr.bund.de/fragen-und-antworten/thema/ausgewaehlte-fragen-und-antworten-zu-gefluegelfleisch/", "يقدم إرشادات خاصة بالدواجن عن الإذابة المبردة وسائل الذوبان والتلوث المتبادل؛ لا يجوز تعميمه على لحم غير محدد النوع أو نسبة الطريقة إلى الحوار."),
    ("linguee_recipe", "Linguee: Backofen auf 180 Grad vorheizen", "https://www.linguee.com/german-english/translation/backofen+auf+180+grad+vorheizen.html", "يعرض تركيباً كاملاً شائعاً «Backofen auf 180 Grad vorheizen»؛ يدعم اقتراح وضوح لا يثبت خطأ الشذرة الحوارية."),
    ("p_ei", "PONS: Ei", "https://en.pons.com/translate/german-arabic/Ei", "يفرق بين Ei المفرد «بيضة» وEi الجمعي «بيض»."),
    ("p_milch", "PONS: Milch", "https://en.pons.com/translate/german-arabic/Milch", "يدعم معنى الحليب؛ يظهر أيضاً مقابلاً إقليمياً مصنفاً Äg، فلا يفرض تنويعاً عربياً بعينه."),
    ("p_fleisch", "PONS: Fleisch", "https://en.pons.com/translate/german-arabic/Fleisch", "يدعم معنى اللحم/اللحوم من دون تعيين نوع الحيوان."),
    ("p_gefrierfach", "PONS: Gefrierfach", "https://en.pons.com/translate/german-arabic/Gefrierfach", "يدعم معنى حجرة/قسم التجميد؛ لا يحدد درجة حرارة جهاز بعينه."),
    ("p_pfanne", "PONS: Pfanne", "https://en.pons.com/translate/german-arabic/Pfanne", "يدعم معنى المقلاة."),
    ("p_klumpen", "PONS: Klumpen", "https://en.pons.com/translate/german-arabic/Klumpen", "يدعم معنى كتلة/تكتل؛ في خليط الطبخ: كتل."),
    ("p_ende", "PONS: Ende", "https://en.pons.com/translate/german-arabic/Ende", "يدعم معنى النهاية/الآخر في am Ende."),
    ("p_bisschen", "PONS: bisschen", "https://en.pons.com/translate/german-arabic/bisschen", "يعرض معنى قليل/قليلاً لـein bisschen."),
    ("p_salz", "PONS: Salz", "https://en.pons.com/translate/german-arabic/Salz", "يدعم معنى الملح؛ لا يحسم الإضمار الحواري في Salz haben wir schon."),
    ("p_rest", "PONS: Rest", "https://en.pons.com/translate/german-arabic/Rest", "يدعم معنى البقية/الباقي."),
    ("p_reichen", "PONS: reichen", "https://en.pons.com/translate/german-arabic/reichen", "يعرض معنى genügen/يكفي، ومنه das reicht."),
    ("p_grad", "PONS: Grad", "https://en.pons.com/translate/german-arabic/Grad", "يعرض الدرجة في استعمال القياس/الحرارة."),
    ("p_flur", "PONS: Flur", "https://en.pons.com/translate/german-arabic/Flur", "يعرض معنى الردهة/الممر للـFlur المنزلي، مع معنى آخر هو الحقل خارج هذا السياق."),
    ("p_links", "PONS: links", "https://en.pons.com/translate/german-arabic/links", "يعرض «إلى اليسار» لـnach links."),
    ("p_kostenlos", "PONS: kostenlos", "https://en.pons.com/translate/german-arabic/kostenlos", "يعرض kostenfrei/مجاني؛ صفحة القاموس تحيل في التفصيل إلى مدخل kostenfrei."),
    ("p_freiwillig", "PONS: freiwillig", "https://en.pons.com/translate/german-arabic/freiwillig", "يدعم معنى طوعي/اختياري."),
    ("p_ueblich", "PONS: üblich", "https://en.pons.com/translate/german-arabic/%C3%BCblich", "يعرض «معتاد/مألوف» مقابلاً لـüblich."),
    ("p_euro", "PONS: Euro", "https://en.pons.com/translate/german-arabic/Euro", "يدعم اسم العملة يورو؛ لا يثبت أن مبلغاً معيناً عرفٌ محلي."),
    ("p_dauern", "PONS: dauern", "https://en.pons.com/translate/german-arabic/dauern", "يعرض دام/استغرق مقابلاً لـdauern."),
    ("p_woche", "PONS: Woche", "https://en.pons.com/translate/german-arabic/Woche", "يدعم أسبوع؛ أمثلة PONS تشمل nächste Woche."),
    ("p_herbst", "PONS: Herbst", "https://en.pons.com/translate/german-arabic/Herbst", "يدعم معنى الخريف."),
    ("p_bezahlen", "PONS: bezahlen", "https://en.pons.com/translate/german-arabic/bezahlen", "يدعم معنى دفع الثمن/السداد؛ لا يثبت أن الشركة الخيالية ستدفع فعلاً."),
    ("p_morgen", "PONS: morgen", "https://en.pons.com/translate/german-arabic/morgen", "يدعم الظرف الزمني غداً، مع تمييزه عن اسم Morgen الصباح."),
    ("p_acht", "PONS: acht", "https://en.pons.com/translate/german-arabic/acht", "يدعم العدد acht = ثمانية؛ لا يحدد سياق الساعة خارج الجملة."),
]

# Each record: kind, status, source keys, finding, action.
REVIEWS = {
    "d-a2-13": ("بيانات الحوار/العنوان/وسوم waisen", "سليم", ["w_einarbeitung", "w_fortbildung", "w_teamarbeit", "w_kenntnisse", "w_vorstellen", "w_zeitdruck", "w_firma", "w_puenktlich", "title_arbeitstag"], "العنوان Der erste Arbeitstag يقابله «أول يوم عمل». فُحصت مفردات waisen الثماني كلمةً كلمةً بالمراجع المسندة هنا: Einarbeitung، Fortbildung، Teamarbeit، Kenntnisse، sich vorstellen، Zeitdruck، Firma، pünktlich. مدخل Duden هو الدليل الأساسي على الاسم Einarbeitung؛ لا تكفي نتيجة بحث معجمية عن الفعل وحده للحكم على الاسم. اللقطة الحية: A2؛ 8 أسطر/3 أسئلة/جملتا إملاء؛ neu=true. لا يُعاد تقييم CEFR.", "لا تغيير للعنوان أو الوسوم أو المستوى؛ لا تعميم لمدة التهيئة المذكورة في حوار شركة خيالية."),
    "d-a2-13.lines[0]": ("سطر ألماني/ترجمته", "سليم", ["w_firma", "w_vorstellen", "w_teamarbeit", "p_chefin"], "الترحيب وتقديم Frau Mansour إلى الفريق محفوظان. مقابلات الشركة وتقديم شخص إلى فريق تدعمها المداخل المعجمية؛ «هل أقدّمك للفريق؟» عربية مفهومة ومطابقة للسؤال الرسمي. لا يثبت المعجم وحده طبيعية الجملة كاملة.", "لا تغيير؛ صياغة التحية العربية البديلة مسألة أسلوب لا خطأ معنى ثابت."),
    "d-a2-13.lines[1]": ("سطر ألماني/ترجمته", "سليم", ["p_nervoes", "p_freuen"], "nervös يقابل «متوترة»، وsich freuen يدل على السرور. «بكل سرور… متوترة قليلاً لكنني سعيدة» يحفظ التردد والفرح مع تأنيث المتحدثة؛ ليست سلاسة جملة عربية كاملة مستنتجة من مدخل مفردة.", "لا تغيير."),
    "d-a2-13.lines[2]": ("سطر ألماني/ترجمته", "مُصحح", ["w_einarbeitung", "w_zeitdruck", "p_dauern", "p_woche"], "كان «في هذه الفترة لا ضغط وقت» نقلاً حرفياً متعثراً وغير طبيعي في العربية، وZeitdruck يعني ضغطاً زمنياً. الصياغة الجديدة «تستغرق فترة التهيئة في العمل أربعة أسابيع. وخلالها لا يوجد ضغط زمني» تحفظ مدة Einarbeitung ونفي الضغط. مدة الأسابيع ادعاء داخل حوار الشركة لا حقيقة عامة.", "صُحح حقل العربية وحده إلى ترجمة عربية سليمة؛ لم يتغير الألماني أو المدة أو مفتاح السؤال، ولم تُعمم المدة على أصحاب العمل."),
    "d-a2-13.lines[3]": ("سطر ألماني/ترجمته", "سليم", ["p_programm", "p_erklaeren", "p_chefin"], "معنى شرح البرنامج على الحاسوب وسؤال الموظفة إن كانت المديرة هي التي ستشرحه محفوظ. «أنتِ كمديرة؟» يؤدي Sie als Chefin هنا، ويطابق تأنيث المخاطبة؛ المداخل تثبت معاني المفردات لا الحكم على كل تركيب.", "لا تغيير؛ لا التباس يثبت خطأً ملزماً."),
    "d-a2-13.lines[4]": ("سطر ألماني/ترجمته", "سليم", ["w_kenntnisse", "w_teamarbeit", "p_kollege", "p_geduld"], "Tom هو الزميل، وله معرفة جيدة وصبر كثير، والعمل الجماعي مهم: العناصر الأساسية كلها في العربية. معرفة/معارف وزميل وصبر معانٍ مؤيدة بالمداخل؛ الجملة تخص الشركة الخيالية.", "لا تغيير ولا تعميم لادعاء أهمية Teamarbeit على كل شركة."),
    "d-a2-13.lines[5]": ("سطر ألماني/ترجمته", "سليم", ["w_fortbildung"], "السؤال عن وجود Fortbildung إضافية يقابله «هل يوجد تكوين مستمر أيضاً؟». «تكوين مستمر» اختيار عربي مفهوم؛ يمكن تفضيل «تدريب/تطوير مهني» حسب الجمهور، دون ثبوت خطأ ترجمي.", "لا تغيير؛ البديل الأسلوبي ليس عيباً مؤكداً."),
    "d-a2-13.lines[6]": ("سطر ألماني/ترجمته", "سليم", ["w_firma", "p_herbst", "p_bezahlen"], "الخريف ويومان في كولن ودفع الشركة لكل شيء عناصر منقولة. المصادر تسند معاني الموسم والدفع والشركة؛ لا تتحقق من سياسة شركة حقيقية.", "لا تغيير؛ تبقى المعلومة داخل الحوار الخيالي."),
    "d-a2-13.lines[7]": ("سطر ألماني/ترجمته", "سليم", ["w_puenktlich", "p_morgen", "p_acht"], "النية «سأكون غداً في الثامنة ملتزمة بالموعد» محفوظة؛ pünktlich لا تعني مجرد «بالضبط» في كل سياق، لكن العربية «في الثامنة بالضبط» مفهومة ولا يثبت هنا انحراف يستدعي إصلاحاً.", "لا تغيير؛ يمكن استعمال «سأكون هنا غداً في الثامنة تماماً/في الموعد» كبديل أسلوبي فقط."),
    "d-a2-13-q1": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["w_einarbeitung", "w_fortbildung", "p_dauern", "p_woche"], "المفتاح vier Wochen منصوص عليه في d-a2-13.lines[2]. المشتتان «يومان» و«حتى الخريف» يخصان التدريب اللاحق؛ الخيارات الثلاثة متميزة ومفتاحها حاضر في النص.", "لا تغيير للمفتاح أو الخيارات أو الشرح."),
    "d-a2-13-q2": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["p_erklaeren", "p_programm", "p_kollege", "w_kenntnisse"], "السؤال يسأل عمن يشرح البرنامج؛ الجواب ihr Kollege Tom يطابق السطر 4 حرفياً، والمشتتان المديرة/مدرب كولن لا يناقضان النص. الشرح يستشهد بالدليل ويشرح الفخاخ.", "لا تغيير."),
    "d-a2-13-q3": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["w_zeitdruck"], "الفراغ بعد keinen يطلب الاسم Zeitdruck، وهو الجواب المنقول حرفياً في السطر 2؛ الشرح يقتبس الجملة نفسها.", "لا تغيير."),
    "d-a2-13.dictation[0]": ("جملة إملاء", "سليم", ["w_einarbeitung", "p_dauern", "p_woche"], "جملة الإملاء مطابقة حرفياً للجملة الأولى من سطر التهيئة، ومدة الأسابيع محفوظة.", "لا تغيير."),
    "d-a2-13.dictation[1]": ("جملة إملاء", "سليم", ["w_teamarbeit"], "جملة الإملاء مطابقة حرفياً لـTeamarbeit ist bei uns wichtig؛ معنى العمل التعاوني يسنده DWDS.", "لا تغيير."),

    "d-a2-14": ("بيانات الحوار/العنوان/وسوم waisen", "سليم", ["title_ankunft", "title_hotel", "w_landung", "w_rezeption", "w_einzelzimmer", "w_uebernachtung", "w_reisefuehrer", "w_aussicht", "w_verlaufen", "w_notausgang", "w_trinkgeld", "w_gepaeck"], "العنوان Ankunft im Hotel يقابله «الوصول إلى الفندق». فُحصت مفردات waisen العشر كلمةً كلمةً: Landung، Rezeption، Einzelzimmer، Übernachtung، Reiseführer، Aussicht، sich verlaufen، Notausgang، Trinkgeld، Gepäck. اللقطة الحية A2؛ 8/3/2؛ neu=true. لا إعادة لتقييم CEFR.", "لا تغيير للعنوان أو الوسوم أو المستوى. حُفظت النقاط السياقية المفتوحة منفصلة عن سلامة اللغة."),
    "d-a2-14.lines[0]": ("سطر ألماني/ترجمته", "سليم", ["w_einzelzimmer", "p_reservieren", "p_guten_abend"], "تحية المساء وحجز غرفة مفردة باسم Trabelsi محفوظة في «مساء الخير. حجزت غرفة مفردة باسم الطرابلسي». الحجز والغرفة المفردة والتحية مدعومة معجمياً؛ تهجئة الاسم علمٌ من النص.", "لا تغيير."),
    "d-a2-14.lines[1]": ("سطر ألماني/ترجمته", "سليم", ["p_willkommen", "p_flug", "title_hotel"], "الترحيب والسؤال عن الرحلة محفوظان في «أهلاً! كيف كانت الرحلة؟». PONS يثبت معنى الترحيب والرحلة الجوية، لا يفرض مقابلاً عربياً بعينه للتحية.", "لا تغيير."),
    "d-a2-14.lines[2]": ("سطر ألماني/ترجمته", "غير محسوم", ["w_landung", "w_puenktlich", "w_gepaeck", "duden_gepaeck", "duden_gepaeckstueck", "pons_gepaeckstueck"], "landung pünktlich واضحان، لكن «Ich habe nur ein kleines Gepäck» لا يثبت أن المتكلم يقصد قطعة واحدة: Gepäck يدل على الأمتعة كمجموع، وGepäckstück على قطعة منفردة. العربية الحية «معي أمتعة صغيرة فقط» تميل إلى وصف كمية/حجم، لا إلى «حقيبة واحدة». لا نقرر المقصود ولا نصف العبارة خطأً مؤكداً دون توضيح.", "أُبقي الألمانية والعربية كما هما. إن كان المقصود قطعة واحدة فـGepäckstück خيار أدق؛ وإن كان المقصود قلة الأمتعة فتلزم صياغة مثل wenig Gepäck. لا يُطبق أي منهما قبل تأكيد النية."),
    "d-a2-14.lines[3]": ("سطر ألماني/ترجمته", "سليم", ["w_aussicht", "w_uebernachtung", "p_stock", "p_fluss"], "الغرفة 312 والطابق الثالث والإطلالة على النهر وثلاث ليالٍ محفوظة. PONS Stock يحدد معنى الطابق، لا معنى العصا، في هذا السياق؛ Aussicht/Fluss/Übernachtung تسند المقابلات العربية.", "لا تغيير."),
    "d-a2-14.lines[4]": ("سطر ألماني/ترجمته", "سليم", ["w_reisefuehrer", "w_verlaufen"], "طلب دليل للمدينة وكون الضيف يضل طريقه سريعاً محفوظان. «أضيع بسرعة» ممكن؛ «أضل الطريق بسهولة» بديل عربي أسلوبي إذا أريد معنى التكرار/السهولة، لا خطأ مؤكد.", "لا تغيير."),
    "d-a2-14.lines[5]": ("سطر ألماني/ترجمته", "سليم", ["w_notausgang", "p_flur", "p_links", "p_kostenlos"], "كون الدليل مجانياً وموقع مخرج الطوارئ في نهاية الممر يساراً محفوظ. Flur هنا ممر/ردهة، وlinks اتجاه إلى اليسار؛ للمفردة معنى آخر خارج السياق.", "لا تغيير."),
    "d-a2-14.lines[6]": ("سطر ألماني/ترجمته", "سليم", ["w_trinkgeld", "hotel_tipping"], "السؤال «هل يُعطى بقشيش هنا؟» مفهوم ومطابق للسياق الفندقي؛ «بقشيش» اختيار عربي دارج، ويمكن استخدام «إكرامية» فصحى دون أن يلزم ذلك.", "لا تغيير؛ لا يُفترض بلد الفندق أو الجهة المتلقية."),
    "d-a2-14.lines[7]": ("سطر ألماني/ترجمته", "غير محسوم", ["w_trinkgeld", "p_freiwillig", "p_ueblich", "p_euro", "hotel_tipping"], "المعاني «اختياري/طوعي» و«يورو أو اثنان» قابلة للنقل. لكن حكم «معتاد هنا» غير قابل للتعميم: المصدر الفندقي الذي فُحص يذكر housekeeping وسياق إقامة بعينه، ويصف tipping للاستقبال بأنه أقل شيوعاً؛ الحوار لا يحدد المكان أو متلقي الإكرامية.", "أُبقي النص دون تغيير ولا أقدّم عرفاً عاماً. يلزم تحديد المكان والجهة أو تأطير العبارة على أنها قول شخصية/عرف محلي."),
    "d-a2-14-q1": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["w_einzelzimmer", "w_aussicht", "p_fluss"], "المفتاح يجمع معلومتين ظاهرتين: Einzelzimmer في السطر 0 والإطلالة على النهر في السطر 3. المشتتان يخلطان معلومات صحيحة عن الطابق/الممر مع نوع الغرفة أو مخرج الطوارئ؛ الشرح يوضح ذلك.", "لا تغيير."),
    "d-a2-14-q2": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["w_uebernachtung", "hotel_nights"], "المفتاح drei يطابق «Drei Übernachtungen, richtig?» ثم «Ja». مثال Lingoneo يؤيد سؤالاً فندقياً أكثر تداولاً بـNächte؛ لكنه لا يثبت أن السؤال الحي «Wie viele Übernachtungen bleibt er?» خطأ نحوي قاطع، لذلك يبقى اقتراحاً أسلوبياً لا تصحيحاً مفروضاً.", "لا تغيير؛ لا يُستبدل promptDe ببديل أسلوبي دون دليل أقوى على خطأ مؤكد."),
    "d-a2-14-q3": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["w_reisefuehrer", "p_kostenlos", "p_euro"], "العبارة «الدليل يكلف يوروين» خاطئة بحسب السطر «Hier, kostenlos». معنى kostenlos مجاني؛ اليورو أو الاثنان ذُكرا في جواب الإكرامية لا ثمن الدليل.", "لا تغيير للمفتاح أو الخيارات أو الشرح."),
    "d-a2-14.dictation[0]": ("جملة إملاء", "سليم", ["w_landung", "w_puenktlich"], "الجملة منقولة حرفياً من بداية السطر 2؛ landung/موعد الهبوط محفوظان.", "لا تغيير."),
    "d-a2-14.dictation[1]": ("جملة إملاء", "سليم", ["w_notausgang", "p_flur", "p_links"], "الجملة مطابقة للسطر 5؛ المعجم يدعم مخرج الطوارئ والممر والاتجاه يساراً.", "لا تغيير."),

    "d-a2-15": ("بيانات الحوار/العنوان/وسوم waisen", "سليم", ["title_zusammen", "title_kochen", "w_zutat", "w_mehl", "w_braten", "w_sosse", "w_pfeffer", "w_backofen", "w_vorheizen", "w_schuessel", "w_umruehren", "w_einfrieren", "w_auftauen"], "العنوان Zusammen kochen يقابله «نطبخ معاً». فُحصت مفردات waisen الإحدى عشرة كلمةً كلمةً: Zutat، Mehl، braten، Soße، Pfeffer، Backofen، vorheizen، Schüssel، umrühren، einfrieren، auftauen. اللقطة A2؛ 8/3/2؛ neu=true؛ لا إعادة لتقييم CEFR.", "لا تغيير للعنوان أو المستوى أو الوسوم؛ نقاط سلامة الطعام مفصولة عن الحكم اللغوي."),
    "d-a2-15.lines[0]": ("سطر ألماني/ترجمته", "سليم", ["w_zutat", "w_mehl", "p_ei", "p_milch", "p_zwiebel"], "السؤال عن توافر المكونات وقائمة Mehl/Eier/Milch/Zwiebeln محفوظة. العربية تستخدم اسم «بصل» الجمعي بدلاً من جمع عددي، وهو مناسب للمادة الغذائية في هذا السياق.", "لا تغيير."),
    "d-a2-15.lines[1]": ("سطر ألماني/ترجمته", "سليم", ["w_auftauen", "p_fleisch", "p_gefrierfach", "lgl_food", "bfr_poultry"], "المعنى اللغوي: أخذ اللحم من حجرة التجميد أمس وأصبح مذاباً؛ العربية تنقل ذلك. نوع اللحم وطريقة/درجة الذوبان غير مذكورين. LGL يعطي احتياطات عامة لسائل الذوبان، وBfR يتناول الدواجن تحديداً؛ لا يثبت أي منهما وقوع معالجة غير آمنة هنا.", "لا تعديل لغوي ولا حكم على سلامة طريقة غير مذكورة؛ تُحفظ الملاحظة السياقية فقط."),
    "d-a2-15.lines[2]": ("سطر ألماني/ترجمته", "سليم", ["w_backofen", "w_vorheizen", "p_grad", "linguee_recipe"], "تعليمة الوصفة المختصرة مفهومة: سخّنوا الفرن مسبقاً، 180 درجة. Duden يدعم معنى vorheizen، ومصادر الوصفات تعرض الصياغة الأوضح «auf 180 Grad vorheizen»؛ حذف auf لا يكفي وحده لإثبات خطأ في هذه الشذرة الحوارية.", "لا تغيير؛ يُسجل البديل «Zuerst den Backofen auf 180 Grad vorheizen» كملاحظة وضوح اختيارية فقط."),
    "d-a2-15.lines[3]": ("سطر ألماني/ترجمته", "سليم", ["w_braten", "p_zwiebel", "p_pfanne"], "السؤال عن قلي البصل في المقلاة مطابق لمعاني الأفعال والأسماء في سياق وصفة الطعام.", "لا تغيير."),
    "d-a2-15.lines[4]": ("سطر ألماني/ترجمته", "سليم", ["w_mehl", "w_schuessel", "w_umruehren", "p_milch", "p_klumpen"], "إضافة الطحين والحليب إلى الوعاء والتحريك جيداً كي لا تتكوّن كتل محفوظة. العربية تتبع الإضمار الإرشادي في «Dann Mehl und Milch in die Schüssel…» ولا تفقد خطوة أساسية.", "لا تغيير."),
    "d-a2-15.lines[5]": ("سطر ألماني/ترجمته", "سليم", ["w_pfeffer", "w_sosse"], "السؤال عما إذا كان الفلفل سيُضاف إلى الصلصة منقول بوضوح.", "لا تغيير."),
    "d-a2-15.lines[6]": ("سطر ألماني/ترجمته", "سليم", ["p_bisschen", "p_ende", "p_salz"], "قليل من الفلفل في النهاية، والملح موجود/سبق وضعه: المعنى الحواري محفوظ. «Salz haben wir schon» حذف محادثي، والعربية «الملح وضعناه» تصرّح بما يفهم من سياق إعداد الطعام؛ لا دليل قاطع على أن الإضمار يعني مجرد امتلاك الملح خارج الوصفة.", "لا تغيير تخميني؛ يمكن توضيحها أسلوبياً إلى «الملح أضفناه بالفعل» إذا أراد المحرر هذا المعنى."),
    "d-a2-15.lines[7]": ("سطر ألماني/ترجمته", "سليم", ["w_einfrieren", "p_rest", "p_reichen", "p_tag"], "السؤال عن تجميد الباقي، ثم أن الكمية تكفي يومين، محفوظ. PONS يدعم Rest وreichen بمعنى يكفي وTag بوصفه يوماً.", "لا تغيير؛ لا ادعاء مدة حفظ آمنة للطعام."),
    "d-a2-15-q1": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["p_fleisch", "p_gefrierfach", "w_auftauen"], "الإجابة «أخرج اللحم من حجرة التجميد» مذكورة حرفياً في السطر 1؛ قلي البصل وتسخين الفرن خطوات تالية، لا فعل الأمس. شرح الفخاخ متوافق.", "لا تغيير."),
    "d-a2-15-q2": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["w_umruehren", "p_klumpen", "w_pfeffer", "w_sosse"], "الإجابة لأن التحريك يمنع الكتل منصوص عليها بـ«sonst gibt es Klumpen». مشتت الصلصة الحارة يخص الفلفل، ومشتت ذوبان اللحم يخص اليوم السابق.", "لا تغيير."),
    "d-a2-15-q3": ("سؤال/خيارات/مفتاح/شرح", "سليم", ["w_backofen", "w_vorheizen", "p_grad", "linguee_recipe"], "الفراغ بعد den Backofen يطلب vorheizen، وهو الفعل نفسه في السطر 2؛ 180 Grad جزء من التعليمة. صياغة الوصفة المختصرة ليست خللاً في مفتاح السؤال.", "لا تغيير."),
    "d-a2-15.dictation[0]": ("جملة إملاء", "سليم", ["w_backofen", "w_vorheizen", "p_grad", "linguee_recipe"], "جملة الإملاء مطابقة حرفياً لتعليمة الفرن في السطر 2؛ لا يثبت اختيار الشذرة أن صياغة وصفة أخرى غير صحيحة.", "لا تغيير."),
    "d-a2-15.dictation[1]": ("جملة إملاء", "سليم", ["w_pfeffer", "w_sosse"], "جملة الإملاء «Kommt Pfeffer in die Soße?» نسخة حرفية من السطر 5.", "لا تغيير."),
}

WAISEN_SOURCE_KEYS = {
    "d-a2-13": ["w_einarbeitung", "w_fortbildung", "w_teamarbeit", "w_kenntnisse", "w_vorstellen", "w_zeitdruck", "w_firma", "w_puenktlich"],
    "d-a2-14": ["w_landung", "w_rezeption", "w_einzelzimmer", "w_uebernachtung", "w_reisefuehrer", "w_aussicht", "w_verlaufen", "w_notausgang", "w_trinkgeld", "w_gepaeck"],
    "d-a2-15": ["w_zutat", "w_mehl", "w_braten", "w_sosse", "w_pfeffer", "w_backofen", "w_vorheizen", "w_schuessel", "w_umruehren", "w_einfrieren", "w_auftauen"],
}

OLD_ARABIC = "فترة التأهيل تدوم أربعة أسابيع. في هذه الفترة لا ضغط وقت."
NEW_ARABIC = "تستغرق فترة التهيئة في العمل أربعة أسابيع. وخلالها لا يوجد ضغط زمني."
EXPECTED_PATCH_FIELDS = ["d-a2-13.lines[2].ar"]


def md_cell(value):
    return str(value).replace("|", "\\|").replace("\n", "<br>")


def source_refs(keys, key_to_id):
    missing = [key for key in keys if key not in key_to_id]
    if missing:
        raise SystemExit(f"Unknown source keys: {missing}")
    return [key_to_id[key] for key in keys]


def make_reviewed(dialogue, item_id, kind):
    if kind == "بيانات الحوار/العنوان/وسوم waisen":
        return {
            "titleDe": dialogue["titleDe"],
            "titleAr": dialogue["titleAr"],
            "level": dialogue["level"],
            "lineCount": len(dialogue["lines"]),
            "questionCount": len(dialogue["questions"]),
            "dictationCount": len(dialogue["dictation"]),
            "neu": dialogue.get("neu"),
            "hasWaisen": isinstance(dialogue.get("waisen"), list),
            "waisen": dialogue.get("waisen", []),
        }
    if ".lines[" in item_id:
        index = int(item_id.rsplit("[", 1)[1][:-1])
        return dict(dialogue["lines"][index])
    question = next((entry for entry in dialogue["questions"] if entry.get("id") == item_id), None)
    if question is not None:
        return dict(question)
    if ".dictation[" in item_id:
        index = int(item_id.rsplit("[", 1)[1][:-1])
        return {"sentence": dialogue["dictation"][index]}
    raise SystemExit(f"Cannot create live snapshot for {item_id}")


def render_snapshot(item):
    snapshot = item["reviewed"]
    if item["kind"] == "بيانات الحوار/العنوان/وسوم waisen":
        waisen = "، ".join(snapshot["waisen"])
        return (
            f"العنوان الألماني: {snapshot['titleDe']}<br>العنوان العربي: {snapshot['titleAr']}<br>"
            f"المستوى: {snapshot['level']}؛ الأسطر/الأسئلة/الإملاء: "
            f"{snapshot['lineCount']}/{snapshot['questionCount']}/{snapshot['dictationCount']}<br>"
            f"neu: {snapshot['neu']}؛ waisen ({len(snapshot['waisen'])}): {waisen}"
        )
    if item["kind"] == "سطر ألماني/ترجمته":
        return f"DE: {snapshot['de']}<br>AR: {snapshot['ar']}"
    if item["kind"] == "سؤال/خيارات/مفتاح/شرح":
        options = "؛ ".join(str(option) for option in snapshot.get("options", []))
        answer = "؛ ".join(snapshot["answer"]) if isinstance(snapshot.get("answer"), list) else snapshot.get("answer")
        return (
            f"DE: {snapshot.get('promptDe', '')}<br>AR prompt: {snapshot.get('promptAr', '')}<br>"
            f"الخيارات: {options}<br>المفتاح: {answer}<br>الشرح: {snapshot.get('explanationAr', '')}"
        )
    return f"DE: {snapshot['sentence']}"


def build_markdown(report):
    counts = report["statusCounts"]
    lines = [
        "# R108 — مراجعة الحوارات A2 d-a2-13–d-a2-15",
        "",
        f"**التاريخ:** {report['date']} · **الفرع:** `arena/01a0fee7-wegb2` · **التقرير:** `docs/content-review-a2-dialogues-06-2026-10-05.json`",
        "",
        "## الخلاصة والنطاق",
        "",
        f"رُوجعت **{report['coverage']['totalTrackedItems']} وحدة** على حدة: 3 بيانات حوار، 24 سطراً، 9 أسئلة مع الخيارات والمفاتيح والشروح، و6 جمل إملاء. وفُحصت **{report['coverage']['waisenTermsReviewed']} مفردة waisen** داخل بيانات الحوارات (ليست وحدات إضافية). النتيجة: **{counts['سليم']} سليماً، {counts['مُصحح']} مصححاً، {counts['غير محسوم']} غير محسوم**؛ والحكم غير المحسوم ليس إثبات خطأ. استُخدمت **{len(report['sources'])} مرجعاً منشوراً** وربط كل وحدة بمصدر أو أكثر.",
        "",
        "التغيير الوحيد هو `d-a2-13.lines[2].ar`؛ لم تتغير الألمانية أو الأسئلة أو المستويات. أُبقي غموض معنى الأمتعة في `d-a2-14.lines[2]` ونطاق معلومة الإكرامية في `d-a2-14.lines[7]` دون تخمين. لم يُستنتج أسلوب إذابة اللحم من `d-a2-15.lines[1]`.",
        "",
        "## المنهج والحدود",
        "",
        report["method"],
        "",
        "المداخل المعجمية تسند معاني الكلمات فقط ولا تثبت وحدها سلامة الجملة كاملة. المصدر الألماني الأولي `dialoge_a2_neu1.py` يقارن بعض النصوص القديمة لكنه ليس مرجعاً لغوياً ولا سجلاً كاملاً. لا مراجعة بشرية أو اعتماد مهني، ولا تقييم CEFR. لم يحدث استماع أو تشغيل صوت.",
        "",
        "## سجل كل وحدة — اللقطة الحية والدليل والحكم والإجراء",
        "",
        "| المعرّف | النوع | الحكم | الدليل والحكم | الإجراء | المصادر واللقطة الحية |",
        "|---|---|---|---|---|---|",
    ]
    for item in report["items"]:
        refs = ", ".join(item["sources"])
        before = ""
        if item.get("before"):
            before = "<br>قبل التعديل: " + md_cell(json.dumps(item["before"], ensure_ascii=False))
        last = f"{refs}<br>{render_snapshot(item)}{before}"
        lines.append(
            f"| `{item['id']}` | {md_cell(item['kind'])} | **{item['status']}** | "
            f"{md_cell(item['finding'])} | {md_cell(item['action'])} | {md_cell(last)} |"
        )
    lines += ["", "## ملاحظات سياقية غير محسومة", "", "| المعرّف | الحالة | الوحدات ذات الصلة | الدليل المحدود والحكم | الإجراء | المصادر |", "|---|---|---|---|---|---|"]
    for note in report["openNotes"]:
        lines.append(
            f"| `{note['id']}` | {note['status']} | {', '.join(f'`{x}`' for x in note['relatedItemIds'])} | "
            f"{md_cell(note['finding'])} | {md_cell(note['action'])} | {', '.join(note['sources'])} |"
        )
    lines += ["", "## بدائل أسلوبية مؤجلة — ليست أخطاء مؤكدة", "", "| المعرّف | البديل المدعوم | لماذا لم يُطبّق | المصادر |", "|---|---|---|---|"]
    for note in report["styleNotes"]:
        lines.append(f"| `{note['id']}` | {md_cell(note['alternative'])} | {md_cell(note['reason'])} | {', '.join(note['sources'])} |")
    lines += [
        "",
        "## التغيير المحروس",
        "",
        f"الحقول المعدلة: {report['contentPatch']['fieldsChanged']} — {', '.join(f'`{x}`' for x in report['contentPatch']['changedFields'])}.",
        "",
        f"السبب: {report['contentPatch']['reason']}",
        "",
        "النص قبل/بعد موثق في سجل الوحدة والبيانات الحية؛ سكربت الرقعة يفحص النص الألماني والحقول المحمية ويُرفض إذا وجد قيماً غير متوقعة. لا تغيير لـCEFR أو النسبة أو الإجابات أو خياراتها.",
        "",
        "## المقارنة التاريخية المحدودة",
        "",
        report["historicalPatchReview"]["role"],
        "",
    ]
    for comparison in report["historicalPatchReview"]["comparisons"]:
        lines.append(f"- `{comparison['id']}`: historical=`{comparison['historicalText']}`؛ live=`{comparison['liveText']}`. {comparison['observation']}")
    lines += ["", "غير متاح: " + "؛ ".join(report["historicalPatchReview"]["unavailableHistoricalFields"]) + ".", "", "## سجل المصادر المنشورة وحدودها", "", "| ID | المصدر | الرابط | ما يسنده وحدوده |", "|---|---|---|---|"]
    for source in report["sources"]:
        lines.append(f"| {source['id']} | {md_cell(source['title'])} | <{source['url']}> | {md_cell(source['supports'])} |")
    lines += ["", "## تدقيق الصوت والاختبارات", "", "لم توجد إدخالات مطابقة في `content/dialog-audio.json` ولا أسماء ملفات R108 في `public/`. الغياب لا يعني أن ملفاً مطلوباً. لم يحدث تشغيل أو استماع أو اختبار TTS.", ""]
    ver = report["verification"]
    for key, label in (("typescript", "TypeScript"), ("smoke", "smoke"), ("interaktiv", "interaktiv"), ("contentAudit", "audit:content"), ("build", "build"), ("npmAudit", "npm audit"), ("patchIdempotence", "idempotence"), ("gitDiffCheck", "git diff --check")):
        result = ver[key].get("result", "pending")
        details = ver[key].get("passed")
        if details is not None:
            result = f"{details} ناجح / {ver[key].get('failed', 0)} فشل"
        lines.append(f"- **{label}:** {result} — `{ver[key].get('command', '')}`. {ver[key].get('note', '')}")
    if ver.get("initialFailures"):
        lines += ["", "إخفاقات أثناء التنفيذ وحلولها:"]
        for failure in ver["initialFailures"]:
            lines.append(f"- `{failure['command']}`: {failure['failure']} — الحل: {failure['resolution']}")
    lines += ["", "## حدود الاستنتاج", ""]
    for limitation in report["limitations"]:
        lines.append(f"- {limitation}")
    lines.append("")
    return "\n".join(line.rstrip() for line in lines)


raw_dialogues = json.loads(LIVE_PATH.read_text(encoding="utf-8"))
target_ids = ["d-a2-13", "d-a2-14", "d-a2-15"]
selected = [dialogue for dialogue in raw_dialogues if dialogue.get("id") in target_ids]
if [dialogue.get("id") for dialogue in selected] != target_ids:
    raise SystemExit(f"Live dialogue selection/order changed: {[d.get('id') for d in selected]}")
if any(len(d.get("lines", [])) != 8 or len(d.get("questions", [])) != 3 or len(d.get("dictation", [])) != 2 for d in selected):
    raise SystemExit("Unexpected live batch structure; re-review before reporting")

sources = [
    {"id": f"S{index:02d}", "title": title, "url": url, "supports": supports}
    for index, (_, title, url, supports) in enumerate(SOURCE_ROWS, start=1)
]
source_id_by_key = {row[0]: f"S{index:02d}" for index, row in enumerate(SOURCE_ROWS, start=1)}
if len(source_id_by_key) != len(SOURCE_ROWS):
    raise SystemExit("Duplicate source keys")

dialogue_by_id = {dialogue["id"]: dialogue for dialogue in selected}
items = []
for dialogue in selected:
    candidate_ids = [
        dialogue["id"],
        *[f"{dialogue['id']}.lines[{index}]" for index in range(len(dialogue["lines"]))],
        *[question["id"] for question in dialogue["questions"]],
        *[f"{dialogue['id']}.dictation[{index}]" for index in range(len(dialogue["dictation"]))],
    ]
    for item_id in candidate_ids:
        if item_id not in REVIEWS:
            raise SystemExit(f"Missing individual evidence/judgment/action for {item_id}")
        kind, status, source_keys, finding, action = REVIEWS[item_id]
        item = {
            "id": item_id,
            "kind": kind,
            "status": status,
            "sources": source_refs(source_keys, source_id_by_key),
            "finding": finding,
            "action": action,
            "reviewed": make_reviewed(dialogue, item_id, kind),
        }
        if item_id == "d-a2-13.lines[2]":
            item["before"] = {"de": item["reviewed"]["de"], "ar": OLD_ARABIC}
        items.append(item)

expected_ids = [
    dialogue["id"]
    for dialogue in selected
]
expected_ids = []
for dialogue in selected:
    expected_ids += [dialogue["id"]]
    expected_ids += [f"{dialogue['id']}.lines[{index}]" for index in range(len(dialogue["lines"]))]
    expected_ids += [question["id"] for question in dialogue["questions"]]
    expected_ids += [f"{dialogue['id']}.dictation[{index}]" for index in range(len(dialogue["dictation"]))]
if [item["id"] for item in items] != expected_ids or len(items) != 42:
    raise SystemExit("The report does not contain the exact 42 live review units in order")

status_counts = dict(Counter(item["status"] for item in items))
if status_counts != {"سليم": 39, "مُصحح": 1, "غير محسوم": 2}:
    raise SystemExit(f"Unexpected status counts: {status_counts}")
waisen_count = sum(len(dialogue.get("waisen", [])) for dialogue in selected)
if waisen_count != 29:
    raise SystemExit(f"Unexpected live waisen count: {waisen_count}")
for dialogue_id, keys in WAISEN_SOURCE_KEYS.items():
    metadata = next(item for item in items if item["id"] == dialogue_id)
    if len(keys) != len(metadata["reviewed"]["waisen"]) or not set(source_refs(keys, source_id_by_key)).issubset(metadata["sources"]):
        raise SystemExit(f"Incomplete individual waisen source coverage for {dialogue_id}")

creation_text = (ROOT / CREATION_PATH).read_text(encoding="utf-8")
question_patch_text = (ROOT / OLD_QUESTION_PATCH_PATH).read_text(encoding="utf-8")
if OLD_ARABIC not in creation_text or "طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط." not in creation_text:
    raise SystemExit("Expected creation-patch history not found; do not infer a historical snapshot")
if any(dialogue_id in question_patch_text for dialogue_id in target_ids):
    raise SystemExit("Unexpected dialogue IDs in a_dialog_fallen.py; re-review historical scope")

# The JSON report records the actual gate results after the final run. Until
# then, the explicit pending values prevent stale results from being implied.
VERIFICATION = {
    "typescript": {"command": "./node_modules/.bin/tsc --noEmit", "result": "passed"},
    "smoke": {"command": "npm run smoke", "passed": 1140, "failed": 0, "gates": "K182a–j + previous gates"},
    "interaktiv": {"command": "npm run interaktiv", "passed": 699, "failed": 0, "note": "تحذيرات HTMLMediaElement.play/pause من jsdom؛ لا تُثبت تشغيل الصوت. لم يُشغّل أو يُستمع لصوت R108."},
    "contentAudit": {"command": "npm run audit:content", "result": "passed", "confirmedStructuralDefects": 0, "note": "الإشارات المطبوعة بشرية/تربوية أو heuristic وليست عيوباً مؤكدة."},
    "build": {"command": "npm run build", "result": "passed", "staticPages": 11},
    "npmAudit": {"command": "npm audit --no-fund", "result": "passed", "vulnerabilities": 0},
    "patchIdempotence": {"command": f"python3 {PATCH_PATH}", "result": "already applied; no additional data changed"},
    "gitDiffCheck": {"command": "git diff --check", "result": "passed"},
    "initialFailures": [
        {"command": "./node_modules/.bin/tsc --noEmit and npm run smoke", "failure": "الاعتماديات المحلية غير موجودة أولاً (tsc/esbuild: not found).", "resolution": "npm ci ثبّت 95 حزمة؛ أُعيد TypeScript وsmoke بنجاح."},
        {"command": "npm run smoke", "failure": "أول تشغيل لبوابات K182f وK182h رفض عبارتين مرساتين بسبب اختلاف حرفي مع صياغة التقرير، لا بسبب خلل في المحتوى.", "resolution": "طوبقت العبارات على حدود الدليل النهائي دون تخفيف التغطية؛ أُعيد smoke كاملاً: 1140/0."},
        {"command": "./node_modules/.bin/tsc --noEmit (بالتوازي مع npm run build)", "failure": "تعارض مؤقت أثناء إعادة Next.js توليد .next/types؛ ظهر TS6053 لملفات الأنواع المولدة التي مسّها البناء المتزامن.", "resolution": "بعد اكتمال build أُعيد TypeScript منفرداً ونجح؛ لا خطأ مصدر مستمر."}
    ],
}

open_notes = [
    {
        "id": "d-a2-14.lines[2]",
        "status": "غير محسوم",
        "sources": source_refs(["w_gepaeck", "duden_gepaeck", "duden_gepaeckstueck", "pons_gepaeckstueck"], source_id_by_key),
        "relatedItemIds": ["d-a2-14.lines[2]"],
        "finding": "Gepäck يدل على مجموع الأمتعة؛ Gepäckstück على قطعة منفردة. النص العربي الحالي لا يصرح بحقيبة واحدة، ولا يوضح قصد المؤلف أهو قلة الأمتعة أم قطعة صغيرة. المصدر يفرّق المعنيين ولا يحسم نية الحوار.",
        "action": "لا تغيير حتى تأكيد المقصود؛ إن كان المقصود قطعة واحدة فليُراجع de/ar معاً، وإن كان المقصود قلة الأمتعة فلتعتمد صياغة ذلك المعنى.",
    },
    {
        "id": "d-a2-14.lines[7]",
        "status": "غير محسوم",
        "sources": source_refs(["w_trinkgeld", "hotel_tipping", "p_freiwillig", "p_ueblich", "p_euro"], source_id_by_key),
        "relatedItemIds": ["d-a2-14.lines[6]", "d-a2-14.lines[7]"],
        "finding": "السؤال/الجواب عن «هنا» يتوقف على بلد الفندق والجهة المقصودة. المصدر الفندقي الذي فُحص يذكر الإكرامية اختيارية ونحو 1–2 يورو لعمال housekeeping وفق سياق إقامة، ويذكر أن الإكرامية للاستقبال غير معتادة غالباً؛ لا يثبت أن الرقم «معتاد» في فندق غير محدد.",
        "action": "يُحفظ النص بلا حكم عام أو تغيير تخميني؛ يلزم سياق جغرافي وتحديد متلقي الإكرامية إذا أريد تقرير العرف كحقيقة تعليمية.",
    },
    {
        "id": "d-a2-15.lines[1]",
        "status": "غير محسوم",
        "sources": source_refs(["p_fleisch", "p_gefrierfach", "w_auftauen", "lgl_food", "bfr_poultry"], source_id_by_key),
        "relatedItemIds": ["d-a2-15.lines[1]"],
        "finding": "طريقة وحرارة إذابة اللحم غير مذكورتين، كما أن نوعه غير محدد. LGL يذكر فصل سائل الذوبان، وBfR يقدم إرشاداً خاصاً بالدواجن؛ لا يسمح أي منهما بنسبة طريقة خطرة إلى الجملة أو الحكم على سلامة حالة لم يصفها الحوار.",
        "action": "لا تعديل ولا نصيحة سلامة مستنتجة من هذه الجملة؛ إن أريد تحويل الحوار إلى وصفة إرشادية فيلزم تحديد نوع اللحم وطريقة الإذابة وإسنادها إلى دليل مناسب.",
    },
]

style_notes = [
    {
        "id": "d-a2-14-q2.promptDe",
        "alternative": "Wie viele Nächte bleibt der Gast?",
        "reason": "Lingoneo يسند استعمال Nächte في سؤال الحجز/مدة الإقامة؛ صياغة d-a2-14 الحية ليست مثبتة هنا كخطأ نحوي قاطع، لذا لا تستبدل لمجرد أن البديل أشيع.",
        "sources": source_refs(["w_uebernachtung", "hotel_nights"], source_id_by_key),
    },
    {
        "id": "d-a2-15.lines[2].de",
        "alternative": "Zuerst den Backofen auf 180 Grad vorheizen.",
        "reason": "توضح درجة الفرن داخل التركيب نفسه، لكن «Zuerst den Backofen vorheizen, 180 Grad» مفهومة كتعليمة وصفة محكية؛ الإكمال تحسين وضوح اختياري لا خطأ مؤكد.",
        "sources": source_refs(["w_backofen", "w_vorheizen", "p_grad", "linguee_recipe"], source_id_by_key),
    },
]

unresolved_ids = ["d-a2-14.lines[2]", "d-a2-14.lines[7]"]
protected_style_ids = ["d-a2-14-q2.promptDe", "d-a2-15.lines[2].de"]
content_patch = {
    "fieldsChanged": 1,
    "changedFields": EXPECTED_PATCH_FIELDS,
    "reason": "أُصلح التركيب العربي غير الطبيعي «لا ضغط وقت» إلى «لا يوجد ضغط زمني» مع جعل جملة المدة عربية سليمة. لم يتغير النص الألماني أو مدة الأسابيع. لم تُطبق اقتراحات الأمتعة/السؤال الفندقي/تعليمة الفرن لأنها ملتبسة أو أسلوبية لا أخطاء مؤكدة.",
    "protectedUnresolvedItemIds": unresolved_ids,
    "protectedContextRelatedItemIds": ["d-a2-14.lines[6]", "d-a2-15.lines[1]"],
    "protectedStyleItemIds": protected_style_ids,
    "deferredSuggestions": [
        {"id": "d-a2-14.lines[2]", "candidate": {"de": "ein kleines Gepäckstück", "ar": "حقيبة صغيرة واحدة"}, "reason": "فقط إذا أكد المؤلف أنه يقصد قطعة مفردة؛ لا تُحوّل قلة الأمتعة إلى حقيبة واحدة."},
        {"id": "d-a2-14-q2.promptDe", "candidate": "Wie viele Nächte bleibt der Gast?", "reason": "بديل أشيع مؤيد بمثال فندقي، لكن الخطأ القاطع لم يثبت."},
        {"id": "d-a2-15.lines[2].de", "candidate": "Zuerst den Backofen auf 180 Grad vorheizen.", "reason": "بديل أوضح لدرجة الحرارة، لا تصحيح إلزامي."},
    ],
}

historical = {
    "sources": [CREATION_PATH, OLD_QUESTION_PATCH_PATH],
    "role": "dialoge_a2_neu1.py يحتوي نص الإنشاء الأولي لبعض الحقول؛ استُخدم للمقارنة الحرفية فقط لا كحكم لغوي أو سجل تعديل كامل. بحث الملف a_dialog_fallen.py لا يجد معرفات d-a2-13 إلى d-a2-15، لذلك لا نستنتج تاريخاً للأسئلة منه.",
    "unavailableHistoricalFields": [
        "التسلسل الكامل لتعديلات النص بعد ملف الإنشاء الأولي",
        "سجل سابق مستقل لأسئلة هذه المعرفات؛ a_dialog_fallen.py لا يحتويها",
        "نية مؤلف d-a2-14.lines[2] في التفريق بين قطعة أمتعة وكمية قليلة",
        "أي سجل صوت تاريخي أو تسجيل استماع",
    ],
    "comparisons": [
        {"id": "d-a2-13.lines[2].ar", "historicalText": OLD_ARABIC, "liveText": NEW_ARABIC, "observation": "لقطة الإنشاء تطابق before؛ التغيير الحالي يخص العربية فقط."},
        {"id": "d-a2-14.lines[2].de", "historicalText": "Lang, aber die Landung war pünktlich. Ich habe nur ein kleines Gepäck.", "liveText": "Lang, aber die Landung war pünktlich. Ich habe nur ein kleines Gepäck.", "observation": "نص الإنشاء يطابق النص الحي؛ لا يستدل منه على نية المؤلف في تحديد عدد القطع."},
        {"id": "d-a2-14.lines[2].ar", "historicalText": "طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط.", "liveText": "طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط.", "observation": "نص الإنشاء يطابق النص الحي؛ بقيت دلالة كمية/قطعة غير محسومة."},
    ],
}

limitations = [
    "هذه مراجعة مساعد ذكاء اصطناعي بمصادر منشورة، وليست مراجعة بشرية أو اعتماداً لغوياً/مهنياً أو رأياً قانونياً/طبياً.",
    "لم يُعَد تقييم A2/CEFR أو حساب النسبة أو مستوى المتعلم؛ لا تغيير لهذه الحقول.",
    "مداخل القواميس تسند مفردات محددة ولا تثبت وحدها سلاسة كل جملة ألمانية أو عربية.",
    "مدة التهيئة وموعد التدريب والسداد خصائص حوار شركة خيالية؛ لا تعمم على أصحاب العمل.",
    "عرف الإكرامية غير محسوم لغياب المكان والمتلقي؛ مرجع Reisereporter محدود بسياقات وجهات معينة.",
    "لا يحدد سطر اللحم نوعه أو طريقة إذابته؛ مرجع BfR خاص بالدواجن ومرجع LGL احتياط عام. لم يُنسب خطر غير مذكور إلى الحوار.",
    "لم توجد إدخالات صوت/أسماء ملفات مطابقة؛ لا يستنتج من الغياب أن صوتاً مطلوب. لم يحدث تشغيل أو استماع أو اختبار TTS.",
    "المقارنة التاريخية محدودة بملف الإنشاء الأولي وما أمكن التحقق منه؛ لا تدعي بناء سجل تاريخ كامل.",
]

report = {
    "date": "2026-10-05",
    "batch": "A2-dialogues-06",
    "reviewRule": "R108",
    "scope": "مراجعة مصدرية فردية للحوارات الحية d-a2-13 إلى d-a2-15: 3 بيانات حوار، 24 سطراً، 9 أسئلة بكل خياراتها ومفاتيحها وشروحها، و6 جمل إملاء؛ 42 وحدة إجمالاً، مع فحص 29 مفردة waisen ضمن بيانات الحوار لا كوحدات إضافية. فُحص سجل الصوت والتاريخ كلٌّ ضمن حدوده.",
    "method": "استُخرجت اللقطات والمعرفات من content/dialogues.json بعد إعادة فحص Git والتقارير. لكل وحدة 42 سُجل الدليل والحكم والإجراء واللقطة الحية؛ وربطت وسوم waisen الثمانية/العشرة/الإحدى عشرة بمصادرها الفردية. استُخدمت صفحات معجمية للمعنى فقط، ومصادر رسمية/سياقية لما قد يتعلق بسلامة الطعام. اقتصر التصحيح على خطأ عربي مؤكد؛ وفُصلت الملاحظات الأسلوبية والوقائع التي لا يحسمها السياق.",
    "coverage": {
        "dialogues": 3,
        "dialogueMetadata": 3,
        "lines": 24,
        "questions": 9,
        "dictationSentences": 6,
        "audioAssets": 0,
        "unresolvedContextNotes": 3,
        "totalTrackedItems": 42,
        "waisenTermsReviewed": 29,
    },
    "statusCounts": status_counts,
    "statusDefinitions": {
        "سليم": "فُحصت الوحدة بسياقها ومصدرها؛ لم يثبت فيها خطأ ترجمي/لغوي مؤكد يستلزم التعديل. قد تُسجل ملاحظة أسلوبية أو حدّ سياقي دون تحويله إلى عيب.",
        "مُصحح": "ثبت خلل محدد في حقل العربية، وعُدّل الحقل وحده مع حفظ النص قبل التعديل." ,
        "غير محسوم": "المعنى المقصود أو حقيقة سياقية لا يحسمها النص/المصدر؛ لا تعديل تخمينياً، ولا يعني التصنيف ثبوت خطأ لغوي.",
    },
    "limitations": limitations,
    "historicalPatchReview": historical,
    "contentPatch": content_patch,
    "openNotes": open_notes,
    "styleNotes": style_notes,
    "audioAssetAudit": [],
    "sources": sources,
    "items": items,
    "verification": VERIFICATION,
}

# Every declared source must be cited by a review unit or contextual/style note.
referenced_source_ids = set()
for item in report["items"]:
    referenced_source_ids.update(item["sources"])
for note in report["openNotes"] + report["styleNotes"]:
    referenced_source_ids.update(note["sources"])
if len(sources) != len(SOURCE_ROWS) or referenced_source_ids != {source["id"] for source in sources}:
    unused = sorted({source["id"] for source in sources} - referenced_source_ids)
    unknown = sorted(referenced_source_ids - {source["id"] for source in sources})
    raise SystemExit(f"Source registry/reference mismatch; unused={unused}, unknown={unknown}")
if set(REVIEWS) != set(expected_ids):
    raise SystemExit(f"Review definition drift; missing={set(expected_ids)-set(REVIEWS)}, extra={set(REVIEWS)-set(expected_ids)}")

# Keep the unresolved wording and optional alternatives separate from errors.
if [item["id"] for item in items if item["status"] == "مُصحح"] != ["d-a2-13.lines[2]"]:
    raise SystemExit("Only the one guarded Arabic line may be marked corrected")
if report["contentPatch"]["changedFields"] != EXPECTED_PATCH_FIELDS:
    raise SystemExit("The patch record must name only the guarded Arabic field")
if len(open_notes) != report["coverage"]["unresolvedContextNotes"]:
    raise SystemExit("Unresolved-note coverage mismatch")

JSON_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
MD_PATH.write_text(build_markdown(report), encoding="utf-8")
print(f"Wrote {JSON_PATH.relative_to(ROOT)} and {MD_PATH.relative_to(ROOT)}")
print(f"42 units: {status_counts}; {waisen_count} waisen terms; {len(sources)} unique sources")
