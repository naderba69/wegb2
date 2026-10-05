# -*- coding: utf-8 -*-
"""مولِّدُ بنكِ التركات (Eselsbrücken) — يُنفَّذُ مرةً واحدة، غيرُ idempotent."""
import json, os, re, sys
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if os.path.exists("content/eselsbruecken.json"):
    sys.exit("القرصُ فيه بنكٌ سلفاً — لا تُعِدِ التشغيل")

gram = json.load(open("content/grammar.json", encoding="utf8"))
E = []
def add(id, emoji, sek, level, titleAr, storyAr, rows, gramIds, warnung=None):
    E.append({"id": id, "emoji": emoji, "sektion": sek, "level": level, "titleAr": titleAr,
              "storyAr": storyAr, "zeilen": rows, "gramIds": gramIds,
              **({"warnung": warnung} if warnung else {})})

R = lambda code, de, ar: {"code": code, "de": de, "ar": ar}

# ═════════ ① جنسُ الأسماء ═════════
add("gen-der", "🟥", "genus", "A1", "المذكر der ➔ شفرة «أحمد في مَشْغَلْ تَنّ»",
    "المذكرُ رجلٌ شقيٌّ يعملُ في ورشةٍ (مَشْغَلْ) وتعبانُ جداً حتى (تَنّ) — أصابَهُ الإعياء. كلُّ حرفٍ من «مَشْغَلْ تَنّ» نهايةُ اسمٍ مذكَّر.",
    [R("م → -ismus", "der Optimismus", "التفاؤل — كلُّ المذاهبِ والمبادئِ مذكَّرة"),
     R("ش → -er", "der Lehrer", "المعلّم — وكلُّ أسماءِ الفاعلِ والوظائف"),
     R("غ → -ig", "der Honig", "العسل"),
     R("ل → -ling", "der Schmetterling", "الفراشة — و der Lehrling المتدرّب"),
     R("ت → -ant", "der Praktikant", "المتدرّب — و der Demonstrant"),
     R("ن → -ner", "der Rentner", "المتقاعد — و der Gärtner البستاني")],
    ["a1-akkusativ", "a2-dativ", "b1-genitiv"],
    "الاستثناءُ المشهور: das Mädchen مؤنثٌ في المعنى محايدٌ في الأداةِ لأنَّ -chen تغلبُ كلَّ شيء.")

add("gen-die", "🟥", "genus", "A1", "المؤنث die ➔ شفرة «شَفَقْ البنتُ التعيسةُ نَزّت تِيهْ»",
    "فتاةٌ اسمُها (شَفَقْ)، حظُّها (تَعْسٌ)، جُرِحَت في المكتبةِ فـ(نَزّت) دماً وصاحت (تِيهْ) من الألم.",
    [R("ش → -schaft", "die Freundschaft", "الصداقة"),
     R("ف → -heit / -keit", "die Freiheit · die Möglichkeit", "الحرية · الإمكانية"),
     R("ق → -ung", "die Zeitung", "الجريدة — أوسعُ نهايةٍ مؤنثةٍ على الإطلاق"),
     R("ت → -tät", "die Universität", "الجامعة"),
     R("ع → -ei", "die Bäckerei", "المخبز"),
     R("س → -ion", "die Situation", "الموقف — و die Nation و die Religion"),
     R("ن → -ik", "die Musik", "الموسيقى"),
     R("ز → -enz / -anz", "die Existenz · die Eleganz", "الوجود · الأناقة"),
     R("تِيهْ → -thek", "die Bibliothek", "المكتبة")],
    ["a1-akkusativ", "a2-dativ", "b1-genitiv"],
    "فخُّ B2: der Brei استثناءُ -ei الوحيدُ الشهير، و das Ei (البيضة) ليست نهايةً بل كلمةً كاملة.")

add("gen-das", "🟥", "genus", "A1", "المحايد das ➔ شفرة «تَمْ حُبْ أُومَا»",
    "المحايدُ كائنٌ باردٌ لا يتدخَّلُ بين المذكرِ والمؤنث؛ سُئِلَ عن مشاعرِه فقال: «تَمْ حُبْ أُومَا» — أي تمَّ حبُّ الجدّةِ (Oma) فقط!",
    [R("ت → -tum", "das Eigentum", "الملكية — واستثناؤُهُ der Reichtum"),
     R("م → -ment", "das Dokument", "الوثيقة"),
     R("ح → -chen", "das Mädchen", "الفتاة — التصغيرُ يَمحو الجنسَ الأصليَّ محواً"),
     R("ب → -lein", "das Fräulein", "الآنسة — تصغيرٌ أيضاً"),
     R("أُو → -um", "das Zentrum", "المركز — و das Museum"),
     R("مَا → -ma", "das Klima", "المناخ — و das Thema و das Drama")],
    ["a1-akkusativ", "a2-dativ", "b1-genitiv"])

# ═════════ ② الروابطُ وموقعُ الفعل ═════════
add("satz-pos0", "🟩", "satzbau", "A2", "روابطُ المركزِ (0) ➔ «أَدُوسْ فُونْ دِا — روابطُ طيّبةٌ ما لهاش في المشاكل»",
    "شخصٌ اسمُه «أدوس» يرتدي ماركةَ «فون دا»: روابطُ مسالمةٌ لا تُحرِّكُ شيئاً — يأتي بعدَها الفاعلُ فوراً ويبقى الفعلُ المصرَّفُ في مركزِه الثاني الطبيعيّ.",
    [R("A", "aber", "لكن"), R("D", "denn", "لأنَّ — وهي سببٌ بلا شوطٍ للفعل، بعكس weil"),
     R("U", "und", "و"), R("S", "sondern", "بل"), R("O", "oder", "أو"),
     R("+", "nicht nur … sondern auch", "ليس فقط… بل أيضاً")],
    ["b1-konnektoren", "a2-weil-dass"],
    "Denn و weil كلاهما «لأنّ» — لكنَّ denn تتركُ الفعلَ مكانَه و weil تركلُه إلى الآخر. هذا أشهرُ فخٍّ عربيٍّ في A2.")

add("satz-pos1", "🟩", "satzbau", "B1", "روابطُ المركزِ (1) ➔ «عصابةُ دَادْوَازْ — بلطجيةُ القواعد»",
    "روابطُ DADWAS عصابةٌ: بمجرَّدِ دخولِها تطردُ الفاعلَ من الكرسيِّ الأول وتجلسُ مكانَه، فيقفزُ الفعلُ المصرَّفُ خلفَها مباشرةً في المركزِ الثاني، ويهربُ الفاعلُ إلى الثالث.",
    [R("D", "deshalb / darum / deswegen", "لذلك — النتيجة"),
     R("A", "allerdings", "على أنَّ — تحفُّظ"),
     R("D", "dann", "ثمَّ — التتابع"),
     R("W", "trotzdem", "ومع ذلك — التناقض"),
     R("A", "andererseits", "من ناحيةٍ أخرى"),
     R("S", "sonst", "وإلّا")],
    ["b1-konnektoren"],
    "الميزانُ الذهبي: Deshalb komme ich nicht ✓ — وليس Deshalb ich komme ✗.")

add("satz-ende", "🟩", "satzbau", "A2", "الفعلُ في الآخر ➔ «weil و dass يَشوتانِ الكرةَ لآخرِ الملعب»",
    "لاعبانِ عنيفانِ في الدوري الألماني: أوَّلَ ما تلمحُ رابطاً يبدأُ بـ W (weil, wenn, obwohl, während) أو ينتهي بـ dass (dass, sodass, damit)، فاعلمْ أنَّهُ ركلَ الفعلَ المصرَّفَ حتى قبعَ آخرَ كلمةٍ قبلَ النقطة.",
    [R("weil", "Ich bleibe zu Hause, weil ich krank bin.", "أبقى في البيتِ لأنّي مريض — bin في الآخر"),
     R("dass", "Ich hoffe, dass du kommst.", "آمُلُ أن تأتي"),
     R("obwohl", "Obwohl es regnet, gehe ich.", "رغمَ أنَّها تُمطر — لاحظ: الجملةُ الفرعيةُ أولاً فالفعلُ الرئيسُ يليها فوراً"),
     R("wenn", "Wenn ich Zeit habe, rufe ich an.", "إن توفَّرَ وقتي اتصلتُ")],
    ["a2-weil-dass", "b1-relativ"],
    "إذا تصدَّرتِ الجملةُ الفرعيةُ، صارَ الفعلانِ متجاورَينِ يتقابلانِ عندَ الفاصلة: …, gehe ich.")

# ═════════ ③ الظروفُ وحروفُ الجر ═════════
add("praep-tekamolo", "🟦", "praeposition", "B1", "ترتيبُ الظروف ➔ «تِيكَامُولُو — المحقِّقُ اليابانيُّ الصارم»",
    "محقِّقٌ يابانيٌّ صارمٌ اسمُه TeKaMoLo يقفُ في الجملة؛ إذا اجتمعَ الزمانُ والسببُ والطريقةُ والمكانُ صرخَ ورتَّبَهم إجبارياً.",
    [R("Te — Temporal", "heute · um acht", "متى؟ الزمنُ أولاً دائماً"),
     R("Ka — Kausal", "wegen des Regens", "لماذا؟ السبب"),
     R("Mo — Modal", "mit dem Auto", "كيف؟ الطريقةُ والوسيلة"),
     R("Lo — Lokal", "nach Berlin", "أين/إلى أين؟ المكانُ آخراً"),
     R("مثالٌ جامع", "Ich fahre heute wegen des Termins mit dem Auto nach Berlin.", "أسافرُ اليومَ بسببِ الموعدِ بالسيارةِ إلى برلين")],
    ["a1-praesens", "b1-konnektoren"])

add("praep-akk", "🟦", "praeposition", "A1", "حروفُ النصبِ دائماً ➔ «فُودْغَبْ — بوجي طحن طماطم»",
    "وحشٌ مضحكٌ يعشقُ النصبَ فينصبُ على كلِّ كلمةٍ تمرُّ به ويحوِّلُ أداةَ المذكَّرِ إلى den.",
    [R("F", "für", "لأجل — für den Vater"), R("U", "um", "حول — um den Tisch"),
     R("D", "durch", "عبر — durch den Park"), R("G", "gegen", "ضدّ — gegen den Wind"),
     R("E", "entlang", "على طول — تأتي بعدَ الاسمِ: die Straße entlang"),
     R("B", "bis", "حتى — bis nächsten Montag")],
    ["a1-akkusativ"])

add("praep-dat", "🟦", "praeposition", "A2", "حروفُ الجرِّ دائماً ➔ «بِمْزُو نَامْجِش — الجدُّ العجوزُ الكسلان»",
    "جدٌّ كسلانُ يجرُّ كلَّ اسمٍ فيُقعِدُهُ في الداتيف ولا يسمحُ له بالحركة.",
    [R("بِ", "bei", "عند — bei dem (beim) Arzt"), R("مْ", "mit", "مع — mit dem Bus"),
     R("زُو", "zu", "إلى — للأشخاصِ والأماكنِ المحدَّدة: zu dem (zum) Bahnhof"),
     R("نَا", "nach", "إلى الدولِ والمدنِ بلا أداة / وبعدَ: nach dem Essen"),
     R("أَ", "aus", "من داخلِ مكانٍ مغلقٍ أو من بلد: aus der Türkei"),
     R("مْ", "von", "من — للملكيةِ أو المصدر: von dem (vom) Chef"),
     R("جِ", "gegenüber", "مقابل — تأتي غالباً بعدَ الاسم"),
     R("ش", "seit", "منذُ — seit einem Jahr")],
    ["a2-dativ"],
    "الإدغامُ الإلزاميُّ عملياً: zu dem → zum · zu der → zur · bei dem → beim · von dem → vom.")

add("praep-gen", "🟦", "praeposition", "B1", "حروفُ المضافِ إليه ➔ شفرة «وِتْشْ زِبْ» (WTSZ)",
    "أربعةُ حروفٍ أرستقراطيةٍ لا ترضى إلا بالـ Genitiv — وهي علامةُ اللغةِ المكتوبةِ الراقيةِ في B2.",
    [R("W", "wegen", "بسبب — wegen des Wetters"), R("T", "trotz", "بالرغم من — trotz des Regens"),
     R("S", "statt / anstatt", "بدلاً من — statt des Autos"),
     R("Z", "zufolge / während", "وفقاً لـ / أثناء — während des Unterrichts")],
    ["b1-genitiv"],
    "في العاميةِ المحكيةِ تسمعُ wegen dem Wetter بالداتيف — مقبولٌ نُطقاً، مرفوضٌ في الامتحانِ المكتوب.")

add("praep-wechsel", "🟦", "praeposition", "A2", "الحروفُ المشتركة ➔ «الأكوزاتيف نَطَّاط والداتيف قاعدٌ مرتاح»",
    "تسعةُ حروفٍ ذاتُ وجهين: تخيَّلِ الأكوزاتيف شخصاً حركياً ينطُّ من مكانٍ إلى مكان (Wohin؟ إلى أين)، والداتيف بديناً جالساً على الأريكةِ لا يتحرَّك (Wo؟ أين).",
    [R("Wohin? ➔ Akk", "Ich hänge das Bild an die Wand.", "أُعلِّقُ الصورةَ على الحائط — حركةٌ وانتقال"),
     R("Wo? ➔ Dat", "Das Bild hängt an der Wand.", "الصورةُ معلَّقةٌ على الحائط — سكونٌ وثبات"),
     R("التسعة", "an · auf · hinter · in · neben · über · unter · vor · zwischen", "احفظها زوجاً زوجاً بالصورةِ لا بالقائمة"),
     R("الفخُّ الكلاسيكي", "in die Schule gehen ≠ in der Schule sein", "الذهابُ حركةٌ والكينونةُ سكون")],
    ["a2-wechsel"])

add("praep-ausser-ohne", "🟦", "praeposition", "A2", "الاستثناء ➔ قاعدةُ «مِقصُّ الـ إي والـ أُو»",
    "حرفانِ متجاوِرانِ في المعنى متضادَّانِ في الإعراب — احفظهما كقصٍّ واحد.",
    [R("außer", "außer dem Chef", "باستثناء — Dativ دائماً"),
     R("ohne", "ohne den Schlüssel", "بدون — Akkusativ دائماً"),
     R("الذاكرةُ الصوتية", "außer → ـر تجرُّ · ohne → ـه تنصب", "اربطِ النغمةَ بالحالةِ فلا تخلط")],
    ["a2-dativ", "a1-akkusativ"])

# ═════════ ④ عُقدُ A2–B1 ═════════
add("perf-sein", "🟨", "verb", "A2", "الماضي التام ➔ قاعدةُ «الهروبِ من الأريكة»",
    "كلُّ الأفعالِ تأخذُ haben لأنَّ الأصلَ كسل؛ ولا يأخذُ sein إلا فعلٌ أجبرَكَ على الهروبِ من الأريكة: إمَّا انتقالُ الجسمِ من نقطةٍ إلى نقطة، وإمّا تغيُّرٌ بيولوجيٌّ جذريٌّ في الحالة.",
    [R("① انتقالٌ مكاني", "gehen · fahren · fliegen · kommen", "ich bin gegangen — الجسمُ غادرَ موضعَه"),
     R("② تغيُّرُ حالة", "sterben · einschlafen · aufstehen · aufwachen", "er ist eingeschlafen — الحالةُ انقلبَت"),
     R("③ الشاذّان", "sein · bleiben", "ich bin gewesen · ich bin geblieben — احفظهما استثناءً خالصاً"),
     R("الباقي كلُّه haben", "tanzen · spielen · arbeiten", "ich habe getanzt — حركةٌ موضعيةٌ لا انتقال")],
    ["a2-perfekt"],
    "الفخُّ: fahren بمفعولٍ به يصيرُ haben — Ich habe das Auto gefahren (قُدتُ السيارة) مقابل Ich bin nach Köln gefahren.")

add("refl-dativ", "🟨", "verb", "A2", "الضمائرُ الانعكاسية ➔ «المفعولُ الأنانيُّ يطردُ الأكوزاتيف»",
    "الضميرُ الانعكاسيُّ يعشقُ الأكوزاتيف (mich)؛ فإذا دخلَ مفعولٌ به صريحٌ آخرُ (die Hände) تصرَّفَ بأنانيةٍ وطردَهُ وأخذَ مكانَه، فبكى الانعكاسيُّ وتحوَّلَ مضطراً إلى الداتيف (mir).",
    [R("وحدَه ➔ Akk", "Ich wasche mich.", "أغسلُ نفسي"),
     R("مع مفعولٍ صريح ➔ Dat", "Ich wasche mir die Hände.", "أغسلُ يديَّ — الأيدي أخذتِ النصبَ فانزاحَ الضمير"),
     R("نظائرُ يوميّة", "sich die Zähne putzen · sich die Haare kämmen", "كلُّ ما يخصُّ الجسدَ بجزءٍ مذكورٍ يمشي على القاعدة")],
    ["a2-reflexiv"])

add("adj-chef", "🟨", "adjektiv", "B1", "تصريفُ الصفات ➔ «إذا حضرَ المديرُ تقشَّفَ الموظفون!»",
    "أداةُ التعريفِ هي المديرُ القويُّ للشركة. إن كان المديرُ واقفاً في الجملةِ خافَ الموظفون (الصفات) وتقشَّفوا فأخذوا نهايةً ضعيفةً (e أو en) فقط. وإن غابَ المديرُ اضطرَّتِ الصفةُ أن تلبسَ بدلتَهُ وتأخذَ نهايتَهُ القوية.",
    [R("المديرُ حاضر ➔ ضعيف", "der gute Mann · den guten Mann", "e في المرفوعِ المفرد، و en فيما عداه غالباً"),
     R("المديرُ غائب ➔ قوي", "guter Mann · gutes Kind · gute Frau", "الصفةُ تحملُ علامةَ الأداةِ الغائبة"),
     R("المديرُ نصفُ حاضر ➔ مختلط", "ein guter Mann · ein gutes Kind", "ein لا تُظهرُ الجنسَ فتكمِّلُهُ الصفة")],
    ["b1-adjektivendungen", "b1-unbestimmte"],
    "القاعدةُ الحاكمة: علامةُ الجنسِ يجبُ أن تظهرَ مرةً واحدةً في المجموعة — إمّا على الأداةِ وإمّا على الصفة.")

add("sondern-aber", "🟨", "satzbau", "A2", "النفيُ الصارم ➔ Sondern مقابل Aber",
    "لا تستعملْ sondern (بل) إلا إذا كانت الجملةُ قبلَها تحملُ نفياً صريحاً (nicht أو kein) وجاءت لتصحيحِ ما نُفي. وإن لم يكن ثمَّةَ نفيٌ فالجوابُ aber تلقائياً.",
    [R("نفيٌ + تصحيح ➔ sondern", "Das ist kein Tee, sondern Kaffee.", "ليس شاياً بل قهوة"),
     R("بلا نفي ➔ aber", "Der Tee ist heiß, aber gut.", "الشايُ ساخنٌ لكنَّهُ جيّد"),
     R("الفخُّ العربي", "✗ Das ist kein Tee, aber Kaffee.", "العربيةُ تقولُ «لكن» في الموضعين، والألمانيةُ تفرِّق")],
    ["a2-negation", "b1-konnektoren"])

add("nicht-magnet", "🟨", "satzbau", "A2", "موقعُ النفي ➔ «مغناطيسُ المؤخّرة»",
    "تميلُ nicht بطبعِها إلى نهايةِ الجملة، إلا أن يجذبَها مغناطيسٌ أقوى فتقفَ قبلَهُ مباشرةً لتنفيَهُ وحدَه.",
    [R("الأصل: آخرُ الجملة", "Ich kenne den Mann nicht.", "لا أعرفُ الرجل — نفيٌ كليّ"),
     R("مغناطيس ①: الصفة", "Das Auto ist nicht teuer.", "قبلَ الصفةِ مباشرة"),
     R("مغناطيس ②: حرفُ الجر", "Ich gehe nicht ins Kino.", "قبلَ العبارةِ الجارَّة"),
     R("مغناطيس ③: الفعلُ الثاني", "Ich kann heute nicht kommen.", "قبلَ المصدرِ في الآخر"),
     R("النفيُ الجزئي", "Ich fahre nicht heute, sondern morgen.", "ضعْ nicht أمامَ ما تنفيهِ بالضبط")],
    ["a2-negation"])

# ═════════ ⑤ صرامةُ B2 ═════════
add("da-wo", "🟧", "b2", "B2", "دمجُ حروفِ الجر ➔ شفرةُ «الجمادِ والعاقل»",
    "السؤالُ الوحيدُ قبلَ الدمج: أعاقلٌ هو أم جماد؟ الجمادُ يُدمَج، والإنسانُ يُصانُ عن الدمجِ صيانةً تامّة.",
    [R("جماد ➔ دمج", "Ich warte darauf. · Worauf wartest du?", "أنتظرُه (الشيء) — da+r+auf و wo+r+auf"),
     R("عاقل ➔ فصل", "Ich warte auf dich. · Auf wen wartest du?", "أنتظرُكَ أنت — يُمنَعُ الدمجُ منعاً"),
     R("حرفُ الوصلِ r", "darauf · daran · worüber", "يُقحَمُ r إذا بدأَ الحرفُ بحركة")],
    ["b1-verb-praeposition"])

add("werden-3", "🟧", "b2", "B2", "فعلُ التحوُّل ➔ «المُشَكِّلُ اللغويُّ werden»",
    "werden وحدَهُ لا معنى له؛ معناهُ تحدِّدُهُ الكلمةُ الأخيرةُ في الجملة. انظرْ إلى ذيلِ الجملةِ تعرفْ رأسَها.",
    [R("+ اسم/صفة = يُصبح", "Ich werde Arzt.", "سأصيرُ طبيباً"),
     R("+ مصدرٌ في الآخر = المستقبل", "Ich werde reisen.", "سأسافر"),
     R("+ تصريفٌ ثالثٍ في الآخر = مجهول", "Das Auto wird repariert.", "تُصلَّحُ السيارة"),
     R("+ worden = مجهولُ الماضي", "Das Auto ist repariert worden.", "لاحظ worden لا geworden في المجهول")],
    ["a2-futur", "b1-passiv", "b2-futur-ii"])

add("passiv-ersatz", "🟧", "b2", "B2", "بدائلُ المجهول ➔ شفرةُ «الـ bar والـ zu»",
    "المصحِّحُ يملُّ تكرارَ wird … worden؛ فبدِّلْ صيغتَكَ مرتَينِ في المقالِ الواحدِ تقفزْ درجة.",
    [R("① -bar", "Der Schaden ist reparierbar.", "قابلٌ للإصلاح — صفةٌ من الفعل"),
     R("② sein + zu", "Die Aufgabe ist zu lösen.", "يجبُ/يمكنُ حلُّها — إلزامٌ أو إمكان"),
     R("③ sich lassen", "Das lässt sich machen.", "يمكنُ عملُه — الأكثرُ محكيةً"),
     R("④ man", "Man repariert das Auto.", "أبسطُ بديلٍ وأسلمُه في A2/B1")],
    ["b1-passiv"])

add("doppel", "🟧", "b2", "B2", "الروابطُ الثنائية ➔ قالبُ «النفيِ والإثباتِ الرياضي»",
    "أربعُ معادلاتٍ تُحفَظُ كالجدولِ الرياضي؛ كلُّ واحدةٍ تُغنيكَ عن جملتَينِ ركيكتَين.",
    [R("إثبات + إثبات", "sowohl … als auch", "هذا وذاك"),
     R("تصعيد", "nicht nur … sondern auch", "ليس هذا فحسب بل ذاك أيضاً"),
     R("تخيير", "entweder … oder", "إمّا هذا أو ذاك"),
     R("نفيٌ مزدوجٌ قاطع", "weder … noch", "لا هذا ولا ذاك — بلا nicht إضافيّة أبداً"),
     R("إثباتٌ بتحفُّظ", "zwar … aber", "صحيحٌ أنَّ… لكن")],
    ["b2-doppelkonnektoren"])

add("pron-order", "🟧", "b2", "B1", "ترتيبُ المفعولَين ➔ «الضميرُ يسبقُ دائماً»",
    "قاعدةٌ ذاتُ شقَّين لا ثالثَ لهما: الأسماءُ الصريحةُ تمشي داتيف ثمَّ أكوزاتيف؛ فإذا صارَ أحدُهما ضميراً قفزَ الضميرُ إلى الأمام.",
    [R("اسمانِ صريحان", "Ich gebe dem Mann das Buch.", "داتيف ← أكوزاتيف"),
     R("الأكوزاتيفُ ضمير", "Ich gebe es dem Mann.", "الضميرُ es قفزَ أولاً"),
     R("كلاهما ضمير", "Ich gebe es ihm.", "أكوزاتيف ← داتيف — الترتيبُ انعكسَ تماماً")],
    ["a2-dativ"])

add("gen-es-s", "🟧", "b2", "B1", "جينيتيفُ المذكرِ والمحايد ➔ شفرةُ «الـ es والـ s»",
    "متى -es ومتى -s؟ اللسانُ هو الحكم: ما ثقُلَ نطقُهُ أخذَ es ليستريح.",
    [R("-es للقصير", "des Mannes · des Kindes", "مقطعٌ واحدٌ فيستدعي حركةَ وصل"),
     R("-es لأصواتِ الصفير", "des Hauses · des Platzes", "بعدَ s, ss, ß, z, x إلزاماً"),
     R("-s للطويل", "des Computers · des Lehrers", "مقطعانِ فأكثر"),
     R("المؤنثُ لا يتغيَّر", "der Frau", "الاسمُ المؤنثُ يبقى عارياً — الأداةُ وحدَها تتحوَّل")],
    ["b1-genitiv"])

add("trotz-3", "🟧", "b2", "B1", "التناقضُ الثلاثيّ ➔ Trotz / Obwohl / Trotzdem",
    "ثلاثُ كلماتٍ بمعنًى واحدٍ وثلاثةُ سلوكياتٍ نحويةٍ مختلفة — وهذا بالضبط ما يُمتحَنُ فيه.",
    [R("Trotz + اسم", "Trotz des Regens gehe ich.", "حرفُ جرٍّ يليهِ اسمٌ في الجينيتيف"),
     R("Obwohl + جملة", "Obwohl es regnet, gehe ich.", "رابطٌ فرعيٌّ يركلُ الفعلَ إلى الآخر"),
     R("Trotzdem + فعل", "Es regnet. Trotzdem gehe ich.", "ظرفُ ربطٍ فالفعلُ بعدَهُ مباشرةً في المركزِ الثاني")],
    ["b1-konnektoren", "b1-genitiv"])

add("nominal", "🟧", "b2", "B2", "الأسماءُ المشتقة ➔ قاعدةُ «الـ das الكبرى»",
    "أسرعُ طريقٍ لنبرةٍ أكاديمية: خذِ الفعلَ في المصدر، اكتبْ حرفَهُ الأولَ كبيراً، وضعْ das أمامَه — صارَ اسماً محايداً رصيناً.",
    [R("القاعدة", "lernen → das Lernen", "التعلُّم — وكلُّ مصدرٍ محايدٌ بلا استثناء"),
     R("في جملة", "Das Rauchen ist verboten.", "التدخينُ ممنوع"),
     R("مع حرفِ جر", "beim Lesen · zum Schreiben", "أثناءَ القراءةِ · للكتابة"),
     R("مقابلُ الركاكة", "Das Lesen von Büchern bildet.", "أرقى من: Bücher zu lesen bildet")],
    ["b2-infinitiv"])

add("partizip", "🟧", "b2", "B2", "صفاتُ الحدث ➔ شفرةُ «الـ d والـ t»",
    "حرفانِ يفصلانِ بين ما يجري الآنَ وما انتهى: d للجاري، t للمنتهي.",
    [R("Partizip I — جارٍ", "das weinende Kind", "الطفلُ الباكي — مصدر + d + نهايةُ الصفة"),
     R("Partizip II — منتهٍ", "das gekaufte Auto", "السيارةُ المشتراة — تصريفٌ ثالثٌ + نهايةُ الصفة"),
     R("الفاعليةُ والمفعولية", "der lesende Mann ≠ das gelesene Buch", "الأولُ يفعل، والثاني وقعَ عليه الفعل"),
     R("الجملةُ الموسَّعة", "das gestern gekaufte Auto", "بنيةُ B2 الصارمةُ في النصوصِ المكتوبة")],
    ["b2-partizip"])

add("innen", "🟧", "b2", "A2", "فخُّ جمعِ المؤنثِ الوظيفي ➔ شفرةُ «الـ nen»",
    "كلُّ مؤنثٍ وظيفيٍّ ينتهي بـ -in يُضاعِفُ النونَ أولاً قبلَ الجمع؛ تذكّرْ كتابةَ النونِ مرتين في صيغةِ الجمع.",
    [R("القاعدة", "die Lehrerin → die Lehrerinnen", "المعلّمة → المعلّمات"),
     R("نظائر", "die Ärztin → die Ärztinnen · die Studentin → die Studentinnen", "الطبيبات · الطالبات"),
     R("الصيغةُ الرسميةُ الحديثة", "Kolleginnen und Kollegen", "افتتاحيةُ كلِّ خطابٍ رسميٍّ ألمانيّ")],
    ["a1-akkusativ"])

# ═════════ ⑥ الأمثال ═════════
SPR = [
 ("spr-morgenstunde","Morgenstunde hat Gold im Munde","الصباحُ شاحذٌ للهمم","الظرفُ في المركزِ الأول والفعلُ المصرَّفُ hat في المركزِ الثاني — قاعدةُ الانقلابِ مجسَّدةً في مثل.","A1",["a1-praesens"]),
 ("spr-grube","Wer anderen eine Grube gräbt, fällt selbst hinein","من حفرَ حفرةً لأخيهِ وقعَ فيها","أداةُ Wer شحنَتِ الفعلَ gräbt إلى آخرِ جملتِها، ثمَّ جاءَ الفعلُ الرئيسُ fällt فوراً بعدَ الفاصلة.","B1",["b2-relativ-generalisierend","a2-weil-dass"]),
 ("spr-regen","Nach dem Regen scheint die Sonne","بعدَ الضيقِ الفرج","حرفُ nach يجرُّ بالداتيف فتحوَّلَ der Regen إلى dem Regen.","A2",["a2-dativ"]),
 ("spr-fleiss","Ohne Fleiß kein Preis","من طلبَ العُلا سهرَ الليالي","حرفُ ohne ينصبُ دائماً — والنفيُ kein جاءَ في محلِّ النصب.","A2",["a1-akkusativ","a2-negation"]),
 ("spr-brot","Altes Brot ist nicht hart","الخبزُ الجافُّ نعمة","غابَ المديرُ (لا أداةَ تعريف) فأخذتِ الصفةُ نهايةَ المحايدِ القويةَ -es.","B1",["b1-adjektivendungen"]),
 ("spr-spaet","Besser spät als nie","أن تصلَ متأخراً خيرٌ من ألّا تصلَ أبداً","صيغةُ التفضيلِ besser تليها أداةُ المقارنةِ للاختلافِ als لا wie.","A2",["a2-steigerung"]),
 ("spr-rom","Rom wurde nicht an einem Tag gebaut","روما لم تُبنَ في يوم","مجهولُ الماضي: wurde في المركزِ الثاني والتصريفُ الثالثُ gebaut في آخرِ الجملة.","B1",["b1-passiv"]),
 ("spr-reden","Reden ist Silber, Schweigen ist Gold","إذا كانَ الكلامُ من فضةٍ فالسكوتُ من ذهب","مصدرانِ تحوَّلا إلى اسمَينِ محايدَينِ مرفوعَين — قاعدةُ das الكبرى في مثلٍ شعبيّ.","B2",["b2-infinitiv"]),
]
for i,(sid,de,ar,regel,lvl,gids) in enumerate(SPR,1):
    add(sid, "🟪", "sprichwort", lvl, f"مثلٌ ألمانيٌّ أصيل — {ar}",
        "احفظِ المثلَ تحفظْ قاعدتَه: العربُ يحفظونَ الحكمةَ بالطبع، فلتَركبِ القاعدةُ على ظهرِها.",
        [R("المثل", de, ar), R("القاعدةُ المدمَجة", de, regel)], gids)

# ── حراسةٌ قبلَ الكتابة ──
ids = [e["id"] for e in E]
assert len(ids) == len(set(ids)), "ازدواجُ معرّفات"
gk = set(gram.keys())
for e in E:
    assert e["gramIds"], e["id"] + " بلا درسٍ مضيف"
    for g in e["gramIds"]:
        assert g in gk, f"{e['id']} يشيرُ إلى درسٍ غيرِ موجود: {g}"
    assert e["zeilen"], e["id"]
    for z in e["zeilen"]:
        assert z["de"] and z["ar"] and z["code"], e["id"]
        assert re.search(r"[\u0600-\u06ff]", z["ar"]), e["id"]
    assert re.search(r"[\u0600-\u06ff]", e["storyAr"]) and re.search(r"[\u0600-\u06ff]", e["titleAr"])
    assert not re.search(r"[\u4e00-\u9fff\u3040-\u30ff]", json.dumps(e, ensure_ascii=False)), "CJK!"
json.dump(E, open("content/eselsbruecken.json","w",encoding="utf8"), ensure_ascii=False, indent=1)
cov = sorted({g for e in E for g in e["gramIds"]})
print(f"✓ {len(E)} تركة · سطورٌ {sum(len(e['zeilen']) for e in E)} · دروسٌ مغطاة {len(cov)}/{len(gk)}")
print("الأقسام:", {s: sum(1 for e in E if e['sektion']==s) for s in dict.fromkeys(e['sektion'] for e in E)})
