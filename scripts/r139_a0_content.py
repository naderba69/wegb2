#!/usr/bin/env python3
"""R139 content batch: fill A0 gaps — add 5 real A0 reading texts + 5 A0 dialogues."""
import json
from collections import OrderedDict

TEXTS_A0 = [
    OrderedDict([
        ("id", "t-a0-01"),
        ("level", "A0"),
        ("titleDe", "Hallo!"),
        ("titleAr", "مرحباً!"),
        ("de", "Hallo! Ich heiße Ali. Ich komme aus Tunesien. Ich wohne in Berlin. Ich lerne Deutsch. Guten Tag! Wie heißt du?"),
        ("ar", "مرحباً! اسمي علي. أنا من تونس. أسكن في برلين. أتعلم الألمانية. نهارك سعيد! ما اسمك؟"),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Wie heißt der Mann?"),("promptAr","ما اسم الرجل؟"),("options",["Youssef","Ali","Hassan","Omar"]),("answer",1),("explanationAr","النص يقول: Ich heiße Ali.")]),
            OrderedDict([("type","mc"),("promptDe","Wo wohnt Ali?"),("promptAr","أين يسكن علي؟"),("options",["In München","In Hamburg","In Berlin","In Köln"]),("answer",2),("explanationAr","النص يقول: Ich wohne in Berlin.")]),
        ]),
    ]),
    OrderedDict([
        ("id", "t-a0-02"),
        ("level", "A0"),
        ("titleDe", "Die Zahlen 1–10"),
        ("titleAr", "الأرقام من 1 إلى 10"),
        ("de", "Eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn. Ich bin dreißig Jahre alt. Meine Telefonnummer ist 0176 12345678. Die Hausnummer ist 12."),
        ("ar", "واحد، اثنان، ثلاثة، أربعة، خمسة، ستة، سبعة، ثمانية، تسعة، عشرة. عمري ثلاثون سنة. رقم هاتفي 0176 12345678. رقم المنزل 12."),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Wie alt ist der Erzähler?"),("promptAr","كم عمر المتحدّث؟"),("options",["Zwanzig","Dreißig","Vierzig","Fünfzig"]),("answer",1),("explanationAr","النص يقول: dreißig Jahre alt.")]),
            OrderedDict([("type","mc"),("promptDe","Welche Zahl ist NICHT im Text?"),("promptAr","أي رقم غير موجود في النص؟"),("options",["fünf","sieben","zwölf","zehn"]),("answer",2),("explanationAr","zwölf = 12 غير موجودة في القائمة، وإن وردت كجزء من Hausnummer.")]),
        ]),
    ]),
    OrderedDict([
        ("id", "t-a0-03"),
        ("level", "A0"),
        ("titleDe", "Das Alphabet"),
        ("titleAr", "الأبجدية"),
        ("de", "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. Ich heiße Fatima: F – A – T – I – M – A. Ich wohne in der Goethestraße."),
        ("ar", "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. اسمي فاطمة: F – A – T – I – M – A. أسكن في شارع جوته (Goethestraße)."),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Wie heißt die Frau?"),("promptAr","ما اسم المرأة؟"),("options",["Amira","Fatima","Leila","Sara"]),("answer",1),("explanationAr","النص يقول: Ich heiße Fatima.")]),
            OrderedDict([("type","mc"),("promptDe","Welcher Buchstabe kommt nach D?"),("promptAr","ما الحرف الذي يأتي بعد D؟"),("options",["C","E","F","G"]),("answer",1),("explanationAr","بعد D يأتي E.")]),
        ]),
    ]),
    OrderedDict([
        ("id", "t-a0-04"),
        ("level", "A0"),
        ("titleDe", "Farben"),
        ("titleAr", "الألوان"),
        ("de", "Das Gras ist grün. Der Himmel ist blau. Die Sonne ist gelb. Die Nacht ist schwarz. Die Milch ist weiß. Das Blut ist rot. Die Orange ist orange. Die Schokolade ist braun."),
        ("ar", "العشب أخضر. السماء زرقاء. الشمس صفراء. الليل أسود. الحليب أبيض. الدم أحمر. البرتقالة برتقالية. الشوكولاتة بنية."),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Welche Farbe hat der Himmel?"),("promptAr","ما لون السماء؟"),("options",["grün","blau","rot","gelb"]),("answer",1),("explanationAr","النص يقول: Der Himmel ist blau.")]),
            OrderedDict([("type","mc"),("promptDe","Was ist weiß?"),("promptAr","ما الأبيض؟"),("options",["Die Sonne","Die Milch","Das Blut","Die Schokolade"]),("answer",1),("explanationAr","النص يقول: Die Milch ist weiß.")]),
        ]),
    ]),
    OrderedDict([
        ("id", "t-a0-05"),
        ("level", "A0"),
        ("titleDe", "Ich und meine Familie"),
        ("titleAr", "أنا وعائلتي"),
        ("de", "Ich bin Karim. Ich bin Student. Ich habe eine Familie. Das ist meine Mutter, mein Vater, meine Schwester und mein Bruder. Wir wohnen in Köln. Meine Mutter ist Lehrerin. Mein Vater ist Arzt."),
        ("ar", "أنا كريم. أنا طالب. لدي عائلة. هذه أمي، أبي، أختي وأخي. نسكن في كولونيا. أمي معلمة. أبي طبيب."),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Was ist Karim?"),("promptAr","ماذا يعمل كريم؟"),("options",["Lehrer","Arzt","Student","Ingenieur"]),("answer",2),("explanationAr","النص يقول: Ich bin Student.")]),
            OrderedDict([("type","mc"),("promptDe","Wer ist Arzt?"),("promptAr","من الطبيب؟"),("options",["Die Mutter","Der Vater","Der Bruder","Die Schwester"]),("answer",1),("explanationAr","النص يقول: Mein Vater ist Arzt.")]),
        ]),
    ]),
]

DLGS_A0 = [
    OrderedDict([
        ("id", "d-a0-04"),
        ("level", "A0"),
        ("titleDe", "Woher kommst du?"),
        ("titleAr", "من أين أنت؟"),
        ("ort", "Kennenlernen"),
        ("lines", [
            OrderedDict([("who","A"),("de","Hallo! Wie heißt du?"),("ar","مرحباً! ما اسمك؟")]),
            OrderedDict([("who","B"),("de","Ich heiße Layla. Und du?"),("ar","اسمي ليلى. وأنت؟")]),
            OrderedDict([("who","A"),("de","Ich heiße Omar. Woher kommst du?"),("ar","اسمي عمر. من أين أنت؟")]),
            OrderedDict([("who","B"),("de","Ich komme aus Syrien. Und du?"),("ar","أنا من سوريا. وأنت؟")]),
            OrderedDict([("who","A"),("de","Ich komme aus Tunesien. Wo wohnst du?"),("ar","أنا من تونس. أين تسكنين؟")]),
            OrderedDict([("who","B"),("de","Ich wohne in Hamburg."),("ar","أسكن في هامبورغ.")]),
        ]),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Woher kommt Layla?"),("promptAr","من أين ليلى؟"),("options",["Aus Tunesien","Aus Syrien","Aus der Türkei","Aus Ägypten"]),("answer",1),("explanationAr","ليلى من سوريا.")]),
            OrderedDict([("type","mc"),("promptDe","Wo wohnt Layla?"),("promptAr","أين تسكن ليلى؟"),("options",["In Berlin","In München","In Hamburg","In Köln"]),("answer",2),("explanationAr","تسكن في هامبورغ.")]),
        ]),
        ("dictation",["Ich heiße Layla.","Ich komme aus Syrien."]),
    ]),
    OrderedDict([
        ("id", "d-a0-05"),
        ("level", "A0"),
        ("titleDe", "Telefonnummer buchstabieren"),
        ("titleAr", "تهجئة الاسم ورقم الهاتف"),
        ("ort", "Am Empfang"),
        ("lines", [
            OrderedDict([("who","Mitarbeiterin"),("de","Guten Tag! Ihr Name, bitte?"),("ar","نهارك سعيد! اسمك من فضلك؟")]),
            OrderedDict([("who","Kunde"),("de","Mein Name ist Huber."),("ar","اسمي هوبر.")]),
            OrderedDict([("who","Mitarbeiterin"),("de","Buchstabieren Sie bitte!"),("ar","اهجُ من فضلك!")]),
            OrderedDict([("who","Kunde"),("de","H – U – B – E – R."),("ar","H – U – B – E – R.")]),
            OrderedDict([("who","Mitarbeiterin"),("de","Danke. Und Ihre Telefonnummer?"),("ar","شكراً. ورقم هاتفك؟")]),
            OrderedDict([("who","Kunde"),("de","Null eins sieben sechs, dreiundvierzig fünfundneunzig."),("ar","صفر واحد سبعة ستة، ثلاثة وأربعون خمسة وتسعون.")]),
        ]),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Wie buchstabiert man Huber?"),("promptAr","كيف تُتَهجَّأ Huber؟"),("options",["H-U-P-E-R","H-U-B-E-R","U-H-B-E-R","H-A-B-E-R"]),("answer",1),("explanationAr","العميل هجّاها H–U–B–E–R.")]),
        ]),
        ("dictation",["Buchstabieren Sie bitte!"]),
    ]),
    OrderedDict([
        ("id", "d-a0-06"),
        ("level", "A0"),
        ("titleDe", "Im Café — bestellen"),
        ("titleAr", "في المقهى — الطلب"),
        ("ort", "Café"),
        ("lines", [
            OrderedDict([("who","Kellner"),("de","Guten Tag! Was möchten Sie?"),("ar","نهارك سعيد! ماذا تريد؟")]),
            OrderedDict([("who","Gast"),("de","Einen Kaffee, bitte!"),("ar","قهوة من فضلك!")]),
            OrderedDict([("who","Kellner"),("de","Mit Milch oder ohne?"),("ar","مع حليب أو بدون؟")]),
            OrderedDict([("who","Gast"),("de","Mit Milch, bitte. Und ein Wasser."),("ar","مع حليب من فضلك. وماء.")]),
            OrderedDict([("who","Kellner"),("de","Sonst noch etwas?"),("ar","أي شيء آخر؟")]),
            OrderedDict([("who","Gast"),("de","Nein, danke!"),("ar","لا، شكراً!")]),
        ]),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Was bestellt der Gast?"),("promptAr","ماذا طلب الزبون؟"),("options",["Tee und Kuchen","Kaffee mit Milch und ein Wasser","Nur ein Bier","Wein und Käse"]),("answer",1),("explanationAr","قهوة بالحليب وماء.")]),
        ]),
        ("dictation",["Einen Kaffee, bitte!","Mit Milch, bitte."]),
    ]),
    OrderedDict([
        ("id", "d-a0-07"),
        ("level", "A0"),
        ("titleDe", "Wie alt bist du?"),
        ("titleAr", "كم عمرك؟"),
        ("ort", "In der Klasse"),
        ("lines", [
            OrderedDict([("who","A"),("de","Hallo! Ich bin Sara. Ich bin 22 Jahre alt."),("ar","مرحباً! أنا سارة. عمري 22 سنة.")]),
            OrderedDict([("who","B"),("de","Ich heiße Tim. Ich bin 25."),("ar","اسمي تيم. عمري 25.")]),
            OrderedDict([("who","A"),("de","Wo wohnst du, Tim?"),("ar","أين تسكن يا تيم؟")]),
            OrderedDict([("who","B"),("de","Ich wohne in München."),("ar","أسكن في ميونخ.")]),
            OrderedDict([("who","A"),("de","Ich wohne auch in München!"),("ar","أسكن في ميونخ أيضاً!")]),
        ]),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Wie alt ist Sara?"),("promptAr","كم عمر سارة؟"),("options",["22","25","30","18"]),("answer",0),("explanationAr","سارة في الـ22.")]),
            OrderedDict([("type","mc"),("promptDe","Wo wohnt Tim?"),("promptAr","أين يسكن تيم؟"),("options",["In Berlin","In Hamburg","In München","In Köln"]),("answer",2),("explanationAr","يسكن في ميونخ.")]),
        ]),
        ("dictation",["Ich bin 22 Jahre alt."]),
    ]),
    OrderedDict([
        ("id", "d-a0-08"),
        ("level", "A0"),
        ("titleDe", "Auf Wiedersehen!"),
        ("titleAr", "إلى اللقاء!"),
        ("ort", "Nach dem Unterricht"),
        ("lines", [
            OrderedDict([("who","A"),("de","Tschüss! Bis morgen!"),("ar","مع السلامة! إلى غدٍ!")]),
            OrderedDict([("who","B"),("de","Auf Wiedersehen! Bis später!"),("ar","إلى اللقاء! إلى اللاحق!")]),
            OrderedDict([("who","A"),("de","Schönen Tag noch!"),("ar","يوماً سعيداً!")]),
            OrderedDict([("who","B"),("de","Danke, gleichfalls!"),("ar","شكراً، وأنت أيضاً!")]),
        ]),
        ("questions", [
            OrderedDict([("type","mc"),("promptDe","Wann sehen sie sich wieder?"),("promptAr","متى سيتقابلان مجدداً؟"),("options",["Nächste Woche","Morgen","Nie","Heute Abend"]),("answer",1),("explanationAr","قال A: Bis morgen! أي إلى الغد.")]),
        ]),
        ("dictation",["Auf Wiedersehen!","Schönen Tag noch!"]),
    ]),
]

# Texts: replace empty t-a0-01..05
texts = json.load(open('content/texts.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing_t = {x['id']:x for x in texts}
added_t = 0
for t in TEXTS_A0:
    existing_t[t['id']] = t
    added_t += 1
# preserve order but replace the a0 entries
new_texts = []
seen = set()
for t in TEXTS_A0:
    new_texts.append(t); seen.add(t['id'])
for t in texts:
    if t['id'] not in seen:
        new_texts.append(t)
with open('content/texts.json','w',encoding='utf-8') as f:
    json.dump(new_texts,f,ensure_ascii=False,indent=2); f.write('\n')

dlgs = json.load(open('content/dialogues.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing_d = {x['id'] for x in dlgs}
added_d = 0
for d in DLGS_A0:
    if d['id'] not in existing_d:
        dlgs.append(d); added_d += 1
with open('content/dialogues.json','w',encoding='utf-8') as f:
    json.dump(dlgs,f,ensure_ascii=False,indent=2); f.write('\n')

print(f"Added {added_t} A0 texts (replaced empty ones). Total texts: {len(new_texts)}")
print(f"Added {added_d} A0 dialogues. Total dialogues: {len(dlgs)}")
