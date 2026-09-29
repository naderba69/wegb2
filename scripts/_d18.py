# -*- coding: utf-8 -*-
"""ξ7أ — حوارات B1 التونسية (d-b1-10..27): أسطرٌ أزواجٌ [de,ar] صريحة، حرسٌ كامل قبل القرص."""
import json, re, os

ROOT = "/home/user/weg-nach-b2"
CJK = re.compile(r"[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]")
ARc = re.compile(r"[\u0600-\u06ff]")

# (n, titleDe, titleAr, A, B, [(de,ar)…], [(prompt,o1,o2,o3,ai,explAr)…], [سطران من الحوار])
D18 = [
(10, "Anmeldung im Sprachkurs", "التسجيل في دورة الألمانية", "Frau Weber", "Yara",
 [("Guten Tag, ich möchte mich für den Deutschkurs anmelden.", "مساءُ الخير، أريدُ التسجيلَ في دورةِ الألمانية."),
  ("Sehr gern. Haben Sie den Einstufungstest schon gemacht?", "بكلِّ سرور. هل أجريتِ اختبارَ تحديدِ المستوى بعدُ؟"),
  ("Noch nicht — ist das Pflicht?", "لمّا — ألزَمٌّ ذلك؟"),
  ("Ja, sonst passt die Gruppe nicht. Der Test ist Donnerstag um neun.", "نعم، وإلا لم تُناسِبْك المجموعة. الاختبارُ الخميسَ التاسعةَ صباحاً."),
  ("Was kostet der Kurs pro Monat?", "كم تُكلِّفُ الدورةُ شهرياً؟"),
  ("Dreiundachtzig Euro — die Prüfung ist inklusive.", "ثلاثةٌ وثمانون يورو — والامتحانُ مشمولٌ بالسعر."),
  ("Brauche ich einen Nachweis über meinen Aufenthalt?", "هل أحتاجُ إثباتاً بإقامتي؟"),
  ("Nur Pass und Meldebescheinigung. Bis Donnerstag!", "جوازُ السفرِ وإثباتُ السكنِ فحسب. إلى الخميس!")]
 , [("Was ist vor der Anmeldung nötig?", "ein Einstufungstest", "ein Visum", "ein Arbeitsvertrag", 0, "اختبارُ تحديدِ المستوى أولاً ليُعرَفَ موقعُ المجموعة."),
    ("Wie viel zahlt Yara monatlich?", "38 Euro", "83 Euro", "93 Euro", 1, "ثلاثةٌ وثمانون، والامتحانُ داخلَه لا فوقَه."),
    ("Was muss Yara mitbringen?", "nur Geld", "Pass und Meldebescheinigung", "ein Notebook", 1, "وثيقتانِ لا ثالثَ لهما.")],
 ["Ja, sonst passt die Gruppe nicht. Der Test ist Donnerstag um neun.", "Nur Pass und Meldebescheinigung. Bis Donnerstag!"]),

(11, "Eine Wohnung besichtigen", "معاينةُ شقّة", "Frau Bähr", "Nadia",
 [("Danke für den Termin — die Anzeige klang vielversprechend.", "شكراً على الموعد — كانَ الإعلانُ واعداً في الصور."),
  ("Gern. Die Küche ist möbliert: Herd, Spüle und Schränke bleiben.", "بسرور. المطبخُ مؤثَّث: البوقُ والحوضُ والخزائنُ تبقى."),
  ("Sind Wasser und Heizung in der Miete enthalten?", "هل الماءُ والتدفئةُ داخلَ الإيجار؟"),
  ("Nein — Kaltmiete vierhundertfünfzig, Nebenkosten kommen dazu.", "لا — الإيجارُ الجافُّ أربعُمئةٌ وخمسون، والنفقاتُ الجانبية تُضاف."),
  ("Die Wohnung wäre perfekt — wann wird sie frei?", "الشقّةُ مثالية — متى تُصبِحُ فارغة؟"),
  ("Zum Ersten. Ich brauche Selbstauskunft und Schufa.", "أولَ الشهر. أحتاجُ تقريراً ذاتياً وسجلَ ائتمان."),
  ("Die Unterlagen kommen bis morgen per Mail — und die Kaution?", "الوثائقُ بالبريد إلى الغد — وكم التأمينُ؟"),
  ("Zwei Monatsmieten, wie immer. Herzlich willkommen, wenn alles passt.", "إيجارانِ كما جرتِ العادة. أهلاً وسهلاً إن استقامَ كلُّ شيء.")]
 , [("Was bleibt in der Küche?", "nur der Herd", "Herd, Spüle und Schränke", "nichts", 1, "التصميمُ مطبخٌ ثابتٌ يبقى مع الشقة."),
    ("Was kommt zur Kaltmiete hinzu?", "Nebenkosten", "Kaution", "Möbel", 0, "النفقاتُ الجانبية تُحسَبُ فوقَ الجاف."),
    ("Wie hoch ist die Kaution?", "eine Monatsmiete", "zwei Monatsmieten", "drei", 1, "إيجارُ شهرَينِ كضمانةٍ عند الاستلام.")]
 , ["Nein — Kaltmiete vierhundertfünfzig, Nebenkosten kommen dazu.", "Zwei Monatsmieten, wie immer. Herzlich willkommen, wenn alles passt."]),
(12, "Ein Termin beim Kinderarzt", "موعدُ طبيبِ الأطفال", "Dr. Sommer", "Karim",
 [("Mein Sohn hat seit gestern Fieber und einen Ausschlag.", "ابني منذ الأمسِ تُصيبُه حرارةٌ وطفحٌ جلديّ."),
  ("Seit wann genau, und hat er Ungewohntes gegessen?", "متى بدأ بالضبط، وهل أكلَ شيئاً غيرَ معتاد؟"),
  ("Seit gestern Abend — und nein, wir sind da sehr vorsichtig.", "منذ مساءِ الأمس — ولا، نحنُ في الطعامِ حذرون."),
  ("Mund auf, bitte … Das sieht nach einer Virusinfektion aus.", "افتح فمَك رجاءً … تشبه عدوى فيروسية، لا بكتيرية."),
  ("Ist das ansteckend für die Kita?", "أمُعدٍ هو في روضةِ الأطفال؟"),
  ("Ja — bis zwei Tage nach dem letzten Fieber darf er nicht hin.", "نعم — فحتى يومَين بعدَ آخرِ ذروةِ حرارةٍ لا يدخلُها."),
  ("Soll ich ein Antibiotikum geben?", "أأُعطيهِ مضادّاً حيوياً؟"),
  ("Nein, bei Viren wirkt es nicht. Fieber senken, viel trinken, beobachten.", "لا، لا فعلَ له مع الفيروسات: خافِضوا الحرارة، أكثِروا السوائل، وراقِبوا."),
  ("Wenn der Ausschlag bleibt — soll ich dann sofort wieder kommen?", "وإن بقيَ الطَّفَحُ — أفأعودُ إليك فورًا؟")]
 , [("Was hat der Junge?", "nur Husten", "Fieber und Ausschlag", "Ohrenschmerzen", 1, "حرارةٌ مع طفحٍ جلديّ — لا أذنَ ولا سعالَ مفرد."),
    ("Darf er in die Kita?", "sofort", "nein — erst nach zwei fieberfreien Tagen", "gar nicht", 1, "يومانِ بلا حُمّى قبلَ العودة."),
    ("Warum kein Antibiotikum?", "zu teuer", "es wirkt nicht gegen Viren", "zu klein für Pillen", 1, "المضادُّ الحيويُّ لا يقتلُ فيروساً — لا جدوى.")],
 ["Ja — bis zwei Tage nach dem letzten Fieber darf er nicht hin.", "Nein, bei Viren wirkt es nicht. Fieber senken, viel trinken, beobachten."]),

(13, "Den Handwerkertermin verschieben", "تأجيلُ موعدِ الصانع", "Frau Krause", "Sami",
 [("Mein Termin für die Heizung am Dienstag — ich muss ihn verschieben.", "موعدُ التدفئةِ الثلاثاء — عليَّ تأجيلُه."),
  ("Warum? Ich plane sonst den Tag umsonst.", "لماذا؟ أخطِّطُ يومي سدىً إن لم آت."),
  ("Mein Chef gab mir unerwartet einen dringenden Auftrag.", "فاجأني مديري بتكليفٍ عاجل."),
  ("Donnerstag wäre frei — oder Montag um neun.", "الخميسُ متاح، أو الاثنينَ التاسعة."),
  ("Montag, aber nicht vor neun: erst die Kinder in die Kita.", "الاثنينَ، لكن لا قبلَ التاسعة: الأطفالُ إلى الروضة أولاً."),
  ("Neun Uhr passt. Ich brauche Zugang zum Keller.", "التاسعةُ مناسبة. وأحتاجُ مفتاحَ القبو."),
  ("Den Schlüssel hält die Rezeption für Sie bereit.", "الاستقبالُ يُبقي المفتاحَ مُعَدّاً لك."),
  ("Danke für Ihre Flexibilität!", "شكراً لمرونتِك!")]
 , [("Warum braucht Sami den neuen Termin?", "Krankheit", "ein unerwarteter Auftrag", "ein Urlaub", 1, "تكليفٌ فاجأه من مديرِه."),
    ("Wann wird gearbeitet?", "Donnerstag", "Montag um neun", "Dienstag bleibt", 1, "اتُّفِقَ على الاثنينِ التاسعة."),
    ("Was braucht die Handwerkerin?", "Werkzeug", "den Kelleraufenthalt", "einen Parkplatz", 1, "دخولُ القبوِ شرطُ العمل، والمفتاحُ في الاستقبال.")],
 ["Neun Uhr passt. Ich brauche Zugang zum Keller.", "Montag, aber nicht vor neun: erst die Kinder in die Kita."]),

(14, "Im Büro krankmelden", "إبلاغُ المكتبِ بالمرض", "Chef Linke", "Rania",
 [("Ich melde mich für heute krank — starke Kopfschmerzen.", "أُعلِنُ مرضي اليوم — صداعٌ شديد."),
  ("Gute Besserung! Kann das Meeting um elf warten?", "ألفُ عافية! أنؤجَّلُ اجتماعُ الحاديةَ عشرة؟"),
  ("Tarek übernimmt; die Folien sende ich ihm vor zehn.", "سيتولّى طارق، والأوراقُ تصلُه قبلَ العاشرة."),
  ("Und die Steuerunterlagen für Montag?", "وما ملفاتُ الضرائبِ الاثنين؟"),
  ("Längst im gemeinsamen Ordner, seit gestern Abend.", "منذ مساءِ الأمس في المجلدِ المشترك."),
  ("Dann ruhen Sie aus — die Gesundheit geht vor der Frist.", "اراحي إذن — فالصحةُ تُقدَّمُ على الموعد."),
  ("Vielen Dank — ich melde mich, sobald ich wieder kann.", "شكراً — وسأُخطِرُك متى استطعت."),
  ("Kein Wort der Eile — erholen Sie sich gut!", "لا كلمةَ عَجَلٍ تُثقلُك — ارتَحْ جيّدًا!")]
 , [("Wer leitet das Meeting?", "der Chef selbst", "Tarek", "niemand", 1, "طارقُ ينوبُ بعدَ تسلُّمِ الشرائح."),
    ("Was geschah mit den Steuerunterlagen?", "sie fehlen", "sie liegen im gemeinsamen Ordner", "heute fertig", 1, "أُنجزَت البارحةَ ووضِعَت حيالَ الجميع."),
    ("Was gilt dem Chef heute?", "die Frist", "die Gesundheit zuerst", "beides gleich", 1, "العبارةُ الصريحةُ مقدِّمةٌ للعافية.")],
 ["Dann ruhen Sie aus — die Gesundheit geht vor der Frist.", "Längst im gemeinsamen Ordner, seit gestern Abend."]),

(15, "Karte verloren — die Bank", "بطاقةٌ ضائعة — المصرف", "Berater Vogel", "Imen",
 [("Ich habe meine EC-Karte verloren — bitte sofort sperren!", "أضعتُ بطاقتي المصرفية — أُعلِّقوها حالاً!"),
  ("Die Karte ist gesperrt. Wann und wo zuletzt benutzt?", "أُلغِيَت. متى وأين آخرُ استعمال؟"),
  ("Gestern Vormittag, Automat am Hauptbahnhof.", "أمسَ صباحاً، الصرّافُ قربَ المحطةِ المركزية."),
  ("Kein Missbrauch vermerkt. Die neue Karte kommt in vierzehn Tagen.", "لم يُسجَّلْ سوءُ استعمال — الجديدةُ بعدَ أربعةَ عشرَ يوماً."),
  ("Was kostet die Sperrung?", "كم يكلِّفُ التعليقُ؟"),
  ("Zwanzig Euro bei Diebstahl, sechs bei Verlust — verloren, richtig?", "عشرون عند السرقة، ستةٌ عند الفقدان — ضياعٌ عندك، صحيح؟"),
  ("Leider Verlust — gestohlen wurde sie nicht.", "ضياعٌ للأسف، لم تُسرَق."),
  ("Dann sechs Euro. Den Ausweis bitte zum Abholen mitbringen.", "ستةٌ إذن. ولا تنسَ هويّتك عند الاستلام.")]
 , [("Was passiert zuerst?", "neue Karte sofort", "Sperrung der Karte", "Kündigung des Kontos", 1, "الأولُ الحصارُ ضدَّ الاستعمالِ الضارّ."),
    ("Wie hoch ist die Gebühr hier?", "6 Euro", "20 Euro", "kostenlos", 0, "لأنه فقدانٌ لا سرقة — ستةُ يوروهاتٍ فقط."),
    ("Wann ist die Ersatzkarte da?", "in 14 Tagen", "morgen", "nie", 0, "أسبوعانِ مدةُ الإصدار.")],
 ["Zwanzig Euro bei Diebstahl, sechs bei Verlust — verloren, richtig?", "Kein Missbrauch vermerkt. Die neue Karte kommt in vierzehn Tagen."]),

(16, "Am Bahnschalter: Verspätung", "شباكُ القطار: تأخُّر", "Schaffnerin Weiß", "Amir",
 [("Mein Zug nach München hatte fünfzig Minuten Verspätung — Fahrgastrechte bitte.", "تأخَّرَ قطاري إلى ميونيخ خمسينَ دقيقة — أريدُ حقوقي كراكب."),
  ("Bei fünfzig Minuten stehen Ihnen fünfzehn Prozent des Preises zu.", "بخمسينَ لك خمسةَ عشرَ بالمئةِ من الثمن."),
  ("Bar oder aufs Konto?", "نقداً أم إلى الحساب؟"),
  ("Das Formular „Geld zurück“ online ausfüllen — die Erstattung geht aufs Konto.", "عبِّئْ نموذجَ «استردادِ المال» على الشبكة، والعِوَضُ ينزلُ حسابَك."),
  ("Muss ich die Fahrkarte beilegen?", "أأُرفِقُ التذكرة؟"),
  ("Eine Kopie genügt — bewahren Sie das Original auf.", "نسخةٌ تكفي، واحتفظْ بالأصل."),
  ("Der Anschlusszug fiel auch aus!", "وقد فاتني القطارُ الموالي لهذا السبب!"),
  ("Dann gilt der nächste Zug ohne Aufpreis — wir haben es vermerkt.", "يسري إذنِ التالي بلا زيادةٍ في الثمن — دوَّناه في النظام.")]
 , [("Wie viel Entschädigung gibt es?", "15 Prozent", "50 Prozent", "nichts", 0, "خمسةَ عشرَ بالمئة لتأخيرِ الخمسين."),
    ("Was braucht Amir?", "nur Geduld", "Formular plus Kopie", "eine Barzahlung", 1, "نموذجٌ ومعيه نسخةُ التذكرةِ لا أصلِها."),
    ("Was gilt für den Anschluss?", "nächster Zug ohne Aufpreis", "neue Kosten", "kein Anspruch", 0, "الموثَّقُ تأخيرُه يفتحُ البابَ التالي مجاناً.")],
 ["Dann gilt der nächste Zug ohne Aufpreis — wir haben es vermerkt.", "Bei fünfzig Minuten stehen Ihnen fünfzehn Prozent des Preises zu."]),

(17, "Elternabend in der Schule", "لقاءُ أولياءِ الأمور", "Lehrerin Kern", "Selim",
 [("Willkommen — wie steht es um unseren Lesetag?", "أهلاً بالجميع — أين نحنُ من يومِ القراءة؟"),
  ("Die Leseecke ist fertig; für die Bibliothek fehlt ein Sponsor.", "ركنُ القراءةِ اكتمل، وتنقصُ المكتبةَ جهةٌ راعية."),
  ("Eltern können auch beim Vorlesen helfen.", "وبعضُ الآباءِ يقرؤون مع الأطفالَ أسبوعياً."),
  ("Ich melde mich: einmal monatlich, samstags vor zehn.", "سأسجِّلُ اسمي: مرةً كلَّ شهرٍ السبتَ قبلَ العاشرة."),
  ("Die Abschlussfeier planen wir als Arbeitsgruppe am Freitag.", "وحفلُ الختامِ نجعلُه مجموعةَ عملٍ يومَ الجمعة."),
  ("Freitag passt erst nach siebzehn — mein Dienst beginnt früher.", "الجمعةُ لا تُلائمُني قبلَ الخامسة، فخدمتي تسبقُها."),
  ("Wer lädt unsere Partnerschule ein?", "من يوجِّهُ الدعوةَ لمدرستِنا الشريكة؟"),
  ("Die Einladung geht raus; sie meldet ihre Auftrittskinder an.", "الرسالةُ تُرسَل، وهم يُسجِّلون أطفالَ الأداءِ عندهم.")]
 , [("Was fehlt der Bibliothek?", "Bücher", "ein Sponsor", "Zeit", 1, "راعٍ واحد — لا رفوفٌ ولا كتب."),
    ("Wann hilft Selim?", "einmal monatlich", "täglich", "nie", 0, "سبتٌ واحدٌ في الشهرِ صباحاً."),
    ("Was plant die Gruppe?", "Zeugnisse", "die Abschlussfeier", "die Leseecke", 1, "الحفلُ النهائيُّ هو محورُ مجموعةِ الجمعة.")],
 ["Die Leseecke ist fertig; für die Bibliothek fehlt ein Sponsor.", "Die Einladung geht raus; sie meldet ihre Auftrittskinder an."]),

(18, "Lärm mit den Nachbarn klären", "فضُّ ضجيجِ الجيرة", "Frau Dittrich", "Oussama",
 [("Gestern nach Mitternacht war es laut — die Hausordnung kennt Ruhezeiten.", "أمسَ بعدَ منتصفِ الليل علتِ الأصوات، ونظامُ البنايةِ يعرفُ سكوناً."),
  ("Das war die Übertragung meines Bruders, laut verstärkt.", "كان بثَّ مباراةِ أخي عبرَ مكبِّرٍ صوتيّ."),
  ("Das bleibt einmalig — ich erwarte eine Entschuldigung, und Nachtruhe ab zweiundzwanzig.", "فلتبقَ مرّةً واحدة — أنتظرُ اعتذاراً، وسكونَ ليلٍ من العاشرة."),
  ("Entschuldigung — schön, dass Sie sprechen statt zu schelten. Die Übertragung bleibt künftig aus.", "عذراً — أحسنتَ بالكلامِ بدلَ الشكاة. لن تعودَ المباراةُ المنقولة."),
  ("Bei Gästen sage ich Bescheid — zwanzig Minuten vorher.", "وإن نزلَ ضيوف، فأُنذِرُك قبلَها بعشرينَ دقيقة."),
  ("Dringt bei uns Musik durch die Wand, klopfen Sie einmal — wir drehen sofort leiser.", "وإن تسرَّبَ منّا لحنٌ، فقَرِعَ مرّةً — نُخفِّضُه حالاً."),
  ("Abgemacht — Treppe und Ruhe teilen wir uns.", "عَهدٌ مُتفَق — الدرجَ والصمتَ نتقاسمهما.")]
 , [("Was war laut?", "der Wasserhahn", "die Fußballübertragung des Bruders", "die Waschmaschine", 1, "مباراةٌ منقولةٌ بمكبِّرٍ صوتيٍّ عند أخي الجار."),
    ("Wann beginnt die Nachtruhe?", "22 Uhr", "23 Uhr", "24 Uhr", 0, "العاشرةُ مساءً بنصِّ النظام."),
    ("Was verspricht Oussama künftig?", "Ankündigung vor Besuch", "nie Gäste", "Lautstärke frei", 0, "إخطارٌ مسبقٌ بعشرينَ دقيقةٍ قبلَ الضيافة.")],
 ["Das bleibt einmalig — ich erwarte eine Entschuldigung, und Nachtruhe ab zweiundzwanzig.", "Bei Gästen sage ich Bescheid — zwanzig Minuten vorher."]),

(19, "Termin bei der Ausländerbehörde verschieben", "تأجيلُ موعدِ مكتبِ الأجانب", "Amira", "Hedi",
 [("Mein Freitagtermin fällt mit meiner Prüfung zusammen — ein Monat später?", "موعدي الجمعةَ يتصادمُ مع امتحاني — أبعدَه شهراً؟"),
  ("Verschiebungen nur schriftlich; den Grund bitte nachweisen.", "التأجيلُ خطّيٌّ فقط، والهاتِ دليلَ العذر."),
  ("Hier ist die Prüfungsanmeldung der Universität.", "تفضَّلي إشعارَ امتحانِ الجامعةِ مطبوعاً."),
  ("Neuer Termin: Erster des Folgemonats, vierzehn Uhr dreißig — nur mit diesem Brief.", "الجديد: أولَ الشهرِ التالي، الثانيةَ عشرةَ والنصف — وبهذه الرسالةِ يدخلُ صاحبُها."),
  ("Die Unterlagen wieder in voller Zahl?", "أأُعيدُ كلَّ الوثائق؟"),
  ("Pass, Aufenthaltstitel, Mietvertrag, Versicherungsnachweis — wie beim ersten Mal.", "جوازٌ وإقامةٌ وعقدُ إيجارٍ وتأمين — كما في الزيارةِ الأولى."),
  ("Verstanden — dann bin ich sicher da; und was folgt bei zweitem Versäumnis?", "فهمتُ — سأحضرُ لا ريب؛ فماذا يترتَّبُ على التخلُّفِ الثاني؟"),
  ("Bei zweitem Versäumnis: Ablehnung, neue Gebühr.", "عندَ التخلُّفِ الثاني: رفضٌ ورسومٌ جديدة.")]
 , [("Wie ist eine Verschiebung möglich?", "mündlich", "schriftlich", "per Nachbar", 1, "بالطلبِ المكتوبِ لا بالقول."),
    ("Welche Unterlagen zum neuen Termin?", "alle erneut", "nur der Brief", "gar keine", 0, "الوثائقُ كلُّها تُعادُ كما في المرّةِ الأولى."),
    ("Was folgt auf zweites Fehlen?", "Warnung", "Ablehnung und neue Gebühr", "nichts", 1, "يُرفَضُ الطلبُ وتُدفَعُ الرسومُ مرّةً أخرى.")],
 ["Verschiebungen nur schriftlich; den Grund bitte nachweisen.", "Bei zweitem Versäumnis: Ablehnung, neue Gebühr."]),

(20, "Apotheke: Notdienst", "الصيدلية: خدمةُ الطوارئ", "Frau Seidl", "Firas",
 [("Ist heute Nacht Notdienst? Der Kinderarzt schickte mich.", "أنوبتُكم الليلة؟ طبيبُ الأطفالِ وجَّهني إليكم."),
  ("Ja — bis acht Uhr früh. Was benötigen Sie?", "نعم — حتى الثامنةِ فجراً. ما مطلوبُك؟"),
  ("Ein Fiebermittel für ein zehnjähriges Kind, rezeptfrei?", "خافِضُ حرارةٍ لعاشرةِ أعوامٍ — بلا وصفة؟"),
  ("Acht Euro fünfzig — die Beilage genau durchlesen, bitte.", "ثمانيةٌ ونصفٌ باليورو — واقرأ نشرةَ العبوةِ بدقة."),
  ("Und etwas gegen nächtlichen Husten?", "وشيءٌ للسعالِ الليليّ؟"),
  ("Nicht kombinieren bei Kindern: nur ein Mittel zur Zeit.", "لا نجمعُ للأطفال: دواءٌ واحدٌ كلَّ مرة."),
  ("Das Rezept fürs Kind kann ich morgen bringen?", "أَأُتمُّ وصفةَ الطفلِ غداً؟"),
  ("Rezepte gelten bundesweit — gute Besserung für die Kleine!", "وصفاتُ الأطباءِ نافذةٌ في البلادِ كلها — وفي الصغيرِ عافية.")]
 , [("Bis wann ist die Nachtapotheke auf?", "bis 8 Uhr früh", "bis Mitternacht", "bis 20 Uhr", 0, "حتى الثامنةِ فجراً يمتدُّ الدوامُ الليليّ."),
    ("Wie viele Mittel zugleich für Kinder?", "so viele wie nötig", "nur eines", "zwei nach Wahl", 1, "قاعدةُ الصيدلية: واحدٌ فقط في المرة."),
    ("Verordnung fürs Kind heute nötig?", "nein, morgen möglich", "ja, sonst nichts", "nie", 0, "بلا وصفةٍ الليلة، ويأتي التعويضُ غداً.")],
 ["Nicht kombinieren bei Kindern: nur ein Mittel zur Zeit.", "Acht Euro fünfzig — die Beilage genau durchlesen, bitte."]),

(21, "Studiovertrag kündigen", "فسخُ عقدِ الناديِ الرياضي", "Riadh", "Studioleiter",
 [("Ich kündige meinen Vertrag zum Monatsende.", "أُنهي عقدي مع نهايةِ هذا الشهر."),
  ("Die Frist beträgt sechs Wochen, schriftlich — siehe Vertrag.", "ستةُ أسابيع خطيّاً كما وردَ في العقد."),
  ("Ich telefonierte vor zwei Wochen; keine Bestätigung kam.", "اتصلتُ قبلَ أسبوعَين، ولم تصلني بطاقةُ تأكيد."),
  ("Telefon allein genügt nicht — schriftlich muss es vorliegen, dann zählt es.", "الهاتفُ وحدَه لا يُعتَدّ. أختمُ بريدَك بالاستلامِ ختماً."),
  ("Warum wurde schon abgebucht, obwohl ich kündigte?", "ولم خصمتم بعدُ وقد أعلمت؟"),
  ("Wir stoppen mit Fristablauf — zu viel Gezahltes wird erstattet.", "نوقفُ بانتهاءِ المدة، والمُدفَعُ فوقَها يُعادُ إليك."),
  ("Und meine Schlüsselkaution?", "وتأمينُ المفتاح؟"),
  ("Fünfzehn Euro zurück, binnen vierzehn Tagen nach Übergabe.", "خمسةَ عشرَ تُرَدُّ خلالَ أسبوعَين من التسليم.")]
 , [("Was verlangt der Vertrag bei Kündigung?", "Telefonat", "Schriftform", "persönlich", 1, "الخطّيُّ شرطٌ — والختمُ حسمَ الأمر."),
    ("Was geschieht mit Überzahlung?", "verfällt", "wird erstattet", "gespendet", 1, "يُرجَعُ الفائضُ لا يَبخَر."),
    ("Wie hoch ist die Schlüsselkaution?", "15 Euro", "50 Euro", "8 Euro", 0, "خمسةَ عشرَ يورو تُرَدُّ بميعادِ أسبوعَين.")],
 ["Wir stoppen mit Fristablauf — zu viel Gezahltes wird erstattet.", "Telefon allein genügt nicht — schriftlich muss es vorliegen, dann zählt es."]),

(22, "Beschwerde im Restaurant", "اعتراضٌ في المطعم", "Leila", "Ober",
 [("Auf der Rechnung steht Mineralwasser — wir haben nichts bestellt.", "في الفاتورةِ صنفُ ماءٍ معدنيٍّ لم نطلُبْه."),
  ("Ich prüfe das System … Sie haben recht — das ging an den Nebentisch.", "أُراجِعُ النظام… لكِ الحق، إنها الطاولةُ المجاورة."),
  ("Bitte korrigieren Sie den Betrag vor dem Bezahlen.", "أصلِحوا المجموعَ من فضلكم قبلَ الدفع."),
  ("Zwanzig Euro weniger: sechsundzwanzig statt achtunddreißig.", "عشرون تنقص: ستةٌ وعشرون لا ثمانيةٌ وثلاثون."),
  ("Außerdem kam die Hauptspeise kalt.", "وطبقُنا الرئيسيُّ وصلَ بارداً."),
  ("Das Dessert geht aufs Haus — Küche ist intern gemeldet.", "الحلوى من حسابِ الدار، والمطبخُ أُبلِغَ رسمياً."),
  ("Mit Fairness kommt man wieder — danke.", "بالإنصافِ نعودُ غداً — شكراً."),
  ("Bis zum nächsten Besuch, gute Nacht!", "وإلى اللقاء، وسهرةً طيبة!")]
 , [("Was wurde falsch berechnet?", "der Wein", "der Wasserposten", "das Brot", 1, "ماءُ الجيرانِ حُسِبَ على طاولتهم."),
    ("Wie wird die kalte Hauptspeise ausgeglichen?", "mit Dessert aufs Haus", "nichts", "mit Barerstattung", 0, "حلوى مجانيةٌ وتبليغٌ داخليّ."),
    ("Wie viel zahlt Leila zuletzt?", "38 Euro", "26 Euro", "20 Euro", 1, "ستةٌ وعشرون بعدَ التصحيح.")],
 ["Zwanzig Euro weniger: sechsundzwanzig statt achtunddreißig.", "Das Dessert geht aufs Haus — Küche ist intern gemeldet."]),

(23, "Studienberatung: Stundenplan", "الإرشادُ الجامعي: جدولُ المحاضرات", "Maha", "Beraterin",
 [("Ich muss den Stundenplan umbauen: Vorlesung gegen Praktikum.", "أُعيدُ صياغةَ جدولٍ ضاقَ عن موعدين."),
  ("Wann liegt das Praktikum?", "ما ساعاتُ تدريبِكِ العمليّ؟"),
  ("Täglich acht bis zwölf — Fabrik im Industriegebiet.", "يومياً من الثامنةِ إلى الثانيةَ عشرة، في مصنعِ المنطقةِ الصناعية."),
  ("Die Vorlesung gibt es als Aufzeichnung; wir buchen Kurs B.", "محاضرتُك تُنزَّلُ مسجَّلة — فنحوِّلُك إلى القسمِ باء."),
  ("Muss die Uni das Praktikum anerkennen?", "أالمنشأةُ معترفٌ بتدريبِها عندكم؟"),
  ("Ja: Bestätigung der Firma mit Zeiten, maximal dreißig Wochenstunden.", "نعم: رسالةُ اعتمادٍ بالمواعيد، وحدُّها ثلاثونَ ساعةً أسبوعياً."),
  ("Und wenn die Firma kein Schreiben ausstellt?", "وإن لم تُصدِرِ المنشأةُ كتاباً؟"),
  ("Eine E-Mail der Chefin — formlos, aber schriftlich — genügt.", "بريدُ المديرةِ بموضوعٍ وساعاتٍ يكفيه غيرُ مُختم.")]
 , [("Was kollidiert?", "Seminar und Prüfung", "Vorlesung und Praktikum", "zwei Kurse", 1, "صباحُ التدريبِ يضيقُ عن قاعةِ المحاضرة."),
    ("Obergrenze der Praxiszeit?", "20 Stunden", "30 Stunden", "40 Stunden", 1, "ثلاثونَ ساعةً سقفاً."),
    ("Was ersetzt das Firmenschreiben?", "nichts", "eine formlose E-Mail", "eine Absprache", 1, "بريدُ المديرةِ الرسميُّ بلا ختمٍ يُقبل.")],
 ["Ja: Bestätigung der Firma mit Zeiten, maximal dreißig Wochenstunden.", "Eine E-Mail der Chefin — formlos, aber schriftlich — genügt."]),

(24, "Fundstelle auf dem Revier", "مكتبُ المفقوداتِ في القسم", "Wassim", "Polizist",
 [("Gestern Abend verlor ich im Bus die Laptoptasche.", "أمسَ أضعتُ في الحافلةِ حقيبةً وفيها حاسوبي."),
  ("Linie und Haltestelle — genau, bitte.", "الرقمُ والمحطة — بدقّةٍ رجاءً."),
  ("Linie sechsundzwanzig, Endhaltestelle, Sitz hinten links.", "الخطُّ ستةٌ وعشرون، محطتُها الأخيرة، مقعدٌ خلفيٌّ أيسر."),
  ("Ein Fund, gemeldet um zwanzig zwanzig — Beschreibung passt.", "وِجادةٌ أُبلِغَ عنها العشرينُ والعشرون، فوافقَها وصفُك."),
  ("Wann kann ich abholen?", "متى أستلمُها؟"),
  ("Ab neun — Ausweis und Eigentumsnachweis: Rechnung oder Fotos.", "التاسعة: الهويّةُ وإثباتُ ملكية: فاتورةٌ أو صور."),
  ("Ich bringe Rechnung und Screenshots des Geräts.", "سأجيءُ بالفاتورةِ ولقطاتٍ من حاسوبي."),
  ("Vierzehn Tage Aufbewahrung, dann Versteigerungslager — kommen Sie pünktlich.", "أسبوعانِ في خزانتِنا ثم مزاد — فلتأتِ باكراً.")]
 , [("Verlust oder Diebstahl?", "Diebstahl", "Verlust", "Raub", 1, "ضياعٌ لا سرقة — لذلك لا محضرَ جنائيّ بل مكتبُ مفقودات."),
    ("Was braucht Wassim zum Abholen?", "nur Ausweis", "Ausweis und Nachweis", "ein Foto allein", 1, "هويّةٌ مع دليلِ ملكية."),
    ("Wie lange wird die Tasche aufbewahrt?", "7 Tage", "14 Tage", "30 Tage", 1, "أسبوعان فقط ثم الطريقُ للمخزن.")],
 ["Ein Fund, gemeldet um zwanzig zwanzig — Beschreibung passt.", "Vierzehn Tage Aufbewahrung, dann Versteigerungslager — kommen Sie pünktlich."]),

(25, "Ummeldung nach dem Umzug", "تحديثُ الإقامةِ بعدَ الانتقال", "Toufik", "Amtsfrau Berg",
 [("Ich bin vor zwei Wochen umgezogen — Ummeldung, bitte.", "قبلَ أسبوعَين انتقلتُ، فأريدُ تحديثَ إقامتي."),
  ("Genau zwei Wochen Frist — rechtzeitig. Formular, Ausweis, Vermieterbestätigung.", "الأسبوعان هما الميعاد تماماً — حانَ فيهما. النموذجُ والهويّةُ وشهادةُ المؤجِّر."),
  ("Was ist diese Bestätigung?", "وما هذه الشهادة؟"),
  ("Ein Blatt mit der Unterschrift des Vermieters über den Einzug.", "ورقةٌ يوقِّعُها المؤجِّرُ ويُثبِتُ فيها بدءَ سُكنانا."),
  ("Der Vermieter weilt in Tunesien; die Post braucht Tage.", "والمؤجِّرُ في تونس، والبريدُ يحتاجُ أياماً."),
  ("Ohne sie keine Anmeldung — ich gebe Ihnen vorläufig eine Bescheinigung.", "بلا شهادةٍ لا تسجيل — لكنْ خُذ مني الآنَ ورقةً مؤقَّتة."),
  ("Was kostet sie?", "وبكم هي؟"),
  ("Anmeldung gratis; die eID-Funktion kostet sechs Euro.", "التسجيلُ مجاناً، وستةٌ لخاصيةِ الهويّةِ الإلكترونية.")]
 , [("Wann muss umgemeldet werden?", "sofort", "innerhalb von zwei Wochen", "ein Monat", 1, "أسبوعانِ هما الميعادُ القانوني."),
    ("Wer unterschreibt die Bestätigung?", "der Mieter", "der Vermieter", "das Amt", 1, "صاحبُ البيتِ يُوقِّعُ على شهادةِ السكنِ بيده."),
    ("Was gibt es ohne sie?", "nichts", "eine vorläufige Bescheinigung", "eine Geldstrafe", 1, "الموظفةُ منحت مؤقَّتةً بلا غرامة.")],
 ["Genau zwei Wochen Frist — rechtzeitig. Formular, Ausweis, Vermieterbestätigung.", "Ohne sie keine Anmeldung — ich gebe Ihnen vorläufig eine Bescheinigung."]),

(26, "Stromanbieter wechseln", "تبديلُ مورِّدِ الكهرباء", "Fatma", "Hotline",
 [("Ich kündige zum Monatsersten und will Ihren Strom.", "أُنهي عقدي أولَ الشهرِ المقبل وأنتقلُ إليكم."),
  ("Die Altvertragsfrist sind vier Wochen — wir übernehmen alles.", "مدةُ عقدِك العتيقِ أربعةُ أسابيع، ونحن نتولّى كلَّ إجراء."),
  ("Wie melde ich den Zählerstand am Umschalttag?", "وكيف أُعلِنُ قراءةَ العدّادِ يومَ التبديل؟"),
  ("Foto per Onlineformular, spätestens zweiundzwanzig Uhr.", "صورةٌ بالنموذجِ الشبكيّ، أقصاها العاشرةُ ليلاً."),
  ("Wird die Versorgung unterbrochen?", "أنُقطَعُ عن الإمداد؟"),
  ("Nie — die Grundversorgung springt ohne eine Sekunde Pause ein.", "أبداً — فالمِلكيةُ العامةُ تسدُّ الفجوةَ بلا ثانيةٍ واحدة."),
  ("Was sagt die Bonusklausel?", "وما بندُ المكافأةِ في العقد؟"),
  ("Bonus nur bei zwölf Monaten Bindung; Preisgarantie braucht Preisbindung.", "مكافأتُنا لمن يلبثُ سنة — وضمانُ السعرِ مشروطٌ بثباتِه.")]
 , [("Wer kündigt den Altvertrag?", "die Kundin selbst", "der neue Anbieter", "das Amtsgericht", 1, "المورِّدُ الجديدُ يكفلُ إنهاءَ القديمِ كله."),
    ("Zählermeldung wie?", "fern", "Foto online", "per Brief", 1, "لقطةٌ على استمارةٍ إلكترونيةٍ قبلَ العاشرة."),
    ("Woran hängt die Preisgarantie?", "an Bindung", "am Wetter", "am Zählerstand", 0, "الالتزامُ سنةً يُثبِّتُ السعرَ عندها فقط.")],
 ["Nie — die Grundversorgung springt ohne eine Sekunde Pause ein.", "Bonus nur bei zwölf Monaten Bindung; Preisgarantie braucht Preisbindung."]),

(27, "Führerschein: Theorie und Übung", "رخصةُ السياقة: نظريٌّ وتطبيقي", "Sonda", "Fahrlehrer",
 [("Wann kann ich zur Theorieprüfung — vierzig Übungsstunden?", "متى يحينُ نظريُّ الامتحان؟ وقد أتمتُ أربعينَ ساعة."),
  ("Frühestens in zwei Wochen — Erste-Hilfe-Kurs vorher nötig.", "بعدَ أسبوعَين على الأقلّ — ومعه دورةُ الإسعافِ شرطٌ سابق."),
  ("Wie lange ist diese Bescheinigung gültig?", "وكم تعيشُ شهادةُ الإسعاف؟"),
  ("Einmal im Leben: sie läuft nie ab.", "مرةً واحدةً في العمر — لا انتهاءَ لها."),
  ("Welche Papiere verlangt der Prüfer?", "وما الوثائقُ عندَ المُمتحِن؟"),
  ("Ausweis, Sehtest, Erste-Hilfe, Ausbildungsprotokoll, Passfoto — Gebühr vor Ort.", "هويّة، نظارةُ قياس، إسعاف، سجلُّ التدريب، صورةٌ شمسية — والرسومُ في المكان."),
  ("Und nach zweimaligem Nichtbestehen?", "وإن رسبتُ مرتين؟"),
  ("Vierzehn Tage Sperre — die Gebühr bleibt gültig, keine Neuanmeldung.", "أسبوعان انتظاراً والرسومُ نافذة — لا إعادةَ تسجيل.")]
 , [("Was muss vor der Theorieprüfung vorliegen?", "nur Geld", "Erste-Hilfe-Bescheinigung", "ein zweiter Ausweis", 1, "دورةُ إسعافٍ ليومٍ واحدٍ تسبقُ الامتحانَ النظريّ."),
    ("Gültigkeit der Erste-Hilfe-Beilage?", "fünf Jahre", "nie ablaufend", "ein Jahr", 1, "شهادةٌ واحدةٌ مدى العمر."),
    ("Nach zweimaligem Scheitern?", "Neuantrag mit Gebühr", "vierzehn Tage Pause", "Sperre auf Lebenszeit", 1, "فقط أسبوعا انتظار، والرسومُ باقية.")],
 ["Einmal im Leben: sie läuft nie ab.", "Vierzehn Tage Sperre — die Gebühr bleibt gültig, keine Neuanmeldung."]),
]
# ── إصلاحُ ما لا يُغتَفَر ──
for i, row in enumerate(D18):
    if row[0] == 11:
        l = list(row[5]); l[-1] = (l[-1][0], l[-1][1])
        D18[i] = (row[0], row[1], row[2], row[3], row[4], l, row[6], [row[7][0], "Zwei Monatsmieten, wie immer. Herzlich willkommen, wenn alles passt."])
        break
# ── حرس ──
for (n, td, ta, A, B, lines, qs, dic) in D18:
    assert len(lines) >= 7, n
    for de, ar in lines:
        assert ARc.search(ar) and not CJK.search(ar) and de.strip() and not ARc.search(de), (n, de[:36])
    assert len(qs) == 3, n
    for (p, o1, o2, o3, ai, ex) in qs:
        opts = {o1, o2, o3}
        assert len(opts) == 3 and ai in (0, 1, 2) and ARc.search(ex), (n, p)
    all_de = [x[0] for x in lines]
    for d in dic:
        assert d in all_de, (n, d[:36])
        assert not ARc.search(d), d[:20]
print("بنيةُ B1 نظيفةٌ — 18 حواراً")
json.dump(D18, open("/tmp/d18.json", "w", encoding="utf8"), ensure_ascii=False)
