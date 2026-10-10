#!/usr/bin/env python3
"""R142b: إصلاح نصوص A2–B2 الأقصر من معيار المستوى مع أسئلتها وترجماتها."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "content" / "texts.json"

UPDATES: dict[str, tuple[str, str]] = {
    "t-a2-21": (
        "Mein Name ist Lina. Heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Ich bin um neun Uhr in der Praxis. Zuerst muss ich am Empfang meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer. Nach fünfzehn Minuten ruft mich die Arzthelferin. Der Arzt misst meine Temperatur und hört meine Lunge ab. Er sagt, ich habe eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben. Die Arzthelferin erklärt mir, in welcher Apotheke ich das Rezept abgeben kann. Dort hole ich später die Tabletten. Ich sage meinem Chef am Telefon, dass ich krank bin und heute nicht zur Arbeit komme. Danach fahre ich direkt nach Hause. Ich ruhe mich aus und trinke eine Tasse Tee. Wenn es mir morgen nicht besser geht, rufe ich die Praxis noch einmal an.",
        "اسمي لينا. لديّ اليوم موعد مع الدكتور مولر. أشعر بتوعّك منذ ثلاثة أيام. لديّ سعال وزكام ورأسي يؤلمني. أكون في العيادة عند التاسعة. يجب أولاً أن أُظهر بطاقة التأمين عند الاستقبال. ثم أنتظر في غرفة الانتظار. بعد خمس عشرة دقيقة تناديني المساعدة الطبية. يقيس الطبيب حرارتي ويستمع إلى رئتيّ. يقول إن لديّ إنفلونزا. يكتب لي وصفة وينصحني بشرب الكثير من الشاي والبقاء في السرير يومين. تشرح لي المساعدة الطبية في أي صيدلية أستطيع صرف الوصفة. أشتري الأقراص من هناك لاحقاً. أخبر مديري على الهاتف أنني مريضة ولن أذهب إلى العمل اليوم. ثم أعود مباشرة إلى البيت. أستريح وأشرب كوباً من الشاي. إذا لم أشعر بتحسن غداً، أتصل بالعيادة مرة أخرى.",
    ),
    "t-a2-22": (
        "Liebe Frau Becker,\n\nich kann heute leider nicht zum Unterricht kommen, weil meine Tochter krank ist. Sie hat Fieber und muss zu Hause bleiben. Der Kinderarzt hat gesagt, dass sie sich ausruhen soll. Deshalb bleibe ich heute bei ihr. Sie trinkt viel Wasser und ruht sich aus. Ich bleibe in ihrer Nähe und lese ihr eine Geschichte vor, wenn sie wach ist. Mein Mann ist auf Geschäftsreise und kann nicht helfen. Kann ich bitte die Hausaufgaben von einer Mitschülerin bekommen? Ich möchte den Stoff nachholen. Könnten Sie mir bitte auch mitteilen, welche Seiten wir heute im Buch lesen und welche Wörter ich lernen soll? Meine Mitschülerin Sara kann mir am Abend ein Foto von ihren Notizen schicken. Wenn es meiner Tochter morgen besser geht, komme ich wieder in den Kurs. Falls nicht, informiere ich Sie rechtzeitig. Ich erledige die Aufgaben zu Hause, damit ich nicht zu viel verpasse. Vielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nFatima",
        "السيدة بيكر المحترمة،\n\nللأسف لا أستطيع الحضور إلى الدرس اليوم لأن ابنتي مريضة. لديها حمى ويجب أن تبقى في البيت. قال طبيب الأطفال إنها تحتاج إلى الراحة. لذلك سأبقى معها اليوم. تشرب كثيراً من الماء وتستريح. أبقى بقربها وأقرأ لها قصة عندما تستيقظ. زوجي في رحلة عمل ولا يستطيع مساعدتي. هل يمكنني الحصول على الواجبات من إحدى زميلاتي؟ أريد أن أستدرك ما فاتني. هل يمكن أن تخبريني أيضاً أي صفحات سنقرأ في الكتاب اليوم وأي كلمات عليّ أن أتعلمها؟ تستطيع زميلتي سارة أن ترسل لي مساءً صورة من ملاحظاتها. إذا تحسنت ابنتي غداً، سأعود إلى الدورة. وإن لم تتحسن، سأخبرك في الوقت المناسب. سأنجز الواجبات في البيت كي لا يفوتني الكثير. شكراً جزيلاً لتفهّمك.\n\nمع خالص التحية،\nفاطمة",
    ),
    "t-a2-23": (
        "Entschuldigung, wie komme ich am besten zum Hauptbahnhof? — Gehen Sie hier geradeaus bis zur Ampel. Dort biegen Sie links in die Goethestraße. Dann gehen Sie etwa 300 Meter. Sie sehen eine Bäckerei auf der rechten Seite. Überqueren Sie die Straße und gehen Sie durch die Unterführung. Der Bahnhof liegt direkt gegenüber. Sie brauchen zu Fuß ungefähr acht Minuten. Der Weg ist einfach, wenn Sie auf die Straßenschilder achten. Die Ampel steht vor einem großen Geschäft. Nachdem Sie links abgebogen sind, bleiben Sie auf dem Gehweg und folgen der Goethestraße. Auf der rechten Seite sehen Sie zuerst ein kleines Hotel und später die Bäckerei. Gehen Sie bis zur nächsten großen Straße und überqueren Sie sie an der Ampel. Danach gehen Sie durch die Unterführung. Der Tunnel ist hell und es gibt dort Wegweiser zum Bahnhof. Am Ende der Unterführung sehen Sie den Haupteingang. Dort stehen ein Fahrkartenautomat und ein Stadtplan. Wenn Sie ein Gleis suchen, können Sie die Anzeige in der Bahnhofshalle lesen oder am Informationsschalter fragen.",
        "عفواً، ما أفضل طريق إلى محطة القطار الرئيسية؟ — سر مباشرة حتى الإشارة الضوئية. انعطف يساراً إلى شارع غوته. ثم سر نحو 300 متر. سترى مخبزاً على اليمين. اعبر الشارع وامشِ عبر النفق. تقع المحطة مقابله مباشرة. تحتاج إلى نحو ثماني دقائق سيراً. الطريق سهل إذا انتبهت إلى لافتات الشوارع. تقع الإشارة أمام متجر كبير. بعد أن تنعطف يساراً، ابقَ على الرصيف واتبع شارع غوته. سترى على اليمين فندقاً صغيراً أولاً ثم المخبز. تابع حتى الشارع الكبير التالي واعبره عند الإشارة. بعد ذلك سر عبر النفق. النفق مضاء جيداً، وتوجد فيه لافتات تدل على المحطة. سترى المدخل الرئيسي في نهاية النفق. توجد هناك آلة لشراء التذاكر وخريطة للمدينة. إذا كنت تبحث عن رصيف قطار معين، يمكنك قراءة الشاشة في صالة المحطة أو السؤال عند مكتب المعلومات.",
    ),
    "t-a2-24": (
        "Am Samstag bin ich um neun Uhr aufgestanden. Zuerst habe ich Kaffee getrunken und Zeitung gelesen. Dann habe ich die Wohnung geputzt und eingekauft. Das Wetter war angenehm, deshalb bin ich zu Fuß zum Supermarkt gegangen. Dort habe ich Brot, Obst und Milch gekauft. Nachmittags ist meine Freundin zu mir gekommen. Sie wohnt in derselben Straße. Um drei Uhr sind wir zusammen in ein Café gegangen und haben viel geredet. Zuerst haben wir einen Kaffee bestellt. Danach haben wir über die Arbeit und unsere Pläne für den Sommer gesprochen. Abends habe ich mit meiner Familie zu Hause gegessen. Am Sonntag habe ich lange geschlafen und war im Park spazieren. Dort habe ich Musik gehört und eine Runde um den See gemacht. Abends habe ich Deutsch gelernt, weil ich am Montag einen Test hatte. Vor dem Schlafengehen habe ich meine Tasche für den nächsten Tag vorbereitet. Insgesamt war es ein ruhiges und schönes Wochenende.",
        "استيقظت يوم السبت في التاسعة. شربت القهوة وقرأت الجريدة أولاً. ثم نظفت الشقة وتسوقت. كان الطقس لطيفاً، لذلك ذهبت إلى السوبرماركت سيراً على الأقدام. اشتريت هناك خبزاً وفاكهة وحليباً. جاءت صديقتي إلى بيتي بعد الظهر. تسكن في الشارع نفسه. ذهبنا معاً إلى مقهى عند الثالثة وتحدثنا كثيراً. طلبنا القهوة أولاً. ثم تحدثنا عن العمل وخططنا للصيف. تناولت العشاء في البيت مع عائلتي مساءً. نمت طويلاً يوم الأحد وتمشيت في الحديقة. استمعت هناك إلى الموسيقى ومشيت دورة حول البحيرة. درست الألمانية مساءً لأن لديّ اختباراً يوم الاثنين. جهزت حقيبتي لليوم التالي قبل النوم. كانت عطلة نهاية أسبوع هادئة وجميلة إجمالاً.",
    ),
    "t-a2-25": (
        "Guten Tag! Wo finde ich bitte die Milch? — Die Milch ist im Kühlregal ganz hinten links. — Danke. Und wo ist das Brot? — Das Brot ist am Eingang bei der Bäckereiabteilung. — Haben Sie heute keine Tomaten? — Doch, die Tomaten sind heute im Angebot, ein Kilo für 1,49 Euro. Sie liegen gleich beim Gemüse. — Vielen Dank! — Bitte schön. — Ich möchte heute einen Salat für meine Familie machen. Das Gemüse brauche ich für das Abendessen. Gibt es auch Gurken und Paprika? — Ja, beides liegt neben den Tomaten. — Dann nehme ich ein Kilo von den Tomaten. Sind sie frisch? — Ja, die Lieferung kam heute Morgen. Sie können die Tomaten einzeln auswählen. — Können Sie mir bitte auch sagen, wo der Käse ist? — Der Käse liegt im Kühlregal direkt neben der Milch. — Und wo kann ich bezahlen? — Die Kasse ist vorne rechts. Sie können bar oder mit Karte bezahlen. — Gut, dann gehe ich jetzt zur Kasse. Auf Wiedersehen! — Auf Wiedersehen!",
        "نهارك سعيد! أين أجد الحليب من فضلك؟ — الحليب في رفّ التبريد، في الخلف إلى اليسار. — شكراً. وأين الخبز؟ — الخبز عند المدخل قرب قسم المخبوزات. — ألا توجد لديكم طماطم اليوم؟ — بلى، الطماطم عليها عرض اليوم: الكيلو بـ1.49 يورو. تجدها بجانب الخضار. — شكراً جزيلاً! — على الرحب والسعة. — أريد اليوم إعداد سلطة لعائلتي. أحتاج إلى الخضار للعشاء. هل لديكم خيار وفلفل أيضاً؟ — نعم، كلاهما بجانب الطماطم. — سأشتري كيلوغراماً من الطماطم إذن. هل هي طازجة؟ — نعم، وصلت الشحنة هذا الصباح. يمكنك اختيار الطماطم واحدةً واحدة. — هل يمكنك أن تخبرني أيضاً أين الجبن؟ — الجبن في رفّ التبريد بجانب الحليب مباشرة. — وأين يمكنني الدفع؟ — الصندوق في الأمام إلى اليمين. يمكنك الدفع نقداً أو بالبطاقة. — حسناً، سأذهب إلى الصندوق الآن. إلى اللقاء! — إلى اللقاء!",
    ),
    "t-a2-26": (
        "Hallo Ahmed,\n\nich feiere am Samstag um 19 Uhr meinen Geburtstag bei mir zu Hause. Ich wohne in der Schillerstraße 14 im dritten Stock. Du kannst mit der U-Bahn-Linie 3 bis zur Haltestelle Markt fahren. Von dort sind es fünf Minuten zu Fuß. Meine Wohnung ist auf der rechten Seite im dritten Stock. Ich mache Pizza und einen Salat. Es gibt auch Kuchen und Saft. Wir möchten zusammen essen, Musik hören und Karten spielen. Bitte komm pünktlich, damit das Essen nicht kalt wird. Meine Schwester hilft mir bei der Vorbereitung. Ich stelle genug Stühle ins Wohnzimmer, damit alle bequem sitzen können. Du musst nichts mitbringen. Wenn du etwas nicht essen kannst, sag mir bitte vorher Bescheid. Bitte sag mir bis Donnerstag Bescheid, ob du kommen kannst. Ich freue mich, wenn wir uns wiedersehen. Wenn du den Weg nicht findest, ruf mich bitte an. Ich öffne die Haustür ab halb sieben.\n\nViele Grüße\nLena",
        "مرحباً أحمد،\n\nسأحتفل بعيد ميلادي يوم السبت في الساعة السابعة مساءً في بيتي. أسكن في شارع شيلر رقم 14، في الطابق الثالث. يمكنك ركوب خط المترو رقم 3 حتى محطة ماركت. ومن هناك تحتاج إلى خمس دقائق سيراً. شقتي على اليمين في الطابق الثالث. سأعدّ البيتزا والسلطة. وسيكون هناك أيضاً كعك وعصير. نريد أن نأكل معاً ونستمع إلى الموسيقى ونلعب الورق. أرجو أن تأتي في الموعد كي لا يبرد الطعام. تساعدني أختي في التحضير. سأضع كراسٍ كافية في غرفة المعيشة كي يجلس الجميع براحة. لا تحتاج إلى إحضار شيء. إذا كان هناك طعام لا تستطيع تناوله، فأخبرني من فضلك مسبقاً. أخبرني قبل يوم الخميس إن كنت تستطيع الحضور. سأكون سعيدة إذا التقينا من جديد. إذا لم تجد الطريق، فاتصل بي من فضلك. سأفتح باب المبنى من السادسة والنصف.\n\nأطيب التحيات،\nلينا",
    ),
    "t-a2-27": (
        "Ich suche seit zwei Monaten eine kleine Wohnung in der Stadt. Sie muss nicht groß sein, aber hell und ruhig. Ein Balkon wäre schön. Die Kaltmiete sollte nicht über 600 Euro liegen. Ich habe schon viele Anzeigen gelesen und mehrere Wohnungen besichtigt. Gestern habe ich eine schöne Zwei-Zimmer-Wohnung gesehen. Sie liegt in einem Altbau, hat 50 Quadratmeter, einen Balkon und eine Einbauküche. Die Kaltmiete beträgt 580 Euro. Bei der Besichtigung hat mir besonders das helle Wohnzimmer gefallen. Die Küche ist schon eingebaut, und im Bad gibt es ein Fenster. Vom Balkon sieht man auf einen ruhigen Innenhof. Die Vermieterin war freundlich und hat mir die Nebenkosten erklärt. Ich habe meine Unterlagen vorbereitet und ihr eine Nachricht geschickt. Sie möchte mir nächste Woche Bescheid geben. Bis dahin suche ich weiter, denn ich möchte sicher sein, dass die neue Wohnung wirklich passt. Wenn ich eine Zusage bekomme, kann ich im nächsten Monat umziehen.",
        "أبحث منذ شهرين عن شقة صغيرة في المدينة. لا يشترط أن تكون كبيرة، لكن أريدها مضيئة وهادئة. وستكون الشرفة جميلة. ينبغي ألا يتجاوز الإيجار الأساسي 600 يورو. قرأت كثيراً من الإعلانات وزرت عدة شقق. شاهدت أمس شقة جميلة من غرفتين. تقع في مبنى قديم، ومساحتها 50 متراً مربعاً، وفيها شرفة ومطبخ مجهز. يبلغ الإيجار الأساسي 580 يورو. أعجبتني غرفة المعيشة المضيئة خصوصاً أثناء المعاينة. المطبخ مركّب بالفعل، وفي الحمّام نافذة. أرى من الشرفة فناءً داخلياً هادئاً. كانت المالكة لطيفة وشرحت لي التكاليف الإضافية. جهزت أوراقي وأرسلت إليها رسالة. تريد أن تخبرني بقرارها الأسبوع القادم. سأواصل البحث إلى ذلك الحين، لأنني أريد التأكد من أن الشقة الجديدة مناسبة حقاً. إذا حصلت على موافقتها، يمكنني الانتقال في الشهر القادم.",
    ),
    "t-a2-28": (
        "Guten Tag, hier ist die AOK. Mein Name ist Klein. Wie kann ich Ihnen helfen? — Guten Tag, hier spricht Nadia Saleh. Ich habe mich gestern angemeldet, aber meine Versicherungsnummer noch nicht bekommen. Wie erhalte ich sie? — Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist. Das kann einige Tage dauern. — Kann ich in der Zwischenzeit trotzdem zum Arzt gehen? Muss ich die Rechnung selbst bezahlen? — Wenn Ihre Versicherung bereits aktiv ist, rechnet die Praxis normalerweise direkt mit uns ab. Sie können eine Mitgliedsbescheinigung bei uns anfordern und beim Arzt vorzeigen. — Bekomme ich die Versichertenkarte später auch? — Ja, die Karte kommt nach der Bearbeitung ebenfalls per Post. Bitte prüfen Sie, ob Ihre Adresse richtig ist. — Das mache ich. Ich schreibe die Informationen in mein Notizbuch, damit ich sie nicht vergesse. Vielen Dank für die Information. — Gern. Wenn Sie noch Fragen haben, können Sie uns wieder anrufen. — Auf Wiederhören!",
        "نهارك سعيد، معك خدمة AOK. اسمي كلاين. كيف أستطيع مساعدتك؟ — نهارك سعيد، معكم نادية صالح. سجلت أمس، لكنني لم أحصل على رقم التأمين بعد. كيف يصلني؟ — نرسل الرقم بالبريد بعد معالجة طلبك. وقد يستغرق ذلك بضعة أيام. — هل يمكنني الذهاب إلى الطبيب في هذه الأثناء؟ وهل يجب أن أدفع الفاتورة بنفسي؟ — إذا كان تأمينك سارياً بالفعل، فعادةً ما تتعامل العيادة معنا مباشرةً. يمكنك طلب شهادة عضوية منا وإبرازها للطبيب. — وهل سأحصل على بطاقة التأمين لاحقاً أيضاً؟ — نعم، نرسل البطاقة بالبريد بعد معالجة الطلب. من فضلك تحققي من صحة عنوانك. — سأفعل ذلك. أدوّن المعلومات في دفتري كي لا أنساها. شكراً على المعلومة. — على الرحب والسعة. يمكنك معاودة الاتصال بنا إن كانت لديك أسئلة أخرى. — إلى اللقاء عبر الهاتف!",
    ),
    "t-a2-29": (
        "Nächste Woche beginnt ein neuer Deutschkurs an der Volkshochschule. Der Kurs ist dreimal pro Woche: montags, mittwochs und freitags von 18 bis 20 Uhr. Viele von uns lernen nach der Arbeit, deshalb ist der Abendkurs praktisch. Am Ende der Woche wiederholen wir gemeinsam den Wortschatz. Der Lehrer heißt Herr Neumann. Er ist freundlich und erklärt die Grammatik mit einfachen Beispielen. Im Kurs sprechen wir viel miteinander. Wir üben kurze Gespräche, hören Dialoge und schreiben kleine Texte. In der Pause trinke ich Tee mit zwei anderen Teilnehmenden. Wir helfen einander bei den Hausaufgaben. Ich freue mich auf den Kurs, weil ich für die A2-Prüfung üben möchte. Das Zertifikat brauche ich für meinen Job. Heute habe ich das Lehrbuch gekauft und mein Heft vorbereitet. Ich möchte vor dem ersten Unterricht noch einmal die wichtigsten Wörter wiederholen. So kann ich besser mitarbeiten und den Lehrer verstehen. Nach dem Kurs fahre ich mit dem Bus nach Hause.",
        "تبدأ دورة جديدة للألمانية الأسبوع القادم في مركز تعليم الكبار. تُعقد الدورة ثلاث مرات في الأسبوع: أيام الاثنين والأربعاء والجمعة من السادسة إلى الثامنة مساءً. يتعلم كثير منا بعد العمل، لذلك تناسبنا الدورة المسائية. نراجع المفردات معاً في نهاية الأسبوع. اسم المدرس السيد نويمان. إنه ودود ويشرح القواعد بأمثلة بسيطة. نتحدث كثيراً معاً في الدورة. نتدرب على حوارات قصيرة ونستمع إلى حوارات ونكتب نصوصاً صغيرة. أشرب الشاي في الاستراحة مع مشاركين اثنين آخرين. نساعد بعضنا في الواجبات. أنا متحمس للدورة لأنني أريد الاستعداد لامتحان A2. أحتاج إلى الشهادة من أجل عملي. اشتريت كتاب الدورة وجهزت دفتري اليوم. أريد أن أراجع أهم الكلمات مرة أخرى قبل الدرس الأول. هكذا أستطيع المشاركة بصورة أفضل وفهم المدرس. أعود إلى البيت بالحافلة بعد الدورة.",
    ),
    "t-a2-30": (
        "Mein Lieblingsgericht ist Couscous mit Gemüse und Lamm. Das kocht meine Mutter jeden Freitag in Tunesien. Für das Gericht braucht man Couscous, Karotten, Zucchini, Kichererbsen, Tomaten, Zwiebeln, Knoblauch und Gewürze wie Kreuzkümmel und Paprika. Meine Mutter würzt das Gericht nach Geschmack. Sie bereitet zuerst das Gemüse vor. Sie schält die Karotten und schneidet die Zucchini in Stücke. Die Zwiebeln werden klein geschnitten und mit etwas Öl angebraten. Danach kommen das Lamm, Wasser und die Gewürze in den Topf. Alles kocht langsam, bis das Fleisch weich ist. Der Couscous wird in einem Siebeinsatz über dem Dampf gegart. Die Kichererbsen kochen mit, bis sie weich sind. Am Schluss legt man den Couscous auf einen großen Teller und gibt Fleisch und Gemüse darüber. Es schmeckt besonders gut mit scharfer Harissa. Die Soße steht extra auf dem Tisch, damit jeder selbst entscheiden kann, wie scharf sein Essen sein soll. Am Freitag isst die ganze Familie gemeinsam.",
        "طبختي المفضلة هي الكسكس بالخضار ولحم الضأن. تطبخه أمي كل يوم جمعة في تونس. نحتاج إلى الكسكس والجزر والكوسا والحمص والطماطم والبصل والثوم وتوابل مثل الكمون والفلفل الأحمر. تضيف أمي التوابل حسب الذوق. تحضّر الخضار أولاً. تقشّر الجزر وتقطّع الكوسا إلى قطع. يُفرم البصل ناعماً ويُحمّر بقليل من الزيت. ثم يُضاف لحم الضأن والماء والتوابل إلى القدر. يُطهى كل شيء على نار هادئة حتى يطرى اللحم. يُطهى الكسكس على البخار في مصفاة فوق القدر. ويُطهى الحمص معه حتى يطرى. في النهاية تضع أمي الكسكس في طبق كبير وتضع اللحم والخضار فوقه. يكون طعمه لذيذاً جداً مع الهريسة الحارة. توضع الصلصة جانباً كي يختار كل شخص درجة حرارة طعامه. تتناول العائلة كلها الطعام معاً يوم الجمعة.",
    ),
    "t-a2-031": (
        "Letzten Monat ist Sara von München nach Leipzig gezogen. Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch, deshalb suchte sie eine Wohnung im Osten. In Leipzig fand sie eine schöne Altbauwohnung mit drei Zimmern und Balkon für 650 Euro warm. Am Anfang vermisste sie ihre Freunde in München, aber sie lernte schnell neue Kollegen kennen. Jetzt gefällt ihr Leipzig gut: Die Stadt ist grün, die Menschen sind freundlich und die Mieten sind bezahlbar. Ihre neue Wohnung liegt in einem ruhigen Viertel. Vom Balkon sieht sie einen kleinen Park. Am ersten Tag hat sie die Kartons ausgepackt und die Küche eingerichtet. Eine Nachbarin hat ihr geholfen, die Möbel ins Haus zu tragen. Bei der Arbeit hat Sara neue Aufgaben bekommen. Sie vermisst ihre Familie noch, telefoniert aber am Wochenende oft mit ihrer Schwester. Am Samstag erkundet sie die Stadt mit dem Fahrrad und probiert neue Cafés aus.",
        "انتقلت سارة الشهر الماضي من ميونخ إلى لايبزيغ. كانت قد وجدت وظيفة جديدة كمصممة جرافيك. كان الإيجار في ميونخ مرتفعاً جداً، لذلك بحثت عن شقة في الشرق. وجدت في لايبزيغ شقة جميلة في مبنى قديم، فيها ثلاث غرف وشرفة، بإيجار شامل قدره 650 يورو. افتقدت أصدقاءها في ميونخ في البداية، لكنها تعرفت سريعاً على زملاء جدد. والآن تعجبها لايبزيغ: المدينة خضراء والناس لطفاء والإيجارات معقولة. تقع شقتها الجديدة في حي هادئ. وترى من الشرفة حديقة صغيرة. أخرجت الصناديق ورتبت المطبخ في اليوم الأول. ساعدتها جارة في نقل الأثاث إلى المبنى. حصلت سارة في العمل على مهام جديدة. ما زالت تفتقد عائلتها، لكنها تتصل بأختها كثيراً في نهاية الأسبوع. تستكشف المدينة يوم السبت بالدراجة وتجرب مقاهي جديدة.",
    ),
    "t-a2-032": (
        "Lukas hat seinen Tagesablauf in den letzten Monaten stark verändert. Früher stand er spät auf, trank drei Tassen Kaffee zum Frühstück und aß mittags oft Fast Food. Abends saß er stundenlang vor dem Fernseher. Jetzt steht er um sieben Uhr auf, macht zwanzig Minuten Yoga und frühstückt Müsli mit Obst. Mittags kocht er selbst Gemüse mit Reis. Er geht dreimal pro Woche laufen und schläft vor Mitternacht. Seitdem fühlt er sich viel fitter und ist bei der Arbeit konzentrierter. Er sagt, die größte Schwierigkeit war, abends keine Schokolade zu essen. Am Anfang fiel es ihm schwer, früher ins Bett zu gehen. Deshalb legt er sein Handy abends in einen anderen Raum und liest vor dem Schlafen ein Buch. Er plant seine Mahlzeiten für die Woche und kauft am Samstag frisches Gemüse. Seine Kollegen haben die Veränderung bemerkt. In der Mittagspause gehen sie manchmal gemeinsam spazieren. Lukas sagt, dass kleine Schritte besser zu seinem Alltag passen als ein strenger Plan. Er möchte die neue Routine auch im Winter beibehalten.",
        "غيّر لوكاس روتينه اليومي كثيراً خلال الأشهر الماضية. كان يستيقظ متأخراً، ويشرب ثلاثة أكواب من القهوة على الفطور، ويتناول غالباً الوجبات السريعة على الغداء. وكان يجلس ساعات أمام التلفاز في المساء. أما الآن فيستيقظ في السابعة، ويمارس اليوغا عشرين دقيقة، ويفطر موسلي مع الفاكهة. يطبخ الخضار مع الأرز على الغداء بنفسه. يركض ثلاث مرات في الأسبوع وينام قبل منتصف الليل. ومنذ ذلك الحين يشعر بنشاط أكبر ويكون أكثر تركيزاً في العمل. يقول إن أصعب شيء كان الامتناع عن أكل الشوكولاتة مساءً. في البداية كان من الصعب عليه أن ينام أبكر. لذلك يضع هاتفه في غرفة أخرى مساءً ويقرأ كتاباً قبل النوم. يخطط لوجبات الأسبوع ويشتري الخضار الطازجة يوم السبت. لاحظ زملاؤه هذا التغيير. ويتمشون معاً أحياناً في استراحة الغداء. يقول لوكاس إن الخطوات الصغيرة تناسب حياته اليومية أكثر من خطة صارمة. ويريد المحافظة على روتينه الجديد في الشتاء أيضاً.",
    ),
    "t-b1-31": (
        "Vor drei Monaten bin ich von Hamburg nach Leipzig gezogen. Der Grund war ein neues Jobangebot als Softwareentwicklerin. Am Anfang fiel es mir schwer, weil ich meine Freunde und meine Familie vermisste. Außerdem kannte ich die Stadt überhaupt nicht. Ich nahm mir vor, jede Woche einen neuen Ort zu besuchen: ein Café, einen Park oder ein Museum. Inzwischen habe ich zwei Kolleginnen kennengelernt, mit denen ich mich gut verstehe. Wir gehen manchmal zusammen essen oder ins Kino. Was ich an Leipzig besonders mag, sind die vielen Grünflächen und die günstigen Mieten im Vergleich zu Hamburg. Natürlich gibt es auch Dinge, die ich vermisse, zum Beispiel die Hafenatmosphäre und das Meer. Aber ich bereue den Umzug nicht — er hat mir geholfen, selbstständiger zu werden und neue Perspektiven zu gewinnen. Auch bei der Arbeit fühle ich mich inzwischen sicherer. Mein Team hilft mir, wenn ich Fragen habe, und ich lerne jeden Tag etwas Neues. Am Wochenende gehe ich mit meinen Kolleginnen in einen Park oder koche ein Gericht aus Hamburg. So entdecke ich die neue Stadt, ohne meine alte Heimat zu vergessen.",
        "قبل ثلاثة أشهر انتقلت من هامبورغ إلى لايبزيغ. كان السبب عرض عمل جديداً كمطوّرة برمجيات. في البداية كان الأمر صعباً لأنني افتقدت أصدقائي وعائلتي. كما أنني لم أكن أعرف المدينة إطلاقاً. قررت أن أزور مكاناً جديداً كل أسبوع: مقهى أو حديقة أو متحفاً. وفي هذه الأثناء تعرّفت على زميلتين أتفاهم معهما جيداً. نذهب أحياناً إلى مطعم أو إلى السينما معاً. أكثر ما يعجبني في لايبزيغ هو المساحات الخضراء الكثيرة والإيجارات الأقل مقارنة بهامبورغ. وبالطبع هناك أشياء أفتقدها، مثل أجواء الميناء والبحر. لكنني لا أندم على الانتقال؛ فقد ساعدني على أن أصبح أكثر استقلالاً وأن أوسّع آفاقي. أشعر الآن بثقة أكبر في عملي أيضاً. يساعدني فريقي عندما تكون لديّ أسئلة، وأتعلم شيئاً جديداً كل يوم. أذهب في نهاية الأسبوع مع زميلاتي إلى حديقة أو أطبخ طبقاً من هامبورغ. هكذا أكتشف المدينة الجديدة من دون أن أنسى موطني القديم.",
    ),
    "t-b1-32": (
        "Seit einem Jahr esse ich kein Fleisch mehr. Anfangs war es schwierig, weil meine Familie traditionell viel Fleisch kocht und ich in Restaurants oft nur wenige Optionen hatte. Inzwischen habe ich viele neue Rezepte ausprobiert, vor allem aus der orientalischen und indischen Küche, in der es viele vegetarische Gerichte gibt. Was mich überrascht hat: Ich fühle mich nicht schwächer, im Gegenteil — ich habe mehr Energie und mein Cholesterinwert ist gesunken. Natürlich muss ich darauf achten, genügend Eisen und Eiweiß zu essen, zum Beispiel durch Hülsenfrüchte, Nüsse und Spinat. Meine Freunde reagieren unterschiedlich: Einige finden es gut, andere machen Witze darüber. Ich versuche, niemanden zu missionieren, sondern einfach mit gutem Beispiel voranzugehen. Inzwischen bereite ich mein Mittagessen oft am Abend vorher zu. So muss ich in der Pause nicht lange nach einem passenden Gericht suchen. Wenn ich mit Freunden essen gehe, frage ich freundlich nach den Zutaten. Meistens finden wir ein Restaurant mit mehreren vegetarischen Möglichkeiten. Meine Familie probiert jetzt auch neue Rezepte aus. Für mich ist wichtig, dass die Entscheidung zu meinem Alltag passt und ich genügend Auswahl habe.",
        "منذ سنة لم أعد آكل اللحم. كان الأمر صعباً في البداية لأن عائلتي تطهو اللحم كثيراً، ولم أجد في المطاعم سوى خيارات قليلة. جرّبت في هذه الأثناء وصفات جديدة كثيرة، خصوصاً من المطبخين الشرقي والهندي، حيث توجد أطباق نباتية كثيرة. ما فاجأني هو أنني لم أشعر بضعف؛ بل على العكس، أصبحت لديّ طاقة أكبر وانخفض مستوى الكوليسترول لديّ. بالطبع عليّ أن أحرص على تناول ما يكفي من الحديد والبروتين، من البقوليات والمكسرات والسبانخ مثلاً. تختلف ردود فعل أصدقائي: بعضهم يعجبه ذلك، وآخرون يمزحون بشأنه. أحاول ألا أفرض رأيي على أحد، بل أكتفي بأن أكون قدوة حسنة. أجهز غدائي غالباً في المساء السابق. وهكذا لا أحتاج إلى وقت طويل للبحث عن وجبة مناسبة في الاستراحة. عندما أذهب إلى مطعم مع أصدقائي أسأل بلطف عن المكونات. وغالباً ما نجد مطعماً لديه خيارات نباتية متعددة. بدأت عائلتي أيضاً تجربة وصفات جديدة. المهم بالنسبة إليّ أن يناسب هذا القرار حياتي اليومية وأن تكون لديّ خيارات كافية.",
    ),
    "t-b1-33": (
        "Letzte Woche hatte ich ein Bewerbungsgespräch bei einer Marketingfirma in Köln. Schon Tage vorher war ich ziemlich nervös. Ich las meinen Lebenslauf mehrmals durch, informierte mich über die Firma und übte typische Fragen: nach meinen Stärken und Schwächen, meiner Berufserfahrung und meinen Gehaltsvorstellungen. Pünktlich um zehn Uhr war ich da. Die Gesprächspartnerin war freundlich und stellte mir zuerst das Unternehmen vor. Sie fragte nach meinem Studium und meinen Praktika. Außerdem wollte sie wissen, warum ich gerade in dieser Firma arbeiten möchte. Am Ende hatte ich auch selbst die Gelegenheit, Fragen zu stellen. Ich fragte nach dem Team, den Arbeitszeiten und der Möglichkeit, teilweise im Homeoffice zu arbeiten. Besonders wichtig war mir, wie ein normaler Arbeitstag aussieht und welche Aufgaben am Anfang auf mich warten. Die Gesprächspartnerin beantwortete alle Fragen. Danach fühlte ich mich ruhiger. Obwohl ich noch keine Zusage hatte, war ich mit dem Gespräch zufrieden. Drei Tage später bekam ich eine E-Mail: Ich wurde zu einem zweiten Gespräch eingeladen. Die Einladung zum zweiten Gespräch machte mich sehr froh.",
        "أجريت الأسبوع الماضي مقابلة عمل في شركة تسويق في كولونيا. كنت متوترة جداً قبلها بأيام. قرأت سيرتي الذاتية مرات عدة، وجمعت معلومات عن الشركة، وتدربت على أسئلة شائعة عن نقاط قوتي وضعفي وخبرتي وتوقعاتي للراتب. وصلت في العاشرة تماماً. كانت المحاوِرة ودودة وقدمت لي الشركة أولاً. سألتني عن دراستي وتدريباتي العملية، وأرادت أن تعرف أيضاً لماذا أريد العمل في هذه الشركة تحديداً. أتيحت لي في النهاية فرصة طرح أسئلتي. سألت عن الفريق وأوقات العمل وإمكانية العمل جزئياً من المنزل. كان يهمني خصوصاً أن أعرف كيف يبدو يوم العمل العادي وما المهام التي سأبدأ بها. أجابت المحاوِرة عن كل الأسئلة. شعرت بعدها بهدوء أكبر. ورغم أنني لم أحصل على قبول بعد، كنت راضية عن المقابلة. بعد ثلاثة أيام وصلتني رسالة إلكترونية: دعوني إلى مقابلة ثانية. أسعدتني الدعوة إلى المقابلة الثانية كثيراً.",
    ),
    "t-b1-34": (
        "Gestern sah ich auf dem Weg zur Arbeit einen kleinen Unfall. An einer Kreuzung wollte ein Autofahrer rechts abbiegen. Dabei übersah er einen Radfahrer, der geradeaus fuhr. Der Radfahrer stürzte und verletzte sich leicht am Knie. Zum Glück trug er einen Helm und blieb bei Bewusstsein. Passanten halfen sofort, riefen den Krankenwagen und informierten die Polizei. Eine Frau blieb beim Radfahrer, während ein anderer Mann den Verkehr warnte. Der Autofahrer war sehr aufgeregt und entschuldigte sich mehrmals. Nach kurzer Zeit konnte der Radfahrer wieder stehen. Ein Polizist sprach mit den Beteiligten und nahm ihre Aussagen auf. Niemand wusste zuerst, ob die Verletzung schwer war. Deshalb warteten die Passanten, bis die Rettungskräfte eintrafen. Ich blieb noch kurz stehen und sprach mit einer Frau, die den Unfall ebenfalls gesehen hatte. Dann ging ich weiter zur Arbeit und dachte über die Situation nach. Der Vorfall hat mir wieder gezeigt, wie wichtig es ist, im Verkehr aufmerksam zu sein — sowohl als Fußgängerin als auch als Fahrerin. Seitdem achte ich an Kreuzungen besonders auf abbiegende Autos.",
        "رأيت أمس حادثاً بسيطاً في طريقي إلى العمل. أراد سائق سيارة أن ينعطف يميناً عند تقاطع، لكنه لم ينتبه إلى راكب دراجة كان يسير إلى الأمام. سقط راكب الدراجة وأُصيب في ركبته. لحسن الحظ كان يرتدي خوذة وظل واعياً. ساعد المارة فوراً واتصلوا بالإسعاف وأبلغوا الشرطة. بقيت امرأة قرب راكب الدراجة، بينما حذّر رجل آخر السيارات من الاقتراب. كان السائق منفعلاً جداً واعتذر مرات عدة. وبعد وقت قصير استطاع راكب الدراجة الوقوف من جديد. تحدث شرطي مع الأطراف وأخذ أقوالهم. لم يعرف أحد في البداية إن كانت الإصابة خطيرة. لذلك انتظر المارة حتى وصلت فرق الإنقاذ. بقيت واقفة قليلاً وتحدثت مع امرأة شاهدت الحادث أيضاً. ثم واصلت طريقي إلى العمل وفكرت في الموقف. وعزّز ذلك لديّ الإحساس بأهمية الانتباه في الطريق، سواء أكنت ماشية أم سائقة. ومنذ ذلك الحين أنتبه كثيراً إلى السيارات التي تنعطف عند التقاطعات.",
    ),
    "t-b1-35": (
        "Sehr geehrte Redaktion,\n\nich schreibe Ihnen, weil ich mich über den Zustand des Stadtparks in meinem Viertel ärgere. Immer wieder sehe ich dort Müll auf den Wiesen und auf den Spielplätzen: leere Flaschen, Plastiktüten, Zigarettenkippen und Essensverpackungen. Obwohl es genug Mülleimer gibt, werfen viele Leute ihren Abfall einfach auf den Boden. Das ist nicht nur hässlich, sondern auch gefährlich für Kinder und Tiere. Der Park wird von Familien, älteren Menschen und Sportlern genutzt. Wenn Müll liegen bleibt, können sich Tiere daran verletzen, und der Platz ist für alle weniger angenehm. Ich schlage vor, dass die Stadt mehr Kontrollen durchführt und höhere Geldstrafen verhängt. Außerdem könnte man Schulklassen und Freiwillige zu regelmäßigen Säuberungsaktionen einladen. Weitere Mülleimer an den Eingängen und neben den Bänken könnten ebenfalls helfen. Besucher können ihren Abfall mitnehmen und andere freundlich darauf aufmerksam machen. Ein gemeinsamer Park ist für das Viertel wichtig, weil Menschen dort gern ihre Freizeit verbringen. Nur wenn alle Verantwortung übernehmen, bleibt der Park ein schöner Ort für alle.\n\nMit freundlichen Grüßen\nEine Anwohnerin",
        "إلى السادة في هيئة التحرير،\n\nأكتب إليكم لأنني مستاءة من حالة الحديقة العامة في حيي. أرى فيها مراراً نفايات على المروج وفي ملاعب الأطفال: زجاجات فارغة وأكياساً بلاستيكية وأعقاب سجائر وعبوات طعام. ورغم وجود سلال مهملات كافية، يرمي كثير من الناس نفاياتهم على الأرض. هذا ليس قبيحاً فحسب، بل خطير أيضاً على الأطفال والحيوانات. تستخدم العائلات وكبار السن والرياضيون الحديقة. وإذا بقيت النفايات على الأرض، فقد تتأذى الحيوانات منها، كما تصبح الحديقة أقل راحة للجميع. أقترح أن تزيد المدينة أعمال الرقابة وأن تفرض غرامات أعلى. ويمكن أيضاً دعوة الصفوف المدرسية والمتطوعين إلى حملات تنظيف منتظمة. وقد تساعد كذلك إضافة سلال مهملات عند المداخل وبجانب المقاعد. يستطيع الزوار أخذ نفاياتهم معهم وتنبيه الآخرين بلطف. الحديقة المشتركة مهمة للحي لأن الناس يحبون قضاء أوقات فراغهم فيها. لا تبقى الحديقة مكاناً جميلاً للجميع إلا إذا تحمّل كل شخص مسؤوليته.\n\nمع خالص التحية،\nإحدى سكان الحي",
    ),
    "t-b2-36": (
        "Immer mehr Expertinnen und Experten fordern, den Schulbeginn von 8 auf 9 Uhr zu verlegen. Ihre Begründung: Viele Jugendliche finden in der Pubertät abends später in den Schlaf als jüngere Kinder. Sie sind morgens oft noch müde, was ihre Konzentration und ihr Gedächtnis beeinträchtigen kann. Auch für die psychische Gesundheit kann dauerhafter Schlafmangel problematisch sein. Befürworter sagen deshalb, ein späterer Start könne den Schulalltag besser an den Schlafrhythmus vieler Jugendlicher anpassen. Kritiker wenden ein, dass späterer Unterricht die Eltern vor organisatorische Probleme stellt und mit den Nachmittagsterminen der Schüler kollidiert. Außerdem sei nicht erwiesen, dass ein späterer Beginn die Leistungen tatsächlich verbessere. Busfahrpläne, Arbeitszeiten der Eltern und die Betreuung jüngerer Geschwister müssten ebenfalls berücksichtigt werden. Schulen müssten außerdem ihre Räume länger öffnen, was zusätzliche Kosten verursachen kann. Dennoch halte ich einen Modellversuch an einigen Schulen für sinnvoll. Dabei sollte man nicht nur Noten, sondern auch Schlaf, Wohlbefinden und Unterrichtsbeteiligung beobachten. Wenn sich zeigt, dass Schüler ausgeruhter und aufmerksamer sind, sollte man die Regelung überdenken, statt den frühen Schulbeginn um jeden Preis als selbstverständlich hinzunehmen.",
        "يطالب عدد متزايد من الخبراء والخبيرات بتأخير بدء اليوم المدرسي من الثامنة إلى التاسعة. وحجتهم أن كثيراً من المراهقين يجدون صعوبة في النوم باكراً أثناء البلوغ، مقارنة بالأطفال الأصغر سناً. لذلك يكونون غالباً متعبين في الصباح، وقد يؤثر ذلك في تركيزهم وذاكرتهم. كما قد يؤثر نقص النوم المستمر في الصحة النفسية. ويرى المؤيدون أن البدء المتأخر قد يجعل اليوم المدرسي أكثر توافقاً مع إيقاع نوم المراهقين. يعترض النقاد بأن الدروس المتأخرة تضع الأهل أمام مشكلات تنظيمية، وأنها قد تتعارض مع مواعيد الطلاب بعد الظهر. كما لم يثبت أن البدء المتأخر يحسّن النتائج فعلاً. وينبغي أيضاً مراعاة مواعيد الحافلات وأوقات عمل الوالدين ورعاية الإخوة الأصغر سناً. وقد تضطر المدارس أيضاً إلى إبقاء مبانيها مفتوحة لوقت أطول، مما قد يسبب تكاليف إضافية. مع ذلك أرى أن تجربة هذا النظام في بعض المدارس فكرة مفيدة. وينبغي خلالها متابعة النوم والراحة والمشاركة في الدرس، لا العلامات وحدها. إذا تبيّن أن الطلاب أكثر راحة وانتباهًا، فينبغي إعادة النظر في النظام بدلاً من اعتبار بدء الدراسة المبكر أمراً مسلّماً به بأي ثمن.",
    ),
    "t-b2-37": (
        "Als ich vor vier Jahren zum ersten Mal nach Deutschland kam, war ich überrascht, wie direkt Kollegen und Nachbarn ihre Meinung sagten. In meiner Heimat gilt es als höflich, Kritik indirekt zu formulieren und zuerst längere Gespräche über alltägliche Dinge zu führen. Hier hingegen hörte ich Sätze wie «Das funktioniert so nicht» oder «Da bin ich anderer Meinung», ohne dass die Sprecher unfreundlich wirken wollten. Anfangs habe ich das als Ablehnung empfunden, bis mir klar wurde, dass direkte Kommunikation kein Zeichen von Respektlosigkeit ist, sondern oft auf Transparenz und Effizienz abzielt. Umgekehrt empfanden manche meiner deutschen Kollegen meine vorsichtige Formulierung als unklar oder sogar unentschlossen. Diese Erfahrung hat mir gezeigt, dass Kommunikation immer auch kulturell geprägt ist. Missverständnisse lassen sich nicht immer vermeiden, aber sie werden seltener, wenn man die eigenen Erwartungen reflektiert und die der anderen ernst nimmt. Heute frage ich nach, wenn ich eine Äußerung nicht richtig verstehe. Gleichzeitig formuliere ich meine eigene Meinung klarer als früher. Das hilft, Unklarheiten früh anzusprechen. Das kostet manchmal etwas mehr Zeit, kann aber Vertrauen im Team schaffen. Für mich bedeutet gute Kommunikation nicht, immer einer Meinung zu sein. Wichtig ist, dass beide Seiten ihre Erwartungen erklären können.",
        "عندما جئت إلى ألمانيا لأول مرة قبل أربع سنوات، فوجئت بمدى مباشرة الزملاء والجيران في التعبير عن آرائهم. في بلدي يُعدّ من اللباقة صياغة النقد بصورة غير مباشرة وإطالة الأحاديث الودية العابرة قبل الدخول في الموضوع. أما هنا فسمعت عبارات مثل «هذا لا ينجح بهذه الطريقة» أو «أرى الأمر على نحو مختلف»، من دون أن يقصد المتحدثون الإساءة. في البداية شعرت بأن ذلك رفض لي، إلى أن فهمت أن التواصل المباشر ليس قلة احترام، بل يهدف غالباً إلى الشفافية والفعالية. وعلى العكس، رأى بعض زملائي الألمان أن صياغتي الحذرة غير واضحة أو مترددة. أظهرت لي هذه التجربة أن التواصل يتأثر دائماً بالثقافة أيضاً. لا يمكن تجنب سوء الفهم دائماً، لكنه يقل عندما يراجع المرء توقعاته ويحترم توقعات الآخرين. أسأل اليوم عندما لا أفهم عبارة على نحو صحيح. كما أعبّر عن رأيي بوضوح أكبر من السابق. ويساعد ذلك على توضيح الأمور مبكراً. قد يستغرق ذلك وقتاً أطول قليلاً أحياناً، لكنه قد يبني الثقة في الفريق. التواصل الجيد لا يعني بالنسبة إليّ أن نتفق دائماً. المهم أن يشرح الطرفان توقعاتهما.",
    ),
    "t-b2-38": (
        "Die Debatte um die Vier-Tage-Woche hat in den letzten Jahren an Fahrt aufgenommen. Berichte aus Pilotprojekten in Island, Großbritannien und Deutschland nennen eine höhere Produktivität, weniger Krankmeldungen und zufriedenere Mitarbeitende. Dennoch bleibt das Modell umstritten. Arbeitgeberverbände warnen davor, dass in produzierenden Branchen Maschinen stillstehen könnten und die Dienstleistungsqualität sinken könnte. Außerdem sei fraglich, ob alle Aufgaben in vier Tagen bei gleicher Bezahlung zu schaffen seien. Befürworter argumentieren dagegen, dass weniger Arbeitszeit zu konzentrierterem Arbeiten anrege und Menschen motivierter mache, weil sie mehr Zeit für Familie, Hobbys und Erholung hätten. Meiner Ansicht nach ist die Vier-Tage-Woche keine Einheitslösung, aber sie sollte dort, wo es betrieblich möglich ist, ernsthaft erprobt werden. Es wäre naiv anzunehmen, dass weniger Stunden automatisch weniger Leistung bedeuten — entscheidend ist vielmehr, wie die Arbeit organisiert ist. Dabei muss die Arbeitszeit in den Betrieben unterschiedlich geplant werden. Ein Büro kann Aufgaben anders verteilen als ein Krankenhaus oder ein Geschäft mit festen Öffnungszeiten. Auch darf eine kürzere Woche nicht bedeuten, dass Beschäftigte dieselbe Menge Arbeit in weniger Stunden erledigen müssen. Vor einem Versuch sollten deshalb Ziele, Erreichbarkeit und Arbeitsbelastung klar besprochen werden. Danach braucht es eine offene Auswertung mit Beschäftigten und Kunden. Erst dann lässt sich beurteilen, ob das Modell fair und dauerhaft funktioniert.",
        "اكتسب النقاش حول أسبوع العمل لأربعة أيام زخماً في السنوات الأخيرة. وتشير تقارير عن تجارب رائدة في آيسلندا وبريطانيا وألمانيا إلى إنتاجية أعلى وإجازات مرضية أقل وموظفين أكثر رضا. ومع ذلك يبقى هذا النموذج مثار جدل. تحذّر اتحادات أرباب العمل من احتمال توقف الآلات في القطاعات الإنتاجية ومن تراجع جودة الخدمات. كما تشك في إمكانية إنجاز كل المهام في أربعة أيام مع الحفاظ على الراتب نفسه. ويرى المؤيدون أن ساعات العمل الأقل قد تشجع على تركيز أكبر وتحفز الناس، لأن لديهم وقتاً أكثر للعائلة والهوايات والراحة. في رأيي، أسبوع الأيام الأربعة ليس حلاً واحداً يناسب الجميع، لكن ينبغي اختباره بجدية حيث تسمح ظروف العمل. ومن السذاجة افتراض أن الساعات الأقل تعني تلقائياً إنجازاً أقل؛ فالأهم هو كيفية تنظيم العمل. يجب التخطيط لساعات العمل بطرق مختلفة حسب مكان العمل. فالمكتب يستطيع توزيع المهام بطريقة تختلف عن المستشفى أو المتجر ذي ساعات الدوام الثابتة. كما ينبغي ألا يعني الأسبوع الأقصر أن ينجز الموظفون كمية العمل نفسها في ساعات أقل. لذلك يجب مناقشة الأهداف وإمكانية التواصل وعبء العمل بوضوح قبل التجربة. وبعدها يلزم تقييم مفتوح بمشاركة الموظفين والزبائن. وعندئذ فقط يمكن الحكم على ما إذا كان النموذج عادلاً وقابلاً للاستمرار.",
    ),
    "t-b2-39": (
        "Manche Familien ziehen aus teuren Großstädten ins Umland oder in ländliche Regionen. Gründe sind hohe Mieten, beengte Wohnverhältnisse und der Wunsch nach mehr Natur und Ruhe. Gleichzeitig ist das Landleben nicht für alle attraktiv. Öffentliche Verkehrsmittel sind selten, Ärzte und Schulen teilweise weit entfernt, und kulturelle Angebote wie Theater oder Kinos sind rar. Die Digitalisierung — Homeoffice und Videokonferenzen — hat einen Umzug für manche Beschäftigte erleichtert, doch das funktioniert nur, wenn der ländliche Raum ausreichend mit schnellem Internet ausgestattet ist. Ein Staat, der will, dass Menschen frei entscheiden können, wo sie wohnen, muss die Infrastruktur dort ausbauen, wo sie heute noch fehlt. Sonst bleibt die «Stadtflucht» ein Privileg weniger Menschen mit hohem Einkommen. Vor einem Umzug sollten Familien prüfen, wie weit ihr Arbeitsplatz entfernt ist und ob es Betreuung für Kinder gibt. Wer ohne Auto lebt, braucht eine verlässliche Verbindung zur nächsten Stadt. Auch Vereine und Nachbarschaft können wichtig sein, damit neue Bewohner Kontakte finden. Ein ruhiger Wohnort allein löst nicht alle Probleme. Deshalb müssen Gemeinden nicht nur Wohnraum, sondern auch Verkehr und öffentliche Angebote mitdenken.",
        "تنتقل بعض العائلات من المدن الكبرى الغالية إلى ضواحيها أو إلى المناطق الريفية. ومن الأسباب الإيجارات المرتفعة وضيق المساكن والرغبة في مزيد من الطبيعة والهدوء. لكن الحياة الريفية لا تناسب الجميع. فوسائل النقل العام قليلة، والأطباء والمدارس بعيدة أحياناً، والعروض الثقافية مثل المسارح ودور السينما نادرة. سهّلت الرقمنة والعمل من المنزل ومؤتمرات الفيديو الانتقال لبعض الموظفين، لكن ذلك لا ينجح إلا إذا توفّر إنترنت سريع بما يكفي في الريف. وعلى الدولة التي تريد للناس أن يختاروا مكان سكنهم بحرية أن تطوّر البنية التحتية حيثما تنقص. وإلا ظل «الانتقال من المدينة» امتيازاً لقلة من ذوي الدخل المرتفع. ينبغي للعائلات قبل الانتقال أن تتحقق من بُعد مكان العمل ومن توافر رعاية للأطفال. ومن لا يملك سيارة يحتاج إلى مواصلات موثوقة إلى أقرب مدينة. وقد تكون الجمعيات والجيرة مهمة أيضاً كي يجد السكان الجدد معارف. فالمكان الهادئ وحده لا يحل كل المشكلات. لذلك ينبغي للبلديات أن تفكر في السكن والمواصلات والخدمات العامة معاً.",
    ),
    "t-b2-40": (
        "Lügen gelten vielen Menschen als moralisch verwerflich. Trotzdem sagen Menschen im Alltag manchmal nicht die ganze Wahrheit. Die Motive sind sehr unterschiedlich: Manche Unwahrheiten dienen dem Selbstschutz, um Strafe oder Blamage zu vermeiden. Andere sollen Mitmenschen schonen. So sagt jemand aus Höflichkeit vielleicht: „Das Essen hat mir geschmeckt“, obwohl die Person es nicht mochte. Wieder andere Unwahrheiten dienen der Selbstdarstellung. In sozialen Medien stellen manche Menschen ihr Leben erfolgreicher oder interessanter dar, als es tatsächlich ist. Problematisch wird es, wenn Lügen Vertrauen zerstören oder andere bewusst manipulieren. Eine kleine Höflichkeitslüge kann zunächst harmlos erscheinen. Wenn die Wahrheit später bekannt wird, kann sie jedoch eine Beziehung belasten. Entscheidend ist auch, wem eine Aussage nützt und wer dadurch Nachteile hat. Die Grenze zwischen höflichem Schweigen und bewusster Täuschung ist nicht immer leicht zu ziehen. Ein ehrliches Gespräch kann zunächst unangenehm sein, aber spätere Enttäuschungen verhindern. Eine offene Kommunikationskultur, in der Fehler zugegeben werden dürfen, ist vermutlich ein guter Weg, um unnötige Lügen zu reduzieren. Sie macht es leichter, Probleme direkt anzusprechen, ohne andere absichtlich zu verletzen.",
        "يعدّ كثيرون الكذب أمراً مرفوضاً أخلاقياً. ومع ذلك لا يقول الناس أحياناً الحقيقة كاملة في حياتهم اليومية. وتختلف الدوافع كثيراً: فبعض العبارات غير الصادقة تحمي صاحبها من العقاب أو الإحراج. وتهدف عبارات أخرى إلى مراعاة مشاعر الآخرين. فقد يقول شخص بدافع اللباقة إن الطعام أعجبه، مع أنه لم يعجبه فعلاً. وتخدم عبارات أخرى تحسين صورة الشخص عن نفسه. ففي وسائل التواصل الاجتماعي يعرض بعض الناس حياتهم على أنها أكثر نجاحاً أو إثارة مما هي عليه فعلاً. يصبح الأمر مشكلة عندما يهدم الكذب الثقة أو يتلاعب شخص بالآخرين عن قصد. قد تبدو مجاملة غير صادقة صغيرةً وغير مؤذية في البداية، لكنها قد تضر بعلاقة إذا ظهرت الحقيقة لاحقاً. ومن المهم أيضاً أن نسأل من يستفيد من الكلام ومن يتضرر بسببه. وليس من السهل دائماً رسم الحد الفاصل بين الصمت بدافع اللباقة والخداع المتعمد. قد يكون الحديث الصريح غير مريح في البداية، لكنه قد يمنع خيبات أمل لاحقاً. يُرجح أن ثقافة التواصل المفتوحة، التي يُسمح فيها بالاعتراف بالأخطاء، تساعد على تقليل الأكاذيب غير الضرورية. فهي تسهّل مناقشة المشكلات مباشرة من دون إيذاء الآخرين عمداً.",
    ),
}

NEW_QUESTIONS: dict[str, dict[str, object]] = {
    "t-a2-22-q2": {
        "id": "t-a2-22-q2", "type": "mc",
        "promptDe": "Was möchte Fatima mit dem Unterrichtsstoff machen?",
        "promptAr": "ماذا تريد فاطمة أن تفعل بما فات من الدرس؟",
        "options": ["Sie möchte ihn nachholen", "Sie möchte den Kurs wechseln", "Sie möchte das Buch verkaufen"],
        "answer": "Sie möchte ihn nachholen",
        "explanationAr": "الدليل في النص: «Ich möchte den Stoff nachholen.» — تريد فاطمة استدراك ما فاتها.",
    },
    "t-a2-23-q2": {
        "id": "t-a2-23-q2", "type": "mc",
        "promptDe": "In welche Straße soll man links abbiegen?",
        "promptAr": "إلى أي شارع ينبغي الانعطاف يساراً؟",
        "options": ["In die Goethestraße", "In die Bahnhofstraße", "In die Marktstraße"],
        "answer": "In die Goethestraße",
        "explanationAr": "الدليل في النص: «Dort biegen Sie links in die Goethestraße.» — انعطف يساراً إلى شارع غوته.",
    },
    "t-a2-24-q2": {
        "id": "t-a2-24-q2", "type": "mc",
        "promptDe": "Wo war die Person am Samstag mit ihrer Freundin?",
        "promptAr": "أين كانت المتحدثة يوم السبت مع صديقتها؟",
        "options": ["In einem Café", "Im Kino", "Im Museum"],
        "answer": "In einem Café",
        "explanationAr": "الدليل في النص: «Um drei Uhr sind wir zusammen in ein Café gegangen und haben viel geredet.» — ذهبتا معاً إلى مقهى وتحدثتا.",
    },
    "t-a2-25-q2": {
        "id": "t-a2-25-q2", "type": "mc",
        "promptDe": "Wo liegt die Milch im Supermarkt?",
        "promptAr": "أين يوجد الحليب في السوبرماركت؟",
        "options": ["Im Kühlregal hinten links", "Bei der Kasse", "Am Eingang neben dem Brot"],
        "answer": "Im Kühlregal hinten links",
        "explanationAr": "الدليل في النص: «Die Milch ist im Kühlregal ganz hinten links.» — الحليب في رف التبريد بالخلف يساراً.",
    },
    "t-a2-26-q2": {
        "id": "t-a2-26-q2", "type": "mc",
        "promptDe": "Wie kommt Ahmed bis zur Haltestelle Markt?",
        "promptAr": "كيف يصل أحمد إلى محطة ماركت؟",
        "options": ["Mit der U-Bahn-Linie 3", "Mit dem Bus Nummer 5", "Mit dem Zug"],
        "answer": "Mit der U-Bahn-Linie 3",
        "explanationAr": "الدليل في النص: «Du kannst mit der U-Bahn-Linie 3 bis zur Haltestelle Markt fahren.» — يمكنه ركوب خط المترو رقم 3.",
    },
    "t-a2-27-q2": {
        "id": "t-a2-27-q2", "type": "mc",
        "promptDe": "Was hat die Wohnung außer einem Balkon?",
        "promptAr": "ماذا يوجد في الشقة أيضاً غير الشرفة؟",
        "options": ["Eine Einbauküche", "Eine Garage", "Eine zweite Dusche"],
        "answer": "Eine Einbauküche",
        "explanationAr": "الدليل في النص: «einen Balkon und eine Einbauküche.» — فيها شرفة ومطبخ مركّب.",
    },
    "t-a2-28-q2": {
        "id": "t-a2-28-q2", "type": "mc",
        "promptDe": "Was kann Nadia beim Arzt vorzeigen?",
        "promptAr": "ماذا تستطيع نادية أن تُبرز للطبيب؟",
        "options": ["Eine Mitgliedsbescheinigung", "Eine Rechnung", "Einen Mietvertrag"],
        "answer": "Eine Mitgliedsbescheinigung",
        "explanationAr": "الدليل في النص: «Sie können eine Mitgliedsbescheinigung bei uns anfordern und beim Arzt vorzeigen.» — تستطيع طلب شهادة عضوية وإبرازها للطبيب.",
    },
    "t-a2-29-q2": {
        "id": "t-a2-29-q2", "type": "mc",
        "promptDe": "Wofür braucht die Person das Zertifikat?",
        "promptAr": "لماذا تحتاج المتحدثة إلى الشهادة؟",
        "options": ["Für ihren Job", "Für eine Reise", "Für die Universität"],
        "answer": "Für ihren Job",
        "explanationAr": "الدليل في النص: «Das Zertifikat brauche ich für meinen Job.» — تحتاج إلى الشهادة من أجل عملها.",
    },
    "t-a2-30-q2": {
        "id": "t-a2-30-q2", "type": "mc",
        "promptDe": "Welche Soße wird zum Couscous extra serviert?",
        "promptAr": "أي صلصة تُقدّم جانباً مع الكسكس؟",
        "options": ["Scharfe Harissa", "Tomatensoße", "Joghurtsoße"],
        "answer": "Scharfe Harissa",
        "explanationAr": "الدليل في النص: «Es schmeckt besonders gut mit scharfer Harissa.» — يؤكل مع الهريسة الحارة.",
    },
    "t-a2-031-q2": {
        "id": "t-a2-031-q2", "type": "mc",
        "promptDe": "Wie erkundet Sara die Stadt am Wochenende?",
        "promptAr": "كيف تستكشف سارة المدينة في نهاية الأسبوع؟",
        "options": ["Mit dem Fahrrad", "Mit dem Taxi", "Zu Fuß mit dem Zug"],
        "answer": "Mit dem Fahrrad",
        "explanationAr": "الدليل في النص: «Am Samstag erkundet sie die Stadt mit dem Fahrrad und probiert neue Cafés aus.» — تستكشفها بالدراجة.",
    },
    "t-a2-032-q2": {
        "id": "t-a2-032-q2", "type": "mc",
        "promptDe": "Wie oft geht Lukas laufen?",
        "promptAr": "كم مرة يذهب لوكاس للجري؟",
        "options": ["Dreimal pro Woche", "Jeden Tag", "Einmal im Monat"],
        "answer": "Dreimal pro Woche",
        "explanationAr": "الدليل في النص: «Er geht dreimal pro Woche laufen und schläft vor Mitternacht.» — يركض ثلاث مرات في الأسبوع.",
    },
    "t-b1-33-q2": {
        "id": "t-b1-33-q2", "type": "mc",
        "promptDe": "Wozu wurde sie drei Tage später eingeladen?",
        "promptAr": "إلى ماذا دُعيت بعد ثلاثة أيام؟",
        "options": ["Zu einem zweiten Gespräch", "Zu einer Feier", "Zu einem Sprachkurs"],
        "answer": "Zu einem zweiten Gespräch",
        "explanationAr": "الدليل في النص: «Ich wurde zu einem zweiten Gespräch eingeladen.» — دُعيت إلى مقابلة ثانية.",
    },
    "t-b1-34-q2": {
        "id": "t-b1-34-q2", "type": "mc",
        "promptDe": "Wer rief den Krankenwagen?",
        "promptAr": "من اتصل بسيارة الإسعاف؟",
        "options": ["Passanten", "Der Radfahrer", "Der Polizist"],
        "answer": "Passanten",
        "explanationAr": "الدليل في النص: «Passanten halfen sofort, riefen den Krankenwagen und informierten die Polizei.» — اتصل المارة بالإسعاف.",
    },
    "t-b1-35-q2": {
        "id": "t-b1-35-q2", "type": "mc",
        "promptDe": "Welche weitere Maßnahme wird vorgeschlagen?",
        "promptAr": "ما الإجراء الآخر الذي يقترحه الكاتب؟",
        "options": ["Schulklassen und Freiwillige zu Säuberungsaktionen einladen", "Den Park schließen", "Die Spielplätze entfernen"],
        "answer": "Schulklassen und Freiwillige zu Säuberungsaktionen einladen",
        "explanationAr": "الدليل في النص: «Außerdem könnte man Schulklassen und Freiwillige zu regelmäßigen Säuberungsaktionen einladen.» — دعوة الصفوف والمتطوعين إلى حملات تنظيف.",
    },
    "t-b2-36-q2": {
        "id": "t-b2-36-q2", "type": "mc",
        "promptDe": "Was hält der Autor für sinnvoll?",
        "promptAr": "ما الذي يراه الكاتب مفيداً؟",
        "options": ["Einen Modellversuch an einigen Schulen", "Eine sofortige Änderung an allen Schulen", "Kürzere Ferien"],
        "answer": "Einen Modellversuch an einigen Schulen",
        "explanationAr": "الدليل في النص: «Dennoch halte ich einen Modellversuch an einigen Schulen für sinnvoll.» — يرى تجربة نموذجية في بعض المدارس فكرة مفيدة.",
    },
    "t-b2-37-q2": {
        "id": "t-b2-37-q2", "type": "mc",
        "promptDe": "Wie können Missverständnisse seltener werden?",
        "promptAr": "كيف يمكن تقليل سوء الفهم؟",
        "options": ["Eigene Erwartungen prüfen und die der anderen ernst nehmen", "Immer einer Meinung sein", "Kritik grundsätzlich vermeiden"],
        "answer": "Eigene Erwartungen prüfen und die der anderen ernst nehmen",
        "explanationAr": "الدليل في النص: «wenn man die eigenen Erwartungen reflektiert und die der anderen ernst nimmt.» — مراجعة التوقعات واحترام توقعات الآخرين يقللان سوء الفهم.",
    },
    "t-b2-38-q2": {
        "id": "t-b2-38-q2", "type": "mc",
        "promptDe": "Wovon hängt laut dem Autor ab, ob weniger Stunden weniger Leistung bedeuten?",
        "promptAr": "على ماذا يتوقف كون الساعات الأقل تعني إنجازاً أقل، بحسب الكاتب؟",
        "options": ["Von der Organisation der Arbeit", "Von der Zahl der Feiertage", "Von der Größe des Büros"],
        "answer": "Von der Organisation der Arbeit",
        "explanationAr": "الدليل في النص: «entscheidend ist vielmehr, wie die Arbeit organisiert ist.» — العامل الحاسم هو تنظيم العمل.",
    },
    "t-b2-39-q2": {
        "id": "t-b2-39-q2", "type": "mc",
        "promptDe": "Was muss der Staat laut dem Text im ländlichen Raum ausbauen?",
        "promptAr": "ما الذي ينبغي للدولة تطويره في المناطق الريفية بحسب النص؟",
        "options": ["Die Infrastruktur", "Die Zahl der Theater", "Die Mieten"],
        "answer": "Die Infrastruktur",
        "explanationAr": "الدليل في النص: «muss die Infrastruktur dort ausbauen, wo sie heute noch fehlt.» — يجب تطوير البنية التحتية حيثما تنقص.",
    },
    "t-b2-40-q2": {
        "id": "t-b2-40-q2", "type": "mc",
        "promptDe": "Was kann eine offene Kommunikationskultur erleichtern?",
        "promptAr": "ما الذي تسهّله ثقافة التواصل المفتوحة؟",
        "options": ["Fehler zuzugeben und Probleme direkt anzusprechen", "Andere zu manipulieren", "Jede Kritik zu vermeiden"],
        "answer": "Fehler zuzugeben und Probleme direkt anzusprechen",
        "explanationAr": "الدليل في النص: «in der Fehler zugegeben werden dürfen» und «Probleme direkt anzusprechen». — تسهّل الاعتراف بالأخطاء ومناقشة المشكلات مباشرة.",
    },
}

QUESTION_UPDATES: dict[str, dict[str, object]] = {
    "t-a2-24-q1": {
        "promptDe": "An welchem Tag war der Test?",
        "promptAr": "في أي يوم كان الاختبار؟",
    },
    "t-a2-28-q1": {
        "promptDe": "Wie erhält Nadia ihre Versicherungsnummer?",
        "promptAr": "كيف يصل رقم التأمين إلى نادية؟",
        "options": ["Per E-Mail", "Per Post", "Am Telefon"],
        "answer": "Per Post",
        "explanationAr": "الدليل في النص: «Wir schicken die Nummer per Post, sobald Ihre Anmeldung bearbeitet ist.» — نرسل الرقم بالبريد بعد معالجة الطلب.",
    },
    "t-b1-34-q1": {
        "explanationAr": "الدليل في النص: «verletzte sich leicht am Knie.» — أُصيب راكب الدراجة في ركبته إصابة خفيفة.",
    },
    "t-b2-38-q1": {
        "explanationAr": "الدليل في النص: «Arbeitgeberverbände warnen davor, dass in produzierenden Branchen Maschinen stillstehen könnten und die Dienstleistungsqualität sinken könnte.» — تحذّر الاتحادات من احتمال توقف الآلات وتراجع جودة الخدمات.",
    },
    "t-b2-39-q1": {
        "options": ["Wegen hoher Mieten in der Stadt und mehr Natur", "Wegen besserer Schulen", "Wegen mehr Kulturangeboten", "Wegen kürzerer Arbeitswege"],
        "answer": "Wegen hoher Mieten in der Stadt und mehr Natur",
        "explanationAr": "الدليل في النص: «Gründe sind hohe Mieten, beengte Wohnverhältnisse und der Wunsch nach mehr Natur und Ruhe.» — من الأسباب غلاء الإيجار والرغبة في مزيد من الطبيعة والهدوء.",
    },
    "t-b2-40-q1": {
        "promptDe": "Warum sagen manche Menschen eine Höflichkeitslüge?",
        "promptAr": "لماذا يقول بعض الناس مجاملةً غير صادقة؟",
        "options": ["Um Mitmenschen zu schonen", "Um mehr Geld zu verdienen", "Um eine Prüfung zu bestehen", "Um Regeln zu umgehen"],
        "answer": "Um Mitmenschen zu schonen",
        "explanationAr": "الدليل في النص: «Andere sollen Mitmenschen schonen.» — بعض العبارات غير الصادقة تُقال لمراعاة مشاعر الآخرين.",
    },
}

MIN_WORDS = {"A2": 151, "B1": 169, "B2": 173}
MAX_WORDS = {"A2": 192, "B1": 260, "B2": 270}


def count_words(text: str) -> int:
    return len(re.findall(r"\S+", text.strip()))


def main() -> None:
    texts = json.loads(DATA.read_text(encoding="utf-8"))
    by_id = {t["id"]: t for t in texts}
    assert set(UPDATES).issubset(by_id), "Lesetext-ID fehlt"

    for text_id, (de, ar) in UPDATES.items():
        record = by_id[text_id]
        record["de"] = de
        record["ar"] = ar
        level = record["level"]
        count = count_words(de)
        assert MIN_WORDS[level] <= count <= MAX_WORDS[level], f"{text_id}: {count} Wörter"
        record["wordCountDe"] = count
        assert ar.strip(), f"{text_id}: arabische Übersetzung fehlt"

    if "Vier-Tage-Woche" in by_id["t-b2-38"].get("titleDe", "") or "4-Tage-Woche" in by_id["t-b2-38"].get("titleDe", ""):
        by_id["t-b2-38"]["titleDe"] = "Teilzeit oder Vollzeit? Die Vier-Tage-Woche"
        by_id["t-b2-38"]["titleAr"] = "دوام جزئي أم كامل؟ أسبوع العمل لأربعة أيام"

    questions_by_id = {q["id"]: q for t in texts for q in t.get("questions", [])}
    for question_id, fields in QUESTION_UPDATES.items():
        assert question_id in questions_by_id, f"Lesefrage fehlt: {question_id}"
        questions_by_id[question_id].update(fields)
    for question_id, question in NEW_QUESTIONS.items():
        if question_id in questions_by_id:
            questions_by_id[question_id].update(question)
        else:
            text_id = question_id.rsplit("-q", 1)[0]
            by_id[text_id].setdefault("questions", []).append(question)
            questions_by_id[question_id] = by_id[text_id]["questions"][-1]

    for text_id in UPDATES:
        record = by_id[text_id]
        assert len(record.get("questions", [])) >= 2, f"{text_id}: mindestens zwei Fragen nötig"
        for question in record["questions"]:
            assert question.get("answer") in question.get("options", []), question["id"]
            assert question.get("explanationAr"), question["id"]
            for quote in re.findall(r"«([^»]+)»", question["explanationAr"]):
                assert quote in record["de"], f"{question['id']}: Beleg fehlt: {quote}"

    DATA.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("R142b kurze A2–B2-Lesetexte erweitert und Fragen geprüft:")
    for text_id in UPDATES:
        rec = by_id[text_id]
        print(f"  {text_id}: {rec['wordCountDe']} Wörter · {len(rec['questions'])} Fragen")


if __name__ == "__main__":
    main()
