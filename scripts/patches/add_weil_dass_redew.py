"""
PACKAGE-2b: weil/dass-Bahn A1 + Redewendungen-Bank B2.
Teil 1 (dieses Skript): content/grammar.json
  - NEU: a1-weil-dass (A1) — frühes Gerüst: Verb ans Ende, weil=Grund, dass=Kunde.
  - ERWEITERT: b2-redew — 4 Regeln, Wendungs-Tabelle, 3 Fallen, 7 neue
    Übungen (fill/mc/translate/umformung/order) nach K62-Norm.
Teil 2 (danach, lib/plan.ts): Registrierung in PHASE_TOPICS.A1 nach a1-trennbar.
Pre-flight (bricht ab, bevor geschrieben wird):
  - kein Arabisch in .de/promptDe der Produktionstypen (K69b-Regel)
  - keine doppelten Übungs-IDs im ganzen Bank
  - neue Umformungen: quelleDe != Antwort, darfNicht steckt in quelleDe,
    points == 2 (K62c/i/n)
  - mc: Antwort in Optionen, 3-4 Optionen, keine Dopplung
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
G = ROOT / "content" / "grammar.json"
data = json.loads(G.read_text(encoding="utf-8"))

AR = re.compile(r"[\u0600-\u06FF]")

# --- 1) Neue A1-Lektion: weil/dass - frues Geruest ---
a1_weil = {
    "id": "a1-weil-dass",
    "titleDe": "weil · dass — Gründe nennen",
    "titleAr": "لأن وأن — الجمل التابعة في المستوى A1",
    "level": "A1",
    "summaryAr": "مع weil (لأن، سبب) وdass (أنّ، خبر/اعتقاد) تذهب إلى الجملة التابعة فعلاً مُصرَّفاً في نهايتها: «Ich bleibe zu Hause, weil ich müde bin.» — لا تقول «weil ich bin müde»؛ هذا أشهر خطأ عند العرب. ويمكنك البدء بالجملة التابعة: «Weil es regnet, nehme ich den Regenschirm.» ثم تأتي الجملة الرئيسية بفعلها ثانياً. هنا نبقى في المضارع البسيط؛ التراكيب المركّبة (wenn/obwohl، فعلان) تأتي في A2.",
    "rules": [
        {
            "de": "Ich bleibe zu Hause, weil ich müde bin.",
            "ar": "weil تفتح جملة تابعة: الفعل المصرَّف يذهب إلى نهايتها — bin في آخر السطر.",
        },
        {
            "de": "Sie sagt, dass sie heute aus Tunesien anruft.",
            "ar": "dass بعد أفعال القول والاعتقاد (sagen, wissen, glauben): الفعل المصرَّف أيضاً في النهاية — anruft في آخره.",
        },
        {
            "de": "Weil es regnet, nehme ich den Regenschirm.",
            "ar": "ابدأ بالتابعة إن شئت: بعد الفاصلة تأتي الجملة الرئيسية بفعلها ثانياً ثم فاعلها (nehme ich) — الفعل المصرَّف يبقى في التابعة.",
        },
    ],
    "tables": [],
    "examples": [
        {"de": "Ich lerne Deutsch, weil ich in Berlin wohne.", "ar": "أتعلّم الألمانية لأنّي أسكن في برلين. — wohne في النهاية."},
        {"de": "Er sagt, dass er morgen früh kommt.", "ar": "يقول إنه سيأتي صباحاً. — kommt في النهاية."},
        {"de": "Weil es spät ist, gehe ich nach Hause.", "ar": "لأنّه متأخر، أعود إلى البيت. — ist في التابعة، والرئيسية: gehe ich (فعل ثم فاعل)."},
        {"de": "Wir bleiben zu Hause, weil die Kinder krank sind.", "ar": "نبقى في البيت لأنّ الأطفال مرضى. — sind في النهاية."},
    ],
    "pitfalls": [
        {
            "de": "„weil ich bin müde“ ✗ → „weil ich müde bin“ ✓",
            "ar": "أشهر خطأ عند المتعلمين العرب: لا تُبقي ترتيبك العربي — المصرَّف في النهاية.",
        },
        {
            "de": "„Ich habe keine Zeit, weil ich Arbeit“ ✗ → „…, weil ich arbeite“ ✓",
            "ar": "الجملة التابعة لا تكون بلا فعل: خذ الفعل من الجملة الأصلية واصرِّفه في النهاية (arbeite).",
        },
    ],
    "exercises": [
        {
            "id": "a1-weil-e1",
            "type": "fill",
            "promptDe": "Ich bleibe heute zu Hause, weil ich müde ___. (sein)",
            "answer": ["bin"],
            "explanationAr": "بعد weil يذهب الفعل المصرَّف إلى النهاية: müde bin.",
        },
        {
            "id": "a1-weil-e2",
            "type": "fill",
            "promptDe": "Wir fahren nicht nach Berlin, weil wir kein Geld ___. (haben)",
            "answer": ["haben"],
            "explanationAr": "جملة weil كاملة: الفعل haben في النهاية — لا تتركها بلا فعل.",
        },
        {
            "id": "a1-weil-e3",
            "type": "mc",
            "promptDe": "Ich weiß, ___ du heute Nachmittag kommst.",
            "options": ["dass", "weil", "denn"],
            "answer": "dass",
            "explanationAr": "wissen يليه dass (خبر/اعتقاد)؛ weil للسبب، وdenn يصل جملتين مستقلتين ولا يفتح تابعة.",
        },
        {
            "id": "a1-weil-e4",
            "type": "order",
            "promptDe": "Bilde einen Satz: (sie / sagt / dass / sie / aus Tunis / kommt)",
            "answer": ["Sie", "sagt,", "dass sie", "aus Tunis", "kommt"],
            "explanationAr": "sagt, dass sie … — kommt (المصرَّف) في نهاية التابعة.",
            "points": 2,
            "promptAr": "رتّب الكلمات لتكوّن جملة صحيحة.",
        },
        {
            "id": "a1-weil-e5",
            "type": "translate",
            "promptDe": "ترجم: أبقى في البيت لأنّ الجوّ ممطراً.",
            "answer": "Ich bleibe zu Hause, weil es regnet.",
            "keywords": ["weil", "regnet"],
            "explanationAr": "الترتيب الصحيح: …, weil es regnet — regnet في نهاية التابعة.",
        },
    ],
}

assert a1_weil["id"] not in data, f"{a1_weil['id']} existiert schon"
data[a1_weil["id"]] = a1_weil

# --- 2) b2-redew erweitern ---
r = data["b2-redew"]

# 2a) Regeln (1 -> 4)
r["rules"] = [
    {
        "de": "Die Redewendungen werden als Chunks gelernt, nicht Wort für Wort.",
        "ar": "تُحفظ كعبارات جاهزة — لا كلمة كلمة.",
    },
    {
        "de": "Die Wendung ist wörtlich nicht übersetzbar — im Zweifel ist die wörtliche Übersetzung falsch.",
        "ar": "لا تُترجم حرفياً: إن أعطتك الترجمة الحرفية معنى عربياً غريباً فهي ليست المعنى المقصود.",
    },
    {
        "de": "Viele Wendungen stammen aus Körper, Tieren und Verkehr: die Nase voll haben · einen Kater haben · der Zug ist abgefahren.",
        "ar": "مصدرها الحياة اليومية (الجسم، الحيوانات، المرور) — وهذا سبب عدم ترجمتها حرفياً.",
    },
    {
        "de": "In Prüfungen wird die Wendung im ganzen Satz abgefragt — lerne sie mit einem Beispiel, nicht als Liste.",
        "ar": "تُختبر داخل جملة كاملة في الامتحانات؛ احفظها مع مثال لا كقائمة كلمات.",
    },
]

# 2b) Tabelle
r["tables"] = [
    {
        "captionAr": "تسع تعابير جاهزة للاستعمال اليومي",
        "headers": ["التعبير", "المعنى بالعربية"],
        "rows": [
            ["einen Kater haben", "صاعده/صداع ما بعد الشرب"],
            ["die Nase voll haben", "سئمَ حتى النخاع"],
            ["auf dem Laufenden bleiben", "يبقى على اطلاع دائم"],
            ["etwas in Kauf nehmen", "يتقبّل أمراً غير مرغوب بلا بديل"],
            ["im Grunde genommen", "في الأساس / في حقيقته"],
            ["Ich verstehe nur Bahnhof.", "لا أفهم شيئاً على الإطلاق"],
            ["Das ist mir Wurst.", "الأمر متساوٍ عندي — لا يهمّني"],
            ["in Rätseln sprechen", "يتكلّم بلغز يصعب فهمه"],
            ["der Zug ist abgefahren", "فرصة ذهبت ولن تعود"],
        ],
    }
]

# 2c) Beispiele +2
r["examples"] = r.get("examples", []) + [
    {"de": "Ich nehme die lärmenden Nachbarn in Kauf, bis der Umbau fertig ist.", "ar": "أتقبّل الجيران المزعجين بصبرٍ حتى ينتهي التجديد (in Kauf nehmen)."},
    {"de": "Nach dem Meeting bleiben wir über die Entscheidung auf dem Laufenden.", "ar": "بعد الاجتماع نبقى على اطلاع بالقرار (auf dem Laufenden bleiben)."},
]

# 2d) Fallen (0 -> 3)
r["pitfalls"] = [
    {
        "de": "„Meine Nase ist voll“ ✗ → „Ich habe die Nase voll“ ✓",
        "ar": "لا تُترجم حرفياً («أنفي ممتلئ») — العبارة كلّها تعني «سئمتُ حتى النخاع» مع الفعل haben.",
    },
    {
        "de": "„Ich bin auf dem laufenden“ ✗ → „Ich bin auf dem Laufenden“ ✓",
        "ar": "Substantiviertes Adjektiv: يُكتب كبيراً لأنه بمعنى الاسم.",
    },
    {
        "de": "„Ich verstehe gar nichts“ ✗ (kein Idiom) → „Ich verstehe nur Bahnhof“ ✓",
        "ar": "الفخّ: جملة صحيحة نحويّاً لكنها ليست العبارة الاصطلالية المطلوبة — الامتحان يطلب Wendung لا وصفاً.",
    },
]

# 2e) Alte Umformung auf K62-Norm bringen (Quelle != Antwort, Falle in der Quelle)
u1 = next(e for e in r["exercises"] if e.get("id") == "b2-redew-u1" or e.get("quelleDe") == "Ich verstehe nur Bahnhof.")
if "id" not in u1:
    u1["id"] = "b2-redew-u1"
u1["quelleDe"] = "Ich verstehe überhaupt nichts."
u1["promptDe"] = "Schreibe die Redewendung für „ich verstehe gar nichts“."
u1["answer"] = ["Ich verstehe nur Bahnhof."]
u1["darfNicht"] = ["überhaupt nichts"]
u1["mussEnthalten"] = ["bahnhof"]
u1["points"] = 2
u1["promptAr"] = "اكتب التعبير الاصطلاحي الذي يعني «لا أفهم شيئاً»."
u1["explanationAr"] = "«Ich verstehe nur Bahnhof» = لا أفهم شيئاً على الإطلاق (تعبير سمعي) — لا تكفيك جملة وصفية عادية."

# 2f) 7 neue Uebungen
neu = [
    {
        "id": "b2-redew-f5",
        "type": "fill",
        "promptDe": "Schreib mir die Neuigkeiten, damit ich immer ___ Laufenden bin.",
        "answer": ["auf dem"],
        "explanationAr": "auf dem Laufenden bleiben/sein = يبقى على اطلاع — جزءان لا يُفصلان.",
        "points": 1,
    },
    {
        "id": "b2-redew-f6",
        "type": "fill",
        "promptDe": "Die lärmenden Nachbarn nehme ich bis zum Umbauende ___. (Kauf)",
        "answer": ["in Kauf"],
        "explanationAr": "etwas in Kauf nehmen = يتقبّل أمراً غير مرغوب — in Kauf معاً في الفراغ.",
        "points": 1,
    },
    {
        "id": "b2-redew-m2",
        "type": "mc",
        "promptDe": "Ob wir heute oder morgen fahren — das ist mir ___.",
        "options": ["Wurst", "Bahnhof", "Kater"],
        "answer": "Wurst",
        "explanationAr": "Das ist mir Wurst = لا يهمّني إطلاقاً (وليس: نقراً!).",
    },
    {
        "id": "b2-redew-m3",
        "type": "mc",
        "promptDe": "Der Chef spricht immer in ___. Das versteht niemand.",
        "options": ["Rätseln", "Sätzen", "Farben"],
        "answer": "Rätseln",
        "explanationAr": "in Rätseln sprechen = يتكلّم بلغز يصعب فهمه.",
    },
    {
        "id": "b2-redew-t1",
        "type": "translate",
        "promptDe": "ترجم: نبقى على اطلاع بكل ما يخصّ هذا المشروع.",
        "answer": "Wir bleiben über das Projekt auf dem Laufenden.",
        "keywords": ["auf dem Laufenden", "Projekt"],
        "explanationAr": "auf dem Laufenden bleiben مع ja للمعرفة: über das Projekt — الحرف والمعرفة لا يُهملان.",
    },
    {
        "id": "b2-redew-u2",
        "type": "umformung",
        "points": 2,
        "quelleDe": "Wir müssen das akzeptieren, auch wenn wir es nicht wollen.",
        "promptDe": "Ersetze „akzeptieren, auch wenn wir es nicht wollen“ durch die passende Redewendung.",
        "answer": ["Wir müssen das in Kauf nehmen, auch wenn wir es nicht wollen."],
        "darfNicht": ["akzeptieren"],
        "mussEnthalten": ["in Kauf"],
        "explanationAr": "etwas in Kauf nehmen = يتقبّل مُكرَّهاً — «akzeptieren» تكفي في الكلام العامّ لا في الامتحان.",
        "promptAr": "استبدل «akzeptieren, auch wenn …» بالتعبير الاصطلاحي المناسب (in Kauf nehmen).",
    },
    {
        "id": "b2-redew-o1",
        "type": "order",
        "promptDe": "Bilde einen Satz: (ich / nehme / die lärmenden Nachbarn / in Kauf)",
        "answer": ["Ich", "nehme", "die lärmenden Nachbarn", "in Kauf"],
        "explanationAr": "in Kauf nehmen: الفعل nehmen يتبع القاعدة، والجار والمجرور in Kauf في المنتصف — ترتيب ثابت لا يُترجم.",
        "points": 2,
        "promptAr": "رتّب الكلمات لتكوّن جملة صحيحة.",
    },
]
vorhanden = {e.get("id") for e in r["exercises"]}
for e in neu:
    if e["id"] not in vorhanden:
        r["exercises"].append(e)

# --- Pre-flight: harte Checks vor dem Schreiben ---
viol = []
PRODMC = {"mc", "order", "truefalse", "umformung", "dictation"}
for lid in (a1_weil["id"], "b2-redew"):
    lesson = data[lid]
    for ru in lesson.get("rules", []):
        if AR.search(ru.get("de", "")): viol.append(f"{lid}: arabisch in rule.de")
    for ex in lesson.get("exercises", []):
        if ex["type"] in PRODMC and AR.search(ex.get("promptDe", "") or ""):
            viol.append(f"{lid}/{ex.get('id')}: arabisch in promptDe")
        if not AR.search(ex.get("explanationAr", "") or ""):
            viol.append(f"{lid}/{ex.get('id')}: explanationAr ohne Arabisch")

# keine doppelten IDs im ganzen Bank
alle_ids = [e.get("id") for les in data.values() for e in (les.get("exercises") or [])]
alle_ids = [i for i in alle_ids if i]
if len(alle_ids) != len(set(alle_ids)):
    dup = sorted({i for i in alle_ids if alle_ids.count(i) > 1})
    viol.append(f"doppelte Uebungs-IDs: {dup}")

# mc-Schema
for lid in (a1_weil["id"], "b2-redew"):
    for ex in data[lid]["exercises"]:
        if ex["type"] == "mc":
            opts = ex.get("options") or []
            if not (3 <= len(opts) <= 4): viol.append(f"{ex.get('id')}: {len(opts)} Optionen")
            if ex.get("answer") not in opts: viol.append(f"{ex.get('id')}: Antwort nicht in Optionen")
            if len(set(opts)) != len(opts): viol.append(f"{ex.get('id')}: doppelte Optionen")

# Umformungen b2-redew: K62-Norm
for ex in data["b2-redew"]["exercises"]:
    if ex["type"] != "umformung":
        continue
    antwort = ex["answer"][0] if isinstance(ex.get("answer"), list) else ex.get("answer")
    if ex.get("quelleDe") == antwort: viol.append(f"{ex.get('id')}: quelleDe == Antwort")
    if (ex.get("points") or 1) != 2: viol.append(f"{ex.get('id')}: points != 2")
    if not ex.get("darfNicht"): viol.append(f"{ex.get('id')}: darfNicht fehlt")
    q = (ex.get("quelleDe") or "").lower()
    for tok in ex.get("darfNicht", []):
        if tok.lower() not in q:
            viol.append(f"{ex.get('id')}: darfNicht »{tok}« steckt nicht in quelleDe")

# formale Zaehlbarkeit
a1prod = [e for e in a1_weil["exercises"] if e["type"] in ("fill", "umformung", "order", "translate", "dictation")]
if len(a1_weil["exercises"]) < 5 or len(a1prod) < 3:
    viol.append("a1-weil-dass: <5 Uebungen oder <3 Produktion")
if "weil ich müde bin" not in json.dumps(a1_weil["pitfalls"], ensure_ascii=False):
    viol.append("a1-weil-dass: Klassiker-Falle fehlt")

if viol:
    print("PRE-FLIGHT FEHLGESCHLAGEN:")
    for v in viol: print("  -", v)
    sys.exit(2)

G.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
n_ex = len(data["b2-redew"]["exercises"])
print(f"ok: a1-weil-dass (5 Uebungen) · b2-redew erweitert ({n_ex} Uebungen, {len(data['b2-redew']['rules'])} Regeln)")
