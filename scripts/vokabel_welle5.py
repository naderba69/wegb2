#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الخامسة: إغلاقُ فجوةِ A1 — الأفعالُ الناقصةُ وحروفُ المكانِ والساعةُ والمقاديرُ والرقميّاتُ وعيادةُ الطبيب."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A1_MODAL_ORT = [
 ("können","يستطيع","","","Ich kann schon ein bisschen Deutsch.","أستطيعُ بعضَ الألمانيةِ سلفاً","modal"),
 ("müssen","يجب عليه","","","Ich muss morgen früh aufstehen.","عليَّ النهوضُ باكراً غداً","modal"),
 ("dürfen","يُسمَحُ له","","","Darf ich hier rauchen?","أيُسمَحُ لي بالتدخينِ هنا؟","modal"),
 ("wollen","يريد","","","Ich will Deutsch lernen.","أريدُ تعلُّمَ الألمانية","modal"),
 ("sollen","ينبغي له","","","Was soll ich mitbringen?","ماذا ينبغي أن أُحضِر؟","modal"),
 ("möchten","يودّ","","","Ich möchte einen Kaffee, bitte.","أودُّ قهوةً من فضلك","modal"),
 ("nicht müssen","ليسَ مضطراً","","","Du musst nicht kommen, wenn du müde bist.","لستَ مضطراً للمجيءِ إن كنتَ متعباً","modal"),
 ("nicht dürfen","ممنوعٌ عليه","","","Hier darf man nicht parken.","الوقوفُ ممنوعٌ هنا","modal"),
 ("an","على (جانبياً) / عند","","","Das Bild hängt an der Wand.","الصورةُ على الجدار","ort"),
 ("auf","فوق (بملامسة)","","","Das Buch liegt auf dem Tisch.","الكتابُ فوقَ الطاولة","ort"),
 ("in","في","","","Die Milch ist im Kühlschrank.","الحليبُ في الثلاجة","ort"),
 ("unter","تحت","","","Die Schuhe stehen unter dem Bett.","الحذاءُ تحتَ السرير","ort"),
 ("über","فوق (بلا ملامسة)","","","Die Lampe hängt über dem Tisch.","المصباحُ فوقَ الطاولة","ort"),
 ("neben","بجانب","","","Die Bank ist neben der Post.","البنكُ بجانبِ البريد","ort"),
 ("vor","أمام / قبل","","","Wir treffen uns vor dem Kino.","نلتقي أمامَ السينما","ort"),
 ("hinter","خلف","","","Der Garten liegt hinter dem Haus.","الحديقةُ خلفَ البيت","ort"),
 ("gegenüber","مقابل","","","Die Apotheke ist gegenüber der Schule.","الصيدليةُ مقابلَ المدرسة","ort"),
 ("bei","عند (شخصٍ أو مكان)","","","Ich wohne bei meinem Onkel.","أسكنُ عندَ عمّي","ort"),
 ("mit","مع / بواسطة","","","Ich fahre mit dem Bus.","أذهبُ بالحافلة","ort"),
 ("ohne","بدون","","","Ich trinke Tee ohne Zucker.","أشربُ الشايَ بلا سكّر","ort"),
 ("für","من أجل","","","Das Geschenk ist für dich.","الهديةُ لك","ort"),
 ("nach","إلى (مدينة/بلد) / بعد","","","Ich fahre nach Berlin.","أسافرُ إلى برلين","ort"),
 ("zu","إلى (شخص/مكان محدَّد)","","","Ich gehe zum Arzt.","أذهبُ إلى الطبيب","ort"),
 ("aus","من (أصل/خروج)","","","Ich komme aus Tunesien.","أنا من تونس","ort"),
 ("seit","منذ","","","Ich lerne seit zwei Jahren Deutsch.","أتعلَّمُ الألمانيةَ منذُ سنتَين","ort"),
 ("bis","حتى","","","Ich arbeite bis sechs.","أعملُ حتى السادسة","ort"),
 ("um","في الساعة / حول","","","Der Kurs beginnt um neun.","الدورةُ تبدأُ التاسعة","ort"),
 ("durch","عبر","","","Wir gehen durch den Park.","نمرُّ عبرَ المنتزه","ort"),
 ("Es ist halb acht","الساعةُ السابعةُ والنصف","","","Es ist halb acht, wir müssen los.","السابعةُ والنصف، علينا الذهاب","uhr"),
 ("Viertel vor","إلّا ربعاً","","","Es ist Viertel vor neun.","التاسعةُ إلّا ربعاً","uhr"),
 ("Viertel nach","والربع","","","Wir treffen uns Viertel nach drei.","نلتقي الثالثةَ والربع","uhr"),
 ("Punkt zwölf","الثانيةَ عشرةَ تماماً","","","Die Pause ist Punkt zwölf.","الاستراحةُ الثانيةَ عشرةَ تماماً","uhr"),
 ("morgens","صباحاً","","","Morgens trinke ich Tee.","صباحاً أشربُ شاياً","uhr"),
 ("mittags","ظهراً","","","Mittags esse ich wenig.","ظهراً آكلُ قليلاً","uhr"),
 ("abends","مساءً","","","Abends lese ich.","مساءً أقرأ","uhr"),
 ("nachts","ليلاً","","","Nachts ist es ruhig.","ليلاً يسودُ الهدوء","uhr"),
 ("täglich","يومياً","","","Ich übe täglich.","أتمرَّنُ يومياً","uhr"),
 ("wöchentlich","أسبوعياً","","","Der Kurs ist wöchentlich.","الدورةُ أسبوعية","uhr"),
 ("das Stück","القطعة","das","die Stücke","Ein Stück Kuchen, bitte.","قطعةَ كعكٍ من فضلك","menge"),
 ("das Gramm","الغرام","das","","Zweihundert Gramm Käse, bitte.","مئتا غرامٍ من الجبن","menge"),
 ("der Liter","اللتر","der","die Liter","Ein Liter Milch reicht.","لترُ حليبٍ يكفي","menge"),
 ("die Packung","العلبة","die","die Packungen","Eine Packung Reis, bitte.","علبةَ أرزٍّ من فضلك","menge"),
 ("die Dose","المعلَّبة","die","die Dosen","Eine Dose Tomaten kostet wenig.","معلَّبةُ الطماطمِ رخيصة","menge"),
 ("viel","كثير","","","Ich habe viel Arbeit.","لديَّ عملٌ كثير","menge"),
 ("wenig","قليل","","","Ich habe wenig Zeit.","لديَّ وقتٌ قليل","menge"),
 ("genug","كافٍ","","","Das ist genug, danke.","هذا كافٍ، شكراً","menge"),
 ("alle","الجميع / كلّ","","","Alle Kinder sind da.","كلُّ الأطفالِ هنا","menge"),
 ("etwas","شيءٌ ما","","","Möchtest du etwas trinken?","أتودُّ شيئاً للشرب؟","menge"),
 ("nichts","لا شيء","","","Ich habe nichts gesagt.","لم أقلْ شيئاً","menge"),
 ("jemand","أحدٌ ما","","","Jemand hat angerufen.","أحدٌ ما اتّصل","menge"),
 ("niemand","لا أحد","","","Niemand war zu Hause.","لم يكنْ أحدٌ في البيت","menge"),
 ("die Hälfte nehmen","يأخذُ النصف","","","Nimm die Hälfte davon.","خذْ نصفَ ذلك","menge"),
 ("der Computer","الحاسوب","der","die Computer","Mein Computer ist langsam.","حاسوبي بطيء","digital"),
 ("die E-Mail","البريدُ الإلكتروني","die","die E-Mails","Ich schreibe dir eine E-Mail.","أكتبُ لكَ بريداً","digital"),
 ("das Passwort","كلمةُ المرور","das","die Passwörter","Ich habe mein Passwort vergessen.","نسيتُ كلمةَ المرور","digital"),
 ("die Seite öffnen","يفتحُ الصفحة","","","Öffne bitte diese Seite.","افتحْ هذه الصفحة","digital"),
 ("klicken","ينقر","","","Klick hier, bitte.","انقرْ هنا من فضلك","digital"),
 ("suchen im Internet","يبحثُ في الإنترنت","","","Ich suche im Internet nach einer Wohnung.","أبحثُ في الإنترنتِ عن شقّة","digital"),
 ("der Termin beim Arzt","موعدٌ عندَ الطبيب","","","Ich habe einen Termin beim Arzt.","لديَّ موعدٌ عندَ الطبيب","arzt"),
 ("die Versichertenkarte","بطاقةُ التأمينِ الصحّي","die","die Versichertenkarten","Bitte die Versichertenkarte.","بطاقةَ التأمينِ من فضلك","arzt"),
 ("das Fieber","الحمّى","das","","Ich habe Fieber seit gestern.","لديَّ حمّى منذُ أمس","arzt"),
 ("der Husten","السعال","der","","Der Husten hört nicht auf.","السعالُ لا يتوقّف","arzt"),
 ("die Erkältung","نزلةُ البرد","die","die Erkältungen","Ich habe eine Erkältung.","أصابتني نزلةُ برد","arzt"),
 ("die Schmerzen","الآلام","die","","Ich habe Schmerzen im Bein.","لديَّ آلامٌ في الساق","arzt"),
 ("das Rezept","الوصفةُ الطبية","das","die Rezepte","Der Arzt schreibt ein Rezept.","الطبيبُ يكتبُ وصفة","arzt"),
 ("die Tablette","الحبّة الدوائية","die","die Tabletten","Nimm zweimal täglich eine Tablette.","خذْ حبّةً مرّتَينِ يومياً","arzt"),
 ("die Krankmeldung","الإجازةُ المرضية","die","die Krankmeldungen","Die Krankmeldung geht an den Chef.","الإجازةُ المرضيةُ تذهبُ للمدير","arzt"),
 ("sich ausruhen","يرتاح","","","Du sollst dich ausruhen.","ينبغي أن ترتاح","arzt"),
 ("die Briefmarke","الطابعُ البريدي","die","die Briefmarken","Ich brauche zwei Briefmarken.","أحتاجُ طابعَين","post"),
 ("der Brief","الرسالة","der","die Briefe","Der Brief kommt morgen an.","الرسالةُ تصلُ غداً","post"),
 ("das Paket","الطرد","das","die Pakete","Das Paket ist schon da.","الطردُ وصلَ سلفاً","post"),
 ("der Umschlag","المظروف","der","die Umschläge","Steck den Brief in den Umschlag.","ضعِ الرسالةَ في المظروف","post"),
 ("die Postleitzahl","الرمزُ البريدي","die","die Postleitzahlen","Wie ist die Postleitzahl?","ما الرمزُ البريدي؟","post"),
 ("abholen","يستلم","","","Ich hole das Paket ab.","أستلمُ الطرد","post"),
 ("die Bankkarte","بطاقةُ البنك","die","die Bankkarten","Meine Bankkarte funktioniert nicht.","بطاقةُ بنكي لا تعمل","bank"),
 ("die Geheimzahl","الرقمُ السري","die","die Geheimzahlen","Gib deine Geheimzahl ein.","أدخِلْ رقمَكَ السري","bank"),
 ("abheben","يسحبُ مالاً","","","Ich hebe hundert Euro ab.","أسحبُ مئةَ يورو","bank"),
 ("einzahlen","يودِعُ مالاً","","","Ich zahle das Geld ein.","أودِعُ المال","bank"),
 ("bar bezahlen","يدفعُ نقداً","","","Ich bezahle lieber bar.","أفضّلُ الدفعَ نقداً","bank"),
 ("mit Karte zahlen","يدفعُ بالبطاقة","","","Kann ich mit Karte zahlen?","أيمكنُ الدفعُ بالبطاقة؟","bank"),
 ("der Kontostand","رصيدُ الحساب","der","die Kontostände","Mein Kontostand ist niedrig.","رصيدُ حسابي منخفض","bank"),
 ("möbliert","مفروش","","","Das Zimmer ist möbliert.","الغرفةُ مفروشة","wohnen"),
 ("die Nachbarin","الجارة","die","die Nachbarinnen","Meine Nachbarin ist Lehrerin.","جارتي معلّمة","wohnen"),
 ("der Mitbewohner","شريكُ السكن","der","die Mitbewohner","Mein Mitbewohner kocht gern.","شريكُ سكني يحبُّ الطبخ","wohnen"),
 ("leihen","يُعير / يستعير","","","Kannst du mir zehn Euro leihen?","أتقرضُني عشرةَ يورو؟","alltag"),
 ("zurückgeben","يُرجِع","","","Ich gebe dir das Buch morgen zurück.","أُرجِعُ لكَ الكتابَ غداً","alltag"),
 ("teilen","يتشارك / يقسم","","","Wir teilen die Kosten.","نتقاسمُ التكاليف","alltag"),
 ("wechseln","يبدّل / يصرف","","","Können Sie Geld wechseln?","أيمكنكَ صرفُ مال؟","alltag"),
 ("mitbringen","يُحضِرُ معه","","","Bring bitte Brot mit.","أحضِرْ خبزاً معك","alltag"),
 ("ausmachen","يُطفئ / يتّفق","","","Mach bitte das Licht aus.","أطفئِ الضوءَ من فضلك","alltag"),
 ("anmachen","يُشعِل","","","Mach die Heizung an.","أشعلِ التدفئة","alltag"),
 ("das Licht","الضوء","das","die Lichter","Das Licht ist noch an.","الضوءُ ما زالَ مضاءً","alltag"),
 ("der Schmutz","الوسخ","der","","Auf dem Boden ist Schmutz.","على الأرضيةِ وسخ","alltag"),
 ("das Problem lösen","يحلُّ المشكلة","","","Wir lösen das Problem zusammen.","نحلُّ المشكلةَ معاً","alltag"),
 ("das Problem","المشكلة","das","die Probleme","Es gibt ein kleines Problem.","هناكَ مشكلةٌ صغيرة","alltag"),
 ("wahrscheinlich","على الأرجح","","","Wahrscheinlich komme ich später.","على الأرجحِ آتي لاحقاً","alltag"),
 ("sicher","أكيد / آمن","","","Bist du sicher?","أأنتَ متأكّد؟","alltag"),
 ("möglich","ممكن","","","Ist das möglich?","أهذا ممكن؟","alltag"),
 ("unmöglich","مستحيل","","","Das ist leider unmöglich.","هذا مستحيلٌ للأسف","alltag"),
 ("fertig","جاهز / منتهٍ","","","Bist du fertig?","أانتهيت؟","alltag"),
 ("kaputtgehen","يتعطّل","","","Mein Handy ist gestern kaputtgegangen.","تعطَّلَ هاتفي أمس","alltag"),
 ("funktionieren","يعمل (جهاز)","","","Der Aufzug funktioniert wieder.","المصعدُ يعملُ مجدَّداً","alltag"),
 ("die Uhrzeit sagen","يذكرُ الوقت","","","Kannst du mir die Uhrzeit sagen?","أتخبرُني بالوقت؟","uhr"),
]

def main():
    v = json.load(open(P, encoding="utf8"))
    vorhanden = {c["de"] for d in v.values() for c in d["cards"]}
    alleIds = {c["id"] for d in v.values() for c in d["cards"]}
    karten, doppelt = [], []
    for j, (de, ar, art, plural, exDe, exAr, tag) in enumerate(A1_MODAL_ORT):
        if de in vorhanden:
            doppelt.append(de); continue
        vorhanden.add(de)
        kid = f"va-modort-{j:03d}"
        assert kid not in alleIds
        k = {"id": kid, "de": de, "ar": ar}
        if art: k["article"] = art
        if plural: k["plural"] = plural
        k["exampleDe"] = exDe; k["exampleAr"] = exAr
        k["level"] = "A1"; k["tags"] = [tag]
        bild = re.sub(r"[^a-z]", "", de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss")) + ".png"
        if bild in BILDER: k["img"] = "/cards/" + bild
        karten.append(k)
    v["a1-modal-ort"] = {"id": "a1-modal-ort", "titleAr": "الأفعال الناقصة وحروف المكان والساعة والمقادير والخدمات", "level": "A1", "cards": karten}
    json.dump(v, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    import collections
    c = collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("a1-modal-ort:", len(karten), "| مكرَّرٌ تُجُنِّب:", len(doppelt), doppelt[:8])
    print("التوزيعُ الآن:", dict(c), "| المجموع:", sum(c.values()))

if __name__ == "__main__":
    main()
