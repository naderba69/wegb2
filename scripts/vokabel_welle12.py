#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثانيةَ عشرة: B1 — المدينةُ والسكنُ والبيئةُ · المالُ والقانونُ والاستهلاك · أفعالُ الربطِ الثقيلة."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

B1_STADT_UMWELT = [
 ("die Infrastruktur","البنيةُ التحتية","die","","Die Infrastruktur ist veraltet.","البنيةُ التحتيةُ متقادمة","stadt1"),
 ("der Nahverkehr","النقلُ المحلّي","der","","Der Nahverkehr ist gut ausgebaut.","النقلُ المحلّيُّ متطوّر","stadt1"),
 ("die Anbindung","الربطُ بالشبكة","die","die Anbindungen","Die Anbindung ans Zentrum ist schlecht.","الربطُ بالمركزِ سيّئ","stadt1"),
 ("der Ausbau","التوسعة","der","","Der Ausbau dauert Jahre.","التوسعةُ تستغرقُ سنوات","stadt1"),
 ("die Sanierung","الترميم","die","die Sanierungen","Die Sanierung des Hauses beginnt bald.","ترميمُ البيتِ يبدأُ قريباً","stadt1"),
 ("die Baugenehmigung","رخصةُ البناء","die","die Baugenehmigungen","Ohne Baugenehmigung geht nichts.","بلا رخصةِ بناءٍ لا شيء","stadt1"),
 ("das Grundstück","قطعةُ الأرض","das","die Grundstücke","Das Grundstück ist teuer.","قطعةُ الأرضِ غالية","stadt1"),
 ("der Leerstand","الشغورُ العقاري","der","","Leerstand mitten in der Stadt ärgert viele.","الشغورُ وسطَ المدينةِ يُغضِبُ كثيرين","stadt1"),
 ("die Verdrängung","الإزاحةُ السكانية","die","","Die Verdrängung armer Familien nimmt zu.","إزاحةُ الأسرِ الفقيرةِ تتزايد","stadt1"),
 ("die Lebensqualität","جودةُ الحياة","die","","Grünflächen erhöhen die Lebensqualität.","المساحاتُ الخضراءُ ترفعُ جودةَ الحياة","stadt1"),
 ("die Grünfläche","المساحةُ الخضراء","die","die Grünflächen","Die Grünfläche bleibt erhalten.","المساحةُ الخضراءُ محفوظة","stadt1"),
 ("der Verkehrslärm","ضجيجُ المرور","der","","Der Verkehrslärm stört nachts.","ضجيجُ المرورِ يزعجُ ليلاً","stadt1"),
 ("die Feinstaubbelastung","تلوّثُ الجسيماتِ الدقيقة","die","","Die Feinstaubbelastung ist hoch.","تلوّثُ الجسيماتِ مرتفع","stadt1"),
 ("der Radweg","مسارُ الدرّاجات","der","die Radwege","Der neue Radweg ist breit.","مسارُ الدرّاجاتِ الجديدُ واسع","stadt1"),
 ("die Fußgängerzone","منطقةُ المشاة","die","die Fußgängerzonen","In der Fußgängerzone sind keine Autos.","في منطقةِ المشاةِ لا سيارات","stadt1"),
 ("die Bürgerinitiative","مبادرةُ المواطنين","die","die Bürgerinitiativen","Eine Bürgerinitiative hat protestiert.","احتجَّت مبادرةُ مواطنين","stadt1"),
 ("protestieren gegen","يحتجُّ على","","","Sie protestieren gegen den Abriss.","يحتجّونَ على الهدم","stadt1"),
 ("der Abriss","الهدم","der","","Der Abriss wurde gestoppt.","أُوقِفَ الهدم","stadt1"),
 ("die Genehmigung erteilen","يمنحُ الترخيص","","","Die Stadt hat die Genehmigung erteilt.","منحتِ المدينةُ الترخيص","stadt1"),
 ("die Zuständigkeit","الاختصاص","die","die Zuständigkeiten","Die Zuständigkeit liegt beim Land.","الاختصاصُ للولاية","stadt1"),
 ("der Wasserverbrauch","استهلاكُ الماء","der","","Der Wasserverbrauch sinkt langsam.","استهلاكُ الماءِ ينخفضُ ببطء","stadt1"),
 ("die Nachhaltigkeit","الاستدامة","die","","Nachhaltigkeit ist mehr als ein Wort.","الاستدامةُ أكثرُ من كلمة","stadt1"),
 ("nachhaltig","مستدام","","","Wir bauen nachhaltig.","نبني على نحوٍ مستدام","stadt1"),
 ("der Kreislauf","الدورة","der","die Kreisläufe","Im Kreislauf geht nichts verloren.","في الدورةِ لا يضيعُ شيء","stadt1"),
]

B1_GELD_RECHT = [
 ("der Verbraucherschutz","حمايةُ المستهلك","der","","Der Verbraucherschutz ist gesetzlich geregelt.","حمايةُ المستهلكِ منظَّمةٌ قانوناً","recht"),
 ("das Widerrufsrecht","حقُّ العدول","das","","Das Widerrufsrecht gilt vierzehn Tage.","حقُّ العدولِ أربعةَ عشرَ يوماً","recht"),
 ("die Gewährleistung","ضمانُ المطابقة","die","","Die Gewährleistung beträgt zwei Jahre.","ضمانُ المطابقةِ سنتان","recht"),
 ("der Anspruch auf","الحقُّ في","der","","Sie haben Anspruch auf Ersatz.","لكَ الحقُّ في بديل","recht"),
 ("der Ersatz","البديل / التعويض","der","","Ich verlange Ersatz.","أطالبُ بتعويض","recht"),
 ("haften für","يتحمَّلُ مسؤوليةَ","","","Der Vermieter haftet für den Schaden.","المؤجِّرُ يتحمَّلُ مسؤوليةَ الضرر","recht"),
 ("die Klage","الدعوى","die","die Klagen","Die Klage liegt beim Gericht.","الدعوى لدى المحكمة","recht"),
 ("das Gericht","المحكمة","das","die Gerichte","Das Gericht entscheidet im Mai.","المحكمةُ تقضي في مايو","recht"),
 ("der Anwalt","المحامي","der","die Anwälte","Der Anwalt prüft den Vertrag.","المحامي يفحصُ العقد","recht"),
 ("die Beratungsstelle aufsuchen","يقصدُ مركزَ الإرشاد","","","Ich suche eine Beratungsstelle auf.","أقصدُ مركزَ إرشاد","recht"),
 ("die Vereinbarung","الاتفاقية","die","die Vereinbarungen","Die Vereinbarung gilt schriftlich.","الاتفاقيةُ سارية كتابةً","recht"),
 ("verbindlich","مُلزِم","","","Die Zusage ist verbindlich.","الوعدُ مُلزِم","recht"),
 ("unverbindlich","غيرُ مُلزِم","","","Das Angebot ist unverbindlich.","العرضُ غيرُ مُلزِم","recht"),
 ("kostenpflichtig","بمقابلٍ مالي","","","Die Stornierung ist kostenpflichtig.","الإلغاءُ بمقابلٍ مالي","recht"),
 ("die Stornierung","الإلغاء","die","die Stornierungen","Die Stornierung war kostenlos.","كانَ الإلغاءُ مجانياً","recht"),
 ("die Rücklage","الاحتياطي","die","die Rücklagen","Eine Rücklage schützt vor Krisen.","الاحتياطيُّ يقي من الأزمات","geld1"),
 ("die Inflation","التضخُّم","die","","Die Inflation frisst die Ersparnisse.","التضخُّمُ يلتهمُ المدَّخرات","geld1"),
 ("die Ersparnisse","المدَّخرات","die","","Meine Ersparnisse sind klein.","مدَّخراتي قليلة","geld1"),
 ("die Investition","الاستثمار","die","die Investitionen","Bildung ist die beste Investition.","التعليمُ أفضلُ استثمار","geld1"),
 ("sich verschulden","يستدين","","","Viele verschulden sich beim Autokauf.","كثيرونَ يستدينونَ لشراءِ سيارة","geld1"),
 ("die Zinsen","الفوائد","die","","Die Zinsen sind gestiegen.","ارتفعتِ الفوائد","geld1"),
 ("die Gebührenordnung","لائحةُ الرسوم","die","","Die Gebührenordnung hängt aus.","لائحةُ الرسومِ معلَّقة","geld1"),
 ("der Beleg aufbewahren","يحفظُ السند","","","Bewahren Sie den Beleg auf.","احفظِ السند","geld1"),
 ("die Rate aussetzen","يوقفُ قسطاً مؤقّتاً","","","Man kann eine Rate aussetzen.","يمكنُ إيقافُ قسطٍ مؤقّتاً","geld1"),
 ("pfänden","يحجز","","","Das Konto wurde gepfändet.","حُجِزَ الحساب","geld1"),
]

B1_VERBEN = [
 ("beantragen und bewilligen","يقدّمُ طلباً ويُوافَق","","","Ich habe beantragt, und man hat bewilligt.","قدَّمتُ الطلبَ فوُوفِقَ عليه","verb1"),
 ("berücksichtigen","يأخذُ في الحسبان","","","Wir berücksichtigen deinen Wunsch.","نأخذُ رغبتَكَ في الحسبان","verb1"),
 ("voraussetzen","يفترضُ مسبقاً","","","Die Stelle setzt Erfahrung voraus.","الوظيفةُ تفترضُ خبرة","verb1"),
 ("bestehen aus","يتكوَّنُ من","","","Das Team besteht aus fünf Personen.","الفريقُ يتكوَّنُ من خمسة","verb1"),
 ("bestehen auf","يصرُّ على","","","Er besteht auf einer Antwort.","يصرُّ على جواب","verb1"),
 ("sich beziehen auf","يشيرُ إلى","","","Ich beziehe mich auf Ihre Mail.","أشيرُ إلى بريدِك","verb1"),
 ("verzichten auf","يتخلّى عن","","","Ich verzichte auf das Auto.","أتخلّى عن السيارة","verb1"),
 ("sich beteiligen an","يشاركُ في","","","Viele beteiligen sich an der Aktion.","كثيرونَ يشاركونَ في الحملة","verb1"),
 ("teilnehmen an","يحضرُ ويشارك","","","Ich nehme an der Sitzung teil.","أشاركُ في الجلسة","verb1"),
 ("hinweisen auf","ينبّهُ إلى","","","Ich weise auf das Risiko hin.","أنبّهُ إلى الخطر","verb1"),
 ("verfügen über","يمتلكُ / يتصرَّفُ في","","","Er verfügt über gute Kenntnisse.","يمتلكُ معرفةً جيدة","verb1"),
 ("sich auswirken auf","ينعكسُ على","","","Das wirkt sich auf die Kosten aus.","ينعكسُ ذلك على التكاليف","verb1"),
 ("zurückführen auf","يُرجِعُ إلى","","","Man führt es auf das Wetter zurück.","يُرجِعونَهُ إلى الطقس","verb1"),
 ("gelten als","يُعَدُّ بمثابةِ","","","Er gilt als zuverlässig.","يُعَدُّ موثوقاً","verb1"),
 ("dienen zu","يخدمُ غرضَ","","","Das dient zur Sicherheit.","يخدمُ ذلك غرضَ السلامة","verb1"),
 ("sich eignen für","يصلحُ لـ","","","Der Raum eignet sich für Kurse.","القاعةُ تصلحُ للدورات","verb1"),
 ("in Kauf nehmen","يقبلُ مُكرَهاً","","","Den Lärm nehme ich in Kauf.","أقبلُ الضجيجَ مُكرَهاً","verb1"),
 ("zur Verfügung stellen","يضعُ تحتَ التصرُّف","","","Wir stellen einen Raum zur Verfügung.","نضعُ قاعةً تحتَ التصرُّف","verb1"),
 ("in Anspruch nehmen","يستفيدُ من خدمة","","","Ich nehme Hilfe in Anspruch.","أستفيدُ من المساعدة","verb1"),
 ("Rücksicht nehmen auf","يراعي","","","Nimm Rücksicht auf die Nachbarn.","راعِ الجيران","verb1"),
 ("eine Rolle spielen bei","يؤدّي دوراً في","","","Geld spielt dabei eine Rolle.","المالُ يؤدّي دوراً في ذلك","verb1"),
 ("zu dem Schluss kommen","يخلصُ إلى","","","Ich komme zu dem Schluss, dass es reicht.","أخلصُ إلى أنَّهُ يكفي","verb1"),
 ("in Frage kommen","يكونُ وارداً","","","Das kommt für mich nicht in Frage.","هذا غيرُ واردٍ عندي","verb1"),
 ("Wert legen auf","يحرصُ على","","","Ich lege Wert auf Pünktlichkeit.","أحرصُ على الالتزامِ بالوقت","verb1"),
 ("sich Mühe geben","يبذلُ جهداً","","","Er gibt sich große Mühe.","يبذلُ جهداً كبيراً","verb1"),
]

NEUE_DECKS = [
 ("b1-stadt-umwelt", "B1", "المدينة والسكن والبيئة والمشاركة المحلّية", B1_STADT_UMWELT),
 ("b1-geld-recht", "B1", "المال والقانون وحقوق المستهلك", B1_GELD_RECHT),
 ("b1-funktionsverben", "B1", "الأفعال بحروفها والتعابير الفعلية الثقيلة", B1_VERBEN),
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
            kid = f"vi-{deckId[3:10]}-{j:03d}"
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
    print("أُضيفَ:", n, "| مكرَّرٌ:", len(doppelt), doppelt[:8])
    print("التوزيعُ:", dict(c), "| المجموع:", sum(c.values()))

if __name__ == "__main__":
    main()
