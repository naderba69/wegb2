#!/usr/bin/env python3
"""R143b: repair grammar scaffolds, complete exercises, and remove an unsourced A2 statistic."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    return json.loads((ROOT / "content" / name).read_text(encoding="utf-8"))


def save(name, data):
    (ROOT / "content" / name).write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


grammar = load("grammar.json")

# Keep the German rule field entirely German; put the contrast/translation in
# the paired Arabic explanation field, which the lesson UI already displays.
rule_updates = {
    ("a2-dativ", 0): (
        "helfen + Dativ: Ich helfe dem Kind.",
        "helfen يأخذ Dativ لا Akkusativ؛ نقول Ich helfe dem Kind، لا Ich helfe das Kind.",
    ),
    ("a2-dativ", 2): (
        "gefallen + Dativ: Das Buch gefällt mir.",
        "gefallen بمعنى «يعجب» يأخذ Dativ للشخص: Das Buch gefällt mir، لا mich.",
    ),
    ("a2-dativ", 4): (
        "fehlen + Dativ: Du fehlst mir.",
        "fehlen يعني «يغيب/ينقص»؛ Du fehlst mir تعني حرفياً أنك غائب عني، أي أفتقدك.",
    ),
    ("a0-artikel", 0): (
        "der = Maskulinum · die = Femininum · das = Neutrum · Plural: die",
        "أدوات التعريف: der للمذكر، die للمؤنث، das للمحايد؛ وفي الجمع نستخدم die.",
    ),
    ("a0-du-sie", 0): (
        "du = informell, Singular (Freunde, Kinder, Familie)",
        "du للمفرد غير الرسمي: مع الأصدقاء والأطفال وأفراد الأسرة.",
    ),
    ("a0-du-sie", 1): (
        "ihr = informell, Plural (mehrere angesprochene Personen)",
        "ihr لجمع المخاطَبين في الأسلوب غير الرسمي، مثل مجموعة من الأصدقاء.",
    ),
    ("a0-du-sie", 2): (
        "Sie = formelle Anrede im Singular und Plural; immer großschreiben",
        "Sie للمخاطبة الرسمية للمفرد والجمع، وتُكتب دائماً بحرف كبير.",
    ),
    ("b2-genitiv-praep", 0): (
        "wegen + Genitiv: Wegen des Regens",
        "wegen يأخذ Genitiv في الأسلوب المعياري الرسمي: wegen des Regens. ويشيع Dativ في الكلام اليومي.",
    ),
    ("b2-genitiv-praep", 1): (
        "trotz + Genitiv: Trotz des Regens ging er spazieren.",
        "trotz يأخذ Genitiv في الكتابة المعيارية: trotz des Regens.",
    ),
    ("b2-genitiv-praep", 2): (
        "während + Genitiv: Während des Krieges",
        "während الزمنية تأخذ Genitiv في الصيغة المعيارية: während des Krieges.",
    ),
    ("b2-genitiv-praep", 3): (
        "aufgrund + Genitiv: Aufgrund schlechten Wetters",
        "aufgrund ذات الطابع الرسمي تأخذ Genitiv: aufgrund schlechten Wetters.",
    ),
    ("b2-genitiv-praep", 4): (
        "(an)statt + Genitiv: Statt eines Briefes schickte er eine E-Mail.",
        "(an)statt تأخذ Genitiv في الصيغة المعيارية: statt eines Briefes.",
    ),
    ("b2-konzessiv", 2): (
        "Auch wenn es regnet, gehe ich spazieren. (konzessiv; je nach Kontext hypothetisch)",
        "auch wenn تعني «حتى إن/حتى لو»؛ وقد تكون الحالة افتراضية بحسب السياق، لكن ذلك ليس لازماً. يبقى الفعل المصرف في نهاية الجملة التابعة.",
    ),
}
for (topic_id, index), (de, ar) in rule_updates.items():
    assert topic_id in grammar and index < len(grammar[topic_id]["rules"]), f"missing rule: {topic_id}/{index}"
    grammar[topic_id]["rules"][index].update({"de": de, "ar": ar})

# Two concrete, level-appropriate traps per topic. The quoted wrong/right form
# is intentionally the format consumed by FehlerFinden's timed radar.
pitfall_updates = {
    "a0-artikel": [
        ("Der Frau kommt aus Tunis.", "Die Frau kommt aus Tunis.", "Frau مؤنث: نقول die Frau. احفظ الاسم مع أداة جنسه؛ لا تستنتج الأداة من الترجمة وحدها."),
        ("Das Kinder sind hier.", "Die Kinder sind hier.", "في الجمع نستخدم أداة التعريف die، مهما كانت أداة الاسم في المفرد: das Kind، die Kinder."),
    ],
    "a0-du-sie": [
        ("Wie geht es Sie?", "Wie geht es Ihnen?", "مع Sie الرسمية نستخدم صيغة Dativ Ihnen بعد es geht …؛ لا نقول Sie هنا."),
        ("Guten Tag, Frau Meier. Wie geht es dir?", "Guten Tag, Frau Meier. Wie geht es Ihnen?", "لا تخلط التحية الرسمية Frau Meier مع ضمير المخاطبة غير الرسمي dir؛ استعمل Ihnen."),
    ],
    "a0-aussprache-vowels": [
        ("Im Wort „Stadt“ ist das a lang.", "Im Wort „Stadt“ ist das a kurz.", "في زوج الحد الأدنى Stadt–Staat يتغير طول الحركة؛ في Stadt قصيرة وفي Staat طويلة."),
        ("Im Wort „Bett“ ist das e lang.", "Im Wort „Bett“ ist das e kurz.", "قارن Bett ذات e القصيرة بـBeet ذات ee الطويلة؛ الكتابة والصوت يساعدان على التمييز."),
    ],
    "a0-aussprache-umlaut": [
        ("Das ü klingt wie ein u.", "Das ü klingt ähnlich wie ein i, aber mit gerundeten Lippen.", "لـü اللسان قريب من وضع i مع تدوير الشفتين؛ لا تستبدله بصوت u."),
        ("„schon“ bedeutet „schön“.", "„schon“ bedeutet „bereits“.", "schon تعني «بالفعل»، أما schön فتعني «جميل»؛ الأوملاوت يغيّر الكلمة والمعنى."),
    ],
    "a1-aussprache-ch": [
        ("In „Buch“ hört man den weichen ich-Laut.", "In „Buch“ hört man den harten ach-Laut.", "بعد u في Buch يأتي عادة الصوت الخلفي ach-Laut؛ أما ich ففيه الصوت الأمامي الناعم."),
        ("In „ich“ hört man den harten ach-Laut.", "In „ich“ hört man den weichen ich-Laut.", "بعد i في ich يأتي ich-Laut الناعم، لا ach-Laut الخلفي."),
    ],
    "a1-aussprache-r": [
        ("Im Standarddeutschen wird das r am Ende von „Vater“ immer gerollt.", "Im Standarddeutschen wird das -er am Wortende häufig vokalisiert.", "في النطق المعياري يُختزل -er غير المشدد في آخر Vater غالباً إلى [ɐ]؛ لكن توجد اختلافات إقليمية في نطق r."),
        ("Ein gerolltes Zungen-r ist im Deutschen immer falsch.", "Regionale r-Varianten sind möglich; im Standard ist das vokalisierte -er häufig.", "لا تفرض طريقة نطق واحدة على جميع اللهجات؛ تعلّم النطق المعياري مع معرفة وجود تنوع إقليمي."),
    ],
    "a1-aussprache-sp-st": [
        ("Sport beginnt mit einem normalen s-Laut.", "Sport beginnt standardsprachlich mit schp.", "في بداية Sport يُنطق sp عادةً /ʃp/؛ الكتابة sp لا تعني صوت s+p منفصلين هنا."),
        ("Wespe hat schp in der Wortmitte.", "Wespe hat den normalen sp-Laut in der Wortmitte.", "لا يتحول كل sp داخل الكلمة إلى schp؛ في Wespe يبقى الصوت /sp/."),
    ],
    "a1-aussprache-auslaut": [
        ("Tag endet mit einem stimmhaften g.", "Tag klingt am Wortende mit k.", "في النطق المعياري تُهمس g في آخر Tag فتُسمع كـk؛ وفي Tage يظهر g بين الحركات."),
        ("Tag wird wegen des k-Lauts mit k geschrieben.", "Tag bleibt mit g geschrieben; Tage zeigt das g.", "الإملاء يحافظ على g في Tag رغم نطقها كـk؛ صيغة Tage تساعد على تذكر الحرف."),
    ],
    "b2-genitiv-praep": [
        ("Wegen des Regen blieben wir zu Hause.", "Wegen des Regens blieben wir zu Hause.", "بعد wegen يأتي Genitiv في الصيغة المعيارية؛ ومع الاسم المذكر المفرد Regen تظهر علامة -s في Regens. ويشيع Dativ في الكلام اليومي."),
        ("Statt ein Brief schickte er eine E-Mail.", "Statt eines Briefes schickte er eine E-Mail.", "تأخذ statt Genitiv في الصيغة المعيارية: ein Brief تصبح eines Briefes."),
    ],
    "b2-konzessiv": [
        ("Obwohl es regnet, ich gehe spazieren.", "Obwohl es regnet, gehe ich spazieren.", "obwohl يقدّم جملة تابعة والفعل المصرف فيها أخيراً؛ بعد الفاصلة تأتي الجملة الرئيسية بترتيب V2: gehe ich."),
        ("Trotzdem es regnet, gehe ich spazieren.", "Obwohl es regnet, gehe ich spazieren.", "في الألمانية المعيارية نستخدم obwohl لافتتاح الجملة التابعة؛ ويمكن استعمال trotzdem في جملة رئيسية بترتيب الفعل الثاني."),
    ],
    "b2-relativ-genitiv": [
        ("Der Mann, deren Auto vor der Tür steht, wartet.", "Der Mann, dessen Auto vor der Tür steht, wartet.", "dessen يعود إلى الاسم السابق المذكر أو المحايد؛ يطابق جنس الاسم السابق لا الشيء المملوك."),
        ("Die Frau, dessen Tochter Ärztin ist, wohnt hier.", "Die Frau, deren Tochter Ärztin ist, wohnt hier.", "deren يعود إلى الاسم السابق المؤنث أو الجمع؛ يطابق جنس الاسم السابق لا Tochter."),
    ],
    "a1-pruefungsstrategie": [
        ("Ich übersetze jedes unbekannte Wort einzeln.", "Ich suche zuerst nach den Schlüsselwörtern der Aufgabe.", "في القراءة لا تتوقف عند كل كلمة مجهولة؛ ابدأ بمطلوب السؤال وابحث عن الكلمات المفتاحية والسياق."),
        ("Beim Schreiben lasse ich einen Aufgabenpunkt aus.", "Ich beantworte jeden vorgegebenen Punkt kurz und klar.", "حتى إن كانت الإجابة قصيرة، لا تترك أياً من النقاط المطلوبة في مهمة الكتابة."),
    ],
    "a2-pruefungsstrategie": [
        ("Bei einem unbekannten Wort höre ich nicht weiter zu.", "Ich höre weiter und erschließe die Bedeutung aus dem Satz.", "لا تتوقف عن الاستماع بسبب كلمة مجهولة؛ تابع واستنتج المعنى من الجملة والسياق."),
        ("Ich beantworte nur zwei von drei Punkten.", "Ich beantworte alle vorgegebenen Punkte.", "راجع كل نقطة مطلوبة قبل إرسال الكتابة؛ لا تسقط نقطة بسبب التركيز على عدد الكلمات."),
    ],
    "b1-pruefungsstrategie": [
        ("Ich nenne meine Meinung ohne Begründung.", "Ich begründe meine Meinung und verknüpfe die Argumente.", "في B1 ادعم الرأي بسبب أو مثال، واربط الحجج حتى يكون الموقف مفهوماً."),
        ("Ich spreche im Gespräch nur über meinen eigenen Plan.", "Ich reagiere auch auf den Beitrag meines Partners.", "في الحوار التفاعلي استمع إلى الشريك وردّ على فكرته؛ لا تلقِ نصاً محفوظاً منفصلاً."),
    ],
    "b2-pruefungsstrategie": [
        ("Ich nenne die Gegenposition, ohne sie abzuwägen.", "Ich prüfe Gegenpositionen und formuliere danach mein Fazit.", "في مستوى B2 لا تذكر الرأي المقابل فقط؛ ناقشه بإنصاف ثم بيّن نتيجة الموازنة."),
        ("Ich wähle möglichst komplizierte Sätze, auch wenn sie unklar sind.", "Ich schreibe klar, präzise und gut gegliedert.", "الدقة والترابط أهم من تعقيد الجمل؛ استعمل روابط مناسبة مع بنية واضحة."),
    ],
}
for topic_id, pairs in pitfall_updates.items():
    assert topic_id in grammar, f"missing pitfall topic: {topic_id}"
    grammar[topic_id]["pitfalls"] = [
        {"de": f"„{wrong}“ ✗ → „{right}“ ✓", "ar": arabic}
        for wrong, right, arabic in pairs
    ]

# Add one more focused item to each topic the audit flagged below its exercise
# target. Existing IDs/answers remain untouched; rerunning this script is safe.
exercise_updates = {
    "a1-modalverben": {
        "id": "a1-modalverben-r143-e05", "type": "mc",
        "promptDe": "Er ___ heute länger bleiben. (müssen)",
        "promptAr": "أكمل تصريف müssen مع er.",
        "options": ["muss", "müssen", "musst"], "answer": "muss",
        "explanationAr": "مع er نستخدم muss؛ ويبقى الفعل الثاني في المصدر في نهاية الجملة: bleiben.",
    },
    "a1-dativ": {
        "id": "a1-dativ-r143-e05", "type": "mc",
        "promptDe": "Wir sprechen mit ___ Lehrer. (der Lehrer)",
        "promptAr": "أكمل أداة التعريف بعد mit.",
        "options": ["dem", "den", "der"], "answer": "dem",
        "explanationAr": "mit تأخذ Dativ؛ der Lehrer يصبح dem Lehrer.",
    },
    "a1-wechsel": {
        "id": "a1-wechsel-r143-e05", "type": "fill",
        "promptDe": "Die Zeitung liegt auf ___ Tisch. (Wo?)",
        "promptAr": "أكمل بأداة التعريف المناسبة؛ السؤال عن المكان Wo؟",
        "answer": ["dem"],
        "explanationAr": "المكان الثابت يجيب عن Wo؟ ويأخذ Dativ: auf dem Tisch.",
    },
    "b1-partizip1": {
        "id": "b1-partizip1-r143-e05", "type": "fill",
        "promptDe": "Die ___ Kinder spielen im Garten. (lachen)",
        "promptAr": "حوّل lachen إلى Partizip I وصَرِّفه قبل Kinder.",
        "answer": ["lachenden"],
        "explanationAr": "Partizip I: lachen + d = lachend؛ وبعد أداة الجمع die تأخذ الصفة النهاية -en: die lachenden Kinder.",
    },
    "a0-buchstaben": {
        "id": "a0-buchstaben-r143-e05", "type": "mc",
        "promptDe": "Welcher Buchstabe kommt im Alphabet nach O?",
        "promptAr": "أي حرف يأتي بعد O في الأبجدية؟",
        "options": ["N (enn)", "P (peh)", "Q (kuh)", "Z (tset)"],
        "answer": "P (peh)",
        "explanationAr": "في ترتيب الأبجدية يأتي P (peh) مباشرة بعد O.",
    },
    "a0-zahlen": {
        "id": "a0-zahlen-r143-e05", "type": "mc",
        "promptDe": "Welche Zahl kommt nach sechs?",
        "promptAr": "أي عدد يأتي بعد ستة؟",
        "options": ["fünf", "sieben", "acht", "zehn"], "answer": "sieben",
        "explanationAr": "بعد sechs (ستة) يأتي sieben (سبعة).",
    },
    "a2-konj2-hoflich": {
        "id": "a2-konj2-hoflich-r143-e05", "type": "mc",
        "promptDe": "Sie bestellen höflich einen Tee. Welche Form passt?",
        "promptAr": "تطلب الشاي بأدب؛ أي صيغة مناسبة؟",
        "options": ["Ich will einen Tee.", "Ich hätte gern einen Tee.", "Ich hatte gern einen Tee.", "Ich habe einen Tee."],
        "answer": "Ich hätte gern einen Tee.",
        "explanationAr": "للطلَب المهذّب نستخدم hätte gern، لا الماضي hatte ولا الطلب المباشر Ich will.",
    },
}
for topic_id, exercise in exercise_updates.items():
    topic = grammar[topic_id]
    existing = next((item for item in topic["exercises"] if item.get("id") == exercise["id"]), None)
    if existing is None:
        topic["exercises"].append(exercise)
    else:
        existing.update(exercise)
    if exercise["type"] == "mc":
        assert exercise["answer"] in exercise["options"], f"answer not in options: {exercise['id']}"
save("grammar.json", grammar)

# The dialogue used a percentage as though it were a complete, current total.
# Replace it with a non-numeric role-play line; also fix gender and avoid implying
# that a real insurer's exact procedure was checked here.
dialogues = load("dialogues.json")
dialogue = next(d for d in dialogues if d["id"] == "dlg-a2-krankenversicherung")
dialogue["titleDe"] = "Bei der gesetzlichen Krankenkasse"
dialogue["titleAr"] = "في التأمين الصحي القانوني"
for line in dialogue["lines"]:
    if line.get("who") == "Mitarbeiterin" and (
        "AOK" in line.get("de", "") or line.get("de", "").startswith("Herzlich willkommen bei der Krankenkasse")
    ):
        line["de"] = "Herzlich willkommen bei Ihrer gesetzlichen Krankenkasse. Sind Sie berufstätig oder studieren Sie?"
        line["ar"] = "أهلاً وسهلاً بك في صندوق التأمين الصحي القانوني. هل تعملين أم تدرسين؟"
    elif line.get("who") == "Kundin" and "Ingenieur" in line.get("de", ""):
        line["de"] = "Ich bin berufstätig und arbeite als Ingenieurin."
        line["ar"] = "أعمل، وأنا مهندسة."
    elif line.get("who") == "Mitarbeiterin" and (
        "Arbeitgeberbescheinigung" in line.get("de", "")
        or line.get("de", "").startswith("Für die Anmeldung brauche ich")
    ):
        line["de"] = (
            "Für die Anmeldung brauche ich Ihre persönlichen Daten und Informationen zu Ihrer Beschäftigung. "
            "Die nötigen Unterlagen erkläre ich Ihnen gern."
        )
        line["ar"] = (
            "أحتاج إلى بياناتك الشخصية ومعلومات عن عملك للتسجيل. "
            "ويسرّني أن أشرح لك المستندات المطلوبة بحسب حالتك."
        )
    elif line.get("who") == "Mitarbeiterin" and (
        "14,6 Prozent" in line.get("de", "") or line.get("de", "").startswith("Der Beitrag ")
    ):
        line["de"] = (
            "Der Beitrag richtet sich nach Ihrem Einkommen. "
            "Wenn Sie gesetzlich versichert und angestellt sind, tragen Sie und Ihr Arbeitgeber ihn grundsätzlich je zur Hälfte."
        )
        line["ar"] = (
            "تتحدد المساهمة بحسب دخلك. وإذا كنتِ موظفة ومؤمّنة في نظام التأمين الصحي القانوني، "
            "فتدفعين أنتِ وصاحب العمل المساهمة مناصفةً في المعتاد."
        )
    elif line.get("who") == "Mitarbeiterin" and (
        line.get("de") == "Ab dem ersten Arbeitstag."
        or line.get("de", "").startswith("Wir prüfen Ihre Unterlagen")
        or line.get("de", "").startswith("Das hängt von Ihrem Versicherungsstatus")
    ):
        line["de"] = "Das hängt von Ihrem Versicherungsstatus ab. Wir prüfen Ihre Unterlagen und nennen Ihnen den Beginn."
        line["ar"] = "يعتمد ذلك على وضعك التأميني. سنراجع مستنداتك ونخبرك بتاريخ بدء التغطية."
q1 = next(q for q in dialogue["questions"] if q["id"] == "dlg-a2-krankenversicherung-q1")
q1.update({
    "promptDe": "Wer zahlt den Beitrag?",
    "promptAr": "من يدفع المساهمة؟",
    "options": [
        "Sie und Ihr Arbeitgeber zahlen jeweils die Hälfte.",
        "Nur Sie.",
        "Nur Ihr Arbeitgeber.",
    ],
    "answer": "Sie und Ihr Arbeitgeber zahlen jeweils die Hälfte.",
    "explanationAr": "«Wenn Sie gesetzlich versichert und angestellt sind, tragen Sie und Ihr Arbeitgeber ihn grundsätzlich je zur Hälfte.» — تتقاسمان المساهمة بالتساوي في هذه الحالة.",
})
q2 = next(q for q in dialogue["questions"] if q["id"] == "dlg-a2-krankenversicherung-q2")
q2.update({
    "promptDe": "Welche Angaben braucht die Krankenkasse für die Anmeldung?",
    "promptAr": "ما المعلومات التي يحتاجها صندوق التأمين للتسجيل؟",
    "options": [
        "persönliche Daten und Informationen zur Beschäftigung",
        "nur den Pass",
        "eine Wohnungsmeldung",
    ],
    "answer": "persönliche Daten und Informationen zur Beschäftigung",
    "explanationAr": "ذكرت الموظفة أنها تحتاج بيانات شخصية ومعلومات عن العمل؛ أما المستندات المحددة فتشرحها بحسب حالة الزبونة.",
})
save("dialogues.json", dialogues)

# These values belong only to a fictional A2 shop announcement: 30% is the
# scripted offer and 10% is a quiz distractor, not a real-world price claim.
whitelist = load("fakten-whitelist.json")
known_patterns = {entry.get("muster") for entry in whitelist["eintraege"]}
for entry in [
    {
        "muster": "30 Prozent",
        "wo": "d-a2-ht01 lines and answer option",
        "grund": "Rabatt eines ausdrücklich fiktiven Kaufhaus-Dialogs; kein aktuelles Angebot eines realen Händlers.",
    },
    {
        "muster": "10 Prozent",
        "wo": "d-a2-ht01 distractor",
        "grund": "Falschantwort in der Verständnisfrage zum fiktiven Kaufhausangebot; keine Tatsachenbehauptung.",
    },
]:
    if entry["muster"] not in known_patterns:
        whitelist["eintraege"].append(entry)
        known_patterns.add(entry["muster"])
save("fakten-whitelist.json", whitelist)

# Fill the sixteen uncovered grammar topics with concise, tested memory aids.
# `aussprache` and `pruefung` are explicit sections rather than mislabelled as
# a grammar category they do not belong to.
memory_cards = [
    {
        "id": "e-a0-artikel", "emoji": "🚪", "sektion": "genus", "level": "A0",
        "titleAr": "ثلاثة أبواب: der · die · das، وباب الجمع die",
        "storyAr": "تخيّل ثلاثة أبواب تدخل منها أسماء المفرد: باب المذكر der، وباب المؤنث die، وباب المحايد das. حين تتحول الأسماء إلى جمع، تجتمع كلها عند باب die. لا تكشف ترجمة الاسم العربية دائماً عن جنسه الألماني، لذلك احفظ كل اسم مع أداته.",
        "zeilen": [
            {"code": "مذكر · der", "de": "der Mann", "ar": "الرجل؛ اسم مذكر مع der."},
            {"code": "مؤنث · die", "de": "die Frau", "ar": "المرأة؛ اسم مؤنث مع die."},
            {"code": "محايد · das", "de": "das Kind", "ar": "الطفل؛ اسم محايد مع das."},
            {"code": "جمع · die", "de": "die Kinder", "ar": "في الجمع تأتي die، حتى إن كان المفرد das Kind."},
        ],
        "gramIds": ["a0-artikel"],
        "warnung": "الجنس النحوي يُحفَظ مع الاسم؛ ولا يعني das Kind أن الطفل محايد في المعنى.",
    },
    {
        "id": "e-a0-umlaut", "emoji": "👄", "sektion": "aussprache", "level": "A0",
        "titleAr": "الأوملاوت يغيّر صوت الكلمة ومعناها",
        "storyAr": "تذكّر الأوملاوت بتدوير الشفتين: في ö وü لا يكفي تبديل الحرف بنظيره العادي. اجعل وضع اللسان قريباً من e أو i، ثم دوّر الشفتين. النقاط الصغيرة فوق الحرف جزء من الهجاء وتغيّر المعنى، وليست زينة يمكن إهمالها.",
        "zeilen": [
            {"code": "ä ≈ e مفتوحة", "de": "die Männer", "ar": "Männer فيها ä، وهو صوت قريب من e مفتوحة."},
            {"code": "ö: لسان e + شفاه مستديرة", "de": "schön ≠ schon", "ar": "schön تعني جميل، وschon تعني بالفعل."},
            {"code": "ü: لسان i + شفاه مستديرة", "de": "die Tür", "ar": "في ü يبقى اللسان قريباً من i مع تدوير الشفتين."},
        ],
        "gramIds": ["a0-aussprache-umlaut"],
        "warnung": "لا تستبدل ä/ö/ü بـa/o/u عند الكتابة؛ قد تصبح كلمة أخرى.",
    },
    {
        "id": "e-a0-vokale", "emoji": "⏱️", "sektion": "aussprache", "level": "A0",
        "titleAr": "زوجا المدة: Stadt–Staat وBett–Beet",
        "storyAr": "اسمع طول الحركة قبل حفظ الكلمة: في Stadt الحركة قصيرة، وفي Staat طويلة؛ وفي Bett حرف e قصير، وفي Beet يطول. تغيّر المدة قد يغيّر الكلمة ومعناها، لذا احفظ الأمثلة كأزواج صوتية لا كتهجئة منفصلة.",
        "zeilen": [
            {"code": "a قصيرة", "de": "die Stadt", "ar": "الحركة قصيرة في Stadt."},
            {"code": "aa طويلة", "de": "der Staat", "ar": "aa تجعل الحركة طويلة في Staat."},
            {"code": "e قصيرة / ee طويلة", "de": "das Bett · das Beet", "ar": "قارن e القصيرة في Bett بـee الطويلة في Beet."},
        ],
        "gramIds": ["a0-aussprache-vowels"],
        "warnung": "هذه مؤشرات شائعة لا قاعدة بلا استثناء؛ ثبّت نطق المفردة مع سماعها.",
    },
    {
        "id": "e-a0-du-sie", "emoji": "👥", "sektion": "satzbau", "level": "A0",
        "titleAr": "du واحد قريب، ihr جماعة قريبة، Sie مخاطبة رسمية",
        "storyAr": "اسأل نفسك قبل الكلام: أخاطب صديقاً واحداً، مجموعة أصدقاء، أم شخصاً بصيغة رسمية؟ الأول du، والثاني ihr، والرسمي Sie بحرف كبير، سواء أكان شخصاً واحداً أم أكثر. تغيّر الضمير يغيّر تصريف الفعل أيضاً.",
        "zeilen": [
            {"code": "صديق واحد · du", "de": "Wie geht es dir?", "ar": "مع صديق واحد نقول dir في التعبير الثابت Wie geht es dir?"},
            {"code": "مجموعة أصدقاء · ihr", "de": "Wo wohnt ihr?", "ar": "مع مجموعة غير رسمية نستعمل ihr وتصريف الجمع."},
            {"code": "رسمي · Sie", "de": "Wie geht es Ihnen?", "ar": "في المخاطبة الرسمية نقول Ihnen، وتظل Sie مكتوبة بحرف كبير."},
        ],
        "gramIds": ["a0-du-sie"],
        "warnung": "Sie الرسمية للمفرد والجمع؛ لا تخلطها بـsie التي تعني هي أو هم بحسب السياق.",
    },
    {
        "id": "e-a0-satzbau", "emoji": "🧱", "sektion": "satzbau", "level": "A0",
        "titleAr": "الفعل المصرف في الموقع الثاني",
        "storyAr": "ابنِ الجملة الألمانية كقطع: الفعل المصرف يحتل الموقع الثاني. إذا بدأت بالفاعل جاء الفعل بعده، وإذا بدأت بظرف مثل Heute ينتقل الفاعل إلى ما بعد الفعل؛ لا تضع الفعل مرتين ولا تتركه بعد الفاعل في الموقع الثالث.",
        "zeilen": [
            {"code": "فاعل + فعل + تتمة", "de": "Ich lerne Deutsch.", "ar": "الفاعل Ich ثم الفعل المصرف lerne."},
            {"code": "ظرف + فعل + فاعل", "de": "Heute lerne ich Deutsch.", "ar": "بدأنا بـHeute؛ بقي الفعل في الموقع الثاني وتلاه الفاعل."},
            {"code": "زمن + فعل + فاعل", "de": "Am Morgen trinke ich Tee.", "ar": "بعد Am Morgen يأتي الفعل trinke مباشرة."},
        ],
        "gramIds": ["a0-satzbau"],
        "warnung": "الموقع الثاني يعني ثاني عنصر نحوي، لا ثاني كلمة دائماً.",
    },
    {
        "id": "e-a1-auslaut", "emoji": "🔇", "sektion": "aussprache", "level": "A1",
        "titleAr": "آخر الكلمة يهمس: b→p وd→t وg→k",
        "storyAr": "في نهاية الكلمة الألمانية المعيارية تُهمَس بعض الأصوات المجهورة: b كأنها p، وd كأنها t، وg كأنها k. أضف حركة أو انتقل إلى صيغة صرفية أخرى لتسمع الصوت المجهور من جديد وتحفظ الحرف الصحيح.",
        "zeilen": [
            {"code": "b → p في الآخر", "de": "lieb [liːp] · Liebe", "ar": "تُسمع b في lieb كـp، وتظهر b في Liebe."},
            {"code": "d → t في الآخر", "de": "Kind [kɪnt] · Kinder", "ar": "تُسمع d في Kind كـt، وتظهر في Kinder."},
            {"code": "g → k في الآخر", "de": "Tag [taːk] · Tage", "ar": "تُسمع g في Tag كـk، وتظهر في Tage."},
        ],
        "gramIds": ["a1-aussprache-auslaut"],
        "warnung": "التغيّر في النطق لا يغيّر تهجئة أصل الكلمة: Tag لا تُكتب Tak.",
    },
    {
        "id": "e-a1-ch", "emoji": "🌬️", "sektion": "aussprache", "level": "A1",
        "titleAr": "ich الناعم بعد الأمام، وach الخلفي بعد a/o/u",
        "storyAr": "قسّم صوت ch بحسب الحركة التي تسبقه: بعد الحركات الأمامية مثل i وe غالباً صوت ich الناعم، وبعد الحركات الخلفية a وo وu غالباً صوت ach الأشد. احفظ زوجاً واضحاً من كل مجموعة واستمع إلى موضع اللسان.",
        "zeilen": [
            {"code": "ich-Laut · ناعم", "de": "ich · Milch", "ar": "بعد i يأتي غالباً الصوت الأمامي الناعم /ç/."},
            {"code": "ach-Laut · خلفي", "de": "Buch · machen", "ar": "بعد u أو a يأتي غالباً الصوت الخلفي /x/."},
            {"code": "المقارنة", "de": "Ich habe auch ein Buch.", "ar": "في الجملة نسمع ich ناعمة وauch/Buch خلفية."},
        ],
        "gramIds": ["a1-aussprache-ch"],
        "warnung": "هذا تلخيص تعليمي للنطق المعياري؛ توجد تفاصيل واستثناءات مع بعض الأصوات والكلمات الدخيلة.",
    },
    {
        "id": "e-a1-r", "emoji": "🗣️", "sektion": "aussprache", "level": "A1",
        "titleAr": "راقب موقع r، ولا تفرض لهجة واحدة",
        "storyAr": "لا تحفظ r الألمانية على أنها حركة واحدة في كل موضع: في بداية المقطع تبقى r صوتاً صامتاً مستقلاً وتختلف طريقة نطقها إقليمياً؛ أما النهاية غير المشددة -er فتُختزل كثيراً في النطق المعياري إلى صوت قريب من a خفيف. قارن الموضعين واستمع.",
        "zeilen": [
            {"code": "r في البداية", "de": "rot · Reise", "ar": "في أول المقطع نسمع r، مع اختلاف نطقه إقليمياً."},
            {"code": "-er غير مشدد في الآخر", "de": "Vater · Mutter · Kinder", "ar": "-er في النهاية يُختزل غالباً إلى [ɐ] في النطق المعياري."},
            {"code": "جملة تدريب", "de": "Rita reist am Freitag nach Rom.", "ar": "كرر r في Rita وreist وFreitag وRom بوضوح دون مبالغة."},
        ],
        "gramIds": ["a1-aussprache-r"],
        "warnung": "النطق الحلقي أو اللساني قد يختلف باختلاف المنطقة؛ ليس كل اختلاف خطأً.",
    },
    {
        "id": "e-a1-sp-st", "emoji": "🪄", "sektion": "aussprache", "level": "A1",
        "titleAr": "في بداية الكلمة: sp→schp وst→scht",
        "storyAr": "تخيّل أن s تلبس صوت sh حين تفتح مقطعاً في أول كلمة ألمانية: sp تصبح schp وst تصبح scht. لكن لا تعمم ذلك على كل موضع؛ في كلمات مثل Wespe يبقى sp صوتاً عادياً. التزم بموضع المجموعة واستمع.",
        "zeilen": [
            {"code": "sp في البداية", "de": "Sport · sprechen", "ar": "تبدأان بصوت schp في النطق المعياري."},
            {"code": "st في البداية", "de": "Straße · stehen", "ar": "تبدآن بصوت scht في النطق المعياري."},
            {"code": "ليس في كل موضع", "de": "Wespe · Fenster", "ar": "في وسط الكلمات لا يتحول sp/st تلقائياً إلى schp/scht."},
        ],
        "gramIds": ["a1-aussprache-sp-st"],
        "warnung": "الشفرة تخص موضع بداية الكلمة/المقطع في النطق المعياري، لا كل ظهور مكتوب لـsp أو st.",
    },
    {
        "id": "e-a1-pruefung", "emoji": "🔎", "sektion": "pruefung", "level": "A1",
        "titleAr": "في الامتحان: اقرأ المطلوب ثم ابحث عن الدليل",
        "storyAr": "في اختبار القراءة لا تبدأ بترجمة كل النص. اقرأ السؤال، حدّد كلمة مفتاحية مثل Preis أو Uhrzeit، ثم ابحث عن دليلها في النص. في الكتابة ضع تحية ومعلومات كل النقاط وخاتمة بسيطة؛ إجابة قصيرة صحيحة أفضل من ترك بند مطلوب.",
        "zeilen": [
            {"code": "السؤال أولاً", "de": "Welche Linie fährt zum Bahnhof?", "ar": "افهم المطلوب قبل قراءة التفاصيل."},
            {"code": "مفتاح البحث", "de": "Linie · Bahnhof", "ar": "ابحث عن الكلمات المفتاحية أو مرادفاتها في النص."},
            {"code": "لا تسقط بنداً", "de": "Anrede · Information · Gruß", "ar": "في الرسالة القصيرة غطّ كل المطلوب ثم اختم."},
        ],
        "gramIds": ["a1-pruefungsstrategie"],
        "warnung": "إذا لم تجد الكلمة نفسها، ابحث عن إعادة صياغتها ولا تختر جواباً بلا شاهد.",
    },
    {
        "id": "e-a2-pruefung", "emoji": "🎧", "sektion": "pruefung", "level": "A2",
        "titleAr": "اسمع المعنى، وأجب عن كل نقطة",
        "storyAr": "في A2 اقرأ السؤال قبل الاستماع، وانتبه إلى المعنى وإعادة الصياغة بدلاً من انتظار كلمة مطابقة حرفياً. إذا فاتتك كلمة، واصل الاستماع واستنتجها من الجملة. في الكتابة راجع قائمة النقاط، وأجب عنها كلها قبل الإرسال.",
        "zeilen": [
            {"code": "اقرأ المطلوب", "de": "Lies zuerst die Aufgabenstellung.", "ar": "اقرأ السؤال قبل بدء البحث عن الإجابة."},
            {"code": "تابع السياق", "de": "Achte auf Schlüsselwörter und Paraphrasen.", "ar": "انتبه للكلمات المفتاحية وإعادة الصياغة."},
            {"code": "تحقق من التغطية", "de": "Beantworte alle vorgegebenen Punkte.", "ar": "أجب عن جميع النقاط المطلوبة في الكتابة."},
        ],
        "gramIds": ["a2-pruefungsstrategie"],
        "warnung": "لا تجعل كلمة مجهولة واحدة تمنعك من فهم الفكرة العامة أو الإجابة عن البقية.",
    },
    {
        "id": "e-b1-pruefung", "emoji": "🧭", "sektion": "pruefung", "level": "B1",
        "titleAr": "رأيٌ مسنود، واستجابةٌ للشريك",
        "storyAr": "في كتابة B1 رتّب رأيك: موقف واضح، ثم سبب، ثم مثال أو نتيجة. وفي الحوار لا تكتف بقراءة حجتك؛ استمع إلى الشريك وأجب عن فكرته. أداة الربط المناسبة تجعل الموقف مفهوماً وتمنع النص من التحول إلى جمل منفصلة.",
        "zeilen": [
            {"code": "رأي + سبب", "de": "Ich bin dafür, weil es Zeit spart.", "ar": "أذكر الموقف وأدعمه بسبب واضح."},
            {"code": "حجة مقابلة", "de": "Einerseits …, andererseits …", "ar": "اعرض جانبي الموضوع عند الحاجة."},
            {"code": "رد تفاعلي", "de": "Was meinst du dazu?", "ar": "اسأل الشريك وردّ على رأيه."},
        ],
        "gramIds": ["b1-pruefungsstrategie"],
        "warnung": "لا تحفظ فقرة لا تستجيب للمهمة؛ اربط كل حجة بالمطلوب وبكلام الشريك.",
    },
    {
        "id": "e-b2-genitiv-praep", "emoji": "🧩", "sektion": "praeposition", "level": "B2",
        "titleAr": "حروف جرّ Genitiv: wegen · trotz · während · aufgrund",
        "storyAr": "اربط حروف الجر هذه بحالة Genitiv في الأسلوب المعياري: بسبب wegen، رغم trotz، أثناء während، وبناءً على aufgrund. اسأل «بسبب ماذا؟» أو «رغم ماذا؟» ثم راجع أداة الاسم ونهايته. في الكلام قد تسمع Dativ مع بعضها، لكن الكتابة الرسمية تقتضي غالباً Genitiv.",
        "zeilen": [
            {"code": "سبب", "de": "Wegen des Regens bleiben wir zu Hause.", "ar": "بسبب المطر؛ des Regens في Genitiv."},
            {"code": "رغم", "de": "Trotz des Regens gehen wir spazieren.", "ar": "رغم المطر؛ بعد trotz نستخدم هنا Genitiv."},
            {"code": "أثناء", "de": "Während des Gesprächs notiert sie die Fragen.", "ar": "أثناء الحديث؛ des Gesprächs في Genitiv."},
            {"code": "بناءً على", "de": "Aufgrund der Lage änderten wir den Plan.", "ar": "بناءً على الوضع؛ der Lage في Genitiv المؤنث."},
        ],
        "gramIds": ["b2-genitiv-praep"],
        "warnung": "لا تعرض الاستخدام الشفهي بـDativ على أنه خطأ مطلق؛ ميّز بين المحكي والمعيار الرسمي.",
    },
    {
        "id": "e-b2-konzessiv", "emoji": "⚖️", "sektion": "b2", "level": "B2",
        "titleAr": "obwohl يتراجع بالفعل، trotzdem يمشي في V2",
        "storyAr": "عند وجود تناقض اختر البنية بحسب الرابط: obwohl وauch wenn يفتحان جملة تابعة فيذهب الفعل إلى النهاية؛ trotzdem يبدأ أو يربط جملة رئيسية ويبقى الفعل المصرف في الموقع الثاني. أما bei فيختصر المعنى في مجموعة جرّية مع Dativ.",
        "zeilen": [
            {"code": "جملة تابعة", "de": "Obwohl es regnet, gehe ich spazieren.", "ar": "بعد obwohl يأتي الفعل في نهاية الجملة التابعة."},
            {"code": "جملة رئيسية", "de": "Es regnet; trotzdem gehe ich spazieren.", "ar": "بعد trotzdem يبقى الفعل في الموقع الثاني."},
            {"code": "تنازل", "de": "Auch wenn es regnet, gehe ich spazieren.", "ar": "تعني auch wenn «حتى إن/حتى لو»؛ وقد يكون المعنى افتراضياً بحسب السياق، والفعل المصرف في النهاية."},
            {"code": "مجموعة جرّية", "de": "Bei Regen gehe ich trotzdem spazieren.", "ar": "bei Regen صيغة مختصرة، وRegen هنا Dativ."},
        ],
        "gramIds": ["b2-konzessiv"],
        "warnung": "لا تخلط ترتيب الجملة التابعة بعد obwohl بترتيب الجملة الرئيسية بعد trotzdem.",
    },
    {
        "id": "e-b2-pruefung", "emoji": "🏗️", "sektion": "pruefung", "level": "B2",
        "titleAr": "ابنِ حجة B2: أطروحة، تعليل، مثال، موازنة، خلاصة",
        "storyAr": "تعامل مع كتابة B2 كحجة متوازنة: اعرض أطروحتك، علّلها، أضف مثالاً، ناقش الرأي المقابل بإنصاف، ثم اختم بخلاصة واضحة. لا تخلط كثرة المفردات بالتعقيد؛ الروابط المنطقية والدقة أهم من جملة طويلة لا تؤدي معنى محدداً.",
        "zeilen": [
            {"code": "أطروحة", "de": "Meiner Ansicht nach ist der Vorschlag sinnvoll.", "ar": "أعلن الموقف بوضوح."},
            {"code": "تعليل", "de": "Denn er spart Zeit und Kosten.", "ar": "ادعم الأطروحة بسبب."},
            {"code": "موازنة", "de": "Zwar gibt es Nachteile, dennoch …", "ar": "اعترف بالرأي المقابل ثم وازنه."},
            {"code": "خلاصة", "de": "Insgesamt überwiegen für mich die Vorteile.", "ar": "اختم بنتيجة متسقة مع الحجج."},
        ],
        "gramIds": ["b2-pruefungsstrategie"],
        "warnung": "لا تُخفِ ضعف الدليل خلف تراكيب معقدة؛ اجعل العلاقة بين الادعاء والشاهد صريحة.",
    },
    {
        "id": "e-b2-relativ-genitiv", "emoji": "🔗", "sektion": "b2", "level": "B2",
        "titleAr": "dessen للمذكر والمحايد، deren للمؤنث والجمع",
        "storyAr": "في ضمير الوصل المضاف، انظر إلى الاسم السابق لا إلى الشيء المملوك: الاسم السابق المذكر والمحايد يأخذ dessen، والمؤنث والجمع يأخذ deren. اسأل «لمن يعود الضمير؟» قبل النظر إلى جنس الاسم الذي يأتي بعده.",
        "zeilen": [
            {"code": "مذكر", "de": "Der Mann, dessen Auto vor der Tür steht, wartet.", "ar": "Mann مذكر؛ لذلك dessen، مع أن Auto محايد."},
            {"code": "محايد", "de": "Das Kind, dessen Spielzeug fehlt, sucht es.", "ar": "Kind محايد؛ لذلك dessen."},
            {"code": "مؤنث", "de": "Die Frau, deren Mann Arzt ist, wohnt hier.", "ar": "Frau مؤنث؛ لذلك deren، رغم أن Mann مذكر."},
            {"code": "جمع", "de": "Die Leute, deren Kinder hier wohnen, sind freundlich.", "ar": "Leute جمع؛ لذلك deren."},
        ],
        "gramIds": ["b2-relativ-genitiv"],
        "warnung": "الجنس والعدد يتبعان الاسم السابق؛ لا الشيء المملوك بعد dessen/deren.",
    },
]
mnemonics = load("eselsbruecken.json")
existing_mnemonic_ids = {item["id"] for item in mnemonics}
for card in memory_cards:
    existing = next((item for item in mnemonics if item["id"] == card["id"]), None)
    if existing is None:
        mnemonics.append(card)
        existing_mnemonic_ids.add(card["id"])
    else:
        existing.update(card)
assert all(card["gramIds"] and all(gid in grammar for gid in card["gramIds"]) for card in memory_cards)
save("eselsbruecken.json", mnemonics)

print(
    f"R143b: {len(rule_updates)} Regel-Felder bereinigt, "
    f"{sum(len(p) for p in pitfall_updates.values())} Fallen ergänzt, "
    f"{len(exercise_updates)} Themen um eine Übung erweitert, "
    f"{len(memory_cards)} Merkhilfen hinzugefügt; Versicherungsdialog ohne ungesicherte Prozentzahl."
)
