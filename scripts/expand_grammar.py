# -*- coding: utf-8 -*-
"""يضيف مواضيع القواعد الثلاث الناقصة (Futur II · generalisierende Relativsätze · zweiteilige Konnektoren).
مرافق مع مُطهِّر تلقائي: أي حرف صيني يُقتلع من السلاسل + تنبيه."""
import json, re

def clean(s):
    if s is None: return s
    out = re.sub(r"[\u4e00-\u9fff\u3000-\u303f]+", "", s)
    out = re.sub(r"\s{2,}", " ", out)
    if out != s: print("🧹 طُهّر fragment في:", s[:40])
    return out.strip()

g = json.load(open("content/grammar.json"))

def T(id, td, ta, summ, rules, tables, exs, pits, exercises):
    return id, {
        "id": id, "titleDe": clean(td), "titleAr": clean(ta), "level": "B2", "summaryAr": clean(summ),
        "rules": [{"de": clean(a), "ar": clean(b)} for a, b in rules],
        "tables": [[clean(c) for c in row] for row in tables],
        "examples": [{"de": clean(a), "ar": clean(b)} for a, b in exs],
        "pitfalls": [{"de": clean(a), "ar": clean(b)} for a, b in pits],
        "resources": [],
        "exercises": [
            {k: (clean(v) if isinstance(v, str) else [clean(x) for x in v] if isinstance(v, list) else v) for k, v in e.items()}
            for e in exercises],
    }

new = {}
new.update(dict([
T("b2-futur-ii", "Futur II — das Vollendete in der Zukunft", "المستقبل التامّ — ما سينتهي قبل لحظةٍ قادمة",
  "Futur II = werden + Objekt + Partizip II + haben/sein: يُستعمل لما يكون قد تمّ قبل نقطة مستقبلية مرجعية: «Bis 18 Uhr werde ich den Bericht fertiggestellt haben». في B2 يميّز المتقدّم من يقول «سأُنهي» عمن يقول «سأكون قد أنهيت».",
  [("Bildung: werden … Partizip II + haben/sein", "الفعل المساعد ثانياً، واسم المفعول ومساعده في آخر الجملة"),
   ("Zeitanker nötig: bis morgen, um 18 Uhr, bis dahin", "لا يُستعمل بلا مرساة زمن (bis …) وإلا كان Perfekt كافياً"),
   ("Vermutung über Vergangenes: Er wird den Zug verpasst haben", "الاستعمال الراقي الثاني: ترجيح في الماضي «يكون قد فاته القطار»")],
  [["", "regelmäßig", "unregelmäßig"], ["Ich werde …", "gelernt haben", "gefahren sein"]],
  [("Bis Freitag werde ich alle Vokabeln gelernt haben.", "بحلول الجمعة سأكون قد حفظت كل المفردات."),
   ("Wenn du ankommst, wird das Konzert schon begonnen haben.", "حين تصل ستكون الحفلة قد بدأت."),
   ("Sie wird den Termin nicht vergessen haben — sie ist doch pünktlich!", "لن تكون قد نسيت الموعد — فهي دقيقة! (ترجيح ماضٍ)")],
  [("„Ich werde den Bericht fertig machen haben“ ✗", "لا يُكدَّس المصدر مع haben: الصحيح werde … gemacht haben"),
   ("sein-Verben behalten sein: „Er wird angekommen sein“ ✓", "أفعال الحركة والتغيّر مع sein حتى في Futur II")],
  [{"id": "gf2e1", "type": "fill", "promptDe": "Bis 20 Uhr ___ ich die Aufgabe ___ ___. (lösen)", "text": "Bis 20 Uhr ___ ich die Aufgabe ___ ___.", "answer": ["werde", "gelöst", "haben"], "explanationAr": "werde ثانياً + gelöst + haben في النهاية."},
   {"id": "gf2e2", "type": "mc", "promptDe": "Er ___ den Zug ___, sonst wäre er längst da.", "options": ["wird verpasst haben", "wird verpassen haben", "hat verpasst werden"], "answer": "wird verpasst haben", "explanationAr": "ترجيح ماضٍ بـ Futur II: wird + Partizip + haben."},
   {"id": "gf2e3", "type": "order", "promptDe": "رتب: (Bis Montag / werden / wir / die Recherche / abgeschlossen / haben)", "answer": ["Bis Montag", "werden", "wir", "die Recherche", "abgeschlossen", "haben"], "explanationAr": "المرساة أولاً ثم werden ثم الفاعل ثم البقية ثم abgeschlossen haben."},
   {"id": "gf2e4", "type": "fill", "promptDe": "Wenn wir ankommen, ___ der Film schon ___ ___. (beginnen)", "text": "Wenn wir ankommen, ___ der Film schon ___ ___.", "answer": ["wird", "begonnen", "haben"], "explanationAr": "beginnen مع haben؛ der Film مذكر."},
   {"id": "gf2e5", "type": "mc", "promptDe": "Welches Futur II von „eintreffen“ ist korrekt?", "options": ["wird eingetroffen haben", "wird eingetroffen sein", "ist eingetroffen haben"], "answer": "wird eingetroffen sein", "explanationAr": "eintreffen حركة ووصول ← sein."}])
,
T("b2-relativ-generalisierend", "Generalisierende Relativsätze — wer · was", "العلاقات العامة — من…ف…/ما…ف…",
  "بدل «الطلاب الذين…» يعمّم B2 بصيغة مبرمة: «Wer lernen will, findet Wege». وبعد alles/nichts/das تأتي was وحدها، وللتعليق على جملة كاملة جاء was أسلوب ضغط الحجة.",
  [("wer … , der/die/das … — Verallgemeinerung", "من… فذلك… — تعميم على الأشخاص والجملة الثانية تبدأ بمرجع"),
   ("alles / nichts / vieles + was (niemals „das“)", "بعد alles وnichts وvieles تأتي was وحدها — قاعدة حديدية"),
   ("was als Satzbezug: „Er kam zu spät, was den Chef ärgerte.“", "الإشارة إلى الواقعة كلها لا إلى كلمة — ضغط الحجة في جملة"),
   ("Sprichwörter als Muster: „Was Hänschen nicht lernt…“", "الأَمْثال المأثورة تُحفظ وتُعاد تراكيبها في الإنشاء")],
  [["Singular", "Plural"], ["wer … , der …", "wer … , die …"]],
  [("Wer anderen eine Grube gräbt, fällt selbst hinein.", "من يحفر حفرةً يقع فيها."),
   ("Alles, was zählt, steht im Vertrag.", "كل ما يُعتدّ به مكتوب في العقد."),
   ("Der Film war langweilig, was niemand zugeben wollte.", "ملّل الفيلم — وهذا ما لم يرد أحد الاعتراف به.")],
  [("„Alles, das ich habe“ ✗", "بعد alles فقط was — لا das"),
   ("Im Nachsatz nie ein zweites „wer“", "«Wer kommt, der ist willkommen» ✓؛ «Wer kommt, wer…» ✗ تكرار الواصل")],
  [{"id": "grge1", "type": "mc", "promptDe": "Alles, ___ im Vertrag steht, ist verhandelbar.", "options": ["was", "das", "welches"], "answer": "was", "explanationAr": "بعد alles ← was أبداً."},
   {"id": "grge2", "type": "fill", "promptDe": "___ früh übt sich, wird ein Meister.", "text": "___ früh übt sich, wird ein Meister.", "answer": ["Wer"], "explanationAr": "المثل يبدأ بـ Wer؛ المرجع der محذوف جمالياً في المأثور."},
   {"id": "grge3", "type": "mc", "promptDe": "Er wurde übersehen, ___ niemand im Protokoll dokumentierte.", "options": ["was", "dass", "worauf"], "answer": "was", "explanationAr": "الإشارة إلى الواقعة كلها بـ was."},
   {"id": "grge4", "type": "order", "promptDe": "رتب: (Wer / nicht / lernt / , / der / verliert / die Zukunft)", "answer": ["Wer", "nicht", "lernt", ",", "der", "verliert", "die", "Zukunft"], "explanationAr": "جملة wer ففاصلة فجملة der رئيسية."},
   {"id": "grge5", "type": "mc", "promptDe": "Nichts, ___ er versprach, wurde gehalten.", "options": ["was", "das", "wie"], "answer": "was", "explanationAr": "نفس القاعدة بعد nichts."}])
,
T("b2-doppelkonnektoren", "Zweiteilige Konnektoren — sowohl…als auch · je…desto", "الروابط المزدوجة — كذلك…وكذا وكلّما…ازداد",
  "أسلوب B2 الحجاجي: sowohl…als auch، entweder…oder، weder…noch، je…desto/umso، nicht nur…sondern auch، zwar…aber — لا تُقلِب موضع الفعل، لكنها توازن الحجج في نَفَس واحد.",
  [("Beide Teilsätze bleiben Hauptsätze: Verb auf Position 2", "كل نصف جملة رئيسية بقواعدها — لا قلب بعد sowohl ونظائرها"),
   ("je + Komparativ (Verb am Ende!) , desto/umso + Komparativ + Verb", "كلّما…ازداد: je جملة تابعة فعلها للآخر، وdesto مع المقارن ثم الفعل"),
   ("nicht nur … , sondern auch … — das Gegenstück muss parallel sein", "البنية المتقابلة تلزم: اسم مقابل اسم، فعل مقابل فعل")],
  [["Konstruktion", "Muster"], ["sowohl … als auch", "sowohl A als auch B"], ["je … , desto …", "je mehr du übst, desto leichter wird es"]],
  [("Sowohl die Mieter als auch die Vermieter forderten klare Regeln.", "كلا الطرفين طالب بقواعد جلية."),
   ("Je teurer Wohnraum wird, desto erfinderischer werden die Kommunen.", "كلما غلا السكن ازدادت البلديات ابتكاراً."),
   ("Zwar verspricht die App Datenschutz, aber die Praxis zeigt das Gegenteil.", "صحيح أنها تعدُ بالحماية، لكن الواقع يخالف.")],
  [("„Je mehr man übt, mehr wird es leichter“ ✗", "desto عمود البناء؛ تُحذف فلا يقوم"),
   ("„Sowohl A aber auch B“ ✗", "als auch، لا aber — خلط شائع"),
   ("weder … noch — ohne zusätzliches „nicht“", "النفي داخل الزوج — لا يُضاعف")],
  [{"id": "gdke1", "type": "mc", "promptDe": "Je schneller man liest, ___ weniger behält man.", "options": ["desto", "als", "wie"], "answer": "desto", "explanationAr": "الزوج الأبدي je…desto؛ umso بديل مقبول."},
   {"id": "gdke2", "type": "fill", "promptDe": "Sowohl die Lehrer ___ ___ die Schüler protestierten.", "text": "Sowohl die Lehrer ___ ___ die Schüler protestierten.", "answer": ["als", "auch"], "explanationAr": "als auch — لا aber auch."},
   {"id": "gdke3", "type": "order", "promptDe": "رتب: (Entweder / übst / du / , / oder / das / Zertifikat / wartet / nicht)", "answer": ["Entweder", "übst", "du", ",", "oder", "das", "Zertifikat", "wartet", "nicht"], "explanationAr": "entweder بالمقدمة ثم القلب، وoder رئيسية كاملة بعدها."},
   {"id": "gdke4", "type": "mc", "promptDe": "Er spricht weder Englisch ___ Französisch.", "options": ["noch", "oder", "auch nicht"], "answer": "noch", "explanationAr": "weder…noch — بلا nicht إضافية."},
   {"id": "gdke5", "type": "fill", "promptDe": "Nicht nur die Mieten stiegen, sondern auch die ___. (Zusatzkosten für Heizung u. a.)", "text": "Nicht nur die Mieten stiegen, sondern auch die ___.", "answer": ["Nebenkosten"], "explanationAr": "الاسم المقابل للمieten في البنية المزدوجة هو المطلوب وحده."}])
,
]))
blob = json.dumps(new, ensure_ascii=False)
assert not re.search(r"[\u4e00-\u9fff\u3000-\u303f]", blob), "تلوّث باقٍ بعد التطهير"
for k, t in new.items():
    assert len(t["rules"]) >= 3 and len(t["examples"]) >= 3 and len(t["pitfalls"]) >= 2 and len(t["exercises"]) >= 5, k
    for e in t["exercises"]:
        assert e["type"] in ("fill", "mc", "order", "translate") and e.get("answer") is not None, (k, e.get("id"))
        assert "___" in e.get("promptDe", "") or "رتب" in e.get("promptDe", "") or "?" in e.get("promptDe", ""), (k, e["id"])
g.update(new)
json.dump(g, open("content/grammar.json", "w"), ensure_ascii=False, indent=1)
print("grammar ✓", len(g), "موضوعاً — الثلاثة مكتملة ومعقولة البنية")
