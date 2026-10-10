#!/usr/bin/env python3
"""R137 — review A1 texts t-a1-04..06: fill empty promptAr fields."""
from __future__ import annotations
import json
from pathlib import Path
TEXTS = Path(__file__).resolve().parents[2]/"content"/"texts.json"
EXPECTED = 12
PROMPTS = {
  ("t-a1-04",0): "أين المحطة؟",
  ("t-a1-04",1): "الشارع ___ إلى اليسار.",
  ("t-a1-04",2): "خمس دقائق على ___ فقط.",
  ("t-a1-04",3): "المحطة مقابل ___." ,
  ("t-a1-05",0): "ماذا تدرس سارة؟",
  ("t-a1-05",1): "كيف هو المعلّم؟",
  ("t-a1-05",2): "تتعلّم سارة صباحاً مع أصدقائها.",
  ("t-a1-05",3): "تدرس سارة ___." ,
  ("t-a1-06",0): "أين السرير؟",
  ("t-a1-06",1): "على ___ كتب كثيرة.",
  ("t-a1-06",2): "يحب غرفته لأنها ___." ,
  ("t-a1-06",3): "على الجدار ___ صورة لعائلته.",
}
def main():
    data=json.loads(TEXTS.read_text(encoding="utf-8"))
    applied=0
    for t in data:
        if not isinstance(t,dict): continue
        for qi,q in enumerate(t.get("questions",[])):
            k=(t.get("id"),qi)
            if k in PROMPTS and not q.get("promptAr","").strip():
                q["promptAr"]=PROMPTS[k]; applied+=1
    assert applied==EXPECTED, (applied,EXPECTED)
    TEXTS.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"<R137> patch complete · changes applied: {applied} · locked titles: {len(data)}")
if __name__=="__main__": main()
