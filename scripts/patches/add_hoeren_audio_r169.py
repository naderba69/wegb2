# -*- coding: utf-8 -*-
"""R169: review, fully translate, and add five B2 HörLabor texts.

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
TARGET_IDS = [f"t-b2-{number}" for number in range(31, 36)]
EDITORIAL_KEYS = ("titleDe", "titleAr", "de", "ar", "questions")

# SHA-256 of each exact editorial payload inspected before R169. This guard
# includes the complete German/Arabic texts, titles, and questions; it refuses
# to overwrite any concurrent or user-authored change.
SOURCE_SNAPSHOT_SHA256: dict[str, str] = {
    "t-b2-31": "3cd57722ac40cae04366ddf980a1b21c99df40768440ad26ef24837979e32dd1",
    "t-b2-32": "dd4e745889cd631fe70d43a98cf1deae3b5dd18e77cb19fbcf2eea3e54838fa1",
    "t-b2-33": "c5673b3e00f67e5fc7f1466c4bea0667d01469dda24afe337f954f643b590734",
    "t-b2-34": "91bc5761dd20365298ad7ec89bd16ccc8e473dc08203b6cdfe1d214569b14dea",
    "t-b2-35": "e62cf549a1e89a6bfcc4ba2b86f17036544f76578a87905c64f201f072670219",
}

# Exact hash of the reviewed first pass; only these known payloads may be
# refined to the final R169 text after source and question cross-checks.
INTERMEDIATE_SNAPSHOT_SHA256: dict[str, str] = {
    "t-b2-31": "529a51aa3ac58b48aaeba6c7c9bda7f9246726fedec7f78d071afca71802a8e8",
    "t-b2-32": "3188ff2b42ac14dd75de4c8d4caf03c0ee704c78613f96bec56da3470c510a3c",
    "t-b2-33": "8325613e27a00111e458e85bafaf5c0932cd9112d92d1cb64790dc7c0b3dea5b",
    "t-b2-34": "41ef1fca23fbe3e4cd606c5d70a8faa954070eb2c1b7f631a7ca651ec124a86b",
    "t-b2-35": "8f1b341597bb91680a151fac29f6499f00dc4940811a918d25948d4805f40bea",
}

# Populate from the exact, reviewed German fields after --prepare and TTS.
SOURCE_SHA256: dict[str, str] = {
    "t-b2-31": "e319c9a7339da1172a3366cc9ca4e82bbc516ba52a69b6f009eda943dbf58a2c",
    "t-b2-32": "b63d68dd197ec35545296dee18029993c2e5c9180a4e0089e0d9c57d78f2c3aa",
    "t-b2-33": "77fbadc2d60281711d946acc93586ed8f24cf0b8db9e124f45cd91a291ab5e14",
    "t-b2-34": "66706327ec4a8e315c1f3ddc88f6d32ac02305009331f23b8c4d466a2ac2cae1",
    "t-b2-35": "96cca76054ace5d022c8287d04ae49c3122301e2b992b13af9b762656dcf65b4",
}
VOICE = "voice-03 (de-DE, Arena TTS)"

# Complete final text fields. Each R169 title identifies a fictional/example
# scenario; empirical-looking details are explicitly scoped to that scenario.
TEXT_FIELD_UPDATES: dict[str, dict[str, str]] = {
    "t-b2-31": {
        "titleDe": "Beispiel: Pendeln oder umziehen?",
        "titleAr": "مثال: التنقّل اليومي أم الانتقال؟",
        "de": """Dieses Beispiel ist erfunden. Frau Sahli pendelt seit ihrer Beförderung an Arbeitstagen insgesamt siebzig Kilometer zwischen Dorf und Kreisstadt. Um sechs Uhr morgens steht sie im Parkhaus am Bahnhof; abends ist sie meist um sieben zurück. Täglich braucht sie etwa drei Stunden; verpasst sie in der Kreisstadt den Anschluss, sind es vier. Ihr Mann arbeitet im Dorf, die Kinder gehen dort zur Schule, und das Eigenheim ist abbezahlt. Umziehen scheint logisch, doch Arbeit, Schule und das bezahlte Eigenheim binden die Familie ans Dorf.

Sie prüfte Alternativen: Eine Mitfahrgelegenheit passte nicht zu ihren Arbeitszeiten; der Fernbus fährt zu selten, ein Nachtzug ist für die kurze Strecke unpraktisch. Das Elektroauto half, bis die einzige Ladestation im Ort drei Wochen ausfiel. „Die Verkehrswende wird in der Stadt geplant und auf dem Land ausgehalten“, sagt sie; sie meint ihren eigenen Alltag. Bei Lastenrädern lächelt sie müde: Auf ihrem ländlichen Arbeitsweg lösen sie das Anschlussproblem nicht.

Ihr Kompromiss ist kein Umzug: An zwei Tagen arbeitet sie im Homeoffice, an den drei übrigen Tagen fährt sie mit der Bahn. Im Zug arbeitet sie; ihr Arbeitgeber zählt diese Zeit gemäß Vereinbarung als Arbeitszeit. Die Straßensperrung wegen einer neuen Brücke nimmt sie gelassen, da sie nicht mehr mit dem Auto in die Stadt fährt. Ob das trägt, weiß sie nicht. „Pendeln oder umziehen?“ hat für sie vorerst eine dritte Antwort.""",
        "ar": """هذا المثال متخيّل. منذ ترقيتها، تتنقّل السيدة سهلي في كل يوم عمل مسافة إجمالية تبلغ سبعين كيلومتراً بين قريتها ومدينة القضاء. ففي السادسة صباحاً تكون في مرآب السيارات عند محطة القطار، ولا تعود عادةً إلا قرابة السابعة مساءً. يستغرق تنقّلها نحو ثلاث ساعات يومياً؛ وإذا فاتها قطار الربط في مدينة القضاء، فقد تمتد الرحلة إلى أربع ساعات. يعمل زوجها في القرية، ويدرس أطفالها هناك، كما أن الأسرة سددت ثمن منزلها بالكامل. ويبدو الانتقال حلاً منطقياً، لكن عمل زوجها في القرية ومدرسة الأطفال هناك ومنزل الأسرة المسدّد ثمنه بالكامل، كلها أمور تربط الأسرة بالقرية.

فحصت السيدة سهلي عدة بدائل. لم تناسبها مشاركة السيارة بسبب اختلاف أوقات العمل، كما أن حافلة النقل بين المدن على هذا الخط قليلة الرحلات، وقطار الليل ليس بديلاً عملياً لهذه المسافة القصيرة. سهّلت السيارة الكهربائية تنقّلها في البداية، إلى أن تعطلت محطة الشحن الوحيدة في البلدة ثلاثة أسابيع. وتقول: «يُخطط لتحول النقل في المدينة، ويُحتمل في الريف»؛ وهي تصف بذلك تجربتها الشخصية بعبارة حادة، لا جميع المناطق الريفية. أما عند ذكر دراجات الشحن فتبتسم بتعب: فهذه الدراجة لا تحل مشكلة قطار الربط في طريقها الريفي إلى العمل.

أما حلها الوسط فليس الانتقال: تعمل من المنزل يومين، وتستقل القطار في الأيام الثلاثة الأخرى. وفي أيام القطار تعمل أثناء الرحلة، ويحتسب صاحب عملها هذا الوقت صراحةً ضمن ساعات العمل بموجب اتفاقهما. ولا يقلقها إغلاق الطريق بسبب الجسر الجديد، لأنها لم تعد تقود السيارة إلى المدينة أصلاً. لا تعرف إن كان هذا الحل سيستمر على المدى الطويل. لكن سؤال «التنقّل اليومي أم الانتقال؟» له، في الوقت الحاضر، جواب ثالث بالنسبة إليها.""",
    },
    "t-b2-32": {
        "titleDe": "Beispiel: Das perfekte Bild",
        "titleAr": "مثال: الصورة المثالية",
        "de": """Dieses Beispiel ist erfunden. Meine Nichte ist sechzehn und braucht morgens etwa vierzig Minuten fürs Make-up, das aussehen soll, als trüge sie keines. Als ich sie fragte, für wen sie sich so zurechtmache, antwortete sie offener, als ich erwartet hatte: „Fürs Selfie. Ohne Filter geht das nicht mehr.“ Sie orientiert sich an einem Schönheitsideal, das sie vor allem auf Bildschirmen sieht. Viele Bilder, die sie dort sieht, sind retuschiert; sie weiß das, doch es verändert ihren Blick auf sich selbst nicht.

Ich wollte ihr Eitelkeit vorwerfen, ließ es aber. Eitelkeit ist alt; neu ist vor allem die Reichweite des Vergleichs. Früher verglich man sich vielleicht mit Mitschülerinnen, heute mit Bildern vieler Unbekannter. Manches modische Outfit wird von einem Label gesponsert; ein Styling-Team gestaltet den Look. Was künstlich wirkt, kann am Bildschirm natürlich aussehen; ein unretuschiertes Gesicht erscheint dann unfertig. Das ist eine Beobachtung dieser Geschichte, keine Aussage über alle Jugendlichen.

Wir probierten es eine Woche: Sie postete stilvolle Bilder ohne digitale Retusche. Die Likes sanken, Nachrichten von Freundinnen wurden mehr. „Du siehst aus wie du“, schrieb eine. Das Experiment belegt weder die Ursache der Reaktionen noch eine langfristige Veränderung ihres Selbstbewusstseins. „Attraktiv“ sei vielleicht ein Wort für Bilder, sagt sie jetzt; für Menschen brauche man ein anderes.""",
        "ar": """هذا المثال متخيّل. ابنة أختي في السادسة عشرة، وتقضي نحو أربعين دقيقة صباحاً في وضع مساحيق التجميل، كي تبدو في النهاية كأنها لا تضع شيئاً. وحين سألتها لمن تتزيّن هكذا، أجابت بصراحة أكبر مما توقعت: «من أجل صورة السيلفي. لم يعد ذلك ممكناً بلا فلتر». وفي هذه القصة، تتبع مثالاً للجمال تراه أساساً على الشاشات. فكثير من الصور المنشورة هناك خضع للتنقيح، وهي تعرف ذلك؛ لكن هذه المعرفة وحدها لا تغيّر نظرتها إلى نفسها.

أردت أن ألومها على الغرور، لكنني تراجعت. فالغرور قديم، أما الجديد فهو اتساع دائرة المقارنة. في الماضي، ربما كان المرء يقارن نفسه بزميلات صفه؛ أما اليوم فيستطيع أن يرى يومياً صور كثير من الغرباء. وقد ترعى علامة تجارية بعض الإطلالات العصرية، فيما يصمم فريق متخصص مظهر أصحابها. وما يبدو مصطنعاً قد يظهر طبيعياً على الشاشة؛ وعلى العكس، قد يبدو الوجه الذي لم يُنقّح فجأةً غير مكتمل. وهذه ملاحظة ضمن القصة، وليست حكماً على جميع المراهقين.

أجرينا تجربة صغيرة: نشرت ابنة أختي على مدى أسبوع صوراً أنيقة من دون تنقيح رقمي. فانخفض عدد الإعجابات، بينما زادت الرسائل التي وصلتها من صديقاتها. وكتبت إحداهن: «تبدين كما أنتِ». لا تثبت هذه التجربة التي استمرت أسبوعاً سبب ردود الفعل، ولا ما إذا كانت ستغيّر ثقتها بنفسها على المدى الطويل. بقي السؤال مفتوحاً بالنسبة إليها. وتقول الآن إن «جذّاب» قد تكون كلمة لوصف الصور، أما الناس فيحتاجون إلى كلمة أخرى.""",
    },
    "t-b2-33": {
        "titleDe": "Beispiel: Der Verein und der Austritt",
        "titleAr": "مثال: النادي وقرار الانسحاب",
        "de": """Dieses Beispiel ist erfunden. Als Karim dem Verein beigetreten war, wollte er vor allem Fußball spielen. Fünf Jahre später gehörten zu seiner Freizeitgestaltung auch eine Radtour, Camping am See und ein Mountainbike-Wochenende. Jedes Jahr stand er am Rand des Marathons, um die Teilnehmenden anzufeuern; selbst lief er nie mit. Die Unternehmungen der Gruppe füllten seinen Kalender; der Verein war für ihn mehr als ein Wettbewerb.

Nach der regulären Spielzeit stand es im Pokal unentschieden. Während der Verlängerung erkannte der Schiedsrichter ein Tor wegen einer Abseitsstellung nicht an; er hatte Abseits gepfiffen. Auf der Wiederholungsaufnahme war die Position für Karim nicht eindeutig. Auch nach der Verlängerung blieb es unentschieden, sodass ein Elfmeterschießen folgte. Die Halle war ausverkauft, die Übertragung lief in zwei Kneipen. Ben beleidigte den Schiedsrichter lautstark; viele in der Halle hörten es.

Der Vorstand verlangte eine Entschuldigung. Ben weigerte sich und erklärte seinen Austritt. Karim fragte sich, ob er mit seinem Freund austreten oder den Regeln treu bleiben sollte. Er blieb – nicht, weil der Schiedsrichter sicher recht hatte, sondern weil ein Verein ohne Regeln nur noch eine Gruppe mit derselben Farbe wäre. Trotzdem wollen Ben und Karim im Mai gemeinsam Rad fahren. Auf dieser Tour gibt es keine Schiedsrichter.""",
        "ar": """هذا المثال متخيّل. حين انضم كريم إلى النادي، كان اهتمامه منصبّاً أساساً على كرة القدم. وبعد خمس سنوات، صارت أنشطته في وقت الفراغ تشمل أيضاً جولةً بالدراجة، والتخييم قرب البحيرة، وعطلة نهاية أسبوع على الدراجة الجبلية. لقد انضم في البداية بحثاً عن كرة القدم فحسب، لكن أنشطة المجموعة أخذت تملأ تقويمه. لم يشارك قط في ماراثون، لكنه كان يشجّع المشاركين كل عام من جانب المسار. وأصبح النادي بالنسبة إليه أكثر من مجرد منافسة على أرض الملعب.

في مباراة الكأس، انتهى الوقت الأصلي بالتعادل. وخلال الوقت الإضافي، أطلق الحكم صافرته معلناً التسلل، وألغى هدفاً بناءً على ذلك؛ لكن موضع اللاعب لم يكن واضحاً تماماً في الإعادة، من وجهة نظر كريم. وانتهى الوقت الإضافي أيضاً بالتعادل، فلجأ الفريقان إلى ركلات الترجيح. كانت القاعة ممتلئة، وبُثّت المباراة في حانتين. وشتم بن الحكم بصوت مرتفع، فسمعه كثيرون في القاعة.

طالبت الهيئة الإدارية بن بالاعتذار. لكنه رفض وأعلن انسحابه من النادي؛ فاضطر كريم إلى أن يقرر: هل ينسحب هو أيضاً مع صديقه، أم يبقى في النادي احتراماً لقواعده؟ اختار البقاء، لا لأن الحكم كان محقاً بالضرورة، بل لأن النادي بلا قواعد لا يعود إلا مجموعةً تصادف أن أفرادها يرتدون اللون نفسه. ومع ذلك، يعتزم بن وكريم القيام بجولة دراجات معاً في مايو. فلا يوجد حكم في تلك الجولة.""",
    },
    "t-b2-34": {
        "titleDe": "Beispiel: Zwischen den Zeilen",
        "titleAr": "مثال: ما بين السطور",
        "de": """Dieses Unterrichtsbeispiel ist erfunden. Eine zehnte Klasse liest dieselbe Nachricht in drei Fassungen: Agenturmeldung, Leitartikel und Clickbait-Beitrag mit zugespitzter Überschrift. Die Schüler beschreiben, was jede Version bei den Lesenden bewirkt, statt zu entscheiden, wer recht hat.

Sie erkennen rasch die Zuspitzung in der Überschrift und die Untertreibung im Nebensatz. Schwieriger ist das Framing: Derselbe Zahlenwert kann mit „nur“ heruntergespielt oder mit „schon“ als beachtlich gerahmt werden. Noch schwieriger ist die Frage, weshalb gerade dieses Thema erscheint. Die Auswahl beeinflusst mit, welche Themen öffentlich als wichtig gelten; das nennt man Agenda-Setting. Auch Leitmedien müssen auswählen. Ein Schüler sagt „Echokammer“, eine Mitschülerin findet das pauschal. Sie meint, die Filterblase sei nicht das Problem, sondern das Wohlgefühl darin.

In dieser Reihe kommt der Faktencheck zuletzt, nicht zuerst. „Fake News“ ist ungenau; Desinformation muss nicht vollständig erfunden sein. Auch richtige Zahlen können durch Auswahl oder fehlenden Kontext irreführen. Sie üben Quellenkritik: Wer schreibt, wer bezahlt, welche Belege gibt es, wem nützt der Beitrag? Eine starke Polarisierung der Sprache kann ein Warnsignal sein, aber noch kein Beweis für Meinungsmache. Die Aufmerksamkeitsökonomie kann Reichweite belohnen; hohe Reichweite belegt keine Wahrheit. Deshalb prüfen sie auch die Einordnung. Den Satz hängt die Klasse selbst an die Wand.""",
        "ar": """هذا المثال التعليمي متخيّل. يقرأ صفٌّ من الصف العاشر الخبر نفسه بثلاث صيغ: تقريراً لوكالة أنباء، ومقالة افتتاحية، ومنشوراً بعنوان مبالغ فيه لاستدراج النقرات. ويصف التلاميذ أثر كل صيغة في القراء، بدلاً من أن يقرروا من المحق.

يلاحظ التلاميذ سريعاً المبالغة في العنوان والتقليل من شأن الأمر في الجملة التابعة. والأصعب هو التأطير: فقد تُهوَّن قيمة الرقم نفسه بكلمة «فقط»، أو يُقدَّم على أنه لافت بكلمة «بالفعل». ثم يأتي السؤال الأصعب: لماذا اختير هذا الموضوع تحديداً؟ قد يؤثر اختيار الموضوعات في ما يُعدّ مهماً في النقاش العام؛ وهذا ما يُسمى «تحديد جدول الأعمال». وعلى وسائل الإعلام ذات التأثير الواسع أيضاً أن تنتقي ما تغطيه. ويتحدث أحد التلاميذ عن «غرفة صدى»، لكن زميلةً له ترى أن الوصف تعميم مفرط. وتقول إن فقاعة الترشيح ليست المشكلة، بل الشعور بالراحة داخلها.

في هذه السلسلة التعليمية يأتي التحقق من الوقائع في النهاية، لا في البداية. ومصطلح «الأخبار الزائفة» غير دقيق؛ فالمعلومات المضللة لا يلزم أن تكون مختلقة بالكامل. وقد تضلل الأرقام الصحيحة أيضاً إذا انتُقيت أو غاب سياقها. لذلك يتدرب التلاميذ على نقد المصادر: من كتب؟ ومن موّل؟ وما الأدلة؟ ومن قد يستفيد؟ وقد تكون اللغة شديدة الاستقطاب علامة تحذير، لكنها لا تثبت وحدها وجود تلاعب بالرأي. وقد يكافئ اقتصاد الانتباه المحتوى بمنحه انتشاراً واسعاً، لكن الانتشار الواسع لا يثبت صحة ما يورده. لذلك يتحقق التلاميذ أيضاً من السياق. ويعلّقون العبارة بأنفسهم على الجدار.""",
    },
    "t-b2-35": {
        "titleDe": "Beispiel: Das Forschungsprojekt",
        "titleAr": "مثال: المشروع البحثي",
        "de": """Dieses Beispiel ist erfunden. Als Leila zu promovieren begann, hatte sie einen Karteikasten voller Fachbegriffe und für jeden eine Eselsbrücke. Drei Jahre später leitete sie ein Forschungsprojekt und erhielt eine Förderung für zwei Stellen. Ihre wichtigste Erkenntnis: Zur Wissenschaft gehören neben Wissen auch Fristen, Anträge und Absprachen, die man einhalten muss.

Ihr fiktives Projekt untersucht, wie Studentinnen und Studenten mit knapp ausreichender Abiturnote in einem Fach mit Numerus clausus lernen. Leila befragte zweihundert Personen an drei Fakultäten und begleitete eine Gruppe auf einer Exkursion. Dabei beobachtete sie, wie sich Kenntnisse außerhalb des Hörsaals zeigten. In der Auswertung der Beispielstudie zählte neben der Effizienz auch eine Person, die Anfängerfragen ernst nahm. Das gilt für diese erfundene Stichprobe, nicht allgemein. Leila sagt: „Allein kann man effizient lernen; manches versteht man erst im Austausch.“

Die Veröffentlichung dauerte länger als die Studie. Zwei Gutachter wollten mehr Zahlen, ein dritter weniger Deutung. Leila zitiert ihre Betreuerin: „Nachhaltigkeit in der Forschung heißt, dass jemand in zehn Jahren noch etwas mit deinen Daten anfangen kann.“ Fragebogen, Anleitung und – soweit Einwilligungen und Datenschutzbestimmungen es zulassen – anonymisierte Auswertungen liegen im Hochschularchiv. Personenbezogene Rohdaten werden dort nicht öffentlich bereitgestellt. Den Karteikasten wirft sie trotzdem nicht weg.""",
        "ar": """هذا المثال متخيّل. حين بدأت ليلى دراسة الدكتوراه، كان لديها صندوق بطاقات مليء بالمصطلحات التخصصية، ولكل مصطلح حيلة تساعدها على تذكّره. وبعد ثلاث سنوات، كانت تدير مشروعاً بحثياً، وقد حصلت على تمويل يغطي وظيفتين في المشروع. وأهم ما أدركته أن العلم لا يقتصر على المعرفة؛ بل يتطلب أيضاً مواعيد نهائية وطلبات وتفاهمات ينبغي الالتزام بها.

يتناول مشروعها المتخيّل طريقة تعلّم الطلاب والطالبات الذين حصلوا على درجات بالكاد كافية في الشهادة الثانوية، في تخصص ذي قبول مقيّد بعدد المقاعد. واستطلعت ليلى آراء مئتي شخص في ثلاث كليات، ورافقت مجموعةً في رحلة دراسية لتلاحظ كيف تظهر المعارف خارج قاعة المحاضرات. وفي تحليل هذه الدراسة القصصية، لم تكن كفاءة أساليب التعلم وحدها مهمة؛ بل كان لوجود شخص يأخذ أسئلة المبتدئين والمبتدئات بجدية دورٌ أيضاً. وهذه ملاحظة مستخلصة من العينة المذكورة في القصة، وليست حكماً عاماً على جميع الطلاب. وتلخّص ليلى انطباعها قائلةً: «يمكن للمرء أن يتعلم بفاعلية وحده؛ لكن بعض الأمور لا تُفهم إلا بالتبادل مع الآخرين».

استغرق نشر النتائج وقتاً أطول من إجراء الدراسة نفسها. أراد محكّمان أرقاماً أكثر، فيما أراد محكّم ثالث تقليلاً للتأويل. وتقتبس ليلى مشرفتها قائلةً: «استدامة البحث تعني أن يجد أحدهم، بعد عشر سنوات، فائدةً لبياناتك». ويحفظ أرشيف الجامعة الاستبيان ودليل استخدامه، وكذلك التحليلات المجهولة الهوية بالقدر الذي تسمح به الموافقات وقواعد حماية البيانات. أما البيانات الخام المرتبطة بأشخاص بعينهم فلا تُتاح هناك للعموم. ومع ذلك، لا تتخلّص ليلى من صندوق البطاقات.""",
    },
}

# Patch question fields by stable IDs; preserve every question ID and all
# untouched schema fields. Arabic prompts are full translations, including
# the intentional answer blank for fill items.
QUESTION_PATCHES: dict[str, dict[str, dict[str, object]]] = {
    "t-b2-31": {
        "t-b2-31-q1": {
            "promptDe": "Warum wäre ein Umzug für Frau Sahlis Familie keine einfache Lösung?",
            "options": [
                "Weil ihr Mann im Dorf arbeitet, die Kinder dort zur Schule gehen und das Eigenheim abbezahlt ist.",
                "Weil der Fernbus auf ihrer Strecke täglich ausfällt.",
                "Weil ihr Arbeitgeber Homeoffice grundsätzlich verbietet.",
            ],
            "answer": "Weil ihr Mann im Dorf arbeitet, die Kinder dort zur Schule gehen und das Eigenheim abbezahlt ist.",
            "explanationAr": "الدليل حرفياً: «Ihr Mann arbeitet im Dorf, die Kinder gehen dort zur Schule, und das Eigenheim ist abbezahlt». الفخّ 1: النص يقول إن الحافلة تسير نادراً على مسارها، لا إنها تُلغى كل يوم. الفخّ 2: السيدة تعمل من المنزل يومين.",
            "promptAr": "لماذا لا يكون الانتقال حلاً بسيطاً لأسرة السيدة سهلي؟",
        },
        "t-b2-31-q2": {
            "promptDe": "Worin besteht Frau Sahlis Kompromiss?",
            "options": [
                "Sie zieht in die Kreisstadt und fährt täglich mit dem Auto.",
                "Sie arbeitet zwei Tage im Homeoffice und fährt an drei Tagen mit der Bahn.",
                "Sie nutzt an allen Tagen eine Mitfahrgelegenheit.",
            ],
            "answer": "Sie arbeitet zwei Tage im Homeoffice und fährt an drei Tagen mit der Bahn.",
            "explanationAr": "الدليل حرفياً: «An zwei Tagen arbeitet sie im Homeoffice, an den drei übrigen Tagen fährt sie mit der Bahn». الفخّ 1: النص يقول إنها لا تنتقل. الفخّ 2: مشاركة السيارة لم تناسب أوقات العمل.",
            "promptAr": "فيم يتمثل الحل الوسطي للسيدة سهلي؟",
        },
        "t-b2-31-q3": {
            "promptDe": "Frau Sahli fährt ohnehin nicht mehr mit dem Auto in die Stadt.",
            "explanationAr": "الدليل حرفياً: «da sie nicht mehr mit dem Auto in die Stadt fährt».",
            "promptAr": "هل لم تعد السيدة سهلي تقود السيارة إلى المدينة أصلاً؟",
        },
        "t-b2-31-q4": {
            "promptDe": "Die Verkehrswende wird in der Stadt geplant und auf dem Land ___.",
            "answer": ["ausgehalten"],
            "explanationAr": "الدليل حرفياً: «Die Verkehrswende wird in der Stadt geplant und auf dem Land ausgehalten»؛ وقد قالتها السيدة سهلي وصفاً حاداً لتجربتها.",
            "promptAr": "يُخطَّط لتحول النقل في المدينة، ويُ___ في الريف.",
        },
    },
    "t-b2-32": {
        "t-b2-32-q1": {
            "promptDe": "Was ist im Beispiel neu, im Gegensatz zur Eitelkeit?",
            "options": ["die Reichweite des Vergleichs", "das Make-up", "das Selfie"],
            "answer": "die Reichweite des Vergleichs",
            "explanationAr": "الدليل حرفياً: «Eitelkeit ist alt; neu ist vor allem die Reichweite des Vergleichs». الفخّان الآخران وردا في القصة، لكنهما ليسا موضع المقارنة.",
            "promptAr": "ما الجديد في المثال، بخلاف الغرور؟",
        },
        "t-b2-32-q2": {
            "promptDe": "Wie veränderten sich die Reaktionen während der Woche mit unretuschierten Bildern?",
            "options": [
                "Die Likes stiegen und die Nachrichten von Freundinnen wurden weniger.",
                "Die Likes sanken und mehr Nachrichten von Freundinnen kamen an.",
                "Sie postete eine Woche lang gar keine Bilder.",
            ],
            "answer": "Die Likes sanken und mehr Nachrichten von Freundinnen kamen an.",
            "explanationAr": "الدليل حرفياً: «Die Likes sanken, Nachrichten von Freundinnen wurden mehr». الفخّ 1: لم ترتفع الإعجابات ولم تقلّ الرسائل. الفخّ 2: نشرت صوراً طوال الأسبوع.",
            "promptAr": "كيف تغيرت ردود الفعل خلال أسبوع نشر الصور غير المنقّحة؟",
        },
        "t-b2-32-q3": {
            "promptDe": "Die Nichte weiß, dass viele Bilder, die sie auf Bildschirmen sieht, retuschiert sind.",
            "explanationAr": "الدليل حرفياً: «Viele Bilder, die sie dort sieht, sind retuschiert; sie weiß das».",
            "promptAr": "هل تعرف ابنة الأخت أن كثيراً من الصور التي تراها على الشاشات منقّحة؟",
        },
        "t-b2-32-q4": {
            "promptDe": "Was ___ wirkt, kann auf dem Bildschirm natürlich aussehen.",
            "answer": ["künstlich"],
            "explanationAr": "الدليل حرفياً: «Was künstlich wirkt, kann am Bildschirm natürlich aussehen».",
            "promptAr": "ما يبدو ___ يمكن أن يظهر طبيعياً على الشاشة.",
        },
    },
    "t-b2-33": {
        "t-b2-33-q1": {
            "promptDe": "Warum blieb Karim im Verein?",
            "options": [
                "Weil er sicher war, dass der Schiedsrichter recht hatte.",
                "Weil Ben sich entschuldigt und seinen Austritt zurückgenommen hatte.",
                "Weil ein Verein ohne Regeln nur noch eine Gruppe mit derselben Farbe wäre.",
            ],
            "answer": "Weil ein Verein ohne Regeln nur noch eine Gruppe mit derselben Farbe wäre.",
            "explanationAr": "الدليل حرفياً: «nicht, weil der Schiedsrichter sicher recht hatte, sondern weil ein Verein ohne Regeln nur noch eine Gruppe mit derselben Farbe wäre». الفخّ 1: لم يجزم كريم بأن الحكم كان محقاً. الفخّ 2: بن رفض الاعتذار وأعلن انسحابه.",
            "promptAr": "لماذا بقي كريم في النادي؟",
        },
        "t-b2-33-q2": {
            "promptDe": "Was verlangte der Vorstand von Ben?",
            "options": ["den Austritt", "eine Wiederholung des Elfmeterschießens", "eine Entschuldigung"],
            "answer": "eine Entschuldigung",
            "explanationAr": "الدليل حرفياً: «Der Vorstand verlangte eine Entschuldigung». الفخّ 1: الانسحاب كان قرار بن. الفخّ 2: لم يطلب المجلس إعادة ركلات الترجيح.",
            "promptAr": "ماذا طلبت الهيئة الإدارية من بن؟",
        },
        "t-b2-33-q3": {
            "promptDe": "Karim lief den Marathon jedes Jahr selbst.",
            "explanationAr": "الدليل حرفياً: «Jedes Jahr stand er am Rand des Marathons, um die Teilnehmenden anzufeuern; selbst lief er nie mit».",
            "promptAr": "هل شارك كريم بنفسه في الماراثون كل عام؟",
        },
        "t-b2-33-q4": {
            "promptDe": "Ben weigerte sich und erklärte seinen ___.",
            "answer": ["Austritt"],
            "explanationAr": "الدليل حرفياً: «Ben weigerte sich und erklärte seinen Austritt».",
            "promptAr": "رفض بن وأعلن ___ من النادي.",
        },
    },
    "t-b2-34": {
        "t-b2-34-q1": {
            "promptDe": "Was sollen die Schüler mit den drei Versionen tun?",
            "options": [
                "entscheiden, welche Redaktion immer recht hat",
                "die Version mit den wenigsten Klicks löschen",
                "beschreiben, was jede Version bei den Lesenden bewirkt",
            ],
            "answer": "beschreiben, was jede Version bei den Lesenden bewirkt",
            "explanationAr": "الدليل حرفياً: «beschreiben, was jede Version bei den Lesenden bewirkt, statt zu entscheiden, wer recht hat». الفخّان الآخران ليسا من مهمة التلاميذ.",
            "promptAr": "ماذا يُطلب من التلاميذ أن يفعلوا بالنسخ الثلاث؟",
        },
        "t-b2-34-q2": {
            "promptDe": "Welche Möglichkeit nennt der Text, wie Desinformation täuschen kann?",
            "options": [
                "Auch richtige Zahlen können durch Auswahl oder fehlenden Kontext irreführen.",
                "Desinformation besteht immer ausschließlich aus erfundenen Zahlen.",
                "Desinformation kommt nur in Echokammern vor.",
            ],
            "answer": "Auch richtige Zahlen können durch Auswahl oder fehlenden Kontext irreführen.",
            "explanationAr": "الدليل حرفياً: «Auch richtige Zahlen können durch Auswahl oder fehlenden Kontext irreführen». الفخّ 1: يقول النص إنها لا يلزم أن تكون مختلقة بالكامل. الفخّ 2: لا يحصرها في غرف الصدى.",
            "promptAr": "ما الأسلوب الذي يذكره النص لإمكان التضليل؟",
        },
        "t-b2-34-q3": {
            "promptDe": "Der Faktencheck kommt in dieser Reihe zuletzt.",
            "explanationAr": "الدليل حرفياً: «In dieser Reihe kommt der Faktencheck zuletzt, nicht zuerst».",
            "promptAr": "هل يأتي التحقق من الوقائع أخيراً في هذه السلسلة التعليمية؟",
        },
        "t-b2-34-q4": {
            "promptDe": "Eine starke Polarisierung der Sprache kann ein ___ sein, aber noch kein Beweis für Meinungsmache.",
            "answer": ["Warnsignal"],
            "explanationAr": "الدليل حرفياً: «Eine starke Polarisierung der Sprache kann ein Warnsignal sein, aber noch kein Beweis für Meinungsmache».",
            "promptAr": "قد تكون اللغة الشديدة الاستقطاب علامةَ ___، لكنها لا تثبت وحدها وجود تلاعب بالرأي.",
        },
    },
    "t-b2-35": {
        "t-b2-35-q1": {
            "promptDe": "Worauf deutete die Auswertung in Leilas Beispielstudie hin?",
            "options": [
                "Die Effizienz allein entscheide über den Lernerfolg.",
                "Neben der Effizienz spielte auch eine Person, die Anfängerfragen ernst nahm, eine Rolle.",
                "Der Numerus clausus lege fest, wie gut jemand später lernt.",
            ],
            "answer": "Neben der Effizienz spielte auch eine Person, die Anfängerfragen ernst nahm, eine Rolle.",
            "explanationAr": "الدليل حرفياً: «In der Auswertung der Beispielstudie zählte neben der Effizienz auch eine Person, die Anfängerfragen ernst nahm». وهذه نتيجة داخل العينة القصصية، لا قاعدة عامة.",
            "promptAr": "إلى ماذا أشار تحليل الدراسة في مثال ليلى؟",
        },
        "t-b2-35-q2": {
            "promptDe": "Was meint die Betreuerin mit Nachhaltigkeit in der Forschung?",
            "options": [
                "dass die Veröffentlichung sofort erscheinen muss",
                "dass jemand in zehn Jahren noch etwas mit den Daten anfangen kann",
                "dass jede Studie zweihundert Personen befragt",
            ],
            "answer": "dass jemand in zehn Jahren noch etwas mit den Daten anfangen kann",
            "explanationAr": "الدليل حرفياً: «Nachhaltigkeit in der Forschung heißt, dass jemand in zehn Jahren noch etwas mit deinen Daten anfangen kann». الفخّ 1: النشر استغرق وقتاً أطول، ولم تقل المشرفة إنه يجب أن يكون فورياً. الفخّ 2: حجم العينة تفصيل في المثال لا تعريف للاستدامة.",
            "promptAr": "ماذا تقصد المشرفة باستدامة البحث؟",
        },
        "t-b2-35-q3": {
            "promptDe": "Leila warf den Karteikasten weg.",
            "explanationAr": "الدليل حرفياً: «Den Karteikasten wirft sie trotzdem nicht weg».",
            "promptAr": "هل تخلّصت ليلى من صندوق البطاقات؟",
        },
        "t-b2-35-q4": {
            "promptDe": "Sie ___ zweihundert Personen an drei Fakultäten.",
            "answer": ["befragte"],
            "explanationAr": "الدليل حرفياً: «Leila befragte zweihundert Personen an drei Fakultäten»؛ والفعل في الجملة هو befragte بصيغة الماضي Präteritum.",
            "promptAr": "___ ليلى مئتي شخص في ثلاث كليات.",
        },
    },
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
    if set(questions) != {f"{text_id}-q{number}" for number in range(1, 5)}:
        raise ValueError(f"unexpected question IDs in {text_id}")
    for question_id, patch in QUESTION_PATCHES[text_id].items():
        if question_id not in questions:
            raise ValueError(f"missing question to patch: {question_id}")
        questions[question_id].update(patch)
    return desired


def validate_batch(batch: list[dict]) -> None:
    if [item["id"] for item in batch] != TARGET_IDS:
        raise ValueError("R169 target order/IDs changed")
    for item in batch:
        text_id = item["id"]
        if item.get("level") != "B2" or item.get("neu") is not True:
            raise ValueError(f"not a new B2 text: {text_id}")
        if not item.get("titleDe", "").startswith("Beispiel:") or not item.get("titleAr", "").startswith("مثال:"):
            raise ValueError(f"fiction/example framing missing: {text_id}")
        german = item.get("de", "")
        arabic = item.get("ar", "")
        german_words = len(german.split())
        arabic_words = len(arabic.split())
        if not 150 <= german_words <= 230:
            raise ValueError(f"German length outside 150–230 words: {text_id}={german_words}")
        if len(german.split("\n\n")) != 3 or len(arabic.split("\n\n")) != 3:
            raise ValueError(f"expected three parallel paragraphs: {text_id}")
        if arabic_words < max(150, int(german_words * 0.75)):
            raise ValueError(f"Arabic field may be a summary, not a complete translation: {text_id}={arabic_words}/{german_words}")
        if re.search(r"[\u0600-\u06ff]", german):
            raise ValueError(f"Arabic characters found in German source: {text_id}")
        questions = item.get("questions", [])
        if len(questions) != 4 or len({question.get("id") for question in questions}) != 4:
            raise ValueError(f"expected four uniquely identified questions: {text_id}")
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
    if (set(SOURCE_SNAPSHOT_SHA256) != set(TARGET_IDS) or set(INTERMEDIATE_SNAPSHOT_SHA256) != set(TARGET_IDS)
            or set(TEXT_FIELD_UPDATES) != set(TARGET_IDS) or set(QUESTION_PATCHES) != set(TARGET_IDS)):
        raise ValueError("R169 guards/targets do not match")
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
        if current in {SOURCE_SNAPSHOT_SHA256[text_id], INTERMEDIATE_SNAPSHOT_SHA256[text_id]}:
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
    print("R169 guarded review: texts changed:", changed)
    print("R169 German words:", json.dumps(word_counts, ensure_ascii=False))
    print("R169 Arabic words:", json.dumps(arabic_counts, ensure_ascii=False))
    print("R169 German source SHA-256:", json.dumps(source_hashes, ensure_ascii=False))
    print("R169 German sentence-ending marks:", sum(len(re.findall(r"[.!?](?:[\"»”])?(?:\s|$)", item["de"])) for item in batch))
    print("R169 questions:", sum(len(item["questions"]) for item in batch))
    if args.prepare:
        print("R169 prepare complete; generate audio from each exact current German `de` field.")
        return

    if VOICE == "TO_BE_SELECTED":
        raise ValueError("set VOICE to the selected de-DE narration voice")
    if set(SOURCE_SHA256) != set(TARGET_IDS) or any(value == "TO_BE_FILLED" for value in SOURCE_SHA256.values()):
        raise ValueError("populate SOURCE_SHA256 from the exact reviewed German fields after --prepare and TTS")
    for item in batch:
        digest = hashlib.sha256(item["de"].encode("utf-8")).hexdigest()
        if SOURCE_SHA256.get(item["id"]) != digest:
            raise ValueError(f"R169 audio/source hash mismatch: {item['id']}")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    by_audio_id = {entry["id"]: entry for entry in entries}
    if len(by_audio_id) != len(entries) or manifest.get("count") != len(entries):
        raise ValueError("HörLabor count/ID mismatch")
    if len(entries) not in {147, 152}:
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
    print(f"R169 manifest: {added} added, {refreshed} refreshed; count={manifest['count']}")
    print("R169 source audio bytes:", json.dumps({item["id"]: (AUDIO_DIR / f"{item['id']}.mp3").stat().st_size for item in batch}))


if __name__ == "__main__":
    main()
