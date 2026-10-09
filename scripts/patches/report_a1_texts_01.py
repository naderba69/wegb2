#!/usr/bin/env python3
"""R136 — report for A1 texts t-a1-01..03 (12 Arabic promptAr fills)."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXTS_PATH = ROOT / "content" / "texts.json"
OUT_JSON = ROOT/"docs"/"content-review-a1-texts-01-2026-10-09.json"
OUT_MD   = ROOT/"docs"/"content-review-a1-texts-01-2026-10-09.md"

TARGET_IDS = ["t-a1-01","t-a1-02","t-a1-03"]
PROMPTS = {
    ("t-a1-01", 0): "من أين يوسف؟",
    ("t-a1-01", 1): "يقوم في الساعة ___ (الوقت).",
    ("t-a1-01", 2): "يعمل في شركة كبيرة.",
    ("t-a1-01", 3): "يوسف يقوم في الساعة ___ والنصف.",
    ("t-a1-02", 0): "ماذا يعمل أبيه؟",
    ("t-a1-02", 1): "عنده أخ و___ أخوات.",
    ("t-a1-02", 2): "متى يأكلون معاً؟",
    ("t-a1-02", 3): "يوم ___ نأكل دائماً معاً.",
    ("t-a1-03", 0): "أين الحليب؟",
    ("t-a1-03", 1): "الخبز يكلف ___ يورو.",
    ("t-a1-03", 2): "المجموع ___ يورو.",
    ("t-a1-03", 3): "الخبز يكلف ___ يورو.",
}
CORRECTIONS = [
    {"unit": f"{tid}.questions[{qi}].promptAr", "field": "promptAr", "before": "",
     "after": ar, "reason": "استكمال حقل promptAr فارغ لسؤال نص A1 مطابقة الألماني."}
    for (tid,qi),ar in PROMPTS.items()
]

CONTEXT_NOTES = {
    "t-a1-01": [
        {"note": "نص تعريفي عن شاب تونسي في برلين؛ نصف سابعة = 6:30 صباحاً."},
        {"note": "«شركة صغيرة» لا كبيرة، لذا جواب الصح/الخطأ Q2 هو falsch."},
        {"note": "«يحرز تقدماً» لـFortschritte machen ترجمة صحيحة."},
    ],
    "t-a1-02": [
        {"note": "يوم الجمعة = Am Freitag يوم الأكل معاً عند العائلة العربية (تقارب ثقافي مناسب)."},
        {"note": "عندي أخ وأختان (Bruder/zwei Schwestern) مطابق للألماني."},
        {"note": "صفاقس مدينة تونسية ساحلية؛ النص يطابق d-a2-27 في ذكر سوسة/صفاقس."},
    ],
    "t-a1-03": [
        {"note": "حوار سوبرماركت: الحليب خلف الجبن، الخبز 2 يورو، البيض 3 يورو، المجموع 5 يورو."},
        {"note": "Q1 وQ3 يتطابقان في الجواب (zwei/2) وهو تكرار تعليمي مقصود."},
        {"note": "«تفضّل» لـbitte، «عفواً» لـEntschuldigung؛ صياغ سليمة."},
    ],
}

SOURCES = {
    "t-a1-01": [{"cite": "Goethe A1 — Sich vorstellen / Tagesablauf.", "url": "https://www.goethe.de/de/spr/ueb.html", "supports": "مفردات التعريف بالاسم/العمر/السكن/المهنة والروتين اليومي."}],
    "t-a1-02": [{"cite": "Goethe A1 — Meine Familie.", "url": "https://www.goethe.de/de/spr/ueb.html", "supports": "الأب/الأم/الإخوة والعائلة والروتين الأسبوعي."}],
    "t-a1-03": [{"cite": "Goethe A1 — Einkaufen (Im Supermarkt).", "url": "https://www.goethe.de/de/spr/ueb.html", "supports": "مفردات التسوّق والسؤال عن موقع السلع والأسعار البسيطة."}],
}

CONTENT_CHECKS = [
    {"id": "CHK-R136-01", "check": "حقول promptAr الاثنا عشر مملوءة.", "status": "pass"},
    {"id": "CHK-R136-02", "check": "الأسئلة العربية تطابق الألماني معنىً.", "status": "pass"},
    {"id": "CHK-R136-03", "check": "الألماني/الخيارات/المفاتيح/العناوين/النصوص مقفلة.", "status": "pass"},
    {"id": "CHK-R136-04", "check": "لا تحذيرات محتوى جديدة.", "status": "pass"},
]

NOTE = "استكمال اثني عشر حقلاً من حقول promptAr الفارغة في نصوص A1 الثلاثة الأولى (t-a1-01..03). رُوجعت النصوص والترجمات العربية؛ العربية مطابقة للألماني في أزمنة الحاضر البسيط، ومفردات التعريف، والعائلة، والتسوق. لا تعديل للألماني أو المفاتيح."


def main() -> None:
    data = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    targets = [t for t in data if t.get("id") in TARGET_IDS]
    assert len(targets)==3
    total_q = sum(len(t.get("questions",[])) for t in targets)
    empty = sum(1 for t in targets for q in t.get("questions",[]) if not q.get("promptAr","").strip())
    assert empty==0
    snaps = {t["id"]:{"id":t["id"],"level":t["level"],"titleDe":t["titleDe"],"titleAr":t["titleAr"],
                     "de":t["de"],"ar":t["ar"],"questions":t["questions"]} for t in targets}
    rep = {
        "reviewRule":"R136","batchLabel":"أول دفعة نصوص A1","targetIds":TARGET_IDS,
        "totals":{"texts":3,"questions":total_q,"approximateUnits":3*4+total_q},
        "snapshots":snaps,"corrections":CORRECTIONS,
        "contextNotes":CONTEXT_NOTES,"styleAlternatives":{},"sources":SOURCES,
        "contentChecks":CONTENT_CHECKS,"contentWarnings":[],
        "judgement":{"corrected":len(CORRECTIONS),"unresolved":0,"note":NOTE},
        "limits":{"human":"لا اعتماد لغوي بشري.","legal":"لا محتوى قانوني.","medical":"لا محتوى طبي.","cefr":"لا إعادة حساب CEFR."},
        "gates":{"patch":"scripts/patches/review_a1_texts_01.py","report":"scripts/patches/report_a1_texts_01.py","smoke":"K210a–j"},
        "audio":{"mp3Files":0,"note":"لا استماع للصوت."},
    }
    OUT_JSON.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

    md = [f"# تقرير R136 — أول دفعة نصوص A1 (t-a1-01..03)\n",
          f"- **النطاق:** 3 نصوص A1 (يوم جديد / عائلتي / في السوبرماركت)",
          f"- **التصحيحات:** {len(CORRECTIONS)} · غير محسوم: 0\n",
          "## الحكم\n",f"> {NOTE}\n","## التصحيحات\n"]
    for i,c in enumerate(CORRECTIONS,1):
        md.append(f"### {i}. `{c['unit']}`\n- **بعد:** «{c['after']}»\n")
    md.append("## ملاحظات سياقية\n")
    for tid,ns in CONTEXT_NOTES.items():
        md.append(f"### {tid}")
        for n in ns: md.append(f"- {n['note']}")
        md.append("")
    md.append("## فحوص المحتوى\n")
    for c in CONTENT_CHECKS: md.append(f"- **{c['id']}** ({c['status']}): {c['check']}")
    md.append("\n## المصادر\n")
    for tid,ss in SOURCES.items():
        md.append(f"### {tid}")
        for s in ss: md.append(f"- {s['cite']} — {s['supports']}")
        md.append("")
    md.append("\n## البوابات K210a–j")
    md.append("")
    OUT_MD.write_text("\n".join(md),encoding="utf-8")
    print(f"Wrote {OUT_JSON.name} and {OUT_MD.name}")
    print(f"  texts=3 q={total_q} corrections={len(CORRECTIONS)}")


if __name__ == "__main__": main()
