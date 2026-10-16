# -*- coding: utf-8 -*-
"""R162: أربعة حوارات عميقة جديدة (12 سطراً، واحد لكل مستوى A1/A2/B1/B2) — امتداد لموجة
R146 «حوارات أطول/أعمق» إلى كل المستويات. 3 أسئلة لكل حوار (2 mc بمشتّتات مرساة مسموعة
على طريقة K71d + ‏1 fill)، إملاء 3 أجزاء حرفية. فحوص ذاتية تحاكي K71b/d/e/f قبل الكتابة.
بلا إدخالات صوت مدّعاة (TTS معلَن). idempotent."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PFAD = os.path.join(ROOT, "content", "dialogues.json")
AR = re.compile(r"[\u0600-\u06FF]")
STOP = set("eine einen einer eines nicht dass wird werden wenn aber auch sich über ohne nach durch oder noch dann beim vom zum zur mit und der die das den dem des als für auf ist sind war weil damit statt trotz sofort nur".split())

def normW(s):
    return [w for w in re.split(r"\s+", re.sub(r"[^a-zäöüß0-9 ]", " ", s.lower())) if len(w) >= 3]

def L(who, de, ar):
    return collections.OrderedDict([("who", who), ("de", de), ("ar", ar)])

def MC(did, n, prompt, options, answer, expl):
    return collections.OrderedDict([("id", f"{did}-q{n}"), ("type", "mc"), ("promptDe", prompt),
        ("options", options), ("answer", answer), ("explanationAr", expl),
        ("promptAr", "اختر الإجابة الصحيحة حسب الحوار.")])

def FILL(did, n, prompt, answer, expl):
    return collections.OrderedDict([("id", f"{did}-q{n}"), ("type", "fill"), ("promptDe", prompt),
        ("answer", [answer]), ("explanationAr", expl),
        ("promptAr", "أكمل الفراغ بالكلمة المناسبة من الحوار.")])

NEU = []

NEU.append(collections.OrderedDict([
  ("id", "dlg-a1-baeckerei"), ("level", "A1"),
  ("titleDe", "In der Bäckerei"), ("titleAr", "في المخبز"),
  ("lines", [
    L("Herr Yilmaz", "Guten Morgen! Was darf es sein?", "صباح الخير! ماذا تطلب؟"),
    L("Aylin", "Guten Morgen! Ich hätte gern vier Brötchen, bitte.", "صباح الخير! أريد أربعة أرغفة صغيرة، من فضلك."),
    L("Herr Yilmaz", "Gern. Möchten Sie auch ein Brot dazu?", "بكل سرور. هل تريد خبزاً أيضاً؟"),
    L("Aylin", "Ja, ein kleines Brot, bitte. Und haben Sie Croissants?", "نعم، خبزاً صغيراً من فضلك. وهل عندكم كرواسون؟"),
    L("Herr Yilmaz", "Ja, die Croissants sind heute ganz frisch. Wie viele möchten Sie?", "نعم، الكرواسون اليوم طازج جداً. كم واحداً تريدين؟"),
    L("Aylin", "Zwei, bitte. Was kostet ein Croissant?", "اثنان، من فضلك. كم سعر الكرواسون الواحد؟"),
    L("Herr Yilmaz", "Eins kostet einen Euro zwanzig. Die Brötchen kosten vierzig Cent pro Stück.", "الواحد بيورو وعشرين سنتاً. والأرغفة الصغيرة بأربعين سنتاً للقطعة."),
    L("Aylin", "Gut. Dann nehme ich noch eine Brezel für meinen Sohn.", "حسناً. سآخذ أيضاً قطعة بريتزل لابني."),
    L("Herr Yilmaz", "Sehr gern. Ist das alles?", "بكل سرور. هل هذا كل شيء؟"),
    L("Aylin", "Ja, das ist alles. Was macht das zusammen?", "نعم، هذا كل شيء. كم الحساب كاملاً؟"),
    L("Herr Yilmaz", "Das macht zusammen fünf Euro sechzig, bitte.", "المجموع خمسة يوروهات وستون سنتاً، من فضلك."),
    L("Aylin", "Hier ist das Geld. Vielen Dank und auf Wiedersehen!", "تفضّل النقود. شكراً جزيلاً وإلى اللقاء!"),
  ]),
  ("questions", [
    MC("dlg-a1-baeckerei", 1, "Was möchte Aylin zuerst kaufen?",
       ["vier Brötchen", "zwei Croissants", "ein kleines Brot"], "vier Brötchen",
       "الدليل: «Ich hätte gern vier Brötchen, bitte». الفخّ: الكرواسون والخبز طلبتهما بعد ذلك."),
    MC("dlg-a1-baeckerei", 2, "Was kostet ein Croissant?",
       ["vierzig Cent", "fünf Euro sechzig", "einen Euro zwanzig"], "einen Euro zwanzig",
       "الدليل: «Eins kostet einen Euro zwanzig». الفخّ: أربعون سنتاً سعر الرغيف الصغير، وخمسة يوروهات وستون المجموع الكلي."),
    FILL("dlg-a1-baeckerei", 3, "Die Brötchen kosten ___ Cent pro Stück.", "vierzig",
       "الدليل: «Die Brötchen kosten vierzig Cent pro Stück»."),
  ]),
  ("dictation", ["Ich hätte gern vier Brötchen", "die Croissants sind heute ganz frisch", "Das macht zusammen fünf Euro sechzig"]),
]))

NEU.append(collections.OrderedDict([
  ("id", "dlg-a2-buergeramt"), ("level", "A2"),
  ("titleDe", "Einen Termin beim Bürgeramt verschieben"), ("titleAr", "تأجيل موعد في مكتب المواطنين"),
  ("lines", [
    L("Herr Berger", "Bürgeramt Mitte, Berger, guten Tag. Wie kann ich Ihnen helfen?", "مكتب المواطنين وسط المدينة، معك السيد Berger، طاب يومك. كيف أستطيع مساعدتك؟"),
    L("Frau Kaya", "Guten Tag, hier ist Kaya. Ich habe am Donnerstag einen Termin, aber ich kann nicht kommen.", "طاب يومك، معك السيدة Kaya. عندي موعد يوم الخميس لكنني لا أستطيع الحضور."),
    L("Herr Berger", "Kein Problem. Möchten Sie den Termin verschieben?", "لا مشكلة. هل تريدين تأجيل الموعد؟"),
    L("Frau Kaya", "Ja, gern. Geht es auch am Montag um zehn Uhr?", "نعم، بكل سرور. هل يمكن يوم الاثنين في العاشرة؟"),
    L("Herr Berger", "Am Montag ist um zehn Uhr leider nichts frei. Um elf Uhr hätte ich einen Termin.", "يوم الاثنين في العاشرة لا يوجد شيء شاغر للأسف. عندي موعد في الحادية عشرة."),
    L("Frau Kaya", "Elf Uhr passt mir gut. Was muss ich mitbringen?", "الحادية عشرة تناسبني جيداً. ما الذي يجب أن أحضره معي؟"),
    L("Herr Berger", "Bringen Sie bitte Ihren Pass und die alte Aufenthaltserlaubnis mit.", "أحضري من فضلك جواز سفرك وتصريح الإقامة القديم."),
    L("Frau Kaya", "Muss ich auch ein Foto mitbringen?", "هل يجب أن أحضر صورة أيضاً؟"),
    L("Herr Berger", "Ja, ein aktuelles Foto brauchen wir auch. Und das Formular von unserer Webseite.", "نعم، نحتاج أيضاً إلى صورة حديثة. والاستمارة من موقعنا الإلكتروني."),
    L("Frau Kaya", "Gut, ich fülle das Formular zu Hause aus. Wo finde ich es?", "حسناً، سأملأ الاستمارة في البيت. أين أجدها؟"),
    L("Herr Berger", "Auf unserer Webseite unter Formulare. Der neue Termin ist am Montag um elf Uhr.", "على موقعنا تحت بند الاستمارات. الموعد الجديد يوم الاثنين في الحادية عشرة."),
    L("Frau Kaya", "Vielen Dank für Ihre Hilfe. Auf Wiederhören!", "شكراً جزيلاً على مساعدتك. إلى اللقاء!"),
  ]),
  ("questions", [
    MC("dlg-a2-buergeramt", 1, "Warum ruft Frau Kaya an?",
       ["Sie sucht die Webseite", "Sie braucht ein Foto", "Sie kann am Donnerstag nicht kommen"], "Sie kann am Donnerstag nicht kommen",
       "الدليل: «Ich habe am Donnerstag einen Termin, aber ich kann nicht kommen». الفخّ: الصورة والاستمارة جاءتا لاحقاً في المكالمة."),
    MC("dlg-a2-buergeramt", 2, "Wann ist der neue Termin?",
       ["am Donnerstag um zehn Uhr", "am Montag um elf Uhr", "am Montag um zehn Uhr"], "am Montag um elf Uhr",
       "الدليل: «Der neue Termin ist am Montag um elf Uhr». الفخّ: العاشرة يوم الاثنين مشغولة، والخميس هو الموعد القديم."),
    FILL("dlg-a2-buergeramt", 3, "Sie füllt das ___ zu Hause aus.", "Formular",
       "الدليل: «ich fülle das Formular zu Hause aus»."),
  ]),
  ("dictation", ["Ich habe am Donnerstag einen Termin", "Am Montag ist um zehn Uhr leider nichts frei", "Bringen Sie bitte Ihren Pass"]),
]))

NEU.append(collections.OrderedDict([
  ("id", "dlg-b1-elterngespraech"), ("level", "B1"),
  ("titleDe", "Elterngespräch in der Schule"), ("titleAr", "لقاء أولياء الأمور في المدرسة"),
  ("lines", [
    L("Herr Wolf", "Guten Tag, Frau Demir. Schön, dass Sie Zeit für unser Gespräch haben.", "طاب يومك سيدة Demir. سعيد أن لديك وقتاً لحديثنا."),
    L("Frau Demir", "Guten Tag, Herr Wolf. Ich mache mir Sorgen um Elifs Noten in Mathe.", "طاب يومك سيد Wolf. أنا قلقة بشأن علامات ابنتي Elif في الرياضيات."),
    L("Herr Wolf", "Elif ist im Unterricht aufmerksam, aber bei den Hausaufgaben fehlt ihr oft die Übung.", "Elif منتبهة في الدرس، لكن ينقصها غالباً التمرين في الواجبات المنزلية."),
    L("Frau Demir", "Zu Hause übt sie jeden Abend, aber die Texte in den Aufgaben versteht sie manchmal nicht.", "في البيت تتدرب كل مساء، لكنها أحياناً لا تفهم نصوص المسائل."),
    L("Herr Wolf", "Das ist ein wichtiger Punkt. In Mathe muss man die Aufgaben zuerst genau lesen.", "هذه نقطة مهمة. في الرياضيات يجب أولاً قراءة المسائل بدقة."),
    L("Frau Demir", "Was können wir zu Hause noch tun?", "ما الذي يمكننا فعله في البيت أيضاً؟"),
    L("Herr Wolf", "Zehn Minuten Kopfrechnen am Tag helfen mehr als eine Stunde am Wochenende.", "عشر دقائق من الحساب الذهني يومياً تفيد أكثر من ساعة في عطلة نهاية الأسبوع."),
    L("Frau Demir", "Das klingt gut. Und wie ist es in Deutsch?", "يبدو هذا جيداً. وكيف حالها في الألمانية؟"),
    L("Herr Wolf", "In Deutsch liest sie gern, aber sie schreibt zu schnell und macht viele kleine Fehler.", "في الألمانية تحب القراءة، لكنها تكتب بسرعة كبيرة وترتكب أخطاء صغيرة كثيرة."),
    L("Frau Demir", "Soll sie ihre Texte noch einmal langsam durchlesen?", "هل ينبغي أن تعيد قراءة نصوصها ببطء مرة أخرى؟"),
    L("Herr Wolf", "Genau. Und am Freitag gibt es eine AG, da kann sie zusätzlich üben.", "تماماً. ويوم الجمعة توجد مجموعة نشاط، يمكنها أن تتدرب فيها إضافياً."),
    L("Frau Demir", "Vielen Dank für die Tipps, Herr Wolf. Auf Wiedersehen!", "شكراً جزيلاً على النصائح سيد Wolf. إلى اللقاء!"),
  ]),
  ("questions", [
    MC("dlg-b1-elterngespraech", 1, "Worum macht sich Frau Demir Sorgen?",
       ["um Elifs Noten in Mathe", "um die Hausaufgaben in Deutsch", "um die AG am Freitag"], "um Elifs Noten in Mathe",
       "الدليل: «Ich mache mir Sorgen um Elifs Noten in Mathe». الفخّ: الألمانية ومجموعة النشاط وردتا لاحقاً ولا علاقة لهما بقلقها الأول."),
    MC("dlg-b1-elterngespraech", 2, "Was empfiehlt Herr Wolf für Mathe?",
       ["eine Stunde Übung am Wochenende", "die Texte langsam durchlesen", "zehn Minuten Kopfrechnen am Tag"], "zehn Minuten Kopfrechnen am Tag",
       "الدليل: «Zehn Minuten Kopfrechnen am Tag helfen mehr als eine Stunde am Wochenende». الفخّ: إعادة القراءة ببطء هي نصيحة الألمانية لا الرياضيات."),
    FILL("dlg-b1-elterngespraech", 3, "In Deutsch macht Elif viele kleine ___.", "Fehler",
       "الدليل: «sie schreibt zu schnell und macht viele kleine Fehler»."),
  ]),
  ("dictation", ["Ich mache mir Sorgen um Elifs Noten in Mathe", "Zehn Minuten Kopfrechnen am Tag helfen", "sie schreibt zu schnell und macht viele kleine Fehler"]),
]))

NEU.append(collections.OrderedDict([
  ("id", "dlg-b2-ki-arbeit"), ("level", "B2"),
  ("titleDe", "Künstliche Intelligenz im Beruf"), ("titleAr", "الذكاء الاصطناعي في المهن"),
  ("lines", [
    L("Frau Lindner", "Unser Thema heute: Wie verändert künstliche Intelligenz unsere Berufe? Herr Dr. Arslan, Sie arbeiten mit solchen Systemen.", "موضوعنا اليوم: كيف يغيّر الذكاء الاصطناعي مهننا؟ دكتور أرسلان، أنت تعمل مع أنظمة كهذه."),
    L("Dr. Arslan", "Ja. In meiner Firma sortiert eine Software Bewerbungen vor. Das spart Zeit, aber ein Mensch trifft die Entscheidung.", "نعم. في شركتي يقوم برنامج بفرز طلبات التوظيف تمهيدياً. هذا يوفر الوقت، لكن إنساناً هو من يتخذ القرار."),
    L("Frau Brandt", "Das klingt gut, aber wer kontrolliert die Software? Sie kann Fehler machen und Menschen benachteiligen.", "يبدو هذا جيداً، لكن من يراقب البرنامج؟ قد يخطئ ويميز ضد أشخاص."),
    L("Dr. Arslan", "Deshalb prüfen wir jede Entscheidung. Die Maschine macht Vorschläge, mehr nicht.", "لذلك نراجع كل قرار. الآلة تقدّم اقتراحات، لا أكثر."),
    L("Frau Lindner", "Frau Brandt, was ist Ihre größte Sorge bei diesem Thema?", "سيدة برانت، ما أكبر مخاوفك في هذا الموضوع؟"),
    L("Frau Brandt", "Dass Firmen Stellen streichen und es als Fortschritt verkaufen. Technik soll helfen, nicht ersetzen.", "أن تلغي الشركات وظائف وتبيع ذلك كتقدم. التقنية يجب أن تساعد لا أن تحلّ محل الإنسان."),
    L("Dr. Arslan", "In der Geschichte hat Technik Berufe verändert, aber selten ganze Berufe gelöscht. Neue Aufgaben sind entstanden.", "عبر التاريخ غيّرت التقنية المهن لكنها نادراً ما محتها بالكامل. ونشأت مهام جديدة."),
    L("Frau Brandt", "Das stimmt, aber der Übergang war für viele Menschen hart. Nicht jeder kann schnell umlernen.", "هذا صحيح، لكن المرحلة الانتقالية كانت قاسية على كثيرين. ليس كل شخص قادراً على إعادة التأهل بسرعة."),
    L("Frau Lindner", "Was sollten Firmen also konkret tun?", "ما الذي ينبغي أن تفعله الشركات عملياً إذن؟"),
    L("Dr. Arslan", "Die Mitarbeiter früh einbeziehen und Weiterbildung anbieten, bevor die Technik kommt.", "إشراك الموظفين مبكراً وتقديم تدريب إضافي قبل وصول التقنية."),
    L("Frau Brandt", "Und der Staat muss Regeln setzen, damit die Daten der Menschen geschützt bleiben.", "وعلى الدولة وضع قواعد حتى تبقى بيانات الناس محمية."),
    L("Frau Lindner", "Also Technik ja, aber mit klaren Regeln. Vielen Dank an Sie beide!", "إذن تقنية نعم لكن بقواعد واضحة. شكراً جزيلاً لكليكما!"),
  ]),
  ("questions", [
    MC("dlg-b2-ki-arbeit", 1, "Was macht die Software in Dr. Arslans Firma?",
       ["Sie trifft die Entscheidung über Bewerbungen", "Sie sortiert Bewerbungen vor", "Sie prüft jede Entscheidung"], "Sie sortiert Bewerbungen vor",
       "الدليل: «sortiert eine Software Bewerbungen vor». الفخّ: القرار يتخذه إنسان («ein Mensch trifft die Entscheidung»)، ومراجعة كل قرار مهمة البشر لا البرنامج."),
    MC("dlg-b2-ki-arbeit", 2, "Was ist Frau Brandts größte Sorge?",
       ["dass die Daten der Menschen nicht geschützt bleiben", "dass die Maschine Fehler macht", "dass Firmen Stellen streichen"], "dass Firmen Stellen streichen",
       "الدليل: «Dass Firmen Stellen streichen und es als Fortschritt verkaufen». الفخّ: أخطاء الآلة وحماية البيانات مخاوف مذكورة أيضاً، لكن إجابتها المباشرة عن سؤال «أكبر مخاوفك» هي إلغاء الوظائف."),
    FILL("dlg-b2-ki-arbeit", 3, "Die Maschine macht ___, mehr nicht.", "Vorschläge",
       "الدليل: «Die Maschine macht Vorschläge, mehr nicht»."),
  ]),
  ("dictation", ["Wie verändert künstliche Intelligenz unsere Berufe", "Die Maschine macht Vorschläge, mehr nicht", "Technik soll helfen, nicht ersetzen"]),
]))

# فحوص ذاتية على طريقة K71 قبل الكتابة
for d in NEU:
    lines = d["lines"]
    assert len(lines) == 12, (d["id"], len(lines))
    assert len({l["who"] for l in lines}) >= 2
    text_set = set(normW(" ".join(l["who"] + " " + l["de"] for l in lines)))
    joined = " ".join(l["de"] for l in lines)
    for l in lines:
        assert not AR.search(l["de"]) and AR.search(l["ar"]), (d["id"], l["de"][:30])
    qs = d["questions"]
    assert [q["type"] for q in qs] == ["mc", "mc", "fill"], d["id"]
    for q in qs:
        assert AR.search(q["explanationAr"]) and "الدليل" in q["explanationAr"], q["id"]
        if q["type"] == "mc":
            assert "الفخّ" in q["explanationAr"], q["id"]
            assert q["answer"] in q["options"] and len(set(q["options"])) == 3
            for o in q["options"]:
                if o == q["answer"]: continue
                inhalt = [w for w in normW(o) if w not in STOP]
                assert any(w in text_set or any(t.startswith(w[:6]) and len(w) >= 6 for t in text_set) for w in inhalt), (q["id"], o)
        else:
            assert re.search(r"\b" + re.escape(q["answer"][0]) + r"\b", joined), q["id"]
        for m in re.finditer(r"«([^»]+)»", q["explanationAr"]):
            for piece in re.split(r"…|\.\.\.", m.group(1)):
                p = piece.strip(" .,;:„“\"")
                assert len(p) < 12 or p in joined, (q["id"], p)
    assert len(d["dictation"]) == 3 and all(any(part in l["de"] for l in lines) for part in d["dictation"]), d["id"]
print("self-checks OK (12 lines, K71 anchors, dictation literal)")

bank = json.load(open(PFAD, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
ids = {d["id"] for d in bank}
neu = 0
for d in NEU:
    if d["id"] not in ids:
        bank.append(d)
        neu += 1
json.dump(bank, open(PFAD, "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(f"R162 dialogues written: +{neu} (bank now {len(bank)})")
