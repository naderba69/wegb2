#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الحاديةَ عشرة: B1 — الصحّةُ ونمطُ الحياة · التقنيةُ والإعلام · التعليمُ والمشاريع · عباراتُ B1 الشفوية."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

B1_GESUND_LEBEN = [
 ("die Lebensweise","نمطُ الحياة","die","die Lebensweisen","Eine gesunde Lebensweise braucht Disziplin.","نمطُ الحياةِ الصحّيُّ يحتاجُ انضباطاً","leben"),
 ("die Vorsorgeuntersuchung","الفحصُ الوقائي","die","die Vorsorgeuntersuchungen","Die Vorsorgeuntersuchung ist jährlich.","الفحصُ الوقائيُّ سنوي","leben"),
 ("die Diagnose","التشخيص","die","die Diagnosen","Die Diagnose kam schnell.","جاءَ التشخيصُ سريعاً","leben"),
 ("die Therapie","العلاجُ الممتد","die","die Therapien","Die Therapie dauert Monate.","العلاجُ يستغرقُ أشهراً","leben"),
 ("die Nebenwirkung","العَرَضُ الجانبي","die","die Nebenwirkungen","Das Medikament hat Nebenwirkungen.","للدواءِ أعراضٌ جانبية","leben"),
 ("chronisch","مزمن","","","Er hat eine chronische Krankheit.","لديهِ مرضٌ مزمن","leben"),
 ("die Genesung","التعافي","die","","Ich wünsche dir gute Genesung.","أتمنّى لكَ تعافياً طيباً","leben"),
 ("das Immunsystem","جهازُ المناعة","das","","Schlaf stärkt das Immunsystem.","النومُ يقوّي المناعة","leben"),
 ("die Belastbarkeit","القدرةُ على التحمُّل","die","","Sport erhöht die Belastbarkeit.","الرياضةُ ترفعُ قدرةَ التحمُّل","leben"),
 ("das Gleichgewicht","التوازن","das","","Arbeit und Ruhe brauchen ein Gleichgewicht.","العملُ والراحةُ يحتاجانِ توازناً","leben"),
 ("die Gewohnheit ändern","يغيّرُ عادة","","","Eine Gewohnheit zu ändern dauert Wochen.","تغييرُ عادةٍ يستغرقُ أسابيع","leben"),
 ("der Verzicht","التخلّي","der","","Verzicht fällt am Anfang schwer.","التخلّي صعبٌ في البداية","leben"),
 ("die Disziplin","الانضباط","die","","Ohne Disziplin kein Fortschritt.","بلا انضباطٍ لا تقدُّم","leben"),
 ("die Ausdauer","المثابرة","die","","Sprachen lernen braucht Ausdauer.","تعلُّمُ اللغاتِ يحتاجُ مثابرة","leben"),
 ("sich etwas vornehmen","يعزمُ على شيء","","","Ich habe mir vorgenommen, früher zu schlafen.","عزمتُ على النومِ مبكّراً","leben"),
 ("die Ernährungsberatung","الاستشارةُ الغذائية","die","","Die Krankenkasse zahlt die Ernährungsberatung.","صندوقُ المرضِ يدفعُ الاستشارةَ الغذائية","leben"),
 ("die Krankenkasse","صندوقُ التأمينِ الصحّي","die","die Krankenkassen","Meine Krankenkasse ist gesetzlich.","صندوقي قانونيٌّ عام","leben"),
 ("der Beitrag zahlen","يدفعُ الاشتراك","","","Jeden Monat zahle ich den Beitrag.","كلَّ شهرٍ أدفعُ الاشتراك","leben"),
 ("die Rehabilitation","إعادةُ التأهيل","die","","Nach der Operation folgt die Rehabilitation.","بعدَ العمليةِ تأتي إعادةُ التأهيل","leben"),
 ("der Pflegefall","حالةُ العناية","der","die Pflegefälle","Im Pflegefall hilft die Versicherung.","في حالةِ العنايةِ يساعدُ التأمين","leben"),
 ("die Pflege","الرعاية","die","","Die Pflege der Eltern ist anstrengend.","رعايةُ الوالدَينِ مُتعِبة","leben"),
 ("der Umgang mit","التعاملُ مع","der","","Der Umgang mit Stress ist lernbar.","التعاملُ مع التوتّرِ يُتعلَّم","leben"),
]

B1_TECHNIK_MEDIEN = [
 ("die Anwendung","التطبيق / الاستخدام","die","die Anwendungen","Die Anwendung ist einfach.","الاستخدامُ سهل","technik"),
 ("die Funktion","الوظيفة","die","die Funktionen","Diese Funktion kenne ich nicht.","لا أعرفُ هذه الوظيفة","technik"),
 ("die Einstellung","الإعداد","die","die Einstellungen","Ändere die Einstellung im Menü.","غيّرِ الإعدادَ في القائمة","technik"),
 ("die Aktualisierung","التحديث","die","die Aktualisierungen","Die Aktualisierung dauert zehn Minuten.","التحديثُ عشرُ دقائق","technik"),
 ("die Störung","العُطل","die","die Störungen","Es gibt eine Störung im Netz.","هناكَ عُطلٌ في الشبكة","technik"),
 ("der Zugang","النفاذ / الدخول","der","die Zugänge","Ich habe keinen Zugang zum Portal.","ليسَ لي نفاذٌ إلى البوّابة","technik"),
 ("der Datenschutz","حمايةُ البيانات","der","","Datenschutz ist hier streng.","حمايةُ البياناتِ صارمةٌ هنا","technik"),
 ("die Verschlüsselung","التشفير","die","","Die Verschlüsselung schützt die Nachricht.","التشفيرُ يحمي الرسالة","technik"),
 ("der Missbrauch","سوءُ الاستعمال","der","","Missbrauch der Daten ist strafbar.","سوءُ استعمالِ البياناتِ يُعاقَبُ عليه","technik"),
 ("die Abhängigkeit","التبعية / الإدمان","die","","Die Abhängigkeit vom Handy wächst.","التبعيةُ للهاتفِ تنمو","technik"),
 ("die Bildschirmzeit","وقتُ الشاشة","die","","Meine Bildschirmzeit ist zu hoch.","وقتُ شاشتي مرتفعٌ جداً","technik"),
 ("die Recherche","البحثُ التوثيقي","die","die Recherchen","Die Recherche hat zwei Tage gedauert.","استغرقَ البحثُ يومَين","medien"),
 ("die Glaubwürdigkeit","المصداقية","die","","Die Glaubwürdigkeit der Quelle zählt.","مصداقيةُ المصدرِ هي المهمّ","medien"),
 ("die Falschmeldung","الخبرُ الكاذب","die","die Falschmeldungen","Falschmeldungen verbreiten sich schnell.","الأخبارُ الكاذبةُ تنتشرُ سريعاً","medien"),
 ("verbreiten","ينشر / يشيع","","","Gerüchte verbreiten sich schnell.","الشائعاتُ تنتشرُ سريعاً","medien"),
 ("die Stellungnahme","البيانُ الموقفي","die","die Stellungnahmen","Die Firma gab eine Stellungnahme ab.","أصدرتِ الشركةُ بياناً","medien"),
 ("der Journalist","الصحفي","der","die Journalisten","Der Journalist prüft die Fakten.","الصحفيُّ يتحقَّقُ من الوقائع","medien"),
 ("die Tatsache","الواقعة","die","die Tatsachen","Das ist eine Tatsache, keine Meinung.","هذه واقعةٌ لا رأي","medien"),
 ("die Statistik","الإحصاء","die","die Statistiken","Die Statistik zeigt einen Rückgang.","الإحصاءُ يُظهِرُ تراجعاً","medien"),
 ("der Rückgang","التراجع","der","","Der Rückgang ist deutlich.","التراجعُ واضح","medien"),
 ("der Anstieg","الارتفاع","der","","Der Anstieg beträgt zehn Prozent.","الارتفاعُ عشرةُ بالمئة","medien"),
 ("betragen","يبلغُ مقدارُه","","","Die Miete beträgt sechshundert Euro.","الإيجارُ يبلغُ ستَّمئةِ يورو","medien"),
 ("zunehmen an","يزدادُ في","","","Die Zahl nimmt weiter zu.","العددُ يزدادُ باستمرار","medien"),
 ("abnehmen an","يتناقص","","","Das Interesse nimmt ab.","الاهتمامُ يتناقص","medien"),
]

B1_BILDUNG_PROJEKT = [
 ("das Projekt","المشروع","das","die Projekte","Das Projekt läuft sechs Monate.","المشروعُ ستةُ أشهر","projekt"),
 ("planen","يخطّط","","","Wir planen die nächsten Schritte.","نخطّطُ للخطواتِ التالية","projekt"),
 ("der Zeitplan","الجدولُ الزمني","der","die Zeitpläne","Der Zeitplan ist eng.","الجدولُ الزمنيُّ ضيّق","projekt"),
 ("die Aufgabe verteilen","يوزّعُ المهام","","","Wir verteilen die Aufgaben gerecht.","نوزّعُ المهامَّ بعدل","projekt"),
 ("die Zusammenarbeit","التعاون","die","","Die Zusammenarbeit war gut.","كانَ التعاونُ جيداً","projekt"),
 ("das Ziel erreichen","يبلغُ الهدف","","","Wir haben das Ziel erreicht.","بلغنا الهدف","projekt"),
 ("die Umsetzung","التنفيذ","die","","Die Umsetzung beginnt im Mai.","التنفيذُ يبدأُ في مايو","projekt"),
 ("umsetzen","ينفّذ","","","Wir setzen den Plan um.","ننفّذُ الخطة","projekt"),
 ("das Ergebnis präsentieren","يعرضُ النتيجة","","","Morgen präsentieren wir die Ergebnisse.","غداً نعرضُ النتائج","projekt"),
 ("die Präsentation","العرضُ التقديمي","die","die Präsentationen","Die Präsentation dauert zehn Minuten.","العرضُ عشرُ دقائق","projekt"),
 ("die Folie","الشريحة","die","die Folien","Auf der ersten Folie steht das Thema.","في الشريحةِ الأولى الموضوع","projekt"),
 ("das Protokoll führen","يدوّنُ المحضر","","","Wer führt heute das Protokoll?","مَن يدوّنُ المحضرَ اليوم؟","projekt"),
 ("die Frist verlängern lassen","يطلبُ تمديدَ المهلة","","","Ich habe die Frist verlängern lassen.","طلبتُ تمديدَ المهلة","projekt"),
 ("die Rückmeldung geben","يقدّمُ تغذيةً راجعة","","","Gib mir bitte eine kurze Rückmeldung.","أعطِني تغذيةً راجعةً قصيرة","projekt"),
 ("die Kritik","النقد","die","","Kritik hilft, wenn sie sachlich ist.","النقدُ يفيدُ إن كانَ موضوعياً","projekt"),
 ("kritisieren","ينتقد","","","Er kritisiert den Plan.","ينتقدُ الخطة","projekt"),
 ("loben für","يمدحُ على","","","Der Chef lobte uns für die Arbeit.","مدحَنا المديرُ على العمل","projekt"),
 ("verbessern","يحسّن","","","Wir verbessern den Entwurf.","نحسّنُ المسوَّدة","projekt"),
 ("der Entwurf","المسوَّدة","der","die Entwürfe","Der Entwurf ist fast fertig.","المسوَّدةُ شبهُ جاهزة","projekt"),
 ("die Fassung","النسخةُ النصّية","die","die Fassungen","Das ist die zweite Fassung.","هذه النسخةُ الثانية","projekt"),
 ("die Quelle angeben","يذكرُ المصدر","","","Bitte die Quelle angeben.","اذكرِ المصدرَ من فضلك","projekt"),
 ("das Fazit","الخلاصة","das","die Fazits","Mein Fazit ist positiv.","خلاصتي إيجابية","projekt"),
 ("die Gliederung","التبويب","die","die Gliederungen","Die Gliederung steht am Anfang.","التبويبُ في البداية","projekt"),
 ("sich abstimmen","يتنسَّق","","","Wir stimmen uns morgen ab.","نتنسَّقُ غداً","projekt"),
 ("die Absprache treffen","يتّفقُ مسبقاً","","","Wir haben eine klare Absprache getroffen.","اتّفقنا اتفاقاً واضحاً","projekt"),
]

B1_REDEMITTEL = [
 ("Ich würde sagen","أقولُ إنّ","","","Ich würde sagen, das ist zu teuer.","أقولُ إنَّ هذا غالٍ","rede1"),
 ("Soweit ich das beurteilen kann","بقدرِ ما أستطيعُ الحكم","","","Soweit ich das beurteilen kann, klappt es.","بقدرِ ما أحكمُ، سينجح","rede1"),
 ("Das hängt davon ab, ob","يتوقَّفُ على ما إذا","","","Das hängt davon ab, ob es regnet.","يتوقَّفُ على ما إذا أمطرت","rede1"),
 ("Ich möchte betonen, dass","أودُّ التأكيدَ على أنّ","","","Ich möchte betonen, dass Zeit fehlt.","أودُّ التأكيدَ على نقصِ الوقت","rede1"),
 ("Darf ich kurz ergänzen","أيمكنني الإضافةُ قليلاً","","","Darf ich kurz ergänzen?","أيمكنني الإضافةُ قليلاً؟","rede1"),
 ("Das führt dazu, dass","يؤدّي ذلك إلى أنّ","","","Das führt dazu, dass wir mehr zahlen.","يؤدّي ذلك إلى دفعِ المزيد","rede1"),
 ("Nehmen wir an","لنفترضْ أنّ","","","Nehmen wir an, es klappt nicht.","لنفترضْ أنَّهُ لم ينجح","rede1"),
 ("Im Großen und Ganzen","إجمالاً وعموماً","","","Im Großen und Ganzen bin ich zufrieden.","إجمالاً أنا راضٍ","rede1"),
 ("aus meiner Sicht","من وجهةِ نظري","","","Aus meiner Sicht reicht das nicht.","من وجهةِ نظري لا يكفي","rede1"),
 ("im Prinzip","من حيثُ المبدأ","","","Im Prinzip bin ich einverstanden.","من حيثُ المبدأ أوافق","rede1"),
 ("unter Umständen","ربّما في ظروفٍ معيّنة","","","Unter Umständen fahren wir früher.","ربّما نسافرُ أبكر","rede1"),
 ("auf jeden Fall","على كلِّ حال","","","Auf jeden Fall rufe ich an.","على كلِّ حالٍ سأتّصل","rede1"),
 ("auf keinen Fall","بأيِّ حالٍ لا","","","Auf keinen Fall gebe ich auf.","بأيِّ حالٍ لن أستسلم","rede1"),
 ("es kommt darauf an, dass","المهمُّ أن","","","Es kommt darauf an, dass alle mitmachen.","المهمُّ أن يشاركَ الجميع","rede1"),
 ("mir ist wichtig, dass","يهمُّني أن","","","Mir ist wichtig, dass wir ehrlich sind.","يهمُّني أن نكونَ صادقين","rede1"),
 ("ich befürchte, dass","أخشى أن","","","Ich befürchte, dass es zu spät ist.","أخشى أن يكونَ الوقتُ متأخِّراً","rede1"),
 ("erfreulicherweise","لحسنِ الحال","","","Erfreulicherweise ist alles gut gelaufen.","لحسنِ الحالِ سارَ كلُّ شيءٍ جيداً","rede1"),
 ("bedauerlicherweise","للأسفِ الشديد","","","Bedauerlicherweise müssen wir absagen.","للأسفِ الشديدِ علينا الاعتذار","rede1"),
]

NEUE_DECKS = [
 ("b1-gesundheit-leben", "B1", "الصحّة ونمط الحياة والتأمين والرعاية", B1_GESUND_LEBEN),
 ("b1-technik-medien", "B1", "التقنية وحماية البيانات والإعلام والأرقام", B1_TECHNIK_MEDIEN),
 ("b1-projekt-rede", "B1", "المشاريع والعرض والنقد · عبارات B1 الشفوية", B1_BILDUNG_PROJEKT + B1_REDEMITTEL),
]

def main():
    v = json.load(open(P, encoding="utf8"))
    vorhanden = {c["de"].lower() for d in v.values() for c in d["cards"]}
    alleIds = {c["id"] for d in v.values() for c in d["cards"]}
    n, doppelt = 0, []
    for deckId, level, titel, zeilen in NEUE_DECKS:
        karten = []
        for j, (de, ar, art, plural, exDe, exAr, tag) in enumerate(zeilen):
            if de.lower() in vorhanden:
                doppelt.append(de); continue
            vorhanden.add(de.lower())
            kid = f"vh-{deckId[3:10]}-{j:03d}"
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
    print("التوزيعُ:", dict(c), "| المجموع:", sum(c.values()))

if __name__ == "__main__":
    main()
