# -*- coding: utf-8 -*-
"""R170: review, fully translate, and add the final five B2 HörLabor texts.

Run --prepare to apply the guarded editorial payloads. Generate one German
recording from each exact final `de` field, then run without arguments to
validate the MP3s and update only content/hoeren-audio.json.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
from datetime import date
import re
from pathlib import Path

from add_a0_hoeren_audio_02 import mp3_frame_count

ROOT = Path(__file__).resolve().parents[2]
TEXTS_FILE = ROOT / "content" / "texts.json"
MANIFEST_FILE = ROOT / "content" / "hoeren-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "hoeren"
TARGET_IDS = [f"t-b2-{number}" for number in range(36, 41)]
EDITORIAL_KEYS = ("titleDe", "titleAr", "de", "ar", "questions", "wordCountDe")

# SHA-256 of the exact source payloads inspected before R170. The guard covers
# titles, complete texts, all questions, and the previously recorded word count.
SOURCE_SNAPSHOT_SHA256: dict[str, str] = {
    "t-b2-36": "56e063ada3b7233f6184c94b1ea0d68ab86d87f679a1a7a6636ec573bfa54739",
    "t-b2-37": "8f9cb5215431ff25207279927f3a3f16f8259cafbbc3fe2eda05a4f93819ec04",
    "t-b2-38": "49474f15c4bda67aa33d18b18ce98d9f497782c6fff4689fb5cced776ae76e7b",
    "t-b2-39": "3daaf030662701810dca03f4d3e8c7bc48eab0c9d32377fc51da743be0d08933",
    "t-b2-40": "5c84d0420685c4fcd9427eec2eaf7692347eb6e9843cbc345d30c07753ad60ef",
}

# If the final reviewed text is refined after the first --prepare pass, record
# that exact intermediate payload hash here before reapplying the final patch.
INTERMEDIATE_SNAPSHOT_SHA256: dict[str, str] = {
    "t-b2-36": "cc10dfd52a9fdc13f467a399f355026f529d687bd2c7318952990be1aea910eb",
    "t-b2-37": "d12ca30897d0e3449be1a5432924055d4d9b128061d1f5efbcf7453a589d122f",
    "t-b2-38": "6e00ddf4c7f00e248655b70a103fdfbe14dd773a5f21ba73bfa81adab208c386",
    "t-b2-39": "bd377366dbd2a75dd44cc149f7ee150ca97a3c1bf0f28cb98789af2db009b47e",
    "t-b2-40": "24bb6d4f8e71af04c05a8c81642b31ea26b5a2453b2ecef965deb9682c642af4",
}

# Populate from the exact final German fields after --prepare and TTS.
SOURCE_SHA256: dict[str, str] = {
    "t-b2-36": "a71f2701b7f628dd97c0b297796e7767b8f930521c36633a759666c9295c11d5",
    "t-b2-37": "e6ef96c3551d71ab2bc9d9f27b7574d99f4c98e2fc261e55aa085ebe98124baa",
    "t-b2-38": "1b6621baeb8c87e2ba91245a2705282af37ccca83ddd9de541b011746a093bae",
    "t-b2-39": "cb10922559c067a9741193bf8c51e4164ca502bdecff81334433815da250aaee",
    "t-b2-40": "e9e7b6ff82522140ee2b89677277ceca5e941655add59652abc3ce2234e87270",
}
VOICE = "voice-03 (de-DE, Arena TTS)"

TEXT_FIELD_UPDATES: dict[str, dict[str, str]] = {
    "t-b2-36": {
        "titleDe": "Sollte der Schulbeginn später sein?",
        "titleAr": "هل ينبغي أن يبدأ الدوام المدرسي لاحقاً؟",
        "de": """Eine mögliche Änderung wäre, den Schulbeginn von 8 auf 9 Uhr zu verlegen. Dafür spricht, dass viele Jugendliche in der Pubertät abends später einschlafen als jüngere Kinder. Sie sind morgens oft noch müde, was ihre Konzentration und ihr Gedächtnis beeinträchtigen kann. Auch für die psychische Gesundheit kann dauerhafter Schlafmangel problematisch sein. Befürworter meinen deshalb, ein späterer Start könne den Schulalltag besser an den Schlafrhythmus vieler Jugendlicher anpassen. Kritiker wenden ein, dass ein späterer Unterrichtsbeginn Eltern vor organisatorische Probleme stellt und mit den Nachmittagsaktivitäten der Jugendlichen kollidieren kann. Wie sich der spätere Beginn auf die schulischen Leistungen auswirkt, sollte man ebenfalls prüfen. Busfahrpläne, Arbeitszeiten der Eltern und die Betreuung jüngerer Geschwister müssten berücksichtigt werden. Ein späteres Schulende könnte zusätzliche Kosten für Räume und Betreuung verursachen.

Dennoch halte ich einen Modellversuch an einigen Schulen für sinnvoll. Dabei sollte man nicht nur Noten, sondern auch Schlaf, Wohlbefinden und Unterrichtsbeteiligung beobachten. Arbeitszeiten des Schulpersonals und Angebote am Nachmittag müssen ebenfalls berücksichtigt werden.

Zeigt sich, dass Jugendliche ausgeruhter und aufmerksamer sind, sollte man den Schulbeginn neu bewerten, statt den frühen Start um jeden Preis als selbstverständlich hinzunehmen.""",
        "ar": """من التغييرات الممكنة نقل بدء الدراسة من الثامنة إلى التاسعة. ومن الحجج المؤيدة لذلك أن كثيراً من المراهقين في سن البلوغ يخلدون إلى النوم مساءً في وقت متأخر مقارنةً بالأطفال الأصغر سناً. وغالباً ما يكونون متعبين في الصباح، وقد يؤثر ذلك في تركيزهم وذاكرتهم. كما يمكن أن يشكل نقص النوم المستمر مشكلة للصحة النفسية. لذلك يرى المؤيدون أن البدء في وقت لاحق قد يجعل اليوم الدراسي أكثر توافقاً مع إيقاع نوم كثير من المراهقين. ويعترض المنتقدون بأن تأخير بدء الدروس يضع الأهل أمام مشكلات تنظيمية، وقد يتعارض مع أنشطة المراهقين بعد الظهر. وينبغي أيضاً التحقق من أثر هذا التغيير في التحصيل الدراسي. كما يجب مراعاة جداول الحافلات وأوقات عمل الوالدين ورعاية الإخوة الأصغر سناً. وقد يسبب انتهاء الدوام المدرسي في وقت متأخر تكاليف إضافية للمباني والرعاية.

ومع ذلك، أرى أن تجربة هذا النظام في بعض المدارس فكرة مفيدة. وينبغي خلالها متابعة النوم والرفاه والمشاركة في الدرس، لا العلامات وحدها. كما ينبغي أن تأخذ التجربة في الحسبان أوقات عمل العاملين في المدرسة والأنشطة المتاحة بعد الظهر.

وإذا تبيّن أن الطلاب والطالبات أكثر انتعاشاً وانتباهًا، فينبغي إعادة تقييم بدء الدراسة بدلاً من اعتبار الموعد المبكر أمراً مسلّماً به بأي ثمن.""",
    },
    "t-b2-37": {
        "titleDe": "Beispiel: Kommunikation zwischen Kulturen",
        "titleAr": "مثال: التواصل بين الثقافات",
        "de": """Das folgende Beispiel ist fiktiv. Als ich vor vier Jahren zum ersten Mal nach Deutschland kam, war ich überrascht, wie direkt Kolleginnen, Kollegen und Nachbarn ihre Meinung äußerten. In der Umgebung, aus der ich komme, galt es oft als höflich, Kritik indirekt zu formulieren und zunächst länger über alltägliche Dinge zu sprechen. Einige sagten etwa «Das funktioniert so nicht» oder «Da bin ich anderer Meinung», ohne unfreundlich wirken zu wollen. Anfangs empfand ich das als Ablehnung. Später verstand ich: Direkte Kommunikation muss nicht respektlos sein; sie kann Transparenz und Effizienz fördern. Meine vorsichtigen Formulierungen galten einigen deutschen Kolleginnen und Kollegen dagegen als unklar oder unentschlossen.

Diese Erfahrung zeigte mir, dass Kommunikation auch kulturell geprägt ist. Missverständnisse werden seltener, wenn man eigene Erwartungen reflektiert und die der anderen ernst nimmt. Heute frage ich nach, wenn ich eine Äußerung nicht richtig verstehe, und formuliere meine eigene Meinung klarer als früher. So spreche ich Unklarheiten früh an. Das kostet manchmal Zeit, kann aber Vertrauen im Team schaffen.

Für mich bedeutet gute Kommunikation nicht, immer einer Meinung zu sein. Wichtig ist, dass beide Seiten ihre Erwartungen erklären können. Die fiktive Geschichte ist kein Urteil über alle Menschen eines Landes. Sie zeigt, wie eine Person ein Missverständnis erlebt und ihre Einschätzung verändert.""",
        "ar": """المثال الآتي متخيّل. عندما جئت إلى ألمانيا لأول مرة قبل أربع سنوات، فوجئت بمدى مباشرة بعض الزملاء والزميلات والجيران في التعبير عن آرائهم. في البيئة التي أتيت منها، كان يُعدّ من اللباقة غالباً صياغة النقد بطريقة غير مباشرة والتحدث مطولاً عن أمور الحياة اليومية أولاً. وسمعت عبارات مثل «هذا لا ينجح بهذه الطريقة» أو «أرى الأمر على نحو مختلف»، من دون أن يريد المتحدثون أن يبدوا غير ودودين. في البداية شعرت بأن ذلك رفض لي. ثم فهمت أن التواصل المباشر لا يعني بالضرورة قلة احترام؛ فقد يعزز الشفافية والفعالية. وفي المقابل، رأى بعض زملائي وزميلاتي الألمان أن صياغتي الحذرة غير واضحة أو مترددة.

أظهرت لي هذه التجربة أن التواصل يتأثر بالثقافة أيضاً. ويقل سوء الفهم عندما يراجع المرء توقعاته ويحترم توقعات الآخرين. أسأل اليوم عندما لا أفهم عبارة على نحو صحيح، وأعبّر عن رأيي بوضوح أكبر من السابق. وهكذا أطرح مواطن الغموض مبكراً. وقد يستغرق ذلك وقتاً أحياناً، لكنه قد يبني الثقة في الفريق.

لا يعني التواصل الجيد بالنسبة إليّ أن نتفق دائماً. المهم أن يشرح الطرفان توقعاتهما. ولا يزعم هذا المثال أن جميع أبناء بلد واحد يتواصلون بالطريقة نفسها؛ بل يوضح كيف يختبر شخص سوء فهم ويغيّر تقييمه لاحقاً.""",
    },
    "t-b2-38": {
        "titleDe": "Vier-Tage-Modelle: Was Pilotprojekte zeigen",
        "titleAr": "نماذج العمل لأربعة أيام: ما الذي تظهره التجارب؟",
        "de": """Vier-Tage-Modelle unterscheiden sich in Arbeitszeit, Lohn und Branche; ihre Ergebnisse sind nur begrenzt übertragbar. In Island blieben laut Alda und Autonomy Produktivität und Dienste trotz kürzerer Arbeitszeit meist stabil oder verbesserten sich; das Wohlbefinden stieg. Im britischen Versuch von 2022 verkürzten 61 Organisationen ihre Arbeitszeit sechs Monate lang ohne Gehaltskürzung. Nur 23 von 61 Organisationen lieferten Umsatzdaten; der nach Größe gewichtete Umsatzdurchschnitt stieg um 1,4 Prozent. Das beweist keine Kausalität. An der deutschen Pilotstudie nahmen 45 Organisationen teil. Beschäftigte berichteten von Verbesserungen ihrer mentalen und körperlichen Gesundheit; die Krankheitstage gingen leicht zurück, der Unterschied war jedoch statistisch nicht signifikant.

Die Projekte waren zeitlich begrenzt und unterschiedlich aufgebaut; manche Ergebnisse beruhen auf Selbstauskünften. Eine Vier-Tage-Woche kann Wochenstunden reduzieren oder dieselben Stunden auf weniger Tage verteilen; die Folgen unterscheiden sich. Öffnungszeiten und Versorgung müssen in manchen Branchen gesichert bleiben.

Ein Erfolgsurteil für alle Branchen wäre unangebracht. Versuche sollten Arbeitsbelastung, Servicequalität, Leistung und Wohlbefinden länger erfassen. Ziele vereinbart man vorher mit Beschäftigten; mögliche Nachteile prüft man danach offen. Erst solche Daten zeigen, ob eine kürzere Woche am jeweiligen Arbeitsplatz fair und tragfähig ist.""",
        "ar": """تختلف نماذج العمل لأربعة أيام في ساعات العمل والأجر والقطاع؛ لذلك لا يمكن تعميم نتائج التجارب بسهولة. ففي آيسلندا، ظلت الإنتاجية والخدمات في معظم أماكن العمل المشاركة على حالها أو تحسنت رغم تقليص ساعات العمل، وفق تقرير أعدّته Alda وAutonomy؛ كما تحسن الرفاه. وفي التجربة البريطانية لعام 2022، خفّضت 61 منظمة ساعات العمل لمدة ستة أشهر من دون خفض الرواتب. ولم تتمكن من تقديم بيانات الإيرادات إلا 23 منظمة من أصل 61؛ وارتفع متوسط إيراداتها بنسبة 1.4% بعد الترجيح بحسب حجم المنظمة. لكن ذلك لا يثبت وجود علاقة سببية. وشاركت 45 منظمة في الدراسة التجريبية الألمانية. وأفاد الموظفون بتحسن صحتهم النفسية والجسدية؛ وانخفضت أيام المرض قليلاً، لكن الانخفاض لم يكن ذا دلالة إحصائية.

كانت المشاريع محدودة المدة ومختلفة التصميم؛ وتعتمد بعض نتائجها على إفادات المشاركين. وقد يعني أسبوع العمل لأربعة أيام تقليل ساعات العمل الأسبوعية أو توزيع الساعات نفسها على أيام أقل؛ ويؤثر كل نموذج في الموظفين بطريقة مختلفة. كما ينبغي ضمان استمرار ساعات الاستقبال وتقديم الخدمات في بعض القطاعات.

لذلك لا يصح إعلان أن أسبوع العمل لأربعة أيام ناجح في جميع القطاعات. والأفضل إجراء تجارب ترافقها متابعة جيدة، وترصد عبء العمل وجودة الخدمات والأداء والرفاه على مدى أطول. وينبغي الاتفاق مسبقاً مع الموظفين على الأهداف، ثم فحص النتائج السلبية المحتملة بشفافية. ولا تكشف هذه البيانات إلا ما إذا كان أسبوع العمل الأقصر عادلاً وقابلاً للاستمرار في مكان عمل محدد.""",
    },
    "t-b2-39": {
        "titleDe": "Stadtflucht und Landleben",
        "titleAr": "الهجرة من المدن والحياة الريفية",
        "de": """Manche Familien ziehen aus teuren Großstädten ins Umland oder aufs Land. Gründe können hohe Mieten, enge Wohnungen und der Wunsch nach mehr Natur und Ruhe sein. Doch das Landleben passt nicht für alle. Je nach Region fahren öffentliche Verkehrsmittel seltener; Arztpraxen und Schulen können weit entfernt sein, während kulturelle Angebote wie Theater oder Kinos rar sein können. Homeoffice und Videokonferenzen erleichtern manchen Beschäftigten den Umzug. Das setzt jedoch ausreichend schnelles Internet voraus. Ein Staat, der freie Wohnortwahl ermöglichen will, sollte fehlende Infrastruktur ausbauen. Sonst könnte «Stadtflucht» ein Privileg höherer Einkommen bleiben.

Vor dem Umzug sollten Familien die Entfernung zu ihren Arbeitsplätzen und verfügbare Kinderbetreuung prüfen. Wer ohne Auto lebt, braucht eine verlässliche Verbindung zur nächsten Stadt. Vereine und gute Nachbarschaftskontakte können Zugezogenen helfen, Anschluss zu finden. Ein ruhiger Wohnort allein löst nicht alle Probleme.

Gemeinden sollten deshalb neben Wohnraum auch Verkehr und öffentliche Angebote mitplanen. Welche Lösungen passen, hängt von den Bedingungen vor Ort ab. Wer ländliche Regionen stärken will, sollte die Bedürfnisse der heutigen Bewohner und der neu Zugezogenen berücksichtigen. Solche Lösungen sollten regelmäßig überprüft werden.""",
        "ar": """تنتقل بعض الأسر من المدن الكبرى الغالية إلى الضواحي أو إلى الريف. وقد تكون أسباب ذلك ارتفاع الإيجارات وضيق المساكن والرغبة في مزيد من الطبيعة والهدوء. لكن الحياة الريفية لا تناسب الجميع. فبحسب المنطقة، قد تقلّ وتيرة وسائل النقل العام، وقد تبعد عيادات الأطباء والمدارس، وقد تكون العروض الثقافية مثل المسارح ودور السينما قليلة. وقد سهّل العمل من المنزل ومؤتمرات الفيديو انتقال بعض الموظفين. غير أن ذلك يتطلب إنترنت سريعاً بما يكفي. وينبغي للدولة التي تريد إتاحة حرية اختيار مكان السكن أن تطوّر البنية التحتية حيثما تنقص. وإلا فقد تظل «الهجرة من المدينة» امتيازاً لأصحاب الدخول الأعلى.

قبل الانتقال، ينبغي للأسر أن تتحقق من بُعد أماكن عمل أفرادها ومن توافر رعاية الأطفال. ومن لا يملك سيارة يحتاج إلى مواصلات موثوقة إلى أقرب مدينة. وقد تساعد الجمعيات المحلية وعلاقات الجوار الجيدة الوافدين الجدد على تكوين علاقات. فالمكان الهادئ وحده لا يحل جميع المشكلات.

لذلك ينبغي للبلديات أن تخطط للسكن والمواصلات والخدمات العامة معاً. وتتوقف الحلول المناسبة على الظروف المحلية. ومن يريد تعزيز المناطق الريفية عليه أن يراعي احتياجات سكانها الحاليين والوافدين الجدد. وينبغي تقييم هذه الحلول بانتظام.""",
    },
    "t-b2-40": {
        "titleDe": "Warum lügen Menschen?",
        "titleAr": "لماذا يكذب الناس؟",
        "de": """Lügen gelten vielen Menschen als moralisch verwerflich. Trotzdem sagen Menschen im Alltag manchmal nicht die ganze Wahrheit. Die Motive unterscheiden sich: Manche Unwahrheiten dienen dem Selbstschutz, etwa um Strafe oder Blamage zu vermeiden. Andere sollen Mitmenschen schonen. So kann jemand aus Höflichkeit sagen: «Das Essen hat mir geschmeckt», obwohl die Person es nicht mochte. Wieder andere Unwahrheiten dienen der Selbstdarstellung. In sozialen Medien stellen manche Menschen ihr Leben erfolgreicher oder interessanter dar, als es tatsächlich ist. Problematisch wird es, wenn Lügen Vertrauen zerstören oder andere bewusst manipulieren. Eine kleine Höflichkeitslüge kann zunächst harmlos erscheinen; erfährt die andere Person später die Wahrheit, kann die Lüge eine Beziehung jedoch belasten.

Entscheidend ist auch, wem eine Aussage nützt und wer dadurch Nachteile hat. Die Grenze zwischen höflichem Schweigen und bewusster Täuschung lässt sich nicht immer leicht ziehen. Ein ehrliches Gespräch kann zunächst unangenehm sein, aber spätere Enttäuschungen verhindern.

Eine offene Kommunikationskultur, in der Fehler zugegeben werden dürfen, kann dazu beitragen, unnötige Lügen zu verringern. Sie erleichtert es, Probleme direkt anzusprechen, ohne andere absichtlich zu verletzen. Das ist kein Freibrief für jede ungeschminkte Äußerung: Ehrlichkeit braucht Rücksicht und sollte auch daran gemessen werden, ob sie den Beteiligten bei einer Lösung hilft.""",
        "ar": """يعدّ كثيرون الكذب مرفوضاً أخلاقياً. ومع ذلك، لا يقول الناس أحياناً الحقيقة كاملة في حياتهم اليومية. وتختلف الدوافع: فبعض العبارات غير الصادقة تهدف إلى حماية صاحبها، مثلاً من العقاب أو الإحراج. وتهدف أخرى إلى مراعاة مشاعر الآخرين. فقد يقول شخص بدافع اللباقة: «أعجبني الطعام»، مع أن الطعام لم يعجب ذلك الشخص. وتخدم عبارات أخرى تحسين صورة الشخص عن نفسه. وفي وسائل التواصل الاجتماعي، يعرض بعض الناس حياتهم على أنها أكثر نجاحاً أو إثارة مما هي عليه فعلاً. ويصبح الأمر مشكلة إذا هدم الكذب الثقة أو تعمد شخص التلاعب بالآخرين. وقد تبدو كذبة مجاملة صغيرة غير مؤذية في البداية؛ لكن إذا عرف الطرف الآخر الحقيقة لاحقاً، فقد تضر الكذبة بالعلاقة بينهما.

ومن المهم أيضاً أن نسأل: من يستفيد من عبارة ما، ومن يتضرر بسببها؟ ولا يسهل دائماً رسم الحد الفاصل بين الصمت بدافع اللباقة والخداع المتعمد. وقد يكون الحديث الصريح مزعجاً في البداية، لكنه قد يمنع خيبات أمل لاحقاً.

وقد تسهم ثقافة التواصل المفتوحة، التي يُسمح فيها بالاعتراف بالأخطاء، في تقليل الأكاذيب غير الضرورية. وهي تسهّل مناقشة المشكلات مباشرةً من دون تعمد إيذاء الآخرين. لكن ذلك لا يبرر كل تعبير صريح بلا تلطيف؛ فالصدق يحتاج إلى مراعاة الآخرين، وينبغي تقييمه أيضاً بالنظر إلى ما إذا كان يساعد الأطراف المعنية على إيجاد حل.""",
    },
}

QUESTION_PATCHES: dict[str, dict[str, dict[str, object]]] = {
    "t-b2-36": {
        "t-b2-36-q1": {
            "promptDe": "Welchen Einwand nennen die Kritiker?",
            "promptAr": "ما حجة النقاد؟",
            "options": [
                "Jugendliche sind morgens oft noch müde.",
                "Ein späterer Unterrichtsbeginn kann Eltern vor organisatorische Probleme stellen.",
                "Der spätere Start verbessert nachweislich die schulischen Leistungen.",
                "Schulen müssen Busfahrpläne und Betreuung nicht berücksichtigen.",
            ],
            "answer": "Ein späterer Unterrichtsbeginn kann Eltern vor organisatorische Probleme stellen.",
            "explanationAr": "الدليل في النص: «Kritiker wenden ein, dass ein späterer Unterrichtsbeginn Eltern vor organisatorische Probleme stellt» — هذا هو اعتراض النقاد. أما التعب فهو من الحجج المؤيدة، وأثر البدء المتأخر في التحصيل ينبغي فحصه لا افتراضه، كما أن جداول الحافلات والرعاية تحتاج إلى مراعاة.",
        },
        "t-b2-36-q2": {
            "promptDe": "Was hält der Autor für sinnvoll?",
            "promptAr": "ما الذي يراه الكاتب مفيداً؟",
            "options": [
                "Einen Modellversuch an einigen Schulen",
                "Eine sofortige Änderung an allen Schulen",
                "Nur die Noten statt auch Schlaf und Wohlbefinden zu beobachten",
            ],
            "explanationAr": "الدليل في النص: «Dennoch halte ich einen Modellversuch an einigen Schulen für sinnvoll.» — يوصي الكاتب بتجربة محدودة، لا بتغيير فوري في جميع المدارس. كما يدعو إلى متابعة النوم والرفاه والمشاركة، لا العلامات وحدها.",
        },
    },
    "t-b2-37": {
        "t-b2-37-q1": {
            "promptDe": "Was überraschte die erzählende Person an ihren ersten Begegnungen in Deutschland?",
            "promptAr": "ما الذي فاجأ الشخصية الراوية في لقاءاتها الأولى بألمانيا؟",
            "options": [
                "Die Direktheit von Kolleginnen, Kollegen und Nachbarn",
                "Das lange Gespräch über alltägliche Dinge vor jeder Kritik",
                "Dass die erzählende Person ihre Meinung gar nicht äußerte",
            ],
            "answer": "Die Direktheit von Kolleginnen, Kollegen und Nachbarn",
            "explanationAr": "الدليل في النص: «wie direkt Kolleginnen, Kollegen und Nachbarn ihre Meinung äußerten» — ما فاجأ الشخصية هو مباشرة بعض من قابلتهم. ويظل ذلك تجربة الراوي في المثال الخيالي، لا حكماً على طريقة تواصل جميع الناس في ألمانيا.",
        },
        "t-b2-37-q2": {
            "explanationAr": "الدليل في النص: «Missverständnisse werden seltener, wenn man eigene Erwartungen reflektiert und die der anderen ernst nimmt.» — تقل حالات سوء الفهم بمراجعة التوقعات واحترام توقعات الآخرين.",
        },
    },
    "t-b2-38": {
        "t-b2-38-q1": {
            "promptDe": "Warum lassen sich die Ergebnisse der Pilotprojekte nur begrenzt übertragen?",
            "promptAr": "لماذا لا يمكن تعميم نتائج التجارب بسهولة على جميع أماكن العمل؟",
            "options": [
"Weil sich Arbeitszeit, Lohn und Branche unterscheiden.",
                "Weil alle Projekte dieselbe Branche untersuchten.",
                "Weil in keinem Projekt die Gesundheit erfasst wurde.",
            ],
            "answer": "Weil sich Arbeitszeit, Lohn und Branche unterscheiden.",
            "explanationAr": "الدليل في النص: «Vier-Tage-Modelle unterscheiden sich in Arbeitszeit, Lohn und Branche» — تختلف النماذج في ساعات العمل والأجر والقطاع، لذلك لا يصح تعميم نتيجة نموذج واحد. كما يذكر النص تحسناً في الصحة، لا غياب بيانات عنها.",
        },
        "t-b2-38-q2": {
            "promptDe": "Welche Einschränkung für die Schlussfolgerungen nennt der Text?",
            "promptAr": "ما القيد الذي يذكره النص عند استخلاص النتائج؟",
            "options": [
                "Die Projekte waren zeitlich begrenzt und unterschiedlich aufgebaut.",
                "Alle Projekte dauerten mehrere Jahre und nutzten dasselbe Modell.",
                "Alle Ergebnisse beruhten ausschließlich auf Umsatzdaten.",
            ],
            "answer": "Die Projekte waren zeitlich begrenzt und unterschiedlich aufgebaut.",
            "explanationAr": "الدليل في النص: «Die Projekte waren zeitlich begrenzt und unterschiedlich aufgebaut» — كانت المشاريع محدودة المدة ومختلفة التصميم. ويضيف النص أن بعض النتائج تعتمد على إفادات المشاركين، لذا يجب تجنب التعميم.",
        },
    },
    "t-b2-39": {
        "t-b2-39-q1": {
            "options": [
                "Wegen hoher Mieten, enger Wohnungen und des Wunsches nach mehr Natur und Ruhe",
                "Wegen häufiger öffentlicher Verkehrsmittel",
                "Wegen der Nähe von Schulen und Arztpraxen",
                "Wegen eines größeren Kulturangebots auf dem Land",
            ],
            "answer": "Wegen hoher Mieten, enger Wohnungen und des Wunsches nach mehr Natur und Ruhe",
            "explanationAr": "الدليل في النص: «Gründe können hohe Mieten, enge Wohnungen und der Wunsch nach mehr Natur und Ruhe sein.» — هذه أسباب محتملة. أما المدارس والنقل العام والعروض الثقافية فتُذكر بوصفها تحديات قد تواجه الريف، ولا يذكر النص قصر طريق العمل سبباً للانتقال.",
        },
        "t-b2-39-q2": {
            "promptDe": "Was sollte der Staat laut dem Text im ländlichen Raum ausbauen?",
            "options": [
                "Die Infrastruktur",
                "Die Mieten in den Großstädten",
                "Nur die Zahl der Theater und Kinos",
            ],
            "answer": "Die Infrastruktur",
            "explanationAr": "الدليل في النص: «sollte fehlende Infrastruktur ausbauen» — ينبغي تطوير البنية التحتية الناقصة، ومنها ما يدعم النقل والإنترنت والخدمات العامة. ولا يقترح النص رفع الإيجارات أو الاكتفاء بزيادة عدد المسارح.",
        },
    },
    "t-b2-40": {
        "t-b2-40-q1": {
            "options": [
                "Um Mitmenschen zu schonen",
                "Um Mitmenschen bewusst zu manipulieren",
                "Um sich in sozialen Medien erfolgreicher darzustellen",
                "Um eine Beziehung zu belasten",
            ],
            "answer": "Um Mitmenschen zu schonen",
            "explanationAr": "الدليل في النص: «Andere sollen Mitmenschen schonen.» — تُقال كذبة المجاملة لتلطيف أثر الكلام على الآخرين. أما التلاعب فمذكور بوصفه أمراً إشكالياً، وتحسين الصورة في وسائل التواصل دافع آخر لا يجيب عن سؤال المجاملة.",
        },
        "t-b2-40-q2": {
            "promptDe": "Wie sollte eine hilfreiche Kommunikationskultur laut Text gestaltet sein?",
            "promptAr": "كيف ينبغي أن تكون ثقافة التواصل المفيدة بحسب النص؟",
            "options": [
                "Fehler dürfen zugegeben und Probleme direkt angesprochen werden.",
                "Kritik wird grundsätzlich verschwiegen.",
                "Jede unangenehme Wahrheit wird ohne Rücksicht ausgesprochen.",
            ],
            "answer": "Fehler dürfen zugegeben und Probleme direkt angesprochen werden.",
            "explanationAr": "الدليل في النص: «in der Fehler zugegeben werden dürfen» و«Sie erleichtert es, Probleme direkt anzusprechen» — تسمح ثقافة التواصل بالاعتراف بالأخطاء ومناقشة المشكلات مباشرة. ولا يدعو النص إلى إخفاء النقد أو إلى قول كل حقيقة بلا مراعاة.",
        },
    },
}

NEW_QUESTIONS: dict[str, list[dict[str, object]]] = {
    "t-b2-36": [
        {
            "id": "t-b2-36-q3", "type": "truefalse",
            "promptDe": "Ein späterer Unterrichtsbeginn kann mit Nachmittagsaktivitäten kollidieren.",
            "promptAr": "قد يتعارض بدء الدروس في وقت متأخر مع أنشطة المراهقين بعد الظهر.",
            "options": ["richtig", "falsch"], "answer": "richtig",
            "explanationAr": "الدليل في النص: «mit den Nachmittagsaktivitäten der Jugendlichen kollidieren kann» — قد يتعارض البدء المتأخر مع أنشطتهم بعد الظهر.",
        },
        {
            "id": "t-b2-36-q4", "type": "fill",
            "promptDe": "Dabei sollte man nicht nur Noten, sondern auch Schlaf, Wohlbefinden und ___ beobachten.",
            "promptAr": "ينبغي ألا تقتصر المتابعة على العلامات، بل تشمل النوم والرفاه و___ أيضاً.",
            "answer": ["Unterrichtsbeteiligung"],
            "explanationAr": "الدليل في النص: «Dabei sollte man nicht nur Noten, sondern auch Schlaf, Wohlbefinden und Unterrichtsbeteiligung beobachten.» — تشمل المتابعة المشاركة في الدرس أيضاً.",
        },
    ],
    "t-b2-37": [
        {
            "id": "t-b2-37-q3", "type": "truefalse",
            "promptDe": "Die erzählende Person empfand die direkte Kommunikation anfangs als Ablehnung.",
            "promptAr": "شعرت الشخصية الراوية في البداية بأن التواصل المباشر يمثل رفضاً لها.",
            "options": ["richtig", "falsch"], "answer": "richtig",
            "explanationAr": "الدليل في النص: «Anfangs empfand ich das als Ablehnung.» — شعرت الشخصية بذلك في البداية على أنه رفض.",
        },
        {
            "id": "t-b2-37-q4", "type": "fill",
            "promptDe": "Heute frage ich nach, wenn ich eine Äußerung nicht richtig ___.",
            "promptAr": "أسأل اليوم عندما لا ___ عبارةً على نحو صحيح.",
            "answer": ["verstehe"],
            "explanationAr": "الدليل في النص: «wenn ich eine Äußerung nicht richtig verstehe» — تسأل الشخصية عندما لا تفهم عبارةً كما ينبغي.",
        },
    ],
    "t-b2-38": [
        {
            "id": "t-b2-38-q3", "type": "truefalse",
            "promptDe": "Alle 61 Organisationen lieferten im britischen Versuch Umsatzdaten.",
            "promptAr": "قدّمت المنظمات الإحدى والستون كلها بيانات عن الإيرادات في التجربة البريطانية.",
            "options": ["richtig", "falsch"], "answer": "falsch",
            "explanationAr": "الدليل في النص: «Nur 23 von 61 Organisationen lieferten Umsatzdaten» — لم تقدم بيانات الإيرادات إلا 23 منظمة من أصل 61.",
        },
        {
            "id": "t-b2-38-q4", "type": "fill",
            "promptDe": "Die Krankheitstage gingen leicht zurück; der Unterschied war statistisch nicht ___.",
            "promptAr": "انخفضت أيام المرض قليلاً، لكن الفرق لم يكن ___ من الناحية الإحصائية.",
            "answer": ["signifikant"],
            "explanationAr": "الدليل في النص: «der Unterschied war jedoch statistisch nicht signifikant» — لم يكن الفرق ذا دلالة إحصائية.",
        },
    ],
    "t-b2-39": [
        {
            "id": "t-b2-39-q3", "type": "truefalse",
            "promptDe": "Alle ländlichen Regionen haben häufige Busverbindungen.",
            "promptAr": "تتوفر في جميع المناطق الريفية حافلات كثيرة ومتكررة.",
            "options": ["richtig", "falsch"], "answer": "falsch",
            "explanationAr": "الدليل في النص: «Je nach Region fahren öffentliche Verkehrsmittel seltener» — يقل تواتر وسائل النقل العام في بعض المناطق بحسب الموقع.",
        },
        {
            "id": "t-b2-39-q4", "type": "fill",
            "promptDe": "Homeoffice und Videokonferenzen erleichtern manchen Beschäftigten den Umzug. Das setzt jedoch ausreichend schnelles ___ voraus.",
            "promptAr": "يسهّل العمل من المنزل ومؤتمرات الفيديو انتقال بعض الموظفين، لكن ذلك يتطلب ___ سريعاً بما يكفي.",
            "answer": ["Internet"],
            "explanationAr": "الدليل في النص: «Das setzt jedoch ausreichend schnelles Internet voraus.» — يتطلب ذلك إنترنت سريعاً بما يكفي.",
        },
    ],
    "t-b2-40": [
        {
            "id": "t-b2-40-q3", "type": "truefalse",
            "promptDe": "Eine Höflichkeitslüge kann eine Beziehung niemals belasten.",
            "promptAr": "لا يمكن لكذبة مجاملة أبداً أن تضر بالعلاقة.",
            "options": ["richtig", "falsch"], "answer": "falsch",
            "explanationAr": "الدليل في النص: «kann die Lüge eine Beziehung jedoch belasten» — قد تضر كذبة المجاملة بالعلاقة إذا ظهرت الحقيقة.",
        },
        {
            "id": "t-b2-40-q4", "type": "fill",
            "promptDe": "Entscheidend ist auch, wem eine Aussage nützt und wer dadurch ___ hat.",
            "promptAr": "ومن المهم أيضاً أن نسأل: من يستفيد من عبارة، ومن يتكبّد بسببها ___؟",
            "answer": ["Nachteile"],
            "explanationAr": "الدليل في النص: «wem eine Aussage nützt und wer dadurch Nachteile hat» — ينبغي النظر أيضاً إلى من يستفيد ومن يتضرر.",
        },
    ],
}


def _editorial_payload(item: dict) -> dict:
    return {key: item[key] for key in EDITORIAL_KEYS}


def _payload_hash(payload: dict) -> str:
    serialised = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(serialised.encode("utf-8")).hexdigest()


def _desired_payload(item: dict, text_id: str) -> dict:
    desired = copy.deepcopy(_editorial_payload(item))
    desired.update(TEXT_FIELD_UPDATES[text_id])
    questions = {question.get("id"): question for question in desired["questions"]}
    if len(questions) != len(desired["questions"]):
        raise ValueError(f"duplicate/missing question IDs in {text_id}")
    source_ids = {f"{text_id}-q{number}" for number in (1, 2)}
    final_ids = {f"{text_id}-q{number}" for number in range(1, 5)}
    if frozenset(questions) not in {frozenset(source_ids), frozenset(final_ids)}:
        raise ValueError(f"unexpected source question IDs in {text_id}")
    for question_id, patch in QUESTION_PATCHES[text_id].items():
        if question_id not in questions:
            raise ValueError(f"missing question to patch: {text_id}:{question_id}")
        questions[question_id].update(patch)
    for question in NEW_QUESTIONS[text_id]:
        question_id = question.get("id")
        if question_id in questions:
            index = next(index for index, old in enumerate(desired["questions"]) if old.get("id") == question_id)
            desired["questions"][index] = copy.deepcopy(question)
        else:
            desired["questions"].append(copy.deepcopy(question))
    desired["wordCountDe"] = len(desired["de"].split())
    return desired


def validate_batch(batch: list[dict]) -> None:
    if [item["id"] for item in batch] != TARGET_IDS:
        raise ValueError("R170 target order/IDs changed")
    for item in batch:
        text_id = item["id"]
        if item.get("level") != "B2" or item.get("neu") is True:
            raise ValueError(f"wrong-level or reclassified source text: {text_id}")
        if (text_id == "t-b2-37" and
                (not item.get("titleDe", "").startswith("Beispiel:") or not item.get("titleAr", "").startswith("مثال:"))):
            raise ValueError(f"fiction/example framing missing: {text_id}")
        german = item.get("de", "")
        arabic = item.get("ar", "")
        german_words = len(german.split())
        arabic_words = len(arabic.split())
        if not 150 <= german_words <= 230:
            raise ValueError(f"German length outside 150–230 words: {text_id}={german_words}")
        if len(german) > 1500:
            raise ValueError(f"German source exceeds single-clip TTS limit: {text_id}={len(german)} chars")
        if item.get("wordCountDe") != german_words:
            raise ValueError(f"wordCountDe mismatch: {text_id}={item.get('wordCountDe')}/{german_words}")
        if len(german.split("\n\n")) != 3 or len(arabic.split("\n\n")) != 3:
            raise ValueError(f"expected three parallel paragraphs: {text_id}")
        if arabic_words < max(150, int(german_words * 0.75)):
            raise ValueError(f"Arabic field may be a summary, not a complete translation: {text_id}={arabic_words}/{german_words}")
        if re.search(r"[\u0600-\u06ff]", german):
            raise ValueError(f"Arabic characters found in German source: {text_id}")
        questions = item.get("questions", [])
        if len(questions) != 4 or len({question.get("id") for question in questions}) != 4:
            raise ValueError(f"expected four uniquely identified questions: {text_id}")
        if [question.get("id") for question in questions[:2]] != [f"{text_id}-q1", f"{text_id}-q2"]:
            raise ValueError(f"original question IDs/order not preserved: {text_id}")
        for question in questions:
            question_id = question.get("id")
            if not question.get("promptDe", "").strip() or not question.get("promptAr", "").strip() or not question.get("explanationAr", "").strip():
                raise ValueError(f"incomplete bilingual question: {text_id}:{question_id}")
            kind = question.get("type")
            if kind == "mc":
                options = question.get("options", [])
                if len(options) < 2 or len(options) != len(set(options)) or question.get("answer") not in options:
                    raise ValueError(f"invalid MC options/key: {text_id}:{question_id}")
            elif kind == "truefalse":
                if question.get("options") != ["richtig", "falsch"] or question.get("answer") not in {"richtig", "falsch"}:
                    raise ValueError(f"invalid true/false key: {text_id}:{question_id}")
            elif kind == "fill":
                answer = question.get("answer")
                if not isinstance(answer, list) or not answer or any(word not in german for word in answer):
                    raise ValueError(f"invalid fill answer/source: {text_id}:{question_id}")
                if "___" not in question.get("promptDe", "") or "___" not in question.get("promptAr", ""):
                    raise ValueError(f"missing bilingual fill blank: {text_id}:{question_id}")
            else:
                raise ValueError(f"unknown question type {kind!r}: {text_id}:{question_id}")
            for quote in re.findall(r"«([^»]+)»", question["explanationAr"]):
                if quote not in german:
                    raise ValueError(f"non-literal quoted evidence: {text_id}:{question_id}: {quote!r}")


def apply_reviewed_fields(by_id: dict[str, dict]) -> int:
    if (set(SOURCE_SNAPSHOT_SHA256) != set(TARGET_IDS) or
            set(TEXT_FIELD_UPDATES) != set(TARGET_IDS) or
            set(QUESTION_PATCHES) != set(TARGET_IDS) or
            set(NEW_QUESTIONS) != set(TARGET_IDS)):
        raise ValueError("R170 guards/targets do not match")
    changed = 0
    for text_id in TARGET_IDS:
        item = by_id.get(text_id)
        if item is None or item.get("level") != "B2":
            raise ValueError(f"missing or wrong-level source text: {text_id}")
        current = _payload_hash(_editorial_payload(item))
        desired = _desired_payload(item, text_id)
        desired_hash = _payload_hash(desired)
        if current == desired_hash:
            continue  # final reviewed payload; an idempotent re-run is a no-op
        if current in {SOURCE_SNAPSHOT_SHA256[text_id], INTERMEDIATE_SNAPSHOT_SHA256.get(text_id)}:
            for key in EDITORIAL_KEYS:
                item[key] = desired[key]
            changed += 1
        else:
            raise ValueError(f"refusing to overwrite unreviewed fields in {text_id}: payload hash={current}")
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare", action="store_true", help="apply guarded editorial review before TTS")
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
    final_payload_hashes = {item["id"]: _payload_hash(_editorial_payload(item)) for item in batch}
    sentence_ends = {
        item["id"]: len(re.findall(r"[.!?](?:[\"»”])?(?:\s|$)", item["de"]))
        for item in batch
    }
    print("R170 guarded review: texts changed:", changed)
    print("R170 German words:", json.dumps(word_counts, ensure_ascii=False))
    print("R170 Arabic words:", json.dumps(arabic_counts, ensure_ascii=False))
    print("R170 German characters:", json.dumps({item['id']: len(item['de']) for item in batch}))
    print("R170 German source SHA-256:", json.dumps(source_hashes, ensure_ascii=False))
    print("R170 editorial payload SHA-256:", json.dumps(final_payload_hashes, ensure_ascii=False))
    print("R170 German sentence-ending marks:", json.dumps(sentence_ends, ensure_ascii=False))
    print("R170 questions:", sum(len(item["questions"]) for item in batch))
    if args.prepare:
        print("R170 prepare complete; generate audio from each exact current German `de` field.")
        return

    if set(SOURCE_SHA256) != set(TARGET_IDS) or any(value == "TO_BE_FILLED" for value in SOURCE_SHA256.values()):
        raise ValueError("populate SOURCE_SHA256 from the exact reviewed German fields after --prepare and TTS")
    for item in batch:
        digest = hashlib.sha256(item["de"].encode("utf-8")).hexdigest()
        if SOURCE_SHA256.get(item["id"]) != digest:
            raise ValueError(f"R170 audio/source hash mismatch: {item['id']}")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    by_audio_id = {entry["id"]: entry for entry in entries}
    if len(by_audio_id) != len(entries) or manifest.get("count") != len(entries):
        raise ValueError("HörLabor count/ID mismatch")
    if len(entries) not in {152, 157}:
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
        elif old != expected:
            old.update(expected)
            refreshed += 1

    manifest["count"] = len(entries)
    manifest["updated"] = date.today().isoformat()
    MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R170 manifest: {added} added, {refreshed} refreshed; count={manifest['count']}")
    print("R170 audio bytes:", json.dumps({item["id"]: (AUDIO_DIR / f"{item['id']}.mp3").stat().st_size for item in batch}, ensure_ascii=False))


if __name__ == "__main__":
    main()
