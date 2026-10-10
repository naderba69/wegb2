#!/usr/bin/env python3
"""R142: توسعة نصوص قراءة A1 القصيرة مع محاذاة الترجمة وأسئلة الفهم."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "content" / "texts.json"

UPDATES: dict[str, tuple[str, str]] = {
    "t-a1-021": (
        "Ich heiße Karim und bin 28 Jahre alt. Ich wohne in Köln mit meiner Frau Amina. Unsere Tochter Sara ist drei Jahre alt. Mein Vater wohnt in Tunesien, aber er besucht uns jedes Jahr im Sommer. Am Freitag essen wir zusammen Couscous und trinken Minztee. Meine Frau arbeitet am Vormittag in einer Schule. Sara geht am Morgen in den Kindergarten. Am Nachmittag spielen wir oft zu Hause oder gehen in den Park. Am Sonntag rufe ich meine Mutter in Tunesien an. Wir sprechen lange über die Familie. Ich liebe meine Familie sehr und freue mich auf jeden Besuch.",
        "اسمي كريم وعمري 28 سنة. أعيش في كولونيا مع زوجتي أمينة. ابنتنا سارة عمرها ثلاث سنوات. يسكن أبي في تونس، لكنه يزورنا كل سنة في الصيف. يوم الجمعة نتناول الكسكس معاً ونشرب شاي النعناع. تعمل زوجتي صباحاً في مدرسة. تذهب سارة صباحاً إلى روضة الأطفال. بعد الظهر نلعب غالباً في البيت أو نذهب إلى الحديقة. يوم الأحد أتصل بأمي في تونس. نتحدث طويلاً عن العائلة. أحب عائلتي كثيراً وأفرح بكل زيارة.",
    ),
    "t-a1-022": (
        "Ich stehe jeden Tag um halb sieben auf. Zuerst trinke ich einen Kaffee, dann dusche ich und ziehe mich an. Um acht Uhr frühstücke ich mit meiner Frau: Brot mit Käse und ein Ei. Danach räume ich den Tisch ab und packe meine Tasche. Um halb neun fahre ich mit dem Bus zur Arbeit. Die Haltestelle ist vor dem Haus. Im Büro begrüße ich meine Kollegen und beginne meine Arbeit. Um zwölf Uhr essen wir zusammen. Nach der Arbeit gehe ich manchmal noch einkaufen. Um sechs Uhr komme ich nach Hause. Am Abend erzählen meine Frau und ich uns von unserem Tag. Dann lese ich ein Buch oder sehe fern.",
        "أستيقظ كل يوم في السادسة والنصف. أولاً أشرب قهوة، ثم أستحم وأرتدي ملابسي. أفطر مع زوجتي في الثامنة: خبزاً بالجبن وبيضة. بعد ذلك أرفع الأطباق عن الطاولة وأجهّز حقيبتي. أذهب إلى العمل بالحافلة في الثامنة والنصف. موقف الحافلة أمام المنزل. أحيّي زملائي في المكتب وأبدأ عملي. نتناول الطعام معاً عند الظهر. أذهب أحياناً للتسوق بعد العمل. أعود إلى البيت في السادسة. في المساء نتبادل أنا وزوجتي أخبار يومنا. ثم أقرأ كتاباً أو أشاهد التلفاز.",
    ),
    "t-a1-023": (
        "Meine Wohnung ist nicht groß, aber sehr hell. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon. Im Wohnzimmer stehen ein Sofa, ein Tisch und ein Fernseher. In einem Zimmer schlafen meine Frau und ich. Das zweite Zimmer ist unser Arbeitszimmer. Am Morgen kommt viel Licht durch die Fenster. In der Küche koche ich jeden Abend. Dort stehen auch ein kleiner Tisch und vier Stühle. Auf dem Balkon stehen zwei Stühle und viele Blumen. Im Sommer frühstücke ich dort gern. Die Miete ist sechshundert Euro warm. Die Wohnung liegt nahe an einer Bushaltestelle. Am Wochenende besuchen uns Freunde, und wir trinken Kaffee im Wohnzimmer. Ich bin sehr zufrieden mit meiner Wohnung.",
        "شقتي ليست كبيرة لكنها مشرقة جداً. فيها غرفتان ومطبخ وحمّام وشرفة صغيرة. في غرفة المعيشة أريكة وطاولة وتلفاز. أنام مع زوجتي في إحدى الغرف. والغرفة الثانية مكتبنا. يدخل ضوء كثير من النوافذ صباحاً. أطبخ كل مساء في المطبخ. وهناك أيضاً طاولة صغيرة وأربعة كراسٍ. في الشرفة كرسيان وكثير من الزهور. أحب تناول الفطور هناك في الصيف. الإيجار الشامل للتدفئة ستمئة يورو. تقع الشقة قرب موقف حافلات. يزورنا أصدقاؤنا في نهاية الأسبوع ونشرب القهوة في غرفة المعيشة. أنا راضٍ جداً عن شقتي.",
    ),
    "t-a1-024": (
        "Ich wohne in Leipzig, einer Stadt im Osten von Deutschland. In der Stadt gibt es viele Parks, Cafés und Geschäfte. Am Wochenende gehe ich gern in die Innenstadt und trinke einen Kaffee mit Freunden. Die Straßenbahn fährt direkt vor meiner Haustür, das ist sehr praktisch. In meiner Straße gibt es auch eine Bäckerei und einen kleinen Supermarkt. Am Morgen kaufe ich dort manchmal frisches Brot. Der Park ist zehn Minuten zu Fuß entfernt. Im Sommer sitzen viele Menschen auf den Bänken. Am Samstag fahre ich mit Freunden in die Stadtmitte. Wir essen in einem Café und gehen danach in ein Geschäft. Am Abend fahre ich mit der Straßenbahn nach Hause. Die Haltestelle ist gleich neben meinem Haus. Leipzig gefällt mir sehr.",
        "أسكن في لايبزيغ، وهي مدينة في شرق ألمانيا. يوجد في المدينة كثير من الحدائق والمقاهي والمحلات. في نهاية الأسبوع أحب الذهاب إلى وسط المدينة وشرب القهوة مع أصدقائي. يمر الترام مباشرة أمام باب بيتي، وهذا عملي جداً. يوجد في شارعي أيضاً مخبز وسوبرماركت صغير. أشتري من المخبز أحياناً خبزاً طازجاً في الصباح. تبعد الحديقة عشر دقائق مشياً. يجلس كثير من الناس على المقاعد في الصيف. يوم السبت أذهب مع أصدقائي إلى وسط المدينة. نأكل في مقهى ثم نذهب إلى متجر. في المساء أعود إلى البيت بالترام. موقف الترام بجانب بيتي مباشرة. تعجبني لايبزيغ جداً.",
    ),
    "t-a1-025": (
        "Heute gehe ich zum Supermarkt. Ich brauche Milch, Brot, Eier, Äpfel und Käse. Der Supermarkt ist groß und hat viele Produkte. Zuerst suche ich die Milch, dann hole ich Brot und Eier. Ich kaufe auch Tomaten und eine Flasche Wasser. Die Äpfel sind heute im Angebot. Ich vergleiche die Preise und nehme eine kleine Tüte mit. Im Laden treffe ich meine Nachbarin. Wir sprechen kurz über das Wetter. Dann gehe ich zur Kasse. Vor mir stehen zwei Personen. Die Verkäuferin sagt: „Guten Tag.“ An der Kasse bezahle ich mit Karte. Sie gibt mir den Kassenbon. Alles kostet zusammen zwölf Euro. Zu Hause stelle ich die Milch und das Wasser in den Kühlschrank. Das Brot kommt in den Schrank.",
        "اليوم أذهب إلى السوبرماركت. أحتاج إلى الحليب والخبز والبيض والتفاح والجبن. المتجر كبير وفيه منتجات كثيرة. أبحث عن الحليب أولاً، ثم آخذ الخبز والبيض. أشتري أيضاً الطماطم وزجاجة ماء. التفاح عليه عرض اليوم. أقارن الأسعار وآخذ كيساً صغيراً معي. ألتقي جارتي في المتجر. نتحدث قليلاً عن الطقس. ثم أذهب إلى الصندوق. يقف أمامي شخصان. تقول البائعة: «مرحباً». أدفع بالبطاقة عند الصندوق وتعطيني الإيصال. المجموع اثنا عشر يورو. في البيت أضع الحليب والماء في الثلاجة، وأضع الخبز في الخزانة.",
    ),
    "t-a1-026": (
        "Heute ist das Wetter sehr schön. Die Sonne scheint und der Himmel ist blau. Es ist nicht zu kalt und nicht zu heiß. Es sind etwa zwanzig Grad. Ich ziehe ein T-Shirt und eine leichte Jacke an. Am Nachmittag gehe ich spazieren und höre Musik. Ich rufe meine Freundin an, und wir treffen uns im Park. Dort sitzen wir auf einer Bank, sprechen und lachen. Wir sehen viele Kinder und einen kleinen Hund. Später kaufen wir ein Eis. Am Abend koche ich zu Hause Nudeln. Danach sehe ich aus dem Fenster: Der Himmel ist noch blau. Ich öffne das Fenster und höre die Vögel. So ein Tag gefällt mir sehr.",
        "الطقس اليوم جميل جداً. الشمس مشرقة والسماء زرقاء. الجو ليس بارداً جداً ولا حاراً جداً. الحرارة نحو عشرين درجة. أرتدي تيشيرت وسترة خفيفة. أتمشى بعد الظهر وأستمع إلى الموسيقى. أتصل بصديقتي ونلتقي في الحديقة. نجلس هناك على مقعد ونتحدث ونضحك. نرى كثيراً من الأطفال وكلباً صغيراً. ثم نشتري بوظة. أطبخ المعكرونة في البيت مساءً. بعد ذلك أنظر من النافذة: ما زالت السماء زرقاء. أفتح النافذة وأسمع العصافير. يعجبني كثيراً يوم كهذا.",
    ),
    "t-a1-027": (
        "Mein Hobby ist Fußball. Jeden Freitagabend spiele ich mit meinen Kollegen. Wir spielen in einer Halle in der Nähe meiner Wohnung. Die Halle ist groß und hat zwei Tore. Wir treffen uns um sieben Uhr. Vor dem Spiel ziehen wir unsere Sportsachen an und trinken Wasser. Dann spielen wir eine Stunde. Ich bin nicht sehr gut, aber ich spiele gern. Mein Freund Paul ist der Torwart und hält viele Bälle. Nach dem Spiel trinken wir zusammen ein Bier. Manchmal sitzen wir noch eine Weile zusammen und sprechen über die Arbeit. Am Samstag bin ich oft müde, aber ich freue mich schon auf das nächste Spiel.",
        "هوايتي كرة القدم. ألعب كل مساء جمعة مع زملائي. نلعب في قاعة قريبة من شقتي. القاعة كبيرة وفيها مرميان. نلتقي الساعة السابعة. قبل المباراة نرتدي ملابس الرياضة ونشرب الماء. ثم نلعب ساعة. لست ماهراً جداً، لكنني أحب اللعب. صديقي بول حارس المرمى ويصدّ كرات كثيرة. نشرب معاً بيرة بعد المباراة. أحياناً نجلس قليلاً ونتحدث عن العمل. أكون متعباً غالباً يوم السبت، لكنني أتطلع إلى المباراة القادمة.",
    ),
    "t-a1-028": (
        "Ich arbeite als Ingenieur in einer kleinen Firma in der Stadt. Die Firma macht Maschinen für Autos. Jeden Tag stehe ich um halb sieben auf und fahre mit dem Bus zur Arbeit. Meine Kollegen sind sehr nett. Ich beginne um acht Uhr. Zuerst lese ich meine E-Mails. Dann spreche ich mit meinem Chef über den Tag. In der Werkstatt prüfen wir die Maschinen. Um zwölf Uhr mache ich eine Pause und esse Brot mit Käse. Am Nachmittag arbeite ich mit einem Kollegen. Manchmal haben wir viel Arbeit, aber mein Beruf gefällt mir. Um fünf Uhr fahre ich nach Hause. Am Wochenende mache ich Sport oder besuche meine Eltern.",
        "أعمل مهندساً في شركة صغيرة في المدينة. تصنع الشركة آلات للسيارات. أستيقظ كل يوم في السادسة والنصف وأذهب بالحافلة إلى العمل. زملائي لطفاء جداً. أبدأ العمل في الثامنة. أقرأ رسائلي الإلكترونية أولاً. ثم أتحدث مع مديري عن يوم العمل. نفحص الآلات في الورشة. آخذ استراحة عند الظهر وآكل خبزاً مع الجبن. أعمل مع زميل بعد الظهر. أحياناً يكون لدينا عمل كثير، لكنني أحب مهنتي. أعود إلى البيت في الخامسة. وفي عطلة نهاية الأسبوع أمارس الرياضة أو أزور والديّ.",
    ),
    "t-a1-029": (
        "Heute trage ich eine blaue Jeans, ein weißes T-Shirt und schwarze Schuhe. Im Winter ziehe ich eine warme Jacke an, manchmal auch einen Schal und Handschuhe. Im Sommer trage ich kurze Hosen und T-Shirts. Zu Hause trage ich gern eine bequeme Hose und ein altes T-Shirt. Für die Arbeit brauche ich keine besondere Kleidung. Am Samstag gehe ich mit meiner Freundin in ein Geschäft. Sie sucht ein Kleid, und ich brauche neue Socken. Im Geschäft probiere ich eine grüne Jacke an. Sie passt gut, aber sie ist ein bisschen teuer. Ich kaufe sie nicht. Am Ende fahren wir mit dem Bus nach Hause.",
        "أرتدي اليوم بنطال جينز أزرق وقميصاً أبيض وحذاءً أسود. أرتدي في الشتاء سترة دافئة، وأحياناً وشاحاً وقفازات أيضاً. ألبس في الصيف سراويل قصيرة وقمصاناً قصيرة الأكمام. أحب في البيت ارتداء بنطال مريح وقميص قديم. لا أحتاج إلى ملابس خاصة للعمل. أذهب يوم السبت مع صديقتي إلى متجر. تبحث هي عن فستان وأحتاج أنا إلى جوارب جديدة. أجرب سترة خضراء في المتجر. إنها تناسبني لكنها غالية قليلاً. لا أشتريها. نعود إلى البيت بالحافلة في النهاية.",
    ),
    "t-a1-030": (
        "Heute bin ich beim Arzt. Ich habe seit zwei Tagen Kopfschmerzen. Die Ärztin fragt: „Was tut weh?“ Ich antworte: „Mein Kopf tut weh und ich habe ein bisschen Fieber.“ Sie untersucht mich und sagt: „Das ist eine Erkältung. Trinken Sie viel Wasser und ruhen Sie sich aus.“ In der Praxis warten noch drei Personen. Ich sitze im Wartezimmer und lese eine Zeitschrift. Nach zwanzig Minuten ruft mich die Ärztin. Sie fragt: „Haben Sie auch Husten?“ Ich sage: „Ein wenig, aber mein Hals tut nicht weh.“ Sie misst meine Temperatur. Dann schreibt sie ein Rezept. In der Apotheke kaufe ich die Tabletten. Zu Hause trinke ich Wasser und gehe früh schlafen. Am nächsten Morgen geht es mir besser.",
        "أنا في عيادة الطبيبة اليوم. أعاني من الصداع منذ يومين. تسأل الطبيبة: «ماذا يؤلمك؟» أجيب: «رأسي يؤلمني وعندي حمى خفيفة.» تفحصني وتقول: «إنها نزلة برد. اشرب الكثير من الماء واسترح.» ينتظر ثلاثة أشخاص آخرون في العيادة. أجلس في غرفة الانتظار وأقرأ مجلة. تناديني الطبيبة بعد عشرين دقيقة. تسأل: «هل لديك سعال أيضاً؟» أقول: «قليلاً، لكن حلقي لا يؤلمني.» تقيس حرارتي. ثم تكتب وصفة. أشتري الأقراص من الصيدلية. أشرب الماء في البيت وأذهب إلى النوم باكراً. أشعر بتحسن في صباح اليوم التالي.",
    ),
    "t-a1-031": (
        "Ich habe eine kleine Katze. Sie heißt Mimi und ist zwei Jahre alt. Sie ist schwarz-weiß und sehr süß. Jeden Morgen gebe ich ihr Futter und frisches Wasser. Am Abend spielt sie gern mit einem roten Ball. Wenn ich nach Hause komme, wartet sie schon vor der Tür. Am Morgen sitzt sie oft am Fenster und sieht die Vögel im Garten. Nach der Arbeit spiele ich zehn Minuten mit ihr. Dann schläft sie gern auf dem Sofa. Am Wochenende putze ich ihr Körbchen und fülle ihren Napf mit Wasser. Meine Familie mag Mimi auch. Wir lachen oft, wenn sie schnell durch die Wohnung läuft. Für uns ist sie ein liebes Tier.",
        "عندي قطة صغيرة. اسمها ميمي وعمرها سنتان. لونها أسود وأبيض وهي لطيفة جداً. أعطيها الطعام والماء العذب كل صباح. تحب اللعب بكرة حمراء في المساء. تنتظرني أمام الباب عندما أعود إلى البيت. تجلس غالباً عند النافذة صباحاً وتنظر إلى الطيور في الحديقة. ألعب معها عشر دقائق بعد العمل. ثم تحب النوم على الأريكة. أنظف سلّتها في نهاية الأسبوع وأملأ وعاءها بالماء. تحب عائلتي ميمي أيضاً. كثيراً ما نضحك عندما تركض بسرعة في الشقة. إنها حيوان أليف عزيز علينا.",
    ),
    "t-a1-032": (
        "Am Wochenende schlafe ich länger als in der Woche. Am Samstag stehe ich um neun Uhr auf. Zuerst frühstücke ich und höre Musik. Dann putze ich die Wohnung und kaufe ein. Im Supermarkt kaufe ich Brot, Milch und Obst. Am Nachmittag treffe ich meine Freunde. Wir spielen Karten bei mir zu Hause und sprechen viel. Am Sonntag besuche ich meine Familie. Wir essen zusammen zu Mittag. Manchmal schaue ich am Abend einen Film. Am Sonntagabend koche ich etwas Leckeres. Danach bereite ich meine Sachen für Montag vor. Ich packe meine Tasche und stelle den Wecker. So beginnt die neue Woche ruhig.",
        "أنام مدة أطول في عطلة نهاية الأسبوع مقارنة بأيام الأسبوع. أستيقظ يوم السبت في التاسعة. أفطر أولاً وأستمع إلى الموسيقى. ثم أنظف الشقة وأتسوق. أشتري الخبز والحليب والفاكهة من السوبرماركت. ألتقي أصدقائي بعد الظهر. نلعب الورق في بيتي ونتحدث كثيراً. أزور عائلتي يوم الأحد. نتناول الغداء معاً. أحياناً أشاهد فيلماً مساءً. أطبخ شيئاً لذيذاً مساء الأحد. بعد ذلك أجهز أشيائي ليوم الاثنين. أجهّز حقيبتي وأضبط المنبه. هكذا يبدأ الأسبوع الجديد بهدوء.",
    ),
    "t-a1-033": (
        "Zum Frühstück esse ich gern Brot mit Marmelade und trinke Kaffee. Am Morgen habe ich genug Zeit. Manchmal esse ich auch ein Ei. Zum Mittagessen gehe ich in die Kantine. Dort gibt es Fleisch mit Kartoffeln und Gemüse. An einem Tisch am Fenster esse ich oft mit meinen Kollegen. Nach dem Essen gehe ich kurz nach draußen. Zum Abendessen koche ich zu Hause Nudeln mit Tomatensauce oder Reis mit Gemüse. Am Samstag lade ich manchmal Freunde ein. Dann kochen wir zusammen und essen lange. Ich trinke viel Wasser und manchmal Apfelsaft. Nach dem Abendessen mache ich gern einen Tee.",
        "أحب تناول الخبز بالمربى وشرب القهوة على الفطور. لدي وقت كافٍ في الصباح. أتناول بيضة أحياناً أيضاً. أذهب إلى المقصف لتناول الغداء. يوجد هناك لحم مع البطاطس والخضار. غالباً ما آكل مع زملائي على طاولة قرب النافذة. أخرج قليلاً بعد الطعام. أطبخ المعكرونة بصلصة الطماطم أو الأرز بالخضار للعشاء في البيت. أدعو أصدقاء أحياناً يوم السبت. نطبخ معاً ونتناول الطعام على مهل. أشرب ماءً كثيراً وأحياناً عصير التفاح. أحب إعداد الشاي بعد العشاء.",
    ),
    "t-a1-034": (
        "„Entschuldigung, wo ist der Bahnhof?“ – „Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab. Gehen Sie am Park und an einer Bäckerei vorbei. Nach etwa zweihundert Metern sehen Sie den Bahnhof auf der rechten Seite. Vor dem Bahnhof ist ein kleiner Platz. Auf dem Platz gibt es mehrere Bänke. Zu Fuß brauchen Sie etwa fünf Minuten. Alternativ nehmen Sie die Buslinie drei. Die Bushaltestelle ist direkt neben der Apotheke.“ – „Fährt der Bus direkt zum Bahnhof?“ – „Ja, genau.“ – „Vielen Dank!“ – „Bitte schön. Gute Fahrt!“",
        "«عفواً، أين محطة القطار؟» – «سر مباشرة حتى الإشارة الضوئية. انعطف يساراً هناك. مرّ بالحديقة وبالمخبز. بعد نحو مئتي متر سترى محطة القطار على يمينك. توجد ساحة صغيرة أمام المحطة وفيها عدة مقاعد. تحتاج إلى نحو خمس دقائق سيراً على الأقدام. يمكنك أيضاً ركوب الحافلة رقم ثلاثة. موقف الحافلة بجانب الصيدلية مباشرة.» – «هل تذهب الحافلة مباشرة إلى محطة القطار؟» – «نعم، بالضبط.» – «شكراً جزيلاً!» – «على الرحب والسعة. رحلة موفقة!»",
    ),
    "t-a1-035": (
        "Heute habe ich Geburtstag und bin dreißig Jahre alt. Ich habe sechs Freunde zum Geburtstag eingeladen. Sie kommen am Nachmittag um vier Uhr. Sie bringen Geschenke: ein Buch, eine Flasche Wein und eine Karte. Meine Frau hat einen Kuchen gebacken. Wir essen zusammen Kuchen und trinken Kaffee. Es ist ein schöner Tag und ich bin sehr glücklich. Auf dem Tisch stehen Teller, Tassen und Saft. Meine Mutter ruft an und gratuliert mir. Danach spielen wir ein Spiel und hören Musik. Ein Freund bringt auch Blumen mit. Wir machen ein Foto im Garten. Am Abend gehen meine Freunde nach Hause. Ich räume die Tassen weg. Ich bin müde, aber zufrieden.",
        "اليوم عيد ميلادي وأتمّ الثلاثين من عمري. دعوت ستة أصدقاء إلى عيد ميلادي. يأتون في الرابعة بعد الظهر. يجلبون هدايا: كتاباً وزجاجة نبيذ وبطاقة تهنئة. خبزت زوجتي كعكة. نأكل الكعكة معاً ونشرب القهوة. إنه يوم جميل وأنا سعيد جداً. على الطاولة صحون وفناجين وعصير. تتصل أمي وتهنئني. بعد ذلك نلعب لعبة ونستمع إلى الموسيقى. يجلب أحد أصدقائي باقة زهور أيضاً. نلتقط صورة في الحديقة. يعود أصدقائي إلى بيوتهم مساءً. أرتب الفناجين. أنا متعب لكنني راضٍ.",
    ),
}


TITLES_AR = {
    "t-a1-021": "عائلتي",
    "t-a1-022": "صباحي",
    "t-a1-023": "شقتي",
    "t-a1-024": "في المدينة",
    "t-a1-025": "في السوبرماركت",
    "t-a1-026": "طقس اليوم",
    "t-a1-027": "هوايتي: كرة القدم",
    "t-a1-028": "مهنتي",
    "t-a1-029": "ملابسي",
    "t-a1-030": "عند الطبيبة",
    "t-a1-031": "حيواني الأليف",
    "t-a1-032": "عطلة نهاية الأسبوع",
    "t-a1-033": "الطعام والشراب",
    "t-a1-034": "الطريق إلى محطة القطار",
    "t-a1-035": "عيد ميلادي",
}


def words(text: str) -> int:
    return len(re.findall(r"\S+", text.strip()))


def main() -> None:
    texts = json.loads(DATA.read_text(encoding="utf-8"))
    by_id = {t["id"]: t for t in texts}
    assert set(UPDATES).issubset(by_id), "A1-Text-ID fehlt"

    for text_id, (de, ar) in UPDATES.items():
        record = by_id[text_id]
        record["de"] = de
        record["ar"] = ar
        record["titleAr"] = TITLES_AR[text_id]
        record["notes"] = "R138/P-11: A1-Lesetext, in R142 auf 90–160 Wörter erweitert."
        assert record["level"] == "A1", text_id
        count = words(de)
        record["wordCountDe"] = count
        assert 90 <= count <= 160, f"{text_id}: {count} Wörter"
        assert ar.strip(), f"{text_id}: arabische Übersetzung fehlt"

    questions = {
        "t-a1-021-q1": {
            "explanationAr": "الدليل في النص: «Ich wohne in Köln mit meiner Frau Amina. Unsere Tochter Sara ist drei Jahre alt.» — يعيش كريم مع زوجته أمينة وابنته سارة.",
        },
        "t-a1-026-q2": {
            "promptDe": "Was mache ich am Nachmittag?",
            "options": ["Ich gehe spazieren und höre Musik", "Ich arbeite im Büro", "Ich besuche einen Arzt"],
            "answer": "Ich gehe spazieren und höre Musik",
            "explanationAr": "الدليل في النص: «Am Nachmittag gehe ich spazieren und höre Musik.» — يقول المتحدث إنه يتمشّى ويستمع إلى الموسيقى بعد الظهر.",
        },
        "t-a1-032-q1": {
            "explanationAr": "الدليل في النص: «Dann putze ich die Wohnung und kaufe ein.» — ينظف الشقة ويتسوق بعد الإفطار يوم السبت.",
        },
        "t-a1-032-q2": {
            "options": ["Sie kocht und bereitet ihre Sachen für Montag vor", "Sie geht ins Kino", "Sie arbeitet im Supermarkt"],
            "answer": "Sie kocht und bereitet ihre Sachen für Montag vor",
            "explanationAr": "الدليل في النص: «Danach bereite ich meine Sachen für Montag vor.» — تحضّر أشياءها ليوم الاثنين بعد أن تطهو.",
        },
        "t-a1-035-q2": {
            "promptDe": "Wer hat den Kuchen gebacken?",
            "options": ["Die Ehefrau", "Der Vater", "Ein Freund"],
            "answer": "Die Ehefrau",
            "explanationAr": "الدليل في النص: «Meine Frau hat einen Kuchen gebacken.» — زوجة المتحدث خبزت الكعكة.",
        },
    }
    by_question = {q["id"]: q for t in texts for q in t.get("questions", [])}
    assert set(questions).issubset(by_question), "Lesefrage fehlt"
    for question_id, fields in questions.items():
        q = by_question[question_id]
        q.update(fields)
        assert q["answer"] in q["options"], question_id

    DATA.write_text(json.dumps(texts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("R142 A1-Lesetexte erweitert und Fragen abgeglichen:")
    for text_id, (de, _) in UPDATES.items():
        print(f"  {text_id}: {words(de)} Wörter")


if __name__ == "__main__":
    main()
