# -*- coding: utf-8 -*-
"""
القضية ١ — سدّ تناقض Präteritum
يضيف درسَين: a1-war-hatte (تعرُّف) و a2-praeteritum (إنتاج) + تركتَيهما.
القرار المنهجي المثبّت: تعرُّف في A1 · إنتاج في A2.
"""
import json, collections, io

G = "content/grammar.json"
E = "content/eselsbruecken.json"

# ══════════════ الدرس الأول: war / hatte — A1 تعرُّفي ══════════════
war_hatte = {
    "id": "a1-war-hatte",
    "titleDe": "Präteritum von sein & haben: war / hatte",
    "titleAr": "الماضي البسيط لـ sein و haben: war / hatte",
    "level": "A1",
    "summaryAr": "فعلان اثنان فقط يكسران قاعدة «الماضي في الألمانية = Perfekt» في الكلام اليومي: sein و haben. لهما ماضٍ بسيط خاص يُستعمل حتى في الحديث الشفوي: war و hatte. في هذا الدرس تتعلّم أن **تتعرّفهما وتسمعهما وتفهمهما** — أمّا إنتاجهما المنظَّم فموعدُه في A2 مع الماضي البسيط كاملاً.",
    "summaryDe": "Zwei Verben bilden im Deutschen eine Ausnahme: sein und haben stehen auch in der gesprochenen Sprache im Präteritum (war / hatte), nicht im Perfekt.",
    "rules": [
        {"de": "sein → Präteritum: war. „Ich bin müde“ (jetzt) → „Ich war müde“ (gestern).",
         "ar": "sein يصير war في الماضي. «أنا متعب الآن» ← «كنت متعباً». لا تقل «Ich bin müde gewesen» في الحديث — ثقيلة ومقبولة لكنها ليست الطبيعية."},
        {"de": "haben → Präteritum: hatte. „Ich habe Zeit“ → „Ich hatte Zeit“.",
         "ar": "haben يصير hatte. لاحظ سقوط الـb كما في المضارع hast/hat — الجذر واحد."},
        {"de": "In A1 erkennst du war/hatte — du musst sie noch nicht frei produzieren.",
         "ar": "المطلوب منك الآن أن **تسمعها فتفهمها** وتقرأها فلا تتلعثم. الإنتاج المنظَّم في A2."},
    ],
    "tables": [
        {"captionAr": "التصريفان الكاملان — احفظهما كالأذكار",
         "headers": ["Person", "sein → war", "haben → hatte"],
         "rows": [
            ["ich", "war", "hatte"],
            ["du", "warst", "hattest"],
            ["er/sie/es", "war", "hatte"],
            ["wir", "waren", "hatten"],
            ["ihr", "wart", "hattet"],
            ["sie/Sie", "waren", "hatten"],
         ]},
        {"captionAr": "المواضع الخمسة التي لا غنى لك فيها عن war/hatte منذ اليوم الأول",
         "headers": ["الاستعمال", "مثال", "لماذا هنا بالذات"],
         "rows": [
            ["السؤال عن الحال", "Wie war dein Tag?", "الألماني لا يسأل «Wie ist dein Tag gewesen»"],
            ["الطقس في الماضي", "Gestern war es kalt.", "وصف الجو يقفز مباشرة إلى war"],
            ["المكان", "Ich war zu Hause.", "أول جملة يقولها المتعلّم عن يومه"],
            ["الامتلاك السابق", "Er hatte keine Zeit.", "شكوى يومية لا تُقال إلا بـhatte"],
            ["الوجود", "Es gab / Das war schön.", "الحكم على تجربة منتهية"],
         ]},
    ],
    "examples": [
        {"de": "Gestern war ich krank, aber heute bin ich wieder fit.",
         "ar": "أمس كنت مريضاً، لكنني اليوم بخير again. لاحظ المقابلة: war (أمس) ← bin (اليوم)."},
        {"de": "Wie war das Wetter in Hammamet? — Es war sonnig und warm.",
         "ar": "كيف كان الطقس في الحمامات؟ — كان مشمساً ودافئاً. سؤال وجواب كلاهما بـwar."},
        {"de": "Letzte Woche hatte ich viel Stress bei der Arbeit.",
         "ar": "الأسبوع الماضي كان عندي ضغط كثير في العمل. (حرفياً: امتلكتُ ضغطاً)"},
        {"de": "Wart ihr schon einmal in Berlin? — Ja, wir waren 2019 dort.",
         "ar": "هل كنتم مرة في برلين؟ — نعم، كنّا هناك في 2019."},
        {"de": "Es war einmal ein König, der hatte drei Söhne.",
         "ar": "«كان يا ما كان ملكٌ كان له ثلاثة أبناء» — بداية كل حكاية ألمانية. war + hatte معاً في جملة واحدة."},
    ],
    "pitfalls": [
        {"de": "„Ich habe krank gewesen“ ✗ → „Ich war krank“ ✓",
         "ar": "أشهر خطأ عربي في الماضي الألماني: ترجمة «كنت مريضاً» حرفياً بـPerfekt. sein لا يُصرَف بـgewesen في الحديث اليومي — له war."},
        {"de": "„Wie ist dein Wochenende gewesen?“ △ → „Wie war dein Wochenende?“ ✓",
         "ar": "الصيغة الأولى ليست خطأً نحوياً لكنها ثقيلة ومدرسية. الألماني يسأل بـwar مباشرة."},
        {"de": "„er warst“ / „ich hattest“ ✗ → er war · ich hatte ✓",
         "ar": "لا تنقل نهاية الضمير إلى الفعل: warst تخصّ du وحدها، hattest تخصّ du وحدها."},
    ],
    "exercises": [
        {"id": "a1-war-hatte-e1", "type": "fill",
         "promptDe": "Gestern ___ ich im Sprachkurs. (sein)", "answer": "war",
         "explanationAr": "sein في الماضي مع ich = war. لا تستعمل gewesen في الحديث."},
        {"id": "a1-war-hatte-e2", "type": "fill",
         "promptDe": "Letzte Woche ___ wir keine Zeit. (haben)", "answer": "hatten",
         "explanationAr": "haben في الماضي مع wir = hatten."},
        {"id": "a1-war-hatte-e3", "type": "fill",
         "promptDe": "___ du gestern zu Hause? (sein)", "answer": "Warst",
         "hint": "بداية السؤال — حرف كبير",
         "explanationAr": "مع du تأخذ war نهاية -st: warst. وفي أول السؤال تُكتب بحرف كبير."},
        {"id": "a1-war-hatte-e4", "type": "fill",
         "promptDe": "Es ___ einmal ein König. Er ___ drei Söhne.", "answer": ["war", "hatte"],
         "explanationAr": "بداية الحكاية التقليدية: Es war einmal … ثم الانتقال إلى الامتلاك بـhatte."},
        {"id": "a1-war-hatte-e5", "type": "mc",
         "promptDe": "Wie fragt man natürlich nach dem Wochenende?",
         "options": ["Wie war dein Wochenende?", "Wie ist dein Wochenende gewesen?", "Wie hast du dein Wochenende?"],
         "answer": "Wie war dein Wochenende?",
         "explanationAr": "الألماني يسأل بـwar مباشرة. الصيغة الثانية صحيحة نحوياً لكنها ثقيلة، والثالثة خاطئة لأن الزمن حاضر."},
        {"id": "a1-war-hatte-e6", "type": "mc",
         "promptDe": "Was ist richtig?",
         "options": ["Ich war gestern müde.", "Ich habe gestern müde gewesen.", "Ich bin gestern müde."],
         "answer": "Ich war gestern müde.",
         "explanationAr": "الصفات مع sein، وفي الماضي مع war. الخيار الثاني ترجمة حرفية عربية خاطئة، والثالث زمنه حاضر."},
        {"id": "a1-war-hatte-e7", "type": "truefalse",
         "promptDe": "„Ich hatte keine Zeit“ bedeutet: لم يكن لديّ وقت.",
         "answer": "true",
         "explanationAr": "hatte = كان عندي. والنفي keine يجعلها «لم يكن عندي»."},
    ],
}

# ══════════════ الدرس الثاني: Präteritum كاملاً — A2 إنتاجي ══════════════
praeteritum = {
    "id": "a2-praeteritum",
    "titleDe": "Präteritum — die Erzählzeit",
    "titleAr": "الماضي البسيط: زمن السرد",
    "level": "A2",
    "summaryAr": "بعد أن تعرّفتَ war و hatte في A1، يأتي هنا الماضي البسيط كاملاً: المنتظم (-te) والشاذّ (تغيير في الجذر)، ومتى تستعمله ومتى تستعمل Perfekt. هذا هو **زمن الكتابة والسرد**: به تكتب رسالةً عن عطلة، وبه تُحكى قصة في امتحان A2 وB1، وبه كُتبت كل رواية ألمانية تقرؤها.",
    "summaryDe": "Das Präteritum ist die Erzählzeit der geschriebenen Sprache: regelmäßige Bildung mit -te, unregelmäßige mit Stammwechsel, und eine klare Arbeitsteilung mit dem Perfekt.",
    "rules": [
        {"de": "Regelmäßige Verben: Stamm + -te + Personalendung. machen → ich machte, du machtest, er machte.",
         "ar": "المنتظم: الجذر + te + نهاية الضمير. لاحظ أن er machte و ich machte **متطابقان** — وهذه ميزة Präteritum: الشخص الأول والثالث سواء."},
        {"de": "Unregelmäßige Verben: Stammwechsel, keine -te. gehen → ging, sehen → sah, kommen → kam.",
         "ar": "الشاذّ: يتغيّر الجذر بلا te. تُحفَظ كأعمدة التصريف الثلاثة (gehen–ging–gegangen)."},
        {"de": "Arbeitsteilung: gesprochen → Perfekt, geschrieben → Präteritum. Aber sein/haben/Modale → immer Präteritum.",
         "ar": "**قاعدة التقسيم الذهبية**: في الكلام Perfekt، وفي الكتابة Präteritum. لكن sein و haben والأفعال الناقصة تبقى Präteritum حتى في الكلام."},
        {"de": "Modalverben im Präteritum sind kürzer und natürlicher: „Ich musste arbeiten“ statt „Ich habe arbeiten müssen“.",
         "ar": "مع الناقصة، Präteritum أقصر وأوضح: musste بدل habe arbeiten müssen. ولهذا تُفضَّل دائماً."},
    ],
    "tables": [
        {"captionAr": "المنتظم: machen — قارن بالشخصين المتطابقين",
         "headers": ["Person", "Präteritum", "Perfekt (للمقارنة)"],
         "rows": [
            ["ich", "machte", "habe gemacht"],
            ["du", "machtest", "hast gemacht"],
            ["er/sie/es", "machte", "hat gemacht"],
            ["wir", "machten", "haben gemacht"],
            ["ihr", "machtet", "habt gemacht"],
            ["sie/Sie", "machten", "haben gemacht"],
         ]},
        {"captionAr": "الشاذّ الأكثر استعمالاً — هذه العشرون تكفيك في A2",
         "headers": ["Infinitiv", "Präteritum", "Partizip II", "المعنى"],
         "rows": [
            ["sein", "war", "gewesen", "يكون"],
            ["haben", "hatte", "gehabt", "يملك"],
            ["werden", "wurde", "geworden", "يصير"],
            ["gehen", "ging", "gegangen", "يذهب"],
            ["kommen", "kam", "gekommen", "يأتي"],
            ["sehen", "sah", "gesehen", "يرى"],
            ["finden", "fand", "gefunden", "يجد"],
            ["geben", "gab", "gegeben", "يعطي"],
            ["sprechen", "sprach", "gesprochen", "يتكلم"],
            ["fahren", "fuhr", "gefahren", "يسافر/يقود"],
            ["essen", "aß", "gegessen", "يأكل"],
            ["trinken", "trank", "getrunken", "يشرب"],
            ["schreiben", "schrieb", "geschrieben", "يكتب"],
            ["lesen", "las", "gelesen", "يقرأ"],
            ["wissen", "wusste", "gewusst", "يعرف (شاذّ-منتظم)"],
            ["denken", "dachte", "gedacht", "يفكّر (شاذّ-منتظم)"],
            ["bringen", "brachte", "gebracht", "يجلب (شاذّ-منتظم)"],
            ["müssen", "musste", "gemusst", "يضطر"],
            ["können", "konnte", "gekonnt", "يستطيع"],
            ["wollen", "wollte", "gewollt", "يريد"],
         ]},
        {"captionAr": "متى أيّهما؟ — القرار في ثلاثة أسطر",
         "headers": ["الموقف", "الزمن المختار", "السبب"],
         "rows": [
            ["حوار يومي شفوي", "Perfekt", "هكذا يتكلم الألمان فعلاً"],
            ["رسالة / بريد / سرد مكتوب", "Präteritum", "زمن الكتابة المعتمد"],
            ["sein · haben · Modale في أي موقف", "Präteritum", "استثناء ثابت حتى شفوياً"],
            ["خبر صحفي / رواية / تقرير", "Präteritum", "لغة السرد الرسمية"],
         ]},
    ],
    "examples": [
        {"de": "Letzten Sommer fuhr ich mit dem Zug nach Sousse. Ich las ein Buch und schlief zweimal ein.",
         "ar": "الصيف الماضي سافرت بالقطار إلى سوسة. قرأت كتاباً ونمت مرتين. كل الأفعال Präteritum لأنه سرد مكتوب."},
        {"de": "Als ich nach Deutschland kam, konnte ich nur wenig Deutsch. Ich musste jeden Tag lernen.",
         "ar": "حين جئت إلى ألمانيا كنت أعرف قليلاً من الألمانية فقط. كان عليّ أن أتعلم كل يوم. لاحظ kam و konnte و musste — كلها ناقصة أو شاذة."},
        {"de": "Er öffnete das Fenster, weil es zu warm war.",
         "ar": "فتح النافذة لأن الجو كان دافئاً أكثر من اللازم. فتحَ (منتظم) و كان (شاذّ) في جملة واحدة."},
        {"de": "„Hast du den Film gesehen?“ — „Ja, ich sah ihn letzte Woche.“",
         "ar": "السؤال شفوي فاستعمل Perfekt، والجواب سردي فاستعمل Präteritum. هذا هو التقسيم الطبيعي."},
        {"de": "Es war einmal eine Frau, die hatte einen kleinen Laden. Jeden Morgen stand sie um fünf auf.",
         "ar": "كان يا ما كان امرأةٌ كان لها متجر صغير. كل صباح كانت تقوم في الخامسة. بداية حكاية كلاسيكية بثلاثة أفعال ماضية."},
    ],
    "pitfalls": [
        {"de": "„Ich habe gestern ins Kino gegangen“ ✗ → „Ich ging gestern ins Kino“ ✓ أو „Ich bin gegangen“ ✓",
         "ar": "خطأ مزدوج: gehen تأخذ sein لا haben في Perfekt، والأفضل في السرد أصلاً أن تستعمل ging."},
        {"de": "„er machtete“ ✗ → „er machte“ ✓",
         "ar": "لا تجمع بين علامة المنتظم -te ونهاية الضمير -e للشخص الثالث. ich machte = er machte."},
        {"de": "„Ich musste zu arbeiten“ ✗ → „Ich musste arbeiten“ ✓",
         "ar": "بعد الفعل الناقص يأتي المصدر عارياً بلا zu — وهذه قاعدة A2 لكن Präteritum يكشفها."},
        {"de": "„Ich wusste nicht“ ✓ لكن „Ich weißte nicht“ ✗",
         "ar": "wissen من الأفعال الشاذّة-المنتظمة: wusste (بضمّتين) لا weißte. وكذلك dachte من denken."},
    ],
    "exercises": [
        {"id": "a2-praeteritum-e1", "type": "fill",
         "promptDe": "Gestern ___ ich früh aufstehen. (müssen)", "answer": "musste",
         "explanationAr": "müssen في Präteritum مع ich = musste. الناقصة تُستعمل Präteritum حتى شفوياً."},
        {"id": "a2-praeteritum-e2", "type": "fill",
         "promptDe": "Er ___ ein Buch und ___ dann ein. (lesen / schlafen — Präteritum)", "answer": ["las", "schlief"],
         "explanationAr": "lesen شاذّ: las. schlafen شاذّ: schlief. كلاهما بلا te."},
        {"id": "a2-praeteritum-e3", "type": "fill",
         "promptDe": "Wir ___ den ganzen Tag am Strand. (sein)", "answer": "waren",
         "explanationAr": "sein مع wir = waren."},
        {"id": "a2-praeteritum-e4", "type": "mc",
         "promptDe": "Welcher Satz gehört in eine schriftliche Erzählung?",
         "options": ["Ich ging zum Bahnhof und kaufte eine Fahrkarte.",
                     "Ich bin zum Bahnhof gegangen und habe eine Fahrkarte gekauft.",
                     "Ich gehe zum Bahnhof und kaufe eine Fahrkarte."],
         "answer": "Ich ging zum Bahnhof und kaufte eine Fahrkarte.",
         "explanationAr": "السرد المكتوب يستعمل Präteritum. الثاني شفوي صحيح لكنه ليس أسلوب الحكاية، والثالث مضارع."},
        {"id": "a2-praeteritum-e5", "type": "mc",
         "promptDe": "Was ist die Präteritum-Form von „wissen“?",
         "options": ["wusste", "weißte", "gewusst", "wusste nicht"],
         "answer": "wusste",
         "explanationAr": "wissen من الشاذّ-المنتظم: wusste. weißte غير موجودة، وgewusst هي Partizip II."},
        {"id": "a2-praeteritum-e6", "type": "translate",
         "promptDe": "ترجم إلى الألمانية بـPräteritum: «كان الطقس جميلاً، فسافرنا بالسيارة.»",
         "answer": "Das Wetter war schön, also fuhren wir mit dem Auto.",
         "keywords": ["war", "fuhren"],
         "explanationAr": "war من sein، و fuhren من fahren. كلاهما شاذّ وبلا te."},
        {"id": "a2-praeteritum-e7", "type": "truefalse",
         "promptDe": "„ich machte“ und „er machte“ sind identisch.",
         "answer": "true",
         "explanationAr": "صحيح — في Präteritum الشخص الأول والثالث المفرد متطابقان. هذه ميزة تُخفّف الحفظ."},
        {"id": "a2-praeteritum-e8", "type": "order",
         "promptDe": "Ordne die Erzählkette: (kommen → ankommen → aussteigen)",
         "answer": ["Der Zug kam", "wir kamen an", "wir stiegen aus"],
         "explanationAr": "kommen ← kam، ankommen ← kamen an (بادئة منفصلة تذهب للآخر)، aussteigen ← stiegen aus."},
    ],
}

# ══════════════ التركتان ══════════════
bruecke_war = {
    "id": "war-hatte-erzaehlcode",
    "emoji": "⏪",
    "sektion": "verb",
    "level": "A1",
    "titleAr": "war / hatte ➔ «شفرة البداية: كل حكاية تُفتَح بهما»",
    "storyAr": "لا تحاول أن تشتقّهما من قاعدة — فهذان الفعلان كسرا قاعدةَ Perfekt وخرجا عنها منذ قرون. احفظهما كما تحفظ «كان يا ما كان»: كل حكاية ألمانية تُفتَح بـ Es war einmal، وكل شكوى يومية تُفتَح بـ Ich hatte keine Zeit. التركةُ أن تلاحظ أن war و hatte يفعلان بالعربية فعلَ «كان» و«كان عنده» — فالعربية نفسها تستعمل «كان» في الماضي ولا تقول «كان يكون موجوداً».",
    "zeilen": [
        {"code": "المفتاح السردي", "de": "Es war einmal …", "ar": "«كان يا ما كان» — أول جملة تسمعها في كل حكاية"},
        {"code": "المفتاح اليومي", "de": "Ich hatte keine Zeit.", "ar": "«لم يكن عندي وقت» — أكثر جملة يقولها إنسان"},
        {"code": "التماثل المنقذ", "de": "ich war = er war · ich hatte = er hatte", "ar": "الشخص الأول والثالث سواء — نصف الجدول محفوظ مجاناً"},
        {"code": "المحظور", "de": "„Ich bin krank gewesen“ △ → „Ich war krank“ ✓", "ar": "لا تترجم «كنت» حرفياً بـPerfekt في الحديث"},
    ],
    "gramIds": ["a1-war-hatte"],
    "warnung": "war/hatte يُطلب منك في A1 تعرُّفاً فقط — افهمهما حين تسمعهما، ولا تُجبَر على إنتاجهما قبل A2.",
}

bruecke_praet = {
    "id": "praeteritum-buchzeit",
    "emoji": "📖",
    "sektion": "verb",
    "level": "A2",
    "titleAr": "Präteritum ➔ «شفرة الكتاب: فمٌ يتكلم Perfekt ويدٌ تكتب Präteritum»",
    "storyAr": "اجعل في ذهنك إنساناً واحداً بجهازَين: فمُه يتكلم مع صديقه فيقول Ich bin gegangen، ويدُه تكتب رسالةً فتقول Ich ging. الجهازان صحيحان، ولكلٍّ مقامُه. والاستثناء الوحيد الذي يكسر القاعدة: sein و haben والأفعال الناقصة — فهي تكتب **وتتكلّم** بـPräteritum معاً، لأن Ich habe gearbeitet haben ثقيلة على اللسان. احفظ التركة: «الفم Perfekt واليد Präteritum — والتوأمان والخدمُ الثلاثة يكتبون ويتكلّمون سواء».",
    "zeilen": [
        {"code": "قانون الجهازين", "de": "gesprochen: Perfekt · geschrieben: Präteritum", "ar": "الفم يقول bin gegangen · اليد تكتب ging"},
        {"code": "الاستثناء الثابت", "de": "sein · haben · müssen/können/wollen → immer Präteritum", "ar": "war · hatte · musste — حتى في الحديث اليومي"},
        {"code": "العلامة المنتظمة", "de": "Stamm + te: machen → machte · arbeiten → arbeitete", "ar": "كل ما ينتهي بـt أو d يأخذ -ete حتى يُنطق"},
        {"code": "التماثل المنقذ", "de": "ich machte = er machte · ich ging = er ging", "ar": "الأول والثالث واحد دائماً — احفظ نصف الجدول"},
        {"code": "الشاذّ الثلاثي", "de": "gehen – ging – gegangen", "ar": "ثلاثة أعمدة تُحفَظ كاسمٍ واحد لا كقاعدة"},
    ],
    "gramIds": ["a2-praeteritum", "a1-war-hatte"],
    "warnung": "الخلط بين الشفوي والكتابي ليس خطأً نحوياً بل خطأ أسلوب — وفي امتحان Schreiben يُحسب عليك.",
}

# ══════════════ الإدراج مع الحفاظ على الترتيب ══════════════
g = json.load(open(G, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
out = collections.OrderedDict()
inserted = []
for k, v in g.items():
    if k == "a1-praesens":
        out["a1-war-hatte"] = war_hatte; inserted.append("a1-war-hatte")
    if k == "a2-perfekt":
        out["a2-praeteritum"] = praeteritum; inserted.append("a2-praeteritum")
    out[k] = v
json.dump(out, open(G, "w", encoding="utf8"), ensure_ascii=False, indent=1)

e = json.load(open(E, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
e.append(bruecke_war); e.append(bruecke_praet)
json.dump(e, open(E, "w", encoding="utf8"), ensure_ascii=False, indent=1)

print(f"✔ أُضيف الدرسَان: {inserted}")
print(f"✔ دروس القواعد الآن: {len(out)}")
print(f"✔ التركات الآن: {len(e)}")
print(f"✔ تمارين الدرسَين: {len(war_hatte['exercises'])} + {len(praeteritum['exercises'])} = {len(war_hatte['exercises'])+len(praeteritum['exercises'])}")
print(f"✔ فخاخ الدرسَين: {len(war_hatte['pitfalls'])} + {len(praeteritum['pitfalls'])} = {len(war_hatte['pitfalls'])+len(praeteritum['pitfalls'])}")
