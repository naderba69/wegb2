#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ السادسة: تسمينُ A2 — الشخصيةُ والعلاقاتُ · السفرُ والضيافةُ والأعياد · الإعلامُ والمدرسةُ والأفعالُ بحروفِها."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A2_MENSCH = [
 ("der Charakter","الطبع","der","die Charaktere","Sie hat einen ruhigen Charakter.","لها طبعٌ هادئ","person"),
 ("die Eigenschaft","الصفة","die","die Eigenschaften","Geduld ist eine gute Eigenschaft.","الصبرُ صفةٌ حسنة","person"),
 ("geduldig","صبور","","","Sei bitte geduldig mit mir.","كنْ صبوراً معي","person"),
 ("ungeduldig","نافدُ الصبر","","","Im Stau werde ich ungeduldig.","في الازدحامِ ينفدُ صبري","person"),
 ("ehrlich","صادق","","","Sag mir ehrlich deine Meinung.","قلْ لي رأيَكَ بصدق","person"),
 ("großzügig","كريم","","","Mein Onkel ist sehr großzügig.","عمّي كريمٌ جداً","person"),
 ("sparsam","مقتصِد","","","Sie lebt sehr sparsam.","تعيشُ باقتصادٍ شديد","person"),
 ("ordentlich","منظَّم","","","Er ist ein ordentlicher Mensch.","هو إنسانٌ منظَّم","person"),
 ("chaotisch","فوضوي","","","Mein Schreibtisch ist chaotisch.","مكتبي فوضوي","person"),
 ("schüchtern","خجول","","","Am Anfang war ich schüchtern.","في البدايةِ كنتُ خجولاً","person"),
 ("selbstbewusst","واثقٌ بنفسه","","","Sprich selbstbewusst in der Prüfung.","تكلَّمْ بثقةٍ في الامتحان","person"),
 ("neidisch","حسود","","","Sei nicht neidisch auf andere.","لا تحسدِ الآخرين","person"),
 ("stur","عنيد","","","Mein Bruder ist ziemlich stur.","أخي عنيدٌ إلى حدٍّ ما","person"),
 ("hilfsbereit","مستعدٌّ للمساعدة","","","Die Nachbarn sind sehr hilfsbereit.","الجيرانُ مستعدّونَ للمساعدة","person"),
 ("die Geduld","الصبر","die","","Für Deutsch braucht man Geduld.","الألمانيةُ تحتاجُ صبراً","person"),
 ("die Beziehung","العلاقة","die","die Beziehungen","Wir haben eine gute Beziehung.","بيننا علاقةٌ جيدة","person"),
 ("die Freundschaft","الصداقة","die","die Freundschaften","Freundschaft braucht Zeit.","الصداقةُ تحتاجُ وقتاً","person"),
 ("sich verstehen","يتفاهمان","","","Wir verstehen uns sehr gut.","نتفاهمُ جيداً جداً","person"),
 ("sich streiten","يتشاجران","","","Sie streiten sich oft über Geld.","يتشاجرانِ كثيراً على المال","person"),
 ("sich versöhnen","يتصالحان","","","Nach einer Stunde haben sie sich versöhnt.","بعدَ ساعةٍ تصالحا","person"),
 ("vertrauen","يثق","","","Ich vertraue dir.","أثقُ بك","person"),
 ("enttäuscht","خائبُ الأمل","","","Ich war von ihm enttäuscht.","خابَ أملي فيه","person"),
 ("stolz","فخور","","","Meine Eltern sind stolz auf mich.","والداي فخورانِ بي","person"),
 ("eifersüchtig","غيور","","","Er ist schnell eifersüchtig.","يغارُ سريعاً","person"),
 ("die Liebe","المحبّة","die","","Liebe braucht Ehrlichkeit.","المحبّةُ تحتاجُ صدقاً","person"),
 ("die Hochzeit","الزفاف","die","die Hochzeiten","Die Hochzeit ist im Juni.","الزفافُ في يونيو","person"),
 ("die Scheidung","الطلاق","die","die Scheidungen","Die Scheidung war schwierig.","كانَ الطلاقُ صعباً","person"),
 ("der Verwandte","القريب","der","die Verwandten","Meine Verwandten wohnen weit.","أقاربي يسكنونَ بعيداً","person"),
 ("das Vertrauen","الثقة","das","","Vertrauen kommt langsam.","الثقةُ تأتي ببطء","person"),
 ("sich entschuldigen für","يعتذرُ عن","","","Ich entschuldige mich für die Verspätung.","أعتذرُ عن التأخير","person"),
]

A2_REISE_FEST = [
 ("die Unterlagen prüfen","يفحصُ الوثائق","","","Am Flughafen prüfen sie die Unterlagen.","في المطارِ يفحصونَ الوثائق","reise"),
 ("der Abflug","الإقلاع","der","die Abflüge","Der Abflug ist um sechs.","الإقلاعُ في السادسة","reise"),
 ("die Landung","الهبوط","die","die Landungen","Die Landung war ruhig.","كانَ الهبوطُ هادئاً","reise"),
 ("das Handgepäck","حقيبةُ اليد","das","","Handgepäck ist kostenlos.","حقيبةُ اليدِ مجانية","reise"),
 ("einchecken","يسجّلُ الدخول","","","Wir checken online ein.","نسجّلُ الدخولَ عبرَ الإنترنت","reise"),
 ("die Grenzkontrolle","مراقبةُ الحدود","die","","Die Grenzkontrolle dauerte lang.","استغرقت مراقبةُ الحدودِ طويلاً","reise"),
 ("die Rezeption","الاستقبال","die","die Rezeptionen","Der Schlüssel ist an der Rezeption.","المفتاحُ في الاستقبال","reise"),
 ("das Einzelzimmer","غرفةٌ مفردة","das","die Einzelzimmer","Ich hätte gern ein Einzelzimmer.","أودُّ غرفةً مفردة","reise"),
 ("das Doppelzimmer","غرفةٌ مزدوجة","das","die Doppelzimmer","Wir nehmen ein Doppelzimmer.","نأخذُ غرفةً مزدوجة","reise"),
 ("inklusive","شامل","","","Frühstück inklusive.","الفطورُ مشمول","reise"),
 ("die Übernachtung","المبيت","die","die Übernachtungen","Die Übernachtung kostet achtzig Euro.","المبيتُ بثمانينَ يورو","reise"),
 ("das Reiseziel","وجهةُ السفر","das","die Reiseziele","Unser Reiseziel ist Hamburg.","وجهتُنا هامبورغ","reise"),
 ("die Rundfahrt","الجولة","die","die Rundfahrten","Die Rundfahrt dauert zwei Stunden.","الجولةُ ساعتان","reise"),
 ("der Reiseführer","الدليلُ السياحي","der","die Reiseführer","Der Reiseführer erklärt die Geschichte.","الدليلُ يشرحُ التاريخ","reise"),
 ("die Aussicht","الإطلالة","die","die Aussichten","Von hier ist die Aussicht toll.","الإطلالةُ من هنا رائعة","reise"),
 ("sich verlaufen","يضلُّ الطريق","","","Wir haben uns in der Altstadt verlaufen.","ضللنا في المدينةِ القديمة","reise"),
 ("der Notausgang","مخرجُ الطوارئ","der","die Notausgänge","Der Notausgang ist links.","مخرجُ الطوارئ يساراً","reise"),
 ("die Verpflegung","الإعاشة","die","","Die Verpflegung war gut.","كانتِ الإعاشةُ جيدة","reise"),
 ("das Trinkgeld","البقشيش","das","die Trinkgelder","In Deutschland gibt man Trinkgeld.","في ألمانيا يُعطى بقشيش","reise"),
 ("die Tradition","التقليد","die","die Traditionen","Das ist eine alte Tradition.","هذا تقليدٌ قديم","fest"),
 ("der Brauch","العُرف","der","die Bräuche","Jeder Ort hat eigene Bräuche.","لكلِّ مكانٍ أعرافُه","fest"),
 ("das Weihnachten","عيدُ الميلاد المجيد","das","","An Weihnachten sind Geschäfte zu.","في عيدِ الميلادِ المحلّاتُ مغلقة","fest"),
 ("das Ramadanfest","عيدُ الفطر","das","","Zum Ramadanfest besuchen wir die Familie.","في عيدِ الفطرِ نزورُ العائلة","fest"),
 ("gratulieren zum Fest","يهنّئُ بالعيد","","","Ich gratuliere dir zum Fest!","أهنّئكَ بالعيد!","fest"),
 ("einladen zu","يدعو إلى","","","Wir laden dich zum Essen ein.","ندعوكَ إلى الطعام","fest"),
 ("die Gastfreundschaft","كرمُ الضيافة","die","","Gastfreundschaft ist bei uns wichtig.","كرمُ الضيافةِ مهمٌّ عندنا","fest"),
 ("der Feiertag frei","عطلةٌ رسميةٌ بلا عمل","","","Am Feiertag ist die Firma zu.","في العطلةِ الرسميةِ الشركةُ مغلقة","fest"),
 ("die Dekoration","الزينة","die","die Dekorationen","Die Dekoration ist schön.","الزينةُ جميلة","fest"),
 ("die Vorbereitung","التحضير","die","die Vorbereitungen","Die Vorbereitung dauert Tage.","التحضيرُ يستغرقُ أياماً","fest"),
 ("vorbereiten","يحضّر","","","Ich bereite das Essen vor.","أحضّرُ الطعام","fest"),
]

A2_MEDIEN_SCHULE = [
 ("die Zeitschrift","المجلّة","die","die Zeitschriften","Ich lese eine Zeitschrift im Zug.","أقرأُ مجلّةً في القطار","medien"),
 ("die Sendung","البرنامج (إذاعي/تلفزي)","die","die Sendungen","Die Sendung beginnt um acht.","البرنامجُ يبدأُ الثامنة","medien"),
 ("der Bericht","التقرير","der","die Berichte","Der Bericht war interessant.","كانَ التقريرُ مثيراً","medien"),
 ("die Werbung","الإعلان","die","","Die Werbung nervt mich.","الإعلاناتُ تزعجُني","medien"),
 ("die Quelle","المصدر","die","die Quellen","Prüfe zuerst die Quelle.","تحقّقْ من المصدرِ أوّلاً","medien"),
 ("die Information","المعلومة","die","die Informationen","Diese Information ist falsch.","هذه المعلومةُ خاطئة","medien"),
 ("berichten","يخبر / يروي","","","Die Zeitung berichtet über den Streik.","الجريدةُ تنقلُ عن الإضراب","medien"),
 ("veröffentlichen","ينشر","","","Die Ergebnisse werden morgen veröffentlicht.","النتائجُ تُنشَرُ غداً","medien"),
 ("das soziale Netzwerk","الشبكةُ الاجتماعية","das","","Soziale Netzwerke kosten viel Zeit.","الشبكاتُ الاجتماعيةُ تأكلُ الوقت","medien"),
 ("der Nutzer","المستخدِم","der","die Nutzer","Die Nutzer beschweren sich.","المستخدمونَ يشتكون","medien"),
 ("die Sicherheit im Netz","الأمانُ الرقمي","die","","Sicherheit im Netz ist wichtig.","الأمانُ الرقميُّ مهم","medien"),
 ("die Daten","البيانات","die","","Meine Daten sind geschützt.","بياناتي محميّة","medien"),
 ("der Beitrag","المساهمة / المنشور","der","die Beiträge","Dein Beitrag war hilfreich.","مساهمتُكَ كانت مفيدة","medien"),
 ("kommentieren","يعلّق","","","Viele haben den Beitrag kommentiert.","علَّقَ كثيرونَ على المنشور","medien"),
 ("das Gerücht","الشائعة","das","die Gerüchte","Das ist nur ein Gerücht.","هذه مجرَّدُ شائعة","medien"),
 ("die Meinungsfreiheit","حريةُ الرأي","die","","Meinungsfreiheit hat Grenzen.","لحريةِ الرأيِ حدود","medien"),
 ("der Unterricht","الدرس / الحصّة","der","","Der Unterricht fällt heute aus.","الحصّةُ ملغاةٌ اليوم","schule"),
 ("die Klassenarbeit","الفرضُ الصفي","die","die Klassenarbeiten","Morgen schreiben wir eine Klassenarbeit.","غداً لدينا فرضٌ صفي","schule"),
 ("das Fach","المادّة","das","die Fächer","Mein Lieblingsfach ist Mathe.","مادّتي المفضَّلةُ الرياضيات","schule"),
 ("die Grundschule","المدرسةُ الابتدائية","die","die Grundschulen","Mein Sohn geht in die Grundschule.","ابني في الابتدائية","schule"),
 ("das Gymnasium","الثانويةُ الأكاديمية","das","die Gymnasien","Sie besucht das Gymnasium.","ترتادُ الثانويةَ الأكاديمية","schule"),
 ("der Abschluss","الشهادةُ الختامية","der","die Abschlüsse","Ohne Abschluss ist es schwer.","بلا شهادةٍ يصعبُ الأمر","schule"),
 ("das Studium","الدراسةُ الجامعية","das","","Mein Studium dauert drei Jahre.","دراستي ثلاثُ سنوات","schule"),
 ("das Stipendium","المنحة","das","die Stipendien","Ich bewerbe mich um ein Stipendium.","أتقدَّمُ لمنحة","schule"),
 ("die Anwesenheit","الحضور","die","","Die Anwesenheit ist Pflicht.","الحضورُ إلزامي","schule"),
 ("fehlen","يتغيّب / ينقص","","","Gestern hat er gefehlt.","تغيَّبَ أمس","schule"),
 ("sich konzentrieren auf","يركّزُ على","","","Ich konzentriere mich auf die Prüfung.","أركّزُ على الامتحان","schule"),
 ("sich vorbereiten auf","يستعدُّ لـ","","","Ich bereite mich auf das Gespräch vor.","أستعدُّ للمقابلة","schule"),
 ("warten auf","ينتظرُ (شيئاً)","","","Ich warte auf die Antwort.","أنتظرُ الجواب","praep"),
 ("sich freuen auf","يتطلَّعُ إلى","","","Ich freue mich auf den Urlaub.","أتطلَّعُ إلى الإجازة","praep"),
 ("sich freuen über","يفرحُ بـ","","","Ich freue mich über dein Geschenk.","أفرحُ بهديتِك","praep"),
 ("denken an","يفكّرُ في","","","Ich denke oft an meine Familie.","أفكّرُ كثيراً في عائلتي","praep"),
 ("sprechen über","يتحدَّثُ عن","","","Wir sprechen über die Arbeit.","نتحدَّثُ عن العمل","praep"),
 ("sich ärgern über","يغتاظُ من","","","Ich ärgere mich über den Lärm.","أغتاظُ من الضجيج","praep"),
 ("bitten um","يطلبُ (شيئاً)","","","Ich bitte um Hilfe.","أطلبُ المساعدة","praep"),
 ("danken für","يشكرُ على","","","Ich danke dir für alles.","أشكرُكَ على كلِّ شيء","praep"),
 ("Angst haben vor","يخافُ من","","","Ich habe Angst vor der Prüfung.","أخافُ من الامتحان","praep"),
 ("zufrieden sein mit","يرضى بـ","","","Ich bin mit dem Zimmer zufrieden.","أنا راضٍ عن الغرفة","praep"),
 ("sich erinnern an","يتذكَّر","","","Erinnerst du dich an ihn?","أتتذكَّرُه؟","praep"),
 ("abhängen von","يعتمدُ على","","","Das hängt vom Wetter ab.","هذا يعتمدُ على الطقس","praep"),
]

NEUE_DECKS = [
 ("a2-mensch-beziehung", "A2", "الطبع والعلاقات والمشاعر بين الناس", A2_MENSCH),
 ("a2-reise-feste", "A2", "السفر والإقامة والأعياد والضيافة", A2_REISE_FEST),
 ("a2-medien-bildung", "A2", "الإعلام والتعليم والأفعال بحروفها الملازمة", A2_MEDIEN_SCHULE),
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
            kid = f"vc-{deckId[3:9]}-{j:03d}"
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
