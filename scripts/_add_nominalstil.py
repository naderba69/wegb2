# -*- coding: utf-8 -*-
"""درس b2-nominalstil — يُدرج مرة واحدة (idempotent). التمارين الإنتاجية تأتي من lib/stil.ts في الواجهة؛
هنا نواة ثابتة: تعرّف + ملء + 3 تحويلات (مطابقة لبنك stil.ts)."""
import json, io
p = "content/grammar.json"
g = json.load(io.open(p, encoding="utf8"))
if "b2-nominalstil" in g:
    print("موجود — لا شيء"); raise SystemExit
g["b2-nominalstil"] = {
  "id": "b2-nominalstil", "titleDe": "Nominalstil und Verbalstil", "titleAr": "الأسلوب الاسمي والفعلي — مفتاح الرسالة الرسمية",
  "level": "B2",
  "summaryAr": "الفكرة الواحدة تُقال بطريقتين: جملة فرعية بفعل (Weil die Mieten steigen …) أو عبارة اسمية بحرف جرّ (Wegen der steigenden Mieten …). الأولى «فعلية» طبيعية في الكلام والرسائل الشخصية، والثانية «اسمية» رسمية مطلوبة في الشكاوى والتقارير والمقالات. امتحان B2 يقيس قدرتك على التنقّل بينهما بوعي — لا على تفضيل إحداهما.",
  "summaryDe": "Derselbe Inhalt – zwei Register: Nebensatz mit Verb (Verbalstil) oder Präposition + Nomen (Nominalstil).",
  "rules": [
    {"de": "weil → wegen + Genitiv", "ar": "السبب: weil das Wetter schlecht war → wegen des schlechten Wetters. الفاعل يصبح مضافاً إليه."},
    {"de": "obwohl → trotz + Genitiv", "ar": "التناقض: obwohl es regnete → trotz des Regens."},
    {"de": "wenn / als → bei + Dativ", "ar": "الشرط والزمن معاً: wenn es regnet → bei Regen · als ich ankam → bei meiner Ankunft."},
    {"de": "nachdem → nach + Dativ · bevor → vor + Dativ", "ar": "التتابع: nachdem er angekommen war → nach seiner Ankunft · bevor die Prüfung beginnt → vor Beginn der Prüfung."},
    {"de": "damit / um … zu → zu / zur / zum + Nomen", "ar": "الغاية: um Energie zu sparen → zur Energieeinsparung (zur للمؤنث، zum للمذكر والمحايد)."},
    {"de": "indem → durch + Akkusativ", "ar": "الوسيلة: indem man recycelt → durch Recycling."},
    {"de": "Verb → -ung (die) / das + Infinitiv", "ar": "erhöhen → die Erhöhung · lesen → das Lesen. كل اسم بـ-ung مؤنّث، وكل مصدر مُسمّى محايد — بلا استثناء."}
  ],
  "tables": [
    {"captionAr": "جدول التحويل السبعة", "headers": ["العلاقة", "فعلي (Nebensatz)", "اسمي (Präposition + Nomen)", "الحالة"],
     "rows": [["سبب", "weil", "wegen", "Genitiv"], ["تناقض", "obwohl", "trotz", "Genitiv"], ["شرط/زمن", "wenn / als", "bei", "Dativ"], ["بعد", "nachdem", "nach", "Dativ"], ["قبل", "bevor", "vor", "Dativ"], ["غاية", "damit / um…zu", "zu / zur / zum", "Dativ"], ["وسيلة", "indem", "durch", "Akkusativ"]]},
    {"captionAr": "متى أيّهما؟", "headers": ["النصّ", "الأسلوب الغالب", "لماذا"],
     "rows": [["رسالة شكوى / طلب رسمي", "اسمي", "موضوعي ومختصر — Wegen der Lieferverzögerung bitte ich um …"], ["مقال رأي (Erörterung)", "مزيج", "الاسمي للحجج، الفعلي للأمثلة"], ["بريد لصديق", "فعلي", "الاسمي يبدو بيروقراطياً بارداً"], ["ملخّص تقرير", "اسمي", "كثافة معلومات في كلمات قليلة"]]}
  ],
  "examples": [
    {"de": "Wegen des Streiks fielen alle Züge aus. = Weil gestreikt wurde, fielen alle Züge aus.", "ar": "بسبب الإضراب أُلغيت كل القطارات. — الجملتان صحيحتان؛ الأولى في تقرير، الثانية في حديث."},
    {"de": "Zur Verbesserung der Luftqualität baut die Stadt Radwege.", "ar": "لتحسين جودة الهواء تبني المدينة مسارات دراجات. — zur + Verbesserung (مؤنث بـ-ung)."},
    {"de": "Trotz seiner Krankheit nahm er an der Sitzung teil.", "ar": "رغم مرضه شارك في الجلسة. — trotz + Genitiv: seiner Krankheit."}
  ],
  "pitfalls": [
    {"de": "„wegen dem Wetter“ ✗ (schriftlich) → wegen des Wetters ✓", "ar": "في الكلام يشيع Dativ بعد wegen/trotz، لكن الامتحان الكتابي يريد Genitiv."},
    {"de": "„zur Erhöhen“ ✗ → zur Erhöhung ✓ / zum Erhöhen ✓", "ar": "zur تأتي مع اسم مؤنث (-ung)؛ المصدر المُسمّى محايد فيأخذ zum."},
    {"de": "Nominalstil überall ✗", "ar": "نصّ كلّه اسمي يفقد نقاط «Angemessenheit» في بريد شخصي — الأسلوب يتبع المخاطَب."},
    {"de": "„Bei Regen es findet …“ ✗ → Bei Regen findet es … ✓", "ar": "العبارة الاسمية في البداية تشغل الموضع الأول ⇒ الفعل يأتي مباشرة بعدها (Inversion)."}
  ],
  "exercises": [
    {"id": "b2-nominalstil-1", "type": "mc", "promptDe": "Welcher Satz ist im Nominalstil?", "options": ["Weil es regnete, blieben wir zu Hause.", "Wegen des Regens blieben wir zu Hause.", "Es regnete, deshalb blieben wir zu Hause."], "answer": "Wegen des Regens blieben wir zu Hause.", "explanationAr": "wegen + Genitiv بدل جملة weil — هذه علامة الأسلوب الاسمي."},
    {"id": "b2-nominalstil-2", "type": "mc", "promptDe": "Welche Präposition ersetzt „obwohl“?", "options": ["wegen", "trotz", "bei", "durch"], "answer": "trotz", "explanationAr": "obwohl (تناقض) → trotz + Genitiv."},
    {"id": "b2-nominalstil-3", "type": "fill", "promptDe": "Um Energie zu sparen → _____ Energieeinsparung", "promptAr": "أكمل حرف الجرّ المدمج", "answer": ["zur", "Zur"], "explanationAr": "Einsparung مؤنث (-ung) ⇒ zu der = zur."},
    {"id": "b2-nominalstil-4", "type": "fill", "promptDe": "Wegen _____ schlechten Wetters fiel der Zug aus.", "promptAr": "أداة التعريف في الحالة الصحيحة", "answer": ["des"], "explanationAr": "wegen + Genitiv: des schlechten Wetters."},
    {"id": "b2-nominalstil-u1", "type": "umformung", "quelleDe": "Obwohl es stark regnete, fand das Konzert statt.", "promptDe": "Schreibe im Nominalstil (trotz + Genitiv):", "answer": "Trotz des starken Regens fand das Konzert statt.", "mussEnthalten": ["trotz", "regens"], "darfNicht": ["obwohl"], "explanationAr": "obwohl → trotz + Genitiv؛ الصفة تأخذ -en بعد des.", "points": 2},
    {"id": "b2-nominalstil-u2", "type": "umformung", "quelleDe": "Bei Regen findet das Fest in der Halle statt.", "promptDe": "Schreibe im Verbalstil (wenn + Nebensatz):", "answer": "Wenn es regnet, findet das Fest in der Halle statt.", "mussEnthalten": ["wenn", "regnet"], "darfNicht": ["bei regen"], "explanationAr": "bei + Dativ → wenn + جملة فرعية (الفعل في آخرها) ثم الفعل الرئيسي مباشرة بعد الفاصلة.", "points": 2},
    {"id": "b2-nominalstil-u3", "type": "umformung", "quelleDe": "Die Stadt baut Radwege, damit die Luft besser wird.", "promptDe": "Schreibe im Nominalstil (zur + Nomen):", "answer": "Die Stadt baut Radwege zur Verbesserung der Luft.", "alternativen": ["Zur Verbesserung der Luft baut die Stadt Radwege."], "mussEnthalten": ["zur verbesserung"], "darfNicht": ["damit"], "explanationAr": "damit → zur + Verbesserung (مؤنث) + Genitiv للمفعول (der Luft).", "points": 2}
  ]
}
io.open(p, "w", encoding="utf8").write(json.dumps(g, ensure_ascii=False, indent=2) + "\n")
print("✔ أُدرج b2-nominalstil —", len(g), "درساً")
