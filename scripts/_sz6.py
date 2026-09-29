# -*- coding: utf-8 -*-
"""ξ8 — ستةُ سيناريوهاتٍ إداريةٍ تونسية (jobcenter/wohngeld/kindergeld/versicherung/studienfinanzierung/auslaenderbehoerde-finanzamt) بنفس قالبِ القديم."""
import json, re

ROOT = "/home/user/weg-nach-b2"
CJK = re.compile(r"[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]")
ARc = re.compile(r"[\u0600-\u06ff]")

def S(de, ar): return {"de": de, "ar": ar}
def L(who, role, de, ar): return {"who": who, "role": role, "de": de, "ar": ar}

SZ = [
{
 "id": "jobcenter", "emoji": "🧾", "nameDe": "Bürgergeld & Mitwirkung", "nameAr": "عِوَضُ المواطنةِ وواجبُ التعاون",
 "kontext": "تسجيلٌ كعاطلٍ، طلبُ Bürgergeld، ودعوتُ Integration: الوثائقُ غلافُ الأمر، والصمتُ عن الدعوةِ يُكلِّفُ المال.",
 "saetze": [
  S("Ich möchte mich arbeitslos melden — mein Vertrag endete zum Monatsende.", "أريدُ التصريحَ ببطالتي — انتهى عقدي آخرَ الشهر."),
  S("Ohne Arbeitsbescheinigung des Arbeitgebers keine Bearbeitung.", "بدونِ شهادةِ عملٍ من المُشغِّل لا معالجةَ للطلب."),
  S("Der Bewilligungsbescheid liegt abholbereit in Ihrem Postfach.", "قرارُ المنحةِ جاهزٌ للسحبِ في صندوقِ رسائلك."),
  S("Bei einer Sanktion kann ich innerhalb eines Monats widersprechen.", "عندَ العقوبةِ يحقُّ لي الاعتراضُ خلالَ شهرٍ واحد."),
  S("Das Jobcenter erstattet die Fahrtkosten zum Bewerbungsgespräch.", "صندوقُ التعليمِ يغطي مصاريفَ التنقلِ لمقابلةِ العمل."),
  S("Ich brauche einen Bildungsgutschein für die Umschulung.", "أحتاجُ قسيمةَ تأهيلٍ لإعادةِ التكوين."),
 ],
 "dialoge": [
  {"titel": "Erstmeldung (التسجيلُ الأول)", "lines": [
    L("A", "Youssef", "Guten Tag — mein Arbeitgeber meldet mich erst nächste Woche. Gelte ich schon als arbeitslos?", "مرحبًا — مشغِّلي لن يُصرِّحَ بي إلا الأسبوعَ القادم. هل أُعَدُّ عاطلاً الآن؟"),
    L("B", "Beraterin", "Nein — melden Sie sich erst, wenn das Arbeitsverhältnis endet. Dann ist der Tag maßgeblich.", "لا — صرِّحْ فقط حين ينتهي العقد. وحينها يُعتدُّ باليوم."),
    L("A", "Youssef", "Welche Papiere soll ich zum Termin mitbringen?", "ما الوثائقُ التي أحضرُها للميعاد؟"),
    L("B", "Beraterin", "Personalausweis, Kündigung, Arbeitsbescheinigung und Kontoauszug der letzten drei Monate.", "هوية، رسالةُ إنهاء، شهادةُ عمل، وكشوفُ حسابٍ لثلاثةِ أشهر."),
    L("A", "Youssef", "Meine Frau arbeitet Teilzeit — muss ihr Gehalt auch rein?", "زوجتي تعمل جزئيًّا — هل يدخلُ راتبُها أيضًا؟"),
    L("B", "Beraterin", "Ja, zur Bedarfsgemeinschaft — aber ein Teilzeitbonus bleibt anrechnungsfrei.", "نعم، كوحدةِ حاجة — لكن علاوةَ العملِ الجزئيِّ معفاةٌ من الاحتساب.")]},
  {"titel": "Einladung ohne Antwort (دعوةٌ بلا جواب)", "lines": [
    L("A", "Sonia", "Ich habe den Brief vom 3. verpasst — ich war im Krankenhaus.", "فاتَني خطابُ الثالثِ من الشهر — كنتُ في المستشفى."),
    L("B", "Sachbearbeiter", "Ohne Entschuldigung gilt das als Mitwirkungsverweigerung: eine Minderung.", "بلا عذرٍ يُعَدُّ امتناعًا عن التعاون: خفضٌ في المنحة."),
    L("A", "Sonia", "Hier ist die Klinikbestätigung samt Datum und Unterschrift.", "هذه شهادةُ المستشفى بالتاريخِ والتوقيع."),
    L("B", "Sachbearbeiter", "Danach hebe ich die Minderung auf — neuer Termin am Donnerstag.", "وعندها أرفعُ الخفض — ميعادٌ جديدٌ الخميس."),
    L("A", "Sonia", "Darf ich künftig Einladungen per E-Mail mit Lesebestätigung?", "أأستقبلُ الدعواتِ مستقبلًا بالبريدِ مع إشعارِ القراءة؟"),
    L("B", "Sachbearbeiter", "Ja — tragen Sie die Adresse im Portal ein; dort erscheinen auch die Bescheide.", "نعم — أدخلي العنوانَ في البوابة؛ حيث تظهرُ القراراتُ أيضًا.")]}],
 "formular": {"titel": "Antrag auf Arbeitslosengeld — أهمُّ الخاناتِ في نموذجِ الطلب", "zeilen": [
    "Angaben zur Person: Name, Anschrift, Steuernummer",
    "Letzter Arbeitgeber und Enddatum des Arbeitsvertrags",
    "Verfügbarkeit: Vermittlungsvorschläge, Mobilität ja/nein",
    "Bedarfsgemeinschaft: Partner, Kinder, Einkommen",
    "Anlagen: Arbeitsbescheinigung, Kündigung, Kontoauszüge",
    "Ort, Datum, eigenhändige Unterschrift"]},
 "rolle": {"sitter": "A: عاطلٌ Seeking-first-Job بعدَ تسريح", "partner": "B: مستشارةُ Agentur für Arbeit",
   "stichworte": ["Meldezeitpunkt klären", "Anlagen benennen", "Einkommen der Partnerin erklären"],
   "plan": ["اسألْ عن يومِ السَّريان لا عن الوعد", "اذكر كلَّ مرفقٍ باسمه الدقيق", "اطلبْ بدائلَ مكتوبةً للإشعارات"]}
},
{
 "id": "wohngeld", "emoji": "🏠", "nameDe": "Wohngeld — Mietzuschuss", "nameAr": "بدلُ السكنِ — إعانةُ الإيجار",
 "kontext": "دخلٌ لا يكفي والإيجارُ ثابت: Wohngeld يردُّ الفارق — إن عرفتَ كيف تُثبِتُ الدخلَ والسكنَ معًا.",
 "saetze": [
  S("Ich beantrage Wohngeld für eine Zweizimmerwohnung.", "أطلبُ بدلَ سكنٍ لشقةٍ من غرفتين."),
  S("Der Mietzuschuss beginnt mit dem Monat der Antragstellung.", "تبدأ الإعانةُ من شهرِ تقديمِ الطلب."),
  S("Die Kaltmiete gehört in die Anlage Miete, Nebenkosten nicht.", "الإيجارُ الجافُّ في ملحقِ الإيجار — والنفقاتُ الجانبية خارجَه."),
  S("Als Einkommen zählen Lohn, Kindergeld und Unterhalt.", "الدخلُ يشملُ الأجرَ وبدلَ الأطفالِ والنفقة."),
  S("Der Bescheid gilt zwölf Monate — danach ein Neuer mit frischen Nachweisen.", "القرارُ سارٍ اثني عشرَ شهرًا ثم يُجدَّدُ بإثباتاتٍ جديدةٍ."),
  S("Bei Widerspruch bitte den Bewilligungsbescheid im Original beilegen.", "وعندَ الاعتراضِ يُرفَقُ قرارُ المنحةِ بالأصل."),
 ],
 "dialoge": [
  {"titel": "Antrag mit Lücken (طلبٌ بنواقص)", "lines": [
    L("A", "Amel", "Mein Antrag wurde abgelehnt — die Einkommensnachweise fehlen.", "رُفِضَ طلبي — تنقصني إثباتاتُ الدخل."),
    L("B", "Amtsfrau", "Es genügen die letzten drei Gehaltsabrechnungen und der Kindergeldbescheid.", "تكفي كشوفُ الرواتبِ الثلاثةِ الأخيرة وقرارُ بدلِ الأطفال."),
    L("A", "Amel", "Mein Chef stellt eine Bescheinigung aus — reicht das?", "يُصدرُ مديري شهادة — أتكفي؟"),
    L("B", "Amtsfrau", "Nur mit Stempel und Bruttobetrag; eine Kopie der Abrechnung wirkt sicherer.", "بالختمِ والمبلغِ الإجماليّ فقط؛ ونسخةُ الكشفِ أوثق."),
    L("A", "Amel", "Und die Nebenkosten — muss ich sie angeben?", "والنفقاتُ الجانبية — أُصرِّحُ بها؟"),
    L("B", "Amtsfrau", "Nein, aber die kalte Miete und der Mietvertrag müssen vollständig sein.", "لا — لكنَّ الجافَّ والعقدَ يجبُ أن يكونا كاملين.")]},
  {"titel": "Nachzahlung nach Umzug (تسويةٌ بعد الانتقال)", "lines": [
    L("A", "Karim", "Ich bin im März umgezogen — zahlt das Amt die Zeit bis dahin?", "انتقلتُ في مارس — أيدفعُ المكتبُ عن المدةِ السابقة؟"),
    L("B", "Berater", "Neue Wohnung, neuer Antrag: Zuschuss ab Monat des Eingangs.", "شقةٌ جديدةٌ وطلبٌ جديد: الإعانةُ من شهرِ الوصول."),
    L("A", "Karim", "Warum sank mein Bescheid trotz gleicher Miete?", "ولماذا نقصَ قراري مع أنَّ الإيجارَ ثابت؟"),
    L("B", "Berater", "Das Kindergeld wurde auf die Bedarfsgemeinschaft angerechnet — Widerspruch ist möglich.", "احتُسِبَ بدلُ الأطفالِ على وحدةِ الحاجة — والاعتراضُ جائز."),
    L("A", "Karim", "Wie hoch bleibt der monatliche Zuschuss dann?", "فكم يبقى البدلُ الشهري؟"),
    L("B", "Berater", "Nach Korrektur sechzig Euro statt vierzig — die Nachzahlung folgt gesondert.", "بعد التصحيح ستون بدلَ أربعين، والتسويةُ اللاحقةُ مُنفصلة.")]}],
 "formular": {"titel": "Wohngeldantrag — ما يُملأُ في نموذجِ بدلِ السكن", "zeilen": [
    "Angaben zum Haushalt: Mitglieder, Geburtsdaten",
    "Wohnung: Anschrift, Mietart, Bezugsdatum",
    "Miete: Kaltmiete, Betriebskosten laut Anlage Miete",
    "Einkommen aller Mitglieder mit Anlage E",
    "Kinder: Schul-/Ausbildungsbescheinigung beifügen",
    "Versicherung: keine parallele Leistung (z.B. Bürgergeld)"]},
 "rolle": {"sitter": "A: موظفٌ جزئيٌّ إيجارُه يلتهمُ الراتب", "partner": "B: موظفةُ Wohngeldstelle",
   "stichworte": ["Einkommen lückenlos nennen", "falsche Anrechnung beanstanden", "Fristen für Nachforderung klären"],
   "plan": ["افتحْ بالوضعِ الماليِّ لا بالعاطفة", "سَمِّ كلَّ ملحقٍ برقمِه", "اختتمْ بموعدِ الصرفِ لا بالوعدِ الشفهي"]}
},
{
 "id": "kindergeld", "emoji": "👶", "nameDe": "Kindergeld & Familienkasse", "nameAr": "بدلُ الأطفالِ وصندوقُ الأسرة",
 "kontext": "أطفالٌ في تونس أو في ألمانيا والمبلغُ يُدفَعُ في الحالتين — لمن عرفَ الرقمَ الخاصَّ والأوراقَ المُصدَّقة.",
 "saetze": [
  S("Für meine Kinder in Tunesien beantrage ich Kindergeld.", "أطلبُ بدلَ الأطفالِ لأولادي في تونس."),
  S("Die Kindergeldnummer muss in jedem neuen Antrag stehen.", "رقمُ البدلِ لازمٌ في كلِّ طلبٍ جديد."),
  S("Die ausländische Geburtsurkunde braucht eine beglaubigte Übersetzung.", "شهادةُ الميلادِ الأجنبيةُ تحتاجُ ترجمةً مُصدَّقًا عليها."),
  S("Der Nachzahlungsbetrag wird rückwirkend bis sechs Monate gewährt.", "المبلغُ المؤجَّلُ يُصرَفُ بأثرٍ رجعيٍّ لستةِ أشهر."),
  S("Mein Kind macht eine Ausbildung — die Bescheinigung reicht der Kasse.", "ابني في تكوينٍ مهني — تكفي الشهادةُ الصندوقَ."),
  S("Bei Streit hilft der Einspruch innerhalb eines Monats.", "عندَ الخلافِ ينفعُ التظلُّمُ خلالَ شهرٍ واحد."),
 ],
 "dialoge": [
  {"titel": "Erstantrag mit Kindern im Ausland (طلبٌ أولُ وأطفالٌ في الوطن)", "lines": [
    L("A", "Leïla", "Ich arbeite seit Februar hier — meine Kinder blieben in Tunis.", "أعملُ هنا منذ فيفري — وأطفالي بقوا في تونس."),
    L("B", "Familienkasse", "Das Kindergeld steht EU-Ausländern und etlichen Verträgen zu — Antrag genügt.", "البدلُ مستحقٌّ لمواطني الاتحادِ وللاتفاقيات — ويكفي الطلب."),
    L("A", "Leïla", "Welche Papiere brauchen Sie von der Botschaft?", "ما وثائقُ السفارةِ لديكم؟"),
    L("B", "Familienkasse", "Geburtsurkunden, Schulbescheinigungen und die Meldebestätigung beider Eltern.", "شهاداتُ الميلاد، التلميذيات، وشهادةُ ربِّ الأسرةِ المعيشيةِ مُصدَّقةً من السفارة."),
    L("A", "Leïla", "Und die Übersetzung — reicht eine beglaubigte Kopie?", "والترجمة — تنسخةٌ مصدَّقة؟"),
    L("B", "Familienkasse", "Nur vereidigte Übersetzer — andernfalls geht der Antrag zurück.", "عندَ المترجمين المحلَّفين فقط — وإلا رُدَّ الطلب.")]},
  {"titel": "Ausbildungsende und Weiterzahlung (انتهاءُ التكوين)", "lines": [
    L("A", "Hedi", "Meine Tochter endet die Ausbildung im Juni — fällt das Geld sofort?", "ابنتي تُنهي التكوينَ في جوان — يسقُطُ المالُ فورًا؟"),
    L("B", "Sachbearbeiter", "Nein: bis zur Abschlussprüfung und dann bei Anmeldung zur Arbeitslosigkeit weiter.", "لا — إلى امتحانِ النهاية ثم بتسجيلِ البطالة يستمر."),
    L("A", "Hedi", "Sie will danach studieren — braucht ihr einen neuen Nachweis?", "ستدرسُ بعدها — أيلزمُكم إثباتٌ جديد؟"),
    L("B", "Sachbearbeiter", "Die Immatrikulationsbescheinigung genügt, digital hochladen.", "شهادةُ التسجيلِ تكفي — تُرفَعُ رقميًا."),
    L("A", "Hedi", "Und wenn ich die Frist versäume — Rückforderung?", "وإن فاتَني الميعاد — استرجاع؟"),
    L("B", "Sachbearbeiter", "Dann fordern wir zurück; die Korrektur binnen Monatsfrist heilt das Meiste.", "نستردُّ حينها؛ والتصحيحُ خلالَ شهرٍ يُرمِّمُ أكثرَه.")]}],
 "formular": {"titel": "Kindergeldantrag — خاناتُ الطلبِ الأساس", "zeilen": [
    "Kindergeldnummer (falls vorhanden)",
    "Kinder: Name, Geburtsdatum, Staatsangehörigkeit",
    "Wohnsitz der Kinder im Ausland mit Anschrift",
    "Schul- oder Ausbildungsbescheinigung anhängen",
    "Bankverbindung (IBAN) für Auszahlung",
    "Erklärung zu sonstigem Kindergeld im Ausland"]},
 "rolle": {"sitter": "A: أبٌ جديدٌ في العملِ وأطفالُه بالخارج", "partner": "B: موظفةُ Familienkasse",
   "stichworte": ["Kinder und Geburt nachweisen", "Übersetzungsregeln fragen", "Nachzahlung beantragen"],
   "plan": ["اذكر وضعَ كلِّ طفلٍ بسنِّه ودراسته", "سألْ عن الصيغةِ المقبولةِ للوثيقةِ الأجنبية", "اطلبْ تاريخَ بدءِ الصرفِ مكتوبًا"]}
},
{
 "id": "versicherung", "emoji": "🩺", "nameDe": "Krankenkasse: Familie & Beitrag", "nameAr": "صندوقُ المرض: الأسرةُ والاشتراك",
 "kontext": "زوجةٌ بلا عملٍ وأبناءٌ صِغار: التأمينُ العائليُّ المجانيُّ يحميهم — بحدِّ دخلٍ دقيقٍ وشروطِ إقامة.",
 "saetze": [
  S("Ich möchte meine Familie familienversichern lassen.", "أريدُ تأمينَ أسرتي التأمينَ العائليَّ المجانيّ."),
  S("Die Familienversicherung ist beitragsfrei bis zu einem Minijob-Gehalt.", "التأمينُ العائليُّ بلا اشتراكٍ حتى أجرِ العملِ الصغير."),
  S("Der Zusatzbeitrag ist je nach Kasse unterschiedlich hoch.", "الاشتراكُ الإضافيُّ يختلفُ من صندوقٍ إلى آخر."),
  S("Bei Heirat melde ich die Ehepartnerin innerhalb einer Woche.", "عندَ الزواجِ أُبلِّغُ عن زوجتي خلالَ أسبوع."),
  S("Der Beitrag wird vom Lohn einbehalten, der Arbeitgeber zahlt die Hälfte.", "يُقتطَعُ الاشتراكُ من الأجر، والمشغِّلُ يدفعُ النصف."),
  S("Die elektronische Gesundheitskarte kommt nach vier Wochen per Post.", "بطاقةُ الصحةِ الإلكترونية تصلُ بالبريدِ بعدَ أربعةِ أسابيع."),
 ],
 "dialoge": [
  {"titel": "Familienversicherung beantragen", "lines": [
    L("A", "Sami", "Meine Frau ist seit Mai hier und arbeitet nicht — kann sie mitversichert werden?", "زوجتي هنا منذ ماي ولا تعمل — أتُؤمَّنُ معي؟"),
    L("B", "Kassenfrau", "Ja — heiratsurkunde, Aufenthaltstitel und Einkommenserklärung.", "نعم — عقدُ زواج، إقامة، وإقرارُ دخل."),
    L("A", "Sami", "Sie lernt Deutsch mit Bürgergeld — ändert das etwas?", "تتعلَّمُ الألمانيةَ بعِوَضٍ — أيتغيِّرُ شيء؟"),
    L("B", "Kassenfrau", "Bei eigenem Anspruch ruht die Familienversicherung — prüfen wir die Reihenfolge.", "إن استحقَّتْ وحدها توقَّفَ العائلي — نفحصُ الأسبقية."),
    L("A", "Sami", "Und unsere Kinder brauchen eine eigene Geburtsurkunde?", "وأطفالي — شهاداتُ ميلادَ خاصة؟"),
    L("B", "Kassenfrau", "Ja, mit Übersetzung; Karten schicken wir allen nach vier Wochen.", "نعم بالترجمة؛ ونُرسِلُ البطاقاتِ جميعَها بعدَ أربعةِ أسابيع.")]},
  {"titel": "Beitrag und Zusatzbeitrag (اشتراكٌ وإضافيٌّ)", "lines": [
    L("A", "Nadia", "Warum stieg mein Beitrag um 0,9 Punkte?", "لماذا ارتفعَ اشتراكي نقطةً وتسعةَ أعشارِ النقطة؟"),
    L("B", "Sachbearbeiter", "Der Zusatzbeitrag der Kasse wurde erhöht — das Gesetz schreibt die Mitteilung vor.", "زادَ الاشتراكُ الإضافيُّ للصندوق — والقانونُ يُلزِمُ بالإخطار."),
    L("A", "Nadia", "Darf ich wechseln, ohne dass der Beitrag springt?", "أأنتقِلُ بلا قفزةِ اشتراك؟"),
    L("B", "Sachbearbeiter", "Ja — die neue Kasse kündigt fristlos zum Monatsende für Sie.", "نعم — الصندوقُ الجديدُ يُنهي عنك العقدَ بنهايةِ الشهر."),
    L("A", "Nadia", "Und während des Wechsels: Versicherungsschutz?", "وبينَ الصندوقَين: أأبقى مغطاة؟"),
    L("B", "Sachbearbeiter", "Lückenlos geschützt — die Meldung läuft automatisch über den Arbeitgeber.", "تغطيةٌ متصلة — والإبلاغُ آليٌّ عبرَ المشغِّل.")]}],
 "formular": {"titel": "Mitgliedsantrag — خاناتُ طلبِ العضوية", "zeilen": [
    "Mitglied: Name, Geburtsdatum, Anschrift, Steuer-ID",
    "Familienangehörige mit Verwandtschaftsgrad",
    "Einkommensgrenze bei Partner: Minijob ja/nein",
    "Erstmitgliedschaft oder Wechsel mit Kündigungsdatum",
    "Konto für Beitrag: IBAN des Arbeitgebers angeben",
    "Anlagen: Heiratsurkunde, Geburtsurkunden, Aufenthaltstitel"]},
 "rolle": {"sitter": "A: عاملٌ جديدٌ يريدُ إلحاقَ أسرته", "partner": "B: موظفةُ صندوقِ المرضى",
   "stichworte": ["Ehe und Kinder melden", "Einkommensgrenze nennen", "Zusatzbeitrag vergleichen"],
   "plan": ["ابدأ بعددِ الأفرادِ وأعمارِهم", "وضِّحْ دخلَ كلِّ بالغٍ وحدَّ الإعفاء", "اختمْ بموعدِ البطاقاتِ وتاريخِ سريانِ الحماية"]}
},
{
 "id": "studienfinanz", "emoji": "🎓", "nameDe": "BAföG & Rückmeldung", "nameAr": "دعمُ الدراسةِ وإعادةُ التسجيل",
 "kontext": "جامعَةٌ وراتبُ والدينٍ بالخارج: BAföG يُحتسَبُ بالدخلِ المُترجَم، والتسجيلُ الجامعيُّ له سقوفٌ لا ترحم.",
 "saetze": [
  S("Ich brauche das Formblatt über das ausländische Elterneinkommen.", "أحتاجُ الاستمارةَ عن دخلِ الوالدين الأجنبيّ."),
  S("Der Ausländervorbehalt prüft Aufenthalt und Fachrichtung.", "تفحصُ سلطةُ الأجانبِ الإقامةَ والتخصص."),
  S("Ohne Rückmeldung bis Fristende verliere ich den Studienplatz.", "بلا إعادةِ تسجيلٍ حتى نهايةِ الميعاد أفقدُ مقعدي."),
  S("Das Semesterticket gilt als Fahrausweis und Studienausweis zugleich.", "تذكرةُ الفصلِ بطاقةُ تنقُّلٍ وبطاقةُ دراسةٍ معًا."),
  S("Für das Urlaubssemester zahlt man nur den Verwaltungsbetrag.", "في فصلِ الراحةِ لا يُدفَعُ سوى الرسمِ الإداري."),
  S("Die Rückzahlung beginnt fünf Jahre nach dem Examen — zinsfrei.", "يبدأُ سدادُ الدعمِ بعدَ خمسِ سنواتٍ من الامتحان — بلا فائدة."),
 ],
 "dialoge": [
  {"titel": "BAföG mit Eltern im Ausland", "lines": [
    L("A", "Rania", "Meine Eltern verdienen in Tunesien — wie soll das Amt das prüfen?", "أهلي يدخلانِ من تونس — كيف يتحققُ المكتب؟"),
    L("B", "BAföG-Amt", "Formblatt ausländisches Einkommen, übersetzt, mit Stempel der Behörden.", "استمارةُ الدخلِ الأجنبيّ مترجمةً ومختمَةً من سلطاتكم."),
    L("A", "Rania", "Reicht die Steuerbescheinigung von dort?", "أتكفي الشهادةُ الضريبيةُ هناك؟"),
    L("B", "BAföG-Amt", "Ja, wenn es einen Steuerbescheid für ein Kalenderjahr gibt.", "نعم — إن شملت عامًا ميلاديًا كاملًا."),
    L("A", "Rania", "Und mein BAföG-Amt zahlt ab wann?", "فمن متى يدفعون؟"),
    L("B", "BAföG-Amt", "Ab dem Monat, in dem die Vorlesungen beginnen — der Antrag vor dem Ersten genügt.", "من شهرِ المحاضرات — إن وصلَ طلبُك مع أولِ يومِ دراسة.")]},
  {"titel": "Rückmeldung mit Engpass (إعادةُ تسجيلٍ في لحظةِ عسر)", "lines": [
    L("A", "Firas", "Mein Überweisungstermin ist Freitag, die Rückmeldefrist Montag.", "تحويلُ يومِ الجمعة، وميعادُ التسجيلِ الاثنين."),
    L("B", "Studierendensekretariat", "Der Zahlungsnachweis zählt erst am Konto der Uni, nicht am Beleg.", "يُعَدُّ الإيصالُ بتاريخِ وصولِه لا بتاريخِ ورقةِ الصرَّاف."),
    L("A", "Firas", "Kann die Frist gegen eine Gebühr verlängert werden?", "أتُمَدَّدُ برسوم؟"),
    L("B", "Studierendensekretariat", "Nur bei Urlaubssemester oder Elternzeit — sonst Exmatrikulation zum Fristende.", "لفصلِ راحةٍ أو والديةٍ فقط — وإلا فالشطبُ بنهايةِ الميعاد."),
    L("A", "Firas", "Dann bitte das Urlaubssemester mit Verwaltungsgebühr.", "إذن فصلُ راحةٍ مع الرسمِ الإداري."),
    L("B", "Studierendensekretariat", "Antrag bis morgen, dann bleibt Ihr Platz bis zum Winter gesichert.", "غدًا الطلب — ويبقى مقعدُك إلى الشتاءِ محفوظًا.")]}],
 "formular": {"titel": "BAföG-Antrag — أهمُّ حقولِ النموذج", "zeilen": [
    "Hochschule, Studienfach und Fachsemester",
    "Staatsangehörigkeit und Aufenthaltsstatus",
    "Elterneinkommen: ausländisches Formblatt beifügen",
    "Vermögen und eigene Einkünfte über 450 Euro angeben",
    "Kontodaten für monatliche Vorauszahlung",
    "Unterschrift beider Eltern, falls unter 30"]},
 "rolle": {"sitter": "A: طالبةٌ في السنةِ الثالثة ودخلُ والديها أجنبي", "partner": "B: مستشارُ BAföG",
   "stichworte": ["Ausländisches Einkommen belegen", "Fristen der Rückmeldung nennen", "Urlaubssemester erwägen"],
   "plan": ["اعرضْ سنتَك الدراسيةَ وتخصصَك أولًا", "ثبِّتِ الدخلَ بأوراقِه وبمترجمِه", "اختمْ بميعادِ أولِ دفعةٍ خطيًّا"]}
},
{
 "id": "steuerid", "emoji": "🧮", "nameDe": "Steuer-ID & Lohnsteuer", "nameAr": "الرقمُ الضريبيُّ وضريبةُ الأجر",
 "kontext": "مفاتيحُ النظام: Steuer-ID في كلِّ عقدٍ، وLohnsteuererklärung قد تردُّ ما دفعَه صاحبُ العملِ عنك في غيرِ محلِّه.",
 "saetze": [
  S("Ich brauche meine Steuer-Identifikationsnummer für den Arbeitsvertrag.", "أحتاجُ رقمي الضريبيَّ لعقدِ العمل."),
  S("Die ID kommt per Post — innerhalb von zwei Wochen nach der Anmeldung.", "يصلُ الرقمُ بالبريدِ خلالَ أسبوعَين من التسجيلِ السكني."),
  S("Ohne Steuer-ID behält der Arbeitgeber die Steuerklasse sechs ein.", "بلا رقمٍ يخصمُ المشغِّلُ بدرجةِ الضريبةِ السادسة."),
  S("Die Erklärung für 2024 muss bis Juli des Folgejahres raus.", "إقرارُ 2024 يجبُ أن يخرجَ إلى يولية من العامِ التالي."),
  S("Werbungskosten mindern — Fahrt, Werkzeug, Fachbücher.", "نفقاتُ المهنةِ تُنقِصُ الوعاء: تنقُّلٌ وعُدَّةٌ وكتب."),
  S("Die Steuerklasse wechselt nur zum Ersten des Folgemonats.", "ولا تتبدَّلُ درجةُ الضريبةِ إلا أولَ الشهرِ الموالي."),
 ],
 "dialoge": [
  {"titel": "ID verloren — was nun?", "lines": [
    L("A", "Tarek", "Mein Brief mit der Steuer-ID ist verschwunden — wer stellt ihn neu aus?", "اختفت رسالةُ رقمي الضريبي — مَن يُعيدُ إصدارَها؟"),
    L("B", "Finanzamt-Hotline", "Eine Mail mit Ausweisdaten genügt; die ID kommt digital im Portal.", "بريدٌ ببياناتِ الهوية يكفي؛ والرقمُ يصلُ رقميًا في البوابة."),
    L("A", "Tarek", "Wie lange dauert das — ich muss morgen unterschreiben?", "كم يستغرق — وغدًا أوقِّعُ عقدي؟"),
    L("B", "Hotline", "In der Regel zwei Werktage; im Notfall hilft die Bundesdruckerei-Hotline nicht.", "يومانِ عملِيَّان غالبًا؛ ولا تُجدي هنا مطبعةُ الأوراقِ الرسمية."),
    L("A", "Tarek", "Kann der Arbeitgeber die Klasse sechs sofort wechseln lassen?", "أيوافقُ المشغِّلُ فورًا على تغييرِ الدرجةِ السادسة؟"),
    L("B", "Hotline", "Er meldet elektronisch — wir stellen die neue Klasse bis Monatsende frei.", "يُبلِّغُ إلكترونيًا، ونحن نُطلِقُ الدرجةَ الجديدةَ حتى نهايةِ الشهر.")]},
  {"titel": "Erklärung mit Pendlerpauschale (إقرارٌ وبدلُ التنقُّل)", "lines": [
    L("A", "Salma", "Zwanzig Kilometer täglich zur Arbeit — was bringt die Anlage N?", "عشرونَ كلم يوميًّا إلى العمل — ماذا يُفيدُ الملحقُ N؟"),
    L("B", "Steuerhilfe", "Dreißig Cent pro Kilometer für die Hinwege, bei Behinderung auch das Werkzeug.", "ثلاثونَ سنتيمًا لكلِّ كيلومترٍ ذهابًا؛ وللمُعطَّلِ عُدَّتُه أيضًا."),
    L("A", "Salma", "Mein Chef zahlte Überstunden bar ohne Beleg — muss ich das eintragen?", "دفعَ مشغِّلي ساعاتٍ إضافيةً نقدًا — أأُدرِجُها؟"),
    L("B", "Steuerhilfe", "Ja, als steuerpflichtiger Arbeitslohn — sonst droht eine Nachzahlung mit Zinsen.", "نعم أجرًا خاضعًا وإلا جاءَ الاسترجاعُ بفائدةِ التأخير."),
    L("A", "Salma", "Und die Erstattung — auf welches Konto kommt sie?", "والاسترجاع — إلى أيِّ حساب؟"),
    L("B", "Steuerhilfe", "Zum in ELSTER hinterlegten — eine Änderung dauert nur bis zum nächsten Bescheid.", "إلى المسجَّلِ في ELSTER؛ وتعديلُه نافذٌ من القرارِ التالي.")]}],
 "formular": {"titel": "Mantelbogen der Steuererklärung — خاناتُ الصفحةِ الأولى", "zeilen": [
    "Steuernummer / Steuer-ID des Steuerpflichtigen",
    "Anschrift, Konto (IBAN) und Bankleitzahl",
    "Einkunftsarten ankreuzen: nichtselbständige Arbeit",
    "Anlagen: N, Vorsorgeaufwand, außergewöhnliche Belastung",
    "Summe der Steuerabzugsbeträge aus der Lohnsteuerbescheinigung",
    "Ort, Datum, Unterschrift (beider Ehegatten bei Zusammenveranlagung)"]},
 "rolle": {"sitter": "A: موظفٌ جديدٌ بلا رقمٍ ضريبيّ ويومُ عملِه طويل", "partner": "B: مستشارُ Finanzamt/Steuerhilfe",
   "stichworte": ["Steuer-ID und Klasse klären", "Werbungskosten listen", "Erstattungstermin vereinbaren"],
   "plan": ["ابدأ بالحالةِ الضريبيةِ الحالية", "اذكر مصاريفَكَ برقمِ المسافةِ والإيصال", "اختمْ بموعدِ القرارِ وطريقِ التعديل"]}
},
]
# الحرسُ الذاتيُّ كما في _d18/_d28:
for sc in SZ:
    assert not CJK.search(sc["nameDe"]) and not ARc.search(sc["nameDe"]), sc["id"]
    for dg in sc["dialoge"]:
        assert not CJK.search(dg["titel"]), (sc["id"], dg["titel"])
    for z in sc["formular"]["zeilen"]:
        assert not CJK.search(z) and not ARc.search(z), (sc["id"], z[:30])
    for st in sc["saetze"]:
        assert ARc.search(st["ar"]) and not CJK.search(st["ar"]) and not ARc.search(st["de"]) and not CJK.search(st["de"]), sc["id"]
    for dg in sc["dialoge"]:
        assert len(dg["lines"]) >= 6, (sc["id"], dg["titel"])
        for l in dg["lines"]:
            assert l["who"] in ("A", "B") and l["role"] and l["de"].strip()
            assert ARc.search(l["ar"]) and not CJK.search(l["ar"]) and not ARc.search(l["de"]) and not CJK.search(l["de"]), (sc["id"], l["de"][:30])
    assert len(sc["formular"]["zeilen"]) >= 5 and all(sc["formular"]["zeilen"])
    assert len(sc["rolle"]["stichworte"]) >= 3 and len(sc["rolle"]["plan"]) >= 3

old = json.load(open(f"{ROOT}/content/szenarien.json", encoding="utf8"))["szenarien"]
ids_old = {s["id"] for s in old}
assert not ids_old & {s["id"] for s in SZ}, "تصادمُ مصادير!"
json.dump({"szenarien": old + SZ}, open(f"{ROOT}/content/szenarien.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("szenarien ←", len(old) + len(SZ))
