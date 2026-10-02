import json

grammar = json.load(open("content/grammar.json"))

NEW_ORDER_EXERCISES = {
    "a1-sein-haben": {
        "id": "a1-sein-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "bin", "heute", "in Berlin."],
        "explanationAr": "الفعل دائماً في الموضع الثاني في الجملة الخبرية: Ich bin heute in Berlin."
    },
    "a1-pronomen": {
        "id": "a1-pro-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Wir", "lernen", "jeden Tag", "Deutsch."],
        "explanationAr": "الفاعل في الموضع الأول والفعل المصرف في الموضع الثاني: Wir lernen jeden Tag Deutsch."
    },
    "a1-war-hatte": {
        "id": "a1-wh-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Gestern", "hatte", "ich", "keine Zeit."],
        "explanationAr": "عند البدء بالظرف الزمني (Gestern) يتقدم الفعل إلى الموضع الثاني ويليه الفاعل: Gestern hatte ich keine Zeit."
    },
    "a1-praesens": {
        "id": "a1-praes-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Er", "liest", "gern", "ein Buch."],
        "explanationAr": "الفعل مع تغيير حرف العلة (lesen -> liest) في المركز الثاني: Er liest gern ein Buch."
    },
    "a1-zahlen": {
        "id": "a1-zahl-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Der Zug", "fährt", "um acht Uhr", "ab."],
        "explanationAr": "الفعل المنفصل (abfahren): الجذر في المركز الثاني (fährt) والسابقة في نهاية الجملة (ab)."
    },
    "a1-akkusativ": {
        "id": "a1-akk-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "kaufe", "einen neuen", "Tisch."],
        "explanationAr": "مفعول Akkusativ المذكر يأخذ einen: Ich kaufe einen neuen Tisch."
    },
    "a2-perfekt": {
        "id": "a2-perf-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Wir", "haben", "gestern", "Fußball", "gespielt."],
        "explanationAr": "مشبك الجملة في الماضي Perfekt: الفعل المساعد (haben) في المركز الثاني والتصريف الثالث (gespielt) في النهاية."
    },
    "a2-wechsel": {
        "id": "a2-wechsel-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "stelle", "die Lampe", "auf den Tisch."],
        "explanationAr": "حركة وتغيير مكان (stellen + wohin) تستوجب حالة النصب Akkusativ: auf den Tisch."
    },
    "a2-dativ": {
        "id": "a2-dat-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "helfe", "dem Mann", "beim Umzug."],
        "explanationAr": "الفعل helfen يتطلب مجرور Dativ: dem Mann."
    },
    "a2-negation": {
        "id": "a2-neg-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "habe", "heute", "kein Geld."],
        "explanationAr": "نفي الأسماء النكرة أو غير المسبوقة بأداة يكون بـ kein: kein Geld."
    },
    "a2-imperativ": {
        "id": "a2-imp-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Kommen", "Sie", "bitte", "pünktlich!"],
        "explanationAr": "في صيغة الأمر مع الاحترام (Sie) يبدأ الفعل في المركز الأول ويليه الضمير: Kommen Sie bitte pünktlich!"
    },
    "a2-reflexiv": {
        "id": "a2-refl-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "freue", "mich", "auf das Wochenende."],
        "explanationAr": "الضمير المنعكس (mich) يأتي مباشرة بعد الفعل في الجملة الرئيسية: Ich freue mich auf das Wochenende."
    },
    "a2-steigerung": {
        "id": "a2-steig-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Mein Bruder", "ist", "größer", "als ich."],
        "explanationAr": "في المقارنة Komparativ نستخدم الصفة المنتهية بـ -er متبوعة بـ als: größer als ich."
    },
    "a2-futur": {
        "id": "a2-fut-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Wir", "werden", "morgen", "nach Hamburg", "reisen."],
        "explanationAr": "مشبك المستقبل Futur I: الفعل المساعد werden في المركز الثاني والمصدر reisen في آخر الجملة."
    },
    "b1-genitiv": {
        "id": "b1-gen-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Das ist", "das Auto", "meines", "Vaters."],
        "explanationAr": "المضاف إليه Genitiv للمذكر يأخذ meines والاسم ينتهي بـ -s: meines Vaters."
    },
    "b1-adjektivendungen": {
        "id": "b1-adj-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "trinke", "einen heißen", "Kaffee."],
        "explanationAr": "نهايات الصفات مع أداة النكرة في Akkusativ المذكر تأخذ -en: einen heißen Kaffee."
    },
    "b1-wortbildung": {
        "id": "b1-wort-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Die Fahrkarte", "liegt", "auf dem Schreibtisch."],
        "explanationAr": "تركيب الكلمات Komposita مع موضع الفعل الثاني: Die Fahrkarte liegt auf dem Schreibtisch."
    },
    "b1-unbestimmte": {
        "id": "b1-unb-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Hat", "jemand", "meinen Schlüssel", "gesehen?"],
        "explanationAr": "سؤال بالفعل (Ja/Nein-Frage): يبدأ الفعل في المركز الأول ويليه الضمير غير المحدد jemand."
    },
    "b1-verb-praeposition": {
        "id": "b1-vpraep-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Wir", "warten", "an der Haltestelle", "auf den Bus."],
        "explanationAr": "الفعل warten يتطلب حرف الجر auf مع حالة النصب Akkusativ: auf den Bus."
    },
    "b1-passiv": {
        "id": "b1-pas-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Das Haus", "wird", "im Sommer", "renoviert."],
        "explanationAr": "مشبك المبني للمجهول Passiv: werden في المركز الثاني واسم المفعول renoviert في نهاية الجملة."
    },
    "b1-konj2": {
        "id": "b1-k2-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Ich", "würde", "gern", "nach Deutschland", "reisen."],
        "explanationAr": "صيغة التمني Konjunktiv II: würden في المركز الثاني والمصدر reisen في آخر الجملة."
    },
    "b2-modalpartikel": {
        "id": "b2-mpart-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Das ist", "doch", "kein Problem!"],
        "explanationAr": "أداة النبرة doch للتأكيد الودي تأتي في منتصف الجملة (Mittelfeld)."
    },
    "b2-nominalstil": {
        "id": "b2-nom-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Wegen des Regens", "wurde", "das Spiel", "abgesagt."],
        "explanationAr": "الأسلوب الاسمي مع حرف الجر wegen متبوعاً بالمضاف إليه des Regens، والفعل في المركز الثاني: wurde."
    },
    "b2-funktionsverben": {
        "id": "b2-fverb-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Wir", "müssen", "eine wichtige", "Entscheidung", "treffen."],
        "explanationAr": "التركيب الفعلي Funktionsverbgefüge: eine Entscheidung treffen مع الفعل المساعد müssen."
    },
    "b2-infinitiv": {
        "id": "b2-inf-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Es ist wichtig,", "jeden Tag", "neue Wörter", "zu lernen."],
        "explanationAr": "جملة المصدر الممتدة مع zu: تأتي zu مباشرة قبل الفعل المصدري في نهاية الجملة: zu lernen."
    },
    "b2-partizip": {
        "id": "b2-part-ord1",
        "type": "order",
        "promptDe": "Bringe die Wörter in die richtige Reihenfolge:",
        "answer": ["Der", "von allen geschätzte", "Kollege", "geht in Rente."],
        "explanationAr": "النعت الاسمي المشتق Partizipialattribut: يوضع قبل الاسم موصوفاً مع نهايات الصفات: Der von allen geschätzte Kollege."
    }
}

added = 0
for gid, ex in NEW_ORDER_EXERCISES.items():
    if gid in grammar:
        # تأكد من عدم التكرار
        exs = grammar[gid].get("exercises", [])
        if not any(x.get("id") == ex["id"] for x in exs):
            exs.append(ex)
            grammar[gid]["exercises"] = exs
            added += 1

print(f"تمت إضافة {added} تمريناً جديداً لترتيب الكلمات وبناء الجمل في دروس القواعد!")

with open("content/grammar.json", "w", encoding="utf-8") as f:
    json.dump(grammar, f, ensure_ascii=False, indent=2)
