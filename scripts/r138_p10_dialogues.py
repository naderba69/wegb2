#!/usr/bin/env python3
"""P-10 remaining: Konto eröffnen + Mietvertrag dialogues."""
import json
from collections import OrderedDict

dlgs = [
    OrderedDict([
        ("id", "dlg-b1-kontoeroeffnung"),
        ("level", "B1"),
        ("titleDe", "Ein Girokonto eröffnen"),
        ("titleAr", "فتح حساب جارٍ في البنك"),
        ("ort", "Bankfiliale"),
        ("lines", [
            OrderedDict([("who","Kunde"),("de","Guten Tag! Ich möchte gerne ein Girokonto eröffnen."),("ar","نهارك سعيد! أريد فتح حساب جارٍ من فضلك.")]),
            OrderedDict([("who","Mitarbeiterin"),("de","Guten Tag! Bringen Sie bitte Ihren Personalausweis oder Pass und Ihre Meldebescheinigung mit."),("ar","نهارك سعيد! أحضر معك بطاقتك الشخصية أو جواز سفرك وشهادة التسجيل في السكن من فضلك.")]),
            OrderedDict([("who","Kunde"),("de","Ja, hier ist mein Personalausweis und die Meldebescheinigung."),("ar","نعم، هذه بطاقتي وشهادة التسجيل.")]),
            OrderedDict([("who","Mitarbeiterin"),("de","Danke. Möchten Sie das Konto online führen oder möchten Sie regelmäßig in die Filiale kommen?"),("ar","شكراً. هل تريد إدارة الحساب عبر الإنترنت أم تأتي بانتظام إلى الفرع؟")]),
            OrderedDict([("who","Kunde"),("de","Am liebsten online. Gibt es eine monatliche Gebühr?"),("ar","عبر الإنترنت من فضلك. هل توجد رسوم شهرية؟")]),
            OrderedDict([("who","Mitarbeiterin"),("de","Für Studenten und Azubis ist das Girokonto kostenlos. Ansonsten kostet es 4,90 Euro im Monat."),("ar","الحساب الجاري مجاني للطلاب والمتدربين. خلاف ذلك يكلّف 4.90 يورو شهرياً.")]),
            OrderedDict([("who","Kunde"),("de","Ich bin Studentin. Hier ist meine Immatrikulationsbescheinigung."),("ar","أنا طالبة. هذه شهادة قيدي الجامعي.")]),
            OrderedDict([("who","Mitarbeiterin"),("de","Perfekt. Dann füllen Sie bitte dieses Formular aus. Sie bekommen die Karte und die PIN in etwa einer Woche per Post."),("ar","ممتاز. املأ من فضلك هذه الاستمارة. ستصلك البطاقة والرمز السري بالبريد خلال أسبوع تقريباً.")]),
            OrderedDict([("who","Kunde"),("de","Vielen Dank für die Hilfe!"),("ar","شكراً جزيلاً على المساعدة!")]),
        ]),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Welche Dokumente braucht der Kunde?"),("promptAr","ما الوثائق التي يحتاجها الزبون؟"),("options",["Personalausweis/Pass + Meldebescheinigung","Nur den Führerschein","Eine Gehaltsabrechnung","Keine Dokumente"]),("answer",0),("explanationAr","الموظّفة طلبت Personalausweis أو Pass وMeldebescheinigung.")]),
            OrderedDict([("type","mc"),("promptDe","Wann ist das Konto kostenlos?"),("promptAr","متى يكون الحساب مجانياً؟"),("options",["Für alle","Für Studenten und Azubis","Nur für Rentner","Nur online"]),("answer",1),("explanationAr","الحساب مجاني للطلاب والمتدربين.")]),
        ]),
        ("dictation",["Ich möchte gerne ein Girokonto eröffnen.","Sie bekommen die Karte und die PIN in etwa einer Woche per Post."]),
    ]),
    OrderedDict([
        ("id", "dlg-b2-mietvertrag"),
        ("level", "B2"),
        ("titleDe", "Mietvertrag unterschreiben — Fragen an die Vermieterin"),
        ("titleAr", "توقيع عقد الإيجار — أسئلة للمؤجِّرة"),
        ("ort", "Wohnungsbesichtigung"),
        ("lines", [
            OrderedDict([("who","Vermieterin"),("de","Frau Saleh, hier ist der Mietvertrag. Die Kaltmiete beträgt 720 Euro, die Nebenkosten liegen bei 180 Euro warm."),("ar","الآنسة صالح، هذا عقد الإيجار. الإيجار الأساسي 720 يورو والتكاليف الجانبية 180 يورو، أي الإيجار الإجمالي 900 يورو.")]),
            OrderedDict([("who","Mieterin"),("de","Ist die Kaution vereinbart? Üblich sind drei Kaltmieten, oder?"),("ar","هل تم الاتفاق على التأمين؟ المعتاد ثلاثة إيجارات أساسية، أليس كذلك؟")]),
            OrderedDict([("who","Vermieterin"),("de","Ja, die Kaution beträgt 2160 Euro und wird auf ein separates Kautionskonto eingezahlt."),("ar","نعم، التأمين 2160 يورو ويُدفع في حساب تأمين منفصل.")]),
            OrderedDict([("who","Mieterin"),("de","Wie lange ist die Kündigungsfrist?"),("ar","ما مهلة الفسخ؟")]),
            OrderedDict([("who","Vermieterin"),("de","Für Sie gilt die gesetzliche Frist von drei Monaten. In den ersten zwei Jahren gibt es eine Staffelmiete von zwei Prozent pro Jahr."),("ar","تنطبق عليك المهلة القانونية وهي ثلاثة أشهر. في أول عامين هناك إيجار متدرّج بنسبة 2% سنوياً.")]),
            OrderedDict([("who","Mieterin"),("de","Darf ich in der Wohnung Wände streichen oder kleine Bohrungen machen?"),("ar","هل يجوز لي طلاء الجدران أو إجراء ثقوب صغيرة؟")]),
            OrderedDict([("who","Vermieterin"),("de","Streichen in neutralen Farben ist erlaubt, Bohrungen bitte nur in Absprache. Bei Auszug muss die Wohnung in dem Zustand übergeben werden, wie Sie sie übernommen haben."),("ar","الطلاء بألوان محايدة مسموح، والثقوب يرجى أن تكون بالاتفاق. عند المغادرة يجب تسليم الشقة بحالة الاستلام.")]),
            OrderedDict([("who","Mieterin"),("de","Gut, dann lese ich den Vertrag noch einmal in Ruhe durch und schicke ihn Ihnen unterschrieben zurück."),("ar","جيد، سأقرأ العقد بهدوء ثم أرسله إليك موقّعاً.")]),
        ]),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Wie hoch ist die Warmmiete?"),("promptAr","ما الإيجار الإجمالي (Warmmiete)؟"),("options",["720 Euro","900 Euro","180 Euro","2160 Euro"]),("answer",1),("explanationAr","Kaltmiete 720 + Nebenkosten 180 = 900 يورو.")]),
            OrderedDict([("type","mc"),("promptDe","Auf welches Konto geht die Kaution?"),("promptAr","في أي حساب يُدفع التأمين؟"),("options",["Auf das Privatkonto der Vermieterin","Auf ein separates Kautionskonto","Auf das Konto des Hausmeisters","Bar bei Übergabe"]),("answer",1),("explanationAr","القانون يقتضي حساب تأمين منفصل (Kautionskonto).")]),
        ]),
        ("dictation",["Die Kaltmiete beträgt 720 Euro, die Nebenkosten liegen bei 180 Euro warm.","In den ersten zwei Jahren gibt es eine Staffelmiete von zwei Prozent pro Jahr."]),
    ]),
]

out = "content/dialogues.json"
data = json.load(open(out, encoding="utf-8"), object_pairs_hook=OrderedDict)
ids = {d['id'] for d in data}
added = 0
for d in dlgs:
    if d['id'] not in ids:
        data.append(d)
        added += 1
json.dump(data, open(out,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
open(out,'a',encoding='utf-8').write('\n')
print(f"Added {added} dialogues. Total: {len(data)}")
