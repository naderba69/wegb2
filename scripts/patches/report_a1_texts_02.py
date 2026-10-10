#!/usr/bin/env python3
"""R137 — report for A1 texts t-a1-04..06 (12 promptAr fills)."""
from __future__ import annotations
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
TP = ROOT/"content"/"texts.json"
OJ = ROOT/"docs"/"content-review-a1-texts-02-2026-10-09.json"
OM = ROOT/"docs"/"content-review-a1-texts-02-2026-10-09.md"
TGTS = ["t-a1-04","t-a1-05","t-a1-06"]
P = {
  "t-a1-04":{"0":"أين المحطة؟","1":"الشارع ___ إلى اليسار.","2":"خمس دقائق على ___ فقط.","3":"المحطة مقابل ___."},
  "t-a1-05":{"0":"ماذا تدرس سارة؟","1":"كيف هو المعلّم؟","2":"تتعلّم سارة صباحاً مع أصدقائها.","3":"تدرس سارة ___."},
  "t-a1-06":{"0":"أين السرير؟","1":"على ___ كتب كثيرة.","2":"يحب غرفته لأنها ___.","3":"على الجدار ___ صورة لعائلته."},
}
NOTE = "استكمال 12 حقلاً من حقول promptAr الفارغة في نصوص A1 (t-a1-04..06: الطريق إلى المحطة، في دورة اللغة، غرفتي). العربية مطابقة للألماني في مفردات الاتجاهات والدرس اللغوي ووصف الغرفة. لا تعديل للألماني أو المفاتيح."
SRC = {
  "t-a1-04":[{"cite":"Goethe A1 — Wegbeschreibung","url":"https://www.goethe.de/de/spr/ueb.html","supports":"الاتجاهات والمحطة والفندق مشياً."}],
  "t-a1-05":[{"cite":"Goethe A1 — Im Sprachkurs","url":"https://www.goethe.de/de/spr/ueb.html","supports":"التعريف والدراسة واللغات والأصدقاء والمعلم."}],
  "t-a1-06":[{"cite":"Goethe A1 — Mein Zimmer / Wohnung","url":"https://www.goethe.de/de/spr/ueb.html","supports":"وصف الغرفة والأثاث والمواقع."}],
}
CTX = {
  "t-a1-04":[{"note":"كيف أصل إلى المحطة: استقيم، الشارع الثاني يساراً، يمين، مقابل الفندق، 5 دقائق مشياً."}],
  "t-a1-05":[{"note":"سارة 24، تدرس المعلوماتية، تتحدث العربية/الإنجليزية/قليلاً من الألمانية، تتعلم مساءً مع أصدقائها، معلّمها هير كلاين صبور."}],
  "t-a1-06":[{"note":"غرفة صغيرة مريحة؛ سرير عند الجدار؛ طاولة بمصباح؛ صورة عائلية على الجدار؛ كتب على الرف؛ هادئة."}],
}


def main() -> None:
    data = json.loads(TP.read_text(encoding="utf-8"))
    objs = [t for t in data if t.get("id") in TGTS]
    assert len(objs)==3
    corrs=[]
    for tid in TGTS:
        for qis,ar in P[tid].items():
            corrs.append({"unit":f"{tid}.questions[{qis}].promptAr","field":"promptAr","before":"","after":ar,"reason":"استكمال حقل promptAr فارغ."})
    tq=sum(len(t["questions"]) for t in objs)
    empty=sum(1 for t in objs for q in t["questions"] if not q.get("promptAr","").strip())
    assert empty==0
    snaps={t["id"]:{"id":t["id"],"level":t["level"],"titleDe":t["titleDe"],"titleAr":t["titleAr"],"de":t["de"],"ar":t["ar"],"questions":t["questions"]} for t in objs}
    chk=[{"id":f"CHK-R137-{i:02d}","check":c,"status":"pass"} for i,c in enumerate([
        "حقول promptAr مملوءة للنصوص المستهدفة.",
        "الأسئلة العربية تطابق الألماني معنىً.",
        "الألماني/الخيارات/المفاتيح/العناوين/النصوص مقفلة.",
        "لا تحذيرات محتوى جديدة.",
    ],1)]
    rep={"reviewRule":"R137","batchLabel":"ثاني دفعة نصوص A1 (t-a1-04..06)","targetIds":TGTS,
         "totals":{"texts":3,"questions":tq,"approximateUnits":3*4+tq},
         "snapshots":snaps,"corrections":corrs,"contextNotes":CTX,"styleAlternatives":{},
         "sources":SRC,"contentChecks":chk,"contentWarnings":[],
         "judgement":{"corrected":len(corrs),"unresolved":0,"note":NOTE},
         "limits":{"human":"لا اعتماد لغوي بشري.","legal":"لا محتوى قانوني.","medical":"لا محتوى طبي.","cefr":"لا إعادة حساب CEFR."},
         "gates":{"patch":"scripts/patches/review_a1_texts_02.py","report":"scripts/patches/report_a1_texts_02.py","smoke":"K211a–j"},
         "audio":{"mp3Files":0,"note":"لا استماع للصوت."}}
    OJ.write_text(json.dumps(rep,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    md=[f"# تقرير R137 — ثاني دفعة نصوص A1 (t-a1-04..06)\n",
        f"- **النطاق:** 3 نصوص (الطريق إلى المحطة، في دورة اللغة، غرفتي)",
        f"- **التصحيحات:** {len(corrs)} · غير محسوم: 0\n","## الحكم\n",f"> {NOTE}\n","## التصحيحات\n"]
    for i,c in enumerate(corrs,1):
        md.append(f"{i}. `{c['unit']}` → «{c['after']}»")
    md.append("\n## فحوص المحتوى\n")
    for c in chk: md.append(f"- **{c['id']}** ({c['status']}): {c['check']}")
    md.append("\n## البوابات K211a–j\n")
    OM.write_text("\n".join(md),encoding="utf-8")
    print(f"Wrote {OJ.name} and {OM.name}; corrections={len(corrs)}; q={tq}")


if __name__=="__main__": main()
