# -*- coding: utf-8 -*-
"""
دفعةُ صوتِ A0 — سدادُ دينِ XII (13/14/16):
  أربعةُ نصوصِ الأيامِ 1–10 (t-a0-02..05) بملفاتِها في public/audio/hoeren/
  + قيودُها في content/hoeren-audio.json. t-a0-01 موجودٌ في نصوصِ أيامٍ غيرِ مستعملة.
التشغيل: python3 scripts/patches/add_a0_hoeren_audio.py  [بعدَ توليدِ الملفات]
idempotent: الإدخالُ الموجودُ لا يُعاد.
"""
import json, sys, io, os
from datetime import date

MANIFEST = "content/hoeren-audio.json"
IDS = ["t-a0-02", "t-a0-03", "t-a0-04", "t-a0-05"]
VOICE = "voice-A0 (de, Arena)"


def main() -> int:
    fehlend = [i for i in IDS if not os.path.isfile(f"public/audio/hoeren/{i}.mp3")
               or os.path.getsize(f"public/audio/hoeren/{i}.mp3") < 4000]
    if fehlend:
        print("ملفاتٌ غائبةٌ أو صغيرة:", ", ".join(fehlend))
        return 1
    with io.open(MANIFEST, encoding="utf-8") as f:
        m = json.load(f)
    have = {e["id"] for e in m["einsaetze"]}
    add = 0
    for tid in IDS:
        if tid in have:
            continue
        m["einsaetze"].append({
            "id": tid,
            "file": f"/audio/hoeren/{tid}.mp3",
            "voice": VOICE,
            "level": "A0",
            "bytes": os.path.getsize(f"public/audio/hoeren/{tid}.mp3"),
        })
        add += 1
    if add:
        m["count"] = len(m["einsaetze"])
        m["generated"] = date.today().isoformat()
        with io.open(MANIFEST, "w", encoding="utf-8") as f:
            json.dump(m, f, ensure_ascii=False, indent=2)
            f.write("\n")
    print(f"تمَّ: {add} قيداً جديداً · الإجمالي {m['count']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
