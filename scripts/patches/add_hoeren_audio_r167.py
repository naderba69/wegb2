# -*- coding: utf-8 -*-
"""R167: restore full Arabic translations and add five B2 texts to HörLabor.

Run --prepare before TTS. After generating MP3s from the final German fields,
run without arguments to verify source hashes/frames and update only the
HörLabor manifest. Dialogue and dictation manifests remain separate.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import date
from pathlib import Path

from add_a0_hoeren_audio_02 import mp3_frame_count

ROOT = Path(__file__).resolve().parents[2]
TEXTS_FILE = ROOT / "content" / "texts.json"
MANIFEST_FILE = ROOT / "content" / "hoeren-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "hoeren"
VOICE = "voice-01 (de-DE, Arena TTS)"
TARGET_IDS = [f"t-b2-{number}" for number in range(21, 26)]

# Exact field transitions; the abbreviated Arabic fields are deliberately
# replaced by complete sentence-by-sentence translations.
FIELD_EDITS = [
    ("t-b2-21", ("titleDe",), "Ein Missverständnis unter Freunden", "Beispiel: Ein Missverständnis unter Freunden"),
    ("t-b2-21", ("titleAr",), "سوء فهم بين صديقين", "مثال: سوء فهم بين صديقين"),
    (
        "t-b2-21", ("ar",),
        "رامي وطارق تقدّما للوظيفة نفسها؛ حين فاز طارق أرسل رامي تهنئة جافّة، ففهمها طارق إهانة وصمت ثلاثة أيام. الحقيقة: رامي لم يحسد، لكن خيبته كانت أكبر من مودّته تلك الليلة، وصمته فُسّر حسداً وحتى ظنّاً بأن طارق أراد خداعه. أنقذت الصداقةَ مكالمةٌ بسؤال واحد يُظهر التعاطف: «كيف تشعر حيال ذلك؟» — الرزانة هي تسمية الشعور قبل أن يخيّب الآخر.",
        "عندما علم رامي أن صديقه طارق حصل على الوظيفة التي تقدّم إليها الاثنان، لم يقل شيئاً في البداية. ثم كتب إليه رسالة قصيرة: «تهانينا». من دون علامة تعجب. قرأ طارق في الرسالة إهانةً، ولم يردّ طوال ثلاثة أيام. وهكذا بدأ سوء فهم كاد ينهي علاقتهما.\n\nفي الحقيقة، لم يكن رامي حاسداً ولا غاضباً. كان يفرح من أجل نجاح طارق، لكن خيبة أمله هو في تلك الليلة كانت أكبر من مودّته له. وهذا شعور إنساني، ولم يكن ليصبح مشكلة لو قال ذلك ببساطة. لكنه صمت بدلاً من ذلك، والصمت قابل لتفسيرات شتى. ففسّر طارق ذلك على أنه حسد؛ بل إن أخته ذهبت إلى حد الاشتباه في أن طارق ربما أراد خداع رامي، لأنه لم يخبره عن المقابلة.\n\nويرجع سبب عودة الاثنين اليوم إلى لعب كرة القدم معاً إلى سؤال واحد. اتصل طارق، ولم يسأله: «لماذا تتصرف هكذا؟»، بل قال: «كيف تشعر حيال الأمر؟». يُظهر هذا السؤال تعاطفاً؛ ولا يحتاج المرء كي يطرحه إلى التنازل أو تبرير نفسه. استطاع رامي أن يجيب من دون أن يدافع عن تقديره لذاته. فالرزانة لا تعني ألا يشعر المرء بشيء؛ بل أن يسمّي شعوره قبل أن يخيّب ظنّ الآخر."
    ),
    (
        "t-b2-21", ("ar",),
        "عندما علم رامي أن صديقه طارق حصل على الوظيفة التي تقدّم إليها الاثنان، لم يقل شيئاً في البداية. ثم كتب إليه رسالة قصيرة: «تهانينا». من دون علامة تعجب. قرأ طارق في الرسالة إهانةً، ولم يردّ طوال ثلاثة أيام. وهكذا بدأ سوء فهم كاد ينهي علاقتهما.\n\nفي الحقيقة، لم يكن رامي حاسداً ولا غاضباً. كان يفرح من أجل نجاح طارق، لكن خيبة أمله هو في تلك الليلة كانت أكبر من مودّته له. وهذا شعور إنساني، ولم يكن ليصبح مشكلة لو قال ذلك ببساطة. لكنه صمت بدلاً من ذلك، والصمت قابل لتفسيرات شتى. ففسّر طارق ذلك على أنه حسد؛ بل إن أخته ذهبت إلى حد الاشتباه في أن طارق ربما أراد خداع رامي، لأنه لم يخبره عن المقابلة.\n\nويرجع سبب عودة الاثنين اليوم إلى لعب كرة القدم معاً إلى سؤال واحد. اتصل طارق، ولم يسأله: «لماذا تتصرف هكذا؟»، بل قال: «كيف تشعر حيال الأمر؟». يُظهر هذا السؤال تعاطفاً؛ ولا يحتاج المرء كي يطرحه إلى التنازل أو تبرير نفسه. استطاع رامي أن يجيب من دون أن يدافع عن تقديره لذاته. فالرزانة لا تعني ألا يشعر المرء بشيء؛ بل أن يسمّي شعوره قبل أن يخيّب ظنّ الآخر.",
        "عندما علم رامي أن صديقه طارق حصل على الوظيفة التي تقدّم إليها الاثنان، لم يقل شيئاً في البداية. ثم كتب إليه رسالة قصيرة: «تهانينا». من دون علامة تعجب. قرأ طارق في الرسالة إهانةً، ولم يردّ طوال ثلاثة أيام. وهكذا بدأ سوء فهم كاد ينهي علاقتهما.\n\nفي الحقيقة، لم يكن رامي حاسداً ولا غاضباً. كان يفرح من أجل نجاح طارق، لكن خيبة أمله هو في تلك الليلة كانت أكبر من مودّته له. وهذا شعور إنساني، ولم يكن ليصبح مشكلة لو قال ذلك ببساطة. لكنه صمت بدلاً من ذلك، والصمت قابل لتفسيرات شتى. ففسّر طارق صمت رامي على أنه حسد؛ بل إن أخته اشتبهت في أن طارق ربما أراد خداع رامي، لأنه لم يخبره عن مقابلة التوظيف.\n\nويرجع سبب عودة الاثنين اليوم إلى لعب كرة القدم معاً إلى سؤال واحد. اتصل طارق، ولم يسأله: «لماذا تتصرف هكذا؟»، بل قال: «كيف تشعر حيال الأمر؟». يُظهر هذا السؤال تعاطفاً؛ ولا يحتاج المرء كي يطرحه إلى التنازل أو تبرير نفسه. استطاع رامي أن يجيب من دون أن يدافع عن تقديره لذاته. فالرزانة لا تعني ألا يشعر المرء بشيء؛ بل أن يسمّي شعوره قبل أن يخيّب ظنّ الآخر."
    ),
    (
        "t-b2-21", ("ar",),
        "عندما علم رامي أن صديقه طارق حصل على الوظيفة التي تقدّم إليها الاثنان، لم يقل شيئاً في البداية. ثم كتب إليه رسالة قصيرة: «تهانينا». من دون علامة تعجب. قرأ طارق في الرسالة إهانةً، ولم يردّ طوال ثلاثة أيام. وهكذا بدأ سوء فهم كاد ينهي علاقتهما.\n\nفي الحقيقة، لم يكن رامي حاسداً ولا غاضباً. كان يفرح من أجل نجاح طارق، لكن خيبة أمله هو في تلك الليلة كانت أكبر من مودّته له. وهذا شعور إنساني، ولم يكن ليصبح مشكلة لو قال ذلك ببساطة. لكنه صمت بدلاً من ذلك، والصمت قابل لتفسيرات شتى. ففسّر طارق صمت رامي على أنه حسد؛ بل إن أخته اشتبهت في أن طارق ربما أراد خداع رامي، لأنه لم يخبره عن مقابلة التوظيف.\n\nويرجع سبب عودة الاثنين اليوم إلى لعب كرة القدم معاً إلى سؤال واحد. اتصل طارق، ولم يسأله: «لماذا تتصرف هكذا؟»، بل قال: «كيف تشعر حيال الأمر؟». يُظهر هذا السؤال تعاطفاً؛ ولا يحتاج المرء كي يطرحه إلى التنازل أو تبرير نفسه. استطاع رامي أن يجيب من دون أن يدافع عن تقديره لذاته. فالرزانة لا تعني ألا يشعر المرء بشيء؛ بل أن يسمّي شعوره قبل أن يخيّب ظنّ الآخر.",
        "عندما علم رامي أن صديقه طارق حصل على الوظيفة التي تقدّم إليها الاثنان، لم يقل شيئاً في البداية. ثم كتب إليه رسالة قصيرة: «تهانينا». من دون علامة تعجب. قرأ طارق في الرسالة إهانةً، ولم يردّ طوال ثلاثة أيام. وهكذا بدأ سوء فهم كاد ينهي علاقتهما.\n\nفي الحقيقة، لم يكن رامي حاسداً ولا غاضباً. كان يفرح من أجل نجاح طارق، لكن خيبة أمله هو في تلك الليلة كانت أكبر من مودّته له. وهذا شعور إنساني، ولم يكن ليصبح مشكلة لو قال ذلك ببساطة. لكنه صمت بدلاً من ذلك، والصمت قابل لتفسيرات شتى. ففسّر طارق صمت رامي على أنه حسد؛ بل إن أخته اشتبهت في أن طارق ربما أراد خداع رامي، لأنه لم يخبره عن مقابلة التوظيف.\n\nوما جعل الاثنين يعودان اليوم إلى لعب كرة القدم معاً هو سؤال واحد. اتصل طارق، ولم يسأله: «لماذا تتصرف هكذا؟»، بل قال: «كيف تشعر حيال الأمر؟». يُظهر هذا السؤال تعاطفاً؛ ولا يحتاج المرء كي يطرحه إلى التنازل أو تبرير نفسه. استطاع رامي أن يجيب من دون أن يدافع عن تقديره لذاته. فالرزانة لا تعني ألا يشعر المرء بشيء؛ بل أن يسمّي شعوره قبل أن يخيّب ظنّ الآخر."
    ),
    (
        "t-b2-21", ("questions", 3, "promptAr"),
        "هو ___ لطارق النجاح، لكن خيبة أمله كانت أكبر.",
        "كان رامي ___ لطارق النجاح، لكن خيبة أمله كانت أكبر."
    ),

    ("t-b2-22", ("titleDe",), "Zurück nach der Operation", "Beispiel: Zurück nach der Operation"),
    ("t-b2-22", ("titleAr",), "العودة بعد العملية", "مثال: العودة إلى العمل بعد العملية"),
    (
        "t-b2-22", ("ar",),
        "تعود السيدة لانغ إلى المكتب بعد ثمانية أسابيع: عملية في الركبة، ثلاثة أسابيع تأهيل، وإجازة مرضية طويلة. ما تعلّمته: ردّ فعل المحيط على المرض يكشف المناخ المهني. زميلاتها تولّين مهامها بصمت، بخلاف شركتها السابقة حيث كان الزكام ضعفاً والفحص الوقائي سرّاً، وكانت شبه مدمنة على التقدير. الآن تقسّم الجهد وتقطع عمل الشاشة كل خمسين دقيقة، وتبنّى رئيسها النموذج للفريق كله.",
        "تعود السيدة لانغ إلى المكتب بعد ثمانية أسابيع. ففي الربيع خضعت لعملية جراحية في ركبتها، ثم أمضت ثلاثة أسابيع في إعادة التأهيل، تلتها إجازة مرضية طويلة. وتقول إن تعافيها سار جيداً، لكنها تعلّمت أمراً لا علاقة له كثيراً بركبتها: إن طريقة تعامل المحيطين مع المرض تكشف عن مناخ العمل أكثر مما يكشفه أي استبيان.\n\nخلال تلك الفترة تولّت زميلاتها مهامها بهدوء ومن دون ضجة. ولم يسألها أحد: «متى ستعودين أخيراً؟». ولم يكن هذا التضامن أمراً مفروغاً منه؛ ففي شركتها السابقة كان حتى الزكام يُعدّ علامة ضعف، وكانت من تذهب لإجراء فحص وقائي تفعل ذلك سراً. وتقول اليوم إنها كانت هناك شبه مدمنة على نيل التقدير، وكانت ترى في كل استراحة وقتاً ضائعاً.\n\nأما الآن فتوزّع جهدها على نحو مختلف. وهي تقاطع عملها أمام الشاشة كل خمسين دقيقة، بناءً على توصية اختصاصي العلاج الطبيعي، وكذلك لأنها لاحظت أن أداءها بعد الاستراحة يتحسن. وقد اعتمد مديرها هذا النظام للفريق كله. ولا أحد يعرف على وجه الدقة إن كان يزيد الإنتاجية. أما أنه حسّن أجواء العمل، فيمكن ملاحظته بالفعل عند آلة القهوة."
    ),
    (
        "t-b2-22", ("questions", 0, "promptAr"),
        "ماذا يقول عن مناخ العمل أكثر من أي استبيان حسب السيدة لانغ؟",
        "ما الذي يكشف عن مناخ العمل أكثر من أي استبيان بحسب السيدة لانغ؟"
    ),
    (
        "t-b2-22", ("questions", 3, "promptAr"),
        "بعد العملية تبعتها ثلاثة أسابيع ___ وإجازة مرضية طويلة.",
        "بعد العملية أمضت السيدة لانغ ثلاثة أسابيع في ___، ثم حصلت على إجازة مرضية طويلة."
    ),

    ("t-b2-23", ("titleDe",), "Ein Passwort für alles", "Beispiel: Ein Passwort für mehrere Konten"),
    ("t-b2-23", ("titleAr",), "كلمة مرور واحدة لكل شيء", "مثال: كلمة مرور واحدة لعدة حسابات"),
    (
        "t-b2-23", ("ar",),
        "السيد بن سالم استعمل كلمة مرور واحدة لكل حساباته حتى اختُرق حسابه عند المتجر بعد إيميل ظنّه بريداً مزعجاً؛ المهاجمون كانوا يختبرون أين تصلح الكلمة نفسها. مستشارة البنك: الجرائم السيبرانية غالباً تجميع بيانات دخول وتجربتها آلياً؛ توصياتها: كلمة لكل حساب، تحديث دوري، نسخة احتياطية خارج السحابة. اكتشف أن آخر تحديث لهاتفه عمره سنة لامتلاء الذاكرة، وأن شروط الاستخدام تحدّد مدة تخزين البيانات؛ طلب الحذف وفق اللائحة الأوروبية وحفظ الصور على قرص صغير.",
        "استخدم السيد بن سالم لسنوات كلمة مرور واحدة فقط: لحسابه لدى متجر إلكتروني، ولخدمة التخزين السحابي التي تضم صور العائلة، وللعبة ابنه. وكان يظن أن ذلك عملي. ثم وصلته رسالة إلكترونية ظنها بريداً مزعجاً، وبعد يومين اكتشف أن حسابه لدى المتجر قد اختُرق. لم يُطلب شيء باهظ الثمن؛ ويبدو أن المهاجمين أرادوا فقط اختبار الخدمات التي ما زالت كلمة المرور نفسها تعمل فيها.\n\nشرحت له مستشارة البنك أن الجرائم السيبرانية نادراً ما تبدو كما في الأفلام. وكثيراً ما يستخدم المهاجمون بيانات دخول مسروقة ويجرّبونها آلياً لدى خدمات إلكترونية أخرى. وقالت ضاحكةً إن روبوت المحادثة في البنك كان سيعطيه الإجابة نفسها، لكن من دون قهوة. وكانت توصياتها بسيطة: كلمة مرور مختلفة لكل حساب، وتحديث البرامج بانتظام، وإنشاء نسخة احتياطية خارج السحابة.\n\nوعندما عاد إلى المنزل اكتشف أن آخر تحديث لهاتفه يعود إلى سنة مضت؛ فالذاكرة كانت ممتلئة، والبطارية تضعف مع كل محاولة تثبيت. ولم يقرأ قط شروط استخدام الخدمة السحابية؛ فقد أوضحت المدة التي يستمر خلالها تخزين البيانات بعد إلغاء الاشتراك. وبموجب المادة 17 من اللائحة العامة لحماية البيانات الأوروبية (DSGVO)، يمكنه طلب حذف بياناته الشخصية إذا انطبقت شروط محددة. أما وجوب حذف مزوّد الخدمة السحابية لها في حالته فيعتمد على الشروط القانونية والاستثناءات الممكنة. وقد قدّم طلباً للحذف، وصارت لديه الآن نسخة إضافية من الصور على قرص صلب صغير في درج المطبخ."
    ),
    (
        "t-b2-23", ("questions", 3, "promptDe"),
        "Nach der ___ darf er die Löschung verlangen.",
        "Unter bestimmten Voraussetzungen kann er nach Artikel 17 der ___ die Löschung verlangen."
    ),
    (
        "t-b2-23", ("questions", 3, "promptAr"),
        "بعد ___ يجوز له طلب الحذف.",
        "بشروط محددة، يمكنه طلب الحذف بموجب المادة 17 من ___."
    ),
    (
        "t-b2-23", ("questions", 3, "explanationAr"),
        "الدليل حرفياً: «Nach der DSGVO darf er die Löschung verlangen».",
        "الدليل حرفياً: «Unter bestimmten Voraussetzungen kann er nach Artikel 17 der DSGVO die Löschung seiner personenbezogenen Daten verlangen». أي إن طلب الحذف ممكن عند انطباق شروط المادة 17، ولا يعني أن كل طلب واجب القبول."
    ),

    ("t-b2-24", ("titleDe",), "Das erste Semester", "Beispiel: Das erste Semester"),
    ("t-b2-24", ("titleAr",), "الفصل الجامعي الأول", "مثال: الفصل الجامعي الأول"),
    (
        "t-b2-24", ("ar",),
        "منى حصلت على مقعد الدراسة في المحاولة الثانية، وفي أول محاضرة في مدرّج بأربعمائة مقعد لم تفهم بعد عشرين دقيقة بسبب السرعة لا اللغة. في موعد المكتب نصحتها المحاضِرة بدفتر تعلّم: ثلاثة أسطر كل مساء. بعد أسبوعين اكتشفت أن أكبر مشتّت لها ليس الهاتف بل القلق من عدم الكفاءة. خطّطت للبحث المكتوب عكسياً من موعد التسليم؛ إدارة الوقت عندها صارت: البدء مبكراً لا الإنجاز أكثر. نالت درجة اثنين، والبطاقات جاهزة قرب السرير.",
        "حصلت منى على المقعد الجامعي بعد المحاولة الثانية فقط؛ وصلها خطاب القبول بالبريد، وكان عليها إنجاز إجراءات التسجيل بنفسها حضورياً. ثم جلست في محاضرتها الأولى داخل مدرّج يتسع لأربعمائة مقعد، وبعد عشرين دقيقة باتت بالكاد تفهم أي كلمة. لم يكن السبب اللغة، بل سرعة المحاضرة.\n\nفي الساعات المكتبية نصحتها المحاضِرة بأمر وجدته منى في البداية طفولياً: أن تحتفظ بمذكرة للتعلّم. وكتبت كل مساء ثلاثة أسطر: ماذا فهمت؟ وما الذي لم أفهمه؟ وماذا سأفعل غداً حيال ذلك؟ وبعد أسبوعين لاحظت منى نمطاً متكرراً. لم يكن هاتفها أكبر ما يشتت انتباهها، بل خوفها من ألا تكون جيدة بما يكفي. وقد استهلك هذا الخوف وقتاً أطول من أي رسالة.\n\nولأول تقييم، وهو بحث من اثنتي عشرة صفحة، وضعت خطة عكسية بدءاً من موعد التسليم: المراجعة، ثم المسودة الأولية، فالخطة، فالقراءة. ومنذ ذلك الحين، لم تعد إدارة الوقت بالنسبة إليها تعني إنجاز المزيد، بل البدء في وقت أبكر. حصل البحث على الدرجة 2. وكتبت المحاضِرة تحته أن خطة البحث كانت واضحة على نحو غير معتاد. وما زالت سنوات تفصلها عن مشروع التخرج، لكن بطاقات المصطلحات التخصصية موجودة الآن في علبة بجانب سريرها."
    ),
    (
        "t-b2-24", ("questions", 0, "promptAr"),
        "لماذا لم تفهم منى في المحاضرة الأولى شيئاً تقريباً؟",
        "لماذا لم تعد منى تفهم إلا القليل في المحاضرة الأولى؟"
    ),
    (
        "t-b2-24", ("questions", 1, "promptAr"),
        "ما أكبر ما ألهى منى حسب مذكرتها التعلمية؟",
        "ما أكبر مصدر لتشتت منى بحسب مذكرة التعلّم؟"
    ),
    (
        "t-b2-24", ("questions", 2, "promptAr"),
        "هل حصل البحث على علامة «اثنين»؟",
        "هل نال البحث الدرجة 2؟"
    ),
    (
        "t-b2-24", ("questions", 3, "promptAr"),
        "في ___ نصحتها المحاضِرة بمذكرة تعلمية.",
        "في الساعات المكتبية نصحتها المحاضِرة بكتابة مذكرة للتعلّم."
    ),
    (
        "t-b2-24", ("questions", 3, "promptAr"),
        "في الساعات المكتبية نصحتها المحاضِرة بكتابة مذكرة للتعلّم.",
        "في ___ نصحتها المحاضِرة بكتابة مذكرة للتعلّم."
    ),
    (
        "t-b2-24", ("waisen", 1),
        "das Hörsaal",
        "der Hörsaal"
    ),

    ("t-b2-25", ("titleDe",), "Die Niederlage im Turnier", "Beispiel: Die Niederlage im Turnier"),
    ("t-b2-25", ("titleAr",), "الهزيمة في البطولة", "مثال: الهزيمة في البطولة"),
    (
        "t-b2-25", ("ar",),
        "خرج نادي الحي من البطولة في نصف النهائي بركلة جزاء في الدقيقة الأخيرة رأى الحكم فيها خطأً لم يره نصف الجمهور. الأهمّ ما جرى بعدها: في الجمعية العمومية لم يتحدث أحد عن الحكم بل عن التدريب؛ المدربة عرضت أرقام الإصابات (شدّ ورضوض معظمها في الشوط الثاني) وشخّصت ضعف تمارين القوة والإطالة. قرّر النادي الانضباط دون تشدّد: حصّتان ثابتتان، خطة إحماء، ودفتر تسجّل فيه كل لاعبة أفضل نتيجتها. سبعة انتساب جديد، معظمهم آباء كانوا يشجعون من الحافة.",
        "انتهى مشوار النادي الصغير من الحي في البطولة عند الدور نصف النهائي، بعد احتساب ركلة جزاء في الدقيقة الأخيرة. كان الحكم قد احتسب مخالفةً لم يرها نصف المتفرجين، فيما هتف النصف الآخر فرحاً. هكذا تكون المنافسة: المشهد نفسه، وحقيقتان مختلفتان.\n\nوكان ما جرى بعد ذلك أكثر إثارة للاهتمام من الهزيمة. فبعد أسبوعين، في اجتماع الأعضاء، لم يتحدث أحد عن الحكم؛ بل تحدثوا عن التدريب. عرضت المدربة أرقاماً: ثلاث حالات شدّ عضلي ورضّتان في موسم واحد، وقعت معظمها في الشوط الثاني. ولم يكن تفسيرها مريحاً: قالت إن تدريب التحمل جيد، لكن تدريب القوة ضعيف، وإنه لا يكاد أحد يطيل جسمه لأكثر من دقيقتين قبل المباريات.\n\nقرر النادي أن يصبح أكثر التزاماً من دون أن يكون أكثر تشدداً: حصتان ثابتتان أسبوعياً، وخطة إحماء يعرفها الجميع، ودفتر تسجل فيه كل لاعبة أفضل نتيجة حققتها بنفسها. ومنذ اتخاذ القرار، انضم سبعة أعضاء؛ معظمهم من أولياء الأمور الذين كانوا يشجعون من على جانب الملعب فحسب. ولا يزال من غير المعروف ما إذا كان الفريق سيتأهل إلى مرحلة أبعد في العام المقبل. أما المؤكد فهو أنه سيكون أفضل استعداداً، سواء فاز أم خسر."
    ),
    (
        "t-b2-25", ("ar",),
        "انتهى مشوار النادي الصغير من الحي في البطولة عند الدور نصف النهائي، بعد احتساب ركلة جزاء في الدقيقة الأخيرة. كان الحكم قد احتسب مخالفةً لم يرها نصف المتفرجين، فيما هتف النصف الآخر فرحاً. هكذا تكون المنافسة: المشهد نفسه، وحقيقتان مختلفتان.\n\nوكان ما جرى بعد ذلك أكثر إثارة للاهتمام من الهزيمة. فبعد أسبوعين، في اجتماع الأعضاء، لم يتحدث أحد عن الحكم؛ بل تحدثوا عن التدريب. عرضت المدربة أرقاماً: ثلاث حالات شدّ عضلي ورضّتان في موسم واحد، وقعت معظمها في الشوط الثاني. ولم يكن تفسيرها مريحاً: قالت إن تدريب التحمل جيد، لكن تدريب القوة ضعيف، وإنه لا يكاد أحد يطيل جسمه لأكثر من دقيقتين قبل المباريات.\n\nقرر النادي أن يصبح أكثر التزاماً من دون أن يكون أكثر تشدداً: حصتان ثابتتان أسبوعياً، وخطة إحماء يعرفها الجميع، ودفتر تسجل فيه كل لاعبة أفضل نتيجة حققتها بنفسها. ومنذ اتخاذ القرار، انضم سبعة أعضاء؛ معظمهم من أولياء الأمور الذين كانوا يشجعون من على جانب الملعب فحسب. ولا يزال من غير المعروف ما إذا كان الفريق سيتأهل إلى مرحلة أبعد في العام المقبل. أما المؤكد فهو أنه سيكون أفضل استعداداً، سواء فاز أم خسر.",
        "انتهى مشوار النادي الصغير من الحي في البطولة عند الدور نصف النهائي، بعد احتساب ركلة جزاء في الدقيقة الأخيرة. كان الحكم قد احتسب مخالفةً لم يرها نصف المتفرجين، فيما هتف النصف الآخر فرحاً. هكذا تكون المنافسة: المشهد نفسه، وحقيقتان مختلفتان.\n\nوكان ما جرى بعد ذلك أكثر إثارة للاهتمام من الهزيمة. فبعد أسبوعين، في اجتماع الأعضاء، لم يتحدث أحد عن الحكم؛ بل تحدثوا عن التدريب. عرضت المدربة أرقاماً: ثلاث حالات شدّ عضلي ورضّتان في موسم واحد، وقعت معظمها في الشوط الثاني. وهذه الأرقام جزء من القصة التدريبية، وليست إحصاءً موثّقاً. ولم يكن تفسيرها مريحاً: قالت إن تدريب التحمل جيد، لكن تدريب القوة ضعيف، وإنه لا يكاد أحد يمارس تمارين الإطالة لأكثر من دقيقتين قبل المباريات.\n\nقرر النادي أن يصبح أكثر التزاماً من دون أن يكون أكثر تشدداً: حصتان ثابتتان أسبوعياً، وخطة إحماء يعرفها الجميع، ودفتر تسجل فيه كل لاعبة أفضل نتيجة حققتها بنفسها. ومنذ اتخاذ القرار، انضم سبعة أعضاء جدد، معظمهم من أولياء الأمور الذين كانوا يشجعون من على جانب الملعب فحسب. ولا يزال من غير المعروف ما إذا كان الفريق سيتأهل إلى مرحلة أبعد في العام المقبل. والأكيد أن الفريق سيكون أفضل استعداداً، سواء فاز أم خسر."
    ),
    ("t-b2-25", ("ar",), 'انتهى مشوار النادي الصغير من الحي في البطولة عند الدور نصف النهائي، بعد احتساب ركلة جزاء في الدقيقة الأخيرة. كان الحكم قد احتسب مخالفةً لم يرها نصف المتفرجين، فيما هتف النصف الآخر فرحاً. هكذا تكون المنافسة: المشهد نفسه، وحقيقتان مختلفتان.\n\nوكان ما جرى بعد ذلك أكثر إثارة للاهتمام من الهزيمة. فبعد أسبوعين، في اجتماع الأعضاء، لم يتحدث أحد عن الحكم؛ بل تحدثوا عن التدريب. عرضت المدربة أرقاماً: ثلاث حالات شدّ عضلي ورضّتان في موسم واحد، وقعت معظمها في الشوط الثاني. وهذه الأرقام جزء من القصة التدريبية، وليست إحصاءً موثّقاً. ولم يكن تفسيرها مريحاً: قالت إن تدريب التحمل جيد، لكن تدريب القوة ضعيف، وإنه لا يكاد أحد يمارس تمارين الإطالة لأكثر من دقيقتين قبل المباريات.\n\nقرر النادي أن يصبح أكثر التزاماً من دون أن يكون أكثر تشدداً: حصتان ثابتتان أسبوعياً، وخطة إحماء يعرفها الجميع، ودفتر تسجل فيه كل لاعبة أفضل نتيجة حققتها بنفسها. ومنذ اتخاذ القرار، انضم سبعة أعضاء جدد، معظمهم من أولياء الأمور الذين كانوا يشجعون من على جانب الملعب فحسب. ولا يزال من غير المعروف ما إذا كان الفريق سيتأهل إلى مرحلة أبعد في العام المقبل. والأكيد أن الفريق سيكون أفضل استعداداً، سواء فاز أم خسر.', 'انتهى مشوار النادي الصغير من الحي في البطولة عند الدور نصف النهائي، بعد احتساب ركلة جزاء في الدقيقة الأخيرة. كان الحكم قد احتسب مخالفةً لم يرها نصف المتفرجين، فيما هتف النصف الآخر فرحاً. هكذا تكون المنافسة: المشهد نفسه، وحقيقتان مختلفتان.\n\nوكان ما جرى بعد ذلك أكثر إثارة للاهتمام من الهزيمة. فبعد أسبوعين، في اجتماع الأعضاء، لم يتحدث أحد عن الحكم؛ بل تحدثوا عن التدريب. عرضت المدربة أرقاماً: ثلاث حالات شدّ عضلي ورضّتان في موسم واحد، وقعت معظمها في الشوط الثاني. وهذه الأرقام جزء من القصة التدريبية، وليست إحصاءً موثّقاً. ولم يكن تفسيرها مريحاً: قالت إن تدريب التحمل جيد، لكن تدريب القوة ضعيف، وإنه لا يكاد أحد يمارس تمارين الإطالة لأكثر من دقيقتين قبل المباريات.\n\nقرر النادي أن يصبح أكثر التزاماً من دون أن يكون أكثر تشدداً: حصتان ثابتتان أسبوعياً، وخطة إحماء يعرفها الجميع، ودفتر تسجل فيه كل لاعبة أفضل نتيجة حققتها بنفسها. ومنذ اتخاذ القرار، سجّل النادي سبع حالات انتساب. وكان معظم الأعضاء الجدد من أولياء الأمور الذين كانوا يكتفون بالتشجيع من على جانب الملعب. ولا يزال من غير المعروف ما إذا كان الفريق سيتأهل إلى مرحلة أبعد في العام المقبل. والأكيد أن الفريق سيكون أفضل استعداداً، سواء فاز أم خسر.'),
    (
        "t-b2-25", ("questions", 2, "explanationAr"),
        "الدليل حرفياً: «die meisten von Eltern, die vorher nur vom Rand aus angefeuert hatten».",
        "الدليل حرفياً: «Die meisten sind Eltern, die vorher nur vom Rand aus angefeuert hatten»."
    ),
    (
        "t-b2-25", ("questions", 2, "promptDe"),
        "Die meisten neuen Mitglieder sind Eltern, die vorher vom Rand aus angefeuert hatten.",
        "Die meisten neuen Mitglieder waren Eltern, die vorher nur vom Rand aus angefeuert hatten."
    ),
    (
        "t-b2-25", ("questions", 2, "explanationAr"),
        "الدليل حرفياً: «Die meisten sind Eltern, die vorher nur vom Rand aus angefeuert hatten».",
        "الدليل حرفياً: «Die meisten neuen Mitglieder waren Eltern, die vorher nur vom Rand aus angefeuert hatten»."
    ),
    (
        "t-b2-25", ("questions", 2, "promptAr"),
        "هل معظم الأعضاء الجدد أولياء كانوا يهتفون من الحافة سابقاً؟",
        "هل معظم الأعضاء الجدد من أولياء الأمور الذين كانوا يشجعون من جانب الملعب؟"
    ),
    (
        "t-b2-25", ("questions", 3, "promptAr"),
        "ثلاث ___ ورضّتان في موسم واحد، كلها في الشوط الثاني.",
        "ثلاث ___ ورضّتان في موسم واحد، وقعت معظمها في الشوط الثاني."
    ),
]

# The cybercrime and GDPR sentences are updated by exact single-occurrence guards.
TEXT_REPLACEMENTS = [
    (
        "t-b2-21", ("de",),
        "Tarek dachte an Neid; seine Schwester vermutete sogar, Tarek habe ihn betrügen wollen, weil Tarek ihm nichts von dem Gespräch erzählt hatte.",
        "Tarek deutete Ramis Schweigen als Neid; seine Schwester vermutete sogar, Tarek habe Rami betrügen wollen, weil Tarek ihm nichts vom Bewerbungsgespräch erzählt hatte.",
    ),
    (
        "t-b2-23", ("de",),
        "Meistens sammelt jemand Zugangsdaten und probiert sie automatisch überall aus.",
        "Oft verwenden Angreifer gestohlene Zugangsdaten und probieren sie automatisch bei anderen Onlinediensten aus.",
    ),
    (
        "t-b2-23", ("de",),
        "Nach der DSGVO darf er die Löschung verlangen. Er hat es getan,",
        "Unter bestimmten Voraussetzungen kann er nach Artikel 17 der DSGVO die Löschung seiner personenbezogenen Daten verlangen. Ob der Cloud-Anbieter sie in diesem Fall löschen muss, hängt von den gesetzlichen Voraussetzungen und möglichen Ausnahmen ab. Er hat die Löschung beantragt,",
    ),
    (
        "t-b2-25", ("de",),
        "im Halbfinale, mit einem Elfmeter in der letzten Minute.",
        "im Halbfinale mit einem Elfmeter in der letzten Minute.",
    ),
    (
        "t-b2-25", ("de",),
        "Seit dem Beschluss gab es sieben Beitritte, die meisten von Eltern, die vorher nur vom Rand aus angefeuert hatten.",
        "Seit dem Beschluss sind sieben neue Mitglieder beigetreten. Die meisten sind Eltern, die vorher nur vom Rand aus angefeuert hatten.",
    ),
    (
        "t-b2-25", ("de",),
        "Seit dem Beschluss sind sieben neue Mitglieder beigetreten. Die meisten sind Eltern, die vorher nur vom Rand aus angefeuert hatten.",
        "Seit dem Beschluss verzeichnete der Verein sieben Beitritte. Die meisten neuen Mitglieder waren Eltern, die vorher nur vom Rand aus angefeuert hatten.",
    ),
    (
        "t-b2-25", ("de",),
        "Ob die Mannschaft nächstes Jahr weiterkommt, ist offen.",
        "Ob die Mannschaft nächstes Jahr eine Runde weiterkommt, ist offen.",
    ),
    (
        "t-b2-25", ("de",),
        "Dass sie besser vorbereitet verliert oder gewinnt, ist sicher.",
        "Sicher ist, dass die Mannschaft besser vorbereitet sein wird – ob sie gewinnt oder verliert.",
    ),
    (
        "t-b2-25", ("de",),
        "drei Zerrungen und zwei Prellungen in einer Saison, fast alle in der zweiten Halbzeit.",
        "drei Zerrungen und zwei Prellungen in einer Saison, fast alle in der zweiten Halbzeit. Diese Zahlen gehören zur Trainingsgeschichte; sie sind keine belegte Statistik.",
    ),
]

SOURCE_SHA256: dict[str, str] = {
    "t-b2-21": "7f707e70bebf68cfecc46336f56f920026622914db02383b04a40942e578a276",
    "t-b2-22": "ffc10c468dde056cb74c358e8c5304f8ff7c67663bfffc3f8986d1053f045d44",
    "t-b2-23": "61e62b9f63fee2264e3560413ad9ad1f4ae97a04967dab50c6b6a7e4b1dd7687",
    "t-b2-24": "c1bc30fc43da8367c0e53a824a3ddcacd59f17c0de8c544f55d0a3555b7bcc89",
    "t-b2-25": "bcf90dfa28a5ed528ed797e79c7f6a952e0aa5fbe8b93a1a2230541de7189c60",
}


def get_path(root: object, path: tuple) -> object:
    value = root
    for key in path:
        value = value[key]  # type: ignore[index]
    return value


def set_path(root: dict, path: tuple, value: object) -> None:
    parent = root
    for key in path[:-1]:
        parent = parent[key]  # type: ignore[index]
    parent[path[-1]] = value


def apply_edits(by_id: dict[str, dict]) -> int:
    changed = 0
    known_values: dict[tuple[str, tuple], set[object]] = {}
    for text_id, path, before, after in FIELD_EDITS:
        known_values.setdefault((text_id, path), set()).update((before, after))
    for text_id, path, before, after in FIELD_EDITS:
        item = by_id.get(text_id)
        if item is None or item.get("level") != "B2" or item.get("neu") is not True:
            raise ValueError(f"missing, wrong-level, or non-neu source: {text_id}")
        current = get_path(item, path)
        if current == before:
            set_path(item, path, after)
            changed += 1
        elif current in known_values[(text_id, path)]:
            # A later guarded transition for this same field has already run.
            continue
        else:
            raise ValueError(f"unexpected source value for {text_id} {path}: {current!r}")
    for transition_index, (text_id, path, before, after) in enumerate(TEXT_REPLACEMENTS):
        item = by_id.get(text_id)
        if item is None or item.get("level") != "B2":
            raise ValueError(f"missing or wrong-level text replacement: {text_id}")
        current = get_path(item, path)
        if not isinstance(current, str):
            raise ValueError(f"non-text replacement target: {text_id} {path}")
        before_count, after_count = current.count(before), current.count(after)
        if before_count == 1 and after_count == 0:
            set_path(item, path, current.replace(before, after, 1))
            changed += 1
        elif after_count == 1 and (before_count == 0 or before in after):
            # The final phrase may intentionally retain the old wording as its prefix.
            continue
        elif before_count == 0 and any(
            later_id == text_id and later_path == path and current.count(later_after) == 1
            for later_id, later_path, _later_before, later_after in TEXT_REPLACEMENTS[transition_index + 1:]
        ):
            # A subsequent guarded transition for this same field has already reached its final form.
            continue
        else:
            raise ValueError(f"unexpected text replacement state for {text_id} {path}: {before_count}/{after_count}")
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare", action="store_true", help="apply reviewed translations/factual corrections before TTS")
    args = parser.parse_args()

    texts = json.loads(TEXTS_FILE.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in texts}
    if len(by_id) != len(texts):
        raise ValueError("duplicate text ids")
    changed = apply_edits(by_id)
    batch = [by_id[text_id] for text_id in TARGET_IDS]
    for item in batch:
        if item.get("level") != "B2" or item.get("neu") is not True:
            raise ValueError(f"R167 source is not a new B2 text: {item['id']}")
        if not item.get("titleDe", "").startswith("Beispiel:") or not item.get("titleAr", "").startswith("مثال:"):
            raise ValueError(f"example label missing: {item['id']}")
        if len(item.get("questions", [])) != 4:
            raise ValueError(f"expected four questions: {item['id']}")
        for question in item["questions"]:
            options = question.get("options", [])
            if (question.get("type") not in {"mc", "truefalse", "fill"} or not question.get("promptDe", "").strip() or
                    not question.get("promptAr", "").strip() or not question.get("explanationAr", "").strip()):
                raise ValueError(f"incomplete question: {item['id']}:{question.get('id')}")
            if question["type"] == "fill":
                if not isinstance(question.get("answer"), list) or not question["answer"]:
                    raise ValueError(f"invalid fill answer: {item['id']}:{question.get('id')}")
            elif len(options) < 2 or len(options) != len(set(options)) or question.get("answer") not in options:
                raise ValueError(f"invalid options/key: {item['id']}:{question.get('id')}")

    if changed:
        TEXTS_FILE.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("R167 reviewed German word counts:", json.dumps({t["id"]: len(t["de"].split()) for t in batch}, ensure_ascii=False))
    print("R167 guarded transitions:", len(FIELD_EDITS) + len(TEXT_REPLACEMENTS), "applied:", changed)
    print("R167 German/Arabic body word counts:", json.dumps({t["id"]: [len(t["de"].split()), len(t["ar"].split())] for t in batch}, ensure_ascii=False))
    if args.prepare:
        print("R167 prepare complete; generate audio from the current de fields before finalizing the manifest.")
        return

    if set(SOURCE_SHA256) != set(TARGET_IDS):
        raise ValueError("populate SOURCE_SHA256 after reviewing and generating the exact German source strings")
    for item in batch:
        digest = hashlib.sha256(item["de"].encode("utf-8")).hexdigest()
        if SOURCE_SHA256.get(item["id"]) != digest:
            raise ValueError(f"R167 audio/source hash mismatch: {item['id']}")

    manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    entries = manifest.get("einsaetze", [])
    by_audio_id = {entry["id"]: entry for entry in entries}
    if len(by_audio_id) != len(entries) or manifest.get("count") != len(entries) or len(entries) < 137:
        raise ValueError("unexpected HörLabor manifest count/IDs")
    dialog_ids = {e["id"] for e in json.loads((ROOT / "content" / "dialog-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
    diktat_ids = {e["id"] for e in json.loads((ROOT / "content" / "diktat-audio.json").read_text(encoding="utf-8")).get("einsaetze", [])}
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
    if added or refreshed:
        manifest["count"] = len(entries)
        manifest["updated"] = date.today().isoformat()
        MANIFEST_FILE.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"R167: {added} new manifest entries · {refreshed} refreshed entries · {manifest['count']} HörLabor files total")


if __name__ == "__main__":
    main()
