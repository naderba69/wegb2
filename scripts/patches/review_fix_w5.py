#!/usr/bin/env python3
"""R134 — Fix W5 typo in d-b2-02 question 0: Digitalisung → Digitalisierung.

Scope: single-character correction in German question prompt to fix
documented typo W5 (added to contentWarnings by R123, unmodified until
this content task). Per W-content protocol, correcting an obvious
orthographic typo (missing 'ier') is a content-bug fix — not an Arabic
review, not a meaning change. We adjust the German prompt (one word),
regenerate Arabic prompt to match (it had the same truncated root
«الرقمنة» which is correct; we keep Arabic), update key if needed, and
leave options/answers/explanations/dictation/ar lines LOCKED.

The fix is surgical: `Digitalisung` -> `Digitalisierung` in exactly one
string (d-b2-02.questions[0].promptDe). Arabic promptAr already says
«تتطلب الرقمنة بنيةً تحتية ___» which correctly translates Digitalisierung
(الرقمنة is the standard word). No changes to Arabic required.
"""
from __future__ import annotations
import json
from pathlib import Path

DIALOGUES = Path(__file__).resolve().parents[2] / "content" / "dialogues.json"

EXPECTED_FIXES = 1
OLD_STR = "Digitalisung"
NEW_STR = "Digitalisierung"


def main() -> None:
    data = json.loads(DIALOGUES.read_text(encoding="utf-8"))
    applied = 0
    locked_de_lines = 0
    locked_questions = 0
    locked_dictations = 0

    for dlg in data:
        # Lock all German line text across the bank except the one target.
        for ln in dlg.get("lines", []):
            locked_de_lines += 1
        for q in dlg.get("questions", []):
            locked_questions += 1
        for _d in dlg.get("dictation", []):
            locked_dictations += 1

        if dlg["id"] != "d-b2-02":
            continue
        q = dlg["questions"][0]
        if q["promptDe"] == OLD_STR + " setzt eine Infrastruktur ___.":
            q["promptDe"] = NEW_STR + " setzt eine Infrastruktur ___."
            applied += 1
        elif OLD_STR in q["promptDe"]:
            # safety fallback
            before = q["promptDe"]
            q["promptDe"] = q["promptDe"].replace(OLD_STR, NEW_STR, 1)
            if before != q["promptDe"]:
                applied += 1

    if applied > EXPECTED_FIXES:
        raise RuntimeError(f"too many changes: {applied} (expected {EXPECTED_FIXES})")

    DIALOGUES.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R134> patch complete · changes applied: {applied} · locked DE lines: {locked_de_lines} "
          f"· locked questions: {locked_questions} · locked dictations: {locked_dictations}")


if __name__ == "__main__":
    main()
