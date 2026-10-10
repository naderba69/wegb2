#!/usr/bin/env python3
"""R139: add 10 more A2 reading texts to balance coverage."""
import json
from collections import OrderedDict

TEXTS = [
    OrderedDict([("id","t-a2-21"),("level","A2"),
        ("titleDe","Ein Termin beim Arzt"),("titleAr","موعد عند الطبيب"),
        ("de","Heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Ich bin um 9 Uhr in der Praxis. Zuerst muss ich am Empfang meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer. Nach 15 Minuten ruft mich die Arzthelferin. Der Arzt misst mein Fieber und hört meine Lunge ab. Er sagt, ich habe eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben."),
        ("ar","اليوم عندي موعد مع الدكتور مولر. أشعر بتوعّك منذ ثلاثة أيام: سعال وزكام ورأس يؤلمني. وصلت العيادة في التاسعة. في الاستقبال أظهرت بطاقة التأمين أولاً، ثم انتظرت في غرفة الانتظار. بعد 15 دقيقة نادتني الممرضة. قاس الطبيب حرارتي واستمع إلى رئتيّ. قال إنني مصابة بالإنفلونزا، كتب لي وصفة، ونصحني بشرب الكثير من الشاي والبقاء في السرير يومين."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wie lange ist sie schon krank?"),("promptAr","منذ متى وهي مريضة؟"),("options",["Seit gestern","Seit drei Tagen","Seit einer Woche","Seit zwei Wochen"]),("answer",1),("explanationAr","منذ ثلاثة أيام.")]),
            OrderedDict([("type","mc"),("promptDe","Was soll sie tun?"),("promptAr","ماذا عليها أن تفعل؟"),("options",["Sofort arbeiten gehen","Viel Tee trinken und im Bett bleiben","Nur Sport machen","Kaffee trinken"]),("answer",1),("explanationAr","أوصاها بشرب الكثير من الشاي والبقاء في السرير.")]),
        ])]),
    OrderedDict([("id","t-a2-22"),("level","A2"),
        ("titleDe","Eine E-Mail an die Lehrerin"),("titleAr","رسالة إلى المعلمة"),
        ("de","Liebe Frau Becker, ich kann heute leider nicht zum Unterricht kommen, weil meine Tochter krank ist. Sie hat Fieber und muss zu Hause bleiben. Kann ich bitte die Hausaufgaben von einer Mitschülerin bekommen? Ich möchte den Stoff nachholen. Entschuldigung für die kurze Nachricht und vielen Dank für Ihr Verständnis. Mit freundlichen Grüßen, Fatima"),
        ("ar","السيدة بيكر المحترمة، لا أستطيع حضور الدرس اليوم لأن ابنتي مريضة، لديها حرارة وعليها البقاء في البيت. هل يمكنني من فضلك أخذ الواجبات من زميلة؟ أريد تعويض الدرس. اعتذاري لهذه الرسالة القصيرة وشكراً على تفهّمكم. فاطمة."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Warum kommt Fatima nicht zum Unterricht?"),("promptAr","لماذا لن تأتي فاطمة؟"),("options",["Sie hat Fieber","Ihre Tochter ist krank","Sie hat keine Zeit","Der Unterricht fällt aus"]),("answer",1),("explanationAr","لأن ابنتها مريضة.")]),
        ])]),
    OrderedDict([("id","t-a2-23"),("level","A2"),
        ("titleDe","Wegbeschreibung zum Bahnhof"),("titleAr","وصف الطريق إلى المحطة"),
        ("de","Entschuldigung, wie komme ich am besten zum Hauptbahnhof? — Gehen Sie hier geradeaus bis zur Ampel. Dort biegen Sie links in die Goethestraße. Dann gehen Sie etwa 300 Meter. Sie sehen eine Bäckerei auf der rechten Seite. Überqueren Sie die Straße und gehen Sie durch die Unterführung. Der Bahnhof liegt direkt gegenüber. Sie brauchen zu Fuß ungefähr acht Minuten."),
        ("ar","عفواً، كيف أذهب إلى المحطة الرئيسية؟ — امشِ مستقيماً إلى الإشارة، ثم انعطف يساراً إلى شارع جوته، ثم امشِ حوالي 300 متر. سترى مخبزاً على اليمين. اعبر الشارع واذهب عبر النفق تحت الأرض. المحطة مقابله مباشرة. تستغرق حوالي ثماني دقائق مشياً."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wie lange dauert es zu Fuß?"),("promptAr","كم تستغرق مشياً؟"),("options",["5 Minuten","8 Minuten","15 Minuten","20 Minuten"]),("answer",1),("explanationAr","ثماني دقائق.")]),
        ])]),
    OrderedDict([("id","t-a2-24"),("level","A2"),
        ("titleDe","Mein Wochenende"),("titleAr","عطلة نهاية أسبوعي"),
        ("de","Am Samstag bin ich um 9 Uhr aufgestanden. Zuerst habe ich Kaffee getrunken und Zeitung gelesen. Dann habe ich die Wohnung geputzt und eingekauft. Nachmittags habe ich meine Freundin getroffen. Wir sind in ein Café gegangen und haben viel geredet. Abends habe ich mit meiner Familie zu Hause gegessen. Am Sonntag habe ich lange geschlafen, dann war ich im Park spazieren. Abends habe ich Deutsch gelernt, weil ich am Montag einen Test hatte. Insgesamt war es ein ruhiges, schönes Wochenende."),
        ("ar","يوم السبت استيقظت في التاسعة، شربت القهوة وقرأت الجريدة، ثم نظّفت الشقة واشتريت الأغراض. بعد الظهر التقيت صديقتي وذهبنا إلى مقهى وتحدثنا كثيراً. في المساء أكلت مع عائلتي في البيت. يوم الأحد نمت طويلاً ثم تنزّهت في الحديقة، وفي المساء درست الألمانية لأنه كان لدي امتحان الاثنين. بشكل عام كانت عطلة هادئة وجميلة."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wann hatte sie einen Test?"),("promptAr","متى كان لديها امتحان؟"),("options",["Am Samstag","Am Sonntag","Am Montag","Am Dienstag"]),("answer",2),("explanationAr","الاثنين.")]),
        ])]),
    OrderedDict([("id","t-a2-25"),("level","A2"),
        ("titleDe","Ein Gespräch im Supermarkt"),("titleAr","محادثة في السوبرماركت"),
        ("de","Guten Tag! Wo finde ich bitte die Milch? — Die Milch ist im Kühlregal ganz hinten links. — Danke. Und wo ist das Brot? — Das Brot ist am Eingang bei der Bäckereiabteilung. — Haben Sie heute keine Tomaten? — Doch, die Tomaten sind heute im Angebot, ein Kilo für 1,49 Euro. Sie liegen gleich bei dem Gemüse. — Vielen Dank! — Bitte schön."),
        ("ar","نهارك سعيد! أين أجد الحليب من فضلك؟ — الحليب في الثلاجة في الخلف يساراً. — شكراً. وأين الخبز؟ — الخبز عند المدخل بقسم المخبوزات. — أليس لديكم طماطم اليوم؟ — بلى، الطماطم في عرض اليوم كيلو بـ1.49 يورو، بقسم الخضروات. — شكراً جزيلاً! — عفواً."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Was kostet ein Kilo Tomaten?"),("promptAr","كم سعر كيلو الطماطم؟"),("options",["0,99 Euro","1,29 Euro","1,49 Euro","2,49 Euro"]),("answer",2),("explanationAr","1.49 يورو.")]),
        ])]),
    OrderedDict([("id","t-a2-26"),("level","A2"),
        ("titleDe","Eine Einladung zum Geburtstag"),("titleAr","دعوة لعيد ميلاد"),
        ("de","Hallo Ahmed, ich mache am Samstag um 19 Uhr eine Geburtstagsparty zu Hause. Ich wohne in der Schillerstraße 14, dritte Etage. Du kannst die U-Bahn-Linie 3 nehmen bis zur Haltestelle Markt. Von dort sind es fünf Minuten zu Fuß. Bitte sag mir bis Donnerstag Bescheid, ob du kommen kannst. Ich freue mich auf dich! Viele Grüße, Lena"),
        ("ar","مرحباً أحمد، سأقيم حفلة عيد ميلاد السبت الساعة 7 مساءً في بيتي في شارع شيلر رقم 14، الطابق الثالث. يمكنك استقلال المترو رقم 3 حتى محطة السوق، ومنها خمس دقائق مشياً. من فضلك أعلمني قبل الخميس إن كنت تستطيع الحضور. أتطلع لرؤيتك. لينا."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Bis wann soll Ahmed Bescheid sagen?"),("promptAr","متى يجب على أحمد أن يرد؟"),("options",["Bis Samstag","Bis Freitag","Bis Donnerstag","Bis Sonntag"]),("answer",2),("explanationAr","حتى الخميس.")]),
        ])]),
    OrderedDict([("id","t-a2-27"),("level","A2"),
        ("titleDe","Eine Wohnung suchen"),("titleAr","البحث عن شقة"),
        ("de","Ich suche seit zwei Monaten eine kleine Wohnung in der Stadt. Sie muss nicht groß sein, aber hell und ruhig. Ein Balkon wäre schön. Die Kaltmiete sollte nicht über 600 Euro liegen. Ich habe schon viele Anzeigen gelesen und mehrere Besichtigungen gemacht. Gestern habe ich eine schöne 2-Zimmer-Wohnung gesehen: Altbau, 50 Quadratmeter, mit Balkon und Einbauküche. Die Kaltmiete beträgt 580 Euro. Heute schreibe ich eine E-Mail an die Vermieterin. Ich hoffe, dass ich die Wohnung bekomme."),
        ("ar","أبحث منذ شهرين عن شقة صغيرة في المدينة. لا يجب أن تكون كبيرة، لكن فاتحة وهادئة. بلكونة ستكون لطيفة. الإيجار الأساسي لا يجب أن يتجاوز 600 يورو. قرأت الكثير من الإعلانات وزرت عدة شقق. أمس رأيت شقة جميلة بغرفتين: مبنى قديم، 50 متراً، ببلكونة ومطبخ مجهّز، الإيجار 580 يورو. اليوم أكتب رسالة للمؤجِّرة. آمل أن أحصل عليها."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wie hoch ist die Kaltmiete der neuen Wohnung?"),("promptAr","كم الإيجار الأساسي للشقة الجديدة؟"),("options",["500 Euro","580 Euro","600 Euro","650 Euro"]),("answer",1),("explanationAr","580 يورو.")]),
        ])]),
    OrderedDict([("id","t-a2-28"),("level","A2"),
        ("titleDe","Ein Anruf bei der Krankenversicherung"),("titleAr","مكالمة مع التأمين الصحي"),
        ("de","Guten Tag, AOK, mein Name ist Klein. — Guten Tag, hier spricht Nadia Saleh. Ich habe mich gestern angemeldet, aber ich habe meine Versicherungsnummer noch nicht bekommen. Wie lange dauert das? — In der Regel schicken wir die Nummer innerhalb von 10 Tagen per Post. — Muss ich währenddessen die Arztrechnung selbst bezahlen? — Nein, Sie können Ihre Anmeldebestätigung beim Arzt vorzeigen, dann übernimmt die AOK die Kosten. — Vielen Dank für die Information."),
        ("ar","نهارك سعيد، AOK، اسمي كلاين. — نهارك سعيد، معكم نادية صالح. سجّلتُ أمس لكنني لم أستلم رقم التأمين بعد. كم يستغرق؟ — عادةً نرسله خلال 10 أيام بالبريد. — هل يجب أن أدفع فاتورة الطبيب بنفسي في هذه الأثناء؟ — كلا، يمكنك إظهار إثبات التسجيل عند الطبيب، فتتكفّل AOK بالتكاليف. — شكراً على المعلومة."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wie lange dauert es bis zur Versicherungsnummer?"),("promptAr","كم يستغرق وصول رقم التأمين؟"),("options",["3 Tage","10 Tage","3 Wochen","Einen Monat"]),("answer",1),("explanationAr","خلال 10 أيام.")]),
        ])]),
    OrderedDict([("id","t-a2-29"),("level","A2"),
        ("titleDe","Ein neuer Deutschkurs"),("titleAr","دورة ألمانية جديدة"),
        ("de","Nächste Woche beginnt ein neuer Deutschkurs an der Volkshochschule. Der Kurs ist dreimal pro Woche: montags, mittwochs und freitags von 18 bis 20 Uhr. Es gibt 12 Teilnehmer aus verschiedenen Ländern. Der Lehrer heißt Herr Neumann. Er hat 15 Jahre Erfahrung. Ich freue mich auf den Kurs, weil ich für die Prüfung A2 üben möchte. Ich brauche das Zertifikat für meinen Job. Heute habe ich das Lehrbuch gekauft und mein Heft vorbereitet."),
        ("ar","الأسبوع القادم تبدأ دورة ألمانية جديدة في المركز الثقافي. الدورة ثلاث مرات أسبوعياً: الاثنين والأربعاء والجمعة من 6 إلى 8 مساءً. فيها 12 مشاركاً من بلدان مختلفة. المدرس هو السيد نويمان، لديه 15 سنة خبرة. متحمس للدورة لأني أريد التدرّب لامتحان A2، فالشهادة مطلوبة لعملي. اليوم اشتريت الكتاب وجهّزت دفتري."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","An welchen Tagen ist der Kurs?"),("promptAr","في أي أيام الدورة؟"),("options",["Mo/Di/Mi","Mo/Mi/Fr","Di/Do/Sa","Mi/Fr/So"]),("answer",1),("explanationAr","الاثنين والأربعاء والجمعة.")]),
        ])]),
    OrderedDict([("id","t-a2-30"),("level","A2"),
        ("titleDe","Mein Lieblingsgericht"),("titleAr","طبختي المفضلة"),
        ("de","Mein Lieblingsgericht ist Couscous mit Gemüse und Lamm. Das kocht meine Mutter jeden Freitag in Tunesien. Für das Gericht braucht man Couscous, Karotten, Zucchini, Kichererbsen, Tomaten, Zwiebeln, Knoblauch und Gewürze wie Kreuzkümmel und Paprika. Zuerst kocht man das Fleisch mit den Zwiebeln und den Gewürzen, dann gibt man das Gemüse dazu. Der Couscous wird darüber gedämpft. Am Schluss serviert man alles zusammen auf einem großen Teller. Es schmeckt besonders gut mit scharfer Harissa."),
        ("ar","طبختي المفضلة هي الكسكس بالخضار واللحم الضأن. تطبخه أمي كل يوم جمعة في تونس. نحتاج للطبخة كسكس وجزر وكوسا وحمص وطماطم وبصل وثوم وتوابل كالكمون والفلفل الأحمر. أولاً يُطبخ اللحم مع البصل والتوابل، ثم يُضاف الخضار. يُبخَّر الكسكس فوق المرق، وفي النهاية يُقدَّم الجميع في طبق كبير. طعمه ألذ مع الهريسة الحارة."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wann kocht die Mutter Couscous?"),("promptAr","متى تطبخ الأم الكسكس؟"),("options",["Jeden Samstag","Jeden Freitag","Jeden Sonntag","Nur im Ramadan"]),("answer",1),("explanationAr","كل يوم جمعة.")]),
        ])]),
]

texts = json.load(open('content/texts.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing = {t['id'] for t in texts}
added = 0
for t in TEXTS:
    if t['id'] not in existing:
        texts.append(t); added += 1
with open('content/texts.json','w',encoding='utf-8') as f:
    json.dump(texts,f,ensure_ascii=False,indent=2); f.write('\n')
from collections import Counter
print(f"Added {added} A2 texts. Total: {len(texts)}")
per_level = Counter(t['level'] for t in texts)
print("Per level:", dict(per_level))
