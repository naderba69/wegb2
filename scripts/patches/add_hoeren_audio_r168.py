# -*- coding: utf-8 -*-
"""R168: surgically review, fully translate, and add five B2 listening texts.

Run --prepare to apply guarded sentence-level corrections, complete Arabic
translations, and only the affected question fields. Generate German MP3s from
the resulting exact `de` values, then run without arguments to validate audio
and update only content/hoeren-audio.json.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from datetime import date
from pathlib import Path

from add_a0_hoeren_audio_02 import mp3_frame_count

ROOT = Path(__file__).resolve().parents[2]
TEXTS_FILE = ROOT / "content" / "texts.json"
MANIFEST_FILE = ROOT / "content" / "hoeren-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "hoeren"
TARGET_IDS = [f"t-b2-{number}" for number in range(26, 31)]
EDITORIAL_KEYS = ("titleDe", "titleAr", "de", "ar", "questions")

# SHA-256 of each exact editorial payload inspected before R168. The guard
# covers the full text, Arabic field, titles, and questions to prevent replacing
# any concurrent or user-authored changes.
SOURCE_SNAPSHOT_SHA256: dict[str, str] = {
    "t-b2-26": "0bf4f3af2d66510842dfda7db073ba1a1f7b90321cb365037cb8747106e372e3",
    "t-b2-27": "b454d6eb1941c1b74a923a8c28cfdb0a8707b3d8496dab969190a7a1ca404fb5",
    "t-b2-28": "84ac4e2502ef70d5859a660c0be490f14fc42cbf35ad02739a795b773a6e0ca0",
    "t-b2-29": "401adb7b2f9aaea27a236dbdde1312de4d9464ad98f427ac6e06a5024ea4c1c8",
    "t-b2-30": "60ac53f2b3a1a09cce44780be7fab8366b3cc7933ca0fe1783e153da4d6118d2",
}

# Exact payload hashes from the first R168 pass for the four texts refined
# after structural vocabulary tests. Only these known intermediate payloads
# are allowed to transition to the final reviewed form.
INTERMEDIATE_SNAPSHOT_SHA256: dict[str, str] = {
    "t-b2-26": "cfc8fb001a70506246194a3d1d18c07a449a739642e5836d2cec1a8b5e30314f",
    "t-b2-27": "a3cd0acac3f45bcf48a38f2437d2f22bc8710a92ff100b5ec42de809d2dacb0a",
    "t-b2-28": "46eb46814e2cf47a6efecf9f74825c1d22b1a373211ac53c2be5ed05dc93bbca",
    "t-b2-29": "6ef05f24519cda53ea316cfee8c79051dfa0f98a9fa05a8ad5b14fad27e03a06",
}

# Fill these only after --prepare and after generating MP3s from the exact
# printed German source fields. Voice must come from the completed audition.
SOURCE_SHA256: dict[str, str] = {
    "t-b2-26": "09fcd34301c0b8e2f3e91c2c7b76c41afd76388dd016b07853243d866d956540",
    "t-b2-27": "11f1d3da3a8117a1de234243070ffbd187d5ac4d1d1f4b38f47392425adf785d",
    "t-b2-28": "f64af208a63307bc2524c72701dc03f78bd6e1040f217f56f82ccf6babe73198",
    "t-b2-29": "990f801c5a6d586c787f090e81ee977762877ae6b553372b9c707f5143c2dc9f",
    "t-b2-30": "03775b7a2133642c40c9abc5f9be0be0ddecf7b91e117a4ecfbf19850805e55c",
}
VOICE = "voice-02 (de-DE, Arena TTS)"

# Only titles and Arabic translations are replaced as complete fields. German
# prose is changed below with exact, single-occurrence sentence-level edits;
# existing questions are patched by ID/field rather than replaced as a list.
TEXT_FIELD_UPDATES: dict[str, dict[str, str]] = {
    "t-b2-26": {
        "titleDe": "Beispiel: Der Bürgerwindpark",
        "titleAr": "مثال: مشروع تعاوني لطاقة الرياح",
        "ar": """حين خُطِّط لتركيب أول عنفة رياح خلف القرية، كان الجو متوتراً. وتحدّث الناس عن ظلّ الشفرات صباحاً، وعن الموجات تحت السمعية والمخاوف من آثارها الصحية المحتملة، وعن الحد الأدنى للمسافة إلى أقرب المنازل. وقد قاست دراسة بتكليف من الوكالة الاتحادية الألمانية للبيئة مستويات الموجات تحت السمعية في خمسة مواقع، فكانت دون عتبة السمع. وأظهرت اختبارات الاستماع في ثلاثة مواقع أن الشعور بالانزعاج ازداد مع زيادة عمق تعديل السعة؛ بل إن مجرد إدراك هذا التعديل زاد ذلك الشعور. وقيل إن مكان مزرعة الرياح هو البحر، لا الوادي.

جاء التحول مع نموذج مختلف. فبدلاً من مشغّل خارجي، أسست مجموعة من أهل البلدة تعاونيةً لمشروع مزرعة رياح تشاركي. وكان في وسع المهتمين شراء حصص، وأراد المؤسسون أن يبقى جزء من العائدات المحتملة في المنطقة. وأخذ بعض المعارضين السابقين يحسبون الإيرادات الممكنة ويتحققون مما إذا كانت تعرفة تغذية الكهرباء تنطبق على المشروع. كما سألوا متى يمكن للمنشأة ضخّ الكهرباء في الشبكة. وتعلّم رئيس البلدية أن القبول قد ينمو حين يشارك الناس في القرار ويستفيدون من العائدات المحتملة؛ فالكتيبات وحدها لا تكفي.

لكن ذلك لم يحلّ كل شيء. فمن دون توسيع الشبكة، لا يمكن نقل كامل الكهرباء الخضراء من مزرعة الرياح إلى المدينة؛ وتطعن القرية المجاورة قضائياً في مسار خط الكهرباء المخطط له. وعلى سطح المدرسة تنتج الطاقة الشمسية الكهرباء اللازمة للمطبخ. أما المحطة القديمة عند النهر، فلا تعمل إلا خلال موسم التدفئة. ولا تزيل الطاقة المتجددة النزاعات تلقائياً؛ وكانت الإعانات الأحفورية أيضاً موضوعاً للنقاش في البلدة. وفي هذه القصة اقتربت النزاعات من المنازل حين خُطّط لإنشاء منشآت في الجوار.""",
    },
    "t-b2-27": {
        "titleDe": "Beispiel: Das Kleingedruckte",
        "titleAr": "مثال: الشروط المكتوبة بخط صغير",
        "ar": """تعمل السيدة أوزتورك منذ اثنتي عشرة سنة في مركز لحماية المستهلك. وتقول إن الحالات لم تتغير كثيراً؛ فالعبوة وحدها هي التي أصبحت مختلفة اليوم. كان الزبائن يأتون قديماً ومعهم كتالوج، أما اليوم فيأتون بهاتف محمول. والمبدأ كما تقول: طُعم يجذب الزبون، ثم تعيده الشروط المكتوبة بخط صغير إلى التفاصيل.

وفي استشاراتها، يُعدّ فخّ الاشتراك من الحالات المتكررة: شهر تجريبي مجاني، أو عرض يبدو عالي الجودة، أو صفقة مغرية مرتبطة بعدٍّ تنازلي. وبعد الفترة التجريبية، قد يستمر اشتراك مدفوع إذا كان ذلك قد اتُّفق عليه قانونياً ولم يلغِه العميل في الوقت المحدد. كما يتكرر موضوع العبوات المضللة: حجم العبوة نفسه، ومحتوى أقل، والسعر نفسه. ويتوقف اعتبار ذلك تضليلاً قانونياً على الحالة والانطباع العام للعبوة؛ فبيان كمية المحتوى وحده لا يستبعد التضليل تلقائياً.

ولا يعرف كثيرون أن شراء سلعة سليمة من متجر لا يمنحهم حقاً عاماً في إرجاعها لمجرد أنها لم تعد تعجبهم. ومن أراد استبدال كنزة سليمة لأنها لا تعجبه، فعليه عادةً الاعتماد على مرونة البائع. أما إذا وُجد عيب في السلعة، فيمكن للعميل تقديم شكوى بشأنه والمطالبة بحقوق الضمان القانونية؛ مع مراعاة المهل والشروط. ويجب فحص كل حالة لمعرفة ما إذا كانت السلعة معيبة فعلاً أم أن المشتري يراها متدنية الجودة فحسب. وتشرح السيدة أوزتورك يومياً الفرق بين الاستبدال وتقديم شكوى بسبب عيب. ويمكن لجمعيات حماية المستهلك المؤهلة توجيه إنذار رسمي إلى تاجر في بعض مخالفات المنافسة. أما ما إذا كان هذا الإجراء أسرع من المحكمة، فيعتمد على الحالة، كما تقول.""",
    },
    "t-b2-28": {
        "titleDe": "Beispiel: Wem gehört die Stadt?",
        "titleAr": "مثال: لمن المدينة؟",
        "ar": """في الحيّ القريب من المحطة، افتُتحت خلال عامين ثلاثة مقاهٍ واستوديو لليوغا ومتجر للدراجات تزيد أسعارها على سعر سيارة صغيرة. وسمّت الصحيفة هذا التغيير ارتقاءً بالحي. أما أسرة الطابق الثالث، التي ارتفع إيجارها بمقدار الثلث بعد الترميم، فقد عاشت الأمر بصورة مختلفة. ويصف مصطلح Gentrifizierung الارتقاءَ بأحد الأحياء؛ وقد تكون إزاحة السكان نتيجةً لذلك: قد لا يُطرد المرء من منزله، لكنه قد يعجز عن تحمّل كلفة السكن في الحي نفسه.

يعرض جدول الإيجارات Mietspiegel الإيجار المقارن المعتاد في المنطقة. وفي أنواع محددة من الزيادات حتى مستوى هذا الإيجار، تحدّ Kappungsgrenze من مقدار الزيادة خلال ثلاث سنوات. ولا تستطيع المدينة ممارسة Vorkaufsrecht، أي حق الشراء بالأولوية، إلا في الحالات التي ينظمها القانون ولما تقتضيه المصلحة العامة. ويمكن لحظر تغيير استخدام المساكن أن يقيّد تأجيرها للعطلات في بعض البلديات؛ وتختلف القواعد المحلية. وفي هذا المثال، ظل مبنى البريد القديم شاغراً سبع سنوات. ويشكو السكان من أن الحظر لا يخضع لرقابة كافية.

تناول الاستفتاء المحلي في الربيع مخطط البناء لآخر مساحة خالية: زيادة الكثافة العمرانية ببناء ستين شقة، أم تخضير المدينة بالأشجار وإقامة ملعب. وحذّر المعارضون من تغطية الأرض بالبناء ومن إقامة مبانٍ في ممر للهواء النقي. وسأل المؤيدون أين ستسكن الأسر إذاً. وفي النهاية فاز خيار البناء بفارق ضئيل، بشرط تخضير السطح. ولا تضمن مشاركة المواطنين رضا الجميع، لكنها يُفترض أن تتيح للمتأثرين عرض حججهم. ويبقى السؤال: هل يمكن الارتقاء بحيّ من دون خسارة سكانه؟""",
    },
    "t-b2-29": {
        "titleDe": "Beispiel: Ankommen dauert",
        "titleAr": "مثال: الاستقرار يستغرق وقتاً",
        "ar": """هاجرت الدكتورة أماني إلى ألمانيا قبل ست سنوات، وكانت تحمل شهادة في الكيمياء، لكنها لم تكن تملك إذناً بالعمل. واستغرق فحص معادلة شهادتها تسعة أشهر؛ ثم احتاجت إلى ستة أشهر من التأهيل الإضافي، لأن أحد المقررات في المنهج الألماني كان يتضمن محتوى مختلفاً. وكانت وثيقة «Duldung» تُجدّد كل ستة أشهر، بينما ظل أفق بقائها في البلاد غير واضح. ولم تستطع التخطيط على نحو موثوق، حتى لموعد عند طبيب الأسنان.

كانت دورة الاندماج سهلة عليها لغوياً، لكن الرسائل الرسمية ظلت صعبة. وشهادة دورة الاندماج ليست شرطاً عاماً لكل حالات لمّ الشمل. فالمتطلبات تعتمد على نوع تصريح الإقامة والحالة الفردية؛ كما توجد استثناءات لمتطلبات إثبات اللغة. ولم يصل زوجها إلا في السنة الثالثة. وهي اليوم تحمل البطاقة الزرقاء للاتحاد الأوروبي. وباستيفاء شروط أخرى، يمكن منحها تصريح الإقامة الدائمة بعد 27 شهراً من العمل مع دفع اشتراكات التقاعد ومعرفة بسيطة بالألمانية؛ وتنخفض المدة إلى 21 شهراً عند توافر معرفة كافية باللغة. وهي تطلب التحقق مما إذا كانت تستوفي جميع الشروط. وكانت زميلتها في المختبر تشرح لها كل رسالة من الدائرة الحكومية. وتقول الدكتورة أماني: «ثقافة الترحيب ليست لافتة في محطة القطار، بل شخص يملك وقتاً للآخر».

لا تعرف بعد ما إذا كانت ستتقدم بطلب للحصول على الجنسية الألمانية. وقد يكون التجنّس خطوة يصعب على والديها فهمها. وبالنسبة إليها، فإن الاندماج من دون التخلي عن جذورها تمرين يومي. وتقول إن مجتمع الأغلبية نادراً ما يلاحظ مقدار عمل الترجمة الذي يتطلبه الاندماج، وليس فقط عند تعلم لغة ثانية. وتضيف أن الاستقرار ليس تاريخاً محدداً، بل اتجاه.""",
    },
    "t-b2-30": {
        "titleDe": "Beispiel: Ein Stolperstein vor dem Haus",
        "titleAr": "مثال: حجر تذكاري أمام المنزل",
        "ar": """المثال متخيّل: أمام المنزل رقم 14، يوجد حجر من نوع «Stolperstein» مثبت في الرصيف؛ وهو كتلة خرسانية تعلوها صفيحة نحاسية. وتحمل الصفيحة الاسم وسنة الميلاد ومصير شخص اضطهده النظام النازي. بحثت طالبات الصف العاشر تاريخ الأسرة التي سكنت هناك من قبل، وأقمن دقيقة صمت عند وضع الحجر. وعلى خلاف نصب كبير أو موقع تذكاري له أوقات زيارة محددة، يذكّر الحجر المارّات والمارّين في حياتهم اليومية. وهكذا يوضح المثال ثقافة التذكّر على نطاق صغير.

لم يؤيد الفكرة جميع سكان المنزل. وسأل أحدهم إن لم يكن الوقت قد حان لوضع حدّ لهذا الأمر؛ فجدّاه، بحسب قوله، لم يكونا سوى تابعين. وأجابت المعلمة بأن عمل الذاكرة لا يطرح مسألة ذنب على الأحفاد. بل يسأل كيف دعم الناس الاضطهاد أو سكتوا عنه أو قاوموه، كي تتمكن الأجيال الحالية من التعرّف إلى إشارات الخطر. ومن يهوّن من الماضي، كما تقول المعلمة، لا يحمي الأجداد، بل يحمي راحة نفسه.

وفي هذه القصة، توفي آخر شاهد من ذلك الشارع قبل عامين. وبقي تسجيل مقابلته، ومدته ثلاث وأربعون دقيقة، في أرشيف المدرسة. استمعت الطالبات إليه قبل وضع الحجر. يبدو مصطلح «معالجة الماضي» ثقيلاً، لكنه يعني هنا مهمة محددة: أن ننظر بدقة، ونعالج ما حدث، وننقل الذكريات إلى الآخرين. وقد يبدأ التهوين أحياناً لا بكذبة صريحة، بل بكلمة تبدو أقل قسوة من حقيقة ما جرى. وتقول المعلمة إن من يحيي ذكرى الموتى لا يفعل ذلك من أجل الموتى وحدهم.""",
    },
}

# Exact, one-occurrence German corrections preserve the original paragraphs
# outside these reviewed sentences and phrases.
GERMAN_REPLACEMENTS: dict[str, list[tuple[str, str]]] = {
    "t-b2-26": [
        ("war die Stimmung schlecht", "war die Stimmung angespannt"),
        (
            "über Infraschall, den niemand hört und alle fürchten, und über den Mindestabstand zu den letzten Häusern.",
            "über Infraschall und mögliche gesundheitliche Folgen sowie über den Mindestabstand zu den letzten Häusern. Eine vom Umweltbundesamt beauftragte Studie maß an fünf Standorten Infraschallpegel unter der Hörschwelle. Hörversuche an drei Standorten zeigten: Die Lästigkeit stieg mit der Modulationstiefe; schon die Wahrnehmbarkeit der Amplitudenmodulation erhöhte sie.",
        ),
        (
            "Statt eines fremden Betreibers gründete eine Gruppe aus dem Ort einen Bürgerwindpark: Wer will, kauft einen Anteil, und der Gewinn bleibt in der Region.",
            "Statt eines fremden Betreibers gründete eine Gruppe aus dem Ort eine Genossenschaft für den Bürgerwindpark. Interessierte konnten Anteile erwerben; ein Teil möglicher Erträge sollte in der Region bleiben.",
        ),
        (
            "Plötzlich rechneten dieselben Leute, die vorher nur Nachteile gesehen hatten, mit der Einspeisevergütung und fragten, wann die Anlage Strom ins Netz einspeisen könne.",
            "Frühere Kritiker rechneten mögliche Erlöse durch und prüften, ob eine Einspeisevergütung infrage kam. Sie fragten auch, wann die Anlage Strom ins Netz einspeisen könne.",
        ),
        (
            "Akzeptanz, so lernte der Bürgermeister, entsteht selten durch Broschüren. Sie entsteht, wenn Menschen mitverdienen und mitentscheiden.",
            "Der Bürgermeister lernte: Akzeptanz kann wachsen, wenn Menschen mitentscheiden und von möglichen Erträgen profitieren; Broschüren allein reichen selten.",
        ),
        (
            "Ohne Netzausbau kommt der Ökostrom nicht in die Stadt, und gegen die neue Stromtrasse klagt schon das Nachbardorf.",
            "Ohne Netzausbau lässt sich der Ökostrom aus dem Windpark nicht vollständig in die Stadt transportieren; gegen die geplante Stromtrasse klagt das Nachbardorf.",
        ),
        (
            "Auf den Dächern der Schule liefert Solarenergie inzwischen den Strom für die Küche, das alte Kraftwerk am Fluss läuft nur noch im Winter.",
            "Auf dem Dach der Schule liefert inzwischen Solarenergie Strom für die Küche. Das alte Kraftwerk am Fluss läuft nur noch während der Heizperiode.",
        ),
        (
            "Erneuerbar heißt nicht einfach; es heißt, dass die Konflikte näher rücken, weil die Energie nicht mehr aus fossilen Quellen weit weg kommt, sondern vom Hügel hinter dem Haus.",
            "Erneuerbare Energie beseitigt Konflikte nicht automatisch; auch fossile Subventionen waren Thema der Ortsdebatte. In dieser Geschichte rücken Konflikte näher an die Häuser, sobald Anlagen in der Umgebung geplant werden.",
        ),
        (
            "Erneuerbare Energie beseitigt Konflikte nicht automatisch. In dieser Geschichte rücken Konflikte näher an die Wohnhäuser, weil Anlagen jetzt auch in der unmittelbaren Umgebung geplant werden.",
            "Erneuerbare Energie beseitigt Konflikte nicht automatisch; auch fossile Subventionen waren Thema der Ortsdebatte. In dieser Geschichte rücken Konflikte näher an die Häuser, sobald Anlagen in der Umgebung geplant werden.",
        ),
    ],
    "t-b2-27": [
        (
            "Frau Öztürk arbeitet seit zwölf Jahren in einer Verbraucherzentrale und sagt, die Fälle hätten sich kaum verändert, nur die Verpackung.",
            "Frau Öztürk arbeitet seit zwölf Jahren in einer Verbraucherzentrale. Sie sagt, die Fälle hätten sich kaum verändert; nur die Verpackung sei heute eine andere.",
        ),
        (
            "Ihr häufigster Fall ist die Abo-Falle. Ein kostenloser Probemonat, ein hochwertig aussehendes Angebot, ein Schnäppchen mit Countdown. Wer nicht kündigt, zahlt. Der zweithäufigste Fall ist die Mogelpackung: gleiche Größe, weniger Inhalt, gleicher Preis. Das ist keine Irreführung im rechtlichen Sinn, solange das Gewicht irgendwo steht. Frau Öztürk nennt es trotzdem so, und die Kundschaft versteht sie.",
            "In ihrer Beratung sei die Abo-Falle besonders häufig: ein kostenloser Probemonat, ein hochwertig aussehendes Angebot, ein Schnäppchen mit Countdown. Nach dem Probezeitraum kann ein kostenpflichtiges Abonnement weiterlaufen, wenn dies wirksam vereinbart wurde und die Kundin oder der Kunde nicht rechtzeitig kündigt. Auch Mogelpackungen seien ein häufiges Thema: gleiche Verpackungsgröße, weniger Inhalt, gleicher Preis. Ob das rechtlich eine Irreführung ist, hängt vom Einzelfall und vom Gesamteindruck der Verpackung ab; eine Füllmengenangabe allein schließt sie nicht automatisch aus.",
        ),
        (
            "Was viele nicht wissen: Beim Kauf im Laden gibt es kein gesetzliches Rückgaberecht. Wer einen Pullover umtauschen will, weil er ihm nicht gefällt, ist auf die Kulanz des Händlers angewiesen. Reklamieren kann man dagegen immer, wenn die Ware minderwertig ist oder kaputt ankommt. Den Unterschied zwischen Umtausch und Reklamation erklärt sie jeden Tag. Und wenn ein Händler mit falschen Versprechen wirbt, schreibt die Zentrale eine Abmahnung. Das wirkt, sagt sie, meistens schneller als jedes Gericht.",
            "Viele wüssten nicht, dass es beim Kauf im Laden kein allgemeines Rückgaberecht für mangelfreie Ware gibt, nur weil sie später nicht gefällt. Wer einen mangelfreien Pullover umtauschen möchte, weil er ihm nicht gefällt, ist normalerweise auf die Kulanz des Händlers angewiesen. Bei einem Sachmangel kann man reklamieren und gesetzliche Gewährleistungsrechte geltend machen; dafür gelten Fristen und Bedingungen. Ob eine Ware tatsächlich mangelhaft ist oder nur als minderwertig empfunden wird, muss im Einzelfall geprüft werden. Den Unterschied zwischen Umtausch und Reklamation erklärt Frau Öztürk täglich. Bei bestimmten Wettbewerbsverstößen können qualifizierte Verbraucherverbände eine Abmahnung aussprechen. Ob das schneller wirkt als ein Gerichtsverfahren, hängt vom Fall ab, sagt sie.",
        ),
        (
            "Viele wüssten nicht, dass es beim Kauf im Laden kein allgemeines Rückgaberecht für mangelfreie Ware gibt, nur weil sie später nicht gefällt. Wer einen mangelfreien Pullover umtauschen möchte, weil er ihm nicht gefällt, ist normalerweise auf die Kulanz des Händlers angewiesen. Bei einem Sachmangel bestehen dagegen gesetzliche Gewährleistungsrechte; dafür gelten Fristen und Bedingungen. Ob eine Ware tatsächlich mangelhaft ist oder nur als minderwertig empfunden wird, muss im Einzelfall geprüft werden. Den Unterschied zwischen Umtausch und Reklamation erklärt Frau Öztürk täglich. Bei bestimmten Wettbewerbsverstößen können qualifizierte Verbraucherverbände einen Händler abmahnen. Ob das schneller wirkt als ein Gerichtsverfahren, hängt vom Fall ab, sagt sie.",
            "Viele wüssten nicht, dass es beim Kauf im Laden kein allgemeines Rückgaberecht für mangelfreie Ware gibt, nur weil sie später nicht gefällt. Wer einen mangelfreien Pullover umtauschen möchte, weil er ihm nicht gefällt, ist normalerweise auf die Kulanz des Händlers angewiesen. Bei einem Sachmangel kann man reklamieren und gesetzliche Gewährleistungsrechte geltend machen; dafür gelten Fristen und Bedingungen. Ob eine Ware tatsächlich mangelhaft ist oder nur als minderwertig empfunden wird, muss im Einzelfall geprüft werden. Den Unterschied zwischen Umtausch und Reklamation erklärt Frau Öztürk täglich. Bei bestimmten Wettbewerbsverstößen können qualifizierte Verbraucherverbände eine Abmahnung aussprechen. Ob das schneller wirkt als ein Gerichtsverfahren, hängt vom Fall ab, sagt sie.",
        ),
    ],
    "t-b2-28": [
        (
            "Die Zeitung nannte es Aufwertung. Die Familie im dritten Stock, deren Miete nach der Sanierung um ein Drittel stieg, nannte es anders. Gentrifizierung ist das Wort, aber das Gefühl dahinter heißt Verdrängung: Man wird nicht gekündigt, man wird herausgepreist.",
            "Die Zeitung nannte den Wandel Aufwertung. Eine Familie im dritten Stock, deren Miete nach der Sanierung um ein Drittel gestiegen war, erlebte ihn anders. Gentrifizierung bezeichnet die Aufwertung eines Viertels; Verdrängung kann folgen: Man wird nicht gekündigt, sondern kann sich das Wohnen dort kaum noch leisten.",
        ),
        (
            "Die Stadt hat Instrumente, die sie selten nutzt. Der Mietspiegel zeigt, was ortsüblich ist; die Kappungsgrenze begrenzt, wie schnell die Miete steigen darf; das Vorkaufsrecht erlaubt der Stadt, ein Haus zu kaufen, bevor es ein Investor tut. Gegen die Zweckentfremdung von Wohnungen als Ferienunterkünfte gibt es ein Verbot, aber kaum jemand kontrolliert es. Der Leerstand im alten Postgebäude dauert seit sieben Jahren.",
            "Ein Mietspiegel bietet eine Übersicht über die ortsübliche Vergleichsmiete. Bei bestimmten Erhöhungen bis zur ortsüblichen Vergleichsmiete begrenzt die Kappungsgrenze den Anstieg innerhalb von drei Jahren. Die Stadt kann ihr Vorkaufsrecht nur in gesetzlich geregelten Fällen und zum Wohl der Allgemeinheit ausüben. Ein Zweckentfremdungsverbot kann in einzelnen Kommunen die Ferienvermietung einschränken; die örtlichen Regeln unterscheiden sich. Der Leerstand des alten Postgebäudes dauert seit sieben Jahren an. Bewohner beklagen, dass das Verbot kaum kontrolliert werde.",
        ),
        (
            "Die Gegner der Bebauung sprachen von Versiegelung und einer Frischluftschneise, die man nicht zubauen dürfe.",
            "Die Gegner warnten vor Versiegelung und der Bebauung einer Frischluftschneise.",
        ),
        (
            "Bürgerbeteiligung heißt nicht, dass alle zufrieden sind. Sie heißt, dass niemand sagen kann, er sei nicht gefragt worden.",
            "Bürgerbeteiligung garantiert keine Zufriedenheit, soll Betroffenen aber Gehör verschaffen.",
        ),
        (
            "Das alte Postgebäude steht im Beispiel seit sieben Jahren leer.",
            "Der Leerstand des alten Postgebäudes dauert seit sieben Jahren an.",
        ),
    ],
    "t-b2-29": [
        (
            "Als Dr. Amani vor sechs Jahren zugewandert ist, hatte sie einen Abschluss in Chemie und keine Arbeitserlaubnis. Die Gleichwertigkeitsprüfung ihres Diploms dauerte neun Monate; danach fehlte ein halbes Jahr Nachqualifizierung, weil ein Fach im deutschen Lehrplan anders heißt.",
            "Dr. Amani ist vor sechs Jahren nach Deutschland zugewandert. Sie hatte einen Abschluss in Chemie, aber keine Arbeitserlaubnis. Die Gleichwertigkeitsprüfung ihres Diploms dauerte neun Monate; danach brauchte sie ein halbes Jahr Nachqualifizierung, weil ein Fach im deutschen Lehrplan andere Inhalte vorsah.",
        ),
        (
            "In dieser Zeit lebte sie mit einer Duldung, die alle sechs Monate verlängert werden musste.",
            "Die Duldung wurde alle sechs Monate verlängert; ihre Bleibeperspektive blieb unklar.",
        ),
        (
            "Der Integrationskurs war für sie sprachlich zu leicht und bürokratisch zu wichtig: Ohne das Zertifikat keine Bleibeperspektive, ohne Bleibeperspektive kein Familiennachzug. Ihr Mann kam erst im dritten Jahr. Dass sie heute eine Blaue Karte hat und nächstes Jahr die Niederlassungserlaubnis beantragen kann, verdankt sie vor allem einer Kollegin im Labor, die ihr jeden Brief vom Amt erklärt hat. Willkommenskultur, sagt Dr. Amani, ist kein Plakat am Bahnhof. Es ist eine Person, die Zeit hat.",
            "Der Integrationskurs war ihr sprachlich zu leicht; die Behördenbriefe blieben schwierig. Ein Integrationskurszertifikat ist nicht generell Voraussetzung für jeden Familiennachzug. Die Anforderungen hängen vom Aufenthaltstitel und vom Einzelfall ab; beim Sprachnachweis gibt es Ausnahmen. Ihr Mann kam erst im dritten Jahr. Heute besitzt sie eine Blaue Karte EU. Unter weiteren Voraussetzungen kann ihr eine Niederlassungserlaubnis nach 27 Monaten Beschäftigung mit Rentenbeiträgen und einfachen Deutschkenntnissen erteilt werden; bei ausreichenden Deutschkenntnissen bereits nach 21 Monaten. Sie lässt prüfen, ob sie alle Voraussetzungen erfüllt. Ihre Kollegin im Labor erklärte ihr jeden Brief vom Amt. Dr. Amani sagt: „Willkommenskultur ist kein Plakat am Bahnhof, sondern eine Person, die Zeit hat.“",
        ),
        (
            "Ob sie die Staatsbürgerschaft beantragt, weiß sie noch nicht. Die Einbürgerung wäre ein Schritt, den ihre Eltern nicht verstehen würden. Sich einfügen, ohne sich aufzugeben, ist die Übung, die sie täglich macht. Die Mehrheitsgesellschaft merkt selten, wie viel Übersetzung das kostet, nicht nur beim Zweitspracherwerb. Ankommen, sagt sie, ist kein Datum. Es ist eine Richtung.",
            "Ob sie die deutsche Staatsangehörigkeit (Staatsbürgerschaft) beantragen will, weiß sie noch nicht. Die Einbürgerung wäre ein Schritt, den ihre Eltern nicht verstehen würden. Sie will sich einfügen, ohne die eigene Herkunft aufzugeben, und übt das täglich. Die Mehrheitsgesellschaft bemerkt selten, wie viel Übersetzungsarbeit Integration kostet – nicht nur beim Zweitspracherwerb. Ankommen, sagt sie, ist kein Datum, sondern eine Richtung.",
        ),
        (
            "Als Dr. Amani vor sechs Jahren nach Deutschland kam, hatte sie einen Abschluss in Chemie, aber keine Arbeitserlaubnis. Die Gleichwertigkeitsprüfung ihres Diploms dauerte neun Monate; danach brauchte sie ein halbes Jahr Nachqualifizierung, weil die Inhalte eines ihrer Studienfächer nicht den deutschen Anforderungen entsprachen.",
            "Dr. Amani ist vor sechs Jahren nach Deutschland zugewandert. Sie hatte einen Abschluss in Chemie, aber keine Arbeitserlaubnis. Die Gleichwertigkeitsprüfung ihres Diploms dauerte neun Monate; danach brauchte sie ein halbes Jahr Nachqualifizierung, weil ein Fach im deutschen Lehrplan andere Inhalte vorsah.",
        ),
        (
            "Ob sie die deutsche Staatsangehörigkeit beantragen will, weiß sie noch nicht. Die Einbürgerung wäre ein Schritt, den ihre Eltern nicht verstehen würden. Sich einzufügen, ohne die eigene Herkunft aufzugeben, übt sie täglich. Die Mehrheitsgesellschaft bemerkt selten, wie viel Übersetzungsarbeit Integration kostet – nicht nur beim Erlernen einer zweiten Sprache. Ankommen, sagt sie, ist kein Datum, sondern eine Richtung.",
            "Ob sie die deutsche Staatsangehörigkeit (Staatsbürgerschaft) beantragen will, weiß sie noch nicht. Die Einbürgerung wäre ein Schritt, den ihre Eltern nicht verstehen würden. Sie will sich einfügen, ohne die eigene Herkunft aufzugeben, und übt das täglich. Die Mehrheitsgesellschaft bemerkt selten, wie viel Übersetzungsarbeit Integration kostet – nicht nur beim Zweitspracherwerb. Ankommen, sagt sie, ist kein Datum, sondern eine Richtung.",
        ),
    ],
    "t-b2-30": [
        (
            "Vor dem Haus Nummer 14 liegt seit dem Frühjahr ein kleiner Stolperstein aus Messing. Ein Name, ein Geburtsjahr, ein Schicksal in drei Zeilen. Die Schülerinnen der zehnten Klasse haben die Geschichte der Familie recherchiert, die dort einmal wohnte, und bei der Verlegung eine Gedenkminute gehalten. Kein Mahnmal aus Stein, keine Gedenkstätte mit Öffnungszeiten, nur ein Stein, über den man beim Einkaufen stolpert. Das ist Erinnerungskultur im Kleinen.",
            "Das Beispiel ist erfunden: Vor Haus Nummer 14 liegt seit dem Frühjahr ein kleiner Stolperstein im Gehweg – ein Betonstein mit einer Messingplatte. Auf der Messingplatte stehen Name, Geburtsjahr und Schicksal einer im Nationalsozialismus verfolgten Person. Die Zehntklässlerinnen recherchierten die Geschichte der Familie, die dort einmal wohnte, und hielten bei der Verlegung eine Gedenkminute. Anders als ein großes Mahnmal oder eine Gedenkstätte mit festen Öffnungszeiten erinnert der Stein Passantinnen und Passanten im Alltag. So zeigt das Beispiel Erinnerungskultur im Kleinen.",
        ),
        (
            "Die Lehrerin antwortete ruhig, dass Erinnerungsarbeit keine Schuldfrage an die Enkel stellt. Sie fragt, wie normale Menschen mitgemacht haben, damit normale Menschen es heute erkennen. Wer die Vergangenheit relativiert, sagt sie, schützt nicht die Großeltern, sondern die Bequemlichkeit.",
            "Die Lehrerin antwortete, Erinnerungsarbeit stelle den Enkeln keine Schuldfrage. Sie frage, wie Menschen Verfolgung unterstützten, duldeten oder sich ihr widersetzten, damit heutige Generationen Warnsignale erkennen könnten. Wer die Vergangenheit relativiert, sagt die Lehrerin, schützt nicht die Großeltern, sondern die eigene Bequemlichkeit.",
        ),
        (
            "Der letzte Zeitzeuge aus der Straße ist vor zwei Jahren gestorben. Sein Interview liegt im Archiv der Schule, dreiundvierzig Minuten. Die Schülerinnen haben es gehört, bevor sie den Stein setzten. Vergangenheitsbewältigung ist ein schweres Wort für etwas Einfaches: hinsehen, aufarbeiten, weitergeben. Verharmlosung beginnt nicht mit einer Lüge, sondern mit einem Wort, das weicher klingt als die Tatsache. Wer der Toten gedenkt, sagt die Lehrerin, tut das nicht für die Toten.",
            "In der Geschichte starb der letzte Zeitzeuge aus dieser Straße vor zwei Jahren. Sein Interview, eine Aufnahme von dreiundvierzig Minuten, liegt im Schularchiv. Die Schülerinnen hörten es, bevor der Stolperstein verlegt wurde. Vergangenheitsbewältigung klingt schwer und meint hier eine konkrete Aufgabe: genau hinsehen, das Geschehene aufarbeiten und Erinnerungen weitergeben. Manchmal beginnt Verharmlosung nicht mit einer offenen Lüge, sondern mit einem Wort, das weniger hart klingt als das Geschehene. Die Lehrerin sagt: Wer der Toten gedenkt, tut das nicht für die Toten allein.",
        ),
    ],
}

# Patch only affected question fields. Question IDs, untouched prompts/options,
# and any existing pedagogical work remain intact.
QUESTION_PATCHES: dict[str, dict[str, dict[str, object]]] = {
    "t-b2-26": {
        "t-b2-26-q1": {
            "promptDe": "Wodurch kann laut Bürgermeister in der Geschichte Akzeptanz wachsen?",
            "options": [
                "wenn Menschen mitentscheiden und von möglichen Erträgen profitieren",
                "durch Broschüren allein",
                "durch den geforderten Mindestabstand",
            ],
            "answer": "wenn Menschen mitentscheiden und von möglichen Erträgen profitieren",
            "explanationAr": "الدليل حرفياً: «Akzeptanz kann wachsen, wenn Menschen mitentscheiden und von möglichen Erträgen profitieren». الفخّ 1: النص يقول إن الكتيبات وحدها لا تكفي. الفخّ 2: المسافة المطلوبة كانت من المخاوف الأولى، لا سبباً كافياً للقبول.",
            "promptAr": "ما الذي قد يساعد على نمو القبول، بحسب رئيس البلدية في القصة؟",
        },
        "t-b2-26-q2": {
            "promptDe": "Was ist trotz des Bürgerwindparks noch nicht gelöst?",
            "options": [
                "Die Schule hat keinen Strom für die Küche.",
                "Ohne Netzausbau lässt sich der Ökostrom aus dem Windpark nicht vollständig in die Stadt transportieren.",
                "Das alte Kraftwerk läuft das ganze Jahr.",
            ],
            "answer": "Ohne Netzausbau lässt sich der Ökostrom aus dem Windpark nicht vollständig in die Stadt transportieren.",
            "explanationAr": "الدليل حرفياً: «Ohne Netzausbau lässt sich der Ökostrom aus dem Windpark nicht vollständig in die Stadt transportieren». الفخّ 1: الطاقة الشمسية توفّر الكهرباء للمطبخ. الفخّ 2: المحطة القديمة تعمل خلال موسم التدفئة فقط.",
            "promptAr": "ما الذي لم يُحلّ بعد رغم إقامة مشروع الرياح التشاركي؟",
        },
        "t-b2-26-q3": {
            "promptDe": "Das Nachbardorf klagt gegen die geplante Stromtrasse.",
            "explanationAr": "الدليل حرفياً: «gegen die geplante Stromtrasse klagt das Nachbardorf».",
            "promptAr": "هل تقاضي القرية المجاورة بشأن مسار خط الكهرباء المخطط؟",
        },
        "t-b2-26-q4": {
            "promptAr": "وسألوا أيضاً متى يمكن للمنشأة أن ___ الكهرباء في الشبكة.",
        },
    },
    "t-b2-27": {
        "t-b2-27-q1": {
            "promptDe": "Was ist laut Frau Öztürk in ihrer Beratung besonders häufig?",
            "explanationAr": "الدليل حرفياً: «In ihrer Beratung sei die Abo-Falle besonders häufig». الفخّ 1: العبوات المضللة موضوع متكرر أيضاً، لكنها ليست ما وُصف هنا بأنه شائع بوجه خاص. الفخّ 2: الإنذار إجراء قد تتخذه جمعية مؤهلة، لا نوع الحالة نفسها.",
            "promptAr": "ما الحالة الشائعة بوجه خاص في استشارات السيدة أوزتورك؟",
        },
        "t-b2-27-q2": {
            "promptDe": "Wann bestehen laut Text gesetzliche Gewährleistungsrechte?",
            "options": [
                "wenn der Pullover nicht gefällt",
                "bei einem Sachmangel",
                "wenn der Probemonat abgelaufen ist",
            ],
            "answer": "bei einem Sachmangel",
            "explanationAr": "الدليل حرفياً: «Bei einem Sachmangel kann man reklamieren und gesetzliche Gewährleistungsrechte geltend machen». الفخّ 1: عدم الإعجاب بسلعة سليمة لا يكفي. الفخّ 2: انتهاء الفترة التجريبية يتعلق بالاشتراك، لا بعيب السلعة.",
            "promptAr": "متى تثبت حقوق الضمان القانونية بحسب النص؟",
        },
        "t-b2-27-q3": {
            "promptDe": "Wer einen mangelfreien Pullover umtauschen möchte, weil er ihm nicht gefällt, ist normalerweise auf die Kulanz des Händlers angewiesen.",
            "explanationAr": "الدليل حرفياً: «Wer einen mangelfreien Pullover umtauschen möchte, weil er ihm nicht gefällt, ist normalerweise auf die Kulanz des Händlers angewiesen».",
            "promptAr": "إذا أراد شخص استبدال كنزة سليمة لأنها لا تعجبه، فهل يعتمد عادةً على مرونة البائع؟",
        },
    },
    "t-b2-28": {
        "t-b2-28-q1": {
            "options": [
                "Man bekommt eine Kündigung wegen der Sanierung.",
                "Man zieht freiwillig ins Yogastudio-Viertel.",
                "Man wird nicht gekündigt, sondern kann sich das Wohnen dort kaum noch leisten.",
            ],
            "answer": "Man wird nicht gekündigt, sondern kann sich das Wohnen dort kaum noch leisten.",
            "explanationAr": "الدليل حرفياً: «Man wird nicht gekündigt, sondern kann sich das Wohnen dort kaum noch leisten». الفخّ 1: الإخلاء المباشر منفيّ. الفخّ 2: النص لا يصف انتقالاً طوعياً، بل عجزاً عن تحمّل الكلفة.",
        },
        "t-b2-28-q3": {
            "promptDe": "Das Zweckentfremdungsverbot wird im Beispiel streng kontrolliert.",
            "explanationAr": "الدليل حرفياً: «Bewohner beklagen, dass das Verbot kaum kontrolliert werde».",
            "promptAr": "هل يخضع حظر تغيير استخدام المساكن لرقابة صارمة في المثال؟",
        },
        "t-b2-28-q4": {
            "promptDe": "Die Stadt kann ihr ___ nur in gesetzlich geregelten Fällen und zum Wohl der Allgemeinheit ausüben.",
            "explanationAr": "الدليل حرفياً: «Die Stadt kann ihr Vorkaufsrecht nur in gesetzlich geregelten Fällen und zum Wohl der Allgemeinheit ausüben».",
            "promptAr": "لا تستطيع المدينة ممارسة ___ إلا في الحالات التي ينص عليها القانون ولما فيه المصلحة العامة.",
        },
    },
    "t-b2-29": {
        "t-b2-29-q1": {
            "options": [
                "weil ein Fach im deutschen Lehrplan andere Inhalte vorsah",
                "weil ihr Diplom sofort vollständig anerkannt wurde",
                "weil sie den Integrationskurs nicht bestanden hatte",
            ],
            "answer": "weil ein Fach im deutschen Lehrplan andere Inhalte vorsah",
            "explanationAr": "الدليل حرفياً: «weil ein Fach im deutschen Lehrplan andere Inhalte vorsah». الفخّ 1: استغرق فحص معادلة الشهادة تسعة أشهر؛ وهذا سبب طول المعادلة، لا التأهيل التكميلي. الفخّ 2: لا يقول النص إنها أخفقت في دورة الاندماج.",
        },
        "t-b2-29-q2": {
            "explanationAr": "الدليل حرفياً: «Willkommenskultur ist kein Plakat am Bahnhof, sondern eine Person, die Zeit hat». الفخّ 1: اللافتة منفية صراحةً. الفخّ 2: الشهادة ليست تعريفها لثقافة الترحيب.",
        },
        "t-b2-29-q3": {
            "promptDe": "Ihr Mann kam erst im dritten Jahr.",
            "explanationAr": "الدليل حرفياً: «Ihr Mann kam erst im dritten Jahr».",
            "promptAr": "هل لم يصل زوجها إلا في السنة الثالثة؟",
        },
        "t-b2-29-q4": {
            "promptDe": "Die ___ wurde alle sechs Monate verlängert; ihre Bleibeperspektive blieb unklar.",
            "explanationAr": "الدليل حرفياً: «Die Duldung wurde alle sechs Monate verlängert; ihre Bleibeperspektive blieb unklar».",
            "promptAr": "كان ينبغي تجديد وثيقة ___ كل ستة أشهر، مع بقاء أفق بقائها في البلاد غير واضح.",
        },
    },
    "t-b2-30": {
        "t-b2-30-q1": {
            "promptDe": "Was soll Erinnerungsarbeit laut Lehrerin untersuchen?",
            "options": [
                "wer von den Enkeln schuldig ist",
                "wie Menschen Verfolgung unterstützten, duldeten oder sich ihr widersetzten",
                "wann man einen Schlussstrich ziehen kann",
            ],
            "answer": "wie Menschen Verfolgung unterstützten, duldeten oder sich ihr widersetzten",
            "explanationAr": "الدليل حرفياً: «Sie frage, wie Menschen Verfolgung unterstützten, duldeten oder sich ihr widersetzten». الفخّ 1: النص ينفي تحميل الأحفاد ذنب الأجداد. الفخّ 2: وضع خطّ النهاية كان سؤال الساكن.",
            "promptAr": "ما الذي ينبغي لعمل الذاكرة أن يدرسه، بحسب المعلمة؟",
        },
        "t-b2-30-q2": {
            "promptDe": "Womit kann Verharmlosung laut Text manchmal beginnen?",
            "options": [
                "mit einer offenen Lüge",
                "mit einem großen Mahnmal aus Stein",
                "mit einem Wort, das weniger hart klingt als das Geschehene",
            ],
            "answer": "mit einem Wort, das weniger hart klingt als das Geschehene",
            "explanationAr": "الدليل حرفياً: «Manchmal beginnt Verharmlosung nicht mit einer offenen Lüge, sondern mit einem Wort, das weniger hart klingt als das Geschehene». الفخّ 1: النص لا يقول إن التهوين يبدأ دائماً بكذبة صريحة. الفخّ 2: النصب الكبير غير موجود في المثال.",
            "promptAr": "بماذا قد يبدأ التهوين أحياناً بحسب النص؟",
        },
        "t-b2-30-q3": {
            "explanationAr": "الدليل حرفياً: «In der Geschichte starb der letzte Zeitzeuge aus dieser Straße vor zwei Jahren».",
        },
        "t-b2-30-q4": {
            "promptDe": "Vor Haus Nummer 14 liegt seit dem Frühjahr ein kleiner ___ im Gehweg.",
            "explanationAr": "الدليل حرفياً: «Vor Haus Nummer 14 liegt seit dem Frühjahr ein kleiner Stolperstein im Gehweg».",
            "promptAr": "في القصة، يوجد أمام المنزل رقم 14 منذ الربيع حجر صغير مثبت في الرصيف من نوع ___.",
        },
    },
}


def _editorial_payload(item: dict) -> dict:
    return {key: item[key] for key in EDITORIAL_KEYS}


def _payload_hash(payload: dict) -> str:
    serialised = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(serialised.encode("utf-8")).hexdigest()


def _desired_payload(item: dict, text_id: str) -> dict:
    original_payload_hash = _payload_hash(_editorial_payload(item))
    is_known_intermediate = original_payload_hash == INTERMEDIATE_SNAPSHOT_SHA256.get(text_id)
    desired = copy.deepcopy(_editorial_payload(item))
    for before, after in GERMAN_REPLACEMENTS[text_id]:
        before_count = desired["de"].count(before)
        after_count = desired["de"].count(after)
        if before_count == 1 and after_count == 0:
            desired["de"] = desired["de"].replace(before, after, 1)
        elif before_count == 0 and after_count == 1:
            continue  # already prepared; safe to re-run
        elif before_count == 0 and after_count == 0 and is_known_intermediate:
            continue  # exact first-pass R168 snapshot; a later guarded edit handles it
        else:
            raise ValueError(f"unexpected German replacement state in {text_id}: {before_count}/{after_count}: {before[:90]!r}")
    desired.update(TEXT_FIELD_UPDATES[text_id])
    questions = {question.get("id"): question for question in desired["questions"]}
    if len(questions) != len(desired["questions"]):
        raise ValueError(f"duplicate/missing question IDs in {text_id}")
    for question_id, patch in QUESTION_PATCHES[text_id].items():
        if question_id not in questions:
            raise ValueError(f"missing question to patch: {question_id}")
        questions[question_id].update(patch)
    return desired


def validate_batch(batch: list[dict]) -> None:
    if [item["id"] for item in batch] != TARGET_IDS:
        raise ValueError("R168 target order/IDs changed")
    for item in batch:
        if item.get("level") != "B2":
            raise ValueError(f"not a B2 source: {item['id']}")
        if not item.get("titleDe", "").startswith("Beispiel:") or not item.get("titleAr", "").startswith("مثال:"):
            raise ValueError(f"fiction/example framing missing: {item['id']}")
        german = item.get("de", "")
        arabic = item.get("ar", "")
        words_de = len(german.split())
        words_ar = len(arabic.split())
        if not 150 <= words_de <= 230:
            raise ValueError(f"German length outside 150–230 words: {item['id']}={words_de}")
        if len(german.split("\n\n")) != 3:
            raise ValueError(f"expected three German paragraphs: {item['id']}")
        if words_ar < max(100, int(words_de * 0.75)):
            raise ValueError(f"Arabic field may be a summary rather than a full translation: {item['id']}={words_ar}/{words_de}")
        if re.search(r"[\u0600-\u06ff]", german):
            raise ValueError(f"Arabic characters found in German source: {item['id']}")
        questions = item.get("questions", [])
        if len(questions) != 4 or len({question.get("id") for question in questions}) != 4:
            raise ValueError(f"expected four uniquely identified questions: {item['id']}")
        for question in questions:
            if not question.get("promptDe", "").strip() or not question.get("promptAr", "").strip() or not question.get("explanationAr", "").strip():
                raise ValueError(f"incomplete bilingual question: {item['id']}:{question.get('id')}")
            kind = question.get("type")
            if kind == "mc":
                options = question.get("options", [])
                if len(options) < 2 or len(options) != len(set(options)) or question.get("answer") not in options:
                    raise ValueError(f"invalid MC options/key: {item['id']}:{question.get('id')}")
            elif kind == "truefalse":
                if question.get("options") != ["richtig", "falsch"] or question.get("answer") not in {"richtig", "falsch"}:
                    raise ValueError(f"invalid true/false key: {item['id']}:{question.get('id')}")
            elif kind == "fill":
                answer = question.get("answer")
                if not isinstance(answer, list) or not answer or any(word not in german for word in answer):
                    raise ValueError(f"invalid fill answer/source: {item['id']}:{question.get('id')}")
            else:
                raise ValueError(f"unknown question type {kind!r}: {item['id']}:{question.get('id')}")
            for quote in re.findall(r"«([^»]+)»", question["explanationAr"]):
                if quote not in german:
                    raise ValueError(f"non-literal quoted evidence: {item['id']}:{question.get('id')}: {quote!r}")


def apply_reviewed_fields(by_id: dict[str, dict]) -> int:
    if (set(SOURCE_SNAPSHOT_SHA256) != set(TARGET_IDS) or set(TEXT_FIELD_UPDATES) != set(TARGET_IDS)
            or set(GERMAN_REPLACEMENTS) != set(TARGET_IDS) or set(QUESTION_PATCHES) != set(TARGET_IDS)):
        raise ValueError("R168 guards/targets do not match")
    changed = 0
    for text_id in TARGET_IDS:
        item = by_id.get(text_id)
        if item is None or item.get("level") != "B2":
            raise ValueError(f"missing or wrong-level source text: {text_id}")
        current = _payload_hash(_editorial_payload(item))
        desired = _desired_payload(item, text_id)
        desired_hash = _payload_hash(desired)
        if current in {SOURCE_SNAPSHOT_SHA256[text_id], INTERMEDIATE_SNAPSHOT_SHA256.get(text_id)}:
            for key in EDITORIAL_KEYS:
                item[key] = desired[key]
            changed += 1
        elif current != desired_hash:
            raise ValueError(f"refusing to overwrite unreviewed fields in {text_id}: payload hash={current}")
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare", action="store_true", help="apply guarded review edits before TTS")
    args = parser.parse_args()

    texts = json.loads(TEXTS_FILE.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in texts}
    if len(by_id) != len(texts):
        raise ValueError("duplicate text IDs")
    changed = apply_reviewed_fields(by_id)
    batch = [by_id[text_id] for text_id in TARGET_IDS]
    validate_batch(batch)
    if changed:
        TEXTS_FILE.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    word_counts = {item["id"]: len(item["de"].split()) for item in batch}
    arabic_counts = {item["id"]: len(item["ar"].split()) for item in batch}
    source_hashes = {item["id"]: hashlib.sha256(item["de"].encode("utf-8")).hexdigest() for item in batch}
    print("R168 guarded review: texts changed:", changed)
    print("R168 German words:", json.dumps(word_counts, ensure_ascii=False))
    print("R168 Arabic words:", json.dumps(arabic_counts, ensure_ascii=False))
    print("R168 German source SHA-256:", json.dumps(source_hashes, ensure_ascii=False))
    print("R168 sentence endings:", sum(len(re.findall(r"[.!?](?:[\"»”])?(?:\s|$)", item["de"])) for item in batch))
    print("R168 questions:", sum(len(item["questions"]) for item in batch))
    if args.prepare:
        print("R168 prepare complete; generate audio from each exact current German `de` field.")
        return

    if VOICE == "TO_BE_SELECTED":
        raise ValueError("set VOICE to the voice selected in the completed de-DE audition")
    if set(SOURCE_SHA256) != set(TARGET_IDS) or any(value == "TO_BE_FILLED" for value in SOURCE_SHA256.values()):
        raise ValueError("populate SOURCE_SHA256 from the reviewed German `de` fields after --prepare and TTS")
    for item in batch:
        digest = hashlib.sha256(item["de"].encode("utf-8")).hexdigest()
        if SOURCE_SHA256.get(item["id"]) != digest:
            raise ValueError(f"R168 audio/source hash mismatch: {item['id']}")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    by_audio_id = {entry["id"]: entry for entry in entries}
    if len(by_audio_id) != len(entries) or manifest.get("count") != len(entries):
        raise ValueError("HörLabor count/ID mismatch")
    if len(entries) not in {142, 147}:
        raise ValueError(f"unexpected starting HörLabor count: {len(entries)}")
    dialog_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "dialog-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    diktat_ids = {entry["id"] for entry in json.loads((ROOT / "content" / "diktat-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}

    added = refreshed = 0
    for item in batch:
        text_id = item["id"]
        if text_id in dialog_ids or text_id in diktat_ids:
            raise ValueError(f"cross-manifest audio assignment: {text_id}")
        path = AUDIO_DIR / f"{text_id}.mp3"
        if not path.is_file() or path.stat().st_size < 8000:
            raise ValueError(f"missing or undersized MP3: {path}")
        data = path.read_bytes()
        if data[:3] != b"ID3":
            raise ValueError(f"missing ID3v2 header: {text_id}")
        frames = mp3_frame_count(data)
        if frames < 1:
            raise ValueError(f"no MPEG Layer III frames: {text_id}")
        expected = {"id": text_id, "file": f"/audio/hoeren/{text_id}.mp3", "voice": VOICE, "level": "B2", "bytes": len(data)}
        old = by_audio_id.get(text_id)
        if old is None:
            entries.append(expected)
            by_audio_id[text_id] = expected
            added += 1
        elif any(old.get(key) != value for key, value in expected.items()):
            if old.get("id") != text_id or old.get("file") != expected["file"] or old.get("level") != "B2":
                raise ValueError(f"refusing to change unrelated manifest identity: {text_id}")
            old.update(expected)
            refreshed += 1
        print(f"✓ {text_id}: {len(item['de'].split())} words · {len(data)} bytes · {frames} MPEG Layer III frames")

    manifest_ids = {entry["id"] for entry in entries}
    disk_ids = {path.stem for path in AUDIO_DIR.glob("*.mp3")}
    if manifest_ids != disk_ids or not set(TARGET_IDS).issubset(manifest_ids):
        raise ValueError(f"manifest/disk mismatch: disk-only={disk_ids - manifest_ids}, manifest-only={manifest_ids - disk_ids}")
    if len(entries) != 147:
        raise ValueError(f"expected 147 HörLabor files after R168, got {len(entries)}")
    if added or refreshed:
        manifest["count"] = len(entries)
        manifest["updated"] = date.today().isoformat()
        MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R168: {added} new manifest entries · {refreshed} refreshed entries · {manifest['count']} HörLabor files total")


if __name__ == "__main__":
    main()
