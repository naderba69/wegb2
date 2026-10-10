#!/usr/bin/env python3
"""R143a: complete A0 reading/listening checks and correct small language errors."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    return json.loads((ROOT / "content" / name).read_text(encoding="utf-8"))


def save(name, data):
    (ROOT / "content" / name).write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def upsert_question(item, question):
    questions = item.setdefault("questions", [])
    old = next((q for q in questions if q.get("id") == question["id"]), None)
    if old is None:
        questions.append(question)
    else:
        old.update(question)


# Each question has a direct, verbatim cue in its reading; r141e_quality.py
# adds/validates the same citations in the learner-facing Arabic explanation.
reading_questions = {
    "t-a0-06": {
        "id": "t-a0-06-q2", "type": "mc",
        "promptDe": "Welche Sprache sprechen die Lernenden zusammen?",
        "promptAr": "ما اللغة التي يتحدث بها المتعلمون معاً؟",
        "options": ["Deutsch", "Englisch", "Arabisch", "Französisch"],
        "answer": "Deutsch",
        "explanationAr": "«Wir sprechen zusammen Deutsch.» — يتحدثون الألمانية معاً.",
    },
    "t-a0-07": {
        "id": "t-a0-07-q2", "type": "mc",
        "promptDe": "Wann besucht die Person ihre Familie?",
        "promptAr": "متى يزور المتحدث عائلته؟",
        "options": ["Am Montag", "Am Donnerstag", "Am Samstag", "Am Sonntag"],
        "answer": "Am Sonntag",
        "explanationAr": "«Am Sonntag besuche ich meine Familie.» — يزور عائلته يوم الأحد.",
    },
    "t-a0-08": {
        "id": "t-a0-08-q2", "type": "mc",
        "promptDe": "Was isst die Person zum Abendbrot?",
        "promptAr": "ماذا يأكل المتحدث في العشاء؟",
        "options": ["Brot und Käse", "Reis und Fleisch", "Obst", "Kuchen"],
        "answer": "Obst",
        "explanationAr": "«Zum Abendbrot trinke ich Tee und esse Obst.» — يأكل الفاكهة في العشاء.",
    },
    "t-a0-09": {
        "id": "t-a0-09-q2", "type": "mc",
        "promptDe": "Wann geht die Person nach Hause?",
        "promptAr": "متى يعود المتحدث إلى البيت؟",
        "options": ["Um 9 Uhr", "Um 12 Uhr", "Um 17 Uhr", "Um 19 Uhr"],
        "answer": "Um 17 Uhr",
        "explanationAr": "«Um 17 Uhr gehe ich nach Hause.» — يعود إلى البيت في الساعة الخامسة مساءً.",
    },
    "t-a0-10": {
        "id": "t-a0-10-q2", "type": "mc",
        "promptDe": "Was trägt die Person im Winter?",
        "promptAr": "ماذا يرتدي المتحدث في الشتاء؟",
        "options": ["Eine dicke Jacke", "Ein T-Shirt", "Ein Kleid", "Eine kurze Hose"],
        "answer": "Eine dicke Jacke",
        "explanationAr": "«Ich trage eine dicke Jacke.» — يرتدي سترة سميكة.",
    },
    "t-a0-011": {
        "id": "t-a0-011-q2", "type": "mc",
        "promptDe": "Wohin nimmt die Person die Tasche jeden Morgen?",
        "promptAr": "إلى أين يأخذ المتحدث الحقيبة كل صباح؟",
        "options": ["In den Park", "Zur Arbeit", "In die Schule", "Zum Bahnhof"],
        "answer": "In die Schule",
        "explanationAr": "«Ich nehme sie jeden Morgen in die Schule.» — يأخذها إلى المدرسة كل صباح.",
    },
    "t-a0-012": {
        "id": "t-a0-012-q2", "type": "mc",
        "promptDe": "Mit welchem Tier geht die Person am Samstag im Park spazieren?",
        "promptAr": "مع أي حيوان يتمشى المتحدث في الحديقة يوم السبت؟",
        "options": ["Mit einer Katze", "Mit einem Hund", "Mit einem Pferd", "Mit einem Vogel"],
        "answer": "Mit einem Hund",
        "explanationAr": "«Am Nachmittag gehe ich mit meinem Hund im Park spazieren.» — يتمشى مع كلبه.",
    },
    "t-a0-013": {
        "id": "t-a0-013-q2", "type": "mc",
        "promptDe": "Was zieht die Person an?",
        "promptAr": "ماذا يرتدي المتحدث؟",
        "options": ["Ein T-Shirt und eine Jeans", "Eine dicke Jacke", "Ein Hemd und eine Hose", "Ein Kleid"],
        "answer": "Ein T-Shirt und eine Jeans",
        "explanationAr": "«Ich ziehe ein T-Shirt und eine Jeans an.» — يرتدي قميصاً وبنطال جينز.",
    },
    "t-a0-014": {
        "id": "t-a0-014-q2", "type": "mc",
        "promptDe": "Was bestellt die Person zu essen?",
        "promptAr": "ماذا يطلب المتحدث ليأكل؟",
        "options": ["Eine Suppe und ein Schnitzel mit Kartoffeln", "Nur einen Salat", "Brot mit Käse", "Fisch mit Reis"],
        "answer": "Eine Suppe und ein Schnitzel mit Kartoffeln",
        "explanationAr": "«Heute bestelle ich eine Suppe und ein Schnitzel mit Kartoffeln.» — يطلب حساءً وشنيتسل مع البطاطس.",
    },
    "t-a0-015": {
        "id": "t-a0-015-q2", "type": "mc",
        "promptDe": "Was steht im Wohnzimmer?",
        "promptAr": "ماذا يوجد في غرفة المعيشة؟",
        "options": ["Ein Sofa", "Ein Bett", "Ein Tisch", "Ein Schreibtisch"],
        "answer": "Ein Sofa",
        "explanationAr": "«Im Wohnzimmer steht ein Sofa vor dem Fernseher.» — توجد أريكة أمام التلفاز في غرفة المعيشة.",
    },
}
reading_evidence = {
    "t-a0-06-q2": "Wir sprechen zusammen Deutsch.",
    "t-a0-07-q2": "Am Sonntag besuche ich meine Familie.",
    "t-a0-08-q2": "Zum Abendbrot trinke ich Tee und esse Obst.",
    "t-a0-09-q2": "Um 17 Uhr gehe ich nach Hause.",
    "t-a0-10-q2": "Ich trage eine dicke Jacke.",
    "t-a0-011-q2": "Ich nehme sie jeden Morgen in die Schule.",
    "t-a0-012-q2": "Am Nachmittag gehe ich mit meinem Hund im Park spazieren.",
    "t-a0-013-q2": "Ich ziehe ein T-Shirt und eine Jeans an.",
    "t-a0-014-q2": "Heute bestelle ich eine Suppe und ein Schnitzel mit Kartoffeln.",
    "t-a0-015-q2": "Im Wohnzimmer steht ein Sofa vor dem Fernseher.",
}

texts = load("texts.json")
text_by_id = {text["id"]: text for text in texts}
assert set(reading_questions) <= text_by_id.keys(), "A0 reading id missing"
# Clarify the scope of the number-series question: 12 is mentioned later as a
# house number, but is not one of the number words in the opening sequence.
number_q = next(q for q in text_by_id["t-a0-02"]["questions"] if q["id"] == "t-a0-02-q2")
number_q["promptDe"] = "Welche Zahl aus den Antwortmöglichkeiten kommt in der ersten Zahlenreihe nicht vor?"
number_q["promptAr"] = "أيّ عدد من الخيارات لا يظهر في سلسلة الأعداد الأولى؟"
number_q["explanationAr"] = "في السلسلة الأولى تُذكر الأعداد بالكلمات من eins bis zehn؛ أما zwölf فلا يظهر فيها."
# Small, evidence-preserving A0 style repairs.
text_by_id["t-a0-08"]["de"] = text_by_id["t-a0-08"]["de"].replace(
    "Mein Lieblingsobst ist Apfel.", "Mein Lieblingsobst ist der Apfel."
)
text_by_id["t-a0-014"]["de"] = text_by_id["t-a0-014"]["de"].replace(
    "Dazu trinke ich ein Wasser.", "Dazu trinke ich ein Glas Wasser."
)
text_by_id["t-a0-014"]["questions"][0]["explanationAr"] = (
    "النص يقول: «Dazu trinke ich ein Glas Wasser.» — ويشرب معه كأساً من الماء."
)
for text_id, question in reading_questions.items():
    upsert_question(text_by_id[text_id], question)
for text in texts:
    for question in text.get("questions", []):
        evidence = reading_evidence.get(question.get("id"))
        if evidence:
            assert evidence in text.get("de", ""), f"reading evidence missing: {question['id']}"
            marker = f"«{evidence}»"
            if marker not in question.get("explanationAr", ""):
                question["explanationAr"] = f"الدليل في النص: {marker} — {question.get('explanationAr', '')}"
assert len(text_by_id["t-a0-06"]["questions"]) == 2
assert all(len(text_by_id[t]["questions"]) >= 2 for t in reading_questions)
save("texts.json", texts)

# Add a second listening-comprehension question to every A0 dialogue that had
# only one. Citations are checked against the actual transcript before saving.
dialogue_questions = {
    "d-a0-05": {
        "id": "d-a0-05-q2", "type": "mc",
        "promptDe": "Was bittet die Mitarbeiterin den Kunden zuerst zu tun?",
        "promptAr": "ماذا تطلب الموظفة من العميل أن يفعل أولاً؟",
        "options": ["Seinen Namen zu buchstabieren", "Seine Telefonnummer aufzuschreiben", "Einen Kaffee zu bestellen", "Seinen Ausweis zu zeigen"],
        "answer": "Seinen Namen zu buchstabieren",
        "explanationAr": "«Buchstabieren Sie bitte!» — تطلب منه تهجئة اسمه.",
    },
    "d-a0-06": {
        "id": "d-a0-06-q2", "type": "mc",
        "promptDe": "Was möchte der Gast zusätzlich zum Kaffee?",
        "promptAr": "ماذا يريد الضيف إضافةً إلى القهوة؟",
        "options": ["Ein Glas Wasser", "Einen Kuchen", "Einen Tee", "Ein Sandwich"],
        "answer": "Ein Glas Wasser",
        "explanationAr": "«Und ein Glas Wasser.» — يريد كأساً من الماء أيضاً.",
    },
    "d-a0-08": {
        "id": "d-a0-08-q2", "type": "mc",
        "promptDe": "Was wünscht A der anderen Person?",
        "promptAr": "ماذا يتمنى A للشخص الآخر؟",
        "options": ["Schönen Tag noch", "Gute Nacht", "Guten Morgen", "Viel Glück"],
        "answer": "Schönen Tag noch",
        "explanationAr": "«Schönen Tag noch!» — يتمنى A للشخص الآخر يوماً سعيداً.",
    },
    "d-a0-09": {
        "id": "d-a0-09-q2", "type": "mc",
        "promptDe": "Wie viel Geld gibt der Kunde?",
        "promptAr": "كم من المال يعطي العميل؟",
        "options": ["3,40 Euro", "4 Euro", "5 Euro", "2,50 Euro"],
        "answer": "5 Euro",
        "explanationAr": "«Hier sind 5 Euro.» — يعطي العميل خمسة يورو.",
    },
    "d-a0-10": {
        "id": "d-a0-10-q2", "type": "mc",
        "promptDe": "Wie spät ist es?",
        "promptAr": "كم الساعة؟",
        "options": ["Halb drei", "Viertel nach drei", "Drei Uhr", "Viertel vor drei"],
        "answer": "Halb drei",
        "explanationAr": "«Es ist halb drei.» — الساعة الثانية والنصف (2:30).",
    },
    "d-a0-11": {
        "id": "d-a0-11-q2", "type": "mc",
        "promptDe": "Hat der Patient Husten?",
        "promptAr": "هل لدى المريض سعال؟",
        "options": ["Ja, er hat Husten", "Nein, er hat keinen Husten", "Die Ärztin weiß es nicht", "Nur am Morgen"],
        "answer": "Nein, er hat keinen Husten",
        "explanationAr": "«Nein, kein Husten.» — يؤكد المريض أنه لا يسعل.",
    },
    "d-a0-12": {
        "id": "d-a0-12-q2", "type": "mc",
        "promptDe": "Wie alt ist der Bruder?",
        "promptAr": "كم عمر الأخ؟",
        "options": ["15 Jahre", "20 Jahre", "10 Jahre", "30 Jahre"],
        "answer": "20 Jahre",
        "explanationAr": "«Mein Bruder ist 20» — عمر الأخ عشرون عاماً.",
    },
    "d-a0-13": {
        "id": "d-a0-13-q2", "type": "mc",
        "promptDe": "Wohin soll der Tourist gehen?",
        "promptAr": "إلى أين ينبغي أن يذهب السائح؟",
        "options": ["Geradeaus, dann rechts", "Links und dann zurück", "Sofort zum Flughafen", "Nur nach links"],
        "answer": "Geradeaus, dann rechts",
        "explanationAr": "«Gehen Sie geradeaus, dann rechts.» — يمشي مستقيماً ثم ينعطف يميناً.",
    },
    "d-a0-ht01": {
        "id": "d-a0-ht01-q2", "type": "mc",
        "promptDe": "Welche Nummer hat das Gleis?",
        "promptAr": "ما رقم الرصيف؟",
        "options": ["Gleis 1", "Gleis 2", "Gleis 3"],
        "answer": "Gleis 3",
        "explanationAr": "«Achtung, Gleis 3!» — الإعلان عن الرصيف رقم ثلاثة.",
    },
    "d-a0-ht02": {
        "id": "d-a0-ht02-q2", "type": "mc",
        "promptDe": "Wo sollen die Kunden bezahlen?",
        "promptAr": "أين ينبغي للزبائن أن يدفعوا؟",
        "options": ["An der Kasse", "Im Café", "Am Eingang"],
        "answer": "An der Kasse",
        "explanationAr": "«Bitte bezahlen Sie an der Kasse.» — يُرجى الدفع عند الصندوق.",
    },
    "d-a0-ht03": {
        "id": "d-a0-ht03-q2", "type": "mc",
        "promptDe": "Was möchte der Gast in seinem Kaffee?",
        "promptAr": "ماذا يريد الضيف في قهوته؟",
        "options": ["Milch und Zucker", "Zitrone und Honig", "Nur Wasser"],
        "answer": "Milch und Zucker",
        "explanationAr": "«Mit Milch und Zucker.» — يريد الحليب والسكر.",
    },
}
dialogue_evidence = {
    "d-a0-05-q2": "Buchstabieren Sie bitte!",
    "d-a0-06-q2": "Und ein Glas Wasser.",
    "d-a0-08-q2": "Schönen Tag noch!",
    "d-a0-09-q2": "Hier sind 5 Euro.",
    "d-a0-10-q2": "Es ist halb drei.",
    "d-a0-11-q2": "Nein, kein Husten.",
    "d-a0-12-q2": "Mein Bruder ist 20",
    "d-a0-13-q2": "Gehen Sie geradeaus, dann rechts.",
    "d-a0-ht01-q2": "Achtung, Gleis 3!",
    "d-a0-ht02-q2": "Bitte bezahlen Sie an der Kasse.",
    "d-a0-ht03-q2": "Mit Milch und Zucker.",
}

dialogues = load("dialogues.json")
dialogue_by_id = {dialogue["id"]: dialogue for dialogue in dialogues}
assert set(dialogue_questions) <= dialogue_by_id.keys(), "A0 dialogue id missing"
# Correct the title and give the learner a complete, plausible sample number.
dialogue_by_id["d-a0-05"]["titleDe"] = "Namen buchstabieren und Telefonnummer nennen"
dialogue_by_id["d-a0-05"]["titleAr"] = "تهجئة الاسم وذكر رقم الهاتف"
for line in dialogue_by_id["d-a0-05"]["lines"]:
    if line.get("who") == "Kunde" and line.get("de", "").startswith("Null eins sieben sechs"):
        line["de"] = "Null eins sieben sechs, vier zwei drei, acht acht null, eins zwei."
        line["ar"] = "صفر واحد سبعة ستة، أربعة اثنان ثلاثة، ثمانية ثمانية صفر، واحد اثنان."
for line in dialogue_by_id["d-a0-06"]["lines"]:
    if line.get("who") == "Gast" and "Und ein Wasser." in line.get("de", ""):
        line["de"] = line["de"].replace("Und ein Wasser.", "Und ein Glas Wasser.")
        line["ar"] = line["ar"].replace("وماء.", "وكأس ماء.")
dialogue_by_id["d-a0-06"]["questions"][0]["options"] = [
    "Tee und Kuchen", "Kaffee mit Milch und ein Glas Wasser", "Nur ein Bier", "Wein und Käse"
]
dialogue_by_id["d-a0-06"]["questions"][0]["answer"] = "Kaffee mit Milch und ein Glas Wasser"
for line in dialogue_by_id["d-a0-10"]["lines"]:
    if line.get("de") == "Es ist halb drei.":
        line["ar"] = "الساعة الثانية والنصف."
for line in dialogue_by_id["d-a0-13"]["lines"]:
    if line.get("de") == "Tourist: Weit?":
        # role and sentence may be stored separately; handled below if unmatched.
        line["de"] = line["de"].replace("Tourist: Weit?", "Tourist: Ist es weit?")
        line["ar"] = line["ar"].replace("بعيد؟", "هل هي بعيدة؟")
# In the normalized schema the speaker is in `who`, so correct the short turn directly.
for line in dialogue_by_id["d-a0-13"]["lines"]:
    if line.get("who") == "Tourist" and line.get("de") == "Weit?":
        line["de"] = "Ist es weit?"
        line["ar"] = "هل هي بعيدة؟"

for dialogue_id, question in dialogue_questions.items():
    upsert_question(dialogue_by_id[dialogue_id], question)
for dialogue in dialogues:
    transcript = " ".join(line.get("de", "") for line in dialogue.get("lines", []))
    for question in dialogue.get("questions", []):
        evidence = dialogue_evidence.get(question.get("id"))
        if evidence:
            assert evidence in transcript, f"dialogue evidence missing: {question['id']}"
            assert question.get("answer") in question.get("options", []), f"invalid answer: {question['id']}"
            assert f"«{evidence}»" in question.get("explanationAr", ""), f"missing evidence citation: {question['id']}"
assert all(len(dialogue_by_id[d]["questions"]) >= 2 for d in dialogue_questions)
save("dialogues.json", dialogues)

print(f"R143a: {len(reading_questions)} نصوص A0 أُكملت بأسئلة دليلية؛ {len(dialogue_questions)} حوارات أُكملت؛ وصُحّحت ترجمة الوقت وصياغات مختارة.")
