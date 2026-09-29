#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ التاسعة: إغلاقُ عتبةِ A2 التراكمية — عباراتُ الامتحانِ الشفويّ · المظهرُ والثقافةُ والخدماتُ الرقمية."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A2_REDEMITTEL = [
 ("Ich bin der Meinung, dass","أرى أنّ","","","Ich bin der Meinung, dass Sport wichtig ist.","أرى أنَّ الرياضةَ مهمّة","rede"),
 ("Meiner Erfahrung nach","بحسبِ تجربتي","","","Meiner Erfahrung nach hilft tägliches Üben.","بحسبِ تجربتي يفيدُ التمرينُ اليومي","rede"),
 ("Ich finde es gut, dass","يعجبُني أنّ","","","Ich finde es gut, dass der Kurs abends ist.","يعجبُني أنَّ الدورةَ مساءً","rede"),
 ("Das sehe ich anders","أرى غيرَ ذلك","","","Das sehe ich anders als du.","أرى غيرَ ما ترى","rede"),
 ("Da stimme ich zu","أوافقُ على ذلك","","","Da stimme ich dir völlig zu.","أوافقُكَ تماماً","rede"),
 ("Das kommt darauf an","هذا يتوقّفُ على الحال","","","Das kommt darauf an, wie viel Zeit ich habe.","يتوقَّفُ على الوقتِ المتاح","rede"),
 ("Ich schlage vor, dass","أقترحُ أن","","","Ich schlage vor, dass wir früher anfangen.","أقترحُ أن نبدأَ أبكر","rede"),
 ("Wollen wir lieber","أنفضّلُ أن","","","Wollen wir lieber am Samstag gehen?","أنفضّلُ الذهابَ يومَ السبت؟","rede"),
 ("Wie wäre es mit","ما رأيُكَ بـ","","","Wie wäre es mit einem Kaffee?","ما رأيُكَ بقهوة؟","rede"),
 ("Einverstanden","موافق","","","Einverstanden, machen wir das so.","موافق، لنفعلْ ذلك","rede"),
 ("Leider geht das nicht","للأسفِ لا يصحّ","","","Leider geht das am Montag nicht.","للأسفِ الإثنينُ لا يصحّ","rede"),
 ("Könnten Sie bitte","أيمكنكَ لو سمحت","","","Könnten Sie bitte lauter sprechen?","أيمكنكَ التكلُّمُ بصوتٍ أعلى؟","rede"),
 ("Darf ich Sie etwas fragen","أيمكنني سؤالُك","","","Darf ich Sie etwas fragen?","أيمكنني أن أسألَك؟","rede"),
 ("Entschuldigen Sie die Störung","معذرةً على الإزعاج","","","Entschuldigen Sie die Störung, ich habe eine Frage.","معذرةً على الإزعاج، لديَّ سؤال","rede"),
 ("Ich hätte gern","أودُّ لو","","","Ich hätte gern einen Termin am Freitag.","أودُّ موعداً يومَ الجمعة","rede"),
 ("Das ist mir zu teuer","هذا غالٍ عليّ","","","Das ist mir leider zu teuer.","هذا غالٍ عليَّ للأسف","rede"),
 ("Verstehe ich das richtig","أفهمتُ صحيحاً","","","Verstehe ich das richtig: Der Kurs fällt aus?","أفهمتُ صحيحاً: الدورةُ ملغاة؟","rede"),
 ("Mit anderen Worten","بعبارةٍ أخرى","","","Mit anderen Worten: Wir fangen neu an.","بعبارةٍ أخرى: نبدأُ من جديد","rede"),
 ("Zusammengefasst","إجمالاً","","","Zusammengefasst war es ein guter Tag.","إجمالاً كانَ يوماً جيداً","rede"),
 ("Auf der einen Seite","من ناحية","","","Auf der einen Seite ist es praktisch.","من ناحيةٍ هو عملي","rede"),
 ("Auf der anderen Seite","من ناحيةٍ أخرى","","","Auf der anderen Seite kostet es Zeit.","ومن ناحيةٍ أخرى يكلّفُ وقتاً","rede"),
 ("Das Wichtigste ist","الأهمُّ هو","","","Das Wichtigste ist die Gesundheit.","الأهمُّ هو الصحّة","rede"),
 ("Deshalb denke ich","لذلك أرى","","","Deshalb denke ich, dass wir warten sollten.","لذلك أرى أن ننتظر","rede"),
 ("Ich bin mir nicht sicher","لستُ متأكّداً","","","Ich bin mir nicht sicher, ob das stimmt.","لستُ متأكّداً أصحيحٌ هذا","rede"),
 ("So weit ich weiß","على حدِّ علمي","","","So weit ich weiß, ist morgen zu.","على حدِّ علمي غداً مغلق","rede"),
 ("Kein Wunder","لا عجب","","","Kein Wunder, dass du müde bist.","لا عجبَ أنَّكَ متعب","rede"),
 ("Zum Glück","لحسنِ الحظ","","","Zum Glück hat es geklappt.","لحسنِ الحظِّ نجحَ الأمر","rede"),
 ("Schade, dass","من المؤسفِ أنّ","","","Schade, dass du nicht kommst.","من المؤسفِ أنَّكَ لن تأتي","rede"),
 ("Genau das meine ich","هذا بالضبطِ قصدي","","","Genau das meine ich!","هذا بالضبطِ قصدي!","rede"),
 ("Darf ich kurz unterbrechen","أيمكنني المقاطعةُ قليلاً","","","Darf ich kurz unterbrechen?","أيمكنني المقاطعةُ قليلاً؟","rede"),
 ("Ich komme gleich zum Punkt","أدخلُ في الموضوعِ حالاً","","","Ich komme gleich zum Punkt.","أدخلُ في الموضوعِ حالاً","rede"),
 ("Das ist eine gute Frage","سؤالٌ وجيه","","","Das ist eine gute Frage, danke.","سؤالٌ وجيه، شكراً","rede"),
 ("Ich melde mich wieder","سأعاودُ التواصل","","","Ich melde mich morgen wieder.","سأعاودُ التواصلَ غداً","rede"),
 ("Vielen Dank im Voraus","شكراً مقدَّماً","","","Vielen Dank im Voraus für Ihre Hilfe.","شكراً مقدَّماً على مساعدتِك","rede"),
 ("Mit freundlichen Grüßen","مع أطيبِ التحيات","","","Mit freundlichen Grüßen, Ihr Karim.","مع أطيبِ التحيات، كريم","rede"),
]

A2_KULTUR_AUSSEHEN = [
 ("das Aussehen","المظهر","das","","Das Aussehen ist nicht alles.","المظهرُ ليسَ كلَّ شيء","aussehen"),
 ("schlank","نحيف","","","Er ist groß und schlank.","هو طويلٌ ونحيف","aussehen"),
 ("kräftig","قويُّ البنية","","","Mein Bruder ist kräftig.","أخي قويُّ البنية","aussehen"),
 ("der Bart","اللحية","der","die Bärte","Er hat einen kurzen Bart.","لهُ لحيةٌ قصيرة","aussehen"),
 ("glatt","أملس","","","Sie hat glatte Haare.","شَعرُها أملس","aussehen"),
 ("lockig","مجعَّد","","","Meine Haare sind lockig.","شَعري مجعَّد","aussehen"),
 ("die Falte","التجعيدة","die","die Falten","Falten gehören zum Alter.","التجاعيدُ من العمر","aussehen"),
 ("sich schminken","تتزيَّن","","","Sie schminkt sich selten.","نادراً ما تتزيَّن","aussehen"),
 ("der Schmuck","الحُلي","der","","Sie trägt wenig Schmuck.","ترتدي حُلياً قليلة","aussehen"),
 ("die Mode","الموضة","die","","Mode interessiert mich wenig.","الموضةُ لا تعنيني كثيراً","aussehen"),
 ("altmodisch","عتيقُ الطراز","","","Diese Jacke ist altmodisch.","هذه السترةُ عتيقةُ الطراز","aussehen"),
 ("elegant","أنيق","","","Er sieht elegant aus.","يبدو أنيقاً","aussehen"),
 ("bequem sitzen","يكونُ مريحاً (لباساً)","","","Die Hose sitzt bequem.","البنطالُ مريحٌ في اللبس","aussehen"),
 ("anprobieren","يقيسُ اللباس","","","Darf ich das anprobieren?","أيمكنني قياسُ هذا؟","aussehen"),
 ("die Umkleidekabine","غرفةُ القياس","die","die Umkleidekabinen","Die Umkleidekabine ist frei.","غرفةُ القياسِ شاغرة","aussehen"),
 ("die Kultur","الثقافة","die","die Kulturen","Jede Kultur hat ihre Regeln.","لكلِّ ثقافةٍ قواعدُها","kultur"),
 ("das Theater","المسرح","das","die Theater","Wir gehen ins Theater.","نذهبُ إلى المسرح","kultur"),
 ("das Konzert","الحفلُ الموسيقي","das","die Konzerte","Das Konzert war ausverkauft.","نفدت تذاكرُ الحفل","kultur"),
 ("die Ausstellung","المعرض","die","die Ausstellungen","Die Ausstellung läuft bis Mai.","المعرضُ حتى مايو","kultur"),
 ("der Künstler","الفنّان","der","die Künstler","Der Künstler ist aus Berlin.","الفنّانُ من برلين","kultur"),
 ("das Kunstwerk","العملُ الفنّي","das","die Kunstwerke","Das Kunstwerk gefällt mir.","العملُ الفنّيُّ يعجبُني","kultur"),
 ("die Eintrittskarte","تذكرةُ الدخول","die","die Eintrittskarten","Die Eintrittskarte kostet zwölf Euro.","تذكرةُ الدخولِ باثنَي عشرَ يورو","kultur"),
 ("die Vorstellung","العرض","die","die Vorstellungen","Die Vorstellung beginnt um acht.","العرضُ يبدأُ الثامنة","kultur"),
 ("die Bühne","الخشبة","die","die Bühnen","Auf der Bühne steht ein Sänger.","على الخشبةِ مغنٍّ","kultur"),
 ("der Roman","الرواية","der","die Romane","Der Roman ist spannend.","الروايةُ مشوِّقة","kultur"),
 ("das Gedicht","القصيدة","das","die Gedichte","Wir lernen ein Gedicht auswendig.","نحفظُ قصيدة","kultur"),
 ("die Geschichte erzählen","يروي قصّة","","","Erzähl mir die Geschichte!","احكِ لي القصّة!","kultur"),
 ("die Bibliothek nutzen","يستعملُ المكتبة","","","Ich nutze die Bibliothek zum Lernen.","أستعملُ المكتبةَ للدراسة","kultur"),
 ("ausleihen","يستعير","","","Ich leihe mir ein Buch aus.","أستعيرُ كتاباً","kultur"),
 ("die Leihfrist","مدّةُ الإعارة","die","die Leihfristen","Die Leihfrist beträgt vier Wochen.","مدّةُ الإعارةِ أربعةُ أسابيع","kultur"),
 ("das Onlineportal","البوّابةُ الإلكترونية","das","die Onlineportale","Den Antrag stellt man im Onlineportal.","الطلبُ يُقدَّمُ في البوّابةِ الإلكترونية","digital"),
 ("das Konto anlegen","ينشئُ حساباً","","","Zuerst müssen Sie ein Konto anlegen.","أوّلاً أنشئْ حساباً","digital"),
 ("sich einloggen","يلجُ الحساب","","","Ich kann mich nicht einloggen.","لا أستطيعُ الولوج","digital"),
 ("hochladen","يرفعُ ملفاً","","","Laden Sie den Nachweis hoch.","ارفعِ الإثبات","digital"),
 ("der Anhang","المرفقُ الإلكتروني","der","die Anhänge","Der Anhang fehlt in der Mail.","المرفقُ ناقصٌ في البريد","digital"),
 ("ausdrucken","يطبع","","","Drucken Sie das Formular aus.","اطبعِ الاستمارة","digital"),
 ("der Scan","النسخةُ الممسوحة","der","die Scans","Schicken Sie mir einen Scan.","أرسلْ لي نسخةً ممسوحة","digital"),
 ("die Benachrichtigung","الإشعار","die","die Benachrichtigungen","Ich bekomme eine Benachrichtigung.","يصلُني إشعار","digital"),
]

NEUE_DECKS = [
 ("a2-redemittel", "A2", "عبارات الامتحان الشفويّ: الرأي والاقتراح والاعتذار والختام", A2_REDEMITTEL),
 ("a2-kultur-digital", "A2", "المظهر والثقافة والخدمات الرقمية", A2_KULTUR_AUSSEHEN),
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
            kid = f"vf-{deckId[3:9]}-{j:03d}"
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
    print("التوزيعُ:", dict(c), "| المجموع:", sum(c.values()), "| تراكمي A1+A2:", c["A1"] + c["A2"])

if __name__ == "__main__":
    main()
