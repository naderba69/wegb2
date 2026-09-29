# -*- coding: utf-8 -*-
"""يَمسَحُ public/audio/dialog ويبني content/dialog-audio.json — حارسُه: كلُّ ملفٍ للوافدِ الثلاثينَ فقط."""
import json, os, re
ROOT = "/home/user/weg-nach-b2"
import re as _re
bank = json.load(open(f"{ROOT}/content/dialogues.json", encoding="utf8"))
texts = {x["id"]: {"level": x["level"]} for x in bank if _re.match(r"d-b[12]-", x["id"])}
DIR = f"{ROOT}/public/audio/dialog"
entries = []
for f in sorted(os.listdir(DIR)):
    m = re.fullmatch(r"(d-b[12]-\d{2})\.mp3", f)
    assert m, f
    did = m.group(1)
    assert did in texts, did
    b = os.path.getsize(f"{DIR}/{f}")
    assert b > 8000, (f, b)
    entries.append({"id": did, "file": f"/audio/dialog/{f}", "bytes": b, "voice": "voice-01", "level": texts[did]["level"]})
json.dump({"count": len(entries), "einsaetze": entries}, open(f"{ROOT}/content/dialog-audio.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(f"المانيفستُ ← {len(entries)}/36")
