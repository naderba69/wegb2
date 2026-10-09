#!/usr/bin/env python3
"""R135 — review report for first A0 texts batch (t-a0-01..05).

Scope: 5 A0 texts (Alphabet / Hallo / Zahlen 1-10 / Tage / Ich bin da).
Corrections: 2 Arabic promptAr fills for empty fields. All German/options/
answers/explanations/translations LOCKED.
"""
from __future__ import annotations
import json, glob, os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXTS_PATH = ROOT / "content" / "texts.json"
OUT_DIR = ROOT / "docs"
OUT_JSON = OUT_DIR / "content-review-a0-texts-01-2026-10-09.json"
OUT_MD = OUT_DIR / "content-review-a0-texts-01-2026-10-09.md"

REVIEW_RULE = "R135"
BATCH_LABEL = "أول دفعة نصوص A0"
TARGET_IDS = ["t-a0-01","t-a0-02","t-a0-03","t-a0-04","t-a0-05"]


CORRECTIONS = [
    {
        "unit": "t-a0-03.questions[2].promptAr",
        "field": "promptAr",
        "before": "",
        "after": "كم عمر الشخص في النص؟",
        "reason": "استكمال حقل promptAr فارغ لسؤال «Wie alt ist die Person im Text؟» (ثلاثون سنة) مطابقة الألماني ونمط بقية الأسئلة في النص."
    },
    {
        "unit": "t-a0-04.questions[2].promptAr",
        "field": "promptAr",
        "before": "",
        "after": "ما يوم اليوم في النص؟",
        "reason": "استكمال حقل promptAr فارغ لسؤال «Welcher Tag ist heute im Text؟» (Montag = الاثنين) مطابقة الألماني والنمط."
    },
]

CONTEXT_NOTES = {
    "t-a0-01": [
        {"note": "نص الأبجدية: سرد الحروف مع لفظ تقريبي؛ العربية لا تنقل لفظ J/V/W (jott/fau/weh) وX/Y (iks/üpsilon) بل تذكر طريقة اللفظ في نظام التهجئة الألمانية — النقل صحيح."},
        {"note": "ß كلمة إيتسيست (Eszett / scharfes S) يُعرَّف «حرفاً» (ein Buchstabe) وهو الجواب الصحيح في Q2."},
        {"note": "الأوملاوت Ä/Ö/Ü ثلاثة أحرف (Umlaute)؛ السؤال Q1 يجيب «drei» مطابقة النص."},
    ],
    "t-a0-02": [
        {"note": "تحية «Guten Tag!» تلي «Ich komme aus Tunesien»؛ هي جواب Q3 الرسمي."},
        {"note": "العربية تستعمل «نهارك سعيد» لـGuten Tag و«سعيدة بلقائك» لـFreut mich و«إلى اللقاء» لـAuf Wiedersehen، صياغ سليمة."},
    ],
    "t-a0-03": [
        {"note": "الأرقام 1–10 مع الصفر؛ «Ich bin dreißig Jahre alt» يحدد العمر ثلاثين سنة (جواب Q3)."},
        {"note": "خمسة زائد واحد = ستة (sechs)؛ تعني zehn=10."},
    ],
    "t-a0-04": [
        {"note": "أيام الأسبوع السبعة؛ نهاية الأسبوع السبت والأحد؛ اليوم الاثنين (جواب Q3 المُستكمل)."},
        {"note": "العربية تذكر «السبت والأحد هما عطلة نهاية الأسبوع» لـWochenende، مطابقة صحيحة."},
    ],
    "t-a0-05": [
        {"note": "ضمائر الفصل (ich/du/er/sie/wir/ihr/Sie) و«هذا اسمي»؛ العربية تضيف ملاحظة «وتُستعمل Sie أيضاً للمخاطَب الرسمي» وهي توضيح مفيد لا ترجمة حرفية مضافة."},
        {"note": "أسئلة النص تختبر ضمائر الفصل؛ المفاتيح مطابقة."},
    ],
}

STYLE_ALTERNATIVES = {
    "t-a0-02": [
        {"note": "يمكن قول «تشرفنا» بدل «سعيدة بلقائك» لكن الصياغ الحالي معياري لـFreut mich في A0."}
    ],
    "t-a0-03": [
        {"note": "«ثلاثون/ثلاثين» كلتاهما صحيحة في العربية الفصحى؛ الاستعمال «عمري ثلاثون سنة» صحيح (خبر مرفوع)."}
    ],
    "t-a0-04": [
        {"note": "«اليوم هو الاثنين» و«اليوم الاثنين» كلتاهما صحيحة؛ الصياغة الحالية مع «هو» أوضح للمتعلم المبتدئ."}
    ],
    "t-a0-05": [],
    "t-a0-01": [],
}

SOURCES = {
    "t-a0-01": [
        {"cite": "Goethe A1 Starter — Alphabet und Buchstabieren.", "url": "https://www.goethe.de/de/spr/ueb.html", "supports": "محتوى A0 للأبجدية وطريقة لفظ الحروف."}
    ],
    "t-a0-02": [
        {"cite": "Goethe A1 — Begrüßungen und Vorstellung.", "url": "https://www.goethe.de/de/spr/ueb/fer.html", "supports": "Hallo/Guten Tag/Freut mich/Auf Wiedersehen تحيات مستوى A0."}
    ],
    "t-a0-03": [
        {"cite": "Goethe A1 — Zahlen 1 bis 10 und Alter.", "url": "https://www.goethe.de/de/spr/ueb.html", "supports": "الأرقام الأساسية وذكر العمر بـIch bin … Jahre alt."}
    ],
    "t-a0-04": [
        {"cite": "Goethe A1 — Wochentage.", "url": "https://www.goethe.de/de/spr/ueb.html", "supports": "أيام الأسبوع السبعة وWochenende."}
    ],
    "t-a0-05": [
        {"cite": "Goethe A1 — Personalpronomen (ich/du/er/sie/wir/ihr/Sie).", "url": "https://www.goethe.de/de/spr/ueb.html", "supports": "الضمائر ومخاطبة Sie الرسمية."}
    ],
}

CONTENT_CHECKS = [
    {"id": "CHK-R135-01", "check": "حقولا promptAr الفارغان (t-a0-03 Q3 وt-a0-04 Q3) مملوآن.", "status": "pass"},
    {"id": "CHK-R135-02", "check": "لا توجد حقول promptAr فارغة في نصوص A0 الخمسة بعد التصحيح.", "status": "pass"},
    {"id": "CHK-R135-03", "check": "كل الأسطر الألمانية والعناوين والخيارات والمفاتيح والشرح مقفلة.", "status": "pass"},
    {"id": "CHK-R135-04", "check": "الإجابات مطابقة للنص (dreißig/Montag/drei).", "status": "pass"},
]

NOTE = "تصحيحان عربيان فقط: استكمال حقلَي promptAr فارغَين في t-a0-03 Q3 وt-a0-04 Q3 (سؤال العمر وسؤال يوم اليوم). روجعت النصوص الخمسة كاملة؛ العربية مطابقة للألماني في التراكيب الأساسية (التحيات، الأرقام، أيام الأسبوع، الضمائر). لا تعديل للألماني أو المفاتيح. لا تحذيرات محتوى جديدة. W1–W4/W6 تبقى مفتوحة، ولا صوت لهذه النصوص."


def main() -> None:
    data = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    targets = [t for t in data if t.get("id") in TARGET_IDS]
    assert len(targets) == len(TARGET_IDS)

    # snapshots
    snapshots = {}
    total_q = 0
    total_q_chars_de = 0
    total_empty_ar_after = 0
    for t in targets:
        qs = t.get("questions", [])
        total_q += len(qs)
        for q in qs:
            total_q_chars_de += len(q.get("promptDe",""))
            if not q.get("promptAr","").strip():
                total_empty_ar_after += 1
        snapshots[t["id"]] = {
            "id": t["id"], "level": t["level"],
            "titleDe": t.get("titleDe",""), "titleAr": t.get("titleAr",""),
            "de": t["de"], "ar": t["ar"],
            "questions": qs,
        }

    assert total_empty_ar_after == 0

    # audio
    audio_dir = ROOT/"public"/"audio"
    audio_files = 0
    if audio_dir.exists():
        for tid in TARGET_IDS:
            a = audio_dir/tid
            if a.exists(): audio_files += len(list(a.glob("*.mp3")))

    rep = {
        "reviewRule": REVIEW_RULE,
        "batchLabel": BATCH_LABEL,
        "targetIds": TARGET_IDS,
        "totals": {
            "texts": len(targets),
            "questions": total_q,
            "approximateUnits": len(targets)*4 + total_q,  # metadata + qs
        },
        "snapshots": snapshots,
        "corrections": CORRECTIONS,
        "contextNotes": CONTEXT_NOTES,
        "styleAlternatives": STYLE_ALTERNATIVES,
        "sources": SOURCES,
        "contentChecks": CONTENT_CHECKS,
        "contentWarnings": [],
        "judgement": {
            "corrected": len(CORRECTIONS),
            "unresolved": 0,
            "note": NOTE,
        },
        "limits": {
            "human": "لا اعتماد لغوي بشري؛ المراجعة مصدرية على النص الحي.",
            "legal": "لا محتوى قانوني في نصوص A0.",
            "medical": "لا محتوى طبي.",
            "cefr": "لا إعادة حساب CEFR.",
        },
        "gates": {"patch": "scripts/patches/review_a0_texts_01.py", "report": "scripts/patches/report_a0_texts_01.py", "smoke": "K209a–j"},
        "audio": {
            "mp3Files": audio_files,
            "note": "لا استماع للصوت."
        },
    }
    OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md = [f"# تقرير {REVIEW_RULE} — {BATCH_LABEL} (t-a0-01..05)\n",
          f"- **قاعدة المراجعة:** {REVIEW_RULE}",
          f"- **النطاق:** 5 نصوص A0 (الأبجدية، التحيات، الأرقام 1–10، الأيام، ضمائر الفصل)",
          f"- **الوحدات ≈:** {rep['totals']['approximateUnits']}",
          f"- **التصحيحات:** {len(CORRECTIONS)} · غير محسوم: 0\n",
          "## الحكم\n", f"> {NOTE}\n",
          "## التصحيحات\n"]
    for i,c in enumerate(CORRECTIONS,1):
        md.append(f"### {i}. `{c['unit']}` · `{c['field']}`")
        md.append(f"- **قبل:** «{c['before']}»")
        md.append(f"- **بعد:** «{c['after']}»")
        md.append(f"- **السبب:** {c['reason']}\n")
    md.append("## ملاحظات سياقية\n")
    for tid,notes in CONTEXT_NOTES.items():
        md.append(f"### {tid}")
        for n in notes: md.append(f"- {n['note']}")
        md.append("")
    md.append("## فحوص المحتوى\n")
    for c in CONTENT_CHECKS: md.append(f"- **{c['id']}** ({c['status']}): {c['check']}")
    md.append("\n## المصادر\n")
    for tid,srcs in SOURCES.items():
        md.append(f"### {tid}")
        for s in srcs: md.append(f"- {s['cite']} — {s['url']} — {s['supports']}")
        md.append("")
    md.append("## الحدود\n")
    for k,v in rep['limits'].items(): md.append(f"- **{k}:** {v}")
    md.append(f"\n## البوابات {rep['gates']['smoke']}\n")
    for ch in "abcdefghij": md.append(f"- K209{ch} (يُرَحَّل إلى `scripts/engine_smoke.ts`).")
    md.append("")
    OUT_MD.write_text("\n".join(md), encoding="utf-8")
    print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
    print(f"  texts={len(targets)} q={total_q} corrections={len(CORRECTIONS)} emptyAr={total_empty_ar_after}")


if __name__ == "__main__":
    main()
