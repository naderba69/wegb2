# -*- coding: utf-8 -*-
"""R180 (C6): B2-Synonym-Vertiefung (Register-Stufe) — 24 Items + Bank schreiben."""
import json

def s(id_, basis, ziel, satz, satzAr, falsch, nuance):
    opts = [ziel, basis] + falsch
    return {"id": id_, "basis": basis, "ziel": ziel, "satz": satz, "satzAr": satzAr,
            "optionen": opts, "nuanceAr": nuance}

S = [
 s("sv-01", "bekommen", "erhalten", "Sehr geehrte Damen und Herren, ich habe Ihr Schreiben vom 3. Mai ___.", "سيداتي وسادتي المحترمين، لقد تلقّيت رسالتكم بتاريخ 3 مايو.", ["gekriegt", "geholt"], "في الرسائل الرسمية: erhalten (تلقّى من جهة) أرقى أسلوبًا من bekommen اليومية، وgekriegt عامية مرفوضة كتابيًا."),
 s("sv-02", "machen", "durchführen", "Das Institut wird die Befragung im Herbst ___.", "سيجري المعهد الاستطلاع في الخريف.", ["tun", "schaffen"], "إجراء الدراسات والاستطلاعات: durchführen — machen عامة جدًا في التقارير العلمية."),
 s("sv-03", "sagen", "äußern", "Er wollte seine Meinung zu dem Vorfall nicht ___.", "لم يرد أن يُبدي رأيه في الحادثة.", ["sprechen", "reden"], "إبداء الرأي رسميًا: sich äußern / seine Meinung äußern — sagen محايدة، reden حديثية."),
 s("sv-04", "helfen", "unterstützen", "Die Stiftung ___ junge Forscher mit Stipendien.", "تدعم المؤسسة الباحثين الشباب بمنح.", ["retten", "dienen"], "الدعم المؤسسي المالي والمعنوي: unterstützen — helfen عامة للمساعدة المباشرة."),
 s("sv-05", "zeigen", "darstellen", "Die Grafik ___ die Entwicklung der letzten zehn Jahre.", "يُظهر الرسم البياني تطوّر السنوات العشر الأخيرة.", ["malen", "gucken"], "عرض البيانات والحقائق: darstellen — zeigen عامة (أريه بيدي)."),
 s("sv-06", "fragen", "sich erkundigen", "Er ___ sich am Schalter nach dem Fahrplan.", "استفسر عند الشباك عن جدول الرحلات.", ["bitten", "rufen"], "الاستفسار المهذّب الرسمي: sich erkundigen nach + Dativ."),
 s("sv-07", "antworten", "erwidern", "Auf die Kritik ___ sie ruhig und sachlich.", "ردّت على النقد بهدوء وموضوعية.", ["erzählen", "rufen"], "الردّ في السرد الأدبي والرسمي: erwidern — antworten محايدة على سؤال مباشر."),
 s("sv-08", "sehen", "betrachten", "Wir müssen das Problem aus einer anderen Perspektive ___.", "علينا أن ننظر إلى المشكلة من منظور آخر.", ["gucken", "schauen"], "النظر التأملي المنهجي: betrachten — gucken عامية، schauen يومية."),
 s("sv-09", "benutzen", "verwenden", "Für den Versuch ___ wir ein neues Verfahren.", "في التجربة نستخدم إجراءً جديدًا.", ["nehmen", "machen"], "الاستخدام المنهجي في العلم والإدارة: verwenden — benutzen يومية شائعة."),
 s("sv-10", "kaufen", "erwerben", "Das Museum konnte das Gemälde günstig ___.", "استطاع المتحف اقتناء اللوحة بسعر مناسب.", ["holen", "nehmen"], "الاقتناء الرسمي (ممتلكات/حقوق/شهادات): erwerben — kaufen للسوق اليومي."),
 s("sv-11", "geben", "überreichen", "Der Direktor ___ ihr die Urkunde persönlich.", "سلّمها المدير الشهادة شخصيًا.", ["bringen", "zeigen"], "التسليم الاحتفالي الرسمي: überreichen (شهادات وجوائز)."),
 s("sv-12", "brauchen", "benötigen", "Für den Antrag ___ wir Ihre Unterschrift.", "نحتاج إلى توقيعك للطلب.", ["wollen", "nehmen"], "الاحتياج الرسمي في الطلبات: benötigen — brauchen يومية."),
 s("sv-13", "erlauben", "gestatten", "___ Sie, dass ich mich kurz vorstelle?", "أتسمح لي أن أقدّم نفسي باختصار؟", ["lassen", "machen"], "صيغة أدب ثابتة: Gestatten Sie ...؟ — أرقى من Erlauben Sie في التقديم الرسمي."),
 s("sv-14", "erzählen", "berichten", "Die Zeitung ___ ausführlich über den Unfall.", "تروي الصحيفة / تورد بالتفصيل عن الحادث.", ["sagen", "malen"], "السرد الإخباري والرسمي: berichten über — erzählen للقصص الشخصية."),
 s("sv-15", "meinen", "erwägen", "Wir ___ ernsthaft einen Umzug ins Ausland.", "نفكّر جديًا في الانتقال إلى الخارج.", ["glauben", "sagen"], "التفكير في خيار ودراسته: erwägen — meinen للرأي، glauben للاعتقاد. فرق معنوي لا أسلوبي فقط."),
 s("sv-16", "prüfen", "untersuchen", "Die Polizei ___ den Fall seit Wochen.", "تحقّق الشرطة في القضية منذ أسابيع.", ["machen", "sehen"], "التحقيق والفحص المعمّق: untersuchen (قضية/مريض/عينة) — prüfen لمراجعة سريعة."),
 s("sv-17", "ändern", "anpassen", "Wir müssen den Zeitplan an die neue Lage ___.", "علينا تكييف الجدول مع الوضع الجديد.", ["machen", "tun"], "التكييف مع ظرف: etwas an etwas (Akk.) anpassen — ändern تغيير عام."),
 s("sv-18", "stark", "erheblich", "Die Preise sind im letzten Jahr ___ gestiegen.", "ارتفعت الأسعار بشكل كبير في السنة الماضية.", ["sehr", "viel"], "في التقارير: erheblich صفة مقدار رسمية قبل الأفعال (erheblich steigen/sinken)."),
 s("sv-19", "alt", "ehemalig", "Der ___ Direktor der Schule besuchte uns gestern.", "زارنا مدير المدرسة السابق أمس.", ["jung", "groß"], "فرق معنوي: ehemalig = السابق في المنصب، alt = عجوز/قديم. لشخص لم يعد مديرًا: ehemalig."),
 s("sv-20", "neu", "aktuell", "Der ___ Stand der Forschung ist eindeutig.", "أحدث ما وصل إليه البحث واضح (وضع البحث الحالي).", ["frisch", "jung"], "تركيب ثابت: der aktuelle Stand / die aktuelle Lage — aktuell للحاضر الجاري، neu لشيء صُنع حديثًا."),
 s("sv-21", "schnell", "umgehend", "Wir bitten um ___ Antwort bis Freitag.", "نرجو الردّ الفوري حتى الجمعة.", ["bald", "rasch"], "في مراسلات العمل: umgehend صيغة طلب رسمية ثابتة (sofort, ohne Verzögerung)."),
 s("sv-22", "geben", "erteilen", "Auskunft kann Ihnen nur die Pressestelle ___.", "لا يستطيع إعطاءك المعلومات إلا المكتب الصحفي.", ["machen", "sagen"], "تركيب رسمي ثابت: Auskunft erteilen — geben هنا يومية."),
 s("sv-23", "Job", "Tätigkeit", "Sie sucht eine neue berufliche ___.", "تبحث عن نشاط مهني جديد.", ["Arbeit", "Sache"], "في السير الذاتية والتقارير: Tätigkeit (نشاط مهني رسمي) — Job حديثية من الإنجليزية."),
 s("sv-24", "Geld", "Finanzmittel", "Für den Ausbau der Schule fehlen die nötigen ___.", "لأعمال توسيع المدرسة تنقص الوسائل المالية اللازمة.", ["Sachen", "Stücke"], "في لغة المؤسسات: Finanzmittel (موارد مالية مخصصة) — Geld عام."),
]

for it in S:
    assert "___" in it["satz"], it["id"]
    assert it["ziel"] in it["optionen"] and len(set(it["optionen"])) == 4, it["id"]

from _c6_kollok import K as kollok  # Autorliste aus _c6_kollok.py (schreibt /tmp/kollok.json nebenbei)
json.dump({"items": kollok}, open("content/kollok-vertiefung.json", "w"), ensure_ascii=False, indent=2)
json.dump({"items": S}, open("content/synonym-vertiefung.json", "w"), ensure_ascii=False, indent=2)
print("OK", len(kollok), "Kollok +", len(S), "Synonym")
