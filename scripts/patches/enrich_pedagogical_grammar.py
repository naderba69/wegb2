import json

grammar = json.load(open("content/grammar.json"))

# 1. a1-pronomen: إضافة أدوات الملكية (Possessivartikel)
if "a1-pronomen" in grammar:
    p = grammar["a1-pronomen"]
    p["titleDe"] = "Personalpronomen & Possessivartikel"
    p["titleAr"] = "ضمائر الفاعل وأدوات الملكية (mein, dein ...)"
    p["summaryAr"] = "ضمائر الفاعل تعوض الأسماء، وأدوات الملكية تُبين ملكية الأشياء وتتبع الاسم المعدود في الجنس والإعراب."
    
    # تحديث القواعد
    p["rules"] = [
        {"de": "ich, du, er/sie/es, wir, ihr, sie/Sie", "ar": "ضمائر الفاعل تعوّض الاسم وتُصرَّف الأفعال بحسبها في حالة الرفع Nominativ."},
        {"de": "Possessivartikel im Nominativ: mein, dein, sein, ihr, unser, euer, ihr/Ihr.", "ar": "أدوات الملكية تدل على المالك، وتأخذ النهاية -e مع المؤنث والجمع (meine Tasche / meine Bücher) وبلا نهاية مع المذكر والمحايد (mein Tisch / mein Kind)."},
        {"de": "Possessivartikel im Akkusativ: meinen Vater, meine Mutter, mein Kind, meine Eltern.", "ar": "في حالة النصب Akkusativ تتغير أداة المذكر فقط بإضافة -en (meinen Vater)، بينما تبقى باقي الأدوات كحالة الرفع."}
    ]
    
    # إضافة جدول أدوات الملكية
    p["tables"] = [
        {
            "captionAr": "جدول أدوات الملكية في حالة الرفع (Nominativ)",
            "headers": ["الضمير (المالك)", "المذكر (der)", "المؤنث (die)", "المحايد (das)", "الجمع (die)"],
            "rows": [
                ["ich (أنا)", "mein", "meine", "mein", "meine"],
                ["du (أنتَ/أنتِ)", "dein", "deine", "dein", "deine"],
                ["er / es (هو / محايد)", "sein", "seine", "sein", "seine"],
                ["sie (هي)", "ihr", "ihre", "ihr", "ihre"],
                ["wir (نحن)", "unser", "unsere", "unser", "unsere"],
                ["ihr (أنتم)", "euer", "eure", "euer", "eure"],
                ["sie / Sie (هم / حضرتك)", "ihr / Ihr", "ihre / Ihre", "ihr / Ihr", "ihre / Ihre"]
            ]
        }
    ]

# 2. a1-praesens: إضافة بناء السؤال (W-Fragen & Ja/Nein-Fragen)
if "a1-praesens" in grammar:
    pr = grammar["a1-praesens"]
    pr["titleDe"] = "Präsens & Satzbau der Fragen"
    pr["titleAr"] = "المضارع وبناء الجملة الاستفهامية (W-Fragen & Ja/Nein)"
    pr["summaryAr"] = "تصريف الأفعال في الحاضر وقواعد ترتيب الجملة: الفعل دائماً في المركز 2 في الجملة الخبرية وسؤال W-Frage، وفي المركز 1 في سؤال نعم/لا."
    
    pr["rules"] = [
        {"de": "machen: ich mache · du machst · er macht · wir machen · ihr macht · sie machen.", "ar": "التصريف القياسي للأفعال في المضارع بإضافة النهايات: -e, -st, -t, -en, -t, -en."},
        {"de": "Stammvokalwechsel nur bei du & er/es: a→ä, e→i, e→ie.", "ar": "تغير حرف العلة في جذر الفعل القوي يحدث فقط مع الضميرين du و er/es (مثل: fährst, liest)."},
        {"de": "W-Frage: Fragewort + Verb (Position 2) + Subjekt: Wo wohnen Sie? Was machst du?", "ar": "السؤال بأداة استفهام: أداة الاستفهام أولاً، ثم الفعل المصرف في المركز الثاني دائماً."},
        {"de": "Ja/Nein-Frage: Verb (Position 1) + Subjekt: Wohnst du in Berlin? Lernst du Deutsch?", "ar": "السؤال الذي يُجاب عنه بنعم أو لا: يبدأ الفعل المصرف في المركز الأول مباشرة ويليه الفاعل."}
    ]
    
    # تحديث وإضافة جدول أدوات الاستفهام
    pr["tables"] = [
        pr.get("tables", [{}])[0] if pr.get("tables") else {"captionAr": "تصريف الأفعال الشاذة", "headers": ["Infinitiv", "du", "er/sie/es"], "rows": [["fahren", "fährst", "fährt"], ["sehen", "siehst", "sieht"], ["lesen", "liest", "liest"]]},
        {
            "captionAr": "أدوات الاستفهام الرئيسية (W-Fragewörter)",
            "headers": ["الأداة", "المعنى والاستخدام", "مثال توضيحي"],
            "rows": [
                ["Wer?", "مَن (للسؤال عن الفاعل العاقل Nominativ)", "Wer ist das?"],
                ["Wen?", "مَن (للسؤال عن المفعول به العاقل Akkusativ)", "Wen suchst du?"],
                ["Was?", "ماذا / ما (لغير العاقل)", "Was machst du heute?"],
                ["Wo?", "أين (للمكان الثابت مع سكون)", "Wo wohnst du?"],
                ["Wohin?", "إلى أين (للاتجاه وحركة الانتقال)", "Wohin fährst du?"],
                ["Woher?", "من أين (للمصدر والأصل والموطن)", "Woher kommst du?"],
                ["Wann?", "متى (للزمن والمواعيد)", "Wann beginnt der Unterricht?"],
                ["Wie?", "كيف (للحال والوصف والاسم)", "Wie heißt du?"],
                ["Warum?", "لماذا (للأسباب والعلل)", "Warum lernst du Deutsch?"]
            ]
        }
    ]

# 3. b1-passiv: توسيع بدائل المبني للمجهول (Passiversatzformen)
if "b1-passiv" in grammar:
    pas = grammar["b1-passiv"]
    pas["titleDe"] = "Passiv, Zustandspassiv & Passiversatzformen"
    pas["titleAr"] = "المبني للمجهول وبدائله الأكاديمية (sein+zu / sich lassen)"
    pas["summaryAr"] = "صياغة المجهول للتركيز على الحدث لا الفاعل، مع بدائله الأكاديمية الراقية المستخدمة في الصحافة والنصوص الرسمية."
    
    pas["rules"] = [
        {"de": "Vorgangspassiv: werden + Partizip II — Das Haus wird gebaut.", "ar": "مجهول الحدث: werden مصرف في المركز الثاني + التصريف الثالث في نهاية الجملة."},
        {"de": "Zustandspassiv: sein + Partizip II — Das Haus ist gebaut.", "ar": "مجهول الحالة: sein مصرف + التصريف الثالث لوصف حالة منتهية ومستقرة."},
        {"de": "von + Dativ (Urheber) · durch + Akkusativ (Mittel/Ursache).", "ar": "الفاعل المحذوف يُذكر اختيارياً مع von للداتيف للفاعل المباشر، أو durch للأكوزاتيف للوسيلة والسبب."},
        {"de": "Passiversatz: sein + zu + Infinitiv = muss/kann gemacht werden.", "ar": "بديل المجهول sein + zu + المصدر: يعبر عن الإلزام أو الإمكانية الأكاديمية (Das Problem ist sofort zu lösen)."},
        {"de": "Passiversatz: sich lassen + Infinitiv = kann gemacht werden.", "ar": "بديل المجهول sich lassen + المصدر: يعبر عن إمكانية حدوث الفعل (Dieser Plan lässt sich leicht umsetzen)."}
    ]
    
    pas["tables"] = [
        {
            "captionAr": "بدائل المبني للمجهول الأكاديمية (Passiversatzformen)",
            "headers": ["التركيب البديل", "المعنى بالمجهول الصريح", "مثال ألماني رسمي"],
            "rows": [
                ["sein + zu + Infinitiv", "muss / kann getan werden", "Der Vertrag ist sofort zu unterschreiben."],
                ["sich lassen + Infinitiv", "kann gemacht werden", "Das Problem lässt sich leicht lösen."],
                ["Adjektiv auf -bar", "kann getrunken/gemacht werden", "Dieses Wasser ist trinkbar."],
                ["Adjektiv auf -lich", "kann verstanden werden", "Seine Sorge ist verständlich."]
            ]
        }
    ]

# 4. b2-modalpartikel: إضافة الاستخدام الذاتي للأفعال الناقصة (Subjektive Modalverben)
if "b2-modalpartikel" in grammar:
    mp = grammar["b2-modalpartikel"]
    mp["titleDe"] = "Modalpartikeln & Subjektive Modalverben"
    mp["titleAr"] = "جسيمات النبرة والمعنى الذاتي للأفعال الناقصة (الافتراض والشائعات)"
    mp["summaryAr"] = "أدوات التلوين الصوتي والوجداني (doch, mal, ja) والمعنى الذاتي للأفعال الناقصة للتعبير عن درجات اليقين والشائعات في B2."
    
    mp["rules"] = [
        {"de": "mal macht die Bitte leichter: Warte mal!", "ar": "mal تجعل الطلب والأمر أكثر وداً ولطفاً: انتظر لحظة!"},
        {"de": "doch verstärkt oder widerspricht freundlich: Das ist doch toll!", "ar": "doch للتأكيد الودي أو التذكير بأمر متفق عليه: هذا رائع حقاً!"},
        {"de": "einfach nimmt der Aufforderung die Schwere: Probier es einfach!", "ar": "einfach تخفف صعوبة الفعل وتشجع على التجربة: جرب فقط!"},
        {"de": "sollen drückt fremde Behauptungen und Gerüchte aus: Er soll sehr reich sein.", "ar": "المعنى الذاتي لـ sollen: نقل ادعاء أو شائعة عن الآخرين (يُقال إنه ثري جداً / قيل عنه)."},
        {"de": "müssen drückt höchste subjektive Sicherheit aus: Das Licht brennt, er muss da sein.", "ar": "المعنى الذاتي لـ müssen: استنتاج بيقين شبه مطلق بناءً على دليل (النور مشتعل، لا بد أنه هناك)."},
        {"de": "dürfte drückt hohe Wahrscheinlichkeit aus: Der Zug dürfte Verspätung haben.", "ar": "المعنى الذاتي لـ dürfte: احتمال راجح بنسبة تفوق 75% (من المرجح أن يتأخر القطار)."}
    ]
    
    mp["tables"] = [
        mp.get("tables", [{}])[0] if mp.get("tables") else {"captionAr": "جسيمات النبرة", "headers": ["Partikel", "Wirkung"], "rows": [["doch", "Verstärkung"], ["mal", "Höflichkeit"]]},
        {
            "captionAr": "المعنى الذاتي للأفعال الناقصة في B2 (Subjektive Modalverben)",
            "headers": ["الفعل الناقص", "درجة الاحتمال والوظيفة الدلالية", "المثال الألماني والشرح"],
            "rows": [
                ["müssen", "يقين استنتاجي 99% (لا مفر منه)", "Er muss krank sein (die Tür ist verschlossen)."],
                ["dürfte", "احتمال راجح 75% (من المرجح جداً)", "Sie dürfte die Prüfung bestanden haben."],
                ["könnte", "إمكانية محتملة 50% (قد يحدث وقد لا)", "Es könnte morgen schneien."],
                ["sollen", "نقل شائعة أو قول شخص آخر (يُقال أن)", "Der Minister soll zurücktreten."]
            ]
        }
    ]

with open("content/grammar.json", "w", encoding="utf-8") as f:
    json.dump(grammar, f, ensure_ascii=False, indent=2)

print("تم بنجاح إثراء دروس القواعد بالمحاور الأربعة البيداغوجية وفق الجرد المعتمد!")
