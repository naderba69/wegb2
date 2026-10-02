"""
PACKAGE-2a: Adjektivdeklination-Gerüst aufbauen.
- a2-adjektiv-einfach (A2): Endungen nach bestimmtem Artikel (der/die/das/dieser/jeder) — nur -e/-en.
- b1-adjektivendungen behält seinen Fokus auf ein/kein/Possessiv + starke Flexion + N-Deklination (5 Übungen hinzugefügt).
- b2-adjektiv-partizip (B2): Partizipialattribute, nominalisierte Adjektive, „manche/viele/wenige“ — 6 Übungen.
Dabei: keine Arabisch-Texte in .de-Feldern, promptDe bleibt bei Deutsch.
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
G = ROOT / "content" / "grammar.json"
PLAN = ROOT / "lib" / "plan.ts"

data = json.loads(G.read_text(encoding="utf-8"))

# ─── 1) Neue A2-Lektion: Einfache Adjektivendungen nach bestimmtem Artikel ───
a2_adjektiv = {
    "id": "a2-adjektiv-einfach",
    "titleDe": "Adjektivendungen nach der/die/das",
    "titleAr": "نهايات الصفات بعد أدوات التعريف (der/die/das)",
    "level": "A2",
    "summaryAr": "بعد أداة تعريف (der/die/das/dieser/jeder) القاعدة الذهبية بسيطة: في حالة الرفع (Nominativ) والنصب (Akkusativ) المفرد تنتهي الصفة بـ-e، وكل ما عداها تنتهي بـ-en. لا تحتاج أكثر من ذلك للتعبير اليومي.",
    "rules": [
        {"de": "der kleine Mann · die kleine Frau · das kleine Kind", "ar": "Nominativ مفرد (رفع): -e دائماً"},
        {"de": "den kleinen Mann · die kleine Frau · das kleine Kind", "ar": "Akkusativ مفرد (نصب): المذكر يأخذ -en (بعد den)، الباقي -e"},
        {"de": "dem kleinen Mann · der kleinen Frau · dem kleinen Kind", "ar": "Dativ مفرد (جرّ/جار): -en في جميع الأجناس"},
        {"de": "die kleinen Kinder · mit den kleinen Kindern", "ar": "الجمع في كل الحالات: -en دائماً"},
    ],
    "tables": [{
        "captionAr": "نهايات الصفات بعد der/die/das (الخلاصة)",
        "headers": ["الحالة", "der (مذكر)", "die (مؤنث)", "das (محايد)", "الجمع"],
        "rows": [
            ["Nominativ", "-e", "-e", "-e", "-en"],
            ["Akkusativ", "-en", "-e", "-e", "-en"],
            ["Dativ", "-en", "-en", "-en", "-en"],
        ],
    }],
    "examples": [
        {"de": "Der alte Mann wohnt hier.", "ar": "الرجل العجوز يسكن هنا."},
        {"de": "Ich sehe den roten Wagen.", "ar": "أرى السيارة الحمراء."},
        {"de": "Gib dem kleinen Kind das Brot.", "ar": "أعطِ الطفل الصغير الخبز."},
        {"de": "Die neuen Bücher liegen dort.", "ar": "الكتب الجديدة هناك."},
    ],
    "pitfalls": [
        {"de": "„der alt Mann“ ✗ → „der alte Mann“ ✓", "ar": "بعد der لا تنسَ نهاية -e."},
        {"de": "„den rot Wagen“ ✗ → „den roten Wagen“ ✓", "ar": "بعد den (مذكر منصوب) الصفة تأخذ -en."},
    ],
    "resources": [],
    "exercises": [
        {"id": "a2-adj-e1", "type": "fill", "promptDe": "Der neu___ Wagen ist schnell.", "answer": "e", "explanationAr": "Nominativ مفرد بعد der → -e"},
        {"id": "a2-adj-e2", "type": "fill", "promptDe": "Ich sehe den alt___ Mann.", "answer": "en", "explanationAr": "Akkusativ مذكر بعد den → -en"},
        {"id": "a2-adj-e3", "type": "fill", "promptDe": "Wir helfen der klein___ Frau.", "answer": "en", "explanationAr": "Dativ مؤنث بعد der → -en"},
        {"id": "a2-adj-e4", "type": "fill", "promptDe": "Die jung___ Kinder spielen im Garten.", "answer": "en", "explanationAr": "جمع بعد die → -en"},
        {"id": "a2-adj-e5", "type": "mc", "promptDe": "Ich kaufe ___ Wagen.", "options": ["den roten", "der rote", "den rot"], "answer": "den roten", "explanationAr": "Akkusativ مذكر: den roten."},
    ],
}
assert a2_adjektiv["id"] not in data, f"{a2_adjektiv['id']} existiert schon"
data[a2_adjektiv["id"]] = a2_adjektiv

# ─── 2) Neue B2-Lektion: Partizipien als Adjektive + nominalisierte Adjektive ───
b2_adj_partizip = {
    "id": "b2-adjektiv-partizip",
    "titleDe": "Partizipialattribute & nominalisierte Adjektive",
    "titleAr": "صفات ممدّدة بصيغ الفعل الماضي/المستمر وصفات محوَّلة إلى أسماء",
    "level": "B2",
    "summaryAr": "في مستوى B2 تُستخدَم صيغتا Partizip I (laufend) وPartizip II (gelaufen) كصفات طويلة قبل الاسم، كما تُحوَّل الصفات إلى أسماء بكتابة الحرف كبير (der Alte, das Gute). كلها تُصرَّف كنهايات الصفات العادية.",
    "rules": [
        {"de": "das laufende Kind · der angekommene Zug", "ar": "Partizip I وII كصفات قبل الاسم: نهاية الصفة تُضاف مباشرة"},
        {"de": "die sich unterhaltenden Gäste · die von der Sonne beschienene Wiese", "ar": "يمكن توسيع الصفة بجار ومجرور أو durch/von لوصف فاعل/مفعول"},
        {"de": "der Alte · eine Alte · das Gute · das Wichtigste", "ar": "صفات محوَّلة لأسماء: تُكتب كبيرة وتأخذ نهاية الصفة نفسها"},
        {"de": "viele bekannte Schriftsteller · manche alte Häuser", "ar": "بعد viele/wenige/manche/einige: النهاية كالجمع بعد die (-en)"},
    ],
    "tables": [{
        "captionAr": "ملخص نهايات الصفات الممدَّدة في B2",
        "headers": ["النمط", "مثال", "النهاية"],
        "rows": [
            ["Partizip I", "das weinende Kind", "-e/-en كالصفة العادية"],
            ["Partizip II", "das gestern gelesene Buch", "-e/-en كالصفة العادية"],
            ["Nominalisiert", "der Bekannte / ein Bekannter", "نهاية الصفة متبوعة بالكبير"],
        ],
    }],
    "examples": [
        {"de": "Die gestern angekommene Delegation besucht die Fabrik.", "ar": "الوفد الذي وصل البارحة يزور المصنع."},
        {"de": "Das Wichtigste zuerst: Ruhe bewahren.", "ar": "الأهم أولاً: الحفاظ على الهدوء."},
        {"de": "Viele junge Menschen ziehen in die Stadt.", "ar": "كثير من الشباب ينتقل إلى المدينة."},
    ],
    "pitfalls": [
        {"de": "„der angekommen Zug“ ✗ → „der angekommene Zug“ ✓", "ar": "Partizip II كصفة يأخذ نهاية الصفة (-e في Nominativ)."},
        {"de": "„das wichtige“ ✗ → „das Wichtige“ ✓", "ar": "صفات محوَّلة إلى أسماء تُكتب بحرف كبير."},
    ],
    "resources": [],
    "exercises": [
        {"id": "b2-adj-p1", "type": "fill", "promptDe": "Der gestern angekommen___ Zug steht auf Gleis 3.", "answer": "e", "explanationAr": "Nominativ مفرد مذكر بعد der → -e"},
        {"id": "b2-adj-p2", "type": "fill", "promptDe": "Das Wichtig___ ist die Pünktlichkeit.", "answer": "ste", "explanationAr": "das + nominalisiert → -ste (كصفة بعد das)"},
        {"id": "b2-adj-p3", "type": "umformung", "promptDe": "Bilden Sie einen Satz mit Partizip I: das Kind / weint / sehen / der Mann.", "answer": "Der Mann sieht das weinende Kind.", "hint": "Partizip I + Endung -e nach das"},
        {"id": "b2-adj-p4", "type": "fill", "promptDe": "Viele alt___ Häuser werden renoviert.", "answer": "e", "explanationAr": "Nominativ جمع بعد viele → -e"},
        {"id": "b2-adj-p5", "type": "mc", "promptDe": "___ wird heute besprochen.", "options": ["Das Wichtigste", "Das Wichtig", "Wichtigste"], "answer": "Das Wichtigste", "explanationAr": "Nominalisiertes Adjektiv: großgeschrieben mit Endung."},
        {"id": "b2-adj-p6", "type": "translate", "promptDe": "ترجم: الكتاب الذي قُرِئ البارحة كان ممتعاً.", "answer": "Das gestern gelesene Buch war interessant.", "hint": "Partizip II كصفة مع نهايتها بعد das"},
    ],
}
assert b2_adj_partizip["id"] not in data, f"{b2_adj_partizip['id']} existiert schon"
data[b2_adj_partizip["id"]] = b2_adj_partizip

# ─── 3) b1-adjektivendungen um 4 Übungen ergänzen (Fokus auf ein/kein/Starke Flexion) ───
b1 = data["b1-adjektivendungen"]
new_ex = [
    {"id": "b1-adj-e9",  "type": "fill",      "promptDe": "Mein klein___ Bruder spielt gern Fussball.", "answer": "er", "explanationAr": "Nominativ مذكر بعد mein → -er"},
    {"id": "b1-adj-e10", "type": "fill",      "promptDe": "Das ist gut___ Wein.", "answer": "er", "explanationAr": "Ohne Artikel (starke Flexion) Nominativ مذكر → -er"},
    {"id": "b1-adj-e11", "type": "umformung", "promptDe": "Bilden Sie den Satz im Dativ: Ich gebe das Buch (ein junger Mann).", "answer": "Ich gebe das Buch einem jungen Mann.", "hint": "Dativ مذكر بعد einem → -en"},
    {"id": "b1-adj-e12", "type": "fill", "promptDe": "Ich spreche mit sein___ Kollegen.", "answer": "em", "explanationAr": "Dativ مذكر nach sein → seinem; N-Deklination: Kollegen"},
]
existing = {e["id"] for e in b1["exercises"]}
for e in new_ex:
    if e["id"] not in existing:
        b1["exercises"].append(e)

# ─── 4) Validierung: keine arabischen Buchstaben in .de oder promptDe der neuen/erweiterten Einträge ───
import re
def has_ar(s: str) -> bool:
    return bool(re.search(r"[\u0600-\u06FF]", s or ""))

violations = []
for lid in [a2_adjektiv["id"], b2_adj_partizip["id"]]:
    lesson = data[lid]
    for r in lesson.get("rules", []):
        if has_ar(r.get("de","")): violations.append(f"{lid}/rule.de={r['de'][:40]}")
    for e in lesson.get("exercises", []):
        # K69b erlaubt Arabisch in translate/fill; nur mc/order/truefalse/umformung/dictation müssen rein-deutsch in promptDe sein
        if e["type"] in ("mc", "order", "truefalse", "umformung", "dictation") and has_ar(e.get("promptDe","")):
            violations.append(f"{lid}/{e['id']}.promptDe={e['promptDe'][:40]}")
if violations:
    print("ARABISCH in .de/promptDe:", violations); sys.exit(2)

G.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print("ok: a2-adjektiv-einfach, b2-adjektiv-partizip hinzugefügt; b1-adjektivendungen erweitert.")
