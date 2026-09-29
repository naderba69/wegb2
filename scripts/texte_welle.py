#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ثمانيةُ نصوصِ قراءةٍ جديدة (٢ لكلِّ مستوى) بأسئلةٍ مصحَّحةٍ ذاتياً وشرحٍ عربيّ."""
import json

P = "content/texts.json"

NEU = [
{"id":"t-a1-19","level":"A1","titleDe":"Mein Wochenende","titleAr":"عطلةُ أسبوعي",
 "de":"Am Samstag stehe ich spät auf. Ich frühstücke mit meiner Familie: Brot, Käse und Tee. Danach gehe ich auf den Markt und kaufe Obst und Gemüse. Am Nachmittag besuche ich meinen Freund Karim. Wir spielen Fußball im Park. Am Abend bin ich müde, aber glücklich. Am Sonntag lerne ich zwei Stunden Deutsch und rufe meine Mutter an.",
 "ar":"يومَ السبتِ أنهضُ متأخِّراً. أفطرُ مع عائلتي: خبزٌ وجبنٌ وشاي. ثمَّ أذهبُ إلى السوقِ وأشتري فاكهةً وخضاراً. بعدَ الظهرِ أزورُ صديقي كريم. نلعبُ كرةَ القدمِ في المنتزه. مساءً أكونُ متعباً لكنّي سعيد. يومَ الأحدِ أدرسُ الألمانيةَ ساعتَينِ وأتّصلُ بأمّي.",
 "questions":[
  {"id":"t-a1-19-q1","type":"mc","promptDe":"Was macht er am Samstagnachmittag?","options":["Er lernt Deutsch","Er besucht seinen Freund","Er schläft"],"answer":"Er besucht seinen Freund","explanationAr":"«Am Nachmittag besuche ich meinen Freund Karim.»"},
  {"id":"t-a1-19-q2","type":"fi","promptDe":"Am Sonntag lernt er ___ Stunden Deutsch.","answer":"zwei","explanationAr":"في النصّ: «Am Sonntag lerne ich zwei Stunden Deutsch»."},
  {"id":"t-a1-19-q3","type":"mc","promptDe":"Wo spielen sie Fußball?","options":["im Park","in der Schule","zu Hause"],"answer":"im Park","explanationAr":"«Wir spielen Fußball im Park.» — im Park حالةُ داتيف لأنَّ السؤالَ «أين»."}]},

{"id":"t-a1-20","level":"A1","titleDe":"Beim Arzt","titleAr":"عندَ الطبيب",
 "de":"Heute gehe ich zum Arzt. Ich habe seit gestern Kopfschmerzen und ein bisschen Fieber. Die Praxis öffnet um acht Uhr. An der Rezeption zeige ich meine Versichertenkarte. Ich warte zwanzig Minuten. Der Arzt sagt: Sie haben eine Erkältung. Trinken Sie viel Wasser und schlafen Sie genug. Er schreibt ein Rezept. In der Apotheke kaufe ich Tabletten.",
 "ar":"اليومَ أذهبُ إلى الطبيب. لديَّ صداعٌ منذُ أمسٍ وحمّى خفيفة. العيادةُ تفتحُ الثامنة. في الاستقبالِ أُظهِرُ بطاقةَ التأمين. أنتظرُ عشرينَ دقيقة. يقولُ الطبيب: عندكَ نزلةُ برد. اشربْ ماءً كثيراً ونمْ كفايةً. يكتبُ وصفة. في الصيدليةِ أشتري حبوباً.",
 "questions":[
  {"id":"t-a1-20-q1","type":"mc","promptDe":"Was hat er?","options":["Zahnschmerzen","eine Erkältung","einen Unfall"],"answer":"eine Erkältung","explanationAr":"«Sie haben eine Erkältung.»"},
  {"id":"t-a1-20-q2","type":"fi","promptDe":"Er zeigt an der Rezeption seine ___.","answer":"Versichertenkarte","explanationAr":"بطاقةُ التأمينِ الصحّيِّ تُطلَبُ في كلِّ عيادةٍ ألمانية."},
  {"id":"t-a1-20-q3","type":"mc","promptDe":"Wie lange wartet er?","options":["zwanzig Minuten","zwei Stunden","acht Minuten"],"answer":"zwanzig Minuten","explanationAr":"«Ich warte zwanzig Minuten.»"}]},

{"id":"t-a2-19","level":"A2","titleDe":"Die Wohnungsbesichtigung","titleAr":"معاينةُ الشقّة",
 "de":"Gestern hatte ich eine Wohnungsbesichtigung. Die Wohnung liegt im dritten Stock, ohne Aufzug. Sie hat zwei Zimmer, eine kleine Küche und einen Balkon. Die Kaltmiete beträgt 520 Euro, dazu kommen 130 Euro Nebenkosten. Die Kaution sind zwei Monatsmieten. Der Vermieter war freundlich, aber es waren zwölf Interessenten da. Heute Abend schicke ich meine Unterlagen per E-Mail. Hoffentlich bekomme ich eine Zusage.",
 "ar":"أمسِ كانت لي معاينةُ شقّة. الشقّةُ في الطابقِ الثالثِ بلا مصعد. فيها غرفتانِ ومطبخٌ صغيرٌ وشرفة. الإيجارُ الصافي 520 يورو تُضافُ إليه 130 تكاليفَ جانبية. الضمانُ إيجارُ شهرَين. كانَ المؤجِّرُ لطيفاً لكنْ حضرَ اثنا عشرَ راغباً. هذا المساءَ أُرسِلُ وثائقي بالبريد. عسى أن أحصلَ على موافقة.",
 "questions":[
  {"id":"t-a2-19-q1","type":"fi","promptDe":"Die Warmmiete beträgt zusammen ___ Euro.","answer":"650","explanationAr":"520 صافٍ + 130 جانبية = 650؛ وهذا هو الفرقُ العمليُّ بينَ Kaltmiete وWarmmiete."},
  {"id":"t-a2-19-q2","type":"mc","promptDe":"Wie hoch ist die Kaution?","options":["520 Euro","1040 Euro","130 Euro"],"answer":"1040 Euro","explanationAr":"«zwei Monatsmieten» أي ضِعفُ الإيجارِ الصافي 520."},
  {"id":"t-a2-19-q3","type":"mc","promptDe":"Warum ist die Chance klein?","options":["Die Wohnung ist teuer","Es gab zwölf Interessenten","Der Vermieter war unfreundlich"],"answer":"Es gab zwölf Interessenten","explanationAr":"«es waren zwölf Interessenten da»."}]},

{"id":"t-a2-20","level":"A2","titleDe":"Ein Missverständnis im Büro","titleAr":"سوءُ فهمٍ في المكتب",
 "de":"Am Montag sollte ich den Bericht abgeben. Ich hatte verstanden, dass die Frist am Mittwoch endet. Deshalb war der Bericht noch nicht fertig. Meine Kollegin sagte mir: Der Chef wartet seit heute Morgen. Ich habe mich sofort entschuldigt und erklärt, warum ich mich geirrt habe. Der Chef war ruhig. Wir haben vereinbart, dass ich ihm den Bericht bis achtzehn Uhr schicke. Seitdem schreibe ich mir jede Frist in den Kalender.",
 "ar":"يومَ الإثنينِ كانَ عليَّ تسليمُ التقرير. كنتُ فهمتُ أنَّ المهلةَ تنتهي الأربعاء. لذلك لم يكنِ التقريرُ جاهزاً. قالت لي زميلتي: المديرُ ينتظرُ منذُ الصباح. اعتذرتُ فوراً وشرحتُ سببَ خطئي. كانَ المديرُ هادئاً. اتّفقنا أن أُرسِلَ لهُ التقريرَ حتى السادسةَ مساءً. ومنذُ ذلك الحينِ أكتبُ كلَّ مهلةٍ في التقويم.",
 "questions":[
  {"id":"t-a2-20-q1","type":"mc","promptDe":"Warum war der Bericht nicht fertig?","options":["Er hatte keine Zeit","Er hatte die Frist falsch verstanden","Der Chef war krank"],"answer":"Er hatte die Frist falsch verstanden","explanationAr":"«Ich hatte verstanden, dass die Frist am Mittwoch endet» — ماضٍ أسبق Plusquamperfekt."},
  {"id":"t-a2-20-q2","type":"fi","promptDe":"Er schickt den Bericht bis ___ Uhr.","answer":"achtzehn","explanationAr":"«bis achtzehn Uhr» أي السادسةَ مساءً."},
  {"id":"t-a2-20-q3","type":"mc","promptDe":"Was macht er jetzt immer?","options":["Er fragt den Chef","Er schreibt jede Frist in den Kalender","Er kommt früher"],"answer":"Er schreibt jede Frist in den Kalender","explanationAr":"«Seitdem schreibe ich mir jede Frist in den Kalender.»"}]},

{"id":"t-b1-19","level":"B1","titleDe":"Ehrenamt: Zeit statt Geld","titleAr":"التطوُّع: وقتٌ بدلَ المال",
 "de":"In Deutschland engagieren sich Millionen Menschen ehrenamtlich, also ohne Bezahlung. Sie trainieren Kindermannschaften, begleiten alte Menschen oder geben Sprachkurse. Viele sagen, das Ehrenamt gebe ihnen mehr, als es koste: neue Kontakte, Anerkennung und das Gefühl, gebraucht zu werden. Kritiker weisen allerdings darauf hin, dass der Staat sich auf diese Hilfe verlässt und dadurch Stellen spart. Fest steht: Ohne Ehrenamt würden viele Vereine schließen müssen.",
 "ar":"في ألمانيا يتطوَّعُ ملايينُ الناسِ بلا أجر: يدرّبونَ فرقَ الأطفال، ويرافقونَ المسنّين، ويعطونَ دوراتٍ لغوية. يقولُ كثيرونَ إنَّ التطوُّعَ يمنحُهم أكثرَ ممّا يكلّفُهم: علاقاتٌ جديدةٌ وتقديرٌ وشعورٌ بأنّهم مطلوبون. غيرَ أنَّ نقّاداً ينبّهونَ إلى أنَّ الدولةَ تتّكلُ على هذه المساعدةِ فتوفّرُ وظائف. والثابتُ أنَّ جمعياتٍ كثيرةً كانت ستُغلَقُ لولا التطوُّع.",
 "questions":[
  {"id":"t-b1-19-q1","type":"mc","promptDe":"Was bedeutet „ehrenamtlich“ hier?","options":["gut bezahlt","ohne Bezahlung","nur für Rentner"],"answer":"ohne Bezahlung","explanationAr":"النصُّ يفسّرُها بنفسِه: «also ohne Bezahlung»."},
  {"id":"t-b1-19-q2","type":"mc","promptDe":"Was kritisieren manche?","options":["Der Staat spart dadurch Stellen","Die Vereine zahlen zu viel","Es gibt zu wenige Freiwillige"],"answer":"Der Staat spart dadurch Stellen","explanationAr":"«der Staat … spart dadurch Stellen»."},
  {"id":"t-b1-19-q3","type":"fi","promptDe":"Ohne Ehrenamt ___ viele Vereine schließen müssen.","answer":"würden","explanationAr":"شرطٌ غيرُ واقعيّ: Konjunktiv II بـwürden + مصدر."}]},

{"id":"t-b1-20","level":"B1","titleDe":"Umzug in eine andere Stadt","titleAr":"الانتقالُ إلى مدينةٍ أخرى",
 "de":"Als mir die Firma eine Stelle in Leipzig anbot, musste ich schnell entscheiden. Einerseits war das Gehalt besser, andererseits lebten meine Freunde alle in Köln. Nachdem ich zwei Wochen nachgedacht hatte, sagte ich zu. Der Umzug war anstrengend: Wohnungssuche, Ummeldung beim Amt, neuer Arzt, neue Wege. Heute, ein Jahr später, bereue ich nichts. Ich habe gelernt, dass man sich schneller an Neues gewöhnt, als man denkt.",
 "ar":"لمّا عرضت عليَّ الشركةُ وظيفةً في لايبزيغ كانَ عليَّ أن أقرّرَ سريعاً. من جهةٍ كانَ الراتبُ أفضل، ومن جهةٍ أخرى كانَ أصدقائي كلُّهم في كولونيا. بعدَ أن فكَّرتُ أسبوعَين وافقت. كانَ الانتقالُ مُتعِباً: بحثٌ عن سكن، تسجيلٌ في البلدية، طبيبٌ جديد، طرقٌ جديدة. واليومَ بعدَ سنةٍ لا أندمُ على شيء. تعلَّمتُ أنَّ المرءَ يعتادُ الجديدَ أسرعَ ممّا يظن.",
 "questions":[
  {"id":"t-b1-20-q1","type":"fi","promptDe":"___ ich zwei Wochen nachgedacht hatte, sagte ich zu.","answer":"Nachdem","explanationAr":"Nachdem مع الماضي الأسبق (hatte nachgedacht) ثمَّ الماضي البسيط — تسلسلُ الزمنَين."},
  {"id":"t-b1-20-q2","type":"mc","promptDe":"Was war ein Nachteil?","options":["Das Gehalt","Die Freunde blieben in Köln","Die neue Firma"],"answer":"Die Freunde blieben in Köln","explanationAr":"«andererseits lebten meine Freunde alle in Köln»."},
  {"id":"t-b1-20-q3","type":"mc","promptDe":"Wie beurteilt er den Umzug heute?","options":["Er bereut ihn","Er bereut nichts","Er will zurück"],"answer":"Er bereut nichts","explanationAr":"«bereue ich nichts»."}]},

{"id":"t-b2-19","level":"B2","titleDe":"Fachkräftemangel: Ursachen und Wege","titleAr":"نقصُ الكفاءات: الأسبابُ والمسالك",
 "de":"Der viel diskutierte Fachkräftemangel lässt sich nicht auf eine einzige Ursache zurückführen. Zum einen geht die Zahl der Erwerbstätigen demografisch bedingt zurück, zum anderen passen Ausbildung und Nachfrage immer seltener zusammen. Hinzu kommt, dass die von Unternehmen geforderte Mobilität vielen Familien kaum zuzumuten ist. Zwar wirbt man verstärkt um Zuwanderung, doch ohne beschleunigte Anerkennungsverfahren bleibt deren Wirkung begrenzt. Ökonomen zufolge wäre eine Kombination aus Qualifizierung, Digitalisierung und gezielter Einwanderung am wirksamsten.",
 "ar":"لا يمكنُ إرجاعُ نقصِ الكفاءاتِ المتداوَلِ كثيراً إلى سببٍ واحد. فمن جهةٍ يتراجعُ عددُ العاملينَ لأسبابٍ ديموغرافية، ومن جهةٍ أخرى قلَّما يتطابقُ التكوينُ مع الطلب. يُضافُ أنَّ التنقُّلَ الذي تطلبُهُ الشركاتُ يصعبُ تحميلُهُ لأُسَرٍ كثيرة. وصحيحٌ أنَّ الاستقطابَ من الخارجِ يتزايد، لكنْ بلا تسريعِ إجراءاتِ الاعترافِ يبقى أثرُهُ محدوداً. وبحسبِ اقتصاديّينَ فإنَّ مزيجاً من التأهيلِ والرقمنةِ والهجرةِ الموجَّهةِ هو الأنجع.",
 "questions":[
  {"id":"t-b2-19-q1","type":"mc","promptDe":"Welche Struktur trägt „die von Unternehmen geforderte Mobilität“?","options":["Relativsatz","Partizip-Attribut","Konjunktiv I"],"answer":"Partizip-Attribut","explanationAr":"صفةٌ اسميةٌ ممتدّةٌ ببناءِ Partizip II داخلَ المجموعةِ الاسمية — بديلٌ مختصَرٌ لجملةِ وصل."},
  {"id":"t-b2-19-q2","type":"fi","promptDe":"Ökonomen ___ wäre eine Kombination am wirksamsten.","answer":"zufolge","explanationAr":"zufolge حرفٌ يأتي بعدَ الاسمِ ويجرُّهُ بالداتيف: «Ökonomen zufolge»."},
  {"id":"t-b2-19-q3","type":"mc","promptDe":"Was schwächt die Wirkung der Zuwanderung?","options":["fehlende Sprache","langsame Anerkennungsverfahren","niedrige Löhne"],"answer":"langsame Anerkennungsverfahren","explanationAr":"«ohne beschleunigte Anerkennungsverfahren bleibt deren Wirkung begrenzt»."}]},

{"id":"t-b2-20","level":"B2","titleDe":"Wohnraum in Ballungsräumen","titleAr":"السكنُ في المناطقِ المكتظّة",
 "de":"Dass Wohnen in Großstädten zunehmend unbezahlbar wird, bestreitet kaum jemand. Strittig ist hingegen, welche Instrumente greifen. Befürworter einer Mietpreisbremse argumentieren, sie schütze Bestandsmieter; Kritiker halten dagegen, dass sie Investitionen hemme und den Leerstand nicht verringere. Würde man stattdessen konsequent Bauland ausweisen, ließe sich das Angebot mittelfristig erhöhen. Allerdings ist auch das kein Selbstläufer: Ohne Infrastruktur entstehen Quartiere, in denen niemand wohnen möchte.",
 "ar":"قلَّما يُنكِرُ أحدٌ أنَّ السكنَ في المدنِ الكبرى صارَ فوقَ الطاقة. لكنَّ الخلافَ في الأدواتِ الناجعة. يحتجُّ أنصارُ كابحِ الإيجاراتِ بأنَّهُ يحمي المستأجرينَ القدامى، ويردُّ النقّادُ بأنَّهُ يكبحُ الاستثمارَ ولا يقلّلُ الشغور. ولو خُصِّصَت أراضي البناءِ بحزمٍ لأمكنَ رفعُ العرضِ في المدى المتوسّط. غيرَ أنَّ هذا أيضاً ليسَ تلقائياً: فبلا بنيةٍ تحتيةٍ تنشأُ أحياءٌ لا يرغبُ أحدٌ في سكناها.",
 "questions":[
  {"id":"t-b2-20-q1","type":"fi","promptDe":"___ man stattdessen Bauland ausweisen, ließe sich das Angebot erhöhen.","answer":"Würde","explanationAr":"شرطٌ بلا wenn: الفعلُ المساعدُ يتصدَّرُ الجملةَ (Würde man …, ließe sich …)."},
  {"id":"t-b2-20-q2","type":"mc","promptDe":"Was sagen die Kritiker der Mietpreisbremse?","options":["Sie schützt Mieter","Sie hemmt Investitionen","Sie senkt die Mieten stark"],"answer":"Sie hemmt Investitionen","explanationAr":"«Kritiker halten dagegen, dass sie Investitionen hemme» — Konjunktiv I في الكلامِ المنقول."},
  {"id":"t-b2-20-q3","type":"mc","promptDe":"Welche Bedingung nennt der letzte Satz?","options":["ohne Infrastruktur keine attraktiven Quartiere","ohne Mieter kein Bau","ohne Investoren keine Stadt"],"answer":"ohne Infrastruktur keine attraktiven Quartiere","explanationAr":"«Ohne Infrastruktur entstehen Quartiere, in denen niemand wohnen möchte.»"}]},
]

def main():
    t = json.load(open(P, encoding="utf8"))
    ids = {x["id"] for x in t}
    fragen = {q["id"] for x in t for q in x["questions"]}
    for n in NEU:
        assert n["id"] not in ids, n["id"]
        for q in n["questions"]:
            assert q["id"] not in fragen, q["id"]
        t.append(n)
    json.dump(t, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    import collections
    print("النصوصُ الآن:", len(t), dict(collections.Counter(x["level"] for x in t)),
          "| الأسئلة:", sum(len(x["questions"]) for x in t))

if __name__ == "__main__":
    main()
