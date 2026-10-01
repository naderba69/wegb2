# -*- coding: utf-8 -*-
"""
الموجة ④ — تمارينُ التحويل (Umformungsdrills): اثنان لكلِّ درسٍ من الـ37.
كلُّ تمرين: quelleDe (المُدخَل) · promptDe (التعليمة) · answer (النموذج) · alternativen ·
mussEnthalten (البنيةُ الواجبة) · darfNicht (الفخُّ نفسُه) · explanationAr.
المبدأ: التحويلُ إنتاجٌ مقيَّد — يُدرِّبُ البنيةَ ويكشفُ الفخَّ في الجملةِ نفسِها.
"""
import json, collections

U = {}
def d(gid, n, quelle, prompt, answer, ar, alt=None, muss=None, nicht=None, hint=None):
    U.setdefault(gid, []).append({
        "id": f"{gid}-u{n}", "type": "umformung",
        "quelleDe": quelle, "promptDe": prompt, "answer": answer,
        **({"alternativen": alt} if alt else {}),
        **({"mussEnthalten": muss} if muss else {}),
        **({"darfNicht": nicht} if nicht else {}),
        **({"hint": hint} if hint else {}),
        "explanationAr": ar, "points": 2,
    })

# ── A1 ──────────────────────────────────────────────────────────────
d("a1-sein-haben",1,"Ich bin hungrig.","Sage es mit „haben“ + Nomen.","Ich habe Hunger.","«جائع» بالامتلاك: Hunger haben. الصفة hungrig صحيحة لكنها أقل شيوعاً.",muss=["habe","hunger"],nicht=["bin","hungrig"])
d("a1-sein-haben",2,"Wir haben Durst.","Sage es mit „sein“ + Adjektiv.","Wir sind durstig.","العكس: من الاسم Durst إلى الصفة durstig مع sein.",muss=["sind","durstig"],nicht=["haben","durst"])
d("a1-war-hatte",1,"Ich bin müde.","Setze in die Vergangenheit (gestern).","Gestern war ich müde.","sein ← war. لا تقل „bin gewesen“ في الحديث.",alt=["Ich war gestern müde."],muss=["war"],nicht=["bin","gewesen"])
d("a1-war-hatte",2,"Er hat keine Zeit.","Setze in die Vergangenheit (letzte Woche).","Letzte Woche hatte er keine Zeit.","haben ← hatte.",alt=["Er hatte letzte Woche keine Zeit."],muss=["hatte"],nicht=["hat","gehabt"])
d("a1-pronomen",1,"Wie geht es Sie?","Korrigiere das Pronomen (Dativ).","Wie geht es Ihnen?","es geht + Dativ: Ihnen لا Sie.",muss=["ihnen"],nicht=["sie"])
d("a1-pronomen",2,"Ich sehe der Mann.","Ersetze „der Mann“ durch ein Pronomen (Akkusativ).","Ich sehe ihn.","المفعول المذكر: ihn.",muss=["ihn"],nicht=["er","der mann"])
d("a1-praesens",1,"ich fahre","Konjugiere für „du“.","du fährst","تغيير الجذر a→ä في du/er: fährst.",muss=["fährst"],nicht=["fahrst"])
d("a1-praesens",2,"wir sprechen","Konjugiere für „er“.","er spricht","e→i: spricht.",muss=["spricht"],nicht=["sprecht","sprechst"])
d("a1-trennbar",1,"Ich aufstehe um 7 Uhr.","Korrigiere die Satzstellung (trennbares Verb).","Ich stehe um 7 Uhr auf.","البادئة المنفصلة تذهب إلى آخر الجملة.",muss=["stehe","auf"],nicht=["aufstehe"])
d("a1-trennbar",2,"anrufen · ich · dich · morgen","Bilde einen Aussagesatz.","Ich rufe dich morgen an.","الفعل ثانياً والبادئة an في الآخر.",alt=["Morgen rufe ich dich an."],muss=["rufe","an"],nicht=["anrufe"])
d("a1-zahlen",1,"8:30 Uhr","Sage die Uhrzeit umgangssprachlich mit „halb“.","halb neun","halb يشير إلى الساعة القادمة: 8:30 = halb neun (نصف الطريق إلى التاسعة).",alt=["Es ist halb neun."],muss=["halb","neun"],nicht=["halb acht","acht"])
d("a1-zahlen",2,"Es ist 14:45 Uhr.","Sage es umgangssprachlich mit „Viertel vor“.","Es ist Viertel vor drei.","الحديث اليومي بنظام 12 ساعة: Viertel vor drei.",muss=["viertel vor","drei"],nicht=["fünfzehn","vierzehn"])
d("a1-akkusativ",1,"Das ist ein Tisch.","Setze „Ich habe …“ davor.","Ich habe einen Tisch.","المفعول المذكر يأخذ einen.",muss=["einen tisch"],nicht=["ein tisch"])
d("a1-akkusativ",2,"Der Kaffee ist heiß.","Sage: Ich trinke …","Ich trinke den Kaffee.","der ← den في المفعول.",muss=["den kaffee"],nicht=["der kaffee"])
# ── A2 ──────────────────────────────────────────────────────────────
d("a2-perfekt",1,"Ich gehe ins Kino.","Setze ins Perfekt.","Ich bin ins Kino gegangen.","أفعال الحركة تأخذ sein لا haben.",muss=["bin","gegangen"],nicht=["habe"])
d("a2-perfekt",2,"Wir essen Pizza.","Setze ins Perfekt.","Wir haben Pizza gegessen.","essen شاذّ: gegessen (بـge مضاعفة).",muss=["haben","gegessen"],nicht=["geesst","sind"])
d("a2-praeteritum",1,"Ich habe gestern ins Kino gegangen.","Korrigiere und schreibe im Präteritum.","Ich ging gestern ins Kino.","خطآن: gehen مع sein لا haben — والسرد يفضّل ging.",alt=["Gestern ging ich ins Kino."],muss=["ging"],nicht=["habe","gegangen"])
d("a2-praeteritum",2,"Ich muss früh aufstehen.","Setze ins Präteritum.","Ich musste früh aufstehen.","الناقصة تُستعمل Präteritum حتى شفوياً: musste.",muss=["musste"],nicht=["muss","gemusst"])
d("a2-negation",1,"Ich habe Zeit.","Verneine mit „kein“.","Ich habe keine Zeit.","الاسم بلا أداة/بأداة نكرة يُنفى بـkein.",muss=["keine zeit"],nicht=["nicht zeit"])
d("a2-negation",2,"Ich kenne den Mann.","Verneine mit „nicht“.","Ich kenne den Mann nicht.","الاسم المعرّف يُنفى بـnicht في آخر الجملة.",muss=["nicht"],nicht=["keinen"])
d("a2-imperativ",1,"Du sollst langsam sprechen.","Bilde den Imperativ (du).","Sprich langsam!","الأمر مع du: الجذر بتغيير e→i، بلا ضمير.",alt=["Sprich langsam."],muss=["sprich"],nicht=["du","sprech"])
d("a2-imperativ",2,"Sie sollen hier warten.","Bilde den Imperativ (Sie).","Warten Sie hier!","صيغة الاحترام تحتفظ بـSie بعد الفعل.",alt=["Warten Sie hier."],muss=["warten sie"],nicht=["wartet"])
d("a2-weil-dass",1,"Ich bleibe zu Hause. Ich bin krank.","Verbinde mit „weil“.","Ich bleibe zu Hause, weil ich krank bin.","بعد weil يذهب الفعل إلى الآخر.",muss=["weil","krank bin"],nicht=["weil ich bin krank"])
d("a2-weil-dass",2,"Er sagt: „Ich komme morgen.“","Schreibe mit „dass“.","Er sagt, dass er morgen kommt.","dass + الفعل في الآخر، والضمير يتحول.",muss=["dass","kommt"],nicht=["kommt morgen","ich komme"])
d("a2-dativ",1,"Ich helfe dich.","Korrigiere den Kasus.","Ich helfe dir.","helfen يأخذ Dativ دائماً.",muss=["dir"],nicht=["dich"])
d("a2-dativ",2,"Ich gebe das Buch meinem Bruder.","Stelle um: Person vor Sache.","Ich gebe meinem Bruder das Buch.","الترتيب الطبيعي: Dativ (شخص) قبل Akkusativ (شيء).",muss=["meinem bruder das buch"])
d("a2-modal",1,"Ich gehe nach Hause.","Füge „müssen“ ein.","Ich muss nach Hause gehen.","الناقصة ثانياً والمصدر آخراً بلا zu.",muss=["muss","gehen"],nicht=["zu gehen"])
d("a2-modal",2,"Kannst du mir helfen?","Formuliere höflicher mit „könnten“.","Könnten Sie mir helfen?","könnten أدبُ الطلب.",alt=["Könntest du mir helfen?"],muss=["könnte"],nicht=["kannst"])
d("a2-wechsel",1,"Ich gehe in der Schule.","Korrigiere: Bewegung → Akkusativ.","Ich gehe in die Schule.","الحركة نحو الهدف: Akkusativ.",muss=["in die schule"],nicht=["in der schule"])
d("a2-wechsel",2,"Ich lege das Buch auf dem Tisch.","Korrigiere den Kasus.","Ich lege das Buch auf den Tisch.","legen = حركة ← Akkusativ.",muss=["auf den tisch"],nicht=["auf dem tisch"])
d("a2-reflexiv",1,"Ich setze auf den Stuhl.","Füge das Reflexivpronomen ein.","Ich setze mich auf den Stuhl.","setzen انعكاسي: sich setzen.",muss=["mich"],nicht=["setze auf"])
d("a2-reflexiv",2,"Er freut über das Geschenk.","Korrigiere.","Er freut sich über das Geschenk.","sich freuen über.",muss=["sich"],nicht=["freut über"])
d("a2-steigerung",1,"Berlin ist groß. Hamburg ist kleiner.","Vergleiche: Berlin … als Hamburg.","Berlin ist größer als Hamburg.","المقارنة: -er + als، مع Umlaut في groß.",muss=["größer als"],nicht=["mehr groß","wie"])
d("a2-steigerung",2,"Dieses Auto ist teuer.","Bilde den Superlativ mit „am“.","Dieses Auto ist am teuersten.","am + -sten.",muss=["am teuersten"],nicht=["teuerste ","meist"])
d("a2-futur",1,"Ich mache morgen Sport.","Setze ins Futur I.","Ich werde morgen Sport machen.","werden ثانياً والمصدر آخراً.",alt=["Morgen werde ich Sport machen."],muss=["werde","machen"])
d("a2-futur",2,"Ich werde müde.","Sage, was jetzt der Fall ist (Zustand, kein Futur).","Ich bin müde.","werde müde تعني «أصير» لا «سأكون». الحال الآن: bin.",muss=["bin müde"],nicht=["werde"])
# ── B1 ──────────────────────────────────────────────────────────────
d("b1-konj2",1,"Ich habe keine Zeit, deshalb komme ich nicht.","Formuliere irreal: Wenn ich … hätte, …","Wenn ich Zeit hätte, würde ich kommen.","Konjunktiv II: hätte + würde.",alt=["Wenn ich Zeit hätte, käme ich."],muss=["hätte"],nicht=["habe","komme ich"])
d("b1-konj2",2,"Können Sie mir helfen?","Formuliere höflicher (Konjunktiv II).","Könnten Sie mir bitte helfen?","könnten أرقّ من können.",alt=["Könnten Sie mir helfen?"],muss=["könnten"],nicht=["können"])
d("b1-relativ",1,"Das ist der Mann. Ich habe ihn gesehen.","Verbinde mit einem Relativsatz.","Das ist der Mann, den ich gesehen habe.","der Mann مفعول في الوصل ← den، والفعل آخراً.",muss=["den","gesehen habe"],nicht=["der ich","habe gesehen"])
d("b1-relativ",2,"Die Frau wohnt hier. Ich helfe ihr.","Verbinde mit einem Relativsatz.","Die Frau, der ich helfe, wohnt hier.","helfen + Dativ ← der (مؤنث داتيف).",muss=["der ich helfe"],nicht=["die ich helfe"])
d("b1-konnektoren",1,"Es regnet. Wir gehen spazieren.","Verbinde mit „trotzdem“.","Es regnet, trotzdem gehen wir spazieren.","trotzdem يحتل الموضع الأول فيُقلب الفعل.",muss=["trotzdem gehen wir"],nicht=["trotzdem wir gehen"])
d("b1-konnektoren",2,"Obwohl es regnet, trotzdem gehen wir.","Korrigiere: nur ein Konnektor.","Obwohl es regnet, gehen wir spazieren.","obwohl وtrotzdem لا يجتمعان.",alt=["Obwohl es regnet, gehen wir."],muss=["obwohl","gehen wir"],nicht=["trotzdem"])
d("b1-plusquamperfekt",1,"Er hat gegessen. Dann ist er gegangen.","Verbinde mit „nachdem“.","Nachdem er gegessen hatte, ging er.","nachdem + Plusquamperfekt ← Präteritum.",alt=["Nachdem er gegessen hatte, ist er gegangen."],muss=["nachdem","gegessen hatte"],nicht=["gegessen hat"])
d("b1-plusquamperfekt",2,"Ich lernte Deutsch. Davor lebte ich in Tunis.","Schreibe mit „bevor“ und Plusquamperfekt.","Bevor ich Deutsch lernte, hatte ich in Tunis gelebt.","الأسبق: hatte gelebt.",muss=["bevor","hatte","gelebt"])
d("b1-genitiv",1,"das Auto von meinem Vater","Schreibe mit Genitiv.","das Auto meines Vaters","الجرّ: meines Vaters.",muss=["meines vaters"],nicht=["von"])
d("b1-genitiv",2,"Ich komme nicht. Der Grund: das Wetter.","Schreibe mit „wegen“ + Genitiv.","Wegen des Wetters komme ich nicht.","wegen + Genitiv: des Wetters.",alt=["Ich komme wegen des Wetters nicht."],muss=["wegen des wetters"],nicht=["wegen dem"])
d("b1-adjektivendungen",1,"Der Mann ist alt.","Schreibe als Nominalphrase: der … Mann","der alte Mann","بعد der: -e.",muss=["der alte mann"],nicht=["alter","alten"])
d("b1-adjektivendungen",2,"Ich sehe einen Mann. Er ist alt.","Verbinde: Ich sehe einen … Mann.","Ich sehe einen alten Mann.","بعد einen (مفعول مذكر): -en.",muss=["einen alten mann"],nicht=["alter","alte "])
d("b1-wortbildung",1,"die Tür + das Haus","Bilde das Kompositum (Haus ist das Grundwort).","das Türhaus","الأخيرة تحكم: Haus ← das.",muss=["das türhaus"],nicht=["die"])
d("b1-wortbildung",2,"die Wohnung + der Markt","Bilde das Kompositum mit Fugenelement.","der Wohnungsmarkt","-ung + s، والجنس من Markt.",muss=["der wohnungsmarkt"],nicht=["wohnungmarkt","die"])
d("b1-unbestimmte",1,"Alle Leute sind gekommen. Niemand fehlt.","Sage: Es sind … Leute da (alle).","Es sind alle Leute da.","alle مع الجمع.",muss=["alle"],nicht=["jeder leute"])
d("b1-unbestimmte",2,"Ich habe nichts gehört.","Sage das Gegenteil mit „etwas“.","Ich habe etwas gehört.","nichts ↔ etwas.",muss=["etwas"],nicht=["nichts"])
d("b1-verb-praeposition",1,"Ich denke über dich nach.","Sage: Ich vermisse dich (denken an).","Ich denke an dich.","denken an = يفكّر بـ/يشتاق؛ nachdenken über = يتأمل.",muss=["denke an dich"],nicht=["über","nach"])
d("b1-verb-praeposition",2,"Ich warte den Bus.","Ergänze die Präposition.","Ich warte auf den Bus.","warten auf + Akk.",muss=["auf den bus"],nicht=["warte den"])
d("b1-passiv",1,"Man baut das Haus.","Setze ins Passiv.","Das Haus wird gebaut.","werden + Partizip II.",muss=["wird gebaut"],nicht=["man"])
d("b1-passiv",2,"Das Haus wird gebaut sein.","Korrigiere: Zustandspassiv (fertig).","Das Haus ist gebaut.","حالة الاكتمال: sein + Partizip II.",muss=["ist gebaut"],nicht=["wird"])
# ── B2 ──────────────────────────────────────────────────────────────
d("b2-indirekte-rede",1,"Er sagte: „Die Lage ist stabil.“","Schreibe in indirekter Rede (Konjunktiv I).","Er sagte, die Lage sei stabil.","Konjunktiv I: sei.",alt=["Er sagte, dass die Lage stabil sei."],muss=["sei"],nicht=["ist stabil"])
d("b2-indirekte-rede",2,"Sie sagte: „Ich habe keine Zeit.“","Schreibe in indirekter Rede.","Sie sagte, sie habe keine Zeit.","habe (Konj. I) والضمير يتحول.",alt=["Sie sagte, dass sie keine Zeit habe."],muss=["habe"],nicht=["ich habe","hat"])
d("b2-funktionsverben",1,"Sie entschied sich.","Schreibe mit Funktionsverbgefüge: eine Entscheidung …","Sie traf eine Entscheidung.","eine Entscheidung treffen.",muss=["entscheidung","traf"],nicht=["entschied"])
d("b2-funktionsverben",2,"Er kritisierte den Plan.","Schreibe mit: Kritik … an","Er übte Kritik an dem Plan.","Kritik üben an + Dat.",alt=["Er übte Kritik am Plan."],muss=["kritik","übte"],nicht=["kritisierte"])
d("b2-partizip",1,"Die Maßnahmen, die von der Regierung beschlossen wurden, …","Schreibe als Partizipialattribut.","die von der Regierung beschlossenen Maßnahmen","Partizip II قبل الاسم بنهاية الصفة -en.",muss=["beschlossenen maßnahmen"],nicht=["beschlossene maßnahmen","die "])
d("b2-partizip",2,"das Kind, das weint","Schreibe mit Partizip I.","das weinende Kind","Partizip I: -end + نهاية الصفة.",muss=["weinende kind"],nicht=["das weint"])
d("b2-infinitiv",1,"Ich hoffe, dass ich die Prüfung bestehe.","Schreibe mit zu + Infinitiv.","Ich hoffe, die Prüfung zu bestehen.","نفس الفاعل ← zu + Infinitiv.",muss=["zu bestehen"],nicht=["dass"])
d("b2-infinitiv",2,"Er lernt Deutsch. Er will in Berlin studieren.","Verbinde mit „um … zu“.","Er lernt Deutsch, um in Berlin zu studieren.","الغرض: um … zu.",muss=["um","zu studieren"],nicht=["will"])
d("b2-bedingung",1,"Wenn ich hätte Zeit, würde ich kommen.","Korrigiere die Wortstellung.","Wenn ich Zeit hätte, würde ich kommen.","بعد wenn الفعل آخراً.",muss=["zeit hätte"],nicht=["hätte zeit"])
d("b2-bedingung",2,"Wenn ich Zeit hätte, käme ich.","Schreibe ohne „wenn“ (Verb an Position 1).","Hätte ich Zeit, käme ich.","الشرط بلا wenn: الفعل أوّلاً.",alt=["Hätte ich Zeit, würde ich kommen."],muss=["hätte ich zeit"],nicht=["wenn"])
d("b2-doppelkonnektoren",1,"Er spricht Deutsch. Er spricht auch Arabisch.","Verbinde mit „sowohl … als auch“.","Er spricht sowohl Deutsch als auch Arabisch.","الرابط الثنائي.",muss=["sowohl","als auch"])
d("b2-doppelkonnektoren",2,"Ich habe keine Zeit. Ich habe kein Geld.","Verbinde mit „weder … noch“.","Ich habe weder Zeit noch Geld.","weder … noch ينفي بلا kein.",muss=["weder","noch"],nicht=["kein"])
d("b2-relativ-generalisierend",1,"Alles, das du sagst, ist wichtig.","Korrigiere das Relativpronomen.","Alles, was du sagst, ist wichtig.","بعد alles/nichts/etwas: was.",muss=["was"],nicht=["das du"])
d("b2-relativ-generalisierend",2,"Er kam zu spät. Das ärgerte mich.","Verbinde mit „was“.","Er kam zu spät, was mich ärgerte.","was يعود على الجملة كلها.",muss=["was mich ärgerte"],nicht=["das ärgerte"])
d("b2-modalpartikel",1,"Mach das!","Mache die Aufforderung freundlicher mit „doch mal“.","Mach das doch mal!","doch mal تُليّن الأمر.",muss=["doch mal"])
d("b2-modalpartikel",2,"Das ist doch.","Vervollständige den Satz sinnvoll.","Das ist doch klar!","doch لا تقف في آخر الجملة.",alt=["Das ist doch klar."],muss=["doch klar"],nicht=["ist doch."])
d("b2-futur-ii",1,"Ich mache den Bericht bis morgen fertig.","Setze ins Futur II (Vermutung über Abgeschlossenes).","Ich werde den Bericht bis morgen fertig gemacht haben.","werden + Partizip II + haben.",muss=["werde","gemacht haben"],nicht=["machen haben"])
d("b2-futur-ii",2,"Er ist wahrscheinlich schon angekommen.","Schreibe mit Futur II.","Er wird schon angekommen sein.","الحركة: Partizip II + sein.",alt=["Er wird wahrscheinlich schon angekommen sein."],muss=["wird","angekommen sein"],nicht=["ist"])

G="content/grammar.json"
g=json.load(open(G,encoding="utf8"),object_pairs_hook=collections.OrderedDict)
fehlt=[k for k in g if k not in U]; extra=[k for k in U if k not in g]
assert not fehlt and not extra, (fehlt, extra)
tot=0
for k,items in U.items():
    ids={e["id"] for e in g[k]["exercises"]}
    for it in items:
        if it["id"] not in ids: g[k]["exercises"].append(it); tot+=1
json.dump(g,open(G,"w",encoding="utf8"),ensure_ascii=False,indent=1)
print(f"✔ أُضيف {tot} تمرينَ تحويل على {len(U)} درساً — التمارين الآن {sum(len(d['exercises']) for d in g.values())}")
