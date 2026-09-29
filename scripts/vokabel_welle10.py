#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ العاشرة: تسمينُ B1 — المجتمعُ والدولة · العملُ والمسار · النفسُ والنزاع · لغةُ الحِجاجِ المتوسّطة."""
import json, re, os

P = "content/vocab.json"
BILDER = set(os.listdir("public/cards"))

B1_GESELLSCHAFT = [
 ("die Gesellschaft","المجتمع","die","die Gesellschaften","Die Gesellschaft verändert sich schnell.","المجتمعُ يتغيَّرُ سريعاً","gesell"),
 ("die Bevölkerung","السكّان","die","","Die Bevölkerung wird älter.","السكّانُ يشيخون","gesell"),
 ("die Mehrheit","الأغلبية","die","","Die Mehrheit ist dafür.","الأغلبيةُ مع ذلك","gesell"),
 ("die Minderheit","الأقلّية","die","die Minderheiten","Minderheiten brauchen Schutz.","الأقلّياتُ تحتاجُ حماية","gesell"),
 ("die Gleichberechtigung","المساواةُ في الحقوق","die","","Gleichberechtigung ist ein langer Weg.","المساواةُ طريقٌ طويل","gesell"),
 ("die Chancengleichheit","تكافؤُ الفرص","die","","Bildung schafft Chancengleichheit.","التعليمُ يخلقُ تكافؤَ الفرص","gesell"),
 ("die Benachteiligung","الإجحاف","die","die Benachteiligungen","Benachteiligung beginnt früh.","الإجحافُ يبدأُ باكراً","gesell"),
 ("die Integration","الاندماج","die","","Integration braucht beide Seiten.","الاندماجُ يحتاجُ الطرفَين","gesell"),
 ("die Herkunft","الأصل","die","","Die Herkunft darf nicht entscheiden.","الأصلُ يجبُ ألّا يقرّر","gesell"),
 ("das Vorurteil","الحكمُ المسبق","das","die Vorurteile","Vorurteile verschwinden langsam.","الأحكامُ المسبقةُ تزولُ ببطء","gesell"),
 ("die Toleranz","التسامح","die","","Toleranz hat Grenzen.","للتسامحِ حدود","gesell"),
 ("der Respekt","الاحترام","der","","Respekt kostet nichts.","الاحترامُ لا يكلّفُ شيئاً","gesell"),
 ("die Verantwortung übernehmen","يتحمَّلُ المسؤولية","","","Jeder muss Verantwortung übernehmen.","على كلٍّ تحمُّلُ المسؤولية","gesell"),
 ("das Ehrenamt","العملُ التطوّعي","das","die Ehrenämter","Sie engagiert sich im Ehrenamt.","تنخرطُ في العملِ التطوّعي","gesell"),
 ("sich engagieren","ينخرطُ فاعلاً","","","Viele engagieren sich für Flüchtlinge.","كثيرونَ ينخرطونَ لأجلِ اللاجئين","gesell"),
 ("der Verein gründen","يؤسّسُ جمعية","","","Sie haben einen Verein gegründet.","أسَّسوا جمعية","gesell"),
 ("die Demokratie","الديمقراطية","die","die Demokratien","Demokratie lebt von Beteiligung.","الديمقراطيةُ تحيا بالمشاركة","gesell"),
 ("die Wahl","الانتخاب","die","die Wahlen","Die Wahl ist im Herbst.","الانتخابُ في الخريف","gesell"),
 ("wählen","ينتخب","","","Ab achtzehn darf man wählen.","من الثامنةَ عشرةَ يحقُّ الانتخاب","gesell"),
 ("die Regierung","الحكومة","die","die Regierungen","Die Regierung plant Reformen.","الحكومةُ تخطّطُ لإصلاحات","gesell"),
 ("das Gesetz","القانون","das","die Gesetze","Das Gesetz gilt für alle.","القانونُ للجميع","gesell"),
 ("die Steuererklärung","الإقرارُ الضريبي","die","die Steuererklärungen","Die Steuererklärung ist Pflicht.","الإقرارُ الضريبيُّ واجب","gesell"),
 ("der Sozialstaat","الدولةُ الاجتماعية","der","","Der Sozialstaat hilft in Notlagen.","الدولةُ الاجتماعيةُ تُعينُ عندَ الشدّة","gesell"),
 ("die Armut","الفقر","die","","Armut ist auch hier ein Thema.","الفقرُ قضيةٌ هنا أيضاً","gesell"),
 ("der Wohlstand","الرخاء","der","","Wohlstand ist ungleich verteilt.","الرخاءُ موزَّعٌ بلا عدل","gesell"),
 ("die Kluft","الفجوة","die","die Klüfte","Die Kluft zwischen Arm und Reich wächst.","الفجوةُ بينَ الفقيرِ والغنيِّ تتّسع","gesell"),
 ("der Wandel","التحوُّل","der","","Der digitale Wandel betrifft alle.","التحوُّلُ الرقميُّ يمسُّ الجميع","gesell"),
 ("die Auswirkung","الأثرُ الناتج","die","die Auswirkungen","Die Auswirkungen sieht man erst später.","الآثارُ تُرى لاحقاً","gesell"),
 ("die Maßnahme","الإجراء","die","die Maßnahmen","Die Maßnahme wirkt langsam.","الإجراءُ يعملُ ببطء","gesell"),
 ("fördern","يدعمُ وينمّي","","","Der Staat fördert junge Familien.","الدولةُ تدعمُ الأسرَ الشابّة","gesell"),
 ("die Förderung","الدعم","die","die Förderungen","Die Förderung läuft drei Jahre.","الدعمُ لثلاثِ سنوات","gesell"),
 ("die Beteiligung","المشاركة","die","","Die Beteiligung war hoch.","كانتِ المشاركةُ عالية","gesell"),
 ("die Öffentlichkeit","الرأيُ العام","die","","Die Öffentlichkeit ist informiert.","الرأيُ العامُّ مطَّلِع","gesell"),
 ("der Konflikt","النزاع","der","die Konflikte","Der Konflikt eskaliert.","النزاعُ يتصاعد","gesell"),
 ("die Lösung finden","يجدُ حلاً","","","Wir müssen eine Lösung finden.","علينا إيجادُ حل","gesell"),
]

B1_ARBEIT_KARRIERE = [
 ("die Karriere","المسارُ المهني","die","die Karrieren","Ihre Karriere begann früh.","بدأَ مسارُها باكراً","karriere"),
 ("der Werdegang","السيرةُ المهنية","der","die Werdegänge","Erzählen Sie von Ihrem Werdegang.","حدِّثْنا عن سيرتِكَ المهنية","karriere"),
 ("die Qualifikation","المؤهّل","die","die Qualifikationen","Ihre Qualifikation passt gut.","مؤهّلُكَ مناسبٌ جداً","karriere"),
 ("die Anerkennung","الاعتراف / التقدير","die","","Die Anerkennung des Abschlusses dauert.","الاعترافُ بالشهادةِ يطول","karriere"),
 ("die Weiterbildung","التأهيلُ المستمر","die","die Weiterbildungen","Weiterbildung zahlt sich aus.","التأهيلُ المستمرُّ يؤتي ثمارَه","karriere"),
 ("sich weiterentwickeln","يتطوَّرُ مهنياً","","","Ich möchte mich weiterentwickeln.","أودُّ أن أتطوَّر","karriere"),
 ("die Beförderung","الترقية","die","die Beförderungen","Er hofft auf eine Beförderung.","يأملُ ترقيةً","karriere"),
 ("die Führungskraft","الكادرُ القيادي","die","die Führungskräfte","Führungskräfte brauchen Empathie.","القياداتُ تحتاجُ تعاطفاً","karriere"),
 ("das Arbeitszeugnis","شهادةُ الخدمة","das","die Arbeitszeugnisse","Das Arbeitszeugnis war sehr gut.","كانت شهادةُ الخدمةِ ممتازة","karriere"),
 ("die Probezeit","فترةُ التجربة","die","die Probezeiten","Die Probezeit dauert sechs Monate.","فترةُ التجربةِ ستةُ أشهر","karriere"),
 ("die Selbstständigkeit","العملُ الحرّ","die","","Selbstständigkeit bedeutet Risiko.","العملُ الحرُّ مخاطرة","karriere"),
 ("gründen","يؤسّس","","","Er hat eine Firma gegründet.","أسَّسَ شركة","karriere"),
 ("das Risiko eingehen","يخوضُ المخاطرة","","","Ich gehe das Risiko ein.","أخوضُ المخاطرة","karriere"),
 ("scheitern","يفشل","","","Viele Projekte scheitern am Anfang.","مشاريعُ كثيرةٌ تفشلُ في البداية","karriere"),
 ("der Misserfolg","الإخفاق","der","die Misserfolge","Aus Misserfolgen lernt man.","من الإخفاقاتِ نتعلَّم","karriere"),
 ("der Erfolg","النجاح","der","die Erfolge","Der Erfolg kam spät.","جاءَ النجاحُ متأخِّراً","karriere"),
 ("die Vereinbarkeit von Beruf und Familie","التوفيقُ بينَ العملِ والأسرة","die","","Die Vereinbarkeit von Beruf und Familie bleibt schwierig.","التوفيقُ بينَ العملِ والأسرةِ يبقى صعباً","karriere"),
 ("die Elternzeit","إجازةُ الأبوّة","die","","Er nimmt zwei Monate Elternzeit.","يأخذُ شهرَينِ إجازةَ أبوّة","karriere"),
 ("die Teilzeitstelle","وظيفةٌ بدوامٍ جزئي","die","die Teilzeitstellen","Sie sucht eine Teilzeitstelle.","تبحثُ عن دوامٍ جزئي","karriere"),
 ("das Homeoffice","العملُ من البيت","das","","Homeoffice spart Fahrtzeit.","العملُ من البيتِ يوفّرُ وقتَ التنقُّل","karriere"),
 ("die Vergütung","الأجرُ التعويضي","die","die Vergütungen","Die Vergütung ist branchenüblich.","الأجرُ معتادٌ في القطاع","karriere"),
 ("verhandeln","يفاوض","","","Ich verhandle über das Gehalt.","أفاوضُ على الراتب","karriere"),
 ("der Kompromiss","التسوية","der","die Kompromisse","Wir haben einen Kompromiss gefunden.","وجدنا تسوية","karriere"),
 ("die Kündigung einreichen","يقدّمُ الاستقالة","","","Er hat die Kündigung eingereicht.","قدَّمَ استقالتَه","karriere"),
 ("die Arbeitslosigkeit","البطالة","die","","Die Arbeitslosigkeit ist gesunken.","انخفضتِ البطالة","karriere"),
 ("der Fachkräftemangel","نقصُ الكفاءات","der","","Der Fachkräftemangel wächst.","نقصُ الكفاءاتِ يتفاقم","karriere"),
 ("die Branche","القطاع","die","die Branchen","Die Branche boomt.","القطاعُ مزدهر","karriere"),
 ("der Kunde betreuen","يعتني بالزبون","","","Ich betreue die Kunden im Norden.","أعتني بزبائنِ الشمال","karriere"),
 ("die Zielvereinbarung","اتفاقُ الأهداف","die","die Zielvereinbarungen","Die Zielvereinbarung gilt ein Jahr.","اتفاقُ الأهدافِ لسنة","karriere"),
 ("belastbar bleiben","يبقى متحمّلاً للضغط","","","Unter Druck bleibe ich belastbar.","تحتَ الضغطِ أبقى متحمّلاً","karriere"),
]

B1_PSYCHE_KONFLIKT = [
 ("die Psyche","النفس","die","","Die Psyche braucht Pausen.","النفسُ تحتاجُ استراحات","psyche"),
 ("die Belastung","العبء","die","die Belastungen","Die Belastung ist zu hoch.","العبءُ ثقيلٌ جداً","psyche"),
 ("der Druck","الضغط","der","","Der Druck kommt von innen.","الضغطُ يأتي من الداخل","psyche"),
 ("die Erschöpfung","الإنهاك","die","","Die Erschöpfung kam plötzlich.","جاءَ الإنهاكُ فجأةً","psyche"),
 ("das Burnout","الاحتراقُ النفسي","das","","Burnout trifft auch Junge.","الاحتراقُ يصيبُ الشبابَ أيضاً","psyche"),
 ("die Gelassenheit","رباطةُ الجأش","die","","Gelassenheit kann man üben.","رباطةُ الجأشِ تُتمرَّن","psyche"),
 ("die Achtsamkeit","اليقظةُ الذهنية","die","","Achtsamkeit hilft beim Stress.","اليقظةُ الذهنيةُ تعينُ على التوتّر","psyche"),
 ("das Selbstwertgefühl","تقديرُ الذات","das","","Das Selbstwertgefühl wächst mit Erfolg.","تقديرُ الذاتِ ينمو بالنجاح","psyche"),
 ("die Enttäuschung","خيبةُ الأمل","die","die Enttäuschungen","Die Enttäuschung war groß.","كانت خيبةُ الأملِ كبيرة","psyche"),
 ("die Hoffnung","الأمل","die","die Hoffnungen","Die Hoffnung bleibt.","الأملُ باقٍ","psyche"),
 ("die Sehnsucht","الحنين","die","","Die Sehnsucht nach der Heimat ist stark.","الحنينُ إلى الوطنِ قوي","psyche"),
 ("das Heimweh","الحنينُ للديار","das","","Am Anfang hatte ich Heimweh.","في البدايةِ اشتقتُ للديار","psyche"),
 ("sich wohlfühlen","يشعرُ بالارتياح","","","Ich fühle mich hier wohl.","أشعرُ بالارتياحِ هنا","psyche"),
 ("die Unsicherheit","عدمُ اليقين","die","die Unsicherheiten","Unsicherheit macht müde.","عدمُ اليقينِ مُتعِب","psyche"),
 ("der Zweifel","الشك","der","die Zweifel","Zweifel sind normal.","الشكوكُ طبيعية","psyche"),
 ("die Entscheidung treffen","يتّخذُ قراراً","","","Ich muss eine Entscheidung treffen.","عليَّ اتّخاذُ قرار","psyche"),
 ("bereuen","يندم","","","Ich bereue nichts.","لا أندمُ على شيء","psyche"),
 ("verzeihen","يسامح","","","Er hat mir verziehen.","سامحَني","psyche"),
 ("die Auseinandersetzung","السجال","die","die Auseinandersetzungen","Die Auseinandersetzung war hart.","كانَ السجالُ قاسياً","konflikt"),
 ("der Vorwurf","اللوم","der","die Vorwürfe","Das ist ein harter Vorwurf.","هذا لومٌ قاسٍ","konflikt"),
 ("vorwerfen","يلوم","","","Er wirft mir Nachlässigkeit vor.","يلومُني على الإهمال","konflikt"),
 ("beleidigen","يهين","","","Er wollte niemanden beleidigen.","لم يُرِدْ إهانةَ أحد","konflikt"),
 ("sich durchsetzen","يفرضُ رأيَه","","","Sie hat sich durchgesetzt.","فرضت رأيَها","konflikt"),
 ("nachvollziehen","يتفهَّمُ المنطق","","","Das kann ich nachvollziehen.","أستطيعُ تفهُّمَ ذلك","konflikt"),
 ("vermitteln","يتوسَّط","","","Der Chef vermittelt im Streit.","المديرُ يتوسَّطُ في النزاع","konflikt"),
 ("die Vermittlung","الوساطة","die","","Die Vermittlung hat geholfen.","أفادتِ الوساطة","konflikt"),
 ("einlenken","يلين","","","Am Ende hat er eingelenkt.","في الآخرِ لان","konflikt"),
 ("die Bedingung stellen","يشترط","","","Sie stellt eine Bedingung.","تضعُ شرطاً","konflikt"),
 ("das Missverständnis ausräumen","يُزيلُ سوءَ الفهم","","","Wir haben das Missverständnis ausgeräumt.","أزلنا سوءَ الفهم","konflikt"),
 ("die Versöhnung","المصالحة","die","","Die Versöhnung kam spät.","جاءتِ المصالحةُ متأخِّرة","konflikt"),
]

B1_ARGUMENT = [
 ("die Behauptung","الادّعاء","die","die Behauptungen","Diese Behauptung ist nicht belegt.","هذا الادّعاءُ غيرُ مسنَد","argum"),
 ("behaupten","يدّعي","","","Er behauptet, alles zu wissen.","يدّعي أنَّهُ يعلمُ كلَّ شيء","argum"),
 ("das Argument","الحجّة","das","die Argumente","Dein Argument überzeugt mich.","حجّتُكَ تقنعُني","argum"),
 ("überzeugen","يُقنِع","","","Die Zahlen überzeugen.","الأرقامُ مقنعة","argum"),
 ("der Beleg","الدليل","der","die Belege","Gibt es einen Beleg dafür?","أثمَّةَ دليلٌ على ذلك؟","argum"),
 ("belegen","يُسنِدُ بدليل","","","Kannst du das belegen?","أتستطيعُ إسنادَ ذلك؟","argum"),
 ("die These","الأطروحة","die","die Thesen","Die These ist gewagt.","الأطروحةُ جريئة","argum"),
 ("widerlegen","يفنّد","","","Die Studie widerlegt das.","الدراسةُ تفنّدُ ذلك","argum"),
 ("einräumen","يُقِرُّ جزئياً","","","Ich räume ein, dass es Risiken gibt.","أُقِرُّ بوجودِ مخاطر","argum"),
 ("dennoch","ومع ذلك","","","Dennoch bleibe ich dabei.","ومع ذلك أبقى على رأيي","argum"),
 ("allerdings","بيدَ أنّ","","","Allerdings fehlt das Geld.","بيدَ أنَّ المالَ ناقص","argum"),
 ("im Gegensatz zu","على خلافِ","","","Im Gegensatz zu früher ist es einfacher.","على خلافِ السابقِ صارَ أسهل","argum"),
 ("im Vergleich zu","بالمقارنةِ مع","","","Im Vergleich zu Berlin ist es billig.","بالمقارنةِ مع برلين رخيص","argum"),
 ("zum einen","من جهةٍ أولى","","","Zum einen spart es Zeit.","من جهةٍ أولى يوفّرُ وقتاً","argum"),
 ("zum anderen","ومن جهةٍ ثانية","","","Zum anderen kostet es mehr.","ومن جهةٍ ثانيةٍ يكلّفُ أكثر","argum"),
 ("folglich","وبالتالي","","","Folglich müssen wir sparen.","وبالتالي علينا الاقتصاد","argum"),
 ("daher","ولذا","","","Daher schlage ich Folgendes vor.","ولذا أقترحُ ما يلي","argum"),
 ("angesichts","بالنظرِ إلى","","","Angesichts der Lage warten wir.","بالنظرِ إلى الوضعِ ننتظر","argum"),
 ("hinsichtlich","فيما يخصّ","","","Hinsichtlich der Kosten gibt es Fragen.","فيما يخصُّ التكاليفَ ثمّةَ أسئلة","argum"),
 ("die Voraussetzung erfüllen","يستوفي الشرط","","","Er erfüllt alle Voraussetzungen.","يستوفي كلَّ الشروط","argum"),
 ("einschätzen","يقدّر / يقيّم","","","Wie schätzt du die Lage ein?","كيفَ تقيّمُ الوضع؟","argum"),
 ("die Einschätzung","التقييم","die","die Einschätzungen","Meine Einschätzung ist vorsichtig.","تقييمي حذر","argum"),
 ("der Standpunkt vertreten","يتبنّى موقفاً","","","Sie vertritt einen klaren Standpunkt.","تتبنّى موقفاً واضحاً","argum"),
 ("abwägen","يوازن","","","Man muss Vor- und Nachteile abwägen.","يجبُ موازنةُ المزايا والعيوب","argum"),
 ("die Konsequenz","التبعة","die","die Konsequenzen","Das hat Konsequenzen.","لهذا تبعات","argum"),
]

NEUE_DECKS = [
 ("b1-gesellschaft-staat", "B1", "المجتمع والدولة والمشاركة المدنية", B1_GESELLSCHAFT),
 ("b1-arbeit-karriere", "B1", "المسار المهني والتفاوض وسوق العمل", B1_ARBEIT_KARRIERE),
 ("b1-psyche-konflikt", "B1", "النفس والضغط والنزاع والمصالحة", B1_PSYCHE_KONFLIKT),
 ("b1-argumentieren", "B1", "لغة الحِجاج: الادّعاء والدليل والموازنة", B1_ARGUMENT),
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
            kid = f"vg-{deckId[3:10]}-{j:03d}"
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
