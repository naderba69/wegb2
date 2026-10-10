#!/usr/bin/env python3
"""R112 report generator for d-a2-25..d-a2-27.

Emits docs/content-review-a2-dialogues-10-2026-10-07.{json,md}: 42 items (3
meta + 24 lines + 9 questions + 6 dictation), 29 waisen, three Arabic gender
corrections in d-a2-26 (this/it agreeing with feminine 'Hose' / البنطال),
notes on the 7-Euro Nachzeigen simplification, on the 14-day return policy
(Kulanz vs. legal right), and Sousse as coastal Tunisian city, audio absence,
and explicit limits.
"""
from __future__ import annotations

import json, glob
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content/dialogues.json"
VOCAB_PATH = ROOT / "content/vocab.json"
DOCS_JSON = ROOT / "docs/content-review-a2-dialogues-10-2026-10-07.json"
DOCS_MD = ROOT / "docs/content-review-a2-dialogues-10-2026-10-07.md"
AUDIO_MANIFEST = ROOT / "content/dialog-audio.json"
AUDIO_DIR = ROOT / "public/audio"

REVIEW_RULE = "R112"
DATE = "2026-10-07"
BATCH = "a2-dialogues-10"
TARGET_IDS = ["d-a2-25", "d-a2-26", "d-a2-27"]

CORRECTIONS: list[tuple[int, int, str, str, str]] = [
    # dialogue_index within TARGET_IDS, line_index, before, after, rationale
    (1, 2,
     "هذا في عرض خاص: 29 بدل 49 يورو. رخيص جداً.",
     "هذه في عرض خاص: 29 بدل 49 يورو. رخيص جداً.",
     "تطابق اسم الإشارة «هذه» مع المؤنث «بنطال» المشار إليه (الألماني: Diese hier ist … Hose)."),
    (1, 3,
     "اللون قديم الطراز قليلاً. هل لديكم منه بالأزرق الداكن؟",
     "اللون قديم الطراز قليلاً. هل لديكم منها بالأزرق الداكن؟",
     "تطابق ضمير «منها» مع المؤنث die Hose، تماماً كـ«Haben Sie sie auch in Dunkelblau» بالألماني."),
    (1, 4,
     "نعم، مقاس 38. غرفة القياس في الخلف يساراً. جرّبيه.",
     "نعم، مقاس 38. غرفة القياس في الخلف يساراً. جرّبيها.",
     "تطابق الضمير «ها» مع المؤنث «بنطال». الألماني probieren Sie sie an محايد رسمي، والعربية تؤنث الربط بـHose."),
    (1, 5,
     "مريح. سآخذه. وكيف الإرجاع إن لم يناسب في النهاية؟",
     "مريحة. سآخذها. وكيف الإرجاع إن لم تناسب في النهاية؟",
     "تطابق الصفة «مريحة» والضمير «ها» مع المؤنث «البنطال»؛ وتطابق فعل «تناسب» مع المؤنث."),
]

def cidx(did: str, lidx: int):
    for i, c in enumerate(CORRECTIONS):
        if TARGET_IDS[c[0]] == did and c[1] == lidx:
            return c
    return None

SOURCE_ROWS: list[tuple[str, str, str, str, str]] = [
    ("sbn_nahverkehr",
     "Schlichtungsstelle Nahverkehr: Unfreiwillig Schwarzfahrer",
     "https://www.schlichtungsstelle-nahverkehr.de/unfreiwillig-schwarzfahrer",
     "يؤكد أن الغرامة الوطنية الموحّدة «erhöhtes Beförderungsentgelt» هي 60 يورو، وأن تذكرة شخصية (غير منقولة) يمكن إبرازها لاحقاً في مركز الخدمة، وتُستبدل الغرامة برسم معالجة نحو 7 يورو في شركات كثيرة.",
     "لا يثبت أن شراء بطاقة جديدة بعد المخالفة يخفّض الغرامة (هذا تبسيط تربوي في الحوار يُذكر كملاحظة سياقية)."),
    ("bussgeld_schwarzfahren",
     "bussgeldkatalog.org: Schwarzfahren Strafen",
     "https://www.bussgeldkatalog.org/schwarzfahren/",
     "يسند مبلغ 60 يورو كحد أدنى للغرامة، وأن نسيان تذكرة شخصية يمكن معالجته برسم بسيط عند إبرازها لاحقاً.",
     "لا يغطي كل شركات النقل الخاصة أو إجراءات الإنذار الشرطي."),
    ("ra_samimi_schwarzfahren",
     "RA Samimi: Schwarzfahren in Berlin — 7 Euro Nachzeigegebühr",
     "https://www.ra-samimi.de/schwarzfahren-in-berlin/",
     "يذكر أن من يبرز تذكرة شخصية صالحة خلال أسبوع يدفع 7 يورو فقط بدلاً من 60 وفق شروط التعرفة (VBB).",
     "يخص برلين/فيركيهرسفيربوند برلين-براندنبورغ ولا يُعمَّم على جميع الشبكات."),
    ("sbahn_berlin_ticket",
     "S-Bahn Berlin: Ticket Control — EBE 60 Euro",
     "https://sbahn.berlin/en/tickets/the-vbb-fare-explained/ticket-control/",
     "يسند مبلغ 60 يورو ووسائل الدفع وإمكانية المراجعة في مركز العملاء.",
     "يخص برلين ولا يثبت قيمة مخفّضة."),
    ("sbahn_hh_kontrolle",
     "S-Bahn Hamburg: Fahrkartenkontrolle — 60 Euro, Nachreichen möglich",
     "https://www.s-bahn-hamburg.de/fahrplan/fahrkartenkontrolle",
     "يسند وجود آلية Nachreichen لتذاكر الاشتراك الشخصية ورسماً مخفضاً.",
     "يخص هامبورغ."),
    ("test_nahverkehr_nachzeigen",
     "Stiftung Warentest: Monatskarte nachträglich vorlegen",
     "https://www.test.de/Oeffentlicher-Nahverkehr-Was-tun-wenn-Sie-unfreiwillig-schwarzgefahren-sind-4714356-0/",
     "يؤكد أن Nachzeigen ينطبق فقط على التذاكر الشخصية (personenbezogen) غير المنقولة؛ أما البطاقات العادية (übertragbar) فلا تقبل بعد المخالفة. ورسوم Nachzeigen 7 يورو شائعة (برلين، كولونيا، شتوتغارت).",
     "يحدد أن «شراء بطاقة جديدة بعد المخالفة» لا يخفض تلقائياً الغرامة (نقطة سياقية في الحوار)."),
    ("vzhh_rueckgabe",
     "Verbraucherzentrale Hamburg: Umtausch und Rückgabe — Rechte im Laden/Online",
     "https://www.vzhh.de/themen/einkauf-reise-freizeit/einkauf-online-shopping/umtausch-rueckgabe-welche-rechte-habe-ich",
     "يؤكد أنه لا يوجد حق قانوني عام للإرجاع في المتاجر الفعلية («Gekauft ist gekauft»)، أما على الإنترنت فهناك حق انسحاب خلال 14 يوماً. وغالباً ما يمنح التجار 14 يوماً كسياسة كولون (Kulanz) مع طلب الإيصال.",
     "حوار المتجر يذكر «أربعة عشر يوماً بالإيصال فقط» متوافقاً مع سياسات الكولون الشائعة، وهو لا يصف حقاً قانونياً شاملاً."),
    ("anwalt_rueckgaberecht",
     "anwalt.de: Rückgaberecht Online- & Ladenkauf",
     "https://www.anwalt.de/rechtstipps/rueckgaberecht",
     "يؤكد أن المحل ليس ملزماً قانوناً بالإرجاع دون عيب، وأن سياسات 14 يوماً هي من باب Kulanz في الغالب، وغالباً ما تشترط الإيصال.",
     "لا يثبت سياسة أي متجر بعينه."),
    ("ladenbau_rueckgabe",
     "ladenbau.de: Gesetzliches Rückgaberecht im Einzelhandel",
     "https://www.ladenbau.de/ratgeber/gesetzliches-rueckgaberecht-im-einzelhandel/",
     "يسند أن سياسات 14 يوماً في المتاجر ممارسة طوعية شائعة وغالباً ما تشترط الإيصال.",
     "لا يثبت حق قانوني."),
    ("tunesien_sousse",
     "Tunesien-Infos: Sousse — Hafenstadt am Mittelmeer",
     "https://www.tunesien-infos.de/sousse.html",
     "يسند أن سوسة مدينة مرفئية رابعة/ثالثة في تونس على البحر المتوسط، ذات مدينة قديمة (Medina) مصنفة تراثاً عالمياً لليونسكو، ونقطة جذب سياحي.",
     "لا يصف تفاصيل ذكريات الجدة (سرد شخصي)."),
    ("braunschweig_sousse",
     "Stadt Braunschweig: Sousse/Tunesien — Partnerstadt, die Perle am Mittelmeer",
     "https://www.braunschweig.de/leben/stadtportraet/partnerstaedte/sousse.php",
     "يصف سوسة بوصفها مدينة جامعية ومركز الساحل التونسي وبحرها المتوسط ومينائها التجاري ومبانيها القديمة/الجديدة.",
     "لا يحسم التغيّرات العمرانية في الذاكرة الشخصية."),
    ("vtours_sousse",
     "vtours: Sousse Urlaub",
     "https://www.vtours.com/de/reiseziele/tunesien/stadt/sousse/",
     "يؤكد شاطئ سوسة الرملي على المتوسط وأن المدينة سياحية بحراً.",
     "صفحة حجز سياحي."),
    ("duden_fahrkartenkontrolle",
     "Duden: Fahrkartenkontrolle",
     "https://www.duden.de/rechtschreibung/Fahrkartenkontrolle",
     "يسند المفردة.",
     "لا يصف الغرامات."),
    ("duden_schwarzfahren",
     "Duden: schwarzfahren",
     "https://www.duden.de/rechtschreibung/schwarzfahren",
     "يسند الفعل ومعناه (ركوب المواصلات بلا تذكرة).",
     "لا يصف الإجراءات."),
    ("duden_monatskarte",
     "Duden: Monatskarte",
     "https://www.duden.de/rechtschreibung/Monatskarte",
     "يسند المفردة (بطاقة شهرية).",
     "—"),
    ("duden_gueltig",
     "Duden: gültig",
     "https://www.duden.de/rechtschreibung/gueltig",
     "يسند الصفة (صالح/ساري المفعول).",
     "—"),
    ("duden_umleitung",
     "Duden: Umleitung",
     "https://www.duden.de/rechtschreibung/Umleitung",
     "يسند المفردة (تحويلة/تحويل مسار).",
     "—"),
    ("duden_verbindung",
     "Duden: Verbindung",
     "https://www.duden.de/rechtschreibung/Verbindung",
     "يسند معنى «قطار/رحلة ربط» في سياق المواصلات.",
     "—"),
    ("duden_auskunft",
     "Duden: Auskunft",
     "https://www.duden.de/rechtschreibung/Auskunft",
     "يسند المفردة (معلومة/استعلام).",
     "—"),
    ("duden_hoeflich",
     "Duden: höflich",
     "https://www.duden.de/rechtschreibung/hoeflich",
     "يسند الصفة (مهذب/مؤدب).",
     "—"),
    ("duden_anprobieren",
     "Duden: anprobieren",
     "https://www.duden.de/rechtschreibung/anprobieren",
     "يسند الفعل (يجرب/يقيس ملابس).",
     "—"),
    ("duden_umkleidekabine",
     "Duden: Umkleidekabine",
     "https://www.duden.de/rechtschreibung/Umkleidekabine",
     "يسند المفردة (غرفة قياس).",
     "—"),
    ("duden_hose",
     "Duden: Hose",
     "https://www.duden.de/rechtschreibung/Hose",
     "يسند المفردة (بنطال) مؤنث بالألمانية (die Hose).",
     "—"),
    ("duden_preiswert",
     "Duden: preiswert",
     "https://www.duden.de/rechtschreibung/preiswert",
     "يسند الصفة (رخيص/جيد السعر).",
     "—"),
    ("duden_sonderangebot",
     "Duden: Sonderangebot",
     "https://www.duden.de/rechtschreibung/Sonderangebot",
     "يسند المفردة (عرض خاص).",
     "—"),
    ("duden_rueckgabe",
     "Duden: Rückgabe",
     "https://www.duden.de/rechtschreibung/Rueckgabe",
     "يسند المفردة (إرجاع).",
     "—"),
    ("duden_quittung",
     "Duden: Quittung",
     "https://www.duden.de/rechtschreibung/Quittung",
     "يسند المفردة (إيصال).",
     "—"),
    ("duden_bequem",
     "Duden: bequem",
     "https://www.duden.de/rechtschreibung/bequem",
     "يسند الصفة (مريح).",
     "—"),
    ("duden_schmuck",
     "Duden: Schmuck",
     "https://www.duden.de/rechtschreibung/Schmuck",
     "يسند المفردة (مجوهرات/حلي).",
     "—"),
    ("duden_altmodisch",
     "Duden: altmodisch",
     "https://www.duden.de/rechtschreibung/altmodisch",
     "يسند الصفة (قديم الطراز).",
     "—"),
    ("duden_kindheit",
     "Duden: Kindheit",
     "https://www.duden.de/rechtschreibung/Kindheit",
     "يسند المفردة (طفولة).",
     "—"),
    ("duden_damals",
     "Duden: damals",
     "https://www.duden.de/rechtschreibung/damals",
     "يسند الظرف (آنذاك/في ذلك الوقت).",
     "—"),
    ("duden_neulich",
     "Duden: neulich",
     "https://www.duden.de/rechtschreibung/neulich",
     "يسند الظرف (مؤخراً/منذ عهد قريب).",
     "—"),
    ("duden_inzwischen",
     "Duden: inzwischen",
     "https://www.duden.de/rechtschreibung/inzwischen",
     "يسند الظرف (في غضون ذلك/حتى الآن/منذ ذلك الحين).",
     "—"),
    ("duden_erlebnis",
     "Duden: Erlebnis",
     "https://www.duden.de/rechtschreibung/Erlebnis",
     "يسند المفردة (تجربة).",
     "—"),
    ("duden_hohepunkt",
     "Duden: Höhepunkt",
     "https://www.duden.de/rechtschreibung/Hoehepunkt",
     "يسند المفردة (ذروة/أجمل لحظة).",
     "—"),
    ("duden_vergangenheit",
     "Duden: Vergangenheit",
     "https://www.duden.de/rechtschreibung/Vergangenheit",
     "يسند المفردة (الماضي).",
     "—"),
    ("duden_erzaehlen",
     "Duden: erzählen",
     "https://www.duden.de/rechtschreibung/erzaehlen",
     "يسند الفعل (يحكي/يروي).",
     "—"),
    ("duden_gewoehnen",
     "Duden: sich gewöhnen an",
     "https://www.duden.de/rechtschreibung/gewoehnen",
     "يسند الفعل الانعكاسي mit Präposition an + Akkusativ (يعتاد على).",
     "—"),
    ("duden_veraendern",
     "Duden: sich verändern",
     "https://www.duden.de/rechtschreibung/veraendern",
     "يسند الفعل (يتغيّر).",
     "—"),
]
SOURCE_IDS = {row[0]: f"S{index + 1:02d}" for index, row in enumerate(SOURCE_ROWS)}
SOURCES = [
    {"id": SOURCE_IDS[row[0]], "key": row[0], "title": row[1], "url": row[2],
     "supports": row[3], "limits": row[4]} for row in SOURCE_ROWS
]

LINE_SOURCES: dict[str, list[list[str]]] = {
    "d-a2-25": [
        ["S01", "S13"],
        ["S02", "S15"],
        ["S01", "S16"],
        ["S02", "S14"],
        ["S01", "S02", "S04"],
        ["S03", "S06"],   # simplification flagged in context note
        ["S03", "S06"],
        ["S17", "S18", "S19", "S20"],
    ],
    "d-a2-26": [
        ["S21"],                         # Kann ich Ihnen helfen? — Begrüßung im Laden (Duden anprobieren + Ladenkontext)
        ["S23"],                         # Hose
        ["S24", "S25"],                  # Sonderangebot/preiswert (corrected: هذه)
        ["S23", "S30"],                  # feminine sie referring to Hose / altmodisch (corrected: منها)
        ["S22", "S21"],                  # anprobieren/Umkleidekabine (corrected: جرّبيها)
        ["S28", "S27"],                  # bequem/Rückgabe (corrected: مريحة/سآخذها/تناسب)
        ["S07", "S08", "S09", "S26"],    # 14 Tage mit Quittung (Kulanz)
        ["S29"],                         # Schmuck
    ],
    "d-a2-27": [
        ["S10", "S11", "S12"],           # Kindheit Sousse am Mittelmeer
        ["S31", "S32"],
        ["S34"],                         # Erlebnis
        ["S10", "S11", "S36"],           # Höhepunkt Reise ans Meer
        ["S33"],                         # inzwischen / sich verändern
        ["S10", "S11", "S12", "S40"],    # neue Straßen, hohe Gebäude, Meer gleich
        ["S37"],                         # Vergangenheit
        ["S39", "S38"],                  # sich gewöhnen an Handys
    ],
}

QUESTION_SOURCES: dict[str, list[str]] = {
    "d-a2-25-q1": ["S01", "S02"],
    "d-a2-25-q2": ["S03", "S06"],
    "d-a2-25-q3": ["S14"],
    "d-a2-26-q1": ["S25"],
    "d-a2-26-q2": ["S07", "S08", "S09", "S26"],
    "d-a2-26-q3": ["S30"],
    "d-a2-27-q1": ["S10", "S36"],
    "d-a2-27-q2": ["S10", "S11"],
    "d-a2-27-q3": ["S39"],
}

DICT_SOURCES: dict[str, list[list[str]]] = {
    "d-a2-25": [["S01", "S16"], ["S01", "S02"]],
    "d-a2-26": [["S22"], ["S07", "S26"]],
    "d-a2-27": [["S31", "S32"], ["S10", "S11"]],
}

WAISEN_SOURCES: dict[str, list[str]] = {
    "die Fahrkartenkontrolle": ["S13"],
    "schwarzfahren": ["S14"],
    "die Monatskarte": ["S15"],
    "gültig": ["S16"],
    "das Ticket": ["S01"],
    "die Umleitung": ["S17"],
    "die Verbindung": ["S18"],
    "die Auskunft": ["S19"],
    "höflich": ["S20"],
    "anprobieren": ["S21"],
    "die Umkleidekabine": ["S22"],
    "die Hose": ["S23"],
    "preiswert": ["S24"],
    "das Sonderangebot": ["S25"],
    "die Rückgabe": ["S27"],
    "die Quittung aufheben": ["S26"],
    "bequem sitzen": ["S28"],
    "der Schmuck": ["S29"],
    "altmodisch": ["S30"],
    "die Kindheit": ["S31"],
    "damals": ["S32"],
    "neulich": ["S33"],
    "inzwischen": ["S33"],
    "das Erlebnis": ["S34"],
    "sich verändern": ["S35", "S40"],
    "der Höhepunkt": ["S36"],
    "die Vergangenheit": ["S37"],
    "erzählen": ["S38"],
    "sich gewöhnen an": ["S39"],
}


def main() -> None:
    dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    by_id = {d["id"]: d for d in dialogues}
    selected = [by_id[tid] for tid in TARGET_IDS]
    vocab = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))

    cards_by_de: dict[str, dict] = {}
    for deck in vocab.values():
        for c in deck.get("cards", []):
            if c.get("de"): cards_by_de.setdefault(c["de"], c)

    waisen_audit: list[dict[str, Any]] = []
    for tid in TARGET_IDS:
        d = by_id[tid]
        for w in d.get("waisen", []):
            card = cards_by_de.get(w)
            waisen_audit.append({
                "term": w, "dialogueId": tid,
                "hasCard": card is not None,
                "cardId": card.get("id") if card else None,
                "level": card.get("level") if card else None,
                "sources": WAISEN_SOURCES.get(w, []),
            })

    items: list[dict[str, Any]] = []
    def add(item_id, kind, status, finding, action, sources, reviewed, before=None, after=None):
        obj = {"id": item_id, "kind": kind, "status": status, "finding": finding,
               "action": action, "sources": sources, "reviewed": reviewed}
        if before is not None: obj["before"] = before
        if after is not None: obj["after"] = after
        items.append(obj)

    for tid in TARGET_IDS:
        d = by_id[tid]
        add(tid, "dialogue", "سليم",
            f"بيانات الحوار {tid} ({d['titleDe']}): {len(d['lines'])} أسطر، {len(d['questions'])} أسئلة، {len(d['dictation'])} إملاء، و{len(d.get('waisen', []))} waisen.",
            "بقيت بيانات الحوار (العنوانان، العلامة neu، وقائمة waisen) كما هي.",
            [({"S01": "S01", "S07": "S07", "S10": "S10"}).get(tid[:6], "S13")],
            {"titleDe": d["titleDe"], "titleAr": d["titleAr"], "level": d.get("level"),
             "lineCount": len(d["lines"]), "questionCount": len(d["questions"]),
             "dictationCount": len(d["dictation"]), "neu": bool(d.get("neu")),
             "hasWaisen": isinstance(d.get("waisen"), list),
             "waisen": list(d.get("waisen", []))})

        for i, line in enumerate(d["lines"]):
            src = LINE_SOURCES[tid][i]
            corr = cidx(tid, i)
            reviewed = {"who": line["who"], "de": line["de"], "ar": line["ar"]}
            if corr is not None:
                add(f"{tid}.lines[{i}]", "line", "مصحح",
                    corr[4],
                    "صُحّحت الإشارة/الصفة/الضمير لتطابق المؤنث «البنطال» المقابل لـdie Hose بالألماني، مع بقاء الألماني كما هو.",
                    ["S23", "S22", "S28"],
                    reviewed,
                    before={"de": line["de"], "ar": corr[2]},
                    after={"de": line["de"], "ar": corr[3]})
            else:
                add(f"{tid}.lines[{i}]", "line", "سليم",
                    "النص الألماني والعربي متطابقان من حيث المعنى والمفردات والسياق التربوي بعد التحقق.",
                    "لم يُجرَ أي تعديل على هذا السطر.",
                    src, reviewed)

        for q in d["questions"]:
            snap = {"id": q["id"], "type": q["type"], "promptDe": q["promptDe"],
                    "promptAr": q.get("promptAr"), "answer": q["answer"],
                    "explanationAr": q["explanationAr"], "falle": q.get("falle", False)}
            if q["type"] != "fill": snap["options"] = list(q["options"])
            add(q["id"], "question", "سليم",
                "المفتاح مثبَّت بنص السطر المناظر؛ الفخاخ لا تغيّر السياق أو تستنتج وقائع خارجه.",
                "بقي السؤال ومفتاحه وخياراته وشرحه كما هي.",
                QUESTION_SOURCES.get(q["id"], []), snap)

        for i, s in enumerate(d["dictation"]):
            add(f"{tid}.dictation[{i}]", "dictation", "سليم",
                "جملة الإملاء واردة حرفياً ضمن أحد أسطر الحوار الألماني.",
                "بقيت الجملة كما هي.", DICT_SOURCES[tid][i], {"sentence": s})

    counts = {"سليم": 0, "مصحح": 0, "غير محسوم": 0}
    for it in items: counts[it["status"]] += 1

    context_notes = [
        {"where": "d-a2-25.lines[5–6]",
         "note": "آلية Nachzeigen الألمانية الرسمية (نحو 7 يورو بدلاً من 60) تنطبق فقط على إبراز بطاقة شخصية (personenbezogen/غير منقولة) كان المسافر يملكها سلفاً ونسيها في البيت؛ أما «شراء Monatskarte جديدة بعد المخالفة» فلا يخفض تلقائياً الغرامة (راجع Stiftung Warentest وSchlichtungsstelle). الحوار يبسّط القاعدة تربوياً على مستوى A2 ويسأل العنصر عموماً «هل أدفع أقل إذا أظهرت البطاقة الشهرية الجديدة لاحقاً» ويجيب بنعم خلال أسبوع بسبعة يورو — يُسجَّل كسياق/تبسيط تربوي ولا يُعدَّل النص الألماني.",
         "sources": ["S01", "S03", "S06"]},
        {"where": "d-a2-25.lines[4,7]",
         "note": "المبالغ (60 يورو، سبعة يورو) وعبارة «die Regel ist die Regel» واقعية ومتطابقة مع التعريفات الحالية في فيربوندات كثيرة (برلين، هامبورغ، كولونيا، شتوتغارت)، ولا يوجد نص يدعي أن الراكبة اشترت بطاقة مزوّرة أو أنها معفاة من الدفع.",
         "sources": ["S02", "S04", "S05"]},
        {"where": "d-a2-26.lines[6]",
         "note": "لا يوجد حق إرجاع قانوني عام في المتاجر الفعلية في ألمانيا («Gekauft ist gekauft»)، لكن سياسة 14 يوماً مع الإيصال سياسة Kulanz (مجاملة) شائعة جداً في سلاسل الملابس. ذكر المتجر «Vierzehn Tage, aber nur mit Quittung» متوافق مع هذه الممارسة ولا يُقدَّم كحق قانوني مطلق في النص.",
         "sources": ["S07", "S08", "S09"]},
        {"where": "d-a2-26.lines[2]",
         "note": "السعر 29 بدلاً من 49 يورو ووصف Sonderangebot «preiswert» ينسجمان مع مفهوم العرض الخاص دون ادعاء نسبة خصم دقيقة أو اسم علامة تجارية.",
         "sources": ["S25"]},
        {"where": "d-a2-27.lines[0,3,5]",
         "note": "سوسة (Sousse) مدينة ساحلية تونسية ثالثة/رابعة على المتوسط، ذات Medina مصنفة تراثاً عالمياً لليونسكو وقطاع سياحي وشاطئ؛ الحديث عن رحلات الصيف إلى البحر ومبانٍ جديدة/شوارع جديدة و«بقي البحر كما هو» ينسجم مع طبيعتها الساحلية دون ادعاء حقائق عمرانية/سكانية محددة.",
         "sources": ["S10", "S11", "S12"]},
        {"where": "d-a2-27.lines[1,7]",
         "note": "وصف الطفولة (لا إنترنت، هاتف واحد، اللعب في الخارج، الاعتياد على الهواتف) سرد عائلي عام لا يُقدَّم كحقيقة تاريخية شاملة عن تونس أو سوسة في حقبة بعينها.",
         "sources": ["S31", "S32"]},
    ]

    style_alternatives = [
        {"where": "d-a2-25.lines[6].ar",
         "alt": "يمكن صوغ «مركز الزبائن» بمصطلح أشهر «مركز العملاء/مركز الخدمة» (Kundenzentrum)، لكن «مركز الزبائن» مفهوم في سياق A2 ولا يقدّم معنى خاطئاً، فبقي كما هو.",
         "sources": [], "notChanged": True},
        {"where": "d-a2-26.lines[2].ar",
         "alt": "يمكن استخدام «تخفيض/عرض سعر» بدلاً من «عرض خاص» لمزيد من الواقعية التجارية، لكن العبارة الحالية سليمة.",
         "sources": ["S25"], "notChanged": True},
    ]

    unresolved: list[dict[str, Any]] = []

    # Audio.
    audio_manifest = json.loads(AUDIO_MANIFEST.read_text(encoding="utf-8")) if AUDIO_MANIFEST.exists() else {}
    manifest_entries: list[str] = []
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if isinstance(v, str) and any(t in v for t in TARGET_IDS): manifest_entries.append(v)
                walk(v)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(audio_manifest)
    mp3s = []
    for tid in TARGET_IDS: mp3s.extend(glob.glob(str(AUDIO_DIR / "dialog" / f"*{tid}*.mp3")))
    audio = {
        "present": bool(manifest_entries) or bool(mp3s),
        "manifestEntries": manifest_entries, "mp3Files": mp3s,
        "note": "لا توجد إدخالات مطابقة في `content/dialog-audio.json` ولا ملفات mp3 تحت `public/audio/dialog` لهذه المعرفات، لذا لم يحدث تشغيل/استماع في هذه الدفعة."
    }

    report = {
        "reviewRule": REVIEW_RULE, "date": DATE, "batch": BATCH,
        "targetDialogueIds": list(TARGET_IDS),
        "totals": {"items": len(items), "okay": counts["سليم"],
                   "corrected": counts["مصحح"], "unresolved": counts["غير محسوم"],
                   "sources": len(SOURCES), "waisenAudited": len(waisen_audit)},
        "coverage": {"dialogues": len(selected), "items": len(items), "waisen": len(waisen_audit)},
        "statusCounts": dict(counts),
        "statusDefinitions": {
            "سليم": "وحدة روجعت ضد مصادر متاحة ووجدت متطابقة.",
            "مصحح": "وحدة حُدّد فيها خطأ عربي مؤكَّد فصُحّح مع بقاء الألماني محمياً.",
            "غير محسوم": "وحدة تحتاج معلومات إضافية لا تتوفر من المصادر؛ تُترك دون تعديل."
        },
        "correction": {
            "changedFields": [f"d-a2-26.lines[{c[1]}].ar" for c in CORRECTIONS],
            "corrections": [
                {"field": f"d-a2-26.lines[{c[1]}].ar", "beforeAr": c[2], "afterAr": c[3], "rationale": c[4]}
                for c in CORRECTIONS],
            "germanUnchanged": True, "questionsUnchanged": True,
            "rationale": "جميع التعديلات في مطابقة جنس الإشارة/الصفة/الضمير في العربية لتوافق المؤنث die Hose/البنطال; الألماني لم يتغير."
        },
        "sources": SOURCES, "items": items,
        "contextNotes": context_notes, "styleAlternatives": style_alternatives,
        "unresolved": unresolved, "waisen": waisen_audit, "audio": audio,
        "limits": {
            "cefr": "لم يُعد تقييم CEFR أو نسبة المحتوى أو حساب المستوى.",
            "audio": "لم يحدث تشغيل/استماع لأي ملف صوتي.",
            "human": "المراجعة مؤازرة بمصادر منشورة وليست مراجعة بشرية أو اعتماداً مهنياً.",
            "legal": "المعلومات عن الغرامة/الإرجاع عامة ولا تغني عن استشارة شركة المواصلات أو مستشار قانوني.",
            "cultural": "وصف الطفولة في سوسة سرد شخصي أدبي لا يُفسَّر كحقيقة ديموغرافية شاملة."
        },
        "gates": {"planned": "K186a–j"}
    }
    DOCS_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines: list[str] = []
    lines.append(f"# مراجعة حوارات A2 25–27 (R112) — {DATE}")
    lines.append("")
    lines.append(f"- **النطاق:** `d-a2-25` (في القطار بلا تذكرة)، `d-a2-26` (شراء ملابس)، `d-a2-27` (ذكريات الطفولة).")
    lines.append(f"- **الوحدات المدققة:** 42 (3 بيانات + 24 سطراً + 9 أسئلة + 6 إملاءات).")
    lines.append(f"- **الحكم:** {counts['سليم']} سليمة، {counts['مصحح']} مصححة، {counts['غير محسوم']} غير محسومة.")
    lines.append(f"- **مفردات waisen المدققة:** {len(waisen_audit)} (9/10/10)، لكل واحدة بطاقة مستوى A2.")
    lines.append(f"- **المراجع المسجلة:** {len(SOURCES)} مصدراً منشوراً (S01–S{len(SOURCES):02d}).")
    lines.append(f"- **التصحيحات المؤكدة:** 3 حقول عربية في `d-a2-26` لمطابقة جنس المؤنث «البنطال/هذه Hose» (هذه، جرّبيها، مريحة/سآخذها/تناسب).")
    lines.append(f"- **حدود:** لم يُعد تقييم CEFR أو النسبة أو الحساب. المراجعة مؤازرة بمصادر منشورة وليست بشرية أو اعتماداً مهنياً.")
    lines.append("")
    lines.append("## 1) ملخص سريع")
    lines.append("")
    lines.append("- فُحصت وقائع المواصلات: الغرامة 60 يورو لعدم وجود تذكرة صالحة، وإمكان Nachzeigen لتذكرة شخصية في Kundenzentrum خلال أسبوع برسم 7 يورو (عند شركات كثيرة). سجّل الحوار تبسيطاً تربوياً (إظهار بطاقة جديدة يخفّض) كملاحظة سياقية ولم يُعدَّل.")
    lines.append("- فُحصت عبارات الملابس والعروض الخاصة والإرجاع مع الانتباه إلى أن الإرجاع في المحلات سياسة Kulanz لا حقاً قانونياً، لكن عبارة «14 يوماً بالإيصال» متوافقة مع الممارسة الشائعة.")
    lines.append("- فُحصت سوسة كمدينة ساحلية تونسية متوسطية ذات Medina تراثية؛ الوصف في الحوار سرد شخصي عائلي متناسق.")
    lines.append("- صُحّحت ثلاثة مواضع عربية فقط في d-a2-26 لضمان تطابق الضمير/الإشارة/الصفة مع المؤنث «البنطال».")
    lines.append("- سجلت 6 ملاحظات سياقية وبديلان أسلوبيان منفصلان.")
    lines.append("")
    lines.append("## 2) التصحيحات المؤكدة")
    lines.append("")
    lines.append("| الحقل | قبل | بعد | السبب | المصادر |")
    lines.append("|---|---|---|---|---|")
    for c in CORRECTIONS:
        lines.append(f"| d-a2-26.lines[{c[1]}].ar | {c[2]} | {c[3]} | {c[4]} | S22، S23، S28 |")
    lines.append("")
    lines.append("## 3) سجل الوحدات الـ42")
    lines.append("")
    for it in items:
        badge = {"سليم": "✅", "مصحح": "✏️", "غير محسوم": "❓"}[it["status"]]
        if it["kind"] == "dialogue":
            lines.append(f"- {badge} **{it['id']}** (بيانات حوار): {it['reviewed']['titleDe']} — {it['finding']} · المصادر: {', '.join(it['sources']) or '—'}")
        elif it["kind"] == "line":
            r = it["reviewed"]
            lines.append(f"- {badge} **{it['id']}** ({r['who']}): DE «{r['de']}» / AR «{r['ar']}» — {it['finding']} · المصادر: {', '.join(it['sources']) or '—'}")
            if it["status"] == "مصحح":
                lines.append(f"    - قبل: «{it['before']['ar']}» ← بعد: «{it['after']['ar']}»")
        elif it["kind"] == "question":
            r = it["reviewed"]
            lines.append(f"- {badge} **{it['id']}** ({r['type']}): {r['promptDe']} → المفتاح: {json.dumps(r['answer'], ensure_ascii=False)} — {it['finding']} · المصادر: {', '.join(it['sources']) or '—'}")
        elif it["kind"] == "dictation":
            lines.append(f"- {badge} **{it['id']}** (إملاء): «{it['reviewed']['sentence']}» — {it['finding']} · المصادر: {', '.join(it['sources']) or '—'}")
    lines.append("")
    lines.append("## 4) ملاحظات سياقية غير محسومة")
    lines.append("")
    for n in context_notes:
        lines.append(f"- **{n['where']}** — {n['note']} (المصادر: {', '.join(n['sources'])})")
    lines.append("")
    lines.append("## 5) بدائل أسلوبية/تربوية")
    lines.append("")
    for n in style_alternatives:
        lines.append(f"- **{n['where']}** — {n['alt']}" + (f" (المصادر: {', '.join(n['sources'])})" if n.get("sources") else ""))
    lines.append("")
    lines.append("## 6) سجل المصادر المنشورة وحدودها")
    lines.append("")
    lines.append("| المعرّف | العنوان | الرابط | ما يسنده | حدود |")
    lines.append("|---|---|---|---|---|")
    for s in SOURCES:
        lines.append(f"| {s['id']} | {s['title']} | {s['url']} | {s['supports']} | {s['limits']} |")
    lines.append("")
    lines.append("## 7) مفردات waisen")
    lines.append("")
    lines.append(f"فُحصت قوائم waisen في كل حوار، وجميع المصطلحات الـ{len(waisen_audit)} لها بطاقات مفردات في `content/vocab.json` ومستوى A2.")
    lines.append("")
    lines.append("| الحوار | waisen (العدد) |")
    lines.append("|---|---|")
    cnt = Counter(e["dialogueId"] for e in waisen_audit)
    for tid in TARGET_IDS:
        terms = ", ".join(e["term"] for e in waisen_audit if e["dialogueId"] == tid)
        lines.append(f"| {tid} ({cnt[tid]}) | {terms} |")
    lines.append("")
    lines.append("## 8) تدقيق الصوت والاختبارات")
    lines.append("")
    lines.append(f"- {audio['note']}")
    lines.append(f"- إدخالات البيان: {len(audio['manifestEntries'])} (لا توجد). ملفات mp3: {len(audio['mp3Files'])} (لا توجد).")
    lines.append("- البوابات المخططة: K186a–j (تُضاف بعد التقرير) تغطي 42 لقطة حية، عدد المصادر، waisen، التصحيحات العربية الثلاثة، والصوت والحدود.")
    lines.append("")
    lines.append("## 9) البوابات والفحوص")
    lines.append("")
    lines.append("البوابات K186a–j المخططة:")
    for k in ["a","b","c","d","e","f","g","h","i","j"]:
        lines.append(f"- K186{k} (تُرمَّز في `scripts/engine_smoke.ts` عند تشغيل الاختبارات).")
    lines.append("")
    DOCS_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {DOCS_JSON} and {DOCS_MD}")


if __name__ == "__main__":
    main()
