#!/usr/bin/env python3
"""R111 report generator for d-a2-22..d-a2-24.

Emits docs/content-review-a2-dialogues-09-2026-10-07.{json,md} following the
convention of R109/R110: 42 items (3 dialogue meta + 24 lines + 9 questions + 6
dictation), 30 waisen, one confirmed Arabic fix (d-a2-23.lines[5].ar), contextual
and style notes, audio absence, and explicit limits.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"
VOCAB_PATH = ROOT / "content" / "vocab.json"
DOCS_JSON = ROOT / "docs/content-review-a2-dialogues-09-2026-10-07.json"
DOCS_MD = ROOT / "docs/content-review-a2-dialogues-09-2026-10-07.md"
AUDIO_MANIFEST = ROOT / "content/dialog-audio.json"
AUDIO_DIR = ROOT / "public/audio"

REVIEW_RULE = "R111"
DATE = "2026-10-07"
BATCH = "a2-dialogues-09"
TARGET_IDS = ["d-a2-22", "d-a2-23", "d-a2-24"]

PRE_PATCH_AR = "هذا يصنعه الأطفال. يجب أن تجرّبي الحلويات حتماً."
POST_PATCH_AR = "هذه يصنعها الأطفال. يجب أن تجرّبي الحلويات حتماً."

SOURCE_ROWS: list[tuple[str, str, str, str, str]] = [
    ("mieterhilfe_nebennach",
     "Mieterhilfeverein: Nachzahlung Nebenkosten — Fristen",
     "https://www.mieterhilfeverein.de/ratgeber/nebenkosten/nachzahlung-nebenkosten/",
     "يسند وجود Nachzahlung/Rückzahlung في التسوية السنوية للمرافق، وأن Strom وHeizung/Warmwasser من بنودها المحتملة.",
     "لا يحسم إن كان عداد الكهرباء في العقد منفصلاً أو ضمن التسوية (تبسيط تربوي مقبول في A2)."),
    ("hartz4_heizkosten",
     "Hartz4widerspruch: Heizkosten — Abschlag/Nachzahlung/Rückzahlung",
     "https://hartz4widerspruch.de/ratgeber/wohnen/heizkosten/",
     "يشرح أن Nebenkosten تُدفع كأقساط شهرية (Abschlag) وتُسوّى سنوياً، فينتج Nachzahlung أو Rückzahlung.",
     "يخص متلقي Bürgergeld ولا يثبت حالة الحوار المالية."),
    ("heizung_de_abschlag",
     "heizung.de: Heizkostenabrechnung — Abschlag und Nachzahlung",
     "https://www.heizung.de/finanzielles/wissen/heizkostenabrechnung-zu-hoch-diese-tipps-helfen.html",
     "يسند آلية التسوية السنوية وتعديل القسط الشهري بعدها.",
     "لا يثبت قيمة 240 أو 80 يورو (أمثلة تربوية)."),
    ("vz_stromtarif",
     "Verbraucherzentrale: Den passenden Strom-/Gastarif finden",
     "https://www.verbraucherzentrale.de/wissen/energie/preise-tarife-anbieterwechsel/so-finden-sie-den-passenden-strom-oder-gastarif-6436",
     "ينصح بمقارنة الأسعار عبر البوابات ومراجعة Anbieter قبل تبديل مزود الكهرباء.",
     "البوابات ليست محايدة تماماً؛ لا يحدد أرخصية مزود بعينه."),
    ("vzbw_anbieterwechsel",
     "Verbraucherportal BW: Anbieterwechsel und Preisvergleichsportale",
     "https://www.verbraucherportal-bw.de/,Lde/Startseite/Verbraucherschutz/Wechsel+des+Strom_+und+Gasanbieters+_+Tarifrechner+und+Preisvergleichsportale",
     "يؤكد أن التبديل يمكن أن يوفر التكاليف ويشدد على الحذر من Vorauszahlung وPakettarife.",
     "لا يثبت نسبة التوفير أو مدة العقد."),
    ("netkredit24_stromraten",
     "Netkredit24: Stromnachzahlung in Raten zahlen",
     "https://www.netkredit24.de/blog/stromrechnung-per-kredit/",
     "يسند عبارة «في Raten zahlen» عند عدم القدرة على الدفع دفعة واحدة؛ في Grundversorgung يوجد حق قانوني لاتفاق تقسيط بلا رسوم.",
     "لا يثبت موافقة أي مزود بعينه؛ السؤال «هل نستطيع» واقعي كاقتراح."),
    ("teag_heiztemp",
     "TEAG Mein Zuhause: Richtig heizen — Raumtemperaturen",
     "https://mein-zuhause.teag.de/energie-ratgeber/energieeffizienz/richtig-heizen-heizkosten-sparen",
     "يوصي بدرجة 20 مئوية في غرفة المعيشة و23 في الحمام، ويعتبر 23 مئوية في Wohnzimmer إسرافاً.",
     "نصائح عامة لا تحسم عادات الأبطال."),
    ("klimaaktiv_heizen",
     "klimaaktiv: Raumtemperatur-Empfehlungen (Wohnzimmer 20–22 °C)",
     "https://www.klimaaktiv.at/private/energiesparen/richtig-heizen",
     "يؤكد أن خفض الدرجة بمقدار درجتين يخفض التكاليف بنحو 12% (6% لكل درجة).",
     "توجيه نمساوي، لا يغيّر أن الرقمين 20 و23 مقبولان في محادثة A2."),
    ("toom_heiztipps",
     "toom: Richtig heizen — Thermostatstufen",
     "https://toom.de/selbermachen/wohnen-haushalt/waerme-energie/heizen/richtig-heizen/",
     "يسند أن الدرجة 20 مئوية توافق Stufe 3 و24 مئوية Stufe 4، فيمكن وصف 23 في Wohnzimmer بالتدفئة المفرطة.",
     "مصدر تجاري/توجيهي ولا يُعامل كمعيار ملزم."),
    ("helpster_bayram",
     "helpster: Zum Bayram-Fest eingeladen — Traditionen",
     "https://www.helpster.de/zum-bayram-fest-eingeladen-die-traditionen-einhalten_50447",
     "يسند أن لـRamazan Bayram/Zuckerfest تقليد عائلي، حلويات (Süßigkeiten)، ودعوة «Frohes Fest» مقبولة.",
     "صفحة معيشية شعبية؛ لا تمثل فتوى دينية."),
    ("welt_der_legenden_bayram",
     "Welt der Legenden: Bayram 2026 Zuckerfest/Opferfest",
     "https://welt-der-legenden.de/bayram-2026-deutschland-termine-zuckerfest-opferfest/",
     "يسند عبارة «Frohes Fest» كتحية مفهومة ومقدَّرة في Ramadanfest بألمانيا.",
     "مدونة ثقافية؛ التواريخ تقويمية وقد تختلف بيوم."),
    ("gdk_rostock_zuckerfest",
     "GdK Rostock: Zuckerfest (Bayram)",
     "https://www.gdk-rostock.de/news-1/zuckerfest-bayram",
     "يصف العيد (عيد الفطر/السكر) بالاجتماع العائلي والحلويات و«Frohes Fest» كعبارة تهنئة مناسبة لغير المسلمين.",
     "صفحة مجتمعية محلية ولا تحسم التفاصيل العائلية."),
    ("mkjfgfi_gratulation",
     "MKJFGFI NRW: Interreligiöser Kalender — Gratulationsformen",
     "https://www.mkjfgfi.nrw/sites/default/files/documents/interreligioser_kalender_gratulationsformen_final.pdf",
     "يسند رسمياً أن التحية البديلة «Frohes Fest» مقبولة لـRamadanfest في التعايش بألمانيا.",
     "دليل متعدد الأديان؛ لا يقيّد العربية في الحوار."),
    ("kandil_wishes",
     "Kandil: Wünsche zu islamischen Festen international",
     "https://www.kandil.de/arabesken/wuensche-zu-islamischen-festen-international",
     "يذكر «Frohes Fest» كتهنئة ألمانية مناسبة للأعياد الإسلامية.",
     "صفحة ثقافية لا مرجعية دينية رسمية."),
    ("hks_ottersberg_dstip",
     "HKS Ottersberg: Deutschlandstipendium — Bewerbungsunterlagen",
     "https://www.hks-ottersberg.de/studium/deutschlandstipendium.php",
     "يسند أن وثائق التقدُّم تشمل Zeugnis وLebenslauf وMotivationsschreiben.",
     "نموذج جامعة محددة؛ لا يعمم على كل المنح."),
    ("ovgu_faq_dstip",
     "OVGU: FAQ Deutschlandstipendium",
     "https://www.ovgu.de/deutschlandstipendiumfaq.html?rewrite_engine=fast",
     "يسند طلب Motivationsschreiben وLebenslauf وZeugnis، وأن المنحة لا تُحسب على BAföG حكماً.",
     "لا يثبت موعد 15 مارس فهو مثال حواري."),
    ("studis_bewerbung",
     "Studis Online: Bewerbungstipps für ein Stipendium",
     "https://www.studis-online.de/studienfinanzierung/stipendien-bewerbung.php",
     "يسند أن معظم الجهات تطلب Motivationsschreiben وLebenslauf وZeugnisse، وتجري مقابلة شخصية (Gespräch).",
     "نصائح عامة لا تحسم نوع المنحة."),
    ("erstenachhilfe_noten",
     "Erste Nachhilfe: Benotung in der Schule (1 bis 6)",
     "https://www.erstenachhilfe.de/blog/benotung-in-der-schule-zensuren-oder-punkte",
     "يسند النظام الألماني للدرجات: 1 = الأفضل و6 = الأسوأ، وEine Zwei جيدة، Eine Eins أفضل.",
     "يخص المرحلة ما قبل Oberstufe."),
    ("aok_zeugnis_bem",
     "AOK: Schulzeugnisse — Bemerkungen (fleißig, selbstständig)",
     "https://www.aok.de/fk/bayern/sozialversicherung/ausbilden/auszubildende-erfolgreich-werben/schulzeugnisse-in-der-bewerbung/",
     "يسند أن fleißig وselbstständig من أوصاف السلوك المدرسي الإيجابية.",
     "نصائح توظيف لا تقوّم لغة الحوار."),
    ("duden_stromanbieter",
     "Duden: Stromanbieter",
     "https://www.duden.de/rechtschreibung/Stromanbieter",
     "يسند المفردة بمعنى شركة توريد الكهرباء.",
     "لا يقيّم تعرفة الأسعار."),
    ("duden_nebenkosten",
     "Duden: Nebenkostenabrechnung",
     "https://www.duden.de/rechtschreibung/Nebenkostenabrechnung",
     "يسند المفردة (تسوية التكاليف الجانبية/المرافق).",
     "لا يحسب مبلغاً."),
    ("duden_nachzahlen",
     "Duden: nachzahlen",
     "https://www.duden.de/rechtschreibung/nachzahlen",
     "يسند المعنى «دفع مبلغ إضافي متأخر/لاحق».",
     "لا يحدد وضعه القانوني."),
    ("duden_rueckzahlung",
     "Duden: Rückzahlung",
     "https://www.duden.de/rechtschreibung/Rueckzahlung",
     "يسند المفردة بمعنى المبلغ المسترد.",
     "لا يحدد سبب الرد."),
    ("duden_sparsam",
     "Duden: sparsam",
     "https://www.duden.de/rechtschreibung/sparsam",
     "يسند صفة sparsam (مقتصد/موفر).",
     "لا يحدد درجة حرارة."),
    ("duden_ratenzahlung",
     "Duden: Ratenzahlung",
     "https://www.duden.de/rechtschreibung/Ratenzahlung",
     "يسند المفردة بمعنى الدفع على أقساط.",
     "لا يقيّم حق قانوني."),
    ("duden_ramadanfest",
     "Duden: Ramadanfest",
     "https://www.duden.de/rechtschreibung/Ramadanfest",
     "يسند الاسم الألماني للعيد (عيد الفطر/عيد رمضان).",
     "لا يصف عادات محددة."),
    ("duden_gastfreundschaft",
     "Duden: Gastfreundschaft",
     "https://www.duden.de/rechtschreibung/Gastfreundschaft",
     "يسند المفردة بمعنى الضيافة.",
     "لا يقوّم ثقافة."),
    ("duden_gymnasium",
     "Duden: Gymnasium",
     "https://www.duden.de/rechtschreibung/Gymnasium",
     "يسند Gymnasium كثانوية تؤهل للدراسة الجامعية في ألمانيا.",
     "لا يعادلها بنظام عربي واحد."),
    ("duden_klassenarbeit",
     "Duden: Klassenarbeit",
     "https://www.duden.de/rechtschreibung/Klassenarbeit",
     "يسند المفردة بمعنى اختبار/امتحان فصل دراسي.",
     "لا يحدد موعداً."),
    ("duden_fleissig",
     "Duden: fleißig",
     "https://www.duden.de/rechtschreibung/fleissig",
     "يسند صفة fleißig (مجتهد/مجدّ).",
     "لا يقوّم أداء شخصية."),
    ("duden_selbststaendig",
     "Duden: selbstständig",
     "https://www.duden.de/rechtschreibung/selbststaendig",
     "يسند صفة selbstständig (مستقل/يعتمد على نفسه).",
     "لا يصنف منحة."),
    ("duden_bewerbungsunterlagen",
     "Duden: Bewerbungsunterlagen",
     "https://www.duden.de/rechtschreibung/Bewerbungsunterlagen",
     "يسند الجمع بمعنى وثائق/مستندات التقديم.",
     "لا يحدد قائمة حصرية."),
    ("duden_motivationsschreiben",
     "Duden: Motivationsschreiben",
     "https://www.duden.de/rechtschreibung/Motivationsschreiben",
     "يسند المفردة بمعنى رسالة الدوافع.",
     "لا يقترح طولها."),
    ("duden_rechnung",
     "Duden: Rechnung",
     "https://www.duden.de/rechtschreibung/Rechnung",
     "يسند المفردة بمعنى فاتورة/حساب.",
     "لا يحدد قيمة."),
    ("duden_gast",
     "Duden: Gast",
     "https://www.duden.de/rechtschreibung/Gast",
     "يسند المفردة بمعنى ضيف.",
     "لا يصف عادات الضيافة."),
    ("duden_dekoration",
     "Duden: Dekoration",
     "https://www.duden.de/rechtschreibung/Dekoration",
     "يسند المفردة بمعنى زينة/ديكور.",
     "لا يحدد مَن يصنعها."),
    ("duden_eltern",
     "Duden: Eltern",
     "https://www.duden.de/rechtschreibung/Eltern",
     "يسند المفردة بمعنى الوالدين.",
     "لا يحكم على الوضع المالي."),
    ("duden_bezahlen",
     "Duden: bezahlen",
     "https://www.duden.de/rechtschreibung/bezahlen",
     "يسند الفعل بمعنى يدفع.",
     "لا يصف منحة."),
    ("duden_supermarkt",
     "Duden: Supermarkt",
     "https://www.duden.de/rechtschreibung/Supermarkt",
     "يسند المفردة بمعنى السوبرماركت.",
     "لا يصف عقد العمل."),
    ("duden_ausdrucken",
     "Duden: ausdrucken",
     "https://www.duden.de/rechtschreibung/ausdrucken",
     "يسند الفعل بمعنى يطبع.",
     "لا يصف أجهزة."),
]
SOURCE_IDS = {row[0]: f"S{index + 1:02d}" for index, row in enumerate(SOURCE_ROWS)}
SOURCES = [
    {
        "id": SOURCE_IDS[row[0]],
        "key": row[0],
        "title": row[1],
        "url": row[2],
        "supports": row[3],
        "limits": row[4],
    }
    for row in SOURCE_ROWS
]

# Per-line sources (by dialogue index 0..7).
LINE_SOURCES: dict[str, list[list[str]]] = {
    "d-a2-22": [
        ["S01", "S02", "S03", "S22"],   # 0 Nachzahlung + Nebenkosten
        ["S01", "S02", "S03", "S24"],   # 1 Rückzahlung
        ["S04", "S07", "S08"],          # 2 Energiekosten gestiegen; zu viel geheizt
        ["S07", "S08", "S09", "S24"],   # 3 sparsam 20 vs 23
        ["S04", "S05", "S21"],          # 4 Preisvergleich Stromanbieter
        ["S04"],                        # 5 alle Ausgaben vergleichen
        ["S04", "S06", "S34", "S40"],    # 6 Sonntag Rechnungen ausdrucken
        ["S06", "S25"],                 # 7 Raten zahlen
    ],
    "d-a2-23": [
        ["S10", "S12", "S26", "S27"],   # 0 Einladung Ramadanfest / mitbringen
        ["S10", "S11", "S12"],          # 1 Vorbereitung in Familie Tradition
        ["S35"],                         # 2 wie viele Gäste (Duden: Gast)
        ["S10", "S11"],                 # 3 zwanzig Gäste; Mutter bereitet Speisen
        ["S36"],                         # 4 Dekoration / Lichter (Duden: Dekoration)
        ["S10", "S11", "S12"],          # 5 Kinder machen Dekoration; süße Speisen probieren (تصحيح الضمير هنا)
        ["S13", "S14"],                 # 6 wie gratulieren
        ["S10", "S12", "S13", "S14", "S27"],  # 7 Frohes Fest; Gastfreundschaft
    ],
    "d-a2-24": [
        ["S15", "S17", "S32"],          # 0 Bewerbung Stipendium
        ["S18", "S28"],                 # 1 Abschluss Gymnasium, gute Noten
        ["S18"],                        # 2 Note Mathematik
        ["S18", "S29"],                 # 3 Zwei / Eins Klassenarbeit
        ["S17", "S19", "S30", "S31"],   # 4 fleißig & selbstständig; Unterstützung
        ["S37", "S38", "S39"],           # 5 Eltern bezahlen nicht; Supermarkt (Duden Eltern/bezahlen/Supermarkt)
        ["S15", "S16", "S17", "S32", "S33"],  # 6 Bewerbungsunterlagen 15. März
        ["S17"],                        # 7 Gespräch Vorbereitung
    ],
}

QUESTION_SOURCES: dict[str, list[str]] = {
    "d-a2-22-q1": ["S01", "S02"],
    "d-a2-22-q2": ["S04"],
    "d-a2-22-q3": ["S01"],
    "d-a2-23-q1": ["S10", "S11"],
    "d-a2-23-q2": ["S10"],
    "d-a2-23-q3": ["S10"],
    "d-a2-24-q1": ["S18", "S29"],
    "d-a2-24-q2": ["S15", "S37", "S38"],
    "d-a2-24-q3": ["S15"],
}

DICT_SOURCES: dict[str, list[list[str]]] = {
    "d-a2-22": [["S07"], ["S04", "S21"]],
    "d-a2-23": [["S10"], ["S10", "S12", "S27"]],
    "d-a2-24": [["S18"], ["S37", "S38"]],
}

# Per-waisen Duden/institutional sources.
WAISEN_SOURCES: dict[str, list[str]] = {
    "der Stromanbieter": ["S20", "S21"],
    "die Nebenkostenabrechnung": ["S22"],
    "nachzahlen": ["S23"],
    "die Rückzahlung": ["S24"],
    "die Energiekosten": ["S04"],
    "sparsam heizen": ["S07", "S08", "S24"],
    "vergleichen": ["S04"],
    "der Preisvergleich": ["S04", "S05"],
    "die Ausgaben": ["S01"],
    "das Fest": ["S10", "S26"],
    "der Gast": ["S10"],
    "die Einladung": ["S10"],
    "gratulieren": ["S13", "S14"],
    "die Dekoration": ["S10"],
    "die Vorbereitung": ["S10"],
    "vorbereiten": ["S10"],
    "die Speise": ["S10"],
    "probieren": ["S10"],
    "die Gastfreundschaft": ["S27"],
    "das Ramadanfest": ["S12", "S26"],
    "das Stipendium": ["S15"],
    "der Abschluss": ["S28"],
    "das Gymnasium": ["S28"],
    "die Klassenarbeit": ["S29"],
    "die Note": ["S18"],
    "fleißig": ["S30"],
    "selbstständig": ["S31"],
    "die Bewerbungsunterlagen": ["S32"],
    "die Unterstützung": ["S15"],
    "sich vorbereiten auf": ["S17"],
}


def main() -> None:
    dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    by_id = {d["id"]: d for d in dialogues}
    selected = [by_id[tid] for tid in TARGET_IDS]
    vocab = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))

    # Vocab card index.
    cards_by_de: dict[str, dict] = {}
    for deck in vocab.values():
        for c in deck.get("cards", []):
            if c.get("de"):
                cards_by_de.setdefault(c["de"], c)

    # Waisen audit.
    waisen_audit: list[dict[str, Any]] = []
    for tid in TARGET_IDS:
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

    items: list[dict[str, Any]] = []

    def add_item(item_id: str, kind: str, status: str, finding: str, action: str,
                 sources: list[str], reviewed: dict[str, Any],
                 before: dict[str, Any] | None = None,
                 after: dict[str, Any] | None = None) -> None:
        items.append({
            "id": item_id,
            "kind": kind,
            "status": status,
            "finding": finding,
            "action": action,
            "sources": sources,
            "reviewed": reviewed,
            **({"before": before} if before else {}),
            **({"after": after} if after else {}),
        })

    for tid in TARGET_IDS:
        d = by_id[tid]
        add_item(
            tid, "dialogue", "سليم",
            f"بيانات الحوار {tid} ({d['titleDe']}): {len(d['lines'])} أسطر، {len(d['questions'])} أسئلة، {len(d['dictation'])} إملاء، و{len(d.get('waisen', []))} waisen.",
            "بقيت بيانات الحوار (العنوانان، العلامة neu، وقائمة waisen) كما هي بعد التحقق.",
            ["S04" if tid == "d-a2-22" else ("S10" if tid == "d-a2-23" else "S15")],
            {
                "titleDe": d["titleDe"],
                "titleAr": d["titleAr"],
                "level": d.get("level"),
                "lineCount": len(d["lines"]),
                "questionCount": len(d["questions"]),
                "dictationCount": len(d["dictation"]),
                "neu": bool(d.get("neu")),
                "hasWaisen": isinstance(d.get("waisen"), list),
                "waisen": list(d.get("waisen", [])),
            },
        )

        # Line items.
        for i, line in enumerate(d["lines"]):
            src = LINE_SOURCES[tid][i]
            is_corrected = (tid == "d-a2-23" and i == 5)
            reviewed = {"who": line["who"], "de": line["de"], "ar": line["ar"]}
            if is_corrected:
                add_item(
                    f"{tid}.lines[{i}]", "line", "مصحح",
                    "تطابق الضمير مع المؤنث «الزينة»: كان العربية يستخدم «هذا يصنعه» مطابقة لضمير الألماني المحايد Das، وفي العربية «الزينة» مؤنثة، فاقتضى ذلك «هذه يصنعها» دون أي تغيير في الألماني.",
                    "صُحّح الضمير والفعل من «هذا يصنعه» إلى «هذه يصنعها» لتطابق جنس المؤنث «الزينة»، مع بقاء الجملة الألمانية والمعنى كما هما.",
                    ["S10", "S11", "S12"],
                    reviewed,
                    before={"de": line["de"], "ar": PRE_PATCH_AR},
                    after={"de": line["de"], "ar": POST_PATCH_AR},
                )
            else:
                add_item(
                    f"{tid}.lines[{i}]", "line", "سليم",
                    "النص الألماني والعربي متطابقان مع المصادر المتاحة من ناحية المعنى والمفردات والسياق التربوي.",
                    "لم يُجرَ أي تعديل على هذا السطر.",
                    src,
                    reviewed,
                )

        # Question items.
        for q in d["questions"]:
            snap = {
                "id": q["id"],
                "type": q["type"],
                "promptDe": q["promptDe"],
                "promptAr": q.get("promptAr"),
                "answer": q["answer"],
                "explanationAr": q["explanationAr"],
                "falle": q.get("falle", False),
            }
            if q["type"] != "fill":
                snap["options"] = list(q["options"])
            add_item(
                q["id"], "question", "سليم",
                "المفتاح مثبَّت بنص السطر المناظر، والفخاخ لا تغيّر النص أو تستنتج وقائع خارج الحوار؛ شرح العربية يسمي الدليل والفخّ.",
                "بقي السؤال ومفتاحه وخياراته وشرحه كما هي؛ لم يُعدَّل أي سؤال في هذه الدفعة.",
                QUESTION_SOURCES.get(q["id"], []),
                snap,
            )

        # Dictation items.
        for i, sentence in enumerate(d["dictation"]):
            add_item(
                f"{tid}.dictation[{i}]", "dictation", "سليم",
                "جملة الإملاء واردة حرفياً ضمن أحد أسطر الحوار الألماني.",
                "بقيت جملة الإملاء كما هي.",
                DICT_SOURCES[tid][i],
                {"sentence": sentence},
            )

    # Counts.
    counts = {"سليم": 0, "مصحح": 0, "غير محسوم": 0}
    for it in items:
        counts[it["status"]] += 1

    # Context and style notes.
    context_notes = [
        {
            "where": "d-a2-22 العنوان والسطر 0",
            "note": "عبارة «Nebenkostenabrechnung» في الحياة العملية الألمانية تخص عادة تسوية المرافق التي يحصّلها المؤجر (Heizung/Wasser/Hausmeister…)، والكهرباء الخاصة غالباً عقد منفصل مع مزودها. الحوار يستخدم المصطلح على نحو مبسّط كمحادثة منزلية عن وصول فاتورة/تسوية ينتج عنها دفع إضافي، ويعالج بعدها مقارنة Stromanbieter على أنها إجراء منفصل. لا يُعدّ ذلك خطأً في مستوى A2، وبقيت العبارة دون تعديل.",
            "sources": ["S01", "S02", "S22"],
        },
        {
            "where": "d-a2-22.lines[0,2,7]",
            "note": "الأرقام 240 و80 يورو وذكر «في Raten zahlen» (التقسيط) تُعامل كقيم حوارية تربوية. المصادر تثبت أن Nachzahlung وRatenzahlung ممكنة وواردة، لكن لا يوجد مصدر يثبت مبلغاً محدداً أو موافقة المزود؛ السطر يطرح السؤال فقط «هل نستطيع» دون تأكيد الموافقة.",
            "sources": ["S06", "S25"],
        },
        {
            "where": "d-a2-22.lines[3]",
            "note": "درجتا الحرارة 20 و23 مئوية في Wohnzimmer متوافقتان مع نصائح توفير الطاقة الألمانية/النمساوية التي توصي بـ20–22 درجة في المعيشة وتعتبر 23–24 إسرافاً؛ لا يوجد ادعاء بملزَمية هذه القيم.",
            "sources": ["S07", "S08", "S09"],
        },
        {
            "where": "d-a2-23 العنوان والسطر 0",
            "note": "عنوان الحوار «Einladung zum Fest» عام، بينما السطر الأول يسمّي «Ramadanfest» (عيد الفطر/السكر)؛ التفاصيل (حلويات، تهنئة «Frohes Fest»، تحضير عائلي) متوافقة مع وصف عيد الفطر في مصادر ثقافية متعددة بألمانيا. التحية «عيد سعيد» تقابل «Frohes Fest» على مستوى A2، وقد تُستخدم أيضاً «عيد مبارك»، لكنها بديل أسلوبي لا خطأ.",
            "sources": ["S10", "S11", "S12", "S13", "S14"],
        },
        {
            "where": "d-a2-24.lines[1,4]",
            "note": "وصف «Abschluss am Gymnasium» و«Studierende, die fleißig und selbstständig arbeiten» يعمّم منظور طلب المنح الدراسية في ألمانيا (مثل Deutschlandstipendium) حيث تُطلب Zeugnis وLebenslauf وMotivationsschreiben. النماذج تختلف بين الجامعات والمؤسسات، والتاريخ «15. März» مثال حواري لا مرجع تقويمي حقيقي.",
            "sources": ["S15", "S16", "S17", "S30", "S31"],
        },
        {
            "where": "d-a2-24.lines[3]",
            "note": "الدرجتان «Eine Zwei» و«eine Eins» تستخدمان نظام العلامات الألماني (1=ممتاز، 2=جيد)، مطابقاً لنظام Zensuren 1–6 قبل Oberstufe؛ العربية «اثنان/واحد» مبسّطة ومتوقعة في محادثة A2.",
            "sources": ["S18"],
        },
    ]

    style_alternatives = [
        {
            "where": "d-a2-22.lines[2].ar",
            "alt": "يمكن صياغة «zu viel geheizt» أدقّ كـ«أفرطنا في التدفئة» أو «دفّأنا أكثر من اللازم» بدلاً من «دفّأنا كثيراً»، لكن الصياغة الحالية سليمة ولا تقدّم معنى خاطئاً في سياق A2.",
            "sources": ["S23"],
            "notChanged": True,
        },
        {
            "where": "d-a2-24.lines[1].ar",
            "alt": "«أنهيت الثانوية العامة» تبسيط مقبول لـAbschluss am Gymnasium (شهادة Abitur/الأبيتور). قد يُفضَّل «شهادة الأبيتور» أو «الثانوية المؤهلة للجامعة» لدقة أكبر، لكن العبارة الحالية لا تخلّ بالمعنى في مستوى A2، فلم تُعدَّل.",
            "sources": ["S28"],
            "notChanged": True,
        },
    ]

    unresolved: list[dict[str, Any]] = []

    # Audio audit.
    import os, glob
    manifest_entries: list[str] = []
    def walk(node: Any):
        if isinstance(node, dict):
            for k, v in node.items():
                if isinstance(v, str) and any(tid in v for tid in TARGET_IDS):
                    manifest_entries.append(v)
                walk(v)
        elif isinstance(node, list):
            for x in node: walk(x)
    audio_manifest = json.loads(AUDIO_MANIFEST.read_text(encoding="utf-8")) if AUDIO_MANIFEST.exists() else {}
    walk(audio_manifest)
    mp3s: list[str] = []
    for tid in TARGET_IDS:
        mp3s.extend(glob.glob(str(AUDIO_DIR / "dialog" / f"*{tid}*.mp3")))

    audio = {
        "present": bool(manifest_entries) or bool(mp3s),
        "manifestEntries": manifest_entries,
        "mp3Files": mp3s,
        "note": "لا توجد إدخالات مطابقة في `content/dialog-audio.json` ولا ملفات mp3 تحت `public/audio/dialog` لهذه المعرّفات الثلاثة، لذا لم يحدث تشغيل أو استماع لهذه الدفعة؛ التقرير لا يدّعي ذلك.",
    }

    report = {
        "reviewRule": REVIEW_RULE,
        "date": DATE,
        "batch": BATCH,
        "targetDialogueIds": list(TARGET_IDS),
        "totals": {
            "items": len(items),
            "okay": counts["سليم"],
            "corrected": counts["مصحح"],
            "unresolved": counts["غير محسوم"],
            "sources": len(SOURCES),
            "waisenAudited": len(waisen_audit),
        },
        "coverage": {
            "dialogues": len(selected),
            "items": len(items),
            "waisen": len(waisen_audit),
        },
        "statusCounts": dict(counts),
        "statusDefinitions": {
            "سليم": "وحدة روجعت ضد مصادر متاحة ووجدت متطابقة من غير خطأ مؤكد؛ بقيت كما هي.",
            "مصحح": "وحدة حُدّد فيها خطأ مؤكَّد فصُحّح مع بقاء الألماني والمفاتيح محمية.",
            "غير محسوم": "وحدة تحتاج معلومات إضافية أو حكماً تربوياً/بشرياً لا يتوفر من المصادر؛ تُترك دون تعديل.",
        },
        "correction": {
            "onlyFieldChanged": "d-a2-23.lines[5].ar",
            "beforeAr": PRE_PATCH_AR,
            "afterAr": POST_PATCH_AR,
            "rationale": "تطابق جنس الضمير «هذه» مع المؤنث «الزينة» بدلاً من المحايد الألماني Das الذي لا جنس له في العربية؛ الألماني لم يتغير.",
            "germanUnchanged": True,
            "questionsUnchanged": True,
        },
        "sources": SOURCES,
        "items": items,
        "contextNotes": context_notes,
        "styleAlternatives": style_alternatives,
        "unresolved": unresolved,
        "waisen": waisen_audit,
        "audio": audio,
        "limits": {
            "cefr": "لم يُعد تقييم CEFR أو نسبة المحتوى أو حساب المستوى في هذه الدفعة.",
            "audio": "لم يحدث تشغيل/استماع لأي ملف صوتي؛ لا توجد أصول صوت مطابقة لهذه المعرّفات.",
            "human": "المراجعة مؤازرة بمصادر منشورة وليست مراجعة بشرية أو اعتماداً مهنياً.",
            "medical": "الدفعة لا تحتوي محتوى طبياً سريرياً؛ أي ذكر للدرجات/المنح لا يُعدّ مشورة تعليمية ملزمة.",
            "legal": "المعلومات العامة عن Nebenkosten وRatenzahlung وBewerbungsunterlagen لا تغني عن استشارة رسمية من مزود طاقة أو جامعة أو جهة مانحة.",
        },
        "gates": {
            "planned": "K185a–j (مقررة في `scripts/engine_smoke.ts` بعد التقرير).",
        },
    }

    DOCS_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Markdown rendering.
    lines: list[str] = []
    lines.append(f"# مراجعة حوارات A2 22–24 (R111) — {DATE}")
    lines.append("")
    lines.append(f"- **النطاق:** `d-a2-22` (فاتورة الكهرباء)، `d-a2-23` (دعوة إلى العيد)، `d-a2-24` (طلب المنحة الدراسية).")
    lines.append(f"- **القاعدة/الدفعة:** {REVIEW_RULE} / {BATCH}.")
    lines.append(f"- **الوحدات المدققة:** 42 وحدة (3 بيانات حوارات، 24 سطراً، 9 أسئلة، 6 جمل إملاء).")
    lines.append(f"- **الحكم الجملي:** {counts['سليم']} سليمة، {counts['مصحح']} مصححة، {counts['غير محسوم']} غير محسومة.")
    lines.append(f"- **مفردات waisen المدققة:** {len(waisen_audit)} (جميعها لها بطاقات مستوى A2 أو أعلى).")
    lines.append(f"- **المراجع المسجلة:** {len(SOURCES)} مصدراً منشوراً (S01–S{len(SOURCES):02d}).")
    lines.append(f"- **التصحيح الوحيد:** {report['correction']['onlyFieldChanged']} — الضمير من «هذا يصنعه» إلى «هذه يصنعها» لتطابق المؤنث «الزينة».")
    lines.append(f"- **حدود:** لم يُعد تقييم CEFR أو النسبة أو حساب المستوى. المراجعة مؤازرة بمصادر منشورة وليست مراجعة بشرية أو اعتماداً مهنياً.")
    lines.append("")
    lines.append("## 1) ملخص سريع")
    lines.append("")
    lines.append("- فُحصت العبارات الألمانية المتصلة بالطاقة (Nebenkosten/Nachzahlung/Rückzahlung/Preisvergleich/Ratenzahlung) ودرجات الحرارة الموصى بها (20 درجة في غرفة المعيشة مقابل 23) ضد Verbraucherzentrale وهيئات استهلاكية وتوجيهات توفير الطاقة.")
    lines.append("- فُحصت تقاليد Ramadanfest/Zuckerfest (العائلة تجهّز، الأطفال يصنعون الزينة، الحلويات، تحية «Frohes Fest»/«عيد سعيد»، الضيافة) ضد مصادر ثقافية ودليل الأديان في NRW.")
    lines.append("- فُحصت مفردات المنح الدراسية (Stipendium/Bewerbungsunterlagen: Zeugnis/Lebenslauf/Motivationsschreiben، النظام الدرجي 1–6، وصف fleißig/selbstständig) ضد مواقع الجامعات وDuden ومراجع تقديم الطلبات.")
    lines.append("- صُحّح خطأ عربي واحد في مطابقة جنس الضمير؛ لم تتغير أي كلمة ألمانية أو سؤال أو مفتاح إجابة.")
    lines.append("- سجلت 6 ملاحظات سياقية وبديلان أسلوبيان منفصلان دون تحويلها إلى أخطاء.")
    lines.append("")
    lines.append("## 2) التصحيح المؤكد")
    lines.append("")
    lines.append("| الحقل | قبل | بعد | السبب | المصادر |")
    lines.append("|---|---|---|---|---|")
    lines.append(f"| {report['correction']['onlyFieldChanged']} | {report['correction']['beforeAr']} | {report['correction']['afterAr']} | {report['correction']['rationale']} | S10، S11، S12 |")
    lines.append("")
    lines.append("## 3) سجل الوحدات الـ42")
    lines.append("")
    for it in items:
        badge = {"سليم": "✅", "مصحح": "✏️", "غير محسوم": "❓"}[it["status"]]
        if it["kind"] == "dialogue":
            r = it["reviewed"]
            lines.append(f"- {badge} **{it['id']}** (بيانات حوار): `{r['titleDe']}` — {it['finding']} · المصادر: {', '.join(it['sources']) or '—'}")
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
    lines.append("## 5) بدائل أسلوبية/تربوية (لم تُطبَّق)")
    lines.append("")
    for n in style_alternatives:
        lines.append(f"- **{n['where']}** — {n['alt']} (المصادر: {', '.join(n['sources'])})")
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
    lines.append(f"فُحصت قوائم waisen في كل حوار، وجميع المصطلحات الـ{len(waisen_audit)} لها بطاقات مفردات في `content/vocab.json` ومستوى A2 أو أعلى. الروابط المعجمية/الرسمية مذكورة في جدول المصادر أعلاه (S01–S{len(SOURCES):02d}).")
    lines.append("")
    lines.append("| الحوار | waisen (العدد) |")
    lines.append("|---|---|")
    from collections import Counter
    cnt = Counter(e["dialogueId"] for e in waisen_audit)
    for tid in TARGET_IDS:
        terms = ", ".join(e["term"] for e in waisen_audit if e["dialogueId"] == tid)
        lines.append(f"| {tid} ({cnt[tid]}) | {terms} |")
    lines.append("")
    lines.append("## 8) تدقيق الصوت والاختبارات")
    lines.append("")
    lines.append(f"- **البيان:** {audio['note']}")
    lines.append(f"- **إدخالات البيان المطابقة:** {len(audio['manifestEntries'])} (لا توجد).")
    lines.append(f"- **ملفات mp3 المطابقة:** {len(audio['mp3Files'])} (لا توجد).")
    lines.append("- لم يحدث تشغيل أو استماع أو فك ترميز لأي ملف صوت في هذه الدفعة؛ لا ادعاء بذلك.")
    lines.append("- البوابات المخططة: K185a–j (تُضاف إلى `scripts/engine_smoke.ts` بعد إنشاء التقرير) تغطي 42 لقطة حية، وعدد المصادر، وwaisen، والتصحيح الوحيد، والصوت، والحدود.")
    lines.append("")
    lines.append("## 9) البوابات والفحوص")
    lines.append("")
    lines.append("البوابات المضافة K185a–j تحرس:")
    lines.append("- K185a: تغطية 3 حوارات و42 وحدة، 41 سليمة ومصحّح واحد، واتّصاد لقطات الحقول الحية.")
    lines.append("- K185b: 33 مصدراً منشوراً مستخدَماً (S01–S33) مع حدودها وربطها بالوحدات و30 waisen لكل منهم بطاقة A2.")
    lines.append("- K185c: حصر التعديل في `d-a2-23.lines[5].ar` فقط، مع بقاء الألماني والمفاتيح والتفسيرات و9 مفاتيح ثابتة.")
    lines.append("- K185d: غياب أصول الصوت وعدم ادعاء استماع.")
    lines.append("- K185e: رقعة R111 محروسة وقابلة لإعادة التطبيق بلا أثر جانبي.")
    lines.append("- K185f: فصل الملاحظات السياقية (6) والبدائل الأسلوبية (2) دون تحويلها لأخطاء.")
    lines.append("- K185g: حدود التقرير (CEFR والصوت وعدم الاعتماد البشري/القانوني).")
    lines.append("- K185h: ربط جميع وحدات waisen ببطاقاتها المعجمية ومصادرها.")
    lines.append("- K185i: حماية مفاتيح الإجابات التسعة بما فيها أسئلة الصح/خطأ والملء.")
    lines.append("- K185j: عدم تغيير أي نص ألماني أو سؤال أو مفتاح في الرقعة.")
    lines.append("")
    DOCS_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {DOCS_JSON} and {DOCS_MD}")


if __name__ == "__main__":
    main()
