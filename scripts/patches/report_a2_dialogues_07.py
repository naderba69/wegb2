#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the source-audited R109 JSON/Markdown report from live content.

This script is read-only with respect to lessons. It captures all 42 units in
content/dialogues.json, the 28 waisen terms, the related vocabulary-card update,
bounded source/history/audio audits, and the actual verification results entered
below after the test run.
"""
from collections import Counter
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"
VOCAB_PATH = ROOT / "content" / "vocab.json"
AUDIO_PATH = ROOT / "content" / "dialog-audio.json"
PACKAGE_PATH = ROOT / "package.json"
PACKAGE_LOCK_PATH = ROOT / "package-lock.json"
JSON_PATH = ROOT / "docs" / "content-review-a2-dialogues-07-2026-10-06.json"
MD_PATH = ROOT / "docs" / "content-review-a2-dialogues-07-2026-10-06.md"
PATCH_PATH = "scripts/patches/review_a2_dialogues_07.py"
REPORT_SCRIPT_PATH = "scripts/patches/report_a2_dialogues_07.py"
CREATION_PATH = "scripts/patches/dialoge_a2_neu1.py"
OLD_QUESTION_PATCH_PATH = "scripts/patches/a_dialog_fallen.py"
CARD_SOURCE_PATH = "scripts/vokabel_welle7.py"
PLURAL_SOURCE_PATH = "scripts/patches/apply_plurals.py"
APPLY_DIALOGUE_PATH = "scripts/patches/apply_dialoge.py"

# Each reference is bounded: dictionary entries support lexical senses, not the
# factual truth/naturalness of a complete dialogue or an individual legal case.
SOURCE_ROWS = [
    ("schutzkleidung", "Duden: Schutzkleidung", "https://www.duden.de/rechtschreibung/Schutzkleidung", "يعرّف ملابس الوقاية بأنها ما يُلبس للحماية من المؤثرات الضارة.", "لا يقرر ما يلزم في ورشة بعينها ولا قائمة معداتها."),
    ("helm", "PONS: Helm (German–Arabic)", "https://en.pons.com/translate/german-arabic/Helm", "يسند معنى الخوذة ومقابلها العربي.", "لا يحدد الحالات التي يجب فيها ارتداء الخوذة."),
    ("warnung", "PONS: Warnung (German–Arabic)", "https://en.pons.com/translate/german-arabic/Warnung", "يسند معنى Warnung بوصفها تحذيراً/إنذاراً.", "لا يصنف لافتة صفراء بلا رؤية شكلها ورمزها."),
    ("unterweisung", "Duden: Unterweisung", "https://www.duden.de/rechtschreibung/Unterweisung", "يدعم معنى الإرشاد/التعليم أو التوجيه.", "لا يثبت مدة نصف ساعة المذكورة في الورشة الخيالية."),
    ("anweisung", "PONS: Anweisung (German–Arabic)", "https://en.pons.com/translate/german-arabic/Anweisung", "يعرض مقابلات مثل إرشاد وتوجيه وتعليمات.", "لا يحدد السلطة القانونية لكل تعليمة في عقد عمل."),
    ("befolgen", "PONS: befolgen (German–Arabic)", "https://en.pons.com/translate/german-arabic/befolgen", "يسند معنى اتباع التعليمات أو احترام اللوائح.", "لا يجعل كل توجيه غير موصوف ملزماً قانوناً."),
    ("arbeitsunfall", "Duden: Arbeitsunfall", "https://www.duden.de/rechtschreibung/Arbeitsunfall", "يعرف حادث العمل بأنه حادث مرتبط سببياً بالنشاط المهني.", "لا يقرر تفاصيل الإبلاغ في مؤسسة بعينها."),
    ("erste_hilfe_kasten", "Duden: Erste-Hilfe-Kasten", "https://www.duden.de/rechtschreibung/Erste_Hilfe_Kasten", "يسند اسم صندوق الإسعافات الأولية ومعناه.", "لا يثبت لون الصندوق أو مكانه في الحوار."),
    ("arbeitssicherheit", "PONS: Arbeitssicherheit (German–Arabic)", "https://en.pons.com/translate/german-arabic/Arbeitssicherheit", "يسند معنى السلامة المهنية.", "لا يصادق على إجراء أو مدة تدريب خاصة بموقع معين."),
    ("werkstatt", "PONS: Werkstatt (German–Arabic)", "https://en.pons.com/translate/german-arabic/Werkstatt", "يسند مقابل Werkstatt: ورشة.", "لا يثبت أي تفاصيل في موقع العمل المتخيل."),
    ("meister", "Duden: Meister", "https://www.duden.de/rechtschreibung/Meister", "يتضمن معنى صاحب التأهيل/المشرف المسؤول في مجال عمل بالمؤسسة.", "لا يحسم المقابل العربي الأنسب في السياق التونسي؛ «المعلّم» قد يحمل معنى الحرفي الماهر."),
    ("schuh", "PONS: Schuh (German–Arabic)", "https://en.pons.com/translate/german-arabic/Schuh", "يسند معنى الحذاء ومقابله العربي.", "لا يحدد نوع حذاء الوقاية في الورشة."),
    ("brille", "PONS: Brille (German–Arabic)", "https://en.pons.com/translate/german-arabic/Brille", "يسند معنى النظارة.", "لا يحدد نوع النظارة الواقية المطلوبة."),
    ("handschuh", "PONS: Handschuh (German–Arabic)", "https://en.pons.com/translate/german-arabic/Handschuh", "يسند معنى القفاز.", "لا يحدد مواصفات القفازات في الموقع."),
    ("arbschg_10", "ArbSchG §10", "https://www.gesetze-im-internet.de/arbschg/__10.html", "يتناول ترتيبات الإسعاف الأولي ومكافحة الحريق والإخلاء في مكان العمل.", "لا يثبت موضع صندوق بعينه أو لونه أو تسلسل كل حالة خيالية."),
    ("arbschg_12", "ArbSchG §12", "https://www.gesetze-im-internet.de/arbschg/__12.html", "يلزم صاحب العمل بإرشاد العاملين على نحو مناسب وكافٍ في مسائل السلامة والصحة.", "لا يثبت مدة الإرشاد أو صياغة قاعدة عامة لكل أمر."),
    ("arbschg_15", "ArbSchG §15", "https://www.gesetze-im-internet.de/arbschg/__15.html", "يتناول واجبات العامل في استخدام وسائل العمل والوقاية والتعاون للسلامة.", "لا يحدد بذاته قائمة معدات كل ورشة أو حكم كل توجيه."),
    ("gewo_106", "GewO §106", "https://www.gesetze-im-internet.de/gewo/__106.html", "يجيز التوجيه ضمن عقد العمل والحدود القانونية/التعاقدية المقررة.", "لا يساوي بينه وبين وجوب اتباع كل تعليمة غير مقيدة."),
    ("asr_a1_3", "BAuA: ASR A1.3 Sicherheits- und Gesundheitsschutzkennzeichnung", "https://www.baua.de/DE/Angebote/Regelwerk/ASR/pdf/ASR-A1-3.pdf?__blob=publicationFile&v=3", "يعرض لافتات السلامة بوصفها تركيبة شكل هندسي ولون ورمز.", "اللون الأصفر وحده لا يكفي لتحديد نوع اللافتة؛ ولا تظهر صورة اللافتة في الحوار."),
    ("asr_a4_3", "BAuA: ASR A4.3 Erste-Hilfe-Räume, Mittel und Einrichtungen", "https://www.baua.de/DE/Angebote/Regelwerk/ASR/pdf/ASR-A4-3.pdf?__blob=publicationFile&v=3", "ينظم غرف ووسائل وتجهيزات الإسعاف الأولي وفق متطلبات مكان العمل.", "لا يثبت بذاته موضع الصندوق المذكور أو لونه."),
    ("dguv_first_aid", "DGUV: Erste-Hilfe-Material", "https://www.dguv.de/fb-erstehilfe/themenfelder/erste-hilfe-material/index.jsp", "مرجع مهني لتجهيز مواد الإسعاف وتوزيعها بحسب الاحتياج والمخاطر.", "لا يثبت حقيقة موقع الصندوق أو لونه في الحوار."),
    ("dguv_204_022", "DGUV Information 204-022: Erste Hilfe im Betrieb", "https://publikationen.dguv.de/widgets/pdf/download/article/759", "مرجع إضافي لتنظيم الإسعافات الأولية في العمل.", "لا يثبت الوقائع المكانية الخاصة بالورشة المتخيلة."),
    ("zwischenpruefung", "DWDS: Zwischenprüfung", "https://www.dwds.de/wb/Zwischenpr%C3%BCfung", "يسند معنى امتحان/اختبار وسيط أو نصفي.", "لا يثبت جدول مدرسة أو موعد امتحان بعينه."),
    ("nachholen", "PONS: nachholen (German–Arabic)", "https://en.pons.com/translate/german-arabic/nachholen", "يعرض معنى استدراك ما فات أو أداء امتحان في وقت لاحق.", "لا يحدد الموعد المذكور في الحوار."),
    ("lernpartner", "DWDS: Lernpartner", "https://www.dwds.de/wb/Lernpartner", "يسند معنى شريك التعلّم.", "لا يثبت أثراً تعليمياً كمياً لشراكة بعينها."),
    ("motivation", "PONS: Motivation (German–Arabic)", "https://en.pons.com/translate/german-arabic/Motivation", "يسند المجال الدلالي للتحفيز/الدوافع.", "لا يثبت فعالية استراتيجية تعلم بعينها."),
    ("dranbleiben", "Duden: dranbleiben", "https://www.duden.de/rechtschreibung/dranbleiben", "يسجل الاستمرار في أمر وعدم التوقف أو الاستسلام، مع استعمال عامي.", "لا يثبت وحده خطة تعليمية محددة."),
    ("akzent", "PONS: Akzent (German–Arabic)", "https://en.pons.com/translate/german-arabic/Akzent", "يعرض معنى النبرة ومعنى اللكنة بحسب السياق.", "المدخل لا يقيم ادعاءً تربوياً كاملاً عن وضوح الكلام."),
    ("wortschatz", "PONS: Wortschatz (German–Arabic)", "https://en.pons.com/translate/german-arabic/Wortschatz", "يسند معنى رصيد المفردات/معرفة الكلمات.", "لا يقيس رصيد المتعلم أو كفايته."),
    ("grammatikregel", "Duden: Grammatikregel", "https://www.duden.de/rechtschreibung/Grammatikregel", "يعرفها بأنها قاعدة نحوية.", "لا يحكم على القواعد التي يعرفها المتعلم في الحوار."),
    ("sprachschule", "DWDS: Sprachschule", "https://www.dwds.de/wb/Sprachschule", "يسند معنى مدرسة لتعليم اللغات.", "لا يثبت تاريخ المدرسة أو سياسة الاختبارات."),
    ("goethe_levels", "Goethe-Institut: Deutschkurse von A1 bis C2 und Einstufungstest", "https://www.goethe.de/ins/de/de/uun/dln.html", "يشرح المستويات A1–C2 واختبار تحديد المستوى؛ ويذكر تفاوت الزمن بحسب نوع الدورة والشدة وخبرة التعلم واللغة الأولى.", "لا يؤيد عدداً عالمياً ثابتاً من الكلمات يومياً ولا يثبت تاريخ اختبار بن علي."),
    ("cefr_phonology", "Council of Europe: CEFR Companion Volume, Chapter 5 (phonological control)", "https://rm.coe.int/chapter-5-communicative-language-competences/1680a084c3", "يفصل الوضوح عن مطابقة المتحدث الأصلي؛ ويذكر في A2 احتمال طلب التكرار وتأثر الوضوح باللكنة والحاجة إلى تعاون المحاور.", "مقياس وصفي عام؛ لا يشخّص متعلماً بعينه ولا يعيد تقييم مستوى الحوار."),
    ("angst", "Duden: Angst", "https://www.duden.de/rechtschreibung/Angst", "يسجل تركيب Angst haben vor واستعمال الخوف من شيء.", "لا يقيّم سبب خوف الطالب في سياق الحوار."),
    ("uebergabe", "Duden: Übergabe", "https://www.duden.de/rechtschreibung/Uebergabe", "يسند معنى التسليم/النقل إلى شخص آخر.", "لا يثبت إجراءات قانونية لتسليم مسكن."),
    ("protokoll", "Duden: Protokoll", "https://www.duden.de/rechtschreibung/Protokoll", "يسجل معنى محضر أو تدوين لما جرى/للنقاط الأساسية.", "لا يفرض نموذجاً معيناً لمحضر تسليم سكن."),
    ("streichen", "PONS: streichen (German–Arabic)", "https://en.pons.com/translate/german-arabic/streichen", "يسند في معنى الطلاء المقابل دهن/طلى، ويميزه عن معان أخرى للفعل.", "لا يثبت وجوب إعادة طلاء الجدران عند المغادرة."),
    ("wand", "Duden: Wand", "https://www.duden.de/rechtschreibung/Wand", "يعرف الجدار ويورد أمثلة مع weiß وstreichen.", "لا يحدد واجب المستأجر في إعادة الطلاء."),
    ("wohnflaeche", "Duden: Wohnfläche", "https://www.duden.de/rechtschreibung/Wohnflaeche", "يسند معنى المساحة السكنية/مساحة الشقة.", "لا يصادق على قياس الشقة الخيالية."),
    ("quadratmeter", "Duden: Quadratmeter", "https://www.duden.de/rechtschreibung/Quadratmeter", "يسند وحدة المساحة Quadratmeter.", "لا يثبت الرقم 54 في الواقعة المتخيلة."),
    ("warmmiete", "Duden: Warmmiete", "https://www.duden.de/rechtschreibung/Warmmiete", "يعرف الإيجار الشامل الذي يتضمن النفقات الملحقة/التدفئة بحسب التعريف المعجمي.", "لا يثبت عبارة Abrechnung der Warmmiete بوصفها مصطلحاً قانونياً دقيقاً."),
    ("stellplatz", "Duden: Stellplatz", "https://www.duden.de/rechtschreibung/Stellplatz", "يسند معنى مكان مخصص لإيقاف مركبة.", "لا يحدد حقاً تعاقدياً في الموقف."),
    ("hausverwaltung", "PONS: Hausverwaltung (German–Arabic)", "https://en.pons.com/translate/german-arabic/Hausverwaltung", "يعرض مقابلاً مثل مكتب/إدارة عقارية.", "لا يثبت من عثر على المستأجر في الواقعة الخيالية."),
    ("nachmieter", "Duden: Nachmieter", "https://www.duden.de/rechtschreibung/Nachmieter", "يعرف المستأجر التالي، ويسند الاسم المفرد وجمعه die Nachmieter.", "لا يثبت أن شخصاً بعينه عُثر عليه."),
    ("kaution_duden", "Duden: Kaution", "https://www.duden.de/rechtschreibung/Kaution", "يعرف مبلغ الضمان المدفوع، ومنه ضمان استئجار المسكن.", "لا يحدد موعد الرد في كل عقد أو حالة."),
    ("kaution_pons", "PONS: Kaution (German–Arabic)", "https://en.pons.com/translate/german-arabic/Kaution", "يعرض مقابلات عربية منها كفالة وضمان مالي.", "لا يثبت أن «الضمانة» خطأ في العربية التونسية/الفصحى."),
    ("abrechnung", "Duden: Abrechnung", "https://www.duden.de/rechtschreibung/Abrechnung", "يسند معنى المحاسبة/كشف الحساب والتسوية المالية.", "لا يثبت أن تركيب Abrechnung der Warmmiete مصطلح قانوني دقيق."),
    ("bgb_548", "BGB §548", "https://www.gesetze-im-internet.de/bgb/__548.html", "يتناول تقادم مطالبات المؤجر والمستأجر المرتبطة بحالة المسكن.", "لا يحدد مهلة أربعة أسابيع لرد الكفالة."),
    ("bgb_551", "BGB §551", "https://www.gesetze-im-internet.de/bgb/__551.html", "ينظم مقدار ضمان الإيجار وتقسيطه ضمن نطاقه.", "لا يقرر مهلة ردّ ثابتة بعد أربعة أسابيع."),
    ("bgb_556", "BGB §556", "https://www.gesetze-im-internet.de/bgb/__556.html", "يتناول اتفاق تكاليف التشغيل وتسويتها ومواعيدها القانونية ضمن أحكامه.", "لا يقرر في ذاته موعد رد الكفالة بعد أربعة أسابيع ولا يصادق على كل تركيب Warmmiete-Abrechnung."),
    ("einziehen", "DWDS: einziehen", "https://www.dwds.de/wb/einziehen", "يسند في سياق السكن معنى الانتقال إلى مسكن/السكن فيه، لا مجرد الدخول إليه.", "لا يحدد اليوم المقصود في الحوار."),
    ("monatserster", "Duden: Monatserster", "https://www.duden.de/rechtschreibung/Monatserster", "يعرف Monatserster بأنه أول يوم من الشهر؛ يسند am Ersten.", "لا يحسم أي شهر إذا لم يذكره السياق."),
    ("grammis_predicative", "IDS Grammis 1628: Korrespondenz zwischen Prädikativkomplement im Nominativ und finitem Verb", "https://grammis.ids-mannheim.de/systematische-grammatik/1628", "عند اختلاف عدد الفاعل والمسند الاسمي، يطابق الفعل الفاعل عادة؛ يورد مثال Du bist zwei Personen in einer.", "يسند المطابقة في الجملة ولا يثبت قياس مساحة المسكن."),
    ("grammis_measure", "IDS Grammis 1626: Korrespondenz zwischen Maß- oder Mengenangaben und finitem Verb", "https://grammis.ids-mannheim.de/systematische-grammatik/1626", "يفحص مطابقة الفعل مع مقادير/كميات الاسم؛ يستخدم مكملاً للقاعدة في جملة المساحة.", "لا يغني عن تحديد الفاعل والتركيب الفعلي في الجملة."),
    ("in", "DWDS: in", "https://www.dwds.de/wb/in", "يسجل الاستعمال الزمني لـin مع مدة مستقبلية مثل in vier Wochen.", "لا يحدد موعد ردّ الكفالة قانونياً."),
    ("zaehlerstand", "Duden: Zählerstand", "https://www.duden.de/rechtschreibung/Zaehlerstand", "يعرفه بأنه قراءة/حالة العداد، ويورد ablesen/notieren.", "لا يثبت رقم عداد في المحضر الخيالي."),
    ("schluessel", "Duden: Schlüssel", "https://www.duden.de/rechtschreibung/Schluessel", "يسند معنى مفتاح فتح/إغلاق القفل ومفتاح الشقة.", "لا يثبت عدد المفاتيح أو تسليمها قانونياً."),
    ("schaden", "Duden: Schaden", "https://www.duden.de/rechtschreibung/Schaden", "يسجل معنى الضرر/التلف ويورد الجمع Schäden.", "لا يثبت وجود ضرر في الشقة الخيالية."),
]
SOURCE_IDS = {row[0]: f"S{index + 1:02d}" for index, row in enumerate(SOURCE_ROWS)}
SOURCES = [
    {"id": SOURCE_IDS[key], "title": title, "url": url, "supports": supports, "limits": limits}
    for key, title, url, supports, limits in SOURCE_ROWS
]
SOURCE_BY_ID = {source["id"]: source for source in SOURCES}

WAISEN_SOURCE_KEYS = {
    "die Schutzkleidung": ["schutzkleidung"],
    "der Helm": ["helm"],
    "die Warnung": ["warnung"],
    "die Unterweisung": ["unterweisung"],
    "die Anweisung": ["anweisung"],
    "befolgen": ["befolgen"],
    "der Arbeitsunfall": ["arbeitsunfall"],
    "der Erste-Hilfe-Kasten": ["erste_hilfe_kasten"],
    "die Arbeitssicherheit": ["arbeitssicherheit"],
    "der Einstufungstest": ["goethe_levels"],
    "die Zwischenprüfung": ["zwischenpruefung"],
    "nachholen": ["nachholen"],
    "der Lernpartner": ["lernpartner"],
    "die Motivation": ["motivation"],
    "dranbleiben": ["dranbleiben"],
    "der Akzent": ["akzent"],
    "der Wortschatz": ["wortschatz"],
    "die Grammatikregel": ["grammatikregel"],
    "die Sprachschule": ["sprachschule"],
    "die Übergabe": ["uebergabe"],
    "das Protokoll": ["protokoll"],
    "streichen": ["streichen"],
    "die Wohnfläche": ["wohnflaeche"],
    "der Quadratmeter": ["quadratmeter"],
    "die Warmmiete": ["warmmiete"],
    "der Stellplatz": ["stellplatz"],
    "die Hausverwaltung": ["hausverwaltung"],
    "der Nachmieter": ["nachmieter"],
}

EXPECTED_WAISEN = {
    "d-a2-16": ["die Schutzkleidung", "der Helm", "die Warnung", "die Unterweisung", "die Anweisung", "befolgen", "der Arbeitsunfall", "der Erste-Hilfe-Kasten", "die Arbeitssicherheit"],
    "d-a2-17": ["der Einstufungstest", "die Zwischenprüfung", "nachholen", "der Lernpartner", "die Motivation", "dranbleiben", "der Akzent", "der Wortschatz", "die Grammatikregel", "die Sprachschule"],
    "d-a2-18": ["die Übergabe", "das Protokoll", "streichen", "die Wohnfläche", "der Quadratmeter", "die Warmmiete", "der Stellplatz", "die Hausverwaltung", "der Nachmieter"],
}

# Item-specific evidence, finding, and action. Each of the 42 live review units
# receives at least one published reference and its own judgment/action.
ITEM_DETAILS = {
    "d-a2-16": ("العنوان «Sicherheit in der Werkstatt» يقابله «السلامة في الورشة». فُحصت كل مفردات waisen التسع فرادى في سجل المصطلحات أدناه؛ لا يثبت معجمٌ وحده جميع وقائع السلامة في ورشة معينة.", "لا تغيير للعنوان أو المستوى؛ لا تُعمّم مدة التدريب أو معدات الموقع.", ["werkstatt", "arbeitssicherheit"]),
    "d-a2-16.lines[0]": ("Unterweisung تدل على إرشاد/تعليم، وArbeitssicherheit على السلامة المهنية؛ ArbSchG §12 يسند واجب الإرشاد لا مدة نصف الساعة الخاصة بهذه الورشة.", "لا تغيير؛ تبقى المدة خبراً داخلياً في الحوار.", ["unterweisung", "arbeitssicherheit", "arbschg_12"]),
    "d-a2-16.lines[1]": ("Helm = خوذة. السطر سؤال عن ارتداء الخوذة في القاعة، لا قاعدة عامة بأن كل عامل يرتديها دائماً.", "لا تغيير؛ لا تستنتج شرط معدات غير موصوف.", ["helm", "arbschg_15"]),
    "d-a2-16.lines[2]": ("Schutzkleidung تعني ملابس للوقاية؛ Schuh وBrille وHandschuh تسند الحذاء والنظارة والقفازات. العربية تنقل عناصر القائمة.", "لا تغيير؛ متطلبات كل نشاط/موقع تبقى سياقية.", ["schutzkleidung", "schuh", "brille", "handschuh", "arbschg_15"]),
    "d-a2-16.lines[3]": ("Anweisung تدل على توجيه/تعليمة؛ «تعليمة» مقابِل مفهوم في سؤال المتدرب.", "لا تغيير.", ["anweisung"]),
    "d-a2-16.lines[4]": ("المعنى اللغوي لـAnweisung/befolgen واضح؛ لكن «Jede Anweisung» أوسع من أن يُستنتج كحكم قانوني عام. GewO §106 وArbSchG §§12,15 لهما نطاق وحدود مختلفة.", "أُبقي السطر بوصفه قولاً داخل موقف عمل خيالي، مع تسجيل حدّه القانوني؛ لا يُعرض قاعدةً قانونية شاملة.", ["anweisung", "befolgen", "gewo_106", "arbschg_12", "arbschg_15"]),
    "d-a2-16.lines[5]": ("Arbeitsunfall هو حادث مرتبط بالعمل؛ الترجمة تسأل عمّا يحدث عند وقوعه. §10 ArbSchG ومراجع DGUV تتناول ترتيبات الإسعاف، ولا تقرر كل تسلسل واقعة بعينها.", "لا تغيير؛ لا يُدّعى أن السطر صياغة قانونية كاملة.", ["arbeitsunfall", "arbschg_10", "dguv_204_022"]),
    "d-a2-16.lines[6]": ("اسم صندوق الإسعافات وترتيب الإسعاف ثم الإبلاغ مفهوم. المراجع الرسمية تتناول التجهيزات والتنظيم، لكنها لا تثبت مكان الصندوق ولونه في هذه الورشة. «المعلّم» قد يُفهم معلماً أو حرفياً ماهراً؛ البديل «المشرف» أسلوبي محتمل لا خطأ مؤكد.", "لا تغيير للمعلومة الحوارية أو المقابل العربي دون قرينة محلية حاسمة؛ دوّنت حدود المكان/اللون في ملاحظة سياقية.", ["erste_hilfe_kasten", "meister", "asr_a4_3", "dguv_first_aid", "dguv_204_022"]),
    "d-a2-16.lines[7]": ("Warnung تعني تحذيراً، لكن صيغة السطر سؤال من المتدرب ولا تجيب عنه بقية المحادثة. ASR A1.3 يربط التصنيف بالشكل واللون والرمز؛ اللون الأصفر وحده لا يثبت النوع.", "أُبقي السؤال كما هو؛ عُدّلت خيارات السؤال q2 كي لا تفترض أن هذه اللافتة تصف صندوق الإسعافات.", ["warnung", "asr_a1_3"]),
    "d-a2-16-q1": ("المفتاح «erst, wenn sie verstanden haben» يطابق جواب Meister الحرفي؛ المشتتان يغيّران شرط الفهم أو يربطان الموضوع بحادث العمل.", "لا تغيير للمفتاح أو الشرح؛ لا يُحوّل إلى تقرير قانوني عام.", ["anweisung", "befolgen", "gewo_106"]),
    "d-a2-16-q2": ("النسخة السابقة نسبت في الشرح صفة التحذير إلى اللافتة الصفراء بلا وصف للصورة. النسخة الحالية تختبر فقط ما يقوله السطر عن التعليق/الوقوف واللون: خيار واحد يطابق «hängt … rot».", "استبدال promptDe وpromptAr والخيارات والمفتاح والشرح؛ لا يُستخدم اللون الأصفر أو موضع اللافتة كدليل على الصندوق.", ["erste_hilfe_kasten", "asr_a1_3", "asr_a4_3", "dguv_first_aid"]),
    "d-a2-16-q3": ("«eine halbe Stunde» يثبت أن عبارة «eine Stunde» خاطئة داخل هذا الحوار؛ المصدر المعجمي/القانوني لا يحدد مدة هذه الجلسة الخيالية.", "لا تغيير للإجابة falsch أو شرحها؛ لا تعميم لمدة تدريب.", ["unterweisung", "arbschg_12"]),
    "d-a2-16.dictation[0]": ("الجملة مقتبسة من السطر 2، وتحافظ على قائمة ملابس الوقاية المذكورة دون إضافة قطعة.", "لا تغيير.", ["schutzkleidung", "schuh", "brille", "handschuh"]),
    "d-a2-16.dictation[1]": ("الجملة مقتبسة من السطر 6؛ اللفظ واللون/الموضع هنا من حوار الورشة نفسه، لا من قاعدة تنظيمية عامة.", "لا تغيير؛ لا يُدّعى تحقق ميداني أو استماع صوتي.", ["erste_hilfe_kasten", "asr_a4_3", "dguv_first_aid"]),

    "d-a2-17": ("العنوان «In der Sprachschule» يقابله «في مدرسة اللغة». فُحصت مفردات waisen العشر منفردةً؛ مستوى A2 لم يُعَد تقييمه.", "لا تغيير للعنوان أو المستوى أو الوسوم.", ["sprachschule", "goethe_levels"]),
    "d-a2-17.lines[0]": ("Zwischenprüfung تسند «الامتحان النصفي/الوسيط»، وnachholen هنا أداء ما فات لاحقاً. يوم الجمعة خبر عن جدول هذه المدرسة لا واقعة عامة.", "لا تغيير؛ الموعد خاص بالحوار.", ["zwischenpruefung", "nachholen"]),
    "d-a2-17.lines[1]": ("Angst haben vor تركيب يسند معنى الخوف من جزء القواعد؛ العربية سليمة المعنى.", "لا تغيير.", ["angst"]),
    "d-a2-17.lines[2]": ("Grammatikregel قاعدة نحوية وWortschatz رصيد المفردات؛ المقابلات العربية تحافظ على تقابل القواعد/المفردات.", "لا تغيير.", ["grammatikregel", "wortschatz"]),
    "d-a2-17.lines[3]": ("السؤال «كم كلمة يومياً؟» يفتح باب نصيحة، ولا يقرر بنفسه معياراً علمياً لعدد الكلمات.", "لا تغيير؛ يُقرأ الرقم في السطر التالي بوصفه نصيحة المعلمة لا قاعدة عامة.", ["goethe_levels", "wortschatz"]),
    "d-a2-17.lines[4]": ("Lernpartner/Motivation يسندان شريك تعلم والتحفيز. Goethe يذكر اختلاف زمن التعلم بحسب الشدة ونوع الدورة والخبرة واللغة الأولى؛ لذلك «عشر كلمات» نصيحة شخصية لا معيار موحد.", "لا تغيير؛ حُفظت النصيحة دون تقديمها كحقيقة كمية عامة.", ["lernpartner", "motivation", "goethe_levels"]),
    "d-a2-17.lines[5]": ("Akzent قد يعني اللكنة، والسطر يصف تجربة Ben Ali نفسه بأن الناس لا يفهمونه دائماً؛ لا ينسب ذلك إلى لغة أو جماعة.", "لا تغيير لتقرير المتعلم عن تجربته؛ جرى تعديل رد المعلمة في السطر التالي ليتجنب ضماناً مطلقاً.", ["akzent", "cefr_phonology"]),
    "d-a2-17.lines[6]": ("الصياغة السابقة «kein Problem, wenn Sie langsam sprechen» كانت تعميمًا مطمئناً لا يراعي قول الطالب إن الآخرين لا يفهمونه دائماً. واصفات CEFR A2 تسمح بلكنة، لكنها تذكر احتمال تأثر الوضوح والحاجة إلى التكرار/تعاون المحاور. الصياغة الجديدة تشجع الوضوح وإعادة الجملة دون جعل اللكنة عيباً.", "تعديل الألمانية والعربية إلى نصيحة أدق: اللكنة طبيعية، والتحدث ببطء ووضوح، وإعادة الجملة إن لم تُفهم.", ["akzent", "cefr_phonology"]),
    "d-a2-17.lines[7]": ("Goethe يصف اختبارات تحديد المستوى المجانية وتوزيع المستويات A1–C2؛ لا يثبت ذلك نتيجة A1 الشخصية أو شهر سبتمبر المذكورين.", "لا تغيير؛ تحفظ المعلومة كخبر عن المتعلم لا كواقعة تم التحقق منها.", ["goethe_levels", "sprachschule"]),
    "d-a2-17-q1": ("«Ihr Problem ist der Wortschatz» يحدد المفردات صراحةً؛ القواعد قيل إن المتعلم يعرفها، واللكنة موضوع النصيحة التالية لا تشخيص المشكلة.", "الإجابة der Wortschatz محفوظة؛ حُدث الشرح بعد تنقيح السطر 6 لإزالة اقتباس «kein Problem» الذي لم يعد في النص.", ["wortschatz", "grammatikregel", "akzent", "cefr_phonology"]),
    "d-a2-17-q2": ("الموعد «am Freitag» منصوص عليه مباشرةً في السطر الأول؛ سبتمبر يخص اختبار تحديد المستوى لا الامتحان النصفي.", "لا تغيير للمفتاح أو الشرح.", ["zwischenpruefung", "nachholen", "goethe_levels"]),
    "d-a2-17-q3": ("الفراغ بعد einen يطابق الاسم Lernpartner كما ورد حرفياً؛ الشرح يقتبس السطر نفسه.", "لا تغيير.", ["lernpartner", "motivation"]),
    "d-a2-17.dictation[0]": ("الجملة من السطر 2 حرفياً؛ Wortschatz يقابل المفردات.", "لا تغيير.", ["wortschatz"]),
    "d-a2-17.dictation[1]": ("الجملة من السطر 6؛ Duden يسجل dranbleiben بمعنى متابعة الأمر وعدم الاستسلام.", "لا تغيير.", ["dranbleiben"]),

    "d-a2-18": ("العنوان «Wohnungsübergabe» مناسب لـ«تسليم الشقة». فُحصت المفردات التسع؛ صارت المرساة الأخيرة الاسم المفرد der Nachmieter بدلاً من عبارة فعلية موسومة اسماً.", "تحديث الوسم live waisen[8] وربطه ببطاقة مفردة مصححة؛ لا تعديل على مستوى A2.", ["uebergabe", "nachmieter"]),
    "d-a2-18.lines[0]": ("Übergabe وProtokoll وZählerstand وSchlüssel وSchäden تسند التسليم والمحضر وقراءة العداد والمفاتيح والأضرار؛ العربية تنقل القائمة.", "لا تغيير؛ المعجم لا يثبت محتويات محضر واقعي.", ["uebergabe", "protokoll", "zaehlerstand", "schluessel", "schaden"]),
    "d-a2-18.lines[1]": ("streichen في هذا السياق طلاء الجدران؛ PONS يسجل معنى دهن، وDuden يورد أمثلة الجدار الأبيض والطلاء.", "لا تغيير؛ لا نستنتج واجباً قانونياً بإعادة الطلاء.", ["streichen", "wand"]),
    "d-a2-18.lines[2]": ("الفاعل Die Wohnfläche مفرد مؤنث؛ Grammis 1628 يقرر أن الفعل يطابق الفاعل عادةً حتى مع مسند اسمي مختلف العدد، ويورد مثال Du bist zwei Personen in einer. لذلك sind خطأ مطابقة مؤكد، والصحيح ist.", "تصحيح sind إلى ist فقط؛ بقي رقم المساحة والترجمة العربية ومفتاح q3 richtig.", ["wohnflaeche", "quadratmeter", "grammis_predicative", "grammis_measure"]),
    "d-a2-18.lines[3]": ("Duden يعرّف Kaution في سياق استئجار المسكن مبلغ ضمان؛ PONS يعرض بالعربية «كفالة» و«ضمان مالي». «الضمانة» الحالية مفهومة ولا يثبت المدخلان خطأها.", "لا تغيير تخمينياً؛ البدائل «مبلغ الضمان»/«الكفالة» مسألة تحرير محلي.", ["kaution_duden", "kaution_pons"]),
    "d-a2-18.lines[4]": ("in vier Wochen تعني بعد أربعة أسابيع في السياق الزمني، لا «خلال» أربعة أسابيع؛ صُحح المقابل العربي. Abrechnung der Warmmiete والمهلة وقائع الحوار ولا يثبتها القانون قاعدةً عامة.", "استبدال «خلال» بـ«بعد» مع إبقاء الادعاء خاصاً بالحوار؛ لا إعادة صياغة ألمانية قانونية بلا سياق عقدي.", ["in", "warmmiete", "abrechnung", "bgb_548", "bgb_551", "bgb_556"]),
    "d-a2-18.lines[5]": ("Stellplatz يسند مكان إيقاف السيارة، وSchlüssel مفتاح؛ الجملة تسأل عن الموقف وتقول إن المفتاح حاضر.", "لا تغيير.", ["stellplatz", "schluessel"]),
    "d-a2-18.lines[6]": ("Nachmieter اسمٌ للمستأجر التالي؛ ظهوره بصيغة النصب den Nachmieter طبيعي في الجملة، ويرتبط بجذع البطاقة Nachmieter.", "لا تغيير للسطر الألماني أو ترجمته؛ صححنا بطاقة المصدر والوسم waisen فقط.", ["nachmieter"]),
    "d-a2-18.lines[7]": ("Hausverwaltung تقابل إدارة/مكتباً عقارياً، وeinziehen في مسكن تعني الانتقال إليه لا مجرد الدخول. صُحح «يدخل» إلى «سينتقل إلى الشقة»؛ Duden يثبت أن am Ersten هو أول يوم من الشهر.", "تصحيح الترجمة العربية فقط؛ لم يُضف اسم شهر غير مذكور.", ["hausverwaltung", "einziehen", "monatserster"]),
    "d-a2-18-q1": ("الجواب «die Wände weiß gestrichen» يطابق السطر 1؛ المشتتان ينسبان إيجاد المستأجر أو كتابة العداد إلى الشخص الخطأ.", "لا تغيير؛ الشرح يستند إلى الأدوار والنص الحي.", ["streichen", "wand", "nachmieter", "protokoll", "zaehlerstand"]),
    "d-a2-18-q2": ("المفتاح يطابق جواب المؤجر داخل الحوار؛ am Ersten موعد انتقال المستأجر التالي في السطر اللاحق، وليس موعد ردّ الكفالة. لا نعرض الأربعة أسابيع قاعدة قانونية.", "توضيح الشرح فقط؛ بقيت الخيارات والمفتاح كما هما.", ["kaution_duden", "kaution_pons", "warmmiete", "abrechnung", "bgb_551", "bgb_556", "monatserster"]),
    "d-a2-18-q3": ("بعد تصحيح الجملة، يطابق المفتاح richtig المعلومة 54 Quadratmeter؛ قاعدة Grammis تجعل ist مطابقةً للفاعل المفرد Die Wohnfläche.", "تحديث promptDe وexplanationAr إلى الصيغة الصحيحة؛ المفتاح richtig والخيارات محفوظان.", ["wohnflaeche", "quadratmeter", "grammis_predicative", "grammis_measure"]),
    "d-a2-18.dictation[0]": ("جملة الإملاء مقتبسة من السطر 0 وتكرر المصطلحات الواردة في قائمة محضر التسليم.", "لا تغيير.", ["protokoll", "zaehlerstand", "schluessel", "schaden"]),
    "d-a2-18.dictation[1]": ("الجملة مقتبسة من السطر 7؛ einziehen هنا انتقال إلى المسكن، وam Ersten أول الشهر.", "لا تغيير لجملة الإملاء الألمانية؛ الترجمة العربية المنقحة في السطر 7 توضح معنى الانتقال.", ["einziehen", "monatserster"]),
}

CORRECTED_IDS = {
    "d-a2-16-q2", "d-a2-17.lines[6]", "d-a2-17-q1",
    "d-a2-18", "d-a2-18.lines[2]", "d-a2-18.lines[4]",
    "d-a2-18.lines[7]", "d-a2-18-q2", "d-a2-18-q3",
}

BEFORE_SNAPSHOTS = {
    "d-a2-16-q2": {
        "promptDe": "Wo ist der Erste-Hilfe-Kasten?",
        "promptAr": "اختر الإجابة الصحيحة حسب الحوار.",
        "options": ["neben der Tür", "in der Halle beim gelben Schild", "beim Meister"],
        "answer": "neben der Tür",
        "explanationAr": "الدليل: «Der Erste-Hilfe-Kasten hängt neben der Tür, rot». الفخّ 1: اللافتة الصفراء تحذير. الفخّ 2: المعلّم يُبلَّغ بعد الإسعاف.",
    },
    "d-a2-17.lines[6]": {
        "who": "Lehrerin",
        "de": "Der Akzent ist kein Problem, wenn Sie langsam sprechen. Wichtig ist: dranbleiben.",
        "ar": "اللكنة ليست مشكلة إذا تكلمت ببطء. المهم: الاستمرار.",
    },
    "d-a2-17-q1": {
        "explanationAr": "الدليل: «Ihr Problem ist der Wortschatz: zu wenige Wörter». الفخّ 1: القواعد «kennen Sie». الفخّ 2: اللكنة «kein Problem».",
    },
    "d-a2-18": {
        "waisen": ["die Übergabe", "das Protokoll", "streichen", "die Wohnfläche", "der Quadratmeter", "die Warmmiete", "der Stellplatz", "die Hausverwaltung", "die Nachmieter suchen"],
    },
    "d-a2-18.lines[2]": {
        "who": "Vermieter",
        "de": "Sehr gut, das sehe ich. Die Wohnfläche sind 54 Quadratmeter, alles sauber.",
        "ar": "ممتاز، أرى ذلك. مساحة السكن 54 متراً مربعاً، كل شيء نظيف.",
    },
    "d-a2-18.lines[4]": {
        "ar": "نعم، خلال أربعة أسابيع، بعد آخر تسوية للإيجار الشامل.",
    },
    "d-a2-18.lines[7]": {
        "who": "Mieter",
        "de": "Nein, die Hausverwaltung hat ihn gefunden. Er zieht am Ersten ein.",
        "ar": "لا، إدارة العقار وجدته. يدخل في الأول من الشهر.",
    },
    "d-a2-18-q2": {
        "explanationAr": "الدليل: «in vier Wochen, nach der letzten Abrechnung der Warmmiete». الفخّ 1: الأول من الشهر موعد دخول المستأجر التالي. الفخّ 2: التسليم الآن.",
    },
    "d-a2-18-q3": {
        "promptDe": "Die Wohnfläche sind 54 Quadratmeter.",
        "explanationAr": "الدليل: «Die Wohnfläche sind 54 Quadratmeter, alles sauber».",
        "answer": "richtig",
    },
}

DIALOGUE_CHANGED_FIELDS = [
    "d-a2-16.questions[d-a2-16-q2].promptDe",
    "d-a2-16.questions[d-a2-16-q2].promptAr",
    "d-a2-16.questions[d-a2-16-q2].options",
    "d-a2-16.questions[d-a2-16-q2].answer",
    "d-a2-16.questions[d-a2-16-q2].explanationAr",
    "d-a2-17.lines[6].de",
    "d-a2-17.lines[6].ar",
    "d-a2-17.questions[d-a2-17-q1].explanationAr",
    "d-a2-18.lines[2].de",
    "d-a2-18.lines[4].ar",
    "d-a2-18.lines[7].ar",
    "d-a2-18.questions[d-a2-18-q2].explanationAr",
    "d-a2-18.questions[d-a2-18-q3].promptDe",
    "d-a2-18.questions[d-a2-18-q3].explanationAr",
    "d-a2-18.waisen[8]",
]
VOCAB_CHANGED_FIELDS = [
    "vd-wohnen-021.de", "vd-wohnen-021.ar", "vd-wohnen-021.article",
    "vd-wohnen-021.plural", "vd-wohnen-021.farbe",
    "vd-wohnen-021.exampleDe", "vd-wohnen-021.exampleAr",
]

OPEN_NOTES = [
    {
        "id": "d-a2-16.lines[7]",
        "status": "غير محسوم سياقياً",
        "sources": ["warnung", "asr_a1_3"],
        "relatedItemIds": ["d-a2-16.lines[7]", "d-a2-16-q2"],
        "finding": "الحوار ينتهي بسؤال المتدرب عن اللافتة ولا يصف رمزها أو يجيب عنه. وفق ASR A1.3 لا يكفي اللون الأصفر وحده لتصنيف علامة السلامة. لذلك لا نقرر أن اللافتة تحذير، ولا نجعلها دليلاً على صندوق الإسعافات؛ خيارات q2 المنقحة لا تعتمد عليها.",
    },
    {
        "id": "d-a2-16.lines[4]",
        "status": "غير محسوم سياقياً",
        "sources": ["anweisung", "befolgen", "gewo_106", "arbschg_12", "arbschg_15"],
        "relatedItemIds": ["d-a2-16.lines[4]", "d-a2-16-q1"],
        "finding": "الجملة تقول Jede Anweisung، لكن المصادر الرسمية التي فُحصت تقرر نطاقات مختلفة للتوجيه والتدريب وواجبات العامل؛ لا تثبت قاعدة قانونية مطلقة بوجوب كل تعليمة. تبقى الجملة قولاً حوارياً في الورشة لا حكماً قانونياً عاماً.",
    },
    {
        "id": "d-a2-18.lines[4]",
        "status": "غير محسوم سياقياً",
        "sources": ["warmmiete", "abrechnung", "bgb_548", "bgb_551", "bgb_556"],
        "relatedItemIds": ["d-a2-18.lines[4]", "d-a2-18-q2"],
        "finding": "عبارة Abrechnung der Warmmiete والمهلة بعد أربعة أسابيع من كلام شخصيتين في حالة غير موصوفة. أحكام BGB التي فُحصت لا تجعل أربعة أسابيع مهلة عامة لرد Kaution، ولا تثبت أن العبارة مصطلح قانوني دقيق. لم يُستبدل المصطلح تخميناً.",
    },
]

STYLE_NOTES = [
    {
        "id": "d-a2-17.lines[4]",
        "alternative": "قد تُذكر «عشر كلمات يومياً» كنصيحة شخصية لا كهدف يصلح للجميع.",
        "reason": "Goethe-Institut يذكر اختلاف أزمنة التعلم بحسب نوع الدورة وشدتها وخبرة التعلم واللغة الأولى؛ لا يثبت مصدراً معيارياً لعدد عشر كلمات يومياً. لأن السطر نصيحة حوارية، لم يُعدّل ولم يُعمّم.",
        "sources": ["goethe_levels"],
    },
    {
        "id": "d-a2-18.lines[3].ar",
        "alternative": "«هل أسترد مبلغ الضمان قريباً؟» أو «هل أسترد الكفالة قريباً؟».",
        "reason": "Duden يثبت معنى Kaution كضمان إيجار، وPONS يورد «كفالة» و«ضمان مالي». لا دليل يحسم خطأ المقابل الحي «الضمانة» في العربية المحلية؛ تُرك دون تعديل تخميني.",
        "sources": ["kaution_duden", "kaution_pons"],
    },
    {
        "id": "d-a2-16.lines[6].ar",
        "alternative": "«المشرف» أو «مشرف الورشة» بدلاً من «المعلّم».",
        "reason": "Duden يذكر لـMeister معنى المشرف/صاحب التأهيل في المؤسسة؛ لكن «المعلّم» قد يُستعمل عربياً للحرفي الماهر. لا يُثبت المصدر أن الحي خطأ، لذلك لم يتغير.",
        "sources": ["meister"],
    },
]

HISTORICAL_COMPARISONS = [
    ("d-a2-16-q2.explanationAr", "الدليل: «Der Erste-Hilfe-Kasten hängt neben der Tür, rot». الفخّ 1: اللافتة الصفراء تحذير. الفخّ 2: المعلّم يُبلَّغ بعد الإسعاف.", "الدليل: «Der Erste-Hilfe-Kasten hängt neben der Tür, rot». يثبت السطر مكان الصندوق وطريقة تعليقه ولونه. الفخّ: اعتبار «das gelbe Schild» دليلاً على أن الصندوق أصفر أو أن اللافتة تحذير؛ لا يذكر الحوار ذلك.", "تظهر الصياغة الأولى في ملف الإنشاء؛ استُبدلت لأن الحوار لا يصف علامة السلامة."),
    ("d-a2-17.lines[6].de", "Der Akzent ist kein Problem, wenn Sie langsam sprechen. Wichtig ist: dranbleiben.", "Ein Akzent ist normal. Sprechen Sie langsam und deutlich. Wenn man Sie nicht versteht, wiederholen Sie den Satz. Wichtig ist: dranbleiben.", "ملف الإنشاء يحفظ العبارة الأولى؛ نقّحت بعد مقابلة الطمأنة مع واصفات A2 عن الوضوح والتكرار."),
    ("d-a2-17.lines[6].ar", "اللكنة ليست مشكلة إذا تكلمت ببطء. المهم: الاستمرار.", "اللكنة أمر طبيعي. تحدّث ببطء ووضوح. وإذا لم يفهمك الآخرون، فأعِد الجملة. المهم: واصل التعلّم.", "تحديث عربي مطابق للتنقيح التربوي المقيّد، لا تعميم على جماعة لغوية."),
    ("d-a2-17-q1.explanationAr", "الدليل: «Ihr Problem ist der Wortschatz: zu wenige Wörter». الفخّ 1: القواعد «kennen Sie». الفخّ 2: اللكنة «kein Problem».", "الدليل: «Ihr Problem ist der Wortschatz: zu wenige Wörter». الفخّ 1: القواعد «kennen Sie». أمّا اللكنة فهي موضوع نصيحة لاحقة، لا السبب الذي سمّته المعلمة.", "عُدّل الشرح كي لا يقتبس من عبارة حُذفت."),
    ("d-a2-18.lines[2].de", "Sehr gut, das sehe ich. Die Wohnfläche sind 54 Quadratmeter, alles sauber.", "Sehr gut, das sehe ich. Die Wohnfläche ist 54 Quadratmeter, alles sauber.", "تصحيح مطابقة الفعل للفاعل المفرد، استناداً إلى Grammis 1628."),
    ("d-a2-18.lines[4].ar", "نعم، خلال أربعة أسابيع، بعد آخر تسوية للإيجار الشامل.", "نعم، بعد أربعة أسابيع، عقب آخر تسوية للإيجار الشامل.", "in vier Wochen مدة زمنية مستقبلية؛ عُدّل «خلال» إلى «بعد» مع إبقاء الحد القانوني غير محسوم."),
    ("d-a2-18.lines[7].ar", "لا، إدارة العقار وجدته. يدخل في الأول من الشهر.", "لا، إدارة العقار وجدته. سينتقل إلى الشقة في الأول من الشهر.", "einziehen في سياق المسكن يعني الانتقال إليه لا مجرد الدخول."),
    ("d-a2-18-q2.explanationAr", "الدليل: «in vier Wochen, nach der letzten Abrechnung der Warmmiete». الفخّ 1: الأول من الشهر موعد دخول المستأجر التالي. الفخّ 2: التسليم الآن.", "الدليل: «in vier Wochen, nach der letzten Abrechnung der Warmmiete». الفخّ: موعد «am Ersten» هو انتقال المستأجر التالي إلى الشقة، لا موعد ردّ الكفالة.", "تحرير الشرح لتعيين مرجع am Ersten بوضوح؛ لم تتغير الإجابة."),
    ("d-a2-18-q3.promptDe", "Die Wohnfläche sind 54 Quadratmeter.", "Die Wohnfläche ist 54 Quadratmeter.", "نُقلت إلى الجملة الألمانية المصححة مع الإبقاء على المفتاح richtig."),
    ("d-a2-18-q3.explanationAr", "الدليل: «Die Wohnfläche sind 54 Quadratmeter, alles sauber».", "الدليل: «Die Wohnfläche ist 54 Quadratmeter, alles sauber». الفاعل المفرد «Die Wohnfläche» يقتضي «ist»؛ وتبقى الإجابة «richtig» لأن المعلومة صحيحة بعد التصحيح.", "الشرح صار يقتبس الصيغة الحية الصحيحة وسببها."),
    ("d-a2-18.waisen[8]", "die Nachmieter suchen", "der Nachmieter", "استبدال وسم فعلي موسوم Nomen بمدخل اسم مفرد يصلح بطاقة وربطاً صرفياً."),
]

VERIFICATION = {
    "typescript": {"command": "./node_modules/.bin/tsc --noEmit", "result": "نجح"},
    "smoke": {"command": "npm run smoke", "passed": 1148, "failed": 0, "gates": "K183a–h + previous gates"},
    "interaktiv": {"command": "npm run interaktiv", "passed": 699, "failed": 0, "note": "نجح؛ jsdom طبع تحذيرات play()/pause() غير المنفذة، فلا تُعدّ اختباراً للصوت"},
    "contentAudit": {"command": "npm run audit:content", "result": "نجح؛ صفر عيوب بنيوية مؤكدة", "confirmedStructuralDefects": 0, "nonblockingHeuristicFlags": {"shortA0Dialogues": 2, "fewExerciseCandidates": 7, "daysEstimatedOver200Minutes": 155, "nounArticleCandidates": 6, "interpretation": "مؤشرات مراجعة يدوية/تربوية لا تثبت عيباً؛ لم تُعدّل ضمن R109"}},
    "build": {"command": "npm run build", "result": "نجح", "staticPages": 11},
    "npmAudit": {"command": "npm audit --no-fund", "result": "نجح؛ found 0 vulnerabilities", "vulnerabilities": 0},
    "patchIdempotence": {"command": "python3 scripts/patches/review_a2_dialogues_07.py", "result": "نجحت؛ 0 حقول تغيرت و0 ملفات كُتبت في إعادة التطبيق"},
    "gitDiffCheck": {"command": "git diff --check", "result": "نجح"},
}


def source_ids(keys):
    ids = []
    for key in keys:
        if key not in SOURCE_IDS:
            raise SystemExit(f"Unknown source key {key}")
        source_id = SOURCE_IDS[key]
        if source_id not in ids:
            ids.append(source_id)
    return ids


def dialogue_map(data):
    result = {dialogue.get("id"): dialogue for dialogue in data}
    if len(result) != len(data):
        raise SystemExit("Duplicate dialogue ids in live content")
    return result


def question_map(dialogue):
    result = {question.get("id"): question for question in dialogue.get("questions", [])}
    if len(result) != len(dialogue.get("questions", [])):
        raise SystemExit(f"Duplicate question ids in {dialogue.get('id')}")
    return result


def build_waisen_audit(dialogue_by_id):
    audit = []
    for dialogue_id in ("d-a2-16", "d-a2-17", "d-a2-18"):
        terms = dialogue_by_id[dialogue_id].get("waisen", [])
        if terms != EXPECTED_WAISEN[dialogue_id]:
            raise SystemExit(f"Live waisen sequence changed unexpectedly for {dialogue_id}: {terms}")
        for term in terms:
            keys = WAISEN_SOURCE_KEYS.get(term)
            if not keys:
                raise SystemExit(f"No individually assigned source for waisen term {term}")
            support_text = " ".join(SOURCE_ROWS[next(i for i, row in enumerate(SOURCE_ROWS) if row[0] == key)][3] for key in keys)
            audit.append({
                "dialogueId": dialogue_id,
                "term": term,
                "sources": source_ids(keys),
                "finding": f"فُحص المدخل المعجمي/المؤسسي الخاص بـ{term} منفرداً؛ {support_text}",
                "action": "الإبقاء على الوسم ما دام معناه وسياقه في الحوار لا يثبتان خطأً؛ لا يجعل مصدر اللفظة وحده الجملة أو الواقعة حقيقة عامة.",
                "linkedCardId": "vd-wohnen-021" if term == "der Nachmieter" else None,
            })
    if len(audit) != 28 or len({entry["term"] for entry in audit}) != 28:
        raise SystemExit(f"Expected 28 distinct waisen terms, found {len(audit)}")
    return audit


def unit_sources_and_note(item_id):
    detail = ITEM_DETAILS.get(item_id)
    if not detail:
        raise SystemExit(f"Missing individual finding/action for {item_id}")
    finding, action, keys = detail
    return finding, action, source_ids(keys)


def make_meta(dialogue):
    item_id = dialogue["id"]
    finding, action, ids = unit_sources_and_note(item_id)
    term_keys = []
    for term in dialogue["waisen"]:
        term_keys.extend(WAISEN_SOURCE_KEYS[term])
    ids = list(dict.fromkeys(ids + source_ids(term_keys)))
    item = {
        "id": item_id,
        "kind": "بيانات الحوار/العنوان/وسوم waisen",
        "status": "مُصحح" if item_id in CORRECTED_IDS else "سليم",
        "sources": ids,
        "finding": finding,
        "action": action,
        "reviewed": {
            "titleDe": dialogue["titleDe"],
            "titleAr": dialogue["titleAr"],
            "level": dialogue["level"],
            "lineCount": len(dialogue["lines"]),
            "questionCount": len(dialogue["questions"]),
            "dictationCount": len(dialogue["dictation"]),
            "neu": dialogue.get("neu"),
            "hasWaisen": isinstance(dialogue.get("waisen"), list),
            "waisen": dialogue["waisen"],
        },
    }
    if item_id in BEFORE_SNAPSHOTS:
        item["before"] = BEFORE_SNAPSHOTS[item_id]
    return item


def make_line(dialogue, index):
    item_id = f"{dialogue['id']}.lines[{index}]"
    line = dialogue["lines"][index]
    finding, action, ids = unit_sources_and_note(item_id)
    item = {
        "id": item_id,
        "kind": "سطر ألماني/ترجمته",
        "status": "مُصحح" if item_id in CORRECTED_IDS else "سليم",
        "sources": ids,
        "finding": finding,
        "action": action,
        "reviewed": line,
    }
    if item_id in BEFORE_SNAPSHOTS:
        item["before"] = BEFORE_SNAPSHOTS[item_id]
    return item


def make_question(dialogue, question):
    item_id = question["id"]
    finding, action, ids = unit_sources_and_note(item_id)
    item = {
        "id": item_id,
        "kind": "سؤال/خيارات/مفتاح/شرح",
        "status": "مُصحح" if item_id in CORRECTED_IDS else "سليم",
        "sources": ids,
        "finding": finding,
        "action": action,
        "reviewed": question,
    }
    if item_id in BEFORE_SNAPSHOTS:
        item["before"] = BEFORE_SNAPSHOTS[item_id]
    return item


def make_dictation(dialogue, index, sentence):
    item_id = f"{dialogue['id']}.dictation[{index}]"
    finding, action, ids = unit_sources_and_note(item_id)
    if not any(sentence in line["de"] for line in dialogue["lines"]):
        raise SystemExit(f"Dictation sentence is not attested in its live dialogue: {item_id}")
    return {
        "id": item_id,
        "kind": "جملة إملاء",
        "status": "سليم",
        "sources": ids,
        "finding": finding,
        "action": action,
        "reviewed": {"sentence": sentence},
    }


def audit_association(dialogue_by_id, card, apply_source):
    dialogue = dialogue_by_id["d-a2-18"]
    sentence = dialogue["lines"][6]["de"]
    term = dialogue["waisen"][8]
    stem = re.sub(r"^(der|die|das|sich)\s+", "", term.lower()).split()[0]
    stem = stem[:max(4, len(stem) - 2)]
    low = re.sub(r"[^a-zäöüß0-9 ]", " ", sentence.lower().replace("é", "e"))
    if term != card.get("de") or stem != "nachmiet" or stem not in low or "den Nachmieter" not in sentence:
        raise SystemExit("The live den Nachmieter surface no longer links to its source card by apply_dialoge.py stem")
    if not all(anchor in apply_source for anchor in ("def stamm(w):", "max(4,len(x)-2)", "stamm(w) not in low", 'cards={c["de"]:c')):
        raise SystemExit("apply_dialoge.py no longer has the inspected exact-card/stem-linking contract")
    return {
        "script": APPLY_DIALOGUE_PATH,
        "waisenTerm": term,
        "surfaceInDialogue": "den Nachmieter",
        "dialogueLineId": "d-a2-18.lines[6]",
        "sourceCardId": card["id"],
        "sourceCardDe": card["de"],
        "sourceCardLevel": card["level"],
        "stemRule": "lowercase; remove der/die/das/sich; first token; slice max(4, len-2)",
        "calculatedStem": stem,
        "surfaceContainsStem": stem in low,
        "exactCardExists": term == card.get("de"),
        "verifiedAgainstScriptAnchors": True,
        "note": "This reproduces the validator's matching test without executing its write-capable dialogue generator against production JSON.",
    }


def scan_audio(dialogue_ids):
    manifest = json.loads(AUDIO_PATH.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", []) if isinstance(manifest, dict) else []
    matches = [entry for entry in entries if entry.get("id") in dialogue_ids]
    public_matches = []
    public_root = ROOT / "public"
    if public_root.exists():
        for path in public_root.rglob("*"):
            if path.is_file() and re.search(r"d-a2-(16|17|18)", path.name):
                public_matches.append({"path": path.relative_to(ROOT).as_posix(), "bytes": path.stat().st_size})
    return matches, public_matches


def md_cell(value):
    return str(value).replace("|", "\\|").replace("\n", "<br>").strip()


def snapshot_for_markdown(item):
    reviewed = item["reviewed"]
    if item["kind"] == "بيانات الحوار/العنوان/وسوم waisen":
        return f"{reviewed['titleDe']} / {reviewed['titleAr']}؛ {reviewed['level']}؛ {len(reviewed['waisen'])} waisen: " + ", ".join(reviewed["waisen"])
    if item["kind"] == "سطر ألماني/ترجمته":
        return f"DE: {reviewed.get('de', '')}<br>AR: {reviewed.get('ar', '')}"
    if item["kind"] == "سؤال/خيارات/مفتاح/شرح":
        prompt = reviewed.get("promptDe", reviewed.get("promptAr", ""))
        options = reviewed.get("options", [])
        answer = reviewed.get("answer", "")
        return f"السؤال: {prompt}<br>الخيارات: {options}<br>المفتاح: {answer}<br>الشرح: {reviewed.get('explanationAr', '')}"
    return reviewed.get("sentence", "")


def build_markdown(report):
    coverage = report["coverage"]
    counts = report["statusCounts"]
    out = [
        "# تقرير المراجعة المصدرية R109 — حوارات A2 16–18",
        "",
        f"**التاريخ:** {report['date']} · **القاعدة:** {report['reviewRule']} · **الدفعة:** {report['batch']}",
        "",
        f"**التغطية:** {coverage['totalTrackedItems']} وحدة: {coverage['dialogueMetadata']} بيانات حوار، {coverage['lines']} سطراً، {coverage['questions']} أسئلة، {coverage['dictationSentences']} جمل إملاء. "
        f"**الحكم:** {counts['سليم']} سليماً، {counts['مُصحح']} مصححاً، {counts['غير محسوم']} وحدة غير محسومة؛ "
        f"{coverage['waisenTermsReviewed']} مفردة waisen فُحصت منفردةً و{len(report['sources'])} مرجعاً منشوراً.",
        "",
        "> مراجعة مساعد ذكاء اصطناعي مستندة إلى مصادر منشورة؛ ليست مراجعة بشرية أو اعتماداً لغوياً أو قانونياً أو مهنياً. كل مصدر مقيد بما يسنده ولا يُعامل المدخل المعجمي دليلاً على جملة كاملة.",
        "",
        "## ما تغير",
        "",
        "- `d-a2-16-q2`: استبدلت الخيارات التي كانت تفترض أن اللافتة الصفراء تحذير بخيارات متوازية لاختبار تعليق الصندوق/وقوفه ولونه؛ بقيت إجابة واحدة يثبتها السطر.",
        "- `d-a2-17.lines[6]`: خُففت عبارة أن اللكنة «ليست مشكلة» إذا تكلم المتعلم ببطء؛ النص الجديد يطبع اللكنة ويطلب الوضوح وإعادة الجملة إذا لم تُفهم، اتساقاً مع واصفات CEFR A2.",
        "- `d-a2-17-q1.explanationAr`: حُذف اقتباس «kein Problem» الذي لم يعد في السطر بعد تنقيحه؛ المفتاح `der Wortschatz` لم يتغير.",
        "- `d-a2-18.lines[2].de`: `Die Wohnfläche sind` ← `Die Wohnfläche ist` بدليل Grammis 1628؛ `d-a2-18-q3.promptDe` وشرحه يقتبسان الصيغة الصحيحة، مع إبقاء `answer: richtig`.",
        "- `d-a2-18.lines[4].ar`: صُحح معنى `in vier Wochen` من «خلال» إلى «بعد» أربعة أسابيع. و`lines[7].ar` يترجم `zieht … ein` إلى «سينتقل إلى الشقة» لا «يدخل».",
        "- `d-a2-18-q2.explanationAr`: أوضح أن `am Ersten` موعد انتقال المستأجر التالي لا رد الكفالة؛ لم تتغير الخيارات أو الإجابة.",
        "- `d-a2-18.waisen[8]` والبطاقة `vd-wohnen-021`: `die Nachmieter suchen` صارت `der Nachmieter` مع `article`, `plural`, `farbe` ومثال مفرد؛ حُدّث صف المصدر وخريطة الجمع.",
        "",
        f"عدد حقول JSON المتغيرة: {report['contentPatch']['dialogueFieldsChanged']} في الحوارات + {report['contentPatch']['vocabularyFieldsChanged']} في بطاقة المفردات = {report['contentPatch']['fieldsChanged']}. لم تتغير مقارنة CEFR أو النسبة أو حساب المستوى.",
        "",
        "## سجل الوحدات الـ42",
        "",
        "| المعرّف | النوع | الحكم | اللقطة الحية بعد المراجعة | الدليل/الحكم والإجراء | المصادر |",
        "|---|---|---|---|---|---|",
    ]
    for item in report["items"]:
        out.append(
            f"| `{md_cell(item['id'])}` | {md_cell(item['kind'])} | {md_cell(item['status'])} | {md_cell(snapshot_for_markdown(item))} | {md_cell(item['finding'])}<br><b>الإجراء:</b> {md_cell(item['action'])} | {', '.join(item['sources'])} |"
        )
    out.extend([
        "",
        "## تدقيق مفردات waisen (28 مدخلاً فردياً)",
        "",
        "| الحوار | المفردة | الدليل/الحكم | الإجراء | المصدر |",
        "|---|---|---|---|---|",
    ])
    for entry in report["waisenTermAudit"]:
        out.append(f"| `{entry['dialogueId']}` | `{md_cell(entry['term'])}` | {md_cell(entry['finding'])} | {md_cell(entry['action'])} | {', '.join(entry['sources'])} |")
    out.extend([
        "",
        "## البطاقة المرتبطة واختبار الربط",
        "",
        f"- قبل: `{report['vocabularyCardPatch']['before']['de']}` — {report['vocabularyCardPatch']['before']['ar']}",
        f"- بعد: `{report['vocabularyCardPatch']['after']['de']}` — {report['vocabularyCardPatch']['after']['ar']}; article `{report['vocabularyCardPatch']['after']['article']}`, plural `{report['vocabularyCardPatch']['after']['plural']}`, farbe `{report['vocabularyCardPatch']['after']['farbe']}`.",
        f"- `apply_dialoge.py`: السطح `den Nachmieter` يحتوي الجذع المحسوب `{report['associationAudit']['calculatedStem']}`، والوسم `der Nachmieter` يطابق مدخل البطاقة. لم يُشغّل مولد الحوارات ذي الكتابة على ملف الإنتاج.",
        "",
        "## ملاحظات سياقية غير محسومة — ليست أخطاء لغوية مثبتة",
        "",
        "| المعرّف | الدليل وحدوده | المصادر |",
        "|---|---|---|",
    ])
    for note in report["openNotes"]:
        out.append(f"| `{note['id']}` | {md_cell(note['finding'])} | {', '.join(note['sources'])} |")
    out.extend([
        "",
        "## بدائل أسلوبية/تربوية — لا تُعامل كأخطاء مؤكدة",
        "",
        "| المعرّف | البديل | السبب/الحد | المصادر |",
        "|---|---|---|---|",
    ])
    for note in report["styleNotes"]:
        out.append(f"| `{note['id']}` | {md_cell(note['alternative'])} | {md_cell(note['reason'])} | {', '.join(note['sources'])} |")
    out.extend([
        "",
        "## المقارنة التاريخية المحدودة",
        "",
        report["historicalPatchReview"]["role"],
        "",
        "| المعرّف | النص في ملف الإنشاء الأولي | النص الحي بعد المراجعة | الملاحظة |",
        "|---|---|---|---|",
    ])
    for row in report["historicalPatchReview"]["comparisons"]:
        out.append(f"| `{row['id']}` | {md_cell(row['historicalText'])} | {md_cell(row['liveText'])} | {md_cell(row['observation'])} |")
    out.extend([
        "",
        "## إصلاح أمني مؤكد للتبعيات",
        "",
        f"`npm audit` كشف ثغرتين عاليتَي الخطورة في تبعيات متعدية؛ أُصلحتا بتحديثين متوافقين في `{report['dependencySecurity']['lockfile']}` فقط، ولم يتغير `package.json`. التحقق النظيف بعد `npm ci` أظهر صفراً من الثغرات.",
        "",
        "| الحزمة | قبل | بعد | المرجع الأمني |",
        "|---|---|---|---|",
    ])
    for package in report["dependencySecurity"]["packages"]:
        out.append(f"| `{package['name']}` | {package['before']} | {package['after']} | [{package['advisory']}]({package['advisory']}) |")
    out.extend([
        "",
        "## تدقيق الصوت والاختبارات",
        "",
        "- سجل الصوت وملفات `public` المطابقة: **0**؛ لم يحدث تشغيل أو استماع أو تحقق من النطق.",
        f"- TypeScript: `{report['verification']['typescript']['result']}`؛ smoke: {report['verification']['smoke']['passed']}/{report['verification']['smoke']['failed']} (ناجح/فاشل)؛ interaktiv: {report['verification']['interaktiv']['passed']}/{report['verification']['interaktiv']['failed']}.",
        f"- audit:content: `{report['verification']['contentAudit']['result']}`؛ build: `{report['verification']['build']['result']}` ({report['verification']['build']['staticPages']} صفحة ساكنة)؛ npm audit: {report['verification']['npmAudit']['vulnerabilities']} ثغرة.",
        f"- مؤشرات audit:content غير البنيوية التي بقيت للمراجعة اليدوية فقط: {report['verification']['contentAudit']['nonblockingHeuristicFlags']['shortA0Dialogues']} حوارات A0 قصيرة، {report['verification']['contentAudit']['nonblockingHeuristicFlags']['fewExerciseCandidates']} مرشحات تمارين قليلة، {report['verification']['contentAudit']['nonblockingHeuristicFlags']['daysEstimatedOver200Minutes']} تقديراً يومياً فوق 200 دقيقة، و{report['verification']['contentAudit']['nonblockingHeuristicFlags']['nounArticleCandidates']} مرشحات مقالات أسماء؛ لا تُعاملها البوابة عيوباً مؤكدة ولم تُعدّل في R109."
        f"- إعادة تشغيل رقعة R109: `{report['verification']['patchIdempotence']['result']}`؛ `git diff --check`: `{report['verification']['gitDiffCheck']['result']}`.",
        "",
        "## سجل المصادر المنشورة وحدودها",
        "",
        "| ID | المصدر | الرابط | ما يسنده وحدوده |",
        "|---|---|---|---|",
    ])
    for source in report["sources"]:
        out.append(f"| {source['id']} | {md_cell(source['title'])} | [{source['url']}]({source['url']}) | {md_cell(source['supports'])}<br>**الحد:** {md_cell(source['limits'])} |")
    out.extend([
        "",
        "## حدود المراجعة",
        "",
    ])
    out.extend(f"- {limitation}" for limitation in report["limitations"])
    out.extend([
        "",
        "## إعادة الإنتاج والبوابات",
        "",
        f"- رقعة المحتوى المحروسة: `{PATCH_PATH}`؛ مولّد التقرير: `{REPORT_SCRIPT_PATH}`؛ بوابات K183a–h في `scripts/engine_smoke.ts`.",
        "- لا تحل البوابات محل الحكم اللغوي أو المراجعة البشرية؛ ولا تثبت أداء المتعلم أو صحة الواقعة الخيالية.",
        "",
    ])
    return "\n".join(out)


def main():
    dialogues_raw = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    vocab = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    dialogues = dialogue_map(dialogues_raw)
    selected = [dialogues[key] for key in ("d-a2-16", "d-a2-17", "d-a2-18") if key in dialogues]
    if [item["id"] for item in selected] != ["d-a2-16", "d-a2-17", "d-a2-18"]:
        raise SystemExit("R109 live-dialogue sequence is incomplete or out of expected order")
    if any(item.get("level") != "A2" or len(item.get("lines", [])) != 8 or len(item.get("questions", [])) != 3 or len(item.get("dictation", [])) != 2 for item in selected):
        raise SystemExit("R109 dialogue shape differs from the reviewed 42-unit scope")

    items = []
    for dialogue in selected:
        if [q.get("id") for q in dialogue["questions"]] != [f"{dialogue['id']}-q{i}" for i in range(1, 4)]:
            raise SystemExit(f"Unexpected question order in {dialogue['id']}")
        items.append(make_meta(dialogue))
        items.extend(make_line(dialogue, index) for index in range(len(dialogue["lines"])))
        items.extend(make_question(dialogue, question) for question in dialogue["questions"])
        items.extend(make_dictation(dialogue, index, sentence) for index, sentence in enumerate(dialogue["dictation"]))
    if len(items) != 42 or len({item["id"] for item in items}) != 42:
        raise SystemExit(f"Expected 42 unique reviewed units, found {len(items)}")

    status_counts = Counter(item["status"] for item in items)
    expected_statuses = {"سليم": 33, "مُصحح": 9, "غير محسوم": 0}
    actual_statuses = {key: status_counts.get(key, 0) for key in expected_statuses}
    if actual_statuses != expected_statuses:
        raise SystemExit(f"Unexpected item status distribution: {actual_statuses}")

    waisen_audit = build_waisen_audit(dialogues)
    card = next((c for deck in vocab.values() for c in deck.get("cards", []) if c.get("id") == "vd-wohnen-021"), None)
    if card is None:
        raise SystemExit("Live vocabulary card vd-wohnen-021 not found")
    expected_card = {
        "de": "der Nachmieter", "ar": "المستأجرُ البديلُ", "pos": "Nomen", "article": "der",
        "plural": "die Nachmieter", "farbe": "BLAU", "exampleDe": "Ich suche einen Nachmieter für die Wohnung.",
        "exampleAr": "أبحثُ عن مستأجرٍ بديلٍ للشقة.", "level": "A2", "tags": ["wohnen"],
    }
    for field, value in expected_card.items():
        if card.get(field) != value:
            raise SystemExit(f"Unexpected live {CARD_SOURCE_PATH} card field {field}: {card.get(field)!r}")
    if card.get("aussprache") != "ch بعدَ a/o/u = خاء، وبعدَ i/e = «هش» رقيقة":
        raise SystemExit("The original phonetic note is not preserved on vd-wohnen-021")

    wave_text = (ROOT / CARD_SOURCE_PATH).read_text(encoding="utf-8")
    plural_text = (ROOT / PLURAL_SOURCE_PATH).read_text(encoding="utf-8")
    if ' ("der Nachmieter","المستأجرُ البديلُ","der","die Nachmieter","Ich suche einen Nachmieter für die Wohnung.","أبحثُ عن مستأجرٍ بديلٍ للشقة.","wohnen"),' not in wave_text:
        raise SystemExit("The vocabulary-wave source row is not synchronized with the reviewed card")
    if '"vd-wohnen-021": "die Nachmieter"' not in plural_text:
        raise SystemExit("The plural map lacks the corrected Nachmieter entry")
    apply_dialogue_text = (ROOT / APPLY_DIALOGUE_PATH).read_text(encoding="utf-8")
    association_audit = audit_association(dialogues, card, apply_dialogue_text)

    creation_text = (ROOT / CREATION_PATH).read_text(encoding="utf-8")
    old_question_text = (ROOT / OLD_QUESTION_PATCH_PATH).read_text(encoding="utf-8")
    historical_comparisons = []
    for item_id, historical, current, observation in HISTORICAL_COMPARISONS:
        if historical not in creation_text:
            raise SystemExit(f"Historical creation-source anchor not found for {item_id}")
        historical_comparisons.append({"id": item_id, "historicalText": historical, "liveText": current, "observation": observation})
    if any(dialogue_id in old_question_text for dialogue_id in ("d-a2-16", "d-a2-17", "d-a2-18")):
        raise SystemExit("a_dialog_fallen.py now contains an R109 target; review its historical scope")

    manifest_matches, public_matches = scan_audio({"d-a2-16", "d-a2-17", "d-a2-18"})
    audio_audit = []
    for entry in manifest_matches:
        rel = entry.get("file", "")
        path = ROOT / "public" / rel.lstrip("/")
        audio_audit.append({"id": entry.get("id"), "file": rel, "exists": path.is_file(), "bytes": path.stat().st_size if path.is_file() else None, "playedOrHeard": False})
    for entry in public_matches:
        if not any(record.get("file", "").lstrip("/") == entry["path"].removeprefix("public/") for record in audio_audit):
            audio_audit.append({"id": "filename-match", **entry, "manifestEntry": False, "playedOrHeard": False})

    # Resolve every source key used by units, notes, and the card/link audit.
    all_source_keys = set()
    for item in items:
        detail = ITEM_DETAILS[item["id"]]
        all_source_keys.update(detail[2])
        all_source_keys.update(key for term in item.get("reviewed", {}).get("waisen", []) for key in WAISEN_SOURCE_KEYS.get(term, []))
    for note in OPEN_NOTES + STYLE_NOTES:
        all_source_keys.update(note["sources"])
    for entry in waisen_audit:
        for source_id in entry["sources"]:
            if source_id not in SOURCE_BY_ID:
                raise SystemExit(f"Unknown source reference {source_id} in waisen audit")
    if all_source_keys != set(SOURCE_IDS):
        missing = sorted(set(SOURCE_IDS) - all_source_keys)
        unknown = sorted(all_source_keys - set(SOURCE_IDS))
        raise SystemExit(f"Source registry/use mismatch; unused={missing}, unknown={unknown}")

    used_source_ids = {
        source_id
        for item in items for source_id in item["sources"]
    } | {
        source_id for note in OPEN_NOTES + STYLE_NOTES for source_id in source_ids(note["sources"])
    } | {
        source_id for entry in waisen_audit for source_id in entry["sources"]
    }
    if used_source_ids != set(SOURCE_BY_ID):
        raise SystemExit(f"Every published source must be attached to a reviewed item; unused IDs: {sorted(set(SOURCE_BY_ID)-used_source_ids)}")

    open_notes_report = [{**note, "sources": source_ids(note["sources"])} for note in OPEN_NOTES]
    style_notes_report = [{**note, "sources": source_ids(note["sources"])} for note in STYLE_NOTES]

    content_patch = {
        "fieldsChanged": len(DIALOGUE_CHANGED_FIELDS) + len(VOCAB_CHANGED_FIELDS),
        "dialogueFieldsChanged": len(DIALOGUE_CHANGED_FIELDS),
        "dialogueChangedFields": DIALOGUE_CHANGED_FIELDS,
        "vocabularyFieldsChanged": len(VOCAB_CHANGED_FIELDS),
        "vocabularyChangedFields": VOCAB_CHANGED_FIELDS,
        "changedFields": DIALOGUE_CHANGED_FIELDS + VOCAB_CHANGED_FIELDS,
        "sourceFilesChanged": 2,
        "sourceChanges": [
            {"file": CARD_SOURCE_PATH, "field": "A2_WOHNEN_VERTRAG row vd-wohnen-021", "before": "die Nachmieter suchen / no article or plural", "after": "der Nachmieter / der / die Nachmieter"},
            {"file": PLURAL_SOURCE_PATH, "field": "PLURAL_MAP[vd-wohnen-021]", "before": None, "after": "die Nachmieter"},
        ],
        "reason": "تصحيحات موضعية مؤيدة بمعجم/قواعد/مرجع رسمي، لا تغييرات تخمينية؛ تبقى وقائع القانون والموقع الخاصة غير محسومة، وتظل المقارنة CEFR/النسبة/الحساب خارج النطاق.",
        "protectedUnresolvedItemIds": ["d-a2-16.lines[4]", "d-a2-16.lines[7]", "d-a2-18.lines[4]", "d-a2-18-q2"],
        "protectedContextRelatedItemIds": ["d-a2-16.lines[6]", "d-a2-16.lines[7]", "d-a2-18.lines[4]"],
        "protectedStyleItemIds": ["d-a2-16.lines[6].ar", "d-a2-17.lines[4]", "d-a2-18.lines[3].ar"],
        "deferredSuggestions": [
            {"id": "d-a2-18.lines[3].ar", "candidate": "هل أسترد مبلغ الضمان قريباً؟", "reason": "مقابل تحرير محتمل لـKaution؛ لم يثبت خطأ «الضمانة» الحالية."},
            {"id": "d-a2-16.lines[6].ar", "candidate": "مشرف الورشة", "reason": "بديل أوضح أحياناً لـMeister؛ لم يثبت أن «المعلّم» خطأ في سياق حرفي عربي."},
        ],
    }

    card_before = {
        "de": "die Nachmieter suchen", "ar": "يبحثُ عن مستأجرٍ بديل", "pos": "Nomen",
        "exampleDe": "Ich suche Nachmieter für die Wohnung.", "exampleAr": "أبحثُ عن مستأجرٍ بديل",
        "article": None, "plural": None, "farbe": None, "level": "A2", "tags": ["wohnen"],
        "aussprache": card.get("aussprache"),
    }
    card_after = {key: card.get(key) for key in ("de", "ar", "pos", "article", "plural", "farbe", "exampleDe", "exampleAr", "level", "tags", "aussprache")}
    vocabulary_card_patch = {
        "id": "vd-wohnen-021",
        "status": "مُصحح",
        "sources": source_ids(["nachmieter"]),
        "before": card_before,
        "after": card_after,
        "fieldsChanged": 7,
        "changedFields": VOCAB_CHANGED_FIELDS,
        "sourcePaths": [CARD_SOURCE_PATH, PLURAL_SOURCE_PATH],
        "associationAudit": association_audit,
        "note": "حُفظ pos= Nomen وaussprache كما كانا؛ أضيفت مرساة اللون الزرقاء المطابقة لـder، ومُثل الجمع في المصدر والبطاقة. لم يُعد تشغيل موجة المولد كاملة لأنها مصدر دفعة تاريخية يكتب البنك كله، لا رقعة قابلة لإعادة تطبيق آمن على الملف الحي.",
    }

    package_manifest = json.loads(PACKAGE_PATH.read_text(encoding="utf-8"))
    package_lock = json.loads(PACKAGE_LOCK_PATH.read_text(encoding="utf-8"))
    locked_packages = package_lock.get("packages", {})
    sharp_version = locked_packages.get("node_modules/sharp", {}).get("version")
    source_map_version = locked_packages.get("node_modules/source-map-js", {}).get("version")
    if sharp_version != "0.35.5" or source_map_version != "1.2.2":
        raise SystemExit(f"Dependency-security lock versions are not the reviewed patched versions: sharp={sharp_version}, source-map-js={source_map_version}")
    dependency_security = {
        "status": "fixed; lockfile verified by npm ci and npm audit",
        "lockfile": "package-lock.json",
        "packageJsonChanged": False,
        "packages": [
            {"name": "sharp", "before": "0.35.4", "after": sharp_version, "severity": "high", "advisory": "https://github.com/advisories/GHSA-wq5f-xc86-pv6w", "note": "transitive dependency of Next.js; semver-compatible patch"},
            {"name": "source-map-js", "before": "1.2.1", "after": source_map_version, "severity": "high", "advisory": "https://github.com/advisories/GHSA-68fv-2mgg-jv7q", "note": "transitive dependency; semver-compatible patch"},
        ],
        "method": "npm audit fix updated compatible transitive lockfile versions; package.json's dependency ranges were not changed. A clean npm ci then completed with 0 vulnerabilities.",
        "manifestVersions": {"next": package_manifest.get("dependencies", {}).get("next"), "postcss": package_manifest.get("devDependencies", {}).get("postcss")},
    }

    limitations = [
        "هذه مراجعة مساعد ذكاء اصطناعي بمصادر منشورة؛ ليست مراجعة بشرية أو اعتماداً لغوياً/مهنياً أو رأياً قانونياً/طبياً.",
        "المداخل المعجمية تسند معاني مفردات محددة ولا تثبت طبيعية كل جملة أو صحة وقائع ورشة/إيجار متخيلة.",
        "لم يُعَد تقييم A2/CEFR أو تقدير مستوى متعلم؛ استُخدم CEFR فقط لتقييد صياغة نصيحة اللكنة، ولم تُمسّ النسبة أو حساب المستوى.",
        "قوانين العمل والإيجار والمصادر التنظيمية قُرئت ضمن نطاقها فقط؛ لا تثبت مهلة عامة لرد الكفالة أو وجوب كل تعليمة أو تجهيزاً مكانياً بعينه.",
        "لم توجد إدخالات صوت مطابقة أو ملفات R109 مسماة؛ لم يحدث تشغيل أو استماع أو تحقق من النطق.",
        "المقارنة التاريخية محصورة في ملف الإنشاء الأولي المتاح؛ a_dialog_fallen.py لا يحتوي المعرفات، ولا تمثل المقارنة تاريخ Git كاملاً.",
        "عدد الكلمات اليومي نصيحة شخصية في حوار؛ لا يثبت التقرير معياراً علمياً عاماً ولا أثر تعلم.",
        "بوابات K183 تتحقق من البيانات والربط والسجل والاتساق؛ لا تحل محل مراجعة بشرية أو اختبار مستخدمين/صوت فعلي.",
    ]

    report = {
        "date": "2026-10-06",
        "batch": "A2-dialogues-07",
        "reviewRule": "R109",
        "scope": "مراجعة فردية مدعومة بمصادر منشورة للحوارات الحية d-a2-16 إلى d-a2-18: بيانات الحوار الثلاثة، 24 سطراً، 9 أسئلة مع خياراتها ومفاتيحها وشروحها، و6 جمل إملاء؛ 42 وحدة. فُحصت 28 مفردة waisen منفردةً، وبطاقة Nachmieter المرتبطة بها، وسجل الصوت والمصدر التاريخي ضمن حدودهما.",
        "method": "إعادة فحص Git والتقارير والبيانات الحية؛ توثيق كل وحدة بمعرف ولقطة ودليل وحكم وإجراء ومصدر مباشر ذي حدود معلنة. فُصلت الأخطاء/التصحيحات المؤكدة عن الملاحظات السياقية والأسلوبية؛ لم يستنتج الحكم من تنبيه آلي أو من معجم منفرد.",
        "coverage": {
            "dialogues": 3,
            "dialogueMetadata": 3,
            "lines": 24,
            "questions": 9,
            "dictationSentences": 6,
            "audioAssets": len(audio_audit),
            "unresolvedContextNotes": len(OPEN_NOTES),
            "styleNotes": len(STYLE_NOTES),
            "totalTrackedItems": len(items),
            "waisenTermsReviewed": len(waisen_audit),
        },
        "statusCounts": actual_statuses,
        "statusDefinitions": {
            "سليم": "فُحصت الوحدة وسياقها ومصدرها؛ لم يثبت فيها خطأ محدد يستلزم تغييراً. قد تبقى ملاحظة سياقية/أسلوبية منفصلة.",
            "مُصحح": "ثبت خلل محدد لغوي/ترجمي أو عدم اتساق في حقل، وعُدّل الحقل الموثق؛ يحفظ السجل القيمة السابقة ومبرر التغيير.",
            "غير محسوم": "المعنى أو الواقعة السياقية لا تحسمها الأدلة؛ لا تعديل تخمينياً ولا يعني التصنيف ثبوت خطأ لغوي. ملاحظات السياق منفصلة عن عدّ الوحدات.",
        },
        "limitations": limitations,
        "historicalPatchReview": {
            "sources": [CREATION_PATH, OLD_QUESTION_PATCH_PATH],
            "role": f"{CREATION_PATH} يحتوي نسخة إنشاء أولية لبعض الحقول، واستخدم للمقارنة الحرفية فقط؛ {OLD_QUESTION_PATCH_PATH} لا يحتوي d-a2-16 إلى d-a2-18. لا يدل أي منهما على تاريخ تعديلات كامل ولا يُستخدم حكماً لغوياً.",
            "unavailableHistoricalFields": [
                "التسلسل الكامل لتعديلات الحوار بعد ملف الإنشاء الأولي",
                "سجل أسئلة تاريخي مستقل لهذه المعرفات في a_dialog_fallen.py",
                "نية المؤلف بشأن اللون/المكان أو قواعد العمل والإيجار في حالة واقعية محددة",
                "أي سجل صوت أو تحقق استماع تاريخي",
                "تاريخ التعديلات الأسبق لبطاقة vd-wohnen-021 خارج لقطة ما قبل الرقعة المسجلة أدناه",
            ],
            "comparisons": historical_comparisons,
        },
        "contentPatch": content_patch,
        "vocabularyCardPatch": vocabulary_card_patch,
        "dependencySecurity": dependency_security,
        "waisenTermAudit": waisen_audit,
        "associationAudit": association_audit,
        "openNotes": open_notes_report,
        "styleNotes": style_notes_report,
        "audioAssetAudit": audio_audit,
        "sources": SOURCES,
        "items": items,
        "verification": VERIFICATION,
    }

    # Verify each report source is used and every item is externally referenced.
    if any(not item.get("sources") for item in items):
        raise SystemExit("Every one of the 42 reviewed units must have at least one source")
    md = build_markdown(report)
    for source in SOURCES:
        if source["url"] not in md:
            raise SystemExit(f"Markdown omitted source URL {source['id']}")
    for item in items:
        if item["id"] not in md:
            raise SystemExit(f"Markdown omitted item {item['id']}")

    JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    JSON_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    MD_PATH.write_text(md, encoding="utf-8")
    print(f"Generated R109 report: {len(items)} units, {len(waisen_audit)} waisen terms, {len(SOURCES)} sources, {len(open_notes := OPEN_NOTES)} context notes, {len(STYLE_NOTES)} style notes")
    print(f"  JSON: {JSON_PATH.relative_to(ROOT)}")
    print(f"  Markdown: {MD_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
