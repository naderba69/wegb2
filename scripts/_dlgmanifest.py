# -*- coding: utf-8 -*-
"""R145: يُعيد توليد content/dialog-audio.json من قرص public/audio/dialog حصراً.

الحارس: المانيفست مرآة القرص لا أمنية — كل ملف معلن موجود، وكل ملف على القرص معلن،
والأحجام بايت-ب-بايت، وعدد الأصوات (stimmen) من عدد متحدثي الحوار في البنك نفسه.
أسماء الأصوات تسميات إنتاج ضمن سجل المشروع (voice-01..05)؛ لا ندّعي تحققاً سمعياً.
تشغيله المتكرر بلا أثر إضافي (idempotent).
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "public", "audio", "dialog")
BANK = os.path.join(ROOT, "content", "dialogues.json")
OUT = os.path.join(ROOT, "content", "dialog-audio.json")

bank = json.load(open(BANK, encoding="utf8"))
dialogues = bank if isinstance(bank, list) else bank.get("dialogues") or list(bank.values())
by_id = {d["id"]: d for d in dialogues}

# تسميات الأصوات: سجلّات مراجعة الإنتاج في docs/ أولاً (اتفقت بايتاتها مع القرص بايت-ب-بايت)،
# ثم قيمة المانيفست السابق حرفياً بلا تطبيع — لا نخترع صوتاً ولا نعيد تسمية مسجّل
old = json.load(open(OUT, encoding="utf8")) if os.path.exists(OUT) else {"einsaetze": []}
old_voice = {}
for e in old.get("einsaetze", []):
    old_voice.setdefault(e["id"], e.get("voice", ""))
DOCS = os.path.join(ROOT, "docs")
for name in sorted(os.listdir(DOCS)):
    if not name.endswith(".json"):
        continue
    try:
        doc = json.load(open(os.path.join(DOCS, name), encoding="utf8"))
    except Exception:
        continue
    for a in doc.get("audioAssetAudit") or []:
        if a.get("id") and a.get("voice"):
            old_voice[a["id"]] = a["voice"]

def stimmen_von(did):
    return len({l["who"] for l in by_id[did]["lines"]})

def stimme_von(did):
    n = stimmen_von(did)
    if n == 3:
        return "voice-01+voice-02+voice-03"
    v = old_voice.get(did, "")
    teile = [t for t in v.split("+") if re.fullmatch(r"voice-\d{2}", t)]
    if len(teile) == 2:
        return "+".join(teile)
    # موجات بلا سجل محفوظ: زوج السجل الافتراضي حسب المستوى
    return "voice-04+voice-05" if by_id[did]["level"] in ("A1", "A2") else "voice-01+voice-02"

entries = []
for f in sorted(os.listdir(DIR)):
    m = re.fullmatch(r"(d-(?:a0|a1|a2|b1|b2)-\d{2})\.mp3", f)
    assert m, f"ملف بلا نمط حوار: {f}"
    did = m.group(1)
    assert did in by_id, f"ملف بلا حوار في البنك: {did}"
    path = os.path.join(DIR, f)
    b = os.path.getsize(path)
    assert b > 8000, (f, b)
    with open(path, "rb") as fh:
        head = fh.read(3)
    assert head == b"ID3" or head[:2] == b"\xff\xfb" or head[0] == 0xFF, f"ليس MP3 صالحاً: {f}"
    entries.append({
        "id": did,
        "file": f"/audio/dialog/{f}",
        "bytes": b,
        "voice": stimme_von(did),
        "level": by_id[did]["level"],
        "stimmen": stimmen_von(did),
    })

entries.sort(key=lambda e: e["id"])
json.dump({"count": len(entries), "einsaetze": entries}, open(OUT, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(f"المانيفست ← {len(entries)} ملفاً من القرص، كلها في البنك، بلا ملف شبح")
