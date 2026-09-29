#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ثمانيةُ حواراتٍ جديدة (٢ لكلِّ مستوى) بأسئلةٍ وإملاءٍ — مواقفُ لم يغطِّها البنكُ بعد."""
import json

P = "content/dialogues.json"

def L(w, de, ar): return {"who": w, "de": de, "ar": ar}

NEU = [
{"id":"d-a1-31","level":"A1","titleDe":"An der Rezeption","titleAr":"في الاستقبال",
 "lines":[
  L("Empfang","Guten Morgen! Haben Sie einen Termin?","صباحَ الخير! ألديكَ موعد؟"),
  L("Rami","Ja, um neun Uhr bei Frau Bauer.","نعم، التاسعةَ عندَ السيدةِ باور."),
  L("Empfang","Wie ist Ihr Name, bitte?","ما اسمُكَ من فضلك؟"),
  L("Rami","Rami Haddad. Ich buchstabiere: H-A-D-D-A-D.","رامي حدّاد. أتهجّى: ها-ألف-دال-دال-ألف-دال."),
  L("Empfang","Danke. Nehmen Sie bitte im Wartezimmer Platz.","شكراً. تفضَّلْ بالجلوسِ في غرفةِ الانتظار.")],
 "questions":[
  {"id":"d-a1-31-q1","type":"mc","promptDe":"Wann ist der Termin?","options":["um acht Uhr","um neun Uhr","um zehn Uhr"],"answer":"um neun Uhr","explanationAr":"في النصِّ حرفياً: «Ja, um neun Uhr bei Frau Bauer.»"},
  {"id":"d-a1-31-q2","type":"fill","promptDe":"Nehmen Sie bitte im ___ Platz.","answer":["Wartezimmer"],"explanationAr":"«im Wartezimmer Platz nehmen» = يجلسُ في غرفةِ الانتظار؛ عبارةٌ ثابتةٌ في كلِّ عيادة."}],
 "dictation":["Haben Sie einen Termin?","Wie ist Ihr Name, bitte?","Nehmen Sie bitte Platz."]},

{"id":"d-a1-32","level":"A1","titleDe":"Nach dem Weg fragen","titleAr":"السؤالُ عن الطريق",
 "lines":[
  L("Lena","Entschuldigung, wo ist die Post?","معذرةً، أينَ مكتبُ البريد؟"),
  L("Passant","Gehen Sie geradeaus bis zur Ampel.","امشِ مباشرةً حتى الإشارة."),
  L("Lena","Und dann?","ثمَّ؟"),
  L("Passant","Dann rechts. Die Post ist neben der Bank.","ثمَّ يميناً. البريدُ بجانبِ البنك."),
  L("Lena","Ist das weit?","أهوَ بعيد؟"),
  L("Passant","Nein, fünf Minuten zu Fuß.","لا، خمسُ دقائقَ مشياً.")],
 "questions":[
  {"id":"d-a1-32-q1","type":"mc","promptDe":"Wo ist die Post?","options":["neben der Bank","hinter der Schule","vor dem Kino"],"answer":"neben der Bank","explanationAr":"«Die Post ist neben der Bank» — neben معَ الداتيف لأنَّ السؤالَ «أين»."},
  {"id":"d-a1-32-q2","type":"fill","promptDe":"Gehen Sie ___ bis zur Ampel.","answer":["geradeaus"],"explanationAr":"geradeaus = إلى الأمامِ مباشرة."}],
 "dictation":["Wo ist die Post?","Gehen Sie geradeaus.","Es sind fünf Minuten zu Fuß."]},

{"id":"d-a2-31","level":"A2","titleDe":"Eine Reklamation","titleAr":"شكوى على سلعة",
 "lines":[
  L("Kundin","Guten Tag. Ich habe diesen Wasserkocher vorgestern gekauft, aber er funktioniert nicht.","مساءَ الخير. اشتريتُ هذه الغلّايةَ أوّلَ أمسٍ لكنّها لا تعمل."),
  L("Verkäufer","Das tut mir leid. Haben Sie den Kassenbon dabei?","يؤسفُني. أمعكَ إيصالُ الشراء؟"),
  L("Kundin","Ja, hier. Ich hätte gern mein Geld zurück.","نعم، تفضَّل. أودُّ استردادَ مالي."),
  L("Verkäufer","Innerhalb von vierzehn Tagen ist das kein Problem.","خلالَ أربعةَ عشرَ يوماً لا مشكلة."),
  L("Kundin","Sehr gut. Muss ich etwas unterschreiben?","ممتاز. أعليَّ التوقيعُ على شيء؟"),
  L("Verkäufer","Nur hier unten, dann bekommen Sie den Betrag bar.","هنا في الأسفلِ فقط، ثمَّ تستلمُ المبلغَ نقداً.")],
 "questions":[
  {"id":"d-a2-31-q1","type":"mc","promptDe":"Was möchte die Kundin?","options":["einen Umtausch","ihr Geld zurück","eine Reparatur"],"answer":"ihr Geld zurück","explanationAr":"«Ich hätte gern mein Geld zurück» — صيغةُ طلبٍ مهذّبةٌ بـhätte gern."},
  {"id":"d-a2-31-q2","type":"fill","promptDe":"___ von vierzehn Tagen ist das kein Problem.","answer":["Innerhalb"],"explanationAr":"innerhalb حرفُ جرٍّ يجرُّ بالمضاف: innerhalb von vierzehn Tagen."},
  {"id":"d-a2-31-q3","type":"truefalse","promptDe":"Sie bekommt den Betrag mit Karte.","options":["richtig","falsch"],"answer":"falsch","explanationAr":"في النصِّ: «bekommen Sie den Betrag bar» أي نقداً."}],
 "dictation":["Haben Sie den Kassenbon dabei?","Ich hätte gern mein Geld zurück.","Muss ich etwas unterschreiben?"]},

{"id":"d-a2-32","level":"A2","titleDe":"Krankmeldung beim Chef","titleAr":"إبلاغُ المديرِ بالمرض",
 "lines":[
  L("Amir","Guten Morgen, Herr Weber. Ich bin leider krank geworden.","صباحَ الخير سيد فيبر. للأسفِ مرضت."),
  L("Weber","Das tut mir leid. Was fehlt Ihnen denn?","يؤسفُني. ما الذي تشكوه؟"),
  L("Amir","Ich habe Fieber. Der Arzt hat mich für drei Tage krankgeschrieben.","لديَّ حمّى. أعطاني الطبيبُ إجازةً ثلاثةَ أيام."),
  L("Weber","Dann kurieren Sie sich bitte richtig aus.","إذنْ تعافَ كما ينبغي."),
  L("Amir","Die Krankmeldung schicke ich heute noch per Post.","أُرسِلُ الإجازةَ المرضيةَ اليومَ بالبريد.")],
 "questions":[
  {"id":"d-a2-32-q1","type":"mc","promptDe":"Wie lange ist er krankgeschrieben?","options":["einen Tag","drei Tage","eine Woche"],"answer":"drei Tage","explanationAr":"«für drei Tage krankgeschrieben»."},
  {"id":"d-a2-32-q2","type":"fill","promptDe":"Die ___ schicke ich heute per Post.","answer":["Krankmeldung"],"explanationAr":"Krankmeldung = ورقةُ الإجازةِ المرضيةِ التي تُرسَلُ لصاحبِ العمل."}],
 "dictation":["Ich bin leider krank geworden.","Ich habe Fieber.","Die Krankmeldung schicke ich per Post."]},

{"id":"d-b1-31","level":"B1","titleDe":"Konflikt im Team","titleAr":"نزاعٌ داخلَ الفريق",
 "lines":[
  L("Nadia","Mir ist aufgefallen, dass du die Absprache nicht eingehalten hast.","لاحظتُ أنَّكَ لم تلتزمْ بما اتّفقنا عليه."),
  L("Jonas","Das stimmt, aber ich war unter großem Zeitdruck.","صحيح، لكنّي كنتُ تحتَ ضغطِ وقتٍ شديد."),
  L("Nadia","Das kann ich nachvollziehen. Trotzdem hätte ein kurzer Anruf gereicht.","أتفهَّمُ ذلك. ومع هذا كانت مكالمةٌ قصيرةٌ لتكفي."),
  L("Jonas","Da hast du recht. Ich melde mich beim nächsten Mal früher.","معكِ حق. في المرّةِ القادمةِ أتواصلُ أبكر."),
  L("Nadia","Gut. Dann halten wir das so fest.","حسناً. نثبّتُ الأمرَ هكذا.")],
 "questions":[
  {"id":"d-b1-31-q1","type":"mc","promptDe":"Wie reagiert Nadia auf seine Erklärung?","options":["Sie lehnt sie ab","Sie versteht sie, kritisiert aber trotzdem","Sie ignoriert sie"],"answer":"Sie versteht sie, kritisiert aber trotzdem","explanationAr":"«Das kann ich nachvollziehen. Trotzdem …» — تفهُّمٌ ثمَّ اعتراضٌ بـtrotzdem."},
  {"id":"d-b1-31-q2","type":"fill","promptDe":"___ hätte ein kurzer Anruf gereicht.","answer":["Trotzdem"],"explanationAr":"trotzdem ظرفُ ربطٍ يتصدَّرُ الجملةَ فيقلبُ الترتيبَ: بعدَه الفعلُ مباشرةً."},
  {"id":"d-b1-31-q3","type":"truefalse","promptDe":"Jonas streitet alles ab.","options":["richtig","falsch"],"answer":"falsch","explanationAr":"يقول: «Das stimmt» ثمَّ «Da hast du recht» — يُقِرُّ ولا ينكر."}],
 "dictation":["Du hast die Absprache nicht eingehalten.","Ich war unter großem Zeitdruck.","Ein kurzer Anruf hätte gereicht."]},

{"id":"d-b1-32","level":"B1","titleDe":"Beim Elternabend","titleAr":"في اجتماعِ أولياءِ الأمور",
 "lines":[
  L("Lehrerin","Ihr Sohn arbeitet gut mit, aber er meldet sich selten.","ابنُكَ يشاركُ جيداً لكنّهُ قلَّما يرفعُ يدَه."),
  L("Vater","Zu Hause erzählt er viel. In der Klasse ist er wohl schüchtern.","في البيتِ يحكي كثيراً. في الصفِّ يبدو خجولاً."),
  L("Lehrerin","Das legt sich meistens. Wichtig wäre, dass er öfter laut liest.","هذا يزولُ غالباً. المهمُّ أن يقرأَ بصوتٍ عالٍ أكثر."),
  L("Vater","Wie viel sollte er täglich üben?","كم ينبغي أن يتمرَّنَ يومياً؟"),
  L("Lehrerin","Fünfzehn Minuten reichen, wenn es regelmäßig geschieht.","خمسَ عشرةَ دقيقةً تكفي إن كانَ بانتظام.")],
 "questions":[
  {"id":"d-b1-32-q1","type":"mc","promptDe":"Was empfiehlt die Lehrerin?","options":["mehr Hausaufgaben","täglich laut lesen","weniger Sport"],"answer":"täglich laut lesen","explanationAr":"«Wichtig wäre, dass er öfter laut liest» — نصيحةٌ مهذّبةٌ بـwäre."},
  {"id":"d-b1-32-q2","type":"fill","promptDe":"Fünfzehn Minuten reichen, wenn es ___ geschieht.","answer":["regelmäßig"],"explanationAr":"regelmäßig = بانتظام؛ الشرطُ في الانتظامِ لا في الطول."}],
 "dictation":["Er meldet sich selten.","Wichtig wäre, dass er laut liest.","Fünfzehn Minuten reichen täglich."]},

{"id":"d-b2-31","level":"B2","titleDe":"Bewerbungsgespräch: die kritische Frage","titleAr":"مقابلةُ عمل: السؤالُ الحرج",
 "lines":[
  L("Personalerin","In Ihrem Lebenslauf fällt eine Lücke von acht Monaten auf.","في سيرتِكَ تلفتُ الانتباهَ فجوةُ ثمانيةِ أشهر."),
  L("Bewerber","Das ist richtig. Ich habe in dieser Zeit meine Mutter gepflegt und nebenbei einen Fachkurs abgeschlossen.","صحيح. في تلك المدّةِ رعيتُ أمّي وأنهيتُ دورةً تخصُّصيةً بالتوازي."),
  L("Personalerin","Inwiefern hat Sie diese Zeit beruflich weitergebracht?","بأيِّ معنىً نفعتْكَ هذه المدّةُ مهنياً؟"),
  L("Bewerber","Ich habe gelernt, unter Belastung zu priorisieren, was mir heute täglich zugutekommt.","تعلَّمتُ ترتيبَ الأولوياتِ تحتَ الضغط، وهو ما ينفعُني يومياً اليوم."),
  L("Personalerin","Angenommen, das Team wäre überlastet: Wie würden Sie vorgehen?","لنفترضْ أنَّ الفريقَ مُثقَل: كيفَ ستتصرَّف؟"),
  L("Bewerber","Ich würde zunächst die Aufgaben sichten und anschließend Prioritäten gemeinsam abstimmen.","سأفحصُ المهامَّ أوّلاً ثمَّ أنسّقُ الأولوياتِ جماعياً.")],
 "questions":[
  {"id":"d-b2-31-q1","type":"mc","promptDe":"Wie geht der Bewerber mit der Lücke um?","options":["Er weicht aus","Er benennt sie und zeigt den Nutzen","Er bestreitet sie"],"answer":"Er benennt sie und zeigt den Nutzen","explanationAr":"يقرُّ بها ثمَّ يحوّلُها إلى مكسب: «Ich habe gelernt, unter Belastung zu priorisieren»."},
  {"id":"d-b2-31-q2","type":"fill","promptDe":"___, das Team wäre überlastet: Wie würden Sie vorgehen?","answer":["Angenommen"],"explanationAr":"Angenommen = لنفترضْ؛ تفتحُ فرضاً يليهِ Konjunktiv II."},
  {"id":"d-b2-31-q3","type":"truefalse","promptDe":"Er antwortet auf die Fallfrage mit konkreten Schritten.","options":["richtig","falsch"],"answer":"richtig","explanationAr":"«zunächst … anschließend …» خطوتانِ مرتّبتان."}],
 "dictation":["In Ihrem Lebenslauf fällt eine Lücke auf.","Ich habe gelernt, unter Belastung zu priorisieren.","Ich würde zunächst die Aufgaben sichten."]},

{"id":"d-b2-32","level":"B2","titleDe":"Streitgespräch: Tempolimit","titleAr":"سجال: تحديدُ السرعة",
 "lines":[
  L("Yara","Ein generelles Tempolimit würde Leben retten und Emissionen senken.","تحديدُ سرعةٍ عامٌّ سينقذُ أرواحاً ويخفضُ الانبعاثات."),
  L("Tobias","Das mag sein, doch die Einsparung fällt geringer aus, als oft behauptet wird.","قد يكون، لكنَّ التوفيرَ أقلُّ ممّا يُدَّعى غالباً."),
  L("Yara","Selbst wenn der Effekt klein wäre: Er kostet nichts und wirkt sofort.","حتى لو كانَ الأثرُ صغيراً: لا يكلّفُ شيئاً ويعملُ فوراً."),
  L("Tobias","Einverstanden, sofern man gleichzeitig in Schienen investiert.","موافقٌ شريطةَ الاستثمارِ في السككِ في الوقتِ نفسِه."),
  L("Yara","Damit kann ich leben. Dann sind wir uns im Grundsatz einig.","بهذا أقبل. إذن نحنُ متّفقانِ من حيثُ المبدأ.")],
 "questions":[
  {"id":"d-b2-32-q1","type":"mc","promptDe":"Welche Bedingung stellt Tobias?","options":["höhere Strafen","Investitionen in die Schiene","mehr Straßen"],"answer":"Investitionen in die Schiene","explanationAr":"«sofern man gleichzeitig in Schienen investiert» — sofern = شريطةَ أن."},
  {"id":"d-b2-32-q2","type":"fill","promptDe":"___ wenn der Effekt klein wäre: Er kostet nichts.","answer":["Selbst"],"explanationAr":"«Selbst wenn …» = حتى لو؛ تنازلٌ افتراضيٌّ مع Konjunktiv II."},
  {"id":"d-b2-32-q3","type":"truefalse","promptDe":"Am Ende bleibt der Streit ungelöst.","options":["richtig","falsch"],"answer":"falsch","explanationAr":"«Dann sind wir uns im Grundsatz einig» — اتّفاقٌ مبدئيّ."}],
 "dictation":["Ein Tempolimit würde Leben retten.","Die Einsparung fällt geringer aus.","Wir sind uns im Grundsatz einig."]},
]

def main():
    d = json.load(open(P, encoding="utf8"))
    ids = {x["id"] for x in d}
    qids = {q["id"] for x in d for q in x["questions"]}
    for n in NEU:
        assert n["id"] not in ids, n["id"]
        for q in n["questions"]:
            assert q["id"] not in qids, q["id"]
        d.append(n)
    json.dump(d, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    import collections
    print("الحوارات:", len(d), dict(collections.Counter(x["level"] for x in d)),
          "| الأسئلة:", sum(len(x["questions"]) for x in d),
          "| أسطرُ الإملاء:", sum(len(x.get("dictation", [])) for x in d))

if __name__ == "__main__":
    main()
