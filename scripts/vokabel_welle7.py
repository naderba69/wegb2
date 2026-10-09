#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ السابعة: A2 — المالُ والاستهلاك · الصحّةُ والرياضة · السكنُ والعقدُ والجيرة."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A2_GELD = [
 ("das Einkommen","الدخل","das","die Einkommen","Das Einkommen reicht knapp.","الدخلُ يكفي بالكاد","geld"),
 ("die Ausgaben","المصاريف","die","","Die Ausgaben sind gestiegen.","ارتفعتِ المصاريف","geld"),
 ("das Budget","الميزانية","das","die Budgets","Unser Budget ist klein.","ميزانيتُنا صغيرة","geld"),
 ("die Rechnung bezahlen","يسدِّدُ الفاتورة","","","Ich bezahle die Rechnung online.","أسدِّدُ الفاتورةَ عبرَ الإنترنت","geld"),
 ("die Mahnung","الإنذارُ بالدفع","die","die Mahnungen","Ich habe eine Mahnung bekommen.","وصلَني إنذارٌ بالدفع","geld"),
 ("die Schulden","الديون","die","","Er hat Schulden bei der Bank.","عليهِ ديونٌ للبنك","geld"),
 ("der Kredit","القرض","der","die Kredite","Ein Kredit ist teuer.","القرضُ مكلف","geld"),
 ("die Rate","القسط","die","die Raten","Ich zahle in Raten.","أدفعُ بالتقسيط","geld"),
 ("die Kosten senken","يخفضُ التكاليف","","","Wir müssen die Kosten senken.","علينا خفضُ التكاليف","geld"),
 ("preiswert","معقولُ الثمن","","","Das Angebot ist preiswert.","العرضُ معقولُ الثمن","geld"),
 ("der Preisvergleich","مقارنةُ الأسعار","der","die Preisvergleiche","Mach vorher einen Preisvergleich.","قارِنِ الأسعارَ أوّلاً","geld"),
 ("das Sonderangebot","العرضُ الخاص","das","die Sonderangebote","Heute gibt es ein Sonderangebot.","اليومَ هناكَ عرضٌ خاص","geld"),
 ("die Menge","الكمية","die","die Mengen","Die Menge reicht für vier.","الكميةُ تكفي أربعة","geld"),
 ("verschwenden","يبذّر","","","Wir verschwenden zu viel Essen.","نبذّرُ طعاماً كثيراً","geld"),
 ("der Verbraucher","المستهلك","der","die Verbraucher","Der Verbraucher hat Rechte.","للمستهلكِ حقوق","geld"),
 ("das Kleingedruckte","البنودُ الدقيقة","das","","Lies das Kleingedruckte!","اقرأِ البنودَ الدقيقة!","geld"),
 ("der Vertrag kündigen","يفسخُ العقد","","","Ich möchte den Vertrag kündigen.","أودُّ فسخَ العقد","geld"),
 ("die Laufzeit","مدّةُ السريان","die","die Laufzeiten","Die Laufzeit beträgt zwei Jahre.","مدّةُ السريانِ سنتان","geld"),
 ("automatisch","تلقائي","","","Der Vertrag verlängert sich automatisch.","العقدُ يتجدَّدُ تلقائياً","geld"),
 ("der Betrag","المبلغ","der","die Beträge","Der Betrag wurde abgebucht.","خُصِمَ المبلغ","geld"),
 ("überziehen","يتجاوزُ الرصيد","","","Ich habe das Konto überzogen.","تجاوزتُ رصيدَ الحساب","geld"),
 ("das Sparbuch","دفترُ التوفير","das","die Sparbücher","Mein Sparbuch ist fast leer.","دفترُ توفيري شبهُ فارغ","geld"),
 ("sich etwas leisten","يقدرُ على تحمُّلِ نفقة","","","Das kann ich mir nicht leisten.","لا أقدرُ على تحمُّلِ هذا","geld"),
 ("die Quittung aufheben","يحتفظُ بالوصل","","","Heb die Quittung gut auf.","احتفظْ بالوصلِ جيداً","geld"),
 ("der Umtausch","الاستبدال","der","","Der Umtausch ist nur mit Bon möglich.","الاستبدالُ بالوصلِ فقط","geld"),
]

A2_GESUND_SPORT = [
 ("die Bewegung","الحركة","die","","Bewegung hält gesund.","الحركةُ تحفظُ الصحّة","sport"),
 ("das Training","التدريب","das","","Das Training ist dreimal pro Woche.","التدريبُ ثلاثَ مرّاتٍ أسبوعياً","sport"),
 ("trainieren","يتدرَّب","","","Ich trainiere im Fitnessstudio.","أتدرَّبُ في النادي","sport"),
 ("das Fitnessstudio","نادي اللياقة","das","die Fitnessstudios","Das Fitnessstudio ist günstig.","نادي اللياقةِ رخيص","sport"),
 ("der Verein","النادي / الجمعية","der","die Vereine","Mein Sohn ist in einem Verein.","ابني في نادٍ","sport"),
 ("die Mannschaft","الفريق","die","die Mannschaften","Unsere Mannschaft hat gewonnen.","فريقُنا فاز","sport"),
 ("gewinnen","يفوز","","","Wer hat gewonnen?","مَن فاز؟","sport"),
 ("verlieren","يخسر","","","Wir haben knapp verloren.","خسرنا بفارقٍ ضئيل","sport"),
 ("die Verletzung","الإصابة","die","die Verletzungen","Die Verletzung heilt langsam.","الإصابةُ تُشفى ببطء","sport"),
 ("sich verletzen","يُصاب","","","Ich habe mich beim Sport verletzt.","أُصِبتُ أثناءَ الرياضة","sport"),
 ("die Kondition","اللياقة","die","","Meine Kondition wird besser.","لياقتي تتحسَّن","sport"),
 ("die Anstrengung","الجهد","die","die Anstrengungen","Nach der Anstrengung brauche ich Ruhe.","بعدَ الجهدِ أحتاجُ راحة","sport"),
 ("regelmäßig","بانتظام","","","Ich laufe regelmäßig.","أجري بانتظام","sport"),
 ("die Ernährung umstellen","يغيّرُ نمطَ التغذية","","","Ich habe meine Ernährung umgestellt.","غيَّرتُ نمطَ تغذيتي","gesundheit"),
 ("fettarm","قليلُ الدسم","","","Ich esse fettarm.","آكلُ قليلَ الدسم","gesundheit"),
 ("die Kalorie","السعرةُ الحرارية","die","die Kalorien","Der Kuchen hat viele Kalorien.","الكعكُ كثيرُ السعرات","gesundheit"),
 ("die Allergie","الحساسية","die","die Allergien","Ich habe eine Allergie gegen Nüsse.","لديَّ حساسيةٌ من المكسّرات","gesundheit"),
 ("die Impfung","التطعيم","die","die Impfungen","Die Impfung ist kostenlos.","التطعيمُ مجاني","gesundheit"),
 ("das Krankenhaus einliefern","يُنقَلُ إلى المستشفى","","","Er wurde ins Krankenhaus eingeliefert.","نُقِلَ إلى المستشفى","gesundheit"),
 ("die Operation","العملية الجراحية","die","die Operationen","Die Operation war erfolgreich.","نجحتِ العملية","gesundheit"),
 ("der Termin absagen","يلغي الموعدَ الطبي","","","Ich muss den Termin absagen.","عليَّ إلغاءُ الموعد","gesundheit"),
 ("die Praxisgebühr","رسمُ العيادة","die","die Praxisgebühren","Die Praxisgebühr gibt es nicht mehr.","لم تعدْ هناكَ رسومُ عيادة","gesundheit"),
 ("der Facharzt","الطبيبُ الأخصائي","der","die Fachärzte","Ich brauche einen Facharzt.","أحتاجُ طبيباً أخصائياً","gesundheit"),
 ("die Überweisung","الإحالةُ الطبية","die","die Überweisungen","Der Hausarzt gibt mir eine Überweisung.","طبيبُ الأسرةِ يعطيني إحالة","gesundheit"),
 ("die Beschwerden lindern","يخفِّفُ الأوجاع","","","Die Tabletten lindern die Beschwerden.","الحبوبُ تخفّفُ الأوجاع","gesundheit"),
 ("der Schlafmangel","قلّةُ النوم","der","","Schlafmangel macht nervös.","قلّةُ النومِ تُوتِّر","gesundheit"),
 ("entspannen","يسترخي","","","Musik hilft mir zu entspannen.","الموسيقى تساعدُني على الاسترخاء","gesundheit"),
 ("die Atemübung","تمرينُ التنفّس","die","die Atemübungen","Atemübungen beruhigen.","تمارينُ التنفّسِ تهدّئ","gesundheit"),
 ("rauchen aufhören","يُقلعُ عن التدخين","","","Er hat mit dem Rauchen aufgehört.","أقلعَ عن التدخين","gesundheit"),
 ("die Sucht","الإدمان","die","die Süchte","Sucht ist eine Krankheit.","الإدمانُ مرض","gesundheit"),
]

A2_WOHNEN_VERTRAG = [
 ("die Wohnungssuche","البحثُ عن سكن","die","","Die Wohnungssuche dauert lange.","البحثُ عن سكنٍ يطول","wohnen"),
 ("die Besichtigung","المعاينة","die","die Besichtigungen","Die Besichtigung ist am Samstag.","المعاينةُ يومَ السبت","wohnen"),
 ("der Mietvertrag","عقدُ الإيجار","der","die Mietverträge","Der Mietvertrag hat zehn Seiten.","عقدُ الإيجارِ عشرُ صفحات","wohnen"),
 ("die Wohnfläche","المساحةُ السكنية","die","die Wohnflächen","Die Wohnfläche beträgt sechzig Quadratmeter.","المساحةُ ستّونَ متراً مربّعاً","wohnen"),
 ("der Quadratmeter","المترُ المربّع","der","die Quadratmeter","Der Quadratmeter kostet zehn Euro.","المترُ المربّعُ بعشرةِ يورو","wohnen"),
 ("die Warmmiete","الإيجارُ شاملُ الخدمات","die","","Die Warmmiete ist entscheidend.","الإيجارُ الشاملُ هو الحاسم","wohnen"),
 ("die Kaltmiete","الإيجارُ الصافي","die","","Die Kaltmiete klingt günstig.","الإيجارُ الصافي يبدو رخيصاً","wohnen"),
 ("der Stellplatz","موقفُ السيارة","der","die Stellplätze","Ein Stellplatz kostet extra.","موقفُ السيارةِ بمقابلٍ إضافي","wohnen"),
 ("die Hausverwaltung","إدارةُ العمارة","die","die Hausverwaltungen","Die Hausverwaltung antwortet spät.","إدارةُ العمارةِ تردُّ متأخِّرة","wohnen"),
 ("der Schimmel","العفن","der","","An der Wand ist Schimmel.","على الجدارِ عفن","wohnen"),
 ("die Feuchtigkeit","الرطوبة","die","","Die Feuchtigkeit ist zu hoch.","الرطوبةُ مرتفعةٌ جداً","wohnen"),
 ("der Mangel","العيب / النقص","der","die Mängel","Ich melde den Mangel schriftlich.","أبلّغُ عن العيبِ كتابةً","wohnen"),
 ("die Frist setzen","يحدِّدُ مهلة","","","Ich setze eine Frist von zwei Wochen.","أحدِّدُ مهلةَ أسبوعَين","wohnen"),
 ("die Mietminderung","خفضُ الإيجار","die","die Mietminderungen","Bei Mängeln ist eine Mietminderung möglich.","عندَ العيوبِ يجوزُ خفضُ الإيجار","wohnen"),
 ("die Übergabe","التسليم","die","die Übergaben","Die Übergabe ist am Monatsende.","التسليمُ آخرَ الشهر","wohnen"),
 ("das Protokoll","المحضر","das","die Protokolle","Wir schreiben ein Protokoll.","نكتبُ محضراً","wohnen"),
 ("renovieren","يجدِّد","","","Wir renovieren die Küche.","نجدِّدُ المطبخ","wohnen"),
 ("streichen","يدهن","","","Ich streiche die Wände weiß.","أدهنُ الجدرانَ أبيض","wohnen"),
 ("der Handwerker","الحرفي","der","die Handwerker","Der Handwerker kommt morgen.","الحرفيُّ يأتي غداً","wohnen"),
 ("die Hausratversicherung","تأمينُ محتوياتِ المنزل","die","","Eine Hausratversicherung ist sinnvoll.","تأمينُ المحتوياتِ معقول","wohnen"),
 ("kündigen zum Monatsende","يُنهي آخرَ الشهر","","","Ich kündige zum Monatsende.","أُنهي العقدَ آخرَ الشهر","wohnen"),
 ("der Nachmieter","المستأجرُ البديلُ","der","die Nachmieter","Ich suche einen Nachmieter für die Wohnung.","أبحثُ عن مستأجرٍ بديلٍ للشقة.","wohnen"),
 ("der Anmeldung beim Amt","التسجيلُ لدى البلدية","","","Nach dem Umzug ist eine Anmeldung beim Amt nötig.","بعدَ الانتقالِ يلزمُ التسجيلُ لدى البلدية","wohnen"),
 ("die Ruhezeit","وقتُ الهدوء","die","die Ruhezeiten","Ab zweiundzwanzig Uhr gilt die Ruhezeit.","بعدَ العاشرةِ مساءً يبدأُ وقتُ الهدوء","wohnen"),
 ("die Treppenreinigung","تنظيفُ الدَّرَج","die","","Die Treppenreinigung machen alle Mieter.","تنظيفُ الدَّرَجِ على كلِّ المستأجرين","wohnen"),
 ("der Stromanbieter","مزوِّدُ الكهرباء","der","die Stromanbieter","Ich wechsle den Stromanbieter.","أغيّرُ مزوِّدَ الكهرباء","wohnen"),
 ("die Abrechnung","كشفُ الحساب","die","die Abrechnungen","Die Abrechnung kommt einmal im Jahr.","كشفُ الحسابِ مرّةً سنوياً","wohnen"),
 ("nachzahlen","يدفعُ فرقاً","","","Ich muss hundert Euro nachzahlen.","عليَّ دفعُ مئةِ يورو فرقاً","wohnen"),
 ("die Rückzahlung","الاسترداد","die","die Rückzahlungen","Die Rückzahlung kommt im Mai.","الاستردادُ في مايو","wohnen"),
 ("die Genossenschaft","التعاونيةُ السكنية","die","die Genossenschaften","Die Genossenschaft hat günstige Wohnungen.","التعاونيةُ لها شققٌ رخيصة","wohnen"),
]

NEUE_DECKS = [
 ("a2-geld-konsum", "A2", "المال والعقود والاستهلاك وحقوق المستهلك", A2_GELD),
 ("a2-gesundheit-sport", "A2", "الصحّة والرياضة والتغذية والعيادة", A2_GESUND_SPORT),
 ("a2-wohnen-vertrag", "A2", "البحث عن سكن وعقد الإيجار والجيرة", A2_WOHNEN_VERTRAG),
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
            kid = f"vd-{deckId[3:9]}-{j:03d}"
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
