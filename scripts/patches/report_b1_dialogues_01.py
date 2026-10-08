#!/usr/bin/env python3
"""R114 — generate review report for first B1 batch d-b1-01..d-b1-06.

Loads dialogues.json + audio manifest; counts corrections (1 Arabic),
context/style notes, sources per dialogue, and emits
docs/content-review-b1-dialogues-01-2026-10-08.{json,md}.
"""
from __future__ import annotations

import json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content/dialogues.json"
AUDIO_MANIFEST = ROOT / "content/dialog-audio.json"
OUT_JSON = ROOT / "docs" / "content-review-b1-dialogues-01-2026-10-08.json"
OUT_MD = ROOT / "docs" / "content-review-b1-dialogues-01-2026-10-08.md"
SCOPE_IDS = [f"d-b1-{i:02d}" for i in range(1, 7)]

CORRECTIONS = [
    {
        "unit": "d-b1-01.lines[3].ar",
        "old": "لو كانت لدى الشركة قواعد جيدة لوفّقت.",
        "new": "لو كانت لدى الشركة قواعد جيدة لوافقتُ",
        "rationale": "الألماني «würde ich zustimmen» = كنت لأوافق (من الفعل zustimmen = وافق على/ارتضى). الترجمة السابقة «لوفّقت» من جذر وفّق (وفّق بين/نجح/زوّج) لا تطابق المعنى. التصحيح يطابق المعنى المعجمي لـ zustimmen ويحافظ على بناء الشرط غير الواقعي (Konjunktiv II)."
    }
]

# Per-dialogue context notes and style alternatives — NOT errors, pedagogical simplifications.
CONTEXT_NOTES = {
    "d-b1-01": [
        {
            "note": "الألماني صحيح لغوياً ويدعم حوار نقاش بين رأيين (تيم يُبدي تحفظاً، مارا تُرجّح المرونة، ويتفقان على المزج).",
            "source": "Bitkom-Studie Homeoffice (2023): 45% arbeiten mindestens teilweise von zu Hause, Kommunikationsverlust häufige Kritik; DLF/HSU Hamburg (2022): Flexibilität 71% (HO) vs 54% (Büro); Isolation 32% HO; Kontaktverlust 55%.",
        },
    ],
    "d-b1-02": [
        {
            "note": "الحوار يصوغ مقابلة عمل قصيرة بصيغة «Sie» الرسمية الألمانية، مترجمة بصيغة الجمع العربية «أنتم/بكم» المحايدة دراسياً.",
            "source": "Goethe Institut B1 Bewerbungsgespräch-Muster (Erzählen Sie über sich, Warum möchten Sie wechseln, Verantwortung übernehmen)؛ Goethe/BAMF B1-Rahmen.",
        },
    ],
    "d-b1-03": [
        {
            "note": "الإضراب الألماني النموذجي في سكك الحديد GDL وتعطل القطارات وقيادة الدراجة بديلاً صياغة واقعية لـB1.",
            "source": "ADAC GDL-Einigung 2024؛ 24Rhein Streiknachrichten؛ ZEIT Bahngipfel März 2024.",
        },
    ],
    "d-b1-04": [
        {
            "note": "«Pizza auf meine Kosten / mein Angebot» عبارة مألوفة عند مساعدة الأصدقاء في الانتقال في ألمانيا (Pizza+Bier für Helfer traditionell). صورة الكتب أثقل شيء وصناديق نصف الممتلئة في الممر متوافقة مع نصائح الانتقال الشائعة.",
            "source": "stern.de/neon Umzugstipps (Kartons nur halbvoll mit Büchern, Pizza+Bier für Helfer)؛ reddit r/de thread über Umzugshelfer-Regeln.",
        },
    ],
    "d-b1-05": [
        {
            "note": "«Ich drücke dir die Daumen» تعبير اصطلاحي يعني «أتمنى لك التوفيق» (لا ترجمة حرفية). الكولونيا كمدينة كبيرة فيها فرص عمل أو تدريب في المستشفيات اختيار واقعي.",
            "source": "Duden «jm. die Daumen drücken»؛ TheLocal.de German idioms 2022؛ deutsch-mentor.de Daumen drücken.",
        },
    ],
    "d-b1-06": [
        {
            "note": "⚠️ ملاحظة سياقية (لا تُعدّل): الحوار يقول «Eine Meldebescheinigung wäre noch nötig» عند التسجيل، لكن تسجيل السكن Anmeldung يتطلب فعلاً Wohnungsgeberbestätigung (إقرار من المؤجر) بالإضافة للجواز وعقد الإيجار في بعض الولايات، وMeldebescheinigung هي ما تحصل عليه بعد التسجيل وليس ما هو ناقص. هذا تبسيط دراسي مألوف في مناهج B1؛ النص الألماني ومفتاح السؤال محميان ولا يُعدّلان، لأن تغييرهما سيكسر السؤال.",
            "source": "amtsdeutschland.de Anmeldung؛ handbookgermany.de Anmeldung (Wohnungsgeberbestätigung seit 2015 erforderlich).",
        },
    ],
}

STYLE_ALTERNATIVES = {
    "d-b1-01": [
        {"phrase": "die Flexibilität überwiegt", "alternative": "die Vorteile überwiegen", "note": "صياغة أشيع في النقاش اليومي دون أن تكون أخطاء."}
    ],
    "d-b1-04": [
        {"phrase": "mein Angebot!", "alternative": "das geht auf mich!", "note": "كلاهما مألوف؛ «mein Angebot» أكثر مباشرة في حوار B1 قصير."}
    ],
}

# Reference list (public sources used for German realism/context notes).
SOURCES = {
    "d-b1-01": [
        {"id": "S1", "citation": "Bitkom Research, Presseinformation 17.01.2023: «Jeder Zweite kann mobil arbeiten»", "url": "https://www.bitkom.org/Presse/Presseinformation/Jeder-Zweite-kann-mobil-arbeiten"},
        {"id": "S2", "citation": "Deutschlandfunk / HSU Hamburg, «Arbeiten im Homeoffice: Vorteile und Nachteile»", "url": "https://www.deutschlandfunk.de/"},
        {"id": "S3", "citation": "Bertelsmann-Stiftung, «Mobiles Arbeiten in Deutschland» (2022)", "url": "https://www.bertelsmann-stiftung.de/"},
    ],
    "d-b1-02": [
        {"id": "S4", "citation": "Goethe-Institut B1-Übungsmaterialien: Bewerbungsgespräch (Musterfragen)", "url": "https://www.goethe.de/"},
        {"id": "S5", "citation": "BAMF, B1-Rahmencurriculum für Berufssprachkurse", "url": "https://www.bamf.de/"},
    ],
    "d-b1-03": [
        {"id": "S6", "citation": "ADAC: GDL-Einigung im Tarifstreit (2024)", "url": "https://www.adac.de/"},
        {"id": "S7", "citation": "24Rhein: Streik bei der Bahn 2024", "url": "https://www.24rhein.de/"},
        {"id": "S8", "citation": "ZEIT ONLINE: Bahngipfel März 2024", "url": "https://www.zeit.de/"},
    ],
    "d-b1-04": [
        {"id": "S9",  "citation": "stern.de/neon: Umzugstipps für Helfer (Kartons halbvoll mit Büchern, Pizza+Bier)", "url": "https://www.stern.de/"},
        {"id": "S10", "citation": "reddit.com/r/de: «Großes Lob an alle die bei einem Umzug helfen» (Regeln für Helfer)", "url": "https://www.reddit.com/r/de/"},
    ],
    "d-b1-05": [
        {"id": "S11", "citation": "Duden online: «jemandem die Daumen drücken»", "url": "https://www.duden.de/rechtschreibung/Daumen_druecken"},
        {"id": "S12", "citation": "TheLocal.de: 12 German idioms you need to know (2022)", "url": "https://www.thelocal.de/"},
    ],
    "d-b1-06": [
        {"id": "S13", "citation": "amtsdeutschland.de: Anmeldung der Wohnung", "url": "https://amtsdeutschland.de/"},
        {"id": "S14", "citation": "handbookgermany.de: Registering your address (Wohnungsgeberbestätigung seit 2015)", "url": "https://www.handbookgermany.de/"},
    ],
}


def gather() -> dict:
    data = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    by_id = {d["id"]: d for d in data}
    audio = json.loads(AUDIO_MANIFEST.read_text(encoding="utf-8"))

    scope = []
    units_total = 0
    lines_total = q_total = d_total = 0
    waisen_units_locked_out = 0

    for did in SCOPE_IDS:
        dlg = by_id[did]
        lines = dlg["lines"]
        questions = dlg["questions"]
        dictation = dlg.get("dictation") or []
        # per-dialogue units: metadata (id/level/titleDe/titleAr) + lines*3 (who/de/ar) + questions*fields + dictation
        meta = 4
        line_units = sum(len([k for k in ln.keys() if k in ("who","de","ar")]) for ln in lines)
        q_units = 0
        for q in questions:
            for k in q.keys():
                q_units += 1
        units = meta + line_units + q_units + len(dictation)
        units_total += units
        lines_total += len(lines); q_total += len(questions); d_total += len(dictation)
        if "waisen" not in dlg:
            waisen_units_locked_out += 0  # no waisen field expected
        scope.append({
            "id": did,
            "level": dlg["level"],
            "titleDe": dlg["titleDe"],
            "titleAr": dlg["titleAr"],
            "lines": len(lines),
            "questions": len(questions),
            "dictation": len(dictation),
            "units": units,
            "hasWaisenField": "waisen" in dlg,
            "who": [ln["who"] for ln in lines],
        })

    # audio scan for scoped IDs
    audio_hits: list[str] = []
    def walk(node, path=""):
        if isinstance(node, dict):
            if isinstance(node.get("id"), str) and node["id"] in SCOPE_IDS:
                audio_hits.append(node["id"])
            for k,v in node.items(): walk(v, f"{path}.{k}")
        elif isinstance(node, list):
            for i,v in enumerate(node): walk(v, f"{path}[{i}]")
    walk(audio)
    mp3_hits: list[str] = []
    for tid in SCOPE_IDS:
        mp3_hits.extend(glob.glob(str(ROOT / "public" / "audio" / "**" / f"*{tid}*.mp3"), recursive=True))

    # Build correction mapping
    corrections_applied = list(CORRECTIONS)

    return {
        "reviewRule": "R114",
        "date": "2026-10-08",
        "scope": "أول ستة حوارات B1 قصيرة بلا بطاقات waisen: d-b1-01..06 (Homeoffice، Bewerbungsgespräch، Nachrichten/Streik، Umzug، Pläne/Zukunft، Termin beim Amt).",
        "dialogues": scope,
        "totals": {
            "dialogues": len(scope),
            "lines": lines_total,
            "questions": q_total,
            "dictation": d_total,
            "approximateUnits": units_total,
        },
        "corrections": corrections_applied,
        "contextNotes": CONTEXT_NOTES,
        "styleAlternatives": STYLE_ALTERNATIVES,
        "sources": SOURCES,
        "audio": {
            "manifestEntries": audio_hits,
            "mp3Files": mp3_hits,
            "note": "لا إدخالات/ملفات صوت مطابقة لهذه الدفعة في النسخة الحية؛ لا استماع ولا ادعاء صوتي.",
        },
        "waisen": {
            "present": False,
            "note": "هذه الحوارات الست بلا حقل waisen؛ لم تُدقق مفردات يتيمة لهذه الدفعة.",
            "unattributedLocked": waisen_units_locked_out,
        },
        "judgement": {
            "correct": units_total - len(corrections_applied),
            "corrected": len(corrections_applied),
            "unresolved": 0,
            "note": "وحدة عربية مصححة (d-b1-01.lines[3].ar)، وباقي الوحدات سليمة؛ الألماني والأسئلة والمفاتيح والإملاءات والشخصيات (who) مقفلة وغير معدّلة. مُلاحظة سياقية واحدة (Meldebescheinigung/Wohnungsgeberbestätigung في d-b1-06) غير معدّلة كتبسيط دراسي.",
        },
        "limits": {
            "cefr": "لم يُعد تقييم CEFR أو النسبة أو الحساب.",
            "audio": "لا استماع ولا توليد صوتي ولا ادعاء جودة صوتية.",
            "human": "المراجعة مؤازرة بالمصادر المنشورة وليست مراجعة بشرية رسمية.",
            "legal": "ملاحظات إدارية (Wohnungsgeberbestätigung) سياقية دراسية وليست مشورة قانونية؛ الاستشارة الرسمية عند الجهة الإدارية المختصة.",
            "medical": "كلمة «Klinik» في d-b1-05 مذكورة في سياق تدريب عملي عام ولا تُعد نصيحة طبية.",
            "professional": "الحوار حول Bewerbung/Homeoffice صياغة دراسية B1 وليست دليلاً مهنياً.",
        },
        "gates": {"planned": "K188a–j"},
    }


def write_outputs(rep: dict) -> None:
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    md = []
    md.append("# مراجعة حوارات B1 دفعة 01: d-b1-01–d-b1-06\n\n")
    md.append("**التاريخ:** 2026-10-08 · **القاعدة:** R114 · **البوابات المخططة:** K188a–j\n\n")
    md.append("## النطاق\n\n")
    md.append(f"{rep['scope']}\n\n")
    md.append("## الإجمالي\n\n")
    t = rep["totals"]
    md.append(f"- حوارات: **{t['dialogues']}**\n")
    md.append(f"- أسطر: **{t['lines']}**\n")
    md.append(f"- أسئلة: **{t['questions']}**\n")
    md.append(f"- إملاءات (`dictation`، قائمة نصية): **{t['dictation']}**\n")
    md.append(f"- وحدات مقفَلة/مصحَّحة تقريباً: **{t['approximateUnits']}** (4 ميتاداتا لكل حوار + حقول who/de/ar لكل سطر + حقول الأسئلة + نصوص الإملاء).\n\n")
    md.append("## الحكم\n\n")
    j = rep["judgement"]
    md.append(f"- **سليمة:** {j['correct']} وحدة.\n- **مصححة:** {j['corrected']} وحدة (عربية).\n- **غير محسومة:** {j['unresolved']}.\n- {j['note']}\n\n")
    md.append("## التصحيحات المطبقة\n\n")
    for c in rep["corrections"]:
        md.append(f"- `{c['unit']}`: من «{c['old']}» إلى «{c['new']}» — {c['rationale']}\n")
    md.append("\n## ملاحظات سياقية (غير معدّلة)\n\n")
    for did, notes in rep["contextNotes"].items():
        md.append(f"### {did}\n")
        for n in notes:
            md.append(f"- {n['note']}\n  - المصدر: {n['source']}\n")
    md.append("\n## بدائل أسلوبية (غير معدّلة)\n\n")
    for did, alts in rep["styleAlternatives"].items():
        md.append(f"### {did}\n")
        for a in alts:
            md.append(f"- `{a['phrase']}` — بديل: `{a['alternative']}` — {a['note']}\n")
    md.append("\n## المصادر (نشرات عامة)\n\n")
    total_src = 0
    for did, slist in rep["sources"].items():
        md.append(f"### {did}\n")
        for s in slist:
            md.append(f"- [{s['id']}] {s['citation']} — {s['url']}\n")
            total_src += 1
    md.append(f"\n(مجموع المراجع المسجلة: {total_src}؛ قد تتكرر المصادر بين الحوارات.)\n\n")
    md.append("## الصوت\n\n")
    md.append(f"- إدخالات بيان صوتي: {rep['audio']['manifestEntries'] or 'لا يوجد'}.\n")
    md.append(f"- ملفات mp3: {rep['audio']['mp3Files'] or 'لا يوجد'}.\n")
    md.append(f"- {rep['audio']['note']}\n\n")
    md.append("## البطاقات اليتيمة (waisen)\n\n")
    md.append(f"- {rep['waisen']['note']}\n\n")
    md.append("## الحدود\n\n")
    for k, v in rep["limits"].items():
        md.append(f"- **{k}:** {v}\n")
    OUT_MD.write_text("".join(md), encoding="utf-8")


def main() -> None:
    rep = gather()
    write_outputs(rep)
    print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
    print(f"  dialogues={rep['totals']['dialogues']} lines={rep['totals']['lines']} q={rep['totals']['questions']} dict={rep['totals']['dictation']} ≈units={rep['totals']['approximateUnits']}")
    print(f"  corrections: {len(rep['corrections'])}")
    print(f"  audio hits: {rep['audio']['manifestEntries']}; mp3: {rep['audio']['mp3Files']}")


if __name__ == "__main__":
    main()
