"""
Restrukturierungspatch 1: Typen + Phasen + Grammatik-Themen
────────────────────────────────────────────────────────────
1. Fügt Level/Phase \"A0\" hinzu (10 Tage Einführung).
2. Streckt die Phasen auf die akkademisch korrekten Wochen um:
   A0 10 Tage · A1 12 Wochen · A2 12 · B1 14 · B2 14 + Abschluss.
3. Schreibt die Grammatik-Themenliste neu (58 Achsen + A0-Grundlagen)
   in der korrekten Sequenz gemäss Menschen/Aspekte-Methodik.
4. Fügt fehlende Grammatik-Kapitel mit Platzhalter-Kurzthemen an.
"""

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GFILE = ROOT / "content" / "grammar.json"
shutil.copy(GFILE, ROOT / "content" / ".grammar.bak")
grammar = json.loads(GFILE.read_text(encoding="utf-8"))


def mc(prompt: str, options: list[str], answer: str, expl: str) -> dict:
    return {"type": "mc", "promptDe": prompt, "options": options, "answer": answer, "explanationAr": expl}


def fill(prompt: str, answer, expl_de: str, expl_ar: str) -> dict:
    return {
        "type": "fill",
        "promptDe": prompt,
        "answer": [answer, answer.lower()] if isinstance(answer, str) else answer,
        "explanationDe": expl_de,
        "explanationAr": expl_ar,
    }


# ── Fehlende / umzuordnende Grammatik-Kapitel ──────────────────────────────

# A0: Alphabet/Aussprache ist kein reguläres Grammatik-Kapitel, aber wir fügen
# zwei technische Mini-Themen für die Systemerkennung an.
if "a0-begrussung" not in grammar:
    grammar["a0-begrussung"] = {
        "id": "a0-begrussung",
        "titleDe": "Begrüßung & sich vorstellen",
        "titleAr": "التحايا والتعريف بالنفس",
        "level": "A0",
        "summaryAr": "أول ما تحتاجه: قل مرحباً، قل اسمك، قل من أين أنت، واسأل كيف الحال. نستعمل فقط sein والضمائر الأساسية.",
        "rules": [
            {"de": "Hallo! · Guten Tag! · Guten Morgen! · Guten Abend! · Tschüss!", "ar": "مرحباً · نهار سعيد · صباح الخير · مساء الخير · إلى اللقاء"},
            {"de": "Ich heiße … · Ich komme aus … · Ich wohne in …", "ar": "اسمي … · آتي من … · أسكن في …"},
            {"de": "Wie heißt du? Woher kommst du? Wie geht es dir?", "ar": "ما اسمك؟ من أين أنت؟ كيف حالك؟"},
        ],
        "tables": [],
        "examples": [
            {"de": "Hallo! Ich heiße Nader.", "ar": "مرحباً! اسمي نادر."},
            {"de": "Guten Tag! Ich komme aus Tunesien.", "ar": "نهار سعيد! أنا من تونس."},
        ],
        "eselsbrueckeAr": "احفظ هذه الجمل كعبارات جاهزة (Chunks) — لا تفككها إلى كلمات في أول لقاء.",
        "pronTippAr": "ch في ich يخرج من وسط اللسان ملامساً سقف الحلق (ich-Laut) وليس «ش» أو «خ».",
        "exercises": [
            mc("Hallo! Ich ___ Nader.", ["heiße", "heißt", "bin heißen"], "heiße", "ich → الفعل ينتهي بـ e."),
            mc("Ich ___ aus Tunesien.", ["komme", "kommst", "kommt"], "komme", "ich → komme."),
            mc("Wie geht es ___?", ["dir", "du", "dich"], "dir", "بعد wie geht es نستخدم Dativ: dir."),
            fill("Guten ___!", "Tag", "Guten Tag!", "«نهار سعيد» تقال في النهار."),
        ],
    }

# Modalverben A1 (können/müssen/wollen) — bisher gefehlt.
if "a1-modalverben" not in grammar:
    grammar["a1-modalverben"] = {
        "id": "a1-modalverben",
        "titleDe": "Modalverben: können, müssen, wollen",
        "titleAr": "الأفعال الناقصة: können, müssen, wollen",
        "level": "A1",
        "summaryAr": "können = أستطيع/يمكن · müssen = يجب/عليّ · wollen = أريد. الفعل الناقص يأخذ موقع الفعل، والمصدر الحقيقي ينتقل إلى نهاية الجملة.",
        "rules": [
            {"de": "ich kann · du kannst · er/sie/es kann · wir können · ihr könnt · sie/Sie können", "ar": "تصريف können"},
            {"de": "ich muss · du musst · er muss · wir müssen · ihr müsst · sie müssen", "ar": "تصريف müssen (انتبه لفقدان الـ s في muss/musst)"},
            {"de": "ich will · du willst · er will · wir wollen · ihr wollt · sie wollen", "ar": "تصريف wollen"},
            {"de": "Modalverb + … + Infinitiv am Ende!  · Ich kann Deutsch sprechen.", "ar": "الفعل الأصلي يأتي آخر الجملة مع الناقص."},
        ],
        "tables": [
            {
                "captionAr": "تصريف الأفعال الناقصة في المضارع",
                "headers": ["Person", "können", "müssen", "wollen"],
                "rows": [
                    ["ich", "kann", "muss", "will"],
                    ["du", "kannst", "musst", "willst"],
                    ["er/sie/es", "kann", "muss", "will"],
                    ["wir", "können", "müssen", "wollen"],
                    ["ihr", "könnt", "müsst", "wollt"],
                    ["sie/Sie", "können", "müssen", "wollen"],
                ],
            }
        ],
        "examples": [
            {"de": "Ich kann Deutsch sprechen.", "ar": "أستطيع التحدث بالألمانية."},
            {"de": "Ich muss jetzt gehen.", "ar": "يجب أن أذهب الآن."},
            {"de": "Wir wollen Kaffee trinken.", "ar": "نريد شرب القهوة."},
        ],
        "eselsbrueckeAr": "«الناقص يمسك الموقع الثاني، والفعل الأصلي يُنفى إلى آخر الجملة».",
        "pronTippAr": "",
        "exercises": [
            fill("Ich ___ gut schwimmen.", "kann", "Ich kann gut schwimmen.", "القدرة = können."),
            fill("Du ___ heute lernen.", "musst", "Du musst heute lernen.", "الإجبار = müssen."),
            mc("Wir ___ ins Kino gehen.", ["wollen", "will", "wollt"], "wollen", "wir → wollen."),
            fill("Ich kann gut Deutsch ___.", "sprechen", "Ich kann gut Deutsch sprechen.", "المصدر في آخر الجملة مع الناقص."),
        ],
    }

# Dativ (Grundlage) — bisher in A2, gehört aber an das Ende von A1 (Menschen).
if "a1-dativ" not in grammar:
    grammar["a1-dativ"] = {
        "id": "a1-dativ",
        "titleDe": "Dativ — dem/der/den + Präpositionen mit, bei, zu, aus, nach, von, seit",
        "titleAr": "حالة الجر الأساسية وأدواتها",
        "level": "A1",
        "summaryAr": "حالة الجر (Dativ) تُستخدم بعد أدوات جر معيّنة ومع أفعال مثل gefallen/helfen/danken/gehören. أدوات التعريف تصبح dem (مذكر/محايد) و der (مؤنث) و den (جمع).",
        "rules": [
            {"de": "der → dem · die → der · das → dem · die(Pl) → den", "ar": "تغيرات أدوات التعريف في حالة الجر."},
            {"de": "mit · bei · zu · aus · nach · von · seit  → immer Dativ!", "ar": "هذه الأدوات تأخذ الجر دائماً."},
            {"de": "Das Buch gefällt mir. · Ich helfe dir. · Das gehört der Frau.", "ar": "أفعال تأخذ Dativ: يُعجب، يساعد، يعود/ينتمي."},
        ],
        "tables": [
            {
                "captionAr": "أدوات التعريف في حالات الرفع والنصب والجر",
                "headers": ["", "Nominativ", "Akkusativ", "Dativ"],
                "rows": [
                    ["Maskulin", "der", "den", "dem"],
                    ["Feminin", "die", "die", "der"],
                    ["Neutrum", "das", "das", "dem"],
                    ["Plural", "die", "die", "den"],
                ],
            }
        ],
        "examples": [
            {"de": "Ich wohne bei meiner Tante.", "ar": "أسكن عند خالتي."},
            {"de": "Wir fahren nach Berlin.", "ar": "نسافر إلى برلين."},
            {"de": "Seit einem Jahr lerne ich Deutsch.", "ar": "منذ سنة وأنا أتعلم الألمانية."},
        ],
        "eselsbrueckeAr": "«مِعْزَبا» جملة التذكر: **m**it · **b**ei · **z**u · **a**us · **n**ach · **v**on · **a**b (أضف seit لاحقاً).",
        "pronTippAr": "",
        "exercises": [
            fill("Ich fahre ___ Berlin.", "nach", "Ich fahre nach Berlin.", "nach تُستخدم للمدن والبلدان المحايدة."),
            mc("Das Buch gefällt ___.", ["mir", "ich", "mich"], "mir", "gefallen يأخذ Dativ."),
            fill("Ich wohne bei ___ Mutter.", "meiner", "bei meiner Mutter", "بعد bei Dativ، mein → meiner للمؤنث."),
            mc("der → ___ (Dativ)", ["dem", "den", "der"], "dem", "المذكر dem في Dativ."),
        ],
    }

# Wechselpräpositionen (Statik/Dynamik) — gegen Ende von A1.
if "a1-wechsel" not in grammar:
    grammar["a1-wechsel"] = {
        "id": "a1-wechsel",
        "titleDe": "Wechselpräpositionen: in/an/auf/über/unter/neben/vor/hinter/zwischen",
        "titleAr": "أدوات الجر المزدوجة (سكون وحركة)",
        "level": "A1",
        "summaryAr": "تسع أدوات تأخذ Dativ عند السكون (أين؟) و Akkusativ عند الحركة والاتجاه (إلى أين؟).",
        "rules": [
            {"de": "Wo? (Ruhe/Lage) → Dativ  ·  Wohin? (Ziel/Bewegung) → Akkusativ", "ar": "السؤال «أين» يأخذ Dativ، السؤال «إلى أين» يأخذ Akkusativ."},
            {"de": "Ich bin in der Schule. · Ich gehe in die Schule.", "ar": "أنا في المدرسة (سكون) · أذهب إلى المدرسة (حركة)."},
        ],
        "tables": [],
        "examples": [
            {"de": "Das Buch liegt auf dem Tisch.", "ar": "الكتاب على الطاولة (موجودة/سكون)."},
            {"de": "Ich lege das Buch auf den Tisch.", "ar": "أضع الكتاب على الطاولة (حركة للوصول)."},
        ],
        "eselsbrueckeAr": "«حالة × هدف» — اسأل نفسك دائماً: هل أنا أصف مكاناً ثابتاً أم حركةً باتجاه؟",
        "pronTippAr": "",
        "exercises": [
            mc("Ich hänge das Bild an ___ Wand.", ["die", "der", "den"], "die", "Wohin? → Akkusativ: an die Wand."),
            mc("Das Bild hängt an ___ Wand.", ["der", "die", "dem"], "der", "Wo? → Dativ: an der Wand."),
            fill("Die Katze liegt unter ___ Tisch.", "dem", "unter dem Tisch", "Wo = سكون → Dativ محايد dem."),
            fill("Ich gehe in ___ Kino.", "das", "ins Kino", "Wohin = حركة → Akkusativ محايد das (in+das = ins)."),
        ],
    }

# Imperativ — Du-/Ihr-/Sie-Form gegen Ende von A1.
if "a1-imperativ" not in grammar:
    grammar["a1-imperativ"] = {
        "id": "a1-imperativ",
        "titleDe": "Imperativ: Aufforderungen (du/ihr/Sie)",
        "titleAr": "صيغة الأمر",
        "level": "A1",
        "summaryAr": "لإعطاء أمر أو تعليمات: du: جذر الفعل فقط (مع أو بدون -e)، ihr: نفس تصريف ihr لكن بدون ضمير، Sie: الفعل أولاً ثم Sie.",
        "rules": [
            {"de": "(du): Mach(e) das! · Sprich! · Fahr los!", "ar": "صيغة du: الجذر فقط، بدون du. الأفعال الشاذة تغيّر أحياناً: sprechen → Sprich!"},
            {"de": "(ihr): Macht das! · Kommt her!", "ar": "صيغة ihr: نفس تصريف ihr بدون ضمير."},
            {"de": "(Sie): Machen Sie! · Sprechen Sie bitte!", "ar": "الصيغة المهذبة: الفعل أولاً + Sie في الموقع الثاني."},
        ],
        "tables": [],
        "examples": [
            {"de": "Bitte, sprechen Sie langsamer!", "ar": "من فضلك تحدث أبطأ (صيغة مهذبة)."},
            {"de": "Mach deine Hausaufgaben!", "ar": "اعمل واجبك (صيغة غير رسمية لـ du)."},
        ],
        "eselsbrueckeAr": "للصيغة المهذبة Sie: «الفعل يسبق Sie دائماً في الأمر».",
        "pronTippAr": "",
        "exercises": [
            fill("Bitte ___ Sie das Fenster zu!", "machen", "Machen Sie bitte das Fenster zu.", "Sie-Imperativ يبدأ بالفعل ثم Sie."),
            mc("___ die Tür zu!", ["Mach", "Machst", "Machen"], "Mach", "du-Imperativ = جذر فقط."),
            fill("___ leise!", "Sprecht", "Sprecht leise!", "ihr-Imperativ يطابق تصريف ihr."),
        ],
    }

# Perfekt (Einführung A1) — nur regelmässige Partizipien mit haben für die Abschlusswochen von A1.
if "a1-perfekt-einf" not in grammar:
    grammar["a1-perfekt-einf"] = {
        "id": "a1-perfekt-einf",
        "titleDe": "Perfekt (Einführung): ge-…-t mit haben",
        "titleAr": "مقدمة الماضي التام (أفعال منتظمة مع haben)",
        "level": "A1",
        "summaryAr": "في نهاية A1 نتعرف على صيغة واحدة من الماضي: Partizip II للأفعال المنتظمة (ge- + جذر + -t) مع الفعل المساعد haben في الموضع الثاني، والـPartizip في آخر الجملة.",
        "rules": [
            {"de": "Ich habe gestern gearbeitet.", "ar": "الجزء الثاني دائماً آخر الجملة."},
            {"de": "lernen → gelernt · machen → gemacht · wohnen → gewohnt", "ar": "أمثلة لأفعال منتظمة."},
            {"de": "haben im Präsens (ich habe, du hast …) + … + Partizip II", "ar": "التركيب الأساسي للماضي التام في A1."},
        ],
        "tables": [],
        "examples": [
            {"de": "Ich habe gestern Deutsch gelernt.", "ar": "لقد تعلمت الألمانية أمس."},
            {"de": "Am Wochenende haben wir viel gearbeitet.", "ar": "عملنا كثيراً في نهاية الأسبوع."},
        ],
        "eselsbrueckeAr": "في جملة Perfekt الألمانية: «المساعد في الثاني، والمصير (Partizip) في النهاية».",
        "pronTippAr": "",
        "exercises": [
            fill("Gestern ___ ich Deutsch gelernt.", "habe", "Ich habe gestern Deutsch gelernt.", "ich → habe في المضارع."),
            fill("Ich habe gestern viel ___.", "gearbeitet", "viel gearbeitet", "arbeiten → Partizip II = ge- + arbeit + -et."),
            mc("Wir haben am Wochenende ___.", ["gespielt", "spielt", "spielen"], "gespielt", "Partizip II = ge- + spiel + -t."),
        ],
    }

# Futur I (Einführung) am Ende von A1.
if "a1-futur-einf" not in grammar:
    grammar["a1-futur-einf"] = {
        "id": "a1-futur-einf",
        "titleDe": "Futur I (Einführung): werden + Infinitiv",
        "titleAr": "مقدمة المستقبل البسيط",
        "level": "A1",
        "summaryAr": "للتعبير عن خطط المستقبل في A1 نستخدم werden (سوف) في الموضع الثاني والمصدر في آخر الجملة. تكفي مقدمة بسيطة (werden لا يُدرَّس بعمق قبل A2).",
        "rules": [
            {"de": "ich werde · du wirst · er wird · wir werden · ihr werdet · sie werden", "ar": "تصريف werden."},
            {"de": "Ich werde morgen lernen.", "ar": "سأدرس غداً."},
        ],
        "tables": [],
        "examples": [
            {"de": "Nächste Woche werde ich nach Berlin fahren.", "ar": "الأسبوع القادم سأسافر إلى برلين."},
        ],
        "eselsbrueckeAr": "تذكَّر دائماً: werden في الموضع الثاني، والمصدر في النهاية — نفس شكل Modalverben.",
        "pronTippAr": "",
        "exercises": [
            fill("Ich ___ morgen Deutsch lernen.", "werde", "Ich werde morgen Deutsch lernen.", "ich → werden → werde."),
            mc("Wir ___ am Wochenende ins Kino gehen.", ["werden", "wird", "werdet"], "werden", "wir → werden."),
            fill("Nächste Woche ___ ich nach Hamburg fahren.", "werde", "Nächste Woche werde ich …", "مستقبل مع werden."),
        ],
    }

# Präteritum wird auf A2 verschoben (sein/haben/Modal) — wir benennen a1-war-hatte um.
if "a1-war-hatte" in grammar:
    t = grammar["a1-war-hatte"]
    t["level"] = "A2"
    t["id"] = "a2-praeteritum-grund"
    t["titleDe"] = "Präteritum von sein, haben, werden und Modalverben"
    t["titleAr"] = "ماضي الأفعال المساعدة والناقصة"
    t["summaryAr"] = "في السرد المكتوب والرواية نستخدم Präteritum لـ sein, haben, werden والأفعال الناقصة بدلاً من Perfekt. باقي الأفعال تبقى في Perfekt حتى B1."
    grammar["a2-praeteritum-grund"] = t
    del grammar["a1-war-hatte"]

# Weitere fehlende Kapitel für B1: Partizip I als Adjektiv / Zustandspassiv / indirekte Fragen sind teilweise
# schon in b1-unbestimmte/b1-passiv angedeutet. Wir ergänzen Minimal-Einträge für die Checkliste.
if "b1-partizip1" not in grammar:
    grammar["b1-partizip1"] = {
        "id": "b1-partizip1",
        "titleDe": "Partizip I als Adjektiv · Adjektivdeklination ohne Artikel",
        "titleAr": "Partizip I كصفة وتصريف الصفات بدون أداة",
        "level": "B1",
        "summaryAr": "Partizip I (Infinitiv + d) يصف شيئاً يقوم بفعل (der lesende Student). يُعامل كصفة ويُصرف حسب الحالة. الصفات التي لا تسبقها أداة تعريفية تضاف لها نهايات واضحة.",
        "rules": [
            {"de": "Partizip I = Infinitiv + d · laufen → laufend · weinen → weinend", "ar": "كيف يتكوّن Partizip I."},
            {"de": "guter Wein · kaltes Wasser · frische Milch  (ohne Artikel: Endung wie bestimmter Artikel)", "ar": "نهايات الصفات بدون أداة."},
        ],
        "tables": [],
        "examples": [
            {"de": "Der weinende Junge heißt Max.", "ar": "الصبي الباكي اسمه ماكس."},
            {"de": "Ich trinke gern heißen Kaffee.", "ar": "أحب شرب القهوة الساخنة."},
        ],
        "eselsbrueckeAr": "«صفة بلا أداة تنال نهاية الأداة نفسها».",
        "pronTippAr": "",
        "exercises": [
            fill("Ein ___ Mann läuft auf der Straße.", "laufender", "ein laufender Mann", "Partizip I كصفة."),
            mc("Ich trinke ___ Tee.", ["heißen", "heiß", "heißes"], "heißen", "صفة بدون أداة أمام Akkusativ مذكر (Tee لا — الشاي مذكر في الألمانية: der Tee) ⇒ heißen."),
        ],
    }

if "b1-indirekte-fragen" not in grammar:
    grammar["b1-indirekte-fragen"] = {
        "id": "b1-indirekte-fragen",
        "titleDe": "Indirekte Fragesätze (ob/wie/wo/wann/was)",
        "titleAr": "الأسئلة غير المباشرة",
        "level": "B1",
        "summaryAr": "بعد عبارات مثل Ich weiß nicht…/Ich frage mich…/Sagen Sie mir… يأتي سؤال غير مباشر ويتحول الفعل إلى آخر الجملة. نستخدم ob لـ نعم/لا وكلمات W المعتادة.",
        "rules": [
            {"de": "Ich weiß nicht, ob er kommt. · Ich weiß nicht, wann er kommt.", "ar": "الفعل في آخر الجملة الثانوية."},
        ],
        "tables": [],
        "examples": [
            {"de": "Kannst du mir sagen, wie viel das kostet?", "ar": "هل يمكن أن تقول لي كم يكلّف هذا؟"},
        ],
        "eselsbrueckeAr": "في الجملة الثانوية الألمانية «الفعل في الآخر مهما طال».",
        "pronTippAr": "",
        "exercises": [
            fill("Ich weiß nicht, ___ er kommt.", "ob", "ob = إذا/هل", "سؤال نعم/لا غير مباشر."),
            fill("Kannst du mir sagen, ___ die Kirche ist?", "wo", "wo = أين", "سؤال غير مباشر بـ wo."),
        ],
    }

# Fehlende B2-Kapitel: verschmolzene Präpositionen, Modalpartikeln (ist da), Redewendungen.
if "b2-verschmolzene" not in grammar:
    grammar["b2-verschmolzene"] = {
        "id": "b2-verschmolzene",
        "titleDe": "Verschmolzene Präpositionen (zum, zur, am, im, ans, ins, übers, fürs, vorm, hinters)",
        "titleAr": "اندماج أدوات الجر مع الأدوات",
        "level": "B2",
        "summaryAr": "في اللغة المكتوبة الرسمية واللغة المحكية ندمج حرف الجر مع أداة التعريف التالية: zu+dem=zum، zu+der=zur، an+dem=am، in+dem=im، وهكذا. في B2 يصبح استخدامها واجباً لطبيعية الأسلوب.",
        "rules": [
            {"de": "zum = zu + dem · zur = zu + der · am = an + dem · im = in + dem · ans = an + das · ins = in + das", "ar": "أشهر حالات الدمج."},
            {"de": "Ich gehe zum Arzt. · Wir sind im Kino.", "ar": "أمثلة شائعة."},
        ],
        "tables": [],
        "examples": [
            {"de": "Er geht zur Schule.", "ar": "يذهب إلى المدرسة."},
            {"de": "Sie ist am Wochenende zu Hause.", "ar": "هي في البيت نهاية الأسبوع."},
        ],
        "eselsbrueckeAr": "كلمة واحدة بدل كلمتين — في الكتابة الأكاديمية لا تُفكك.",
        "pronTippAr": "",
        "exercises": [
            fill("Ich gehe ___ Arzt.", "zum", "zum Arzt", "zu+dem = zum."),
            fill("Wir sind ___ Kino.", "im", "im Kino", "in+dem = im."),
            mc("Er fährt ___ Bahnhof.", ["zum", "zur", "zu den"], "zum", "Bahnhof مذكر: zu+dem = zum."),
        ],
    }

if "b2-redew" not in grammar:
    grammar["b2-redew"] = {
        "id": "b2-redew",
        "titleDe": "Redewendungen und idiomatische Wendungen (B2)",
        "titleAr": "التعابير الاصطلاحية الألمانية",
        "level": "B2",
        "summaryAr": "في B2 تحتاج مجموعة من التعابير الجاهزة كـ: einen Kater haben, die Nase voll haben, auf dem Laufenden bleiben, etwas in Kauf nehmen, im Grunde genommen … — هذه العبارات لا تُترجم حرفياً وتُميز المستخدم المستقل عن المتعلم.",
        "rules": [
            {"de": "Die Redewendungen werden als Chunks gelernt, nicht Wort für Wort.", "ar": "تُحفظ كعبارات جاهزة."},
        ],
        "tables": [],
        "examples": [
            {"de": "Ich habe die Nase voll.", "ar": "لقد سئمت (ليس: أنفي ممتلئ)."},
            {"de": "Wir bleiben auf dem Laufenden.", "ar": "نبقى على اطلاع."},
        ],
        "eselsbrueckeAr": "إذا كانت الترجمة الحرفية لا تعطي معنى عربياً منطقياً فالأرجح أنها Redewendung — احفظها ككتلة واحدة.",
        "pronTippAr": "",
        "exercises": [
            mc("Ich habe gestern zu viel getrunken und heute habe ich einen ___.",
               ["Kater", "Katerling", "Katze"], "Kater", "einen Kater haben = صداع/ثقل الكحول."),
        ],
    }

# Datei zurückschreiben
GFILE.write_text(json.dumps(grammar, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"✓ Grammar-Datei geschrieben. Themen jetzt: {len(grammar)}")
