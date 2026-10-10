#!/usr/bin/env python3
"""
P-02: Add 6 dedicated Aussprache (Pronunciation) units for A0/A1 covering:
  a0-aussprache-vowels   : long/short vowels (e/ä, u/ü, o/ö, ie/i, eh/e)
  a0-aussprache-umlaut   : Umlaute ä/ö/ü phonetics (not just spelling)
  a1-aussprache-ch       : ich-Laut vs ach-Laut (biggest hurdle for Arabic speakers)
  a1-aussprache-r        : German r (front/back, reduced in -er endings)
  a1-aussprache-sch-sp-st: sch / sp / st at start of word
  a1-aussprache-auslaut  : Auslautverhärtung (b/d/g → p/t/k at syllable end)
These are inserted into A0 and A1 PHASE_TOPICS by a separate edit to plan.ts.
"""
import json
from collections import OrderedDict

GRAMMAR = 'content/grammar.json'
with open(GRAMMAR, 'r', encoding='utf-8') as f:
    g = json.load(f, object_pairs_hook=OrderedDict)

new_topics = {
    "a0-aussprache-vowels": OrderedDict([
        ("id", "a0-aussprache-vowels"),
        ("titleDe", "Aussprache: Lange und kurze Vokale"),
        ("titleAr", "نطق الحركات الطويلة والقصيرة"),
        ("level", "A0"),
        ("ziel", "تُميّز بين الحركة الطويلة والقصيرة وتُلاحظ أن الطول يغيّر المعنى (Stadt/Staat، offen/öffnen)."),
        ("voraus", ["a0-buchstaben"]),
        ("anwendung", OrderedDict([
            ("ar", "استمع للمثال وكرّر: Stadt (a قصيرة) / Staat (aa طويلة)؛ offen (o قصيرة) / Ofen (o طويلة)؛ Hütte (ü قصيرة) / Hüte (ü طويلة). سجّل صوتك وقارن."),
            ("de", "Hör zu und wiederhole: Stadt (kurz) / Staat (lang); offen (kurz) / Ofen (lang); Hütte (kurz) / Hüte (lang). Nimm dich auf und vergleiche."),
            ("candoIds", [])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a0-av-v1"),
                ("type", "choice"),
                ("promptDe", "Welches Wort hat ein LANGES a?"),
                ("options", ["Stadt", "Staat", "Satz"]),
                ("answer", ["Staat"]),
                ("explanationAr", "Staat تُنطَق بـ aa طويل (دولة)؛ Stadt a قصيرة (مدينة).")
            ]),
            OrderedDict([
                ("id", "a0-av-v2"),
                ("type", "choice"),
                ("promptDe", "Welches Wort hat ein KURZES i?"),
                ("options", ["ihm", "bin", "ihn"]),
                ("answer", ["bin"]),
                ("explanationAr", "bin i قصيرة (أنا); ihm/ihn بـ ie/ih طويلة.")
            ]),
        ]),
        ("summaryAr", "الحركات الألمانية طويلة أو قصيرة، والطول يُغيّر المعنى: i/ie, e/eh/ee, o/oh, u/uh, ü/üh, ä/äh, ö/öh. قاعدة سريعة: الحرف متبوع بـ h أو مكرر (ie/aa/oo) → طويل؛ الحرف متبوع بعدة حروف ساكنة → قصير غالباً."),
        ("rules", [
            OrderedDict([("de", "lang: ie, ih, ieh, aa, ee, oo, uh, ah, eh, öh, üh"), ("ar", "طويل: إذا تبع الحرفَ h أو جاء مكرراً (aa/ee/oo) أو جاء بعده حرف واحد ساكن.")]),
            OrderedDict([("de", "kurz: vor mehreren Konsonanten (Stadt, offen, Hütte, bin)"), ("ar", "قصير: قبل عدة حروف ساكنة (Stadt Stadt، offen، Hütte، bin).")]),
        ]),
        ("tables", [
            OrderedDict([
                ("captionDe", "Minimalpaare (Bedeutungsunterschied durch Vokallänge)"),
                ("captionAr", "أزواج متشابهة يفرّقها طول الحركة"),
                ("headers", ["kurz", "lang", "Unterschied"]),
                ("rows", [
                    ["Stadt (مدينة)", "Staat (دولة)", "a قصيرة vs aa طويلة"],
                    ["offen (مفتوح)", "Ofen (فرن)", "o قصيرة vs oh طويلة"],
                    ["Hütte (كوخ)", "Hüte (قبعات)", "ü قصيرة vs üh طويلة"],
                    ["bin (أنا)", "Biene (نحلة)", "i قصيرة vs ie طويلة"],
                ])
            ])
        ]),
        ("examples", [
            OrderedDict([("de", "Stadt — Staat"), ("ar", "مدينة — دولة (الطول يُغيّر المعنى)")]),
        ]),
        ("eselsbruecke", "تخيّل الحرف h علامة مطّ (طويل)، كما في العربية: دام vs دامـه."),
    ]),

    "a0-aussprache-umlaut": OrderedDict([
        ("id", "a0-aussprache-umlaut"),
        ("titleDe", "Aussprache: Umlaute ä, ö, ü"),
        ("titleAr", "نطق علامات الإمالة: ä / ö / ü"),
        ("level", "A0"),
        ("ziel", "تُنطِق ä/ö/ü بشكل صحيح، لا تخلط بين u/ü أو o/ö."),
        ("voraus", ["a0-buchstaben", "a0-aussprache-vowels"]),
        ("anwendung", OrderedDict([
            ("ar", "تدرّب أمام المرآة: شفاهك مستديرة قليلاً عند ö، وضيّقة عند ü؛ ä مثل e مفتوحة."),
            ("de", "Übe vor dem Spiegel: Lippen leicht gerundet bei ö, eng bei ü; ä wie offenes e."),
            ("candoIds", [])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a0-au-v1"),
                ("type", "choice"),
                ("promptDe", "Welcher Umlaut klingt wie ein gerundetes \"i\"?"),
                ("options", ["ä", "ö", "ü"]),
                ("answer", ["ü"]),
                ("explanationAr", "ü = i مع استدارة الشفاه (كما في الفرنسية tu أو التركية ü).")
            ]),
        ]),
        ("summaryAr", "ä ≈ e مفتوحة (Männer = مِنَر). ö ≈ e مع استدارة شفاه (hören = هُورِن تقريباً). ü = i مع استدارة الشفاه (Tür = تِيُور تقريباً، أي حرف «u» بالفرنسية)."),
        ("rules", [
            OrderedDict([("de", "ä = offenes e (ähnlich wie \"e\" in \"Bett\")"), ("ar", "ä مثل e مفتوحة (كما في Bett).")]),
            OrderedDict([("de", "ö = e mit runden Lippen"), ("ar", "ö = e ومعها استدارة الشفاه، كأنك تنطق e مع شكل فم o.")]),
            OrderedDict([("de", "ü = i mit runden Lippen (wie frz. \"tu\")"), ("ar", "ü = i ومعها استدارة الشفاه (مثل tu الفرنسية أو حرف «ü» التركي).")]),
        ]),
        ("tables", []),
        ("examples", [
            OrderedDict([("de", "die Männer — hören — die Tür"), ("ar", "الرجال — يسمع — الباب (ä/ö/ü أمثلة)")]),
        ]),
        ("eselsbruecke", "طريقة مجرّبة: انطق e ثم دوّر شفتيك — تسمع ö. انطق i ثم دوّر شفتيك — تسمع ü.")
    ]),

    "a1-aussprache-ch": OrderedDict([
        ("id", "a1-aussprache-ch"),
        ("titleDe", "Aussprache: ch — ich-Laut vs ach-Laut"),
        ("titleAr", "نطق ch: ich-Laut الناعم وach-Laut الخشن"),
        ("level", "A1"),
        ("ziel", "تُفرّق بين ich-Laut (ch بعد i/e/ö/ü/ä/äu — ناعم كالـ«هـ» المرققة) وach-Laut (ch بعد a/o/u/au — خشن كالخاء العربية)."),
        ("voraus", ["a1-praesens"]),
        ("anwendung", OrderedDict([
            ("ar", "كرّر: ich, mich, dich, nicht, Bücher (ناعم) · Bach, Buch, Koch, Nacht, auch (خشن)."),
            ("de", "Wiederhole: ich, mich, dich, nicht, Bücher (weich) · Bach, Buch, Koch, Nacht, auch (hart)."),
            ("candoIds", [])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a1-ac-v1"),
                ("type", "choice"),
                ("promptDe", "Welches Wort hat den WEICHEN ch-Laut (ich-Laut)?"),
                ("options", ["Buch", "ich", "Nacht"]),
                ("answer", ["ich"]),
                ("explanationAr", "ich → ch بعد i → ich-Laut ناعم (لا «ش» ولا «خ»! هاء مرققة من وسط اللسان). Buch/Nacht → ach-Laut خشن.")
            ]),
            OrderedDict([
                ("id", "a1-ac-v2"),
                ("type", "choice"),
                ("promptDe", "Welches Wort hat den HARTEN ch-Laut (ach-Laut)?"),
                ("options", ["nicht", "Bücher", "auch"]),
                ("answer", ["auch"]),
                ("explanationAr", "auch → ch بعد au → ach-Laut خشن (كالخاء).")
            ]),
        ]),
        ("summaryAr", "ch صوتان مختلفان: 1) الناعم (ich-Laut) بعد i/e/ö/ü/ä/äu/ei/eu/ai/ie (ich, nicht, Bücher, Mädchen، Chemie): يخرج من وسط اللسان ملامساً سقف الحنك، لا «ش» ولا «خ»، بل هاءٌ خفيفة مرققة. 2) الخشن (ach-Laut) بعد a/o/u/au (auch, Buch, Koch, Nacht): مثل الخاء العربية."),
        ("rules", [
            OrderedDict([("de", "weich (ich-Laut): nach i, e, ö, ü, ä, äu, ei, ie, eu, ai, r, l, n (ich, nicht, Kirche, Chemie, Mädchen)"), ("ar", "ناعم بعد i/e/ö/ü/ä والحروف المركبة ei/ie/eu/ai/äu، وبعد r/l/n.")]),
            OrderedDict([("de", "hart (ach-Laut): nach a, o, u, au (ach, Buch, Nacht, Koch, auch)"), ("ar", "خشن بعد a/o/u/au (أحرف خلفيّة).")]),
        ]),
        ("tables": [
            OrderedDict([
                ("captionDe", "ich-Laut vs ach-Laut"),
                ("captionAr", "الناعم والخشن"),
                ("headers", ["weich (ich-Laut)", "hart (ach-Laut)"]),
                ("rows", [
                    ["ich (أنا)", "auch (أيضاً)"],
                    ["nicht (لا)", "Buch (كتاب)"],
                    ["Bücher (كتب)", "Nacht (ليل)"],
                    ["Kirche (كنيسة)", "Koch (طباخ)"],
                    ["Mädchen (بنت)", "Bach (نهر صغير)"],
                ])
            ])
        ]),
        ("examples", [
            OrderedDict([("de", "Ich habe auch ein Buch."), ("ar", "عندي أيضاً كتاب. (ich ناعم، auch/Buch خشان)")]),
        ]),
        ("eselsbruecke", "تخيّل ch مع الحروف الأمامية (i/e) = هواء يمرّ عبر قناة ضيقة (ناعم)، والحروف الخلفية (a/o/u) = هواء يمرّ من أقصى الحلق كالخاء.")
    ]),

    "a1-aussprache-r": OrderedDict([
        ("id", "a1-aussprache-r"),
        ("titleDe", "Aussprache: Das deutsche r"),
        ("titleAr", "نطق حرف r الألماني"),
        ("level", "A1"),
        ("voraus", ["a1-praesens"]),
        ("ziel", "تُنطِق r في بداية الكلمة رخواً أو غُرّياً (ليس كالراء العربية المفخّمة)، وتنطق -er آخر الكلمة كـ a خفيفة (Vater = فاتَ)."),
        ("anwendung", OrderedDict([
            ("ar", "كرّر: rot, reisen, richtig, Frau؛ ثم: Vater, Mutter, Kinder, der, er (راء خفيفة في آخر المقطع تشبه a)."),
            ("de", "Wiederhole: rot, reisen, richtig, Frau; dann: Vater, Mutter, Kinder, der, er (-er wie ein schwaches a)."),
            ("candoIds", [])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a1-ar-v1"),
                ("type", "choice"),
                ("promptDe", "Wie wird das \"-er\" in \"Vater\" ausgesprochen?"),
                ("options", ["-er بلسان ملفوف", "schwaches a (Vata)", "-e"]),
                ("answer", ["schwaches a (Vata)"],),
                ("explanationAr", "مقطع -er في نهاية الكلمة يُختزل إلى a خفيفة: Vater = فاتَ، Mutter = موتَ، Kinder = كيندَ.")
            ]),
        ]),
        ("summaryAr", "حرف r الألماني ليس كالراء العربية المفخّمة المطولة، بل رخو من مؤخرة اللسان أو احتكاكي من الحنك. قواعد بسيطة: 1) بداية الكلمة أو المقطع (rot, Frau, richtig) رخو/غُري؛ 2) بعد حرف متحرك قصير (hart, lernen) رخو؛ 3) في نهاية المقطع أو بصيغة -er (Vater, Kinder) يختزل إلى a خفيفة تسمى «a-Schwa».",),
        ("rules": [
            OrderedDict([("de", "r am Silbenanfang: rot, Reise, Frau, richtig — Zäpfchen-r oder Zungen-r, gerieben, nicht gerollt"), ("ar", "بداية المقطع: راء رخوة (مطاطة قليلاً أو غُرّية)، لا تُرَقّق اللسان كالإسبانية ولا تُفخّم كالعربية.")]),
            OrderedDict([("de", "-er am Silben-/Wortende: Vater, Mutter, Kinder → schwaches a (Schwa)"), ("ar", "نهاية المقطع بصيغة -er: تُختزل إلى a خفيفة.")]),
        ]),
        ("tables": []),
        ("examples": [
            OrderedDict([("de", "Vater [ˈfaːtɐ], Mutter [ˈmʊtɐ], Kinder [ˈkɪndɐ]"), ("ar", "أب/أم/أطفال — -er آخراً = a خفيفة.")]),
        ]),
        ("eselsbruecke", "بدل أن تقرأ Vater «فاتِر»، قلها «فاتَ» وكأن آخرها a خفيفة أو همزة ملساء.")
    ]),

    "a1-aussprache-sp-st": OrderedDict([
        ("id", "a1-aussprache-sp-st"),
        ("titleDe", "Aussprache: sp/st und sch"),
        ("titleAr", "نطق sch و sp/st في بداية الكلمة"),
        ("level", "A1"),
        ("voraus", ["a1-praesens"]),
        ("ziel", "تعلم أن sp و st في بداية الكلمة/المقطع يُنطقان shp/sht (شب/شت)، وأن sch تُنطق دائماً «ش».",),
        ("anwendung", OrderedDict([
            ("ar", "كرّر: spielen=شبيلِن، Stadt=شتات، Straße=شتراسَ، Schule=شولَ، schreiben=شرايبن."),
            ("de", "Wiederhole: spielen, Stadt, Straße, Schule, schreiben."),
            ("candoIds", [])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a1-as-v1"),
                ("type", "choice"),
                ("promptDe", "Wie wird \"Stadt\" ausgesprochen?"),
                ("options", ["s-tat", "schtatt", "ts-tat"]),
                ("answer", ["schtatt"]),
                ("explanationAr", "st في بداية الكلمة = sht (شت): Stadt = شتات.")
            ]),
        ]),
        ("summaryAr", "قواعد النطق: 1) sch دائماً = «ش» (Schule=شولَ). 2) sp في بداية الكلمة/المقطع = shp (شب)؛ 3) st في بداية الكلمة/المقطع = sht (شت). في وسط الكلمة أو آخرها تنطق سين عادية (best- باست، Fenster- فنستر).",),
        ("rules": [
            OrderedDict([("de", "sch = sch (immer wie \"ش\"): Schule, schreiben, Fisch"), ("ar", "sch دائماً = ش.")]),
            OrderedDict([("de", "sp im Wort-/Silbenanfang = shp (شب): spielen, sprechen, Stadtpark (sp im Wort → shp)"), ("ar", "sp في بداية الكلمة/المقطع = shp.")]),
            OrderedDict([("de", "st im Wort-/Silbenanfang = sht (شت): Stadt, stehen, verstehen (Ver-stehen → sht)"), ("ar", "st في بداية الكلمة/المقطع = sht.")]),
        ]),
        ("tables": [
            OrderedDict([
                ("captionDe", "Beispiele"),
                ("captionAr", "أمثلة"),
                ("headers", ["Wort", "Aussprache", "Arabisch"]),
                ("rows", [
                    ["spielen", "شبيلِن", "يلعب"],
                    ["Sprechen", "شبريخِن", "يتكلم"],
                    ["Stadt", "شتات", "مدينة"],
                    ["Straße", "شتراسَ", "شارع"],
                    ["Schule", "شولَ", "مدرسة"],
                    ["Fisch", "فيش", "سمك"],
                    ["best-", "بست (وسط)", "أفضل (تبقى سين في الوسط)"],
                ])
            ])
        ]),
        ("examples": []),
        ("eselsbruecke", "حرف s قبل p أو t في بداية الكلمة يخجل من النطق فيستعين بحرف ش: sp→شب، st→شت.")
    ]),

    "a1-aussprache-auslaut": OrderedDict([
        ("id", "a1-aussprache-auslaut"),
        ("titleDe", "Aussprache: Auslautverhärtung — b/d/g → p/t/k"),
        ("titleAr", "نطق نهاية المقطع: b/d/g تُنطَق p/t/k"),
        ("level", "A1"),
        ("voraus", ["a1-praesens", "a1-akkusativ"]),
        ("ziel", "تدرك أن الحروف المجهورة b/d/g في آخر المقطع/الكلمة تُنطَق عديمة الجهر (p/t/k) — هذا ضروري جداً للفهم والنطق.",),
        ("anwendung", OrderedDict([
            ("ar", "كرّر: Tag = تاك، lieb = ليب، Kind = كينت، Hund = هونت، ab = ap. لا تنطق g نهائياً جيم! Tag = تاك لا تاغ."),
            ("de", "Wiederhole: Tag, lieb, Kind, Hund, ab — final b→p, d→t, g→k."),
            ("candoIds", [])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a1-al-v1"),
                ("type", "choice"),
                ("promptDe", "Wie wird \"Tag\" (يوم) ausgesprochen?"),
                ("options", ["تاغ", "تاك", "تا"]),
                ("answer", ["تاك"]),
                ("explanationAr", "Auslautverhärtung: آخر حرف g ينطق k → Tag = تاك.")
            ]),
        ]),
        ("summaryAr", "قاعدة نطقية مهمة جداً: في نهاية الكلمة أو المقطع، لا يوجد جهر بالأحرف: b تُنطَق p، d تُنطَق t، g تُنطَق k. هذا يفسر لماذا Tag (يوم) = تاك وlieb (محبوب) = ليب وKind (طفل) = كينت.",),
        ("rules": [
            OrderedDict([("de", "b am Ende → p: lieb [li:p], ab [ap]"), ("ar", "b نهاية → p.")]),
            OrderedDict([("de", "d am Ende → t: Kind [kɪnt], Hund [hʊnt]"), ("ar", "d نهاية → t.")]),
            OrderedDict([("de", "g am Ende → k: Tag [ta:k], Weg [ve:k]"), ("ar", "g نهاية → k.")]),
        ]),
        ("tables": [
            OrderedDict([
                ("captionDe", "Beispiele"),
                ("captionAr", "أمثلة"),
                ("headers", ["geschrieben", "Aussprache", "Arabisch"]),
                ("rows", [
                    ["Tag", "تاك", "يوم"],
                    ["Weg", "فيك", "طريق"],
                    ["Kind", "كينت", "طفل"],
                    ["Hund", "هونت", "كلب"],
                    ["lieb", "ليب", "محبوب"],
                    ["ab", "آب", "من (حرف جر)"],
                ])
            ])
        ]),
        ("examples": [
            OrderedDict([("de", "Der Tag ist gut. → [deːɐ̯ ta:k ɪst gu:t]"), ("ar", "اليوم جميل. Tag تاك، gut گوت.")]),
        ]),
        ("eselsbruecke", "الألمان يرهبون الجهر في آخر الكلمة (كأنه يُعِب الحلق): كل مجهور يفقد جهره في النهاية.")
    ]),
}

added = 0
for tid, topic in new_topics.items():
    if tid not in g:
        g[tid] = topic
        added += 1
        print(f'+ Added {tid}')
    else:
        print(f'= {tid} already exists')

print(f'\n{added} neue Aussprache-Themen hinzugefügt.')

with open(GRAMMAR, 'w', encoding='utf-8') as f:
    json.dump(g, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(f'Wrote {GRAMMAR}')
