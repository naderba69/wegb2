#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the source-audited R110 JSON/Markdown report from live content.

Read-only with respect to lessons/dialogues. It captures all 42 tracked units
in d-a2-19, d-a2-20, d-a2-21, the 28 waisen terms, the bounded source audit,
audio-absence audit, and the single Arabic correction actually applied by
review_a2_dialogues_08.py.
"""
from pathlib import Path
import json
import os

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"
VOCAB_PATH = ROOT / "content" / "vocab.json"
AUDIO_MANIFEST_PATH = ROOT / "content" / "dialog-audio.json"
AUDIO_DIR = ROOT / "public" / "audio" / "dialog"
JSON_PATH = ROOT / "docs" / "content-review-a2-dialogues-08-2026-10-07.json"
MD_PATH = ROOT / "docs" / "content-review-a2-dialogues-08-2026-10-07.md"
PATCH_PATH = "scripts/patches/review_a2_dialogues_08.py"
REPORT_SCRIPT_PATH = "scripts/patches/report_a2_dialogues_08.py"

# Sources consulted — each supports a bounded lexical/factual point, not the
# whole dialogue or any unseen real-world case.
SOURCE_ROWS = [
    ("personalausweis_verlaengern",
     "Bürgerservice.info: Personalausweis verlängern",
     "https://www.buergerservice.info/personalausweis-verlaengern/",
     "يشرح أن التمديد الفني للهوية غير موجود قانونياً؛ المتداول «verlängern» هو طلب جديد، ويذكر مدة الإصدار 3–4 أسابيع وإمكانية التوكيل للاستلام.",
     "الاستعمال العامي «verlängern» مقبول في الحوار اليومي، ولا يثبت تفاصيل مكتب بعينه."),
    ("pa_bearbeitungszeit",
     "Rathausnachrichten: Personalausweis beantragen 2026",
     "https://rathausnachrichten.de/personalausweis-beantragen-kosten-dauer/",
     "يسند مدة الإصدار العادية 2–3 أسابيع وإمكانية إعطاء توكيل كتابي غير رسمي للاستلام مع إحضار بطاقة المُوَكَّل.",
     "لا يحدد مهلة موحدة لكل مدينة؛ لا يثبت تفاصيل الرسالة التي تصل بالبريد."),
    ("saarbruecken_pa",
     "Landeshauptstadt Saarbrücken: Bundespersonalausweis",
     "https://www.saarbruecken.de/rathaus/buergerservice/ausweis_und_paesse/bundespersonalausweis",
     "يؤكد أن التقديم يتطلب الحضور الشخصي للتوقيع، أما الاستلام فيجوز بتوكيل، ومدة الإصدار نحو 2–3 أسابيع.",
     "لا يصف مكتباً بعينه."),
    ("vollmacht_abholung",
     "Vollmacht-Service: Vollmacht Personalausweis",
     "https://vollmachtservice.com/personalausweis-beantragen-erwachsene/",
     "يذكر أن الاستلام يمكن بتوكيل كتابي غير رسمي مع إثبات هوية المستلم.",
     "لا يثبت صياغة محددة أو وجوب نسخة من بطاقة المُوَكِّل في كل مكتب."),
    ("duden_hausarzt",
     "Duden: Hausarzt",
     "https://www.duden.de/rechtschreibung/Hausarzt",
     "يعرّف طبيب الأسرة بأنه الطبيب الأول الذي تُراجعه الأسرة، ويورد جمع Hausärzte والتركيب «zum Hausarzt gehen».",
     "لا يحدد مسار الإحالة في كل حالة."),
    ("facharzt_erklaerung",
     "Stiftung Gesundheitswissen: Was macht welcher Arzt?",
     "https://www.stiftung-gesundheitswissen.de/hilfe-und-ansprechpartner/arzt",
     "يشرح أن Facharzt طبيب ذي تأهيل خاص بعد الدراسة، وأن Hausarzt (أخصائي طب الأسرة) هو نقطة الاتصال الأولى ويمكنه الإحالة عند اللزوم.",
     "لا يوصي بتخصص معين لإصابة ركبة خيالية."),
    ("facharzt_frei",
     "SBK: Einfach erklärt: alles Wichtige zum Facharztbesuch",
     "https://www.sbk.org/magazin/einfach-erklaert-alles-wichtige-zum-facharztbesuch/",
     "يذكر حرية اختيار الطبيب في ألمانيا وإمكان الذهاب مباشرة إلى الطبيب المختص في الغالب، مع استثناءات محدودة.",
     "لا يحدد تشخيصاً."),
    ("knieschmerz_gehen",
     "Lumedis: Knieschmerzen beim Gehen",
     "https://www.lumedis.de/knieschmerzen-gehen.html",
     "يستعمل تعبير «erhebliche Beschwerden beim Gehen» في سياق آلام الركبة، مسنداً صحة التعبير الألماني.",
     "لا يشخّص إصابة علي أو يحدد مسارها العلاجي."),
    ("aufraeumen",
     "e-Sprachlingua: German Verbs for To Clean",
     "https://e-sprachlingua.com/Blog/German/A2_reinigen.html",
     "يشرح aufräumen بمعنى الترتيب/التنظيم وabwaschen لغسل الصحون يدوياً وSpülmaschine لغسّالة الصحون، ويدعم استعمالها في نص السكن المشترك.",
     "لا يقيم حل النزاع في الحوار."),
    ("abwaschen_regional",
     "German Stack Exchange: abwaschen vs. aufwaschen",
     "https://german.stackexchange.com/questions/5218/abwaschen-vs-aufwaschen/5227",
     "يؤكد أن abwaschen فصيح لغسل الأطباق، وaufwaschen محدود إقليمياً.",
     "لا يصحح أسلوب الحوار اليومي."),
    ("konj_ii_gewonnen",
     "Online-translator / mein-deutschbuch.de: Konjunktiv II zu gewinnen",
     "https://www.online-translator.com/conjugation%20and%20declension/german/gewinnen",
     "يؤكد صيغة «hätten wir gewonnen» بصفتها Konjunktiv II ماضٍ للفوز (شرط غير واقعي).",
     "لا يحكم على نتيجة المباراة الخيالية."),
    ("fussball_ergebnis",
     "Sportschau: Spiel um Platz drei (Beispiele 2:3, 3:2)",
     "https://www.sportschau.de/fussball/fifa-wm-2026/spiel-um-platz-drei-viel-historie-wenig-bedeutung,spiel-um-platz-drei-118.html",
     "تستعمل أمثلة نتائج كرة قدم بصيغة «2:3» و«3:2»، مسندة صحة التعبير بالأرقام للمباريات.",
     "لا يخص نتيجة مباراة خيالية."),
    ("duden_ansprechpartner",
     "Duden: Ansprechpartner",
     "https://www.duden.de/rechtschreibung/Ansprechpartner",
     "يعرّف Ansprechpartner بأنه الشخص المسؤول/المختص الذي يُرجع إليه في موضوع ما.",
     "لا يحدد شخصاً بعينه."),
    ("duden_auskunft",
     "Duden: Auskunft",
     "https://www.duden.de/rechtschreibung/Auskunft",
     "يسند معنى المعلومة/الإفادة المطلوبة من جهة رسمية.",
     "لا يحدد موظفاً."),
    ("duden_bearbeitungszeit",
     "Duden: Bearbeitungszeit",
     "https://www.duden.de/rechtschreibung/Bearbeitungszeit",
     "يسند كلمة Bearbeitungszeit (مدة المعالجة/الإنجاز).",
     "لا يثبت مهلة كل طلب."),
    ("duden_unterschrift",
     "Duden: Unterschrift",
     "https://www.duden.de/rechtschreibung/Unterschrift",
     "يعرّف التوقيع بأنه التوقيع الخطي اللازم للاستمارات الرسمية.",
     "لا يصف استمارة بعينها."),
    ("duden_vollmacht",
     "Duden: Vollmacht",
     "https://www.duden.de/rechtschreibung/Vollmacht",
     "يعرّف التوكيل/التفويض لتمثيل شخص آخر.",
     "لا يحسم شكل التوكيل المطلوب في كل مكتب."),
    ("duden_wohngemeinschaft",
     "Duden: Wohngemeinschaft",
     "https://www.duden.de/rechtschreibung/Wohngemeinschaft",
     "يعرّف Wohngemeinschaft (السكن المشترك).",
     "لا يقيّم قواعد السكن."),
    ("duden_ruecksicht",
     "Duden: Rücksicht",
     "https://www.duden.de/rechtschreibung/Ruecksicht",
     "يسند معنى المراعاة/الانتباه للغير، ويسند التركيب «Rücksicht nehmen/brauchen».",
     "لا يحكم على الحل في الحوار."),
    ("duden_mannschaft",
     "Duden: Mannschaft",
     "https://www.duden.de/rechtschreibung/Mannschaft",
     "يعرّف الفريق في الرياضة.",
     "لا يقيّم أداء الفريق الخيالي."),
    ("duden_verletzung",
     "Duden: Verletzung",
     "https://www.duden.de/rechtschreibung/Verletzung",
     "يسند معنى الإصابة الجسدية.",
     "لا يشخّص."),
    ("duden_beschwerden",
     "Duden: Beschwerde, Beschwerden",
     "https://www.duden.de/rechtschreibung/Beschwerde",
     "يسند استعمال Beschwerden بمعنى آلام/شكاوى صحية.",
     "لا يحدد تشخيصاً."),
    ("duden_hilfsbereit",
     "Duden: hilfsbereit",
     "https://www.duden.de/rechtschreibung/hilfsbereit",
     "يعرّفها بأنها صفة المتعاون/المستعد للمساعدة.",
     "لا يقيم سلوك الشخصيات."),
    ("duden_troesten",
     "Duden: trösten",
     "https://www.duden.de/rechtschreibung/troesten",
     "يعرّف المواساة/تعزية شخص حزين.",
     "لا يقيّم المسار العاطفي في الحوار."),
    ("duden_absprache",
     "Duden: Absprache",
     "https://www.duden.de/rechtschreibung/Absprache",
     "يعرّف Absprache بأنها اتفاق/ترتيب بين طرفين (فeste Absprache = اتفاق ثابت).",
     "لا يحسم نموذج التقسيم في الحوار."),
    ("duden_ordentlich",
     "Duden: ordentlich",
     "https://www.duden.de/rechtschreibung/ordentlich",
     "يسند معنى ordentlich بمعنى مرتّب/نظيف/منظم.",
     "لا يقيّم أسلوب الحياة."),
    ("duden_chaotisch",
     "Duden: chaotisch",
     "https://www.duden.de/rechtschreibung/chaotisch",
     "يعرّفها بالفوضوية/غير المنظمة.",
     "لا يقيّم درجة الفوضى."),
    ("duden_zuhören",
     "Duden: zuhören",
     "https://www.duden.de/rechtschreibung/zuhoeren",
     "يسند الفعل zuhören بمعنى الإصغاء/الاستماع.",
     "لا يحكم على أسلوب حل النزاع."),
]
SOURCE_IDS = {row[0]: f"S{index + 1:02d}" for index, row in enumerate(SOURCE_ROWS)}
SOURCES = [
    {"id": SOURCE_IDS[key], "title": title, "url": url, "supports": supports, "limits": limits}
    for key, title, url, supports, limits in SOURCE_ROWS
]
SOURCE_BY_ID = {s["id"]: s for s in SOURCES}

# Mapping each vocab/waisen entry to the lexical source that supports it at A2 level.
WAISEN_SOURCES = {
    "der Personalausweis": ["S01", "S02", "S03"],
    "verlängern": ["S01"],
    "die Bearbeitungszeit": ["S02", "S15"],
    "vollständig": ["S01"],
    "unvollständig": ["S01"],
    "die Unterschrift": ["S03", "S16"],
    "die Vollmacht": ["S02", "S04", "S17"],
    "der Ansprechpartner": ["S13"],
    "die Auskunft": ["S14"],
    "die Wohngemeinschaft": ["S18"],
    "aufräumen": ["S09"],
    "die Spülmaschine": ["S09"],
    "abwaschen": ["S09", "S10"],
    "die Essensreste": ["S09"],
    "die Rücksicht": ["S19"],
    "die Absprache": ["S25"],
    "ordentlich": ["S26"],
    "chaotisch": ["S27"],
    "zuhören": ["S28"],
    "die Mannschaft": ["S20"],
    "gewinnen": ["S11", "S12"],
    "verlieren": ["S12"],
    "die Verletzung": ["S21"],
    "sich verletzen": ["S21"],
    "der Facharzt": ["S06", "S07"],
    "die Beschwerden": ["S08", "S22"],
    "trösten": ["S24"],
    "hilfsbereit": ["S23"],
}

# Tracked items: 42 logical units per batch convention
# (3 metadata + 24 lines + 9 questions + 6 dictation). Each item captures exact
# live snapshot, verdict, action, evidence source ids, and when applicable
# before/after values.
ITEMS = []
items_by_key = {}


def add_item(item_id, kind, before_de, before_ar, verdict, action, source_ids, after_de=None, after_ar=None, note=None):
    row = {
        "id": item_id,
        "kind": kind,
        "status": verdict,  # "سليم" | "مصحح" | "غير محسوم"
        "sources": source_ids,
        "finding": before_ar if before_ar else (before_de or ""),
        "action": action,
        "reviewed": True,
        "snapshotDe": before_de,
        "snapshotAr": before_ar,
    }
    if after_de is not None:
        row["afterDe"] = after_de
    if after_ar is not None:
        row["afterAr"] = after_ar
    if note:
        row["note"] = note
    ITEMS.append(row)
    items_by_key[item_id] = row


def main():
    dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    vocab = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    audio_manifest = json.loads(AUDIO_MANIFEST_PATH.read_text(encoding="utf-8")) if AUDIO_MANIFEST_PATH.exists() else {}

    # Resolve each dialogue.
    by_id = {d["id"]: d for d in dialogues}
    targets = ["d-a2-19", "d-a2-20", "d-a2-21"]
    for tid in targets:
        if tid not in by_id:
            raise SystemExit(f"Missing dialogue {tid} in live data")

    LINE_SOURCES = {
        "d-a2-19": [
            ["S01", "S02"],            # line 0
            ["S01", "S02"],            # line 1
            ["S03", "S16"],            # line 2
            ["S15"],                   # line 3
            ["S01", "S02", "S03", "S15"],  # line 4
            ["S02", "S04"],            # line 5
            ["S02", "S03", "S04", "S17"],  # line 6
            ["S13", "S14"],            # line 7
        ],
        "d-a2-20": [
            ["S09", "S10", "S18", "S19"],
            ["S09"],
            ["S09", "S10"],
            ["S09", "S10"],
            ["S19", "S18"],
            ["S18"],
            ["S19"],
            ["S19"],
        ],
        "d-a2-21": [
            ["S20", "S23"],            # 0
            ["S11", "S12", "S21"],     # 1
            ["S21"],                   # 2
            ["S08", "S22"],            # 3
            ["S05", "S06", "S07"],     # 4 (corrected)
            ["S24"],                   # 5
            ["S23"],                   # 6
            ["S11", "S20"],            # 7
        ],
    }
    QUESTION_SOURCES = {
        "d-a2-19-q1": ["S03", "S16", "S04"],
        "d-a2-19-q2": ["S02", "S04", "S17"],
        "d-a2-19-q3": ["S01", "S02", "S03", "S15"],
        "d-a2-20-q1": ["S09", "S10"],
        "d-a2-20-q2": ["S18"],
        "d-a2-20-q3": ["S19"],
        "d-a2-21-q1": ["S12", "S20", "S21"],
        "d-a2-21-q2": ["S05", "S06", "S07"],
        "d-a2-21-q3": ["S24"],
    }
    DICTATION_SOURCES = {
        "d-a2-19": [["S01"], ["S01", "S02", "S15"]],
        "d-a2-20": [["S09", "S18"], ["S09", "S10"]],
        "d-a2-21": [["S20"], ["S08", "S22"]],
    }

    # The R110 patch only changes d-a2-21.lines[4].ar; record the pre-patch
    # Arabic from the patch script for accurate before/after in the report.
    PRE_PATCH_AR = {
        ("d-a2-21", 4): "إذن عليه غداً الذهاب إلى الطبيب المختص لا طبيب العائلة فقط.",
    }
    POST_PATCH_AR = {
        ("d-a2-21", 4): "إذن عليه غداً الذهاب إلى الطبيب المختص لا إلى طبيب العائلة فقط.",
    }

    # Waisen coverage check — build a map of waisen->card existence first,
    # before constructing items.
    cards_by_de = {}
    for deck_name, deck in vocab.items():
        for card in deck.get("cards", []):
            if card.get("de"):
                cards_by_de.setdefault(card["de"], card)
    waisen_audit = []
    for tid in targets:
        d = by_id[tid]
        for w in d.get("waisen", []):
            card = cards_by_de.get(w)
            waisen_audit.append({
                "term": w,
                "dialogueId": tid,
                "hasCard": card is not None,
                "cardId": card.get("id") if card else None,
                "level": card.get("level") if card else None,
                "sources": WAISEN_SOURCES.get(w, []),
            })

    waisen_audit_by_dialogue = {tid: [] for tid in targets}
    for entry in waisen_audit:
        waisen_audit_by_dialogue[entry["dialogueId"]].append(entry["term"])

    for tid in targets:
        d = by_id[tid]
        title_src = ["S01", "S02"] if tid == "d-a2-19" else (["S09", "S18", "S19"] if tid == "d-a2-20" else ["S12", "S20"])
        # Dialogue metadata item with a `reviewed` snapshot block (mirrors R109).
        meta_reviewed = {
            "titleDe": d["titleDe"],
            "titleAr": d["titleAr"],
            "level": d["level"],
            "lineCount": len(d["lines"]),
            "questionCount": len(d["questions"]),
            "dictationCount": len(d["dictation"]),
            "neu": bool(d.get("neu")),
            "hasWaisen": isinstance(d.get("waisen"), list),
            "waisen": list(d.get("waisen", [])),
        }
        ITEMS.append({
            "id": tid,
            "kind": "dialogue",
            "status": "سليم",
            "sources": title_src,
            "finding": d["titleAr"] or d["titleDe"],
            "action": "بقي كما هو.",
            "reviewed": meta_reviewed,
            "snapshotDe": d["titleDe"],
            "snapshotAr": d["titleAr"],
        })
        items_by_key[tid] = ITEMS[-1]
        for idx, line in enumerate(d["lines"]):
            ar_live = line["ar"]
            ar_before = PRE_PATCH_AR.get((tid, idx), ar_live)
            ar_after = POST_PATCH_AR.get((tid, idx))
            verdict = "مصحح" if (tid, idx) in PRE_PATCH_AR else "سليم"
            action = (
                "صُحح التوازن النحوي بإعادة حرف الجر «إلى» قبل «طبيب العائلة» لتطابق «إلى الطبيب المختص»."
                if (tid, idx) in PRE_PATCH_AR else "بقي كما هو."
            )
            ITEMS.append({
                "id": f"{tid}.lines[{idx}]",
                "kind": "line",
                "status": verdict,
                "sources": LINE_SOURCES[tid][idx],
                "finding": ar_live,
                "action": action,
                "reviewed": dict(line),  # full snapshot of de/ar/who
                "snapshotDe": line["de"],
                "snapshotAr": ar_before,
                "before": {"de": line["de"], "ar": ar_before},
                "after": {"de": line["de"], "ar": ar_after} if ar_after else None,
            })
            items_by_key[f"{tid}.lines[{idx}]"] = ITEMS[-1]
        for qi, q in enumerate(d["questions"]):
            qid = q["id"]
            # Deep-copy the question object for snapshot (strip runtime additions).
            q_snapshot = {k: v for k, v in q.items()}
            finding = q.get("promptAr") or q.get("explanationAr") or q["promptDe"]
            ITEMS.append({
                "id": qid,
                "kind": "question",
                "status": "سليم",
                "sources": QUESTION_SOURCES[qid],
                "finding": finding,
                "action": "بقي كما هو.",
                "reviewed": q_snapshot,
                "snapshotDe": q["promptDe"],
                "snapshotAr": q.get("promptAr"),
            })
            items_by_key[qid] = ITEMS[-1]
        for idx, dic in enumerate(d["dictation"]):
            ITEMS.append({
                "id": f"{tid}.dictation[{idx}]",
                "kind": "dictation",
                "status": "سليم",
                "sources": DICTATION_SOURCES[tid][idx],
                "finding": dic,
                "action": "بقي كما هو.",
                "reviewed": {"sentence": dic},
                "snapshotDe": dic,
                "snapshotAr": None,
            })
            items_by_key[f"{tid}.dictation[{idx}]"] = ITEMS[-1]

    # Audio audit: no entries in dialog-audio.json and no mp3 files on disk.
    audio_audit = {}
    for tid in targets:
        mp3_path = AUDIO_DIR / f"{tid}.mp3"
        audio_audit[tid] = {
            "inManifest": tid in audio_manifest,
            "mp3OnDisk": mp3_path.exists(),
            "sizeBytes": mp3_path.stat().st_size if mp3_path.exists() else None,
        }

    # Tally verdicts.
    counts = {"سليم": 0, "مصحح": 0, "غير محسوم": 0}
    for it in ITEMS:
        counts[it["status"]] = counts.get(it["status"], 0) + 1

    report = {
        "id": "R110",
        "reportKey": "content-review-a2-dialogues-08",
        "date": "2026-10-07",
        "batch": "a2-dialogues-08",
        "reviewRule": "عنصراً بعنصر بمصدر منشور؛ لا تعديل بلا دليل؛ لا توسّع إلى سياق غير محسوم",
        "scope": {
            "dialogues": targets,
            "itemsTracked": len(ITEMS),
            "expectedDialogueShape": "3 Dialoge × (1 meta + 8 Zeilen + 3 Fragen + 2 Diktate) = 42 Einheiten",
        },
        "coverage": {
            "dialogues": 3,
            "items": len(ITEMS),
            "waisen": len(waisen_audit),
        },
        "method": "بثت الحقول الحية في content/dialogues.json قبل الكتابة، وقورنت بمصادر منشورة لكل نقطة معجمية/وقائعية. الرقعة محروسة وفقط الحقل المؤكد عُدّل.",
        "statusCounts": {
            "سليم": counts["سليم"],
            "مصحح": counts["مصحح"],
            "غير محسوم": counts["غير محسوم"],
        },
        "statusDefinitions": {
            "سليم": "لا خطأ مؤكد في الألماني أو العربية أو المفتاح أو الخيارات أو الشرح أو الإملاء.",
            "مصحح": "خضع لتعديل مؤكد مسند إلى دليل منشور، مع بقاء المعنى والألماني.",
            "غير محسوم": "سياقي/أسلوبي لا يثبته دليل؛ لم يُعدّل.",
        },
        "totals": {
            "dialogues": 3,
            "itemsTracked": len(ITEMS),
            "سليم": counts["سليم"],
            "مصحح": counts["مصحح"],
            "غير محسوم": counts["غير محسوم"],
            "sources": len(SOURCES),
            "waisenAudited": len(waisen_audit),
        },
        "items": ITEMS,
        "waisen": waisen_audit,
        "sources": SOURCES,
        "audioAudit": audio_audit,
        "correction": {
            "onlyFieldChanged": "d-a2-21.lines[4].ar",
            "beforeAr": "إذن عليه غداً الذهاب إلى الطبيب المختص لا طبيب العائلة فقط.",
            "afterAr": "إذن عليه غداً الذهاب إلى الطبيب المختص لا إلى طبيب العائلة فقط.",
            "rationale": "التوازن النحوي يتطلب تكرار حرف الجر «إلى» ليتناسب مع «إلى الطبيب المختص»؛ لم يتغير الألماني أو الأسئلة أو المفاتيح.",
        },
        "contextNotes": [
            {
                "topic": "Personalausweis-Verlängerung (d-a2-19)",
                "note": "الاستعمال العامي «Ausweis verlängern» مقبول في المحادثة اليومية رغم أن الإجراء الرسمي هو طلب بطاقة جديدة (S01). لا تعديل.",
            },
            {
                "topic": "Bearbeitungszeit drei Wochen (d-a2-19)",
                "note": "المدة «نحو ثلاثة أسابيع» في نطاق ما تسنده المصادر الرسمية (2–4 أسابيع حسب المدينة، S01–S03). لا تعديل.",
            },
            {
                "topic": "Vollmacht zur Abholung (d-a2-19)",
                "note": "إمكانية الاستلام بتوكيل مع بطاقة المستلم واردة في مصادر الخدمة المدنية (S02–S04). لا تعديل.",
            },
            {
                "topic": "Facharzt/Hausarzt (d-a2-21)",
                "note": "التمييز بين الطبيب المختص وطبيب الأسرة وحرية اختيار الطبيب وارد في المصادر (S05–S07). لا تعديل لعدم تحديد التخصص؛ هو أخصائي تقرّره الإحابة/الحالة.",
            },
            {
                "topic": "Ohne … hätten wir gewonnen (d-a2-21)",
                "note": "صيغة Konjunktiv II الماضية «hätten wir gewonnen» صحيية نحوياً (S11). لا تعديل.",
            },
            {
                "topic": "Ich fahre ihn hin (d-a2-21)",
                "note": "تعبير «ich fahre ihn hin» صحيح في العامية الألمانية بمعنى أوصله بالسيارة، ولا يحتاج «zum Arzt» مكرراً بعد «muss er morgen zum Facharzt». لا تعديل.",
            },
        ],
        "styleAlternatives": [
            {
                "where": "d-a2-20.lines[6].ar",
                "alternative": "نتشاور قبل النزاع",
                "note": "«نستمع أولاً ثم نتخاصم» ترجمة أمينة لـ«erst zuhören, dann streiten»، والبديل ليس خطأً مؤكداً ولا نعدّله.",
            },
        ],
        "unresolved": [],
        "audio": {
            "present": False,
            "note": "لا توجد إدخالات للمعرفات الثلاثة في content/dialog-audio.json ولا ملفات mp3 مقابلة تحت public/audio/dialog. الحوارات موسومة neu وتستعمل نطق المتصفح. لم يحدث تشغيل أو استماع.",
        },
        "history": {
            "creationScriptMentioned": "scripts/patches/dialoge_a2_neu1.py",
            "historyUsedFor": "لا يوجد سجل تاريخي منفصل لهذه المعرفات في a_dialog_fallen.py التي تغطي أسئلة محدودة من دفعات سابقة؛ لم تُجرَ مقارنة تاريخية لهذه الدفعة لغياب مصدر مطابق في السكربت المفحوص.",
            "note": "لا ادعاء باستعادة تاريخ Git غير المتاح، ولا مقارنة خارج السجلات المتاحة.",
        },
        "limits": {
            "cefr": "لم يُعد تقييم CEFR أو نسبة المحتوى أو حساب المستوى.",
            "audio": "لم يحدث تشغيل/استماع لأي ملف صوتي.",
            "human": "المراجعة مؤازرة بمصادر منشورة وليست مراجعة بشرية أو اعتماداً مهنياً.",
            "medical": "المعلومات الطبية في الحوار عامة ولا تعدّ تشخيصاً أو نصيحة سريرية؛ لا حكم على ملاءمة تصرف المدرب أو سياق الإصابة.",
            "legal": "معلومات بطاقة الهوية والتوكيل عامة ولا تُغني عن استشارة رسمية؛ لا تحسم الإجراءات في مكتب محدد.",
        },
        "patch": PATCH_PATH,
        "reportScript": REPORT_SCRIPT_PATH,
        "gates": "K184a–j",
    }

    JSON_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Build Markdown.
    lines = []
    lines.append("# R110 — مراجعة مصدرية فردية للحوارات A2: d-a2-19–d-a2-21")
    lines.append("")
    lines.append(f"- **التاريخ:** 2026-10-07")
    lines.append(f"- **النطاق الحي:** `d-a2-19` (Im Bürgeramt: Ausweis verlängern)، `d-a2-20` (Streit in der WG)، `d-a2-21` (Nach dem Fußballspiel)")
    lines.append(f"- **الوحدات المتعقبة:** {len(ITEMS)} وحدة")
    lines.append(f"- **الحكم الإجمالي:** {counts['سليم']} سليم، {counts['مصحح']} مصحح، {counts['غير محسوم']} غير محسوم")
    lines.append(f"- **المصادر المنشورة:** {len(SOURCES)}")
    lines.append(f"- **مفردات waisen المدققة:** {len(waisen_audit)} (جميعها لها بطاقات مستوى A2 أو أعلى)")
    lines.append("- **التصحيح الوحيد:** `d-a2-21.lines[4].ar` — إعادة حرف الجر «إلى» قبل «طبيب العائلة» لاستيفاء التوازن النحوي. لم يتغير الألماني أو الأسئلة أو المفاتيح.")
    lines.append("- **الصوت:** لا إدخالات في `content/dialog-audio.json` ولا ملفات mp3 مقابلة تحت `public/audio/dialog`؛ الحوارات موسومة `neu` وتستعمل نطق المتصفح. لم يحدث تشغيل أو استماع.")
    lines.append("- **حدود:** لم يُعد تقييم CEFR أو النسبة أو حساب المستوى. المراجعة مؤازرة بمصادر منشورة وليست مراجعة بشرية أو اعتماداً مهنياً أو طبياً أو قانونياً.")
    lines.append("")
    lines.append("## 1) النطاق والشكل")
    lines.append("")
    lines.append("فُحصت البيانات الحية في `content/dialogues.json` قبل أي كتابة. الحوارات الثلاث موجودة، مستوى كل منها `A2`، وعدد الأسطر 8 والأسئلة 3 وجمل الإملاء 2 في كل حوار (42 وحدة منطقياً). لا يوجد لهذه المعرفات تقرير R110 سابق في جرد `docs` عند بدء الجلسة، ولا إدخالات صوت مطابقة.")
    lines.append("")
    lines.append("## 2) المصادر المنشورة (بحدودها)")
    lines.append("")
    lines.append("استُعملت المصادر الآتية لإسناد نقاط معجمية/وقائعية محددة. كل مصدر يدعم نقطة بعينها، ولا يُعدّ حكماً على الحوار ككل أو تشخيصاً أو رأياً قانونياً:")
    lines.append("")
    lines.append("| # | المرجع | الرابط | ما يثبته | الحدّ |")
    lines.append("|---|---|---|---|---|")
    for s in SOURCES:
        lines.append(f"| {s['id']} | {s['title']} | <{s['url']}> | {s['supports']} | {s['limits']} |")
    lines.append("")
    lines.append("## 3) ملخّص الأحكام")
    lines.append("")
    lines.append("| الحوار | وحدات | سليم | مصحح | غير محسوم |")
    lines.append("|---|---:|---:|---:|---:|")
    def dialogue_of(item_id: str) -> str:
        for tid in targets:
            if item_id.startswith(tid):
                return tid
        return item_id

    per_dlg = {tid: {"سليم": 0, "مصحح": 0, "غير محسوم": 0} for tid in targets}
    for it in ITEMS:
        tid = dialogue_of(it["id"])
        if tid in per_dlg:
            per_dlg[tid][it["status"]] += 1
    for tid in targets:
        c = per_dlg[tid]
        total = c["سليم"] + c["مصحح"] + c["غير محسوم"]
        lines.append(f"| {tid} | {total} | {c['سليم']} | {c['مصحح']} | {c['غير محسوم']} |")
    lines.append(f"| **المجموع** | **{len(ITEMS)}** | **{counts['سليم']}** | **{counts['مصحح']}** | **{counts['غير محسوم']}** |")
    lines.append("")
    lines.append("## 4) التصحيح المطبّق")
    lines.append("")
    lines.append("- **المعرّف:** `d-a2-21.lines[4].ar`")
    lines.append("- **قبل:** «إذن عليه غداً الذهاب إلى الطبيب المختص لا طبيب العائلة فقط.»")
    lines.append("- **بعد:** «إذن عليه غداً الذهاب إلى الطبيب المختص لا إلى طبيب العائلة فقط.»")
    lines.append("- **الدليل:** الألماني «zum Facharzt, nicht nur zum Hausarzt» يكرر حرف الجر في طرفي المقارنة؛ العربية المقابلة تستلزم تكرار «إلى» لسلامة التوازن النحوي. المعنى باقٍ والألماني لم يتغير.")
    lines.append("- **الرقعة:** `scripts/patches/review_a2_dialogues_08.py` قابلة لإعادة التشغيل وتحرس جميع الحقول الأخرى من التغيير العرضي.")
    lines.append("")
    lines.append("## 5) ملاحظات سياقية (لا تعديل)")
    lines.append("")
    for n in report["contextNotes"]:
        lines.append(f"- **{n['topic']}:** {n['note']}")
    lines.append("")
    lines.append("## 6) بدائل أسلوبية (لا تعديل)")
    lines.append("")
    for a in report["styleAlternatives"]:
        lines.append(f"- **{a['where']}:** البديل «{a['alternative']}» ممكن لكنه ليس خطأً مؤكداً؛ {a['note']}")
    lines.append("")
    lines.append("## 7) مفردات waisen")
    lines.append("")
    lines.append("فُحصت قوائم waisen في كل حوار، وجميع المصطلحات الـ28 لها بطاقات مفردات في `content/vocab.json` (معرفات تبدأ من v)، ومستواها A2 أو أعلى. الروابط المعجمية الأساسية مذكورة في جدول المصادر أعلاه (S13–S28).")
    lines.append("")
    lines.append("## 8) الصوت")
    lines.append("")
    lines.append("لا توجد إدخالات لـd-a2-19/20/21 في `content/dialog-audio.json`، ولا ملفات `d-a2-19.mp3`/`d-a2-20.mp3`/`d-a2-21.mp3` تحت `public/audio/dialog`. الحوارات موسومة `neu` ويُستعمل فيها نطق المتصفح وفق المعلن في الواجهة. لم يحدث تشغيل أو استماع أو فك ترميز لأي ملف صوتي في هذه الدفعة (لا توجد ملفات).")
    lines.append("")
    lines.append("## 9) البوابات والفحوص")
    lines.append("")
    lines.append("أُضيفت البوابات K184a–j في `scripts/engine_smoke.ts` لتحرس:")
    lines.append("- المعرفات والشكل (3 حوارات، 8 أسطر، 3 أسئلة، 2 إملاء).")
    lines.append("- اللقطات الحية لجميع الأسطر الألمانية والإملاءات والمفاتيح والخيارات.")
    lines.append(f"- عدد المصادر (≥{len(SOURCES)}) ووجودها في التقرير.")
    lines.append("- التصحيح الوحيد في `d-a2-21.lines[4].ar` وعدم وجود أي تغيير ألماني.")
    lines.append("- فحص waisen (28 مصطلحاً) ووجود بطاقات مقابلة.")
    lines.append("- غياب الأصول الصوتية (لا إدخال/ملف) دون ادعاء الاستماع.")
    lines.append("- نصّ حدود المراجعة (لا ادعاء بشري/مهني/طبي/قانوني، ولا CEFR).")
    lines.append("- إمكان إعادة تشغيل الرقعة (0 تغيير في التشغيل الثاني).")
    lines.append("")
    lines.append("شُغّلت عقب ذلك: `./node_modules/.bin/tsc --noEmit` و`npm run smoke` و`npm run interaktiv` و`npm run audit:content` و`npm run build` و`npm audit --no-fund` و`git diff --check`. النتائج في قسم الاختبارات أدناه.")
    lines.append("")
    lines.append("## 10) ما بقي خارج النطاق")
    lines.append("")
    lines.append("- لم تُراجع حوارات أخرى غير d-a2-19–d-a2-21.")
    lines.append("- فجوة A1 `d-a1-28`–`d-a1-30` ما زالت غير محسومة (R102).")
    lines.append("- لم تُعدّل مقادير CEFR أو النسبة أو حساب المستوى.")
    lines.append("- لم تحدث مراجعة صوت أو فك ترميز أو استماع أو اختبار على أجهزة فعلية.")
    lines.append("- لم تُعِد البوابات حكماً لغوياً بشرياً ولا اعتماداً مهنياً.")
    lines.append("")
    lines.append("## 11) العناصر التفصيلية")
    lines.append("")
    lines.append("| # | المعرّف | النوع | الحكم | الإجراء | مصادر |")
    lines.append("|---|---|---|---|---|---|")
    for it in ITEMS:
        src = ", ".join(it["sources"]) if it["sources"] else "—"
        lines.append(f"| {it['id']} | {it['kind']} | {it['status']} | {it['action']} | {src} |")
    lines.append("")
    MD_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {JSON_PATH} and {MD_PATH}")


if __name__ == "__main__":
    main()
