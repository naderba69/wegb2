"""Wave B — add the A2 lesson on open type questions with was-für.

Source-backed grammar design: IDS/Grammis classifies was-für-ein and welch-
as W-articles; was-für-ein declines like the indefinite article and drops
"ein" in the plural. Scope here is A2: nominative/accusative plus common
"mit" + dative, with the genitive intentionally not made a learning target.
Reference: https://grammis.ids-mannheim.de/kontrastive-grammatik/3763

The script is deliberately one-shot and dry-run by default. It refuses to
write unless every content/schema/answer/source check passes. Run with
  python3 scripts/patches/add_a2_wasfuer.py --apply
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
GRAMMAR = ROOT / "content" / "grammar.json"
PLAN = ROOT / "lib" / "plan.ts"
BRUECKEN = ROOT / "content" / "eselsbruecken.json"
LESSON_ID = "a2-wasfuer"
HOOK_ID = "e-wasfuer"
AR = re.compile(r"[\u0600-\u06ff]")

lesson = {
    "id": LESSON_ID,
    "titleDe": "Was für ein? — nach der Art fragen",
    "titleAr": "السؤال عن النوع: Was für ein/eine?",
    "level": "A2",
    "ziel": "تسأل سؤالاً مفتوحاً عن نوع شيء، وتختار صيغة was für ein بحسب جنس الاسم وحالته (الرفع والنصب، والداتيف الشائع مع mit)؛ وتستعمل was für بلا ein مع الجمع.",
    "voraus": ["a1-akkusativ", "a2-dativ", "a2-demo"],
    "anwendung": {
        "ar": "في مقهى، اسأل سؤالاً مفتوحاً عن نوع مشروب متاح، ثم قل أيّ نوع تريد أن تجرّب. لا تختَر من قائمةٍ جاهزة؛ كوّن السؤال والجواب بنفسك.",
        "de": "Im Café: Frage offen nach der Art eines Getränks. Sage danach, was du gern probieren möchtest.",
    },
    "summaryAr": "Was für ein/eine? تسأل غالباً عن النوع أو الصفة، لا عن شيءٍ واحد معروف سلفاً. تُصرَّف المجموعة على نمط أداة النكرة بحسب جنس الاسم وحالته: Was für ein Film (رفع) لكن Was für einen Film (نصب). مع mit يأتي الداتيف: mit was für einem Bus؛ وفي الجمع يسقط ein: Was für Bücher? الحالة يحددها دور الاسم أو حرف الجر، لا كلمة für وحدها. أمّا welcher/welche/welches فتسأل غالباً عن اختيارٍ من بدائل معروفة.",
    "rules": [
        {
            "de": "Was für ein Buch liest du gern? — Ein Buch über Tiere.",
            "ar": "Was für ein يسأل غالباً عن النوع، ويقبل جواباً مفتوحاً يصفه؛ لا يشترط أن تكون أمامك خيارات محددة.",
        },
        {
            "de": "Was für ein Bus fährt zum Bahnhof? — Welcher Bus fährt zum Bahnhof, Bus 3 oder Bus 5?",
            "ar": "مع الاسم والجنس والحالة نفسها يبقى Bus فاعلاً مرفوعاً: Was für ein Bus يسأل عن النوع؛ Welcher Bus يطلب اختياراً من بدائل معلومة. يوضح المثال فرق المقصد، لا قاعدة مطلقة تمنع التداخل.",
        },
        {
            "de": "Was für ein Film gefällt dir? — Was für einen Film suchst du?",
            "ar": "Film فاعل مع gefällt: Nominativ ein؛ ومفعول مع suchst: Akkusativ einen.",
        },
        {
            "de": "Was für eine Tasche brauchst du? — Was für ein Buch liest du? — Was für Bücher liest du?",
            "ar": "المؤنث eine، والمحايد ein في الرفع والنصب؛ وفي الجمع يأتي الاسم بلا ein.",
        },
        {
            "de": "Mit was für einem Bus fährst du? — Mit was für Büchern lernst du?",
            "ar": "mit يطلب Dativ: einem للمذكر/المحايد، وبالجمع Büchern (مع -n للداتيف الجمع).",
        },
        {
            "de": "Was für ein Geschenk passt zu diesem Anlass? — Das Geschenk ist für einen Freund.",
            "ar": "في سؤال Was für ein تُعامل العبارة كوحدة استفهامية؛ أمّا für في الجملة الثانية فحرف جر مستقل بمعنى «لـ» ويأخذ Akkusativ.",
        },
    ],
    "tables": [
        {
            "captionAr": "صيغة المجموعة بحسب الجنس والحالة والعدد",
            "headers": [
                "الحالة",
                "مذكر: der Film",
                "مؤنث: die Tasche",
                "محايد: das Buch",
                "جمع: die Bücher",
            ],
            "rows": [
                ["Nominativ", "Was für ein Film", "Was für eine Tasche", "Was für ein Buch", "Was für Bücher"],
                ["Akkusativ", "Was für einen Film", "Was für eine Tasche", "Was für ein Buch", "Was für Bücher"],
                ["Dativ (mit)", "mit was für einem Film", "mit was für einer Tasche", "mit was für einem Buch", "mit was für Büchern"],
            ],
        }
    ],
    "examples": [
        {"de": "Was für ein Buch liest du gern? — Ein Buch über Tiere.", "ar": "ما نوع الكتاب الذي تقرؤه؟ — كتاب عن الحيوانات."},
        {"de": "Was für einen Film suchst du? — Einen Film über die Natur.", "ar": "ما نوع الفيلم الذي تبحث عنه؟ — فيلم عن الطبيعة."},
        {"de": "Was für eine Tasche brauchst du? — Eine Tasche für den Sport.", "ar": "ما نوع الحقيبة التي تحتاجها؟ — حقيبة للرياضة."},
        {"de": "Mit was für einem Bus fährst du? — Mit einem Bus, der oft hält.", "ar": "بأي نوع من الحافلات تذهب؟ — بحافلة تتوقف كثيراً."},
        {"de": "Was für Bücher liest du gern? — Bücher über Reisen.", "ar": "ما أنواع الكتب التي تحب قراءتها؟ — كتب عن السفر."},
        {"de": "Welches Buch meinst du: das hier oder das dort? — Das dort.", "ar": "أيّ كتاب تقصد: هذا أم ذاك؟ — ذاك."},
    ],
    "pitfalls": [
        {"de": "„Was für einen Film gefällt dir?“ ✗ → „Was für ein Film gefällt dir?“ ✓", "ar": "Film هو الفاعل مع gefällt، لذلك Nominativ ein لا Akkusativ einen."},
        {"de": "„Was für ein Film suchst du?“ ✗ → „Was für einen Film suchst du?“ ✓", "ar": "Film مفعول مباشر مع suchen؛ المذكر في Akkusativ يأخذ einen."},
        {"de": "„Was für ein Tasche?“ ✗ → „Was für eine Tasche?“ ✓", "ar": "Tasche مؤنث؛ صيغة أداة النكرة eine."},
        {"de": "„Was für ein Bücher?“ ✗ → „Was für Bücher?“ ✓", "ar": "في الجمع لا يأتي ein؛ وفي Dativ الجمع بعد mit: Büchern."},
        {"de": "„Mit was für einen Bus?“ ✗ → „Mit was für einem Bus?“ ✓", "ar": "mit يطلب Dativ؛ لا تجعل für داخل المجموعة الثابتة سبباً لاختيار Akkusativ."},
    ],
    "exercises": [
        {
            "id": "a2-wf-e01",
            "type": "mc",
            "promptDe": "Du kennst keine bestimmten Buchtitel und fragst nach dem Genre. Welche Frage passt?",
            "promptAr": "تسأل عن النوع من دون عناوين محددة للاختيار بينها.",
            "options": [
                "Was für ein Buch liest du gern?",
                "Welches Buch liest du — das hier oder das dort?",
                "Wie viele Seiten hat das Buch?",
            ],
            "answer": "Was für ein Buch liest du gern?",
            "explanationAr": "السؤال عن نوع مفتوح يناسبه Was für ein؛ أمّا Welches فيعرض اختياراً من بدائل معروفة.",
        },
        {
            "id": "a2-wf-e02",
            "type": "fill",
            "promptDe": "Was für ___ Buch liegt hier? (das Buch, Nominativ)",
            "text": "Was für ___ Buch liegt hier?",
            "answer": "ein",
            "explanationAr": "Buch محايد وهو الفاعل مع liegt؛ Nominativ المحايد: Was für ein Buch.",
        },
        {
            "id": "a2-wf-e03",
            "type": "umformung",
            "quelleDe": "Welcher Film gefällt dir?",
            "promptDe": "Frage offen nach dem Genre, nicht nach einem bestimmten Film.",
            "promptAr": "حوّل الاختيار بين أفلام محددة إلى سؤال مفتوح عن النوع.",
            "answer": "Was für ein Film gefällt dir?",
            "mussEnthalten": ["was für ein film"],
            "darfNicht": ["welcher film", "was für einen film"],
            "points": 2,
            "explanationAr": "Film فاعل مع gefällt، فيبقى في Nominativ: ein؛ Was für يسأل عن النوع.",
        },
        {
            "id": "a2-wf-e04",
            "type": "fill",
            "promptDe": "Was für ___ Film suchst du für den Abend? (der Film, Akkusativ)",
            "text": "Was für ___ Film suchst du für den Abend?",
            "answer": "einen",
            "explanationAr": "Film مفعول مباشر مع suchst؛ المذكر في Akkusativ: einen.",
        },
        {
            "id": "a2-wf-e05",
            "type": "fill",
            "promptDe": "Was für ___ Tasche brauchst du? (die Tasche, Akkusativ)",
            "text": "Was für ___ Tasche brauchst du?",
            "answer": "eine",
            "explanationAr": "Tasche مؤنث؛ أداة النكرة تبقى eine في Nominativ وAkkusativ.",
        },
        {
            "id": "a2-wf-e06",
            "type": "fill",
            "promptDe": "Was für ___ Buch möchtest du lesen? (das Buch, Akkusativ)",
            "text": "Was für ___ Buch möchtest du lesen?",
            "answer": "ein",
            "explanationAr": "Buch محايد في Akkusativ؛ الصيغة ein لا تتغير.",
        },
        {
            "id": "a2-wf-e07",
            "type": "fill",
            "promptDe": "Mit was für ___ Bus fährst du? (der Bus, Dativ)",
            "text": "Mit was für ___ Bus fährst du?",
            "answer": "einem",
            "explanationAr": "حرف الجر mit يطلب Dativ؛ der Bus يصبح einem Bus في هذه المجموعة.",
        },
        {
            "id": "a2-wf-e08",
            "type": "fill",
            "promptDe": "___ Bücher liest du gern? (Plural, offene Frage nach der Art)",
            "text": "___ Bücher liest du gern?",
            "answer": "Was für",
            "explanationAr": "في الجمع يسقط ein: Was für Bücher، لا Was für ein Bücher.",
        },
        {
            "id": "a2-wf-e09",
            "type": "order",
            "promptDe": "Bilde eine Frage: (wir / heute / was für einen Film / sehen)",
            "answer": ["Was für einen Film", "sehen", "wir", "heute?"],
            "explanationAr": "عبارة السؤال أولاً، والفعل المصرف في الموضع الثاني؛ Film مفعول مذكر في Akkusativ: einen.",
        },
        {
            "id": "a2-wf-e10",
            "type": "translate",
            "promptDe": "ترجم إلى الألمانية: «ما نوع الحقيبة التي تبحث عنها؟»",
            "answer": "Was für eine Tasche suchst du?",
            "keywords": ["was für eine", "tasche", "suchst du"],
            "explanationAr": "السؤال عن النوع بـWas für؛ Tasche مؤنث مفعول به، لذا eine.",
        },
    ],
    "verify": [
        {
            "id": "a2-wf-v01",
            "type": "fill",
            "promptDe": "___ Geschenk passt zu diesem Anlass? (das Geschenk, offene Frage nach der Art)",
            "text": "___ Geschenk passt zu diesem Anlass?",
            "answer": "Was für ein",
            "explanationAr": "السؤال عن نوع الهدية؛ Geschenk محايد فاعل مع passt: Was für ein Geschenk.",
        },
        {
            "id": "a2-wf-v02",
            "type": "umformung",
            "quelleDe": "Welches Fahrrad nimmst du — das blaue oder das grüne?",
            "promptDe": "Frage offen nach dem Typ, nicht nach der Auswahl.",
            "promptAr": "اسأل عن النوع بلا خيارين محددين.",
            "answer": "Was für ein Fahrrad nimmst du?",
            "mussEnthalten": ["was für ein fahrrad"],
            "darfNicht": ["welches fahrrad", "das blaue", "das grüne"],
            "points": 2,
            "explanationAr": "Fahrrad محايد ومفعول به؛ المحايد في Akkusativ يبقى ein، والجديد هنا سؤالٌ عن النوع.",
        },
    ],
}

hook = {
    "id": HOOK_ID,
    "emoji": "🧭",
    "sektion": "satzbau",
    "level": "A2",
    "titleAr": "بوابتان: نوعٌ مفتوح أم اختيارٌ معلوم؟",
    "storyAr": "عند مدخل السؤال بوابتان: Was für تسأل عمّا تريد من نوعٍ من غير قائمة جاهزة، وwelcher تشير إلى واحدٍ من أشياء معروفة. عامل was für كقطعة استفهامية ثابتة، ثم بدّل ein مثل أداة النكرة بحسب الاسم والحالة: Was für ein Film gefällt dir؟ لكن Was für einen Film suchst du؟ ومع الجمع يسقط ein؛ ومع mit يأتي Dativ. ولا تخلط البوابة المركّبة بحرف الجر المستقل für في für einen Freund.",
    "zeilen": [
        {"code": "النوع المفتوح", "de": "Was für ein Buch liest du?", "ar": "ما نوع الكتاب؟ لا اختياراً من قائمة."},
        {"code": "اختيار معلوم", "de": "Welcher Bus fährt zum Bahnhof — Bus 3 oder Bus 5?", "ar": "أيُّ حافلةٍ تختار من الخيارين المعلومين؟"},
        {"code": "Nominativ", "de": "Was für ein Film gefällt dir?", "ar": "Film فاعل مع gefällt: ein."},
        {"code": "Akkusativ", "de": "Was für einen Film suchst du?", "ar": "Film مفعول مع suchst: einen."},
        {"code": "الجمع", "de": "Was für Bücher liest du?", "ar": "في الجمع يسقط ein."},
        {"code": "mit + Dativ", "de": "Mit was für einem Bus fährst du?", "ar": "mit يطلب Dativ: einem."},
    ],
    "gramIds": [LESSON_ID],
    "warnung": "في Was für ein تُعامل was für كوحدة استفهامية؛ في für einen Freund يكون für حرف جر مستقلاً.",
}


def fail(message: str) -> None:
    print(f"PRE-FLIGHT FAIL: {message}", file=sys.stderr)
    raise SystemExit(2)


def validate(grammar: dict, phase_text: str, hooks: list) -> None:
    if LESSON_ID in grammar:
        fail(f"{LESSON_ID} already exists; refusing to overwrite")
    if HOOK_ID in {h.get("id") for h in hooks}:
        fail(f"{HOOK_ID} already exists; refusing to duplicate")
    if phase_text.count('"a2-dativ"') != 1 or '"a2-wasfuer"' in phase_text:
        fail("A2 dativ scheduling anchor changed or the lesson is already scheduled")
    if len(lesson["exercises"]) < 9 or len(lesson["verify"]) != 2:
        fail("training/verification minimums are not met")
    if len(lesson["pitfalls"]) < 3 or len(lesson["examples"]) < 3 or len(lesson["rules"]) < 3:
        fail("lesson explanation/model/pitfall minimums are not met")
    if not lesson.get("ziel") or not lesson.get("voraus") or not lesson.get("anwendung"):
        fail("goal, prerequisite, and independent-use task are required")
    if lesson["voraus"] != ["a1-akkusativ", "a2-dativ", "a2-demo"]:
        fail("the prerequisite list changed; re-check the agreed sequence")
    if len(lesson["tables"][0]["headers"]) != 5 or any(
        len(row) != len(lesson["tables"][0]["headers"]) for row in lesson["tables"][0]["rows"]
    ):
        fail("declension table has inconsistent columns")
    ids = [
        e["id"]
        for topic in grammar.values()
        for e in (topic.get("exercises") or []) + (topic.get("verify") or [])
        if e.get("id")
    ]
    new_ids = [e["id"] for e in lesson["exercises"] + lesson["verify"]]
    if len(ids + new_ids) != len(set(ids + new_ids)):
        fail("exercise IDs collide with the existing bank")
    for where, exercises in (("exercise", lesson["exercises"]), ("verify", lesson["verify"])):
        for ex in exercises:
            if not AR.search(ex.get("explanationAr", "")):
                fail(f"{where}/{ex['id']} needs specific Arabic feedback")
            if ex["type"] in {"mc", "order", "truefalse", "umformung", "dictation"} and AR.search(ex.get("promptDe", "")):
                fail(f"{where}/{ex['id']} has Arabic in a German-only prompt")
            if ex["type"] == "mc":
                options = ex.get("options") or []
                if len(options) < 3 or len(options) != len(set(options)) or ex["answer"] not in options:
                    fail(f"{where}/{ex['id']} has invalid multiple-choice options")
            if ex["type"] == "umformung":
                if not ex.get("quelleDe") or not ex.get("mussEnthalten") or not ex.get("darfNicht"):
                    fail(f"{where}/{ex['id']} needs source, target anchors, and a named trap")
    for rule in lesson["rules"]:
        if AR.search(rule.get("de", "")):
            fail("Arabic leaked into a German rule")
    for example in lesson["examples"]:
        if AR.search(example.get("de", "")):
            fail("Arabic leaked into a German model")
    if len(hook["storyAr"]) < 40 or any(AR.search(line["de"]) for line in hook["zeilen"]):
        fail("memory hook is incomplete or mixes scripts")
    if hook["gramIds"] != [LESSON_ID]:
        fail("memory hook must belong only to the new lesson")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write after all pre-flight assertions pass")
    args = parser.parse_args()

    grammar = json.loads(GRAMMAR.read_text(encoding="utf-8"))
    plan_text = PLAN.read_text(encoding="utf-8")
    hooks = json.loads(BRUECKEN.read_text(encoding="utf-8"))
    validate(grammar, plan_text, hooks)

    # Insert next to the other late-added A2 lessons, directly after a2-demo.
    rebuilt = {}
    for key, value in grammar.items():
        rebuilt[key] = value
        if key == "a2-demo":
            rebuilt[LESSON_ID] = lesson
    if LESSON_ID not in rebuilt:
        fail("a2-demo insertion point is missing")

    phase_pattern = re.compile(r'(?m)^  A2: \[(.*?)\],$')
    match = phase_pattern.search(plan_text)
    if not match or '"a2-dativ"' not in match.group(1):
        fail("PHASE_TOPICS.A2 dativ insertion point is missing")
    updated_topics = match.group(1).replace('"a2-dativ"', '"a2-dativ", "a2-wasfuer"')
    updated_plan = plan_text[:match.start(1)] + updated_topics + plan_text[match.end(1):]
    if updated_plan == plan_text:
        fail("the plan did not change")

    if not args.apply:
        print("PRE-FLIGHT OK — would add 1 A2 lesson (10 practice + 2 delayed checks), 1 memory hook, and place it after a2-dativ in the A2 schedule; K132 verifies every prerequisite's actual day.")
        print("No files written. Re-run with --apply to write.")
        return

    GRAMMAR.write_text(json.dumps(rebuilt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    PLAN.write_text(updated_plan, encoding="utf-8")
    hooks.append(hook)
    BRUECKEN.write_text(json.dumps(hooks, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Applied Wave B: a2-wasfuer + e-wasfuer; PHASE_TOPICS.A2 now includes the lesson.")


if __name__ == "__main__":
    main()
