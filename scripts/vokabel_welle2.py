#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثانية: نواةُ A1 الغائبة — الزمنُ والأرقامُ والبيتُ والمدرسةُ والأفعالُ الأساسية."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A1_ZEIT = [
 ("die Zeit","الوقت","die","die Zeiten","Ich habe heute keine Zeit.","لا وقتَ لديَّ اليوم","zeit"),
 ("die Stunde","الساعة (مدّة)","die","die Stunden","Der Kurs dauert zwei Stunden.","الدورةُ ساعتان","zeit"),
 ("die Minute","الدقيقة","die","die Minuten","Warte fünf Minuten, bitte.","انتظرْ خمسَ دقائقَ من فضلك","zeit"),
 ("der Tag","اليوم","der","die Tage","Der Tag war lang.","كانَ اليومُ طويلاً","zeit"),
 ("die Woche","الأسبوع","die","die Wochen","Nächste Woche fahre ich weg.","الأسبوعَ القادمَ أسافر","zeit"),
 ("der Monat","الشهر","der","die Monate","Der Monat ist fast vorbei.","الشهرُ كادَ ينتهي","zeit"),
 ("das Jahr","السنة","das","die Jahre","Ich lerne seit einem Jahr Deutsch.","أتعلَّمُ الألمانيةَ منذُ سنة","zeit"),
 ("der Morgen","الصباح","der","die Morgen","Am Morgen trinke ich Kaffee.","في الصباحِ أشربُ قهوة","zeit"),
 ("der Vormittag","قبلَ الظهر","der","die Vormittage","Am Vormittag arbeite ich.","قبلَ الظهرِ أعمل","zeit"),
 ("der Mittag","الظهر","der","die Mittage","Um Mittag essen wir.","عندَ الظهرِ نأكل","zeit"),
 ("der Nachmittag","بعدَ الظهر","der","die Nachmittage","Am Nachmittag lerne ich.","بعدَ الظهرِ أدرس","zeit"),
 ("der Abend","المساء","der","die Abende","Der Abend ist ruhig.","المساءُ هادئ","zeit"),
 ("der Montag","الإثنين","der","die Montage","Am Montag beginnt der Kurs.","الإثنينَ تبدأُ الدورة","zeit"),
 ("der Dienstag","الثلاثاء","der","die Dienstage","Dienstag habe ich frei.","الثلاثاءَ عطلتي","zeit"),
 ("der Mittwoch","الأربعاء","der","die Mittwoche","Mittwoch ist Markttag.","الأربعاءُ يومُ السوق","zeit"),
 ("der Donnerstag","الخميس","der","die Donnerstage","Donnerstag kommt der Lehrer.","الخميسَ يأتي المعلّم","zeit"),
 ("der Freitag","الجمعة","der","die Freitage","Freitag gehe ich in die Moschee.","الجمعةَ أذهبُ إلى المسجد","zeit"),
 ("der Samstag","السبت","der","die Samstage","Samstag schlafe ich lange.","السبتَ أنامُ طويلاً","zeit"),
 ("der Sonntag","الأحد","der","die Sonntage","Sonntag sind die Geschäfte zu.","الأحدَ المحلّاتُ مغلقة","zeit"),
 ("der Januar","يناير","der","","Im Januar ist es kalt.","في ينايرَ الجوُّ بارد","zeit"),
 ("der Februar","فبراير","der","","Der Februar ist kurz.","فبرايرُ قصير","zeit"),
 ("der März","مارس","der","","Im März kommt der Frühling.","في مارسَ يأتي الربيع","zeit"),
 ("der April","أبريل","der","","Im April regnet es viel.","في أبريلَ يمطرُ كثيراً","zeit"),
 ("der Mai","مايو","der","","Der Mai ist mein Lieblingsmonat.","مايو شهري المفضَّل","zeit"),
 ("der Juni","يونيو","der","","Im Juni sind Prüfungen.","في يونيو امتحانات","zeit"),
 ("der Juli","يوليو","der","","Im Juli fahren wir ans Meer.","في يوليو نذهبُ إلى البحر","zeit"),
 ("der August","أغسطس","der","","Im August ist es heiß.","في أغسطسَ الجوُّ حار","zeit"),
 ("der September","سبتمبر","der","","Im September beginnt die Schule.","في سبتمبرَ تبدأُ المدرسة","zeit"),
 ("der Oktober","أكتوبر","der","","Im Oktober wird es kühl.","في أكتوبرَ يبردُ الجو","zeit"),
 ("der November","نوفمبر","der","","Der November ist grau.","نوفمبرُ رمادي","zeit"),
 ("der Dezember","ديسمبر","der","","Im Dezember schneit es.","في ديسمبرَ تثلج","zeit"),
 ("das Datum","التاريخ","das","die Daten","Welches Datum ist heute?","ما تاريخُ اليوم؟","zeit"),
 ("die Uhr","الساعة (الجهاز)","die","die Uhren","Meine Uhr geht falsch.","ساعتي غيرُ مضبوطة","zeit"),
 ("jetzt","الآن","","","Ich muss jetzt gehen.","عليَّ الذهابُ الآن","zeit"),
 ("bald","قريباً","","","Der Bus kommt bald.","الحافلةُ تصلُ قريباً","zeit"),
 ("spät","متأخِّر","","","Es ist schon spät.","الوقتُ متأخِّرٌ سلفاً","zeit"),
 ("immer","دائماً","","","Er kommt immer zu spät.","يأتي دائماً متأخِّراً","zeit"),
 ("oft","كثيراً ما","","","Ich koche oft zu Hause.","أطبخُ كثيراً في البيت","zeit"),
 ("manchmal","أحياناً","","","Manchmal gehe ich laufen.","أحياناً أذهبُ للجري","zeit"),
 ("selten","نادراً","","","Ich sehe selten fern.","نادراً ما أشاهدُ التلفاز","zeit"),
 ("nie","أبداً","","","Ich trinke nie Alkohol.","لا أشربُ الكحولَ أبداً","zeit"),
 ("vorgestern","أوّلَ أمس","","","Vorgestern war ich krank.","أوّلَ أمسٍ كنتُ مريضاً","zeit"),
 ("übermorgen","بعدَ غد","","","Übermorgen fliege ich.","بعدَ غدٍ أسافرُ جواً","zeit"),
 ("zuerst","أوّلاً","","","Zuerst lerne ich, dann esse ich.","أوّلاً أدرسُ ثمَّ آكل","zeit"),
 ("danach","بعدَ ذلك","","","Danach gehen wir spazieren.","بعدَ ذلك نتنزَّه","zeit"),
 ("zuletzt","أخيراً","","","Zuletzt räume ich auf.","أخيراً أرتّب","zeit"),
 ("zwei","اثنان","","","Ich habe zwei Brüder.","لي أخوان","zahl"),
 ("drei","ثلاثة","","","Drei Kinder spielen draußen.","ثلاثةُ أطفالٍ يلعبونَ خارجاً","zahl"),
 ("vier","أربعة","","","Der Tisch hat vier Beine.","للطاولةِ أربعُ أرجل","zahl"),
 ("sechs","ستة","","","Ich stehe um sechs auf.","أنهضُ في السادسة","zahl"),
 ("sieben","سبعة","","","Die Woche hat sieben Tage.","الأسبوعُ سبعةُ أيام","zahl"),
 ("acht","ثمانية","","","Der Kurs beginnt um acht.","الدورةُ تبدأُ الثامنة","zahl"),
 ("neun","تسعة","","","Neun Euro, bitte.","تسعةُ يوروهات من فضلك","zahl"),
 ("zehn","عشرة","","","Ich brauche zehn Minuten.","أحتاجُ عشرَ دقائق","zahl"),
 ("zwanzig","عشرون","","","Das kostet zwanzig Euro.","هذا بعشرينَ يورو","zahl"),
 ("fünfzig","خمسون","","","Er ist fünfzig Jahre alt.","عمرُهُ خمسونَ سنة","zahl"),
 ("tausend","ألف","","","Tausend Wörter reichen für den Anfang.","ألفُ كلمةٍ تكفي للبداية","zahl"),
 ("die Hälfte","النصف","die","die Hälften","Ich nehme nur die Hälfte.","آخذُ النصفَ فقط","zahl"),
 ("das Viertel","الربع","das","die Viertel","Es ist Viertel nach acht.","الساعةُ الثامنةُ والربع","zahl"),
 ("erste","الأوّل","","","Der erste Tag war schwer.","كانَ اليومُ الأوّلُ صعباً","zahl"),
]

A1_HAUS_SCHULE = [
 ("das Wohnzimmer","غرفةُ الجلوس","das","die Wohnzimmer","Wir sitzen im Wohnzimmer.","نجلسُ في غرفةِ الجلوس","haus"),
 ("das Badezimmer","الحمّام","das","die Badezimmer","Das Badezimmer ist klein.","الحمّامُ صغير","haus"),
 ("die Toilette","المرحاض","die","die Toiletten","Wo ist die Toilette, bitte?","أينَ المرحاضُ من فضلك؟","haus"),
 ("der Flur","الرواق","der","die Flure","Die Schuhe stehen im Flur.","الأحذيةُ في الرواق","haus"),
 ("die Tür","الباب","die","die Türen","Mach bitte die Tür zu.","أغلقِ البابَ من فضلك","haus"),
 ("das Fenster","النافذة","das","die Fenster","Das Fenster ist offen.","النافذةُ مفتوحة","haus"),
 ("das Bett","السرير","das","die Betten","Das Bett ist bequem.","السريرُ مريح","haus"),
 ("der Stuhl","الكرسي","der","die Stühle","Nimm dir einen Stuhl.","خذْ كرسياً","haus"),
 ("der Schrank","الخزانة","der","die Schränke","Die Handtücher sind im Schrank.","المناشفُ في الخزانة","haus"),
 ("das Sofa","الأريكة","das","die Sofas","Das Sofa ist neu.","الأريكةُ جديدة","haus"),
 ("die Lampe","المصباح","die","die Lampen","Mach die Lampe an.","أشعلِ المصباح","haus"),
 ("der Boden","الأرضية","der","die Böden","Der Boden ist nass.","الأرضيةُ مبلَّلة","haus"),
 ("die Wand","الجدار","die","die Wände","An der Wand hängt ein Bild.","على الجدارِ صورة","haus"),
 ("der Garten","الحديقة","der","die Gärten","Im Garten wachsen Tomaten.","في الحديقةِ تنمو طماطم","haus"),
 ("der Schlüssel","المفتاح","der","die Schlüssel","Ich habe den Schlüssel vergessen.","نسيتُ المفتاح","haus"),
 ("die Miete zahlen","يدفعُ الإيجار","","","Ich zahle die Miete am Ersten.","أدفعُ الإيجارَ في الأول","haus"),
 ("das Buch","الكتاب","das","die Bücher","Das Buch ist spannend.","الكتابُ مشوِّق","schule"),
 ("das Heft","الكرّاس","das","die Hefte","Schreib das ins Heft.","اكتبْ هذا في الكرّاس","schule"),
 ("der Stift","القلم","der","die Stifte","Hast du einen Stift?","أمعكَ قلم؟","schule"),
 ("das Papier","الورق","das","die Papiere","Ich brauche ein Blatt Papier.","أحتاجُ ورقة","schule"),
 ("die Tafel","السبّورة","die","die Tafeln","Der Lehrer schreibt an die Tafel.","المعلّمُ يكتبُ على السبّورة","schule"),
 ("die Hausaufgabe","الواجبُ المنزلي","die","die Hausaufgaben","Die Hausaufgaben sind fertig.","الواجباتُ جاهزة","schule"),
 ("der Schüler","التلميذ","der","die Schüler","Der Schüler fragt viel.","التلميذُ يسألُ كثيراً","schule"),
 ("die Klasse","الصف","die","die Klassen","Unsere Klasse ist klein.","صفُّنا صغير","schule"),
 ("das Wort","الكلمة","das","die Wörter","Wie heißt das Wort auf Deutsch?","كيفَ تُقالُ الكلمةُ بالألمانية؟","schule"),
 ("der Satz","الجملة","der","die Sätze","Bilde einen Satz mit weil.","كوِّنْ جملةً بـweil","schule"),
 ("der Text","النص","der","die Texte","Lies den Text laut.","اقرأِ النصَّ بصوتٍ عالٍ","schule"),
 ("die Seite","الصفحة","die","die Seiten","Öffnet Seite zwanzig!","افتحوا الصفحةَ عشرين!","schule"),
 ("lesen","يقرأ","","","Ich lese jeden Abend.","أقرأُ كلَّ مساء","verb"),
 ("schreiben","يكتب","","","Schreib mir bitte eine Mail.","اكتبْ لي بريداً من فضلك","verb"),
 ("hören","يسمع","","","Hörst du die Musik?","أتسمعُ الموسيقى؟","verb"),
 ("sehen","يرى","","","Ich sehe dich morgen.","أراكَ غداً","verb"),
 ("gehen","يذهب","","","Ich gehe zu Fuß.","أذهبُ مشياً","verb"),
 ("machen","يفعل / يصنع","","","Was machst du gerade?","ماذا تفعلُ الآن؟","verb"),
 ("geben","يعطي","","","Gib mir bitte das Salz.","أعطِني الملحَ من فضلك","verb"),
 ("nehmen","يأخذ","","","Ich nehme den Bus.","آخذُ الحافلة","verb"),
 ("sagen","يقول","","","Was hast du gesagt?","ماذا قلت؟","verb"),
 ("bringen","يُحضِر","","","Bring bitte Brot mit.","أحضِرْ خبزاً معك","verb"),
 ("helfen","يساعد","","","Kannst du mir helfen?","أيمكنكَ مساعدتي؟","verb"),
 ("brauchen","يحتاج","","","Ich brauche mehr Zeit.","أحتاجُ وقتاً أكثر","verb"),
 ("wissen","يعلم","","","Ich weiß es nicht.","لا أعلم","verb"),
 ("kennen","يعرِفُ شخصاً","","","Kennst du diese Frau?","أتعرفُ هذه المرأة؟","verb"),
 ("denken","يفكّر","","","Ich denke oft an dich.","أفكّرُ فيكَ كثيراً","verb"),
 ("bleiben","يبقى","","","Ich bleibe heute zu Hause.","أبقى اليومَ في البيت","verb"),
 ("öffnen","يفتح","","","Öffne bitte das Fenster.","افتحِ النافذةَ من فضلك","verb"),
 ("schließen","يُغلق","","","Die Bank schließt um vier.","البنكُ يُغلقُ الرابعة","verb"),
 ("anfangen","يبدأ","","","Der Film fängt gleich an.","الفيلمُ يبدأُ حالاً","verb"),
 ("aufhören","يتوقّف","","","Hör bitte auf!","توقّفْ من فضلك!","verb"),
 ("vergessen","ينسى","","","Ich habe den Termin vergessen.","نسيتُ الموعد","verb"),
 ("erinnern","يُذكِّر","","","Erinnere mich bitte daran.","ذكّرْني بذلك","verb"),
 ("warten","ينتظر","","","Ich warte seit zehn Minuten.","أنتظرُ منذُ عشرِ دقائق","verb"),
 ("spielen","يلعب","","","Die Kinder spielen im Park.","الأطفالُ يلعبونَ في المنتزه","verb"),
 ("wer","مَن","","","Wer ist das?","مَن هذا؟","frage"),
 ("was","ماذا","","","Was möchtest du?","ماذا تريد؟","frage"),
 ("wo","أين","","","Wo wohnst du?","أينَ تسكن؟","frage"),
 ("wohin","إلى أين","","","Wohin gehst du?","إلى أينَ تذهب؟","frage"),
 ("woher","من أين","","","Woher kommst du?","من أينَ أنت؟","frage"),
 ("wann","متى","","","Wann kommt der Zug?","متى يأتي القطار؟","frage"),
 ("warum","لماذا","","","Warum lernst du Deutsch?","لماذا تتعلَّمُ الألمانية؟","frage"),
 ("wie","كيف","","","Wie geht es Ihnen?","كيفَ حالُك؟","frage"),
 ("wie viel","كم (للكمية)","","","Wie viel kostet das?","كم يكلّفُ هذا؟","frage"),
 ("welcher","أيّ","","","Welcher Bus fährt zum Bahnhof?","أيُّ حافلةٍ تذهبُ إلى المحطة؟","frage"),
 ("der Sohn","الابن","der","die Söhne","Mein Sohn geht zur Schule.","ابني يذهبُ إلى المدرسة","familie"),
 ("die Tochter","الابنة","die","die Töchter","Meine Tochter ist fünf.","ابنتي في الخامسة","familie"),
 ("der Ehemann","الزوج","der","die Ehemänner","Ihr Ehemann arbeitet im Ausland.","زوجُها يعملُ في الخارج","familie"),
 ("die Ehefrau","الزوجة","die","die Ehefrauen","Seine Ehefrau ist Ärztin.","زوجتُهُ طبيبة","familie"),
 ("die Großmutter","الجدّة","die","die Großmütter","Meine Großmutter erzählt gern.","جدّتي تحبُّ الحكي","familie"),
 ("der Großvater","الجدّ","der","die Großväter","Mein Großvater ist achtzig.","جدّي في الثمانين","familie"),
 ("der Onkel","العمّ / الخال","der","die Onkel","Mein Onkel wohnt in Sfax.","عمّي يسكنُ في صفاقس","familie"),
 ("die Tante","العمّة / الخالة","die","die Tanten","Meine Tante kocht sehr gut.","خالتي تطبخُ ممتازاً","familie"),
 ("der Nachname","اسمُ العائلة","der","die Nachnamen","Wie ist Ihr Nachname?","ما اسمُ عائلتِك؟","familie"),
 ("ledig","أعزب","","","Ich bin ledig.","أنا أعزب","familie"),
 ("verheiratet","متزوّج","","","Sie ist seit zwei Jahren verheiratet.","هي متزوّجةٌ منذُ سنتَين","familie"),
 ("das Alter","العمر","das","","Wie ist Ihr Alter?","كم عمرُك؟","familie"),
 ("groß","كبير / طويل","","","Mein Bruder ist sehr groß.","أخي طويلٌ جداً","eigenschaft"),
 ("klein","صغير","","","Die Wohnung ist zu klein.","الشقةُ صغيرةٌ جداً","eigenschaft"),
 ("schön","جميل","","","Das ist ein schönes Foto.","هذه صورةٌ جميلة","eigenschaft"),
 ("schlecht","سيّئ","","","Das Wetter ist schlecht.","الطقسُ سيّئ","eigenschaft"),
 ("richtig","صحيح","","","Deine Antwort ist richtig.","جوابُكَ صحيح","eigenschaft"),
 ("falsch","خطأ","","","Das ist leider falsch.","هذا خطأٌ للأسف","eigenschaft"),
 ("schwer","صعب / ثقيل","","","Die Aufgabe ist schwer.","المهمّةُ صعبة","eigenschaft"),
 ("leicht","سهل / خفيف","","","Die Prüfung war leicht.","كانَ الامتحانُ سهلاً","eigenschaft"),
 ("wichtig","مهم","","","Das ist sehr wichtig.","هذا مهمٌّ جداً","eigenschaft"),
 ("ruhig","هادئ","","","Bitte sei ruhig!","كنْ هادئاً من فضلك!","eigenschaft"),
 ("laut","صاخب / بصوتٍ عالٍ","","","Die Musik ist zu laut.","الموسيقى صاخبةٌ جداً","eigenschaft"),
 ("schnell","سريع","","","Er spricht zu schnell.","يتكلَّمُ بسرعةٍ كبيرة","eigenschaft"),
 ("langsam","بطيء","","","Sprich bitte langsam.","تكلَّمْ ببطءٍ من فضلك","eigenschaft"),
 ("voll","ممتلئ","","","Der Bus ist voll.","الحافلةُ ممتلئة","eigenschaft"),
 ("leer","فارغ","","","Die Flasche ist leer.","القارورةُ فارغة","eigenschaft"),
 ("gleich","حالاً / متماثل","","","Ich komme gleich.","آتي حالاً","eigenschaft"),
 ("zusammen","معاً","","","Wir lernen zusammen.","نتعلَّمُ معاً","eigenschaft"),
 ("allein","وحده","","","Ich wohne allein.","أسكنُ وحدي","eigenschaft"),
 ("vielleicht","ربّما","","","Vielleicht komme ich später.","ربّما آتي لاحقاً","eigenschaft"),
 ("natürlich","بالطبع","","","Natürlich helfe ich dir.","بالطبعِ أساعدُك","eigenschaft"),
 ("leider","للأسف","","","Leider habe ich keine Zeit.","للأسفِ لا وقتَ لديّ","eigenschaft"),
 ("gern","بسرور","","","Ich trinke gern Tee.","أحبُّ شربَ الشاي","eigenschaft"),
]

NEUE_DECKS = [
 ("a1-zeit-zahlen", "A1", "الوقت والأيام والشهور والأرقام", A1_ZEIT),
 ("a1-haus-schule", "A1", "البيت والمدرسة والأفعال الأساسية وأدوات السؤال", A1_HAUS_SCHULE),
]

def main():
    v = json.load(open(P, encoding="utf8"))
    vorhanden = {c["de"] for d in v.values() for c in d["cards"]}
    alleIds = {c["id"] for d in v.values() for c in d["cards"]}
    n, doppelt = 0, []
    for deckId, level, titel, zeilen in NEUE_DECKS:
        karten = []
        for j, (de, ar, art, plural, exDe, exAr, tag) in enumerate(zeilen):
            if de in vorhanden:
                doppelt.append(de); continue
            vorhanden.add(de)
            kid = f"vx-{deckId[3:8]}-{j:03d}"
            assert kid not in alleIds, kid
            alleIds.add(kid)
            k = {"id": kid, "de": de, "ar": ar}
            if art: k["article"] = art
            if plural: k["plural"] = plural
            k["exampleDe"] = exDe; k["exampleAr"] = exAr
            k["level"] = level; k["tags"] = [tag]
            bild = re.sub(r"[^a-z]", "", de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss")) + ".png"
            if bild in BILDER: k["img"] = "/cards/" + bild
            karten.append(k); n += 1
        v[deckId] = {"id": deckId, "titleAr": titel, "level": level, "cards": karten}
        print(f"  {deckId}: {len(karten)} بطاقة")
    json.dump(v, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    import collections
    c = collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("أُضيفَ:", n, "| مكرَّرٌ تُجُنِّب:", len(doppelt), doppelt[:10])
    print("التوزيعُ الآن:", dict(c), "| المجموع:", sum(c.values()))

if __name__ == "__main__":
    main()
