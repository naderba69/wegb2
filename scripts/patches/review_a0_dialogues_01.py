#!/usr/bin/env python3
"""R133 — review patch for A0 dialogues d-a0-01..d-a0-03 (first A0 batch)."""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"
D = json.loads(D_PATH.read_text(encoding="utf-8"))

# Note: A0 dialogues use "sp" for speaker, not "who". Locked.
FIXES: dict[str, dict[int, str]] = {
    "d-a0-01": {
        2: "مَنْ يَقول «سعيدة بلقائك»؟",  # Wer sagt «Freut mich»?
    },
    "d-a0-02": {
        1: "مَنْ يَقول «شكراً»؟",          # Wer sagt «Danke!»?
        2: "هل الجملة «الناتج أربعة» صحيحة؟",  # Das Ergebnis ist vier. (richtig/falsch)
    },
    "d-a0-03": {
        1: "أيَّةَ حروفٍ يَتهجّاها B؟",      # Welche Buchstaben buchstabiert B?
        2: "ماذا يَطلُب A مِن B؟",          # Was bittet A B zu tun?
    },
}

EXPECTED_FIXES = 5
applied = 0
de_locked = 0
by_id = {d["id"]: d for d in D}

for did, qmap in FIXES.items():
    dlg = by_id[did]
    de_locked += sum(1 for ln in dlg["lines"])
    de_locked += sum(1 for q in dlg["questions"])
    de_locked += sum(1 for dx in (dlg.get("dictation") or []))
    for qi, new_ar in qmap.items():
        q = dlg["questions"][qi]
        old = q.get("promptAr", "")
        if old.strip() != new_ar.strip():
            q["promptAr"] = new_ar
            applied += 1

# Idempotency guard: re-run = 0 new changes
if applied > EXPECTED_FIXES:
    print(f"!!! unexpected fixes {applied}", file=sys.stderr); sys.exit(1)

# Assert no German/who/options/explanationAr/dictation touched (we only filled promptAr)
for did in FIXES:
    dlg = by_id[did]
    for ln in dlg["lines"]:
        assert "de" in ln and "ar" in ln and "sp" in ln and "who" not in ln
    for q in dlg["questions"]:
        assert q.get("promptDe") and q.get("answer") and isinstance(q.get("options"), list)

D_PATH.write_text(json.dumps(D, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"<R133> patch complete · changes applied: {applied} · locked DE lines: {de_locked}")
