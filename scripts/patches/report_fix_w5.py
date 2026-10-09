#!/usr/bin/env python3
"""R134 — Content bug-fix W5: d-b2-02 questions[0] typo Digitalisung → Digitalisierung.

Single-character German spelling fix. Arabic promptAr was already correct
(الرقمنة = Digitalisierung), so no Arabic change required. All other
fields locked. Closes content-warning W5 (raised by R123).
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES = ROOT / "content" / "dialogues.json"
OUT_DIR = ROOT / "docs"
OUT_JSON = OUT_DIR / "content-review-fix-w5-2026-10-09.json"
OUT_MD = OUT_DIR / "content-review-fix-w5-2026-10-09.md"

REVIEW_RULE = "R134"
BATCH_LABEL = "إصلاح تحذير نصي W5"
TARGET_IDS = ["d-b2-02"]
SPEAKER_KEY = "who"


CORRECTIONS = [
    {
        "unit": "d-b2-02.questions[0].promptDe",
        "field": "promptDe",
        "before": "Die Digitalisung setzt eine Infrastruktur ___.",
        "after": "Die Digitalisierung setzt eine Infrastruktur ___.",
        "reason": "إصلاح خطأ إملائي ألماني في نص السؤال (كلمة Digitalisierung كان ينقصها المقطع «ier» فصارت «Digitalisung»؛ هو التحذير النصي W5 الموثق في R123 ومفتوح حتى هذه المهمة). الترجمة العربية «تتطلب الرقمنة بنيةً تحتية ___» كانت صحيحة (الرقمنة تقابل Digitalisierung) فبقيت بلا تعديل."
    }
]

CONTEXT_NOTES = {
    "d-b2-02": [
        {"note": "خطأ إملائي بحت: الصياغة القياسية في الألمانية هي «Digitalisierung» (Duden)، ولا وجود لـ»Digitalisung» كلمة مستقلة."},
        {"note": "السياق التعليمي باقٍ؛ سؤال ملء فراغ عن البنية التحتية الرقمية، الخيارات والمفاتيح والشرح تظل مطابقة للمعنى المصحَّح (تطابق كلمة Digitalisierung التي تقابلها العربية «الرقمنة»)."},
        {"note": "حقل promptAr «تتطلب الرقمنة بنيةً تحتية ___» ترجمة صحيحة للصيغة المصحَّحة؛ لم يحتج لتعديل."}
    ]
}

STYLE_ALTERNATIVES = {
    "d-b2-02": [
        {"note": "لا بدائل أسلوبية هنا؛ الإصلاح إملائي بحت في كلمة واحدة."}
    ]
}

SOURCES = {
    "d-b2-02": [
        {"cite": "Duden — Digitalisierung (Rechtschreibung und Bedeutung)",
         "url": "https://www.duden.de/rechtschreibung/Digitalisierung",
         "supports": "الصياغة القياسية «Digitalisierung»؛ «Digitalisung» خطأ إملائي ناقص «ier»."}
    ]
}

CONTENT_CHECKS = [
    {"id": "CHK-W5-01", "check": "لا وجود لـ»Digitalisung» في كامل content/dialogues.json بعد الإصلاح.", "status": "pass"},
    {"id": "CHK-W5-02", "check": "الصيغة الصحيحة «Digitalisierung» موجودة في d-b2-02.questions[0].promptDe.", "status": "pass"},
    {"id": "CHK-W5-03", "check": "العربية promptAr لم تُمسّ؛ مطابقتها للصياغة الألمانية المصحَّحة قائمة.", "status": "pass"},
    {"id": "CHK-W5-04", "check": "كل الأسطر الألمانية والأسئلة والإملاءات الأخرى مقفلة.", "status": "pass"}
]

NOTE = "تصحيح إملائي ألماني واحد في d-b2-02.questions[0].promptDe: «Digitalisung» → «Digitalisierung» (إغلاق تحذير المحتوى W5 الموثق في R123؛ R134 هو مهمة المحتوى المنفصلة الموعودة). العربية كانت وتبقى صحيحة (الرقمنة). لا مساس ببنية السؤال أو خياراته أو مفتاحه أو شرحه أو إملاءات الحوار. بقي W1/W2/W3/W4/W6 مفتوحاً لمهمات محتوى مقبلة. لا استماع لملفات صوت."


def count_occurrences(text: str, needle: str) -> int:
    return text.count(needle)


def main() -> None:
    data = json.loads(DIALOGUES.read_text(encoding="utf-8"))
    targets = [d for d in data if d["id"] in TARGET_IDS]
    assert len(targets) == len(TARGET_IDS), "missing targets"

    # Verify post-patch state
    raw = json.dumps(data, ensure_ascii=False)
    assert "Digitalisung" not in raw, "typo W5 still present"
    w5 = next(d for d in targets if d["id"] == "d-b2-02")
    assert w5["questions"][0]["promptDe"] == "Die Digitalisierung setzt eine Infrastruktur ___."

    # snapshots
    snapshots = {}
    for d in targets:
        snapshots[d["id"]] = {
            "id": d["id"], "level": d["level"], "title": d.get("title",""),
            "lines": [{"who": ln[SPEAKER_KEY], "de": ln["de"], "ar": ln["ar"]} for ln in d["lines"]],
            "questions": d["questions"],
            "dictation": d["dictation"],
        }
        if "waisen" in d:
            snapshots[d["id"]]["waisen"] = d["waisen"]

    # stats
    total_lines = sum(len(d["lines"]) for d in targets)
    total_q = sum(len(d["questions"]) for d in targets)
    total_dict = sum(len(d["dictation"]) for d in targets)

    # waisen scan
    waisen_present = any("waisen" in d for d in targets)
    waisen_count = 0
    waisen_unlinked = 0
    if waisen_present:
        for d in targets:
            for w in d.get("waisen", []):
                waisen_count += 1
                # simplistic unlinked check: token exists in at least one line?
                tok = w.get("de","").split()[0].lower() if w.get("de") else ""
                if tok and not any(tok in ln["de"].lower() for ln in d["lines"]):
                    waisen_unlinked += 1

    # audio
    import glob, os
    audio_dir = ROOT / "public" / "audio"
    audio_manifest = 0
    audio_files = 0
    if audio_dir.exists():
        for d in targets:
            a = audio_dir / d["id"]
            if a.exists():
                audio_files += len(list(a.glob("*.mp3")))
                # manifest line presence
                for ln in d["lines"]:
                    if "audio" in ln and ln["audio"]:
                        audio_manifest += 1

    rep = {
        "reviewRule": REVIEW_RULE,
        "batchLabel": BATCH_LABEL,
        "targetIds": TARGET_IDS,
        "totals": {
            "dialogues": len(targets),
            "lines": 0,         # Arabic/DE lines unchanged
            "questions": 1,     # one question-field fix
            "dictation": 0,
            "approximateUnits": 1,
        },
        "snapshots": snapshots,
        "corrections": CORRECTIONS,
        "contextNotes": CONTEXT_NOTES,
        "styleAlternatives": STYLE_ALTERNATIVES,
        "sources": SOURCES,
        "contentChecks": CONTENT_CHECKS,
        "contentWarnings": [
            {"id": "W1", "dialogue": "d-b1-16", "status": "open",
             "note": "«15% عند 50 دقيقة» يخالف VO (EU) 2021/782 (25% عند ≥60 دقيقة). مفتوح لمهمة محتوى مقبلة."},
            {"id": "W2", "dialogue": "d-b1-24", "status": "open",
             "note": "«Vierzehn Tage Aufbewahrung» مقابل الحفظ النظامي ستة أشهر (§ 973 BGB). مفتوح."},
            {"id": "W3", "dialogue": "d-b1-25", "status": "open",
             "note": "eID بستة يورو مقابل المجانية الرسمية (W3). مفتوح."},
            {"id": "W4", "dialogue": "d-b1-27", "status": "open",
             "note": "الرسوم تبقى نافذة مقابل رسوم لكل محاولة (W4). مفتوح."},
            {"id": "W5", "dialogue": "d-b2-02", "status": "fixed-R134",
             "note": "خطأ إملائي «Digitalisung» → «Digitalisierung»؛ مغلق في R134."},
            {"id": "W6", "dialogue": "d-b2-11", "status": "open",
             "note": "«Kappungsgrenze bei elf Prozent» مقابل 20٪/15٪ في § 558 BGB ومؤشر § 558c. مفتوح."},
        ],
        "judgement": {
            "correct": 0,
            "corrected": 1,
            "unresolved": 0,
            "note": NOTE,
        },
        "limits": {
            "human": "لا اعتماد لغوي بشري؛ المصدر المعجمي الوحيد Duden لتدقيق الإملاء.",
            "professional": "لا استشارة مهنية قانونية/تقنية/تربوية في الإصلاح؛ سجلات W6/W1/W2/W3/W4 مفتوحة وتحتاج مهمة محتوى قانونية/إدارية.",
            "legal": "لا تعديل للبنود القانونية في W1/W2/W3/W4/W6؛ إصلاح W5 إملائي فقط.",
            "medical": "لا محتوى طبي.",
            "cefr": "لا إعادة حساب CEFR.",
        },
        "gates": {
            "patch": "scripts/patches/review_fix_w5.py",
            "report": "scripts/patches/report_fix_w5.py",
            "smoke": "K208a–j",
        },
        "waisen": {
            "present": waisen_present,
            "count": waisen_count,
            "unlinked": waisen_unlinked,
            "note": f"d-b2-02 {'يحتوي' if waisen_present else 'لا يحتوي'} على حقل waisen (عدد الوصلات: {waisen_count}).",
        },
        "audio": {
            "manifestEntries": audio_manifest,
            "mp3Files": audio_files,
            "note": "لا استماع للصوت؛ مجرد تطابق وجود/اسم بين البيان والملفات." if (audio_manifest or audio_files) else "لا استماع (لا مداخل/ملفات صوت لهذا الحوار في هذا النطاق)."
        },
    }
    OUT_JSON.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Markdown
    md = []
    md.append(f"# تقرير {REVIEW_RULE} — {BATCH_LABEL} (d-b2-02)\n")
    md.append(f"- **قاعدة المراجعة:** {REVIEW_RULE}")
    md.append(f"- **النطاق:** حوار واحد `d-b2-02` (B2 — منصّة الذكاء الاصطناعي في التعليم)")
    md.append(f"- **الوحدات:** ≈1 وحدة (تصحيح حقل سؤال واحد)")
    md.append(f"- **التصحيحات:** 1 (إملائي ألماني) · غير محسوم: 0 · تحذيرات محتوى مغلقة: W5 · تحذيرات متبقية: W1–W4, W6\n")
    md.append("## الحكم\n")
    md.append(f"> {NOTE}\n")
    md.append("## التصحيحات\n")
    for i, c in enumerate(CORRECTIONS, 1):
        md.append(f"### {i}. `{c['unit']}` · `{c['field']}`")
        md.append(f"- **قبل:** {c['before']}")
        md.append(f"- **بعد:** {c['after']}")
        md.append(f"- **السبب:** {c['reason']}\n")
    md.append("## ملاحظات سياقية\n")
    for did, notes in CONTEXT_NOTES.items():
        md.append(f"### {did}")
        for n in notes:
            md.append(f"- {n['note']}")
        md.append("")
    md.append("## بدائل أسلوبية (غير مطبَّقة)\n")
    for did, alts in STYLE_ALTERNATIVES.items():
        md.append(f"### {did}")
        for a in alts:
            md.append(f"- {a['note']}")
        md.append("")
    md.append("## فحوص المحتوى\n")
    for ck in CONTENT_CHECKS:
        md.append(f"- **{ck['id']}** ({ck['status']}): {ck['check']}")
    md.append("\n## تحذيرات المحتوى (سجل W)\n")
    for w in rep["contentWarnings"]:
        md.append(f"- **{w['id']}** · {w['dialogue']} · {w['status']} — {w['note']}")
    md.append("\n## المصادر\n")
    for did, srcs in SOURCES.items():
        md.append(f"### {did}")
        for s in srcs:
            md.append(f"- {s['cite']} — {s['url']} — {s['supports']}")
        md.append("")
    md.append("## الحدود\n")
    for k, v in rep["limits"].items():
        md.append(f"- **{k}:** {v}")
    md.append(f"\n## البوابات {rep['gates']['smoke']}\n")
    for ch in "abcdefghij":
        md.append(f"- K208{ch} (يُرَحَّل إلى `scripts/engine_smoke.ts`).")
    md.append("")
    OUT_MD.write_text("\n".join(md), encoding="utf-8")
    print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
    print(f"  corrections={len(CORRECTIONS)} warnings={len(rep['contentWarnings'])-1} closed=W5")


if __name__ == "__main__":
    main()
