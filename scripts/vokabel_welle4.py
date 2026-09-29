#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الرابعة: البلدانُ واللغاتُ والمِهَنُ وأفعالُ الوضعِ والحركةِ وأدواتُ الربطِ وعباراتُ النجاة."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A1_WELT_BERUF = [
 ("Deutschland","ألمانيا","","","Ich lerne Deutsch, weil ich nach Deutschland will.","أتعلَّمُ الألمانيةَ لأنّي أريدُ ألمانيا","land"),
 ("Österreich","النمسا","","","Wien liegt in Österreich.","فيينّا في النمسا","land"),
 ("die Schweiz","سويسرا","die","","Die Schweiz hat vier Sprachen.","في سويسرا أربعُ لغات","land"),
 ("Tunesien","تونس","","","Ich komme aus Tunesien.","أنا من تونس","land"),
 ("das Ausland","الخارج","das","","Mein Bruder lebt im Ausland.","أخي يعيشُ في الخارج","land"),
 ("die Heimat","الوطن","die","","Meine Heimat fehlt mir.","يشتاقُ قلبي إلى وطني","land"),
 ("die Grenze","الحدود","die","die Grenzen","Die Grenze ist zwei Stunden entfernt.","الحدودُ على بعدِ ساعتَين","land"),
 ("der Ausländer","الأجنبي","der","die Ausländer","Als Ausländer brauche ich ein Visum.","كأجنبيٍّ أحتاجُ تأشيرة","land"),
 ("das Visum","التأشيرة","das","die Visa","Mein Visum gilt drei Monate.","تأشيرتي لثلاثةِ أشهر","land"),
 ("die Nationalität","الجنسية","die","die Nationalitäten","Welche Nationalität haben Sie?","ما جنسيتُك؟","land"),
 ("arabisch","عربي","","","Meine Muttersprache ist Arabisch.","لغتي الأمُّ العربية","sprache"),
 ("deutsch","ألماني","","","Er spricht gut deutsch.","يتكلَّمُ الألمانيةَ جيداً","sprache"),
 ("die Muttersprache","اللغةُ الأم","die","die Muttersprachen","Was ist deine Muttersprache?","ما لغتُكَ الأم؟","sprache"),
 ("das Wörterbuch","القاموس","das","die Wörterbücher","Schau im Wörterbuch nach.","ابحثْ في القاموس","sprache"),
 ("übersetzen","يترجم","","","Kannst du das übersetzen?","أيمكنكَ ترجمةُ هذا؟","sprache"),
 ("buchstabieren","يتهجّى","","","Buchstabieren Sie bitte Ihren Namen.","تهجَّ اسمَكَ من فضلك","sprache"),
 ("wiederholen bitte","أعِدْ من فضلك","","","Können Sie das bitte wiederholen?","أيمكنكَ الإعادةُ من فضلك؟","sprache"),
 ("langsamer sprechen","يتكلَّمُ أبطأ","","","Können Sie langsamer sprechen?","أيمكنكَ التكلُّمُ أبطأ؟","sprache"),
 ("der Bäcker","الخبّاز","der","die Bäcker","Der Bäcker steht um vier auf.","الخبّازُ ينهضُ الرابعة","beruf"),
 ("der Verkäufer","البائع","der","die Verkäufer","Der Verkäufer ist freundlich.","البائعُ لطيف","beruf"),
 ("die Krankenschwester","الممرّضة","die","die Krankenschwestern","Die Krankenschwester kommt gleich.","الممرّضةُ تأتي حالاً","beruf"),
 ("der Ingenieur","المهندس","der","die Ingenieure","Mein Vater ist Ingenieur.","أبي مهندس","beruf"),
 ("der Techniker","الفنّي","der","die Techniker","Der Techniker repariert die Maschine.","الفنّيُّ يصلحُ الآلة","beruf"),
 ("der Fahrer","السائق","der","die Fahrer","Der Fahrer wartet draußen.","السائقُ ينتظرُ خارجاً","beruf"),
 ("der Koch","الطبّاخ","der","die Köche","Der Koch arbeitet abends.","الطبّاخُ يعملُ مساءً","beruf"),
 ("der Student","الطالبُ الجامعي","der","die Studenten","Als Student habe ich wenig Geld.","كطالبٍ مالي قليل","beruf"),
 ("die Praxis","العيادة","die","die Praxen","Die Praxis ist heute geschlossen.","العيادةُ مغلقةٌ اليوم","beruf"),
 ("das Büro","المكتب","das","die Büros","Mein Büro ist im zweiten Stock.","مكتبي في الطابقِ الثاني","beruf"),
 ("die Werkstatt","الورشة","die","die Werkstätten","Das Auto ist in der Werkstatt.","السيارةُ في الورشة","beruf"),
 ("der Stock","الطابق","der","die Stockwerke","Wir wohnen im dritten Stock.","نسكنُ في الطابقِ الثالث","haus"),
 ("stehen","يقف","","","Ich stehe an der Haltestelle.","أقفُ عندَ الموقف","bewegung"),
 ("sitzen","يجلس","","","Wir sitzen am Tisch.","نجلسُ إلى الطاولة","bewegung"),
 ("liegen","يرقد / يكون موضوعاً","","","Das Buch liegt auf dem Tisch.","الكتابُ على الطاولة","bewegung"),
 ("stellen","يضعُ واقفاً","","","Stell die Flasche in den Kühlschrank.","ضعِ القارورةَ في الثلاجة","bewegung"),
 ("legen","يضعُ مضجعاً","","","Leg das Handy auf den Tisch.","ضعِ الهاتفَ على الطاولة","bewegung"),
 ("setzen","يُجلِس","","","Setz dich bitte!","اجلسْ من فضلك!","bewegung"),
 ("hängen","يعلّق","","","Häng die Jacke an den Haken.","علّقِ السترةَ على المشجب","bewegung"),
 ("fallen","يسقط","","","Pass auf, der Teller fällt!","احترسْ، الطبقُ يسقط!","bewegung"),
 ("steigen","يصعد","","","Wir steigen in den Bus.","نصعدُ إلى الحافلة","bewegung"),
 ("aussteigen","ينزلُ من مركبة","","","Wo steigen Sie aus?","أينَ تنزل؟","bewegung"),
 ("mitkommen","يرافق","","","Kommst du mit?","أتأتي معي؟","bewegung"),
 ("zurückkommen","يعود","","","Ich komme um acht zurück.","أعودُ في الثامنة","bewegung"),
 ("weggehen","يغادر","","","Er ist schon weggegangen.","غادرَ سلفاً","bewegung"),
 ("holen","يجلب","","","Hol bitte das Brot.","اجلبِ الخبزَ من فضلك","bewegung"),
 ("und","و","","","Ich lerne und arbeite.","أتعلَّمُ وأعمل","verbindung"),
 ("aber","لكن","","","Ich bin müde, aber glücklich.","أنا متعبٌ لكنّي سعيد","verbindung"),
 ("oder","أو","","","Tee oder Kaffee?","شايٌ أم قهوة؟","verbindung"),
 ("denn","لأنّ (بترتيبٍ عاديّ)","","","Ich bleibe zu Hause, denn ich bin krank.","أبقى في البيتِ لأنّي مريض","verbindung"),
 ("weil","لأنّ (يدفعُ الفعلَ للآخر)","","","Ich lerne, weil ich die Prüfung schaffen will.","أتعلَّمُ لأنّي أريدُ اجتيازَ الامتحان","verbindung"),
 ("dann","ثمّ","","","Zuerst essen wir, dann gehen wir.","أوّلاً نأكلُ ثمَّ نذهب","verbindung"),
 ("deshalb","لذلك","","","Es regnet, deshalb bleibe ich hier.","تمطرُ لذلك أبقى هنا","verbindung"),
 ("auch","أيضاً","","","Ich komme auch mit.","آتي أنا أيضاً","verbindung"),
 ("nur","فقط","","","Ich habe nur fünf Euro.","معي خمسةُ يوروهاتٍ فقط","verbindung"),
 ("noch","بعدُ / ما زال","","","Ich bin noch nicht fertig.","لم أنتهِ بعد","verbindung"),
 ("schon","سلفاً","","","Ich habe schon gegessen.","أكلتُ سلفاً","verbindung"),
 ("sehr","جداً","","","Das ist sehr gut.","هذا جيدٌ جداً","verbindung"),
 ("wieder","مجدَّداً","","","Er kommt morgen wieder.","يعودُ غداً مجدَّداً","verbindung"),
 ("Es gibt","يوجد","","","Es gibt hier kein WLAN.","لا يوجدُ واي فاي هنا","phrase"),
 ("Wie bitte?","عفواً، ماذا؟","","","Wie bitte? Ich habe das nicht verstanden.","عفواً؟ لم أفهمْ ذلك","phrase"),
 ("Ich weiß nicht","لا أعرف","","","Ich weiß nicht, wo das ist.","لا أعرفُ أينَ هذا","phrase"),
 ("Alles klar","مفهوم","","","Alles klar, bis morgen!","مفهوم، إلى الغد!","phrase"),
 ("Kein Problem","لا مشكلة","","","Kein Problem, ich helfe dir.","لا مشكلة، أساعدُك","phrase"),
 ("Viel Erfolg","بالتوفيق","","","Viel Erfolg bei der Prüfung!","بالتوفيقِ في الامتحان!","phrase"),
 ("Gute Besserung","شفاءً عاجلاً","","","Gute Besserung, werde schnell gesund!","شفاءً عاجلاً، اشفَ سريعاً!","phrase"),
 ("Herzlichen Glückwunsch","تهانينا","","","Herzlichen Glückwunsch zum Geburtstag!","تهانينا بعيدِ الميلاد!","phrase"),
 ("Guten Appetit","بالهناء","","","Guten Appetit zusammen!","بالهناءِ للجميع!","phrase"),
 ("Bis später","إلى اللقاءِ لاحقاً","","","Bis später, ich muss los.","إلى لاحقاً، عليَّ الذهاب","phrase"),
 ("elf","أحدَ عشر","","","Der Zug kommt um elf.","القطارُ يصلُ الحاديةَ عشرة","zahl"),
 ("zwölf","اثنا عشر","","","Das Jahr hat zwölf Monate.","السنةُ اثنا عشرَ شهراً","zahl"),
 ("dreizehn","ثلاثةَ عشر","","","Er ist dreizehn Jahre alt.","عمرُهُ ثلاثةَ عشرَ عاماً","zahl"),
 ("fünfzehn","خمسةَ عشر","","","In fünfzehn Minuten bin ich da.","بعدَ خمسَ عشرةَ دقيقةً أكونُ هناك","zahl"),
 ("dreißig","ثلاثون","","","Der Kurs hat dreißig Stunden.","الدورةُ ثلاثونَ ساعة","zahl"),
 ("hundertzwanzig","مئةٌ وعشرون","","","Das Buch hat hundertzwanzig Seiten.","الكتابُ مئةٌ وعشرونَ صفحة","zahl"),
 ("zweite","الثاني","","","Das ist meine zweite Woche hier.","هذا أسبوعي الثاني هنا","zahl"),
 ("dritte","الثالث","","","Am dritten Tag war es leichter.","في اليومِ الثالثِ صارَ أسهل","zahl"),
 ("letzte","الأخير","","","Das war die letzte Frage.","كانَ ذلك السؤالَ الأخير","zahl"),
 ("nächste","التالي","","","Die nächste Haltestelle ist meine.","الموقفُ التالي موقفي","zahl"),
 ("einmal","مرّةً واحدة","","","Ich war einmal in Berlin.","كنتُ مرّةً في برلين","zahl"),
 ("zweimal","مرّتَين","","","Ich gehe zweimal pro Woche.","أذهبُ مرّتَينِ أسبوعياً","zahl"),
 ("die Hilfe","المساعدة","die","","Danke für deine Hilfe.","شكراً على مساعدتِك","phrase"),
 ("der Notruf","نداءُ الطوارئ","der","die Notrufe","Der Notruf ist kostenlos.","نداءُ الطوارئ مجاني","phrase"),
 ("die Polizei","الشرطة","die","","Rufen Sie die Polizei!","اتّصلْ بالشرطة!","phrase"),
 ("die Feuerwehr","الإطفاء","die","","Die Feuerwehr ist schnell gekommen.","جاءَ الإطفاءُ سريعاً","phrase"),
 ("verboten","ممنوع","","","Parken ist hier verboten.","الوقوفُ ممنوعٌ هنا","phrase"),
 ("geöffnet","مفتوح","","","Der Laden ist bis acht geöffnet.","المحلُّ مفتوحٌ حتى الثامنة","phrase"),
 ("geschlossen","مغلق","","","Sonntags geschlossen.","مغلقٌ أيامَ الأحد","phrase"),
 ("kostenlos","مجاني","","","Der Eintritt ist kostenlos.","الدخولُ مجاني","phrase"),
 ("der Eingang","المدخل","der","die Eingänge","Der Eingang ist hinten.","المدخلُ في الخلف","ort"),
 ("der Ausgang","المخرج","der","die Ausgänge","Wo ist der Ausgang?","أينَ المخرج؟","ort"),
 ("das Schild","اللافتة","das","die Schilder","Lies das Schild!","اقرأِ اللافتة!","ort"),
 ("die Treppe","الدَّرَج","die","die Treppen","Nimm die Treppe, nicht den Aufzug.","خذِ الدَّرَجَ لا المصعد","ort"),
]

A2_VERTIEFUNG = [
 ("die Bewerbung schreiben","يكتبُ طلبَ توظيف","","","Heute schreibe ich meine Bewerbung.","اليومَ أكتبُ طلبَ توظيفي","arbeit"),
 ("der Anlass","المناسبة / الداعي","der","die Anlässe","Aus welchem Anlass schreiben Sie?","بأيِّ مناسبةٍ تكتب؟","schreiben"),
 ("die Anrede","صيغةُ المخاطبة","die","die Anreden","Die Anrede lautet: Sehr geehrte Damen und Herren.","صيغةُ المخاطبة: سيداتي سادتي","schreiben"),
 ("der Betreff","الموضوع (في رسالة)","der","die Betreffs","Schreib den Betreff kurz.","اكتبِ الموضوعَ مختصراً","schreiben"),
 ("die Grußformel","عبارةُ الختام","die","die Grußformeln","Die Grußformel lautet: Mit freundlichen Grüßen.","عبارةُ الختام: مع أطيبِ التحيات","schreiben"),
 ("die Beschwerde","الشكوى","die","die Beschwerden","Ich schreibe eine Beschwerde an den Vermieter.","أكتبُ شكوى للمؤجِّر","schreiben"),
 ("die Bitte","الرجاء","die","die Bitten","Ich habe eine Bitte an dich.","لديَّ رجاءٌ إليك","schreiben"),
 ("höflich formulieren","يصوغُ بأدب","","","Formuliere die Absage höflich.","صُغِ الاعتذارَ بأدب","schreiben"),
 ("begründen","يعلّل","","","Begründe deine Meinung.","علِّلْ رأيَك","meinung"),
 ("zustimmen","يوافق","","","Ich stimme dir zu.","أوافقُك","meinung"),
 ("widersprechen","يعترض","","","Da muss ich widersprechen.","هنا يجبُ أن أعترض","meinung"),
 ("der Standpunkt","وجهةُ النظر","der","die Standpunkte","Ich verstehe deinen Standpunkt.","أفهمُ وجهةَ نظرِك","meinung"),
 ("das Beispiel","المثال","das","die Beispiele","Gib mir ein Beispiel.","أعطِني مثالاً","meinung"),
 ("zum Beispiel","على سبيلِ المثال","","","Obst, zum Beispiel Äpfel, ist gesund.","الفاكهةُ، مثلاً التفاح، صحّية","meinung"),
 ("einerseits","من جهة","","","Einerseits ist es teuer, andererseits gut.","من جهةٍ غالٍ ومن أخرى جيد","meinung"),
 ("trotzdem","رغمَ ذلك","","","Es regnet, trotzdem gehe ich laufen.","تمطرُ ورغمَ ذلك أجري","meinung"),
 ("außerdem","علاوةً على ذلك","","","Außerdem ist die Wohnung hell.","علاوةً على ذلك الشقةُ مضيئة","meinung"),
 ("jedoch","غيرَ أنّ","","","Der Preis ist hoch, jedoch fair.","السعرُ مرتفعٌ غيرَ أنَّهُ منصف","meinung"),
 ("die Voraussetzung","الشرطُ المسبق","die","die Voraussetzungen","Deutsch ist eine Voraussetzung.","الألمانيةُ شرطٌ مسبق","arbeit"),
 ("der Zuschuss","الإعانة","der","die Zuschüsse","Der Staat zahlt einen Zuschuss.","الدولةُ تدفعُ إعانة","behoerde"),
 ("die Kündigungsfrist","مهلةُ الإنهاء","die","die Kündigungsfristen","Die Kündigungsfrist beträgt drei Monate.","مهلةُ الإنهاءِ ثلاثةُ أشهر","arbeit"),
 ("die Rente","التقاعد","die","die Renten","Mein Vater geht bald in Rente.","أبي يتقاعدُ قريباً","arbeit"),
 ("der Feiertag","العطلةُ الرسمية","der","die Feiertage","Am Feiertag haben alle frei.","في العطلةِ الرسميةِ الجميعُ في راحة","alltag"),
 ("die Kinderbetreuung","رعايةُ الأطفال","die","","Die Kinderbetreuung ist teuer.","رعايةُ الأطفالِ غالية","alltag"),
 ("die Nachbarschaftshilfe","تعاونُ الجيران","die","","Nachbarschaftshilfe spart Geld.","تعاونُ الجيرانِ يوفِّرُ المال","alltag"),
 ("sich informieren","يستعلم","","","Ich informiere mich über den Kurs.","أستعلمُ عن الدورة","alltag"),
 ("teilnehmen","يشارك","","","Ich nehme am Kurs teil.","أشاركُ في الدورة","alltag"),
 ("die Teilnahme","المشاركة","die","","Die Teilnahme ist freiwillig.","المشاركةُ طوعية","alltag"),
 ("freiwillig","طوعي","","","Er hilft freiwillig.","يساعدُ طوعاً","alltag"),
 ("die Verpflichtung","الالتزام","die","die Verpflichtungen","Das ist eine Verpflichtung, kein Wunsch.","هذا التزامٌ لا رغبة","alltag"),
 ("die Bedienung","الخدمة (في مطعم)","die","","Die Bedienung war freundlich.","كانتِ الخدمةُ لطيفة","alltag"),
 ("umtauschen","يستبدل","","","Kann ich die Hose umtauschen?","أيمكنني استبدالُ البنطال؟","einkauf"),
 ("die Garantie","الضمان","die","die Garantien","Das Gerät hat zwei Jahre Garantie.","للجهازِ ضمانُ سنتَين","einkauf"),
 ("der Kassenbon","إيصالُ الشراء","der","die Kassenbons","Ohne Kassenbon geht es nicht.","بلا إيصالٍ لا يمكن","einkauf"),
 ("die Lieferung","التوصيل","die","die Lieferungen","Die Lieferung kommt am Freitag.","التوصيلُ يومَ الجمعة","einkauf"),
 ("bestellen und abholen","يطلبُ ويستلم","","","Ich bestelle online und hole im Laden ab.","أطلبُ عبرَ الإنترنتِ وأستلمُ من المحل","einkauf"),
 ("die Auswahl","التشكيلة","die","","Die Auswahl ist groß.","التشكيلةُ واسعة","einkauf"),
 ("günstiger","أرخص","","","Online ist es oft günstiger.","عبرَ الإنترنتِ أرخصُ غالباً","einkauf"),
]

NEUE_DECKS = [
 ("a1-welt-beruf", "A1", "البلدان واللغات والمِهَن وأفعال الوضع والربط وعبارات النجاة", A1_WELT_BERUF),
 ("a2-schreiben-dienste", "A2", "لغة الرسائل والرأي والخدمات والتسوّق", A2_VERTIEFUNG),
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
            kid = f"vz-{deckId[3:9]}-{j:03d}"
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
