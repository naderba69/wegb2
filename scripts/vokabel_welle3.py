#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثالثة: الطبيعةُ والحيوانُ والهوايةُ والمشاعرُ وشؤونُ البيت — ما تبقّى من نواةِ A1، ورقعةُ A2."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A1_NATUR_FREIZEIT = [
 ("die Natur","الطبيعة","die","","In der Natur bin ich ruhig.","في الطبيعةِ أهدأ","natur"),
 ("der Baum","الشجرة","der","die Bäume","Vor dem Haus steht ein Baum.","أمامَ البيتِ شجرة","natur"),
 ("die Blume","الزهرة","die","die Blumen","Ich kaufe Blumen für meine Mutter.","أشتري زهوراً لأمّي","natur"),
 ("das Gras","العشب","das","","Das Gras ist noch nass.","العشبُ ما زالَ مبلَّلاً","natur"),
 ("der Berg","الجبل","der","die Berge","Wir wandern auf den Berg.","نتسلَّقُ الجبلَ مشياً","natur"),
 ("das Meer","البحر","das","die Meere","Das Meer ist heute ruhig.","البحرُ هادئٌ اليوم","natur"),
 ("der Strand","الشاطئ","der","die Strände","Am Strand ist es windig.","على الشاطئِ ريح","natur"),
 ("der Fluss","النهر","der","die Flüsse","Der Fluss ist tief.","النهرُ عميق","natur"),
 ("der See","البحيرة","der","die Seen","Im Sommer schwimmen wir im See.","في الصيفِ نسبحُ في البحيرة","natur"),
 ("der Wald","الغابة","der","die Wälder","Der Wald beginnt hinter dem Dorf.","الغابةُ خلفَ القرية","natur"),
 ("der Himmel","السماء","der","","Der Himmel ist heute klar.","السماءُ صافيةٌ اليوم","natur"),
 ("der Mond","القمر","der","die Monde","Der Mond ist groß heute Nacht.","القمرُ كبيرٌ الليلة","natur"),
 ("der Stern","النجم","der","die Sterne","Man sieht viele Sterne.","تُرى نجومٌ كثيرة","natur"),
 ("die Luft","الهواء","die","","Die Luft ist hier sauber.","الهواءُ نظيفٌ هنا","natur"),
 ("die Erde","الأرض / التراب","die","","Die Erde ist trocken.","الأرضُ جافّة","natur"),
 ("das Tier","الحيوان","das","die Tiere","Welches Tier magst du?","أيَّ حيوانٍ تحب؟","tier"),
 ("der Vogel","الطائر","der","die Vögel","Ein Vogel sitzt am Fenster.","طائرٌ على النافذة","tier"),
 ("das Pferd","الحصان","das","die Pferde","Das Pferd läuft schnell.","الحصانُ يركضُ سريعاً","tier"),
 ("die Kuh","البقرة","die","die Kühe","Die Kuh gibt Milch.","البقرةُ تعطي حليباً","tier"),
 ("das Schaf","الخروف","das","die Schafe","Auf dem Feld sind Schafe.","في الحقلِ خِراف","tier"),
 ("die Maus","الفأر","die","die Mäuse","Die Katze jagt die Maus.","القطُّ يطاردُ الفأر","tier"),
 ("der Fisch schwimmt","السمكةُ تسبح","","","Der Fisch schwimmt im Wasser.","السمكةُ تسبحُ في الماء","tier"),
 ("der Sport","الرياضة","der","","Sport ist gesund.","الرياضةُ صحّة","freizeit"),
 ("der Fußball","كرةُ القدم","der","die Fußbälle","Fußball ist sehr beliebt.","كرةُ القدمِ محبوبةٌ جداً","freizeit"),
 ("schwimmen","يسبح","","","Ich schwimme zweimal pro Woche.","أسبحُ مرّتَينِ أسبوعياً","freizeit"),
 ("tanzen","يرقص","","","Sie tanzt sehr gut.","ترقصُ جيداً جداً","freizeit"),
 ("singen","يغنّي","","","Die Kinder singen ein Lied.","الأطفالُ يُنشدونَ أغنية","freizeit"),
 ("das Lied","الأغنية","das","die Lieder","Das Lied kenne ich.","أعرفُ هذه الأغنية","freizeit"),
 ("die Musik","الموسيقى","die","","Ich höre gern Musik.","أحبُّ سماعَ الموسيقى","freizeit"),
 ("das Hobby","الهواية","das","die Hobbys","Mein Hobby ist Lesen.","هوايتي القراءة","freizeit"),
 ("das Spiel","اللعبة / المباراة","das","die Spiele","Das Spiel beginnt um acht.","المباراةُ تبدأُ الثامنة","freizeit"),
 ("der Film","الفيلم","der","die Filme","Der Film war spannend.","كانَ الفيلمُ مشوِّقاً","freizeit"),
 ("das Foto","الصورة","das","die Fotos","Mach ein Foto von uns!","التقطْ صورةً لنا!","freizeit"),
 ("reisen","يسافر","","","Ich reise gern allein.","أحبُّ السفرَ وحدي","freizeit"),
 ("besuchen","يزور","","","Ich besuche meine Oma.","أزورُ جدّتي","freizeit"),
 ("treffen","يلتقي","","","Wir treffen uns im Café.","نلتقي في المقهى","freizeit"),
 ("spazieren gehen","يتنزَّهُ مشياً","","","Wir gehen abends spazieren.","نتنزَّهُ مساءً","freizeit"),
 ("die Freizeit","وقتُ الفراغ","die","","In meiner Freizeit lese ich.","في وقتِ فراغي أقرأ","freizeit"),
 ("das Glück","السعادة / الحظ","das","","Ich hatte großes Glück.","كانَ حظّي عظيماً","gefuehl"),
 ("glücklich","سعيد","","","Ich bin heute glücklich.","أنا سعيدٌ اليوم","gefuehl"),
 ("traurig","حزين","","","Warum bist du traurig?","لماذا أنتَ حزين؟","gefuehl"),
 ("böse","غاضب","","","Bist du böse auf mich?","أأنتَ غاضبٌ منّي؟","gefuehl"),
 ("nervös","متوتّر","","","Vor der Prüfung bin ich nervös.","قبلَ الامتحانِ أتوتَّر","gefuehl"),
 ("zufrieden","راضٍ","","","Ich bin mit dem Ergebnis zufrieden.","أنا راضٍ بالنتيجة","gefuehl"),
 ("lachen","يضحك","","","Wir haben viel gelacht.","ضحكنا كثيراً","gefuehl"),
 ("weinen","يبكي","","","Das Kind weint.","الطفلُ يبكي","gefuehl"),
 ("lieben","يحبّ","","","Ich liebe meine Familie.","أحبُّ عائلتي","gefuehl"),
 ("mögen","يستلطف","","","Ich mag diesen Film.","يعجبُني هذا الفيلم","gefuehl"),
 ("hassen","يكره","","","Ich hasse Warten.","أكرهُ الانتظار","gefuehl"),
 ("Angst haben","يخاف","","","Ich habe Angst vor Hunden.","أخافُ من الكلاب","gefuehl"),
 ("die Seife","الصابون","die","die Seifen","Die Seife ist alle.","انتهى الصابون","haushalt"),
 ("das Handtuch","المنشفة","das","die Handtücher","Nimm ein sauberes Handtuch.","خذْ منشفةً نظيفة","haushalt"),
 ("die Zahnbürste","فرشاةُ الأسنان","die","die Zahnbürsten","Meine Zahnbürste ist neu.","فرشاةُ أسناني جديدة","haushalt"),
 ("duschen","يستحمّ","","","Ich dusche jeden Morgen.","أستحمُّ كلَّ صباح","haushalt"),
 ("kehren","يكنس","","","Ich kehre die Küche.","أكنسُ المطبخ","haushalt"),
 ("die Wäsche","الغسيل","die","","Die Wäsche ist trocken.","الغسيلُ جافّ","haushalt"),
 ("bügeln","يكوي","","","Ich bügle die Hemden.","أكوي القمصان","haushalt"),
 ("der Herd","الموقد","der","die Herde","Der Herd ist noch heiß.","الموقدُ ما زالَ ساخناً","haushalt"),
 ("der Topf","القِدر","der","die Töpfe","Der Topf steht auf dem Herd.","القِدرُ على الموقد","haushalt"),
 ("die Pfanne","المقلاة","die","die Pfannen","Die Pfanne ist schmutzig.","المقلاةُ متّسخة","haushalt"),
 ("schneiden","يقطع","","","Schneide das Brot, bitte.","اقطعِ الخبزَ من فضلك","haushalt"),
 ("das Regal","الرفّ","das","die Regale","Die Bücher stehen im Regal.","الكتبُ على الرفّ","haushalt"),
]

A2_ERWEITERUNG = [
 ("die Gewohnheit","العادة","die","die Gewohnheiten","Frühes Aufstehen ist eine gute Gewohnheit.","النهوضُ باكراً عادةٌ حسنة","alltag"),
 ("der Vorteil","الميزة","der","die Vorteile","Der Vorteil ist die Nähe zur Arbeit.","الميزةُ قربُهُ من العمل","meinung"),
 ("der Nachteil","العيب","der","die Nachteile","Ein Nachteil ist der Lärm.","من العيوبِ الضجيج","meinung"),
 ("der Grund","السبب","der","die Gründe","Was ist der Grund dafür?","ما سببُ ذلك؟","meinung"),
 ("das Ergebnis","النتيجة","das","die Ergebnisse","Das Ergebnis war besser als erwartet.","كانتِ النتيجةُ أفضلَ من المتوقَّع","meinung"),
 ("der Unterschied","الفرق","der","die Unterschiede","Der Unterschied ist klein.","الفرقُ صغير","meinung"),
 ("die Möglichkeit","الإمكانية","die","die Möglichkeiten","Es gibt eine zweite Möglichkeit.","هناكَ إمكانيةٌ ثانية","meinung"),
 ("die Entscheidung","القرار","die","die Entscheidungen","Die Entscheidung war schwer.","كانَ القرارُ صعباً","meinung"),
 ("sich entscheiden","يقرّر","","","Ich habe mich für den Kurs entschieden.","قرَّرتُ الالتحاقَ بالدورة","meinung"),
 ("empfehlen","ينصح","","","Ich empfehle dir dieses Buch.","أنصحُكَ بهذا الكتاب","meinung"),
 ("vergleichen","يقارن","","","Vergleiche die beiden Angebote.","قارِنْ بينَ العرضَين","meinung"),
 ("bedeuten","يعني","","","Was bedeutet dieses Wort?","ماذا تعني هذه الكلمة؟","meinung"),
 ("erlauben","يسمح","","","Das ist hier nicht erlaubt.","هذا غيرُ مسموحٍ هنا","meinung"),
 ("verbieten","يمنع","","","Rauchen ist verboten.","التدخينُ ممنوع","meinung"),
 ("sich gewöhnen an","يعتادُ على","","","Ich habe mich an das Wetter gewöhnt.","اعتدتُ على الطقس","alltag"),
 ("sich kümmern um","يعتني بـ","","","Ich kümmere mich um die Kinder.","أعتني بالأطفال","alltag"),
 ("sich interessieren für","يهتمُّ بـ","","","Ich interessiere mich für Technik.","أهتمُّ بالتقنية","alltag"),
 ("achten auf","ينتبهُ إلى","","","Achte auf die Schilder!","انتبهْ إلى اللافتات!","alltag"),
 ("aufpassen","يحترس / يراقب","","","Pass auf, das ist heiß!","احترسْ، هذا ساخن!","alltag"),
 ("versprechen","يَعِد","","","Ich verspreche es dir.","أَعِدُكَ بذلك","alltag"),
 ("die Verabredung","الموعدُ الشخصي","die","die Verabredungen","Ich habe eine Verabredung um sieben.","لديَّ موعدٌ في السابعة","alltag"),
 ("die Gelegenheit","الفرصة","die","die Gelegenheiten","Das ist eine gute Gelegenheit.","هذه فرصةٌ جيدة","alltag"),
 ("die Bedingung","الشرط","die","die Bedingungen","Unter einer Bedingung: du hilfst mit.","بشرطٍ واحد: أن تساعد","alltag"),
 ("der Zweck","الغرض","der","die Zwecke","Was ist der Zweck des Treffens?","ما غرضُ اللقاء؟","alltag"),
 ("die Wirkung","الأثر","die","die Wirkungen","Die Wirkung kommt nach zwei Tagen.","الأثرُ يظهرُ بعدَ يومَين","alltag"),
 ("die Erfindung","الاختراع","die","die Erfindungen","Das Rad war eine große Erfindung.","العجلةُ اختراعٌ عظيم","technik"),
 ("der Bildschirm","الشاشة","der","die Bildschirme","Der Bildschirm ist kaputt.","الشاشةُ معطَّلة","technik"),
 ("die Tastatur","لوحةُ المفاتيح","die","die Tastaturen","Die Tastatur klemmt.","لوحةُ المفاتيحِ عالقة","technik"),
 ("speichern","يحفظُ ملفاً","","","Vergiss nicht zu speichern.","لا تنسَ الحفظ","technik"),
 ("löschen","يحذف","","","Ich habe die Datei gelöscht.","حذفتُ الملف","technik"),
 ("herunterladen","يُنزّل","","","Lade die App herunter.","نزِّلِ التطبيق","technik"),
 ("die Verbindung","الاتصال","die","die Verbindungen","Die Verbindung ist schlecht.","الاتصالُ ضعيف","technik"),
 ("das Gerät","الجهاز","das","die Geräte","Das Gerät funktioniert nicht.","الجهازُ لا يعمل","technik"),
 ("der Strom sparen","يقتصدُ الكهرباء","","","Wir wollen Strom sparen.","نريدُ اقتصادَ الكهرباء","umwelt"),
 ("die Mülltrennung","فرزُ النفايات","die","","Mülltrennung ist hier Pflicht.","فرزُ النفاياتِ واجبٌ هنا","umwelt"),
 ("das Klima","المناخ","das","","Das Klima verändert sich.","المناخُ يتغيَّر","umwelt"),
 ("schützen","يحمي","","","Wir müssen die Umwelt schützen.","علينا حمايةُ البيئة","umwelt"),
 ("verschmutzen","يلوّث","","","Plastik verschmutzt das Meer.","البلاستيكُ يلوّثُ البحر","umwelt"),
 ("die Gesundheit","الصحّة","die","","Gesundheit ist wichtiger als Geld.","الصحّةُ أهمُّ من المال","gesundheit"),
 ("sich erholen","يستجمّ","","","Im Urlaub erhole ich mich.","في الإجازةِ أستجمّ","gesundheit"),
 ("die Behandlung","العلاج","die","die Behandlungen","Die Behandlung dauert drei Wochen.","العلاجُ ثلاثةُ أسابيع","gesundheit"),
 ("die Beschwerden","الأوجاع / الشكاوى","die","","Ich habe Beschwerden im Rücken.","لديَّ أوجاعٌ في الظهر","gesundheit"),
 ("untersuchen","يفحص","","","Der Arzt untersucht mich morgen.","الطبيبُ يفحصُني غداً","gesundheit"),
 ("die Vorsorge","الوقاية","die","","Vorsorge ist besser als Heilung.","الوقايةُ خيرٌ من العلاج","gesundheit"),
 ("die Ernährung","التغذية","die","","Gesunde Ernährung braucht Planung.","التغذيةُ الصحّيةُ تحتاجُ تخطيطاً","gesundheit"),
 ("abnehmen","ينقصُ وزناً","","","Ich möchte fünf Kilo abnehmen.","أريدُ إنقاصَ خمسةِ كيلوات","gesundheit"),
 ("zunehmen","يزيدُ وزناً","","","Im Winter nehme ich zu.","في الشتاءِ يزيدُ وزني","gesundheit"),
 ("der Notfall","الحالةُ الطارئة","der","die Notfälle","Im Notfall rufen Sie 112.","في الطوارئ اتّصلْ بـ112","gesundheit"),
 ("der Unfall","الحادث","der","die Unfälle","Auf der Autobahn war ein Unfall.","على الطريقِ السريعِ حادث","verkehr"),
 ("die Vorfahrt","أوّليةُ المرور","die","","Hier hat rechts Vorfahrt.","هنا الأوّليةُ لليمين","verkehr"),
 ("die Geschwindigkeit","السرعة","die","die Geschwindigkeiten","Die Geschwindigkeit ist begrenzt.","السرعةُ محدودة","verkehr"),
 ("der Stau","الازدحام","der","die Staus","Wir standen eine Stunde im Stau.","بقينا ساعةً في الازدحام","verkehr"),
 ("die Verbindung verpassen","يفوتُهُ الموعدُ في النقل","","","Ich habe die Verbindung verpasst.","فاتَني الربطُ في السفر","verkehr"),
 ("der Fahrplan","جدولُ المواعيد","der","die Fahrpläne","Der Fahrplan hat sich geändert.","تغيَّرَ جدولُ المواعيد","verkehr"),
 ("die Strafe","العقوبة / الغرامة","die","die Strafen","Die Strafe kostet vierzig Euro.","الغرامةُ أربعونَ يورو","verkehr"),
 ("die Genehmigung","الترخيص","die","die Genehmigungen","Die Genehmigung kommt per Post.","الترخيصُ يصلُ بالبريد","behoerde"),
 ("die Bestätigung abwarten","ينتظرُ التأكيد","","","Bitte die Bestätigung abwarten.","انتظرِ التأكيدَ من فضلك","behoerde"),
 ("zuständig","مختصّ","","","Wer ist dafür zuständig?","مَن المختصُّ بهذا؟","behoerde"),
 ("die Auskunft","الاستعلام","die","die Auskünfte","Die Auskunft ist im Erdgeschoss.","الاستعلاماتُ في الطابقِ الأرضي","behoerde"),
 ("das Erdgeschoss","الطابقُ الأرضي","das","die Erdgeschosse","Das Büro liegt im Erdgeschoss.","المكتبُ في الطابقِ الأرضي","behoerde"),
]

NEUE_DECKS = [
 ("a1-natur-freizeit", "A1", "الطبيعة والحيوان والهواية والمشاعر وشؤون البيت", A1_NATUR_FREIZEIT),
 ("a2-leben-technik", "A2", "الرأي والعادات والتقنية والبيئة والصحّة والمرور", A2_ERWEITERUNG),
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
            kid = f"vy-{deckId[3:8]}-{j:03d}"
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
