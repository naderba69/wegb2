#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثامنة: A2 — السلامةُ في العمل · البيئةُ والطاقة · المطبخُ والبيت · لغةُ السرد."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

A2_ARBEITSSCHUTZ = [
 ("die Arbeitssicherheit","السلامةُ المهنية","die","","Arbeitssicherheit geht allen vor.","السلامةُ المهنيةُ تسبقُ كلَّ شيء","schutz"),
 ("die Schutzkleidung","لباسُ الوقاية","die","","Schutzkleidung ist Pflicht.","لباسُ الوقايةِ إلزامي","schutz"),
 ("der Helm","الخوذة","der","die Helme","Auf der Baustelle trägt man einen Helm.","في الورشةِ تُلبَسُ خوذة","schutz"),
 ("die Handschuhe tragen","يلبسُ القفّازات","","","Beim Putzen trage ich Handschuhe.","عندَ التنظيفِ ألبسُ قفّازات","schutz"),
 ("die Gefahr","الخطر","die","die Gefahren","Hier besteht Gefahr.","هنا يوجدُ خطر","schutz"),
 ("gefährlich","خطير","","","Diese Maschine ist gefährlich.","هذه الآلةُ خطيرة","schutz"),
 ("die Warnung","التحذير","die","die Warnungen","Lies die Warnung auf dem Schild.","اقرأِ التحذيرَ على اللافتة","schutz"),
 ("die Vorschrift","التعليمةُ الملزِمة","die","die Vorschriften","Die Vorschriften sind streng.","التعليماتُ صارمة","schutz"),
 ("einhalten","يلتزمُ بـ","","","Wir halten die Regeln ein.","نلتزمُ بالقواعد","schutz"),
 ("die Unterweisung","التلقينُ الإرشادي","die","die Unterweisungen","Die Unterweisung ist jedes Jahr.","التلقينُ الإرشاديُّ سنوي","schutz"),
 ("der Arbeitsunfall","حادثُ العمل","der","die Arbeitsunfälle","Jeder Arbeitsunfall wird gemeldet.","كلُّ حادثِ عملٍ يُبلَّغُ عنه","schutz"),
 ("der Erste-Hilfe-Kasten","صندوقُ الإسعافات","der","","Der Erste-Hilfe-Kasten hängt an der Wand.","صندوقُ الإسعافاتِ على الجدار","schutz"),
 ("die Pause einhalten","يلتزمُ بالاستراحة","","","Bitte die Pausen einhalten.","التزمْ بالاستراحات","schutz"),
 ("die Schichtarbeit","العملُ بالورديات","die","","Schichtarbeit ist anstrengend.","العملُ بالورديّاتِ مُتعِب","schutz"),
 ("die Maschine bedienen","يشغّلُ الآلة","","","Nur geschulte Personen bedienen die Maschine.","المدرَّبونَ فقط يشغّلونَ الآلة","schutz"),
 ("die Anweisung","التوجيه","die","die Anweisungen","Befolgen Sie die Anweisung.","اتّبعِ التوجيه","schutz"),
 ("befolgen","يمتثل","","","Ich befolge die Regeln genau.","أمتثلُ للقواعدِ بدقة","schutz"),
 ("melden","يبلّغ","","","Melde den Schaden sofort.","بلّغْ عن الضررِ فوراً","schutz"),
 ("der Schaden","الضرر","der","die Schäden","Der Schaden ist klein.","الضررُ صغير","schutz"),
 ("die Haftung","المسؤوليةُ القانونية","die","","Die Haftung liegt beim Arbeitgeber.","المسؤوليةُ على صاحبِ العمل","schutz"),
 ("der Betriebsrat","مجلسُ العمّال","der","die Betriebsräte","Der Betriebsrat hilft bei Konflikten.","مجلسُ العمّالِ يساعدُ في النزاعات","schutz"),
 ("die Gewerkschaft","النقابة","die","die Gewerkschaften","Die Gewerkschaft fordert mehr Lohn.","النقابةُ تطالبُ بأجرٍ أعلى","schutz"),
 ("der Streik","الإضراب","der","die Streiks","Der Streik dauert drei Tage.","الإضرابُ ثلاثةُ أيام","schutz"),
 ("der Lohn","الأجر","der","die Löhne","Der Lohn wird monatlich gezahlt.","الأجرُ يُدفَعُ شهرياً","schutz"),
 ("der Mindestlohn","الحدُّ الأدنى للأجر","der","","Der Mindestlohn steigt.","الحدُّ الأدنى يرتفع","schutz"),
]

A2_UMWELT_ENERGIE = [
 ("die Energie","الطاقة","die","","Energie wird teurer.","الطاقةُ تغلو","umwelt"),
 ("die Energiekosten","تكاليفُ الطاقة","die","","Die Energiekosten steigen jedes Jahr.","تكاليفُ الطاقةِ ترتفعُ سنوياً","umwelt"),
 ("erneuerbar","متجدّد","","","Erneuerbare Energie ist die Zukunft.","الطاقةُ المتجدّدةُ هي المستقبل","umwelt"),
 ("die Sonnenenergie","الطاقةُ الشمسية","die","","Sonnenenergie lohnt sich hier.","الطاقةُ الشمسيةُ مجديةٌ هنا","umwelt"),
 ("das Windrad","توربينُ الرياح","das","die Windräder","Auf dem Feld stehen Windräder.","في الحقلِ توربيناتُ رياح","umwelt"),
 ("der Verbrauch","الاستهلاك","der","","Der Verbrauch ist zu hoch.","الاستهلاكُ مرتفعٌ جداً","umwelt"),
 ("sparsam heizen","يقتصدُ في التدفئة","","","Wir heizen sparsam.","نقتصدُ في التدفئة","umwelt"),
 ("die Dämmung","العزل","die","","Eine gute Dämmung spart Geld.","العزلُ الجيدُ يوفّرُ مالاً","umwelt"),
 ("das Elektroauto","السيارةُ الكهربائية","das","die Elektroautos","Elektroautos sind noch teuer.","السياراتُ الكهربائيةُ ما زالت غالية","umwelt"),
 ("das Fahrrad statt Auto","الدرّاجةُ بدلَ السيارة","","","Ich nehme das Fahrrad statt das Auto.","آخذُ الدرّاجةَ بدلَ السيارة","umwelt"),
 ("der Abfall","النفايات","der","die Abfälle","Abfall gehört in die Tonne.","النفاياتُ في الحاوية","umwelt"),
 ("die Tonne","الحاوية","die","die Tonnen","Die gelbe Tonne ist für Plastik.","الحاويةُ الصفراءُ للبلاستيك","umwelt"),
 ("das Pfand","الرهنُ على العبوة","das","","Auf Flaschen gibt es Pfand.","على القواريرِ رهن","umwelt"),
 ("wiederverwenden","يعيدُ الاستعمال","","","Wir verwenden die Gläser wieder.","نعيدُ استعمالَ الأكواب","umwelt"),
 ("vermeiden","يتجنَّب","","","Wir vermeiden Plastiktüten.","نتجنَّبُ أكياسَ البلاستيك","umwelt"),
 ("die Umweltverschmutzung","التلوّثُ البيئي","die","","Umweltverschmutzung macht krank.","التلوّثُ البيئيُّ يُمرِض","umwelt"),
 ("der Lärmschutz","الحمايةُ من الضجيج","der","","Der Lärmschutz an der Straße ist neu.","الحمايةُ من الضجيجِ عندَ الشارعِ جديدة","umwelt"),
 ("das Trinkwasser","ماءُ الشرب","das","","Trinkwasser ist hier sehr sauber.","ماءُ الشربِ هنا نظيفٌ جداً","umwelt"),
 ("die Dürre","الجفاف","die","die Dürren","Die Dürre schadet den Bauern.","الجفافُ يضرُّ الفلّاحين","umwelt"),
 ("der Bauer","الفلّاح","der","die Bauern","Der Bauer verkauft Gemüse direkt.","الفلّاحُ يبيعُ الخضارَ مباشرةً","umwelt"),
 ("regional","محلّيُّ المنشأ","","","Ich kaufe regionale Produkte.","أشتري منتجاتٍ محلّية","umwelt"),
 ("saisonal","موسمي","","","Saisonales Obst ist billiger.","الفاكهةُ الموسميةُ أرخص","umwelt"),
 ("die Verpackung","التغليف","die","die Verpackungen","Weniger Verpackung ist besser.","تغليفٌ أقلُّ أفضل","umwelt"),
 ("der Klimaschutz","حمايةُ المناخ","der","","Klimaschutz kostet, aber lohnt sich.","حمايةُ المناخِ مكلفةٌ لكنّها مجدية","umwelt"),
 ("beitragen zu","يسهمُ في","","","Jeder kann zum Klimaschutz beitragen.","كلٌّ يمكنُهُ الإسهامُ في حمايةِ المناخ","umwelt"),
]

A2_KUECHE_HAUS = [
 ("das Rezept kochen","يطبخُ وصفة","","","Ich koche ein Rezept aus dem Internet.","أطبخُ وصفةً من الإنترنت","kueche"),
 ("die Zutat","المكوّن","die","die Zutaten","Welche Zutaten brauchen wir?","أيَّ مكوّناتٍ نحتاج؟","kueche"),
 ("mischen","يخلط","","","Mische Mehl und Wasser.","اخلطِ الطحينَ والماء","kueche"),
 ("das Mehl","الطحين","das","","Ein Kilo Mehl, bitte.","كيلو طحينٍ من فضلك","kueche"),
 ("braten","يقلي","","","Ich brate das Hähnchen.","أقلي الدجاج","kueche"),
 ("kochen lassen","يتركُهُ يغلي","","","Zehn Minuten kochen lassen.","اتركْهُ يغلي عشرَ دقائق","kueche"),
 ("abkühlen","يبرد","","","Den Kuchen abkühlen lassen.","اتركِ الكعكَ يبرد","kueche"),
 ("würzen","يتبّل","","","Mit Salz und Pfeffer würzen.","تبّلْ بالملحِ والفلفل","kueche"),
 ("der Pfeffer","الفلفلُ الأسود","der","","Der Pfeffer ist scharf.","الفلفلُ حار","kueche"),
 ("die Soße","الصلصة","die","die Soßen","Die Soße ist zu dick.","الصلصةُ ثقيلةٌ جداً","kueche"),
 ("das Gewürz","التابل","das","die Gewürze","Wir benutzen viele Gewürze.","نستعملُ توابلَ كثيرة","kueche"),
 ("vegetarisch","نباتي","","","Ich esse vegetarisch.","آكلُ نباتياً","kueche"),
 ("der Geschmack","المذاق","der","die Geschmäcker","Der Geschmack ist besonders.","المذاقُ مميَّز","kueche"),
 ("die Mikrowelle","الميكروويف","die","die Mikrowellen","Wärm es in der Mikrowelle.","سخّنْهُ في الميكروويف","kueche"),
 ("die Spülmaschine","جلّايةُ الصحون","die","die Spülmaschinen","Die Spülmaschine ist voll.","الجلّايةُ ممتلئة","kueche"),
 ("abwaschen","يغسلُ الصحون","","","Ich wasche nach dem Essen ab.","أغسلُ الصحونَ بعدَ الأكل","kueche"),
 ("der Vorrat","المؤونة","der","die Vorräte","Wir haben genug Vorrat.","لدينا مؤونةٌ كافية","kueche"),
 ("haltbar","صالحٌ للحفظ","","","Die Milch ist bis Freitag haltbar.","الحليبُ صالحٌ حتى الجمعة","kueche"),
 ("das Mindesthaltbarkeitsdatum","تاريخُ الصلاحية","das","","Prüfe das Mindesthaltbarkeitsdatum.","تحقَّقْ من تاريخِ الصلاحية","kueche"),
 ("verderben","يفسد","","","Das Fleisch ist verdorben.","اللحمُ فسد","kueche"),
 ("einfrieren","يجمّد","","","Ich friere das Brot ein.","أجمّدُ الخبز","kueche"),
 ("auftauen","يذيب","","","Lass das Fleisch auftauen.","اتركِ اللحمَ يذوب","kueche"),
 ("der Einkaufszettel","قائمةُ المشتريات","der","die Einkaufszettel","Der Einkaufszettel liegt in der Tasche.","قائمةُ المشترياتِ في الحقيبة","kueche"),
 ("die Portion","الحصّة","die","die Portionen","Eine Portion reicht für zwei.","حصّةٌ تكفي اثنَين","kueche"),
 ("die Essensreste","بقايا الطعام","die","","Essensreste kann man einfrieren.","بقايا الطعامِ يمكنُ تجميدُها","kueche"),
]

A2_ERZAEHLEN = [
 ("damals","آنذاك","","","Damals war ich noch Kind.","آنذاك كنتُ طفلاً","erzaehlen"),
 ("früher","فيما مضى","","","Früher hatten wir kein Internet.","فيما مضى لم يكنْ لدينا إنترنت","erzaehlen"),
 ("plötzlich","فجأةً","","","Plötzlich klingelte das Telefon.","فجأةً رنَّ الهاتف","erzaehlen"),
 ("zuerst einmal","بادئَ ذي بدء","","","Zuerst einmal möchte ich danken.","بادئَ ذي بدءٍ أشكر","erzaehlen"),
 ("schließlich","في نهايةِ المطاف","","","Schließlich haben wir es geschafft.","في نهايةِ المطافِ نجحنا","erzaehlen"),
 ("inzwischen","في هذه الأثناء","","","Inzwischen spreche ich besser.","في هذه الأثناءِ صرتُ أتكلَّمُ أفضل","erzaehlen"),
 ("seitdem","منذُ ذلك الحين","","","Seitdem lerne ich jeden Tag.","منذُ ذلك الحينِ أتعلَّمُ يومياً","erzaehlen"),
 ("neulich","مؤخَّراً","","","Neulich habe ich ihn getroffen.","مؤخَّراً التقيتُه","erzaehlen"),
 ("damit","لكي","","","Ich übe, damit ich besser werde.","أتمرَّنُ لكي أتحسَّن","erzaehlen"),
 ("um zu","من أجلِ أن","","","Ich lerne Deutsch, um zu studieren.","أتعلَّمُ الألمانيةَ لأدرس","erzaehlen"),
 ("obwohl","مع أنّ","","","Obwohl es regnete, sind wir gegangen.","مع أنّها أمطرت، ذهبنا","erzaehlen"),
 ("während","بينما / خلال","","","Während des Kurses war ich krank.","خلالَ الدورةِ كنتُ مريضاً","erzaehlen"),
 ("bevor","قبلَ أن","","","Bevor ich gehe, rufe ich an.","قبلَ أن أذهبَ أتّصل","erzaehlen"),
 ("nachdem","بعدَ أن","","","Nachdem ich gegessen hatte, ging ich.","بعدَ أن أكلتُ ذهبت","erzaehlen"),
 ("sobald","حالما","","","Sobald ich ankomme, schreibe ich dir.","حالما أصلُ أكتبُ لك","erzaehlen"),
 ("die Erinnerung","الذكرى","die","die Erinnerungen","Das ist eine schöne Erinnerung.","هذه ذكرى جميلة","erzaehlen"),
 ("das Erlebnis","التجربةُ المعيشة","das","die Erlebnisse","Das war ein besonderes Erlebnis.","كانت تجربةً خاصّة","erzaehlen"),
 ("die Kindheit","الطفولة","die","","Meine Kindheit war schön.","كانت طفولتي جميلة","erzaehlen"),
 ("die Vergangenheit","الماضي","die","","Über die Vergangenheit spricht er selten.","نادراً ما يتحدَّثُ عن الماضي","erzaehlen"),
 ("die Zukunft","المستقبل","die","","Was bringt die Zukunft?","ماذا يحملُ المستقبل؟","erzaehlen"),
 ("sich entwickeln","يتطوَّر","","","Die Stadt hat sich entwickelt.","المدينةُ تطوَّرت","erzaehlen"),
 ("sich verändern","يتغيَّر","","","Vieles hat sich verändert.","تغيَّرَ الكثير","erzaehlen"),
 ("der Zufall","الصدفة","der","die Zufälle","Das war reiner Zufall.","كانت صدفةً محضة","erzaehlen"),
 ("der Höhepunkt","الذروة","der","die Höhepunkte","Der Höhepunkt war das Konzert.","كانتِ الذروةُ الحفل","erzaehlen"),
 ("zum Schluss","في الختام","","","Zum Schluss möchte ich sagen: danke.","في الختامِ أقول: شكراً","erzaehlen"),
]

NEUE_DECKS = [
 ("a2-arbeitsschutz", "A2", "السلامة المهنية وحقوق العامل والنقابة", A2_ARBEITSSCHUTZ),
 ("a2-umwelt-energie", "A2", "الطاقة والبيئة والاستهلاك المسؤول", A2_UMWELT_ENERGIE),
 ("a2-kueche-haushalt", "A2", "المطبخ والطبخ والمؤونة وتدبير البيت", A2_KUECHE_HAUS),
 ("a2-erzaehlen-zeit", "A2", "لغة السرد وروابط الزمن والذكريات", A2_ERZAEHLEN),
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
            kid = f"ve-{deckId[3:10]}-{j:03d}"
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
