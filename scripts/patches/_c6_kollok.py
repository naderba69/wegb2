# -*- coding: utf-8 -*-
"""R180 (C6): B2-Kollokations-Vertiefung — 30 Items mit Kontextsatz, Partner-Logik auf Arabisch."""
import json

def k(id_, koll, satz, satzAr, antw, falsch, ar, note):
    return {"id": id_, "kollokation": koll, "satz": satz, "satzAr": satzAr, "antwort": antw,
            "optionen": [antw] + falsch, "ar": ar, "noteAr": note}

K = [
 k("kv-01", "eine Entscheidung treffen", "Der Vorstand ___ morgen eine endgültige Entscheidung.", "سيتخذ مجلس الإدارة غدًا قرارًا نهائيًا.", "trifft", ["macht", "tut", "gibt"], "يتّخذ قرارًا", "قرارات تُتّخذ بـtreffen لا بـmachen: نقول eine Entscheidung treffen."),
 k("kv-02", "einen Antrag stellen", "Sie ___ einen Antrag auf ein Stipendium.", "هي تتقدّم بطلب للحصول على منحة.", "stellt", ["macht", "gibt", "nimmt"], "يتقدّم بطلب رسمي", "الطلب الرسمي يُقدَّم بـstellen: einen Antrag stellen."),
 k("kv-03", "Kritik üben", "Die Opposition ___ scharfe Kritik an dem Plan.", "تمارس المعارضة نقدًا حادًا للخطة.", "übt", ["macht", "sagt", "spricht"], "يمارس النقد / يوجّه نقدًا", "النقد يُمارَس بـüben: Kritik üben an + Dativ."),
 k("kv-04", "eine Rolle spielen", "Das Geld ___ dabei keine Rolle.", "المال لا يلعب دورًا في ذلك.", "spielt", ["macht", "hat", "ist"], "يلعب دورًا", "الدور يُلعَب بـspielen: eine Rolle spielen."),
 k("kv-05", "Verantwortung übernehmen", "Er ___ die volle Verantwortung für den Fehler.", "هو يتحمّل المسؤولية الكاملة عن الخطأ.", "übernimmt", ["hat", "macht", "gibt"], "يتحمّل المسؤولية", "المسؤولية تُتحمَّل بـübernehmen (أو tragen)، لا بـhaben."),
 k("kv-06", "einen Beitrag leisten", "Jeder kann einen Beitrag zum Klimaschutz ___.", "يستطيع كلّ واحد أن يقدّم إسهامًا في حماية المناخ.", "leisten", ["machen", "geben", "tun"], "يقدّم إسهامًا", "الإسهام يُقدَّم بـleisten: einen Beitrag leisten zu."),
 k("kv-07", "Maßnahmen ergreifen", "Die Regierung ___ wirksame Maßnahmen gegen die Krise.", "تتخذ الحكومة إجراءات فعّالة ضد الأزمة.", "ergreift", ["macht", "tut", "stellt"], "يتّخذ إجراءات", "الإجراءات الرسمية تُتّخذ بـergreifen: Maßnahmen ergreifen."),
 k("kv-08", "zur Verfügung stehen", "Ich ___ Ihnen jederzeit zur Verfügung.", "أنا تحت تصرّفك في أيّ وقت.", "stehe", ["bin", "bleibe", "komme"], "يكون تحت التصرّف", "صيغة ثابتة: jemandem zur Verfügung stehen — لا نقول ich bin zur Verfügung."),
 k("kv-09", "in Kraft treten", "Das neue Gesetz ___ am ersten Januar in Kraft.", "يدخل القانون الجديد حيّز التنفيذ في الأول من يناير.", "tritt", ["kommt", "geht", "wird"], "يدخل حيّز التنفيذ", "القوانين تدخل حيّز النفاذ بـtreten: in Kraft treten."),
 k("kv-10", "Rücksicht nehmen", "Man sollte auf ältere Menschen Rücksicht ___.", "ينبغي مراعاة كبار السن.", "nehmen", ["machen", "haben", "geben"], "يراعي / يأخذ بالاعتبار", "المراعاة بـnehmen: Rücksicht nehmen auf + Akk."),
 k("kv-11", "einen Termin vereinbaren", "Ich möchte einen Termin beim Arzt ___.", "أريد تحديد موعد عند الطبيب.", "vereinbaren", ["bestellen", "eröffnen", "bezahlen"], "يحدّد موعدًا بالاتفاق", "الموعد يُتّفق عليه بـvereinbaren (رسميًا أدقّ من machen العامية)."),
 k("kv-12", "Bedenken äußern", "Sie ___ Bedenken gegen den Vorschlag.", "هي تُبدي تحفّظات على الاقتراح.", "äußert", ["sagt", "spricht", "tut"], "يُبدي (رأيًا/تحفّظًا)", "الإبداء الرسمي بـäußern: Bedenken/Zweifel äußern."),
 k("kv-13", "eine Gefahr darstellen", "Diese Entwicklung ___ eine ernsthafte Gefahr dar.", "يمثّل هذا التطوّر خطرًا جدّيًا.", "stellt", ["ist", "macht", "gibt"], "يمثّل / يشكّل", "فعل منفصل: eine Gefahr darstellen (stellt ... dar)."),
 k("kv-14", "eine Schlussfolgerung ziehen", "Welche Schlussfolgerung ___ Sie aus den Daten?", "ما الاستنتاج الذي تستخلصه من البيانات؟", "ziehen", ["machen", "nehmen", "holen"], "يستخلص استنتاجًا", "الاستنتاج يُستخلَص بـziehen: eine Schlussfolgerung ziehen."),
 k("kv-15", "Anforderungen erfüllen", "Das Produkt ___ alle technischen Anforderungen.", "يستوفي المنتج جميع المتطلّبات التقنية.", "erfüllt", ["macht", "hat", "tut"], "يستوفي المتطلبات", "الاستيفاء بـerfüllen: Anforderungen/Bedingungen erfüllen."),
 k("kv-16", "Vorrang haben", "Die Sicherheit der Kinder ___ absoluten Vorrang.", "لسلامة الأطفال أولوية مطلقة.", "hat", ["ist", "macht", "steht"], "له الأولوية", "صيغة ثابتة: Vorrang haben vor + Dativ."),
 k("kv-17", "zur Sprache bringen", "Ich ___ das Thema morgen zur Sprache.", "سأطرح الموضوع غدًا للنقاش.", "bringe", ["sage", "mache", "rede"], "يطرح (موضوعًا) للنقاش", "الطرح للنقاش بـbringen: etwas zur Sprache bringen."),
 k("kv-18", "Wert legen", "Wir ___ großen Wert auf Qualität.", "نحن نولي أهمية كبيرة للجودة.", "legen", ["machen", "haben", "geben"], "يولي أهمية", "إيلاء القيمة بـlegen: Wert legen auf + Akk."),
 k("kv-19", "in Frage kommen", "Das ___ für uns nicht in Frage.", "هذا غير وارد بالنسبة لنا.", "kommt", ["geht", "ist", "bleibt"], "يكون واردًا / ممكنًا", "الوارد بـkommen: für jemanden in Frage kommen."),
 k("kv-20", "Kenntnis nehmen", "Ich habe von Ihrem Schreiben Kenntnis ___.", "لقد اطّلعت على رسالتك (أخذت علمًا بها).", "genommen", ["gelesen", "gehört", "gesehen"], "يأخذ علمًا بـ", "الماضي التام بـgenommen: von etwas Kenntnis nehmen — صيغة رسمية في الرسائل."),
 k("kv-21", "Bezug nehmen", "Er hat in seiner Antwort auf Ihren Brief Bezug ___.", "لقد أشار في ردّه إلى رسالتك.", "genommen", ["gemacht", "gestellt", "geschrieben"], "يشير إلى / يحيل إلى", "الإحالة الرسمية: Bezug nehmen auf + Akk. — الماضي genommen."),
 k("kv-22", "in Anspruch nehmen", "Die Beratung wurde von vielen Familien in Anspruch ___.", "استفادت عائلات كثيرة من الاستشارة.", "genommen", ["gemacht", "gebraucht", "genutzt"], "يستعين بـ / يستفيد من", "الاستعانة: eine Leistung in Anspruch nehmen — الماضي genommen."),
 k("kv-23", "unter Beweis stellen", "Sie hat ihr Können unter Beweis ___.", "لقد أثبتت قدرتها.", "gestellt", ["gemacht", "gezeigt", "getan"], "يثبت (قدرته)", "الإثبات: sein Können unter Beweis stellen — الماضي gestellt."),
 k("kv-24", "auf den Weg bringen", "Das Projekt wurde endlich auf den Weg ___.", "أُطلق المشروع أخيرًا.", "gebracht", ["gemacht", "gestellt", "gestartet"], "يُطلق (مشروعًا)", "الإطلاق: ein Projekt auf den Weg bringen — الماضي gebracht."),
 k("kv-25", "auf dem neuesten Stand", "Die Technik hier ist auf dem ___ Stand.", "التقنية هنا على أحدث مستوى.", "neuesten", ["letzten", "höchsten", "größten"], "على أحدث ما يكون", "صيغة ثابتة: auf dem neuesten Stand (sein/bleiben)."),
 k("kv-26", "in vollem Umfang", "Wir unterstützen den Plan in ___ Umfang.", "ندعم الخطة بشكل كامل تمامًا.", "vollem", ["ganzem", "großem", "weitem"], "بشكل كامل", "صيغة ثابتة: in vollem Umfang."),
 k("kv-27", "eine Rede halten", "Die Ministerin ___ eine Rede vor dem Parlament.", "تلقي الوزيرة خطابًا أمام البرلمان.", "hält", ["gibt", "macht", "sagt"], "يلقي خطابًا", "الخطاب يُلقى بـhalten: eine Rede/einen Vortrag halten."),
 k("kv-28", "Rede und Antwort stehen", "Der Direktor musste den Eltern Rede und Antwort ___.", "كان على المدير أن يفسّر ويبرّر أمام الأهل.", "stehen", ["geben", "machen", "sagen"], "يقف مفسّرًا ومبرّرًا", "صيغة ثابتة: jemandem Rede und Antwort stehen."),
 k("kv-29", "zur Verfügung stellen", "Die Stadt ___ den Vereinen Räume zur Verfügung.", "تضع المدينة قاعات تحت تصرّف الجمعيات.", "stellt", ["gibt", "macht", "bringt"], "يضع تحت التصرّف", "الإتاحة بـstellen: jemandem etwas zur Verfügung stellen — قارن kv-08."),
 k("kv-30", "Abschied nehmen", "Wir ___ Abschied von unserer Kollegin.", "نودّع زميلتنا.", "nehmen", ["machen", "geben", "sagen"], "يودّع", "الوداع بـnehmen: Abschied nehmen von + Dativ."),
 k("kv-31", "Einfluss ausüben", "Er ___ großen Einfluss auf die Jugend aus.", "يمارس تأثيرًا كبيرًا على الشباب.", "übt", ["macht", "tut", "spielt"], "يمارس تأثيرًا", "التأثير يُمارَس بـausüben: Einfluss ausüben auf + Akk."),
]

for it in K:
    assert "___" in it["satz"] and it["antwort"] in it["optionen"] and len(set(it["optionen"])) == 4, it["id"]
print("kollok ok:", len(K))
json.dump(K, open("/tmp/kollok.json", "w"), ensure_ascii=False, indent=2)
