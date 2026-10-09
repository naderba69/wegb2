#!/usr/bin/env python3
"""R135 — review A0 texts (t-a0-01..05): fill empty promptAr fields.

Scope: 5 A0 texts (Alphabet, Hallo, Zahlen 1-10, Tage, Ich bin da).
The A0 texts are structurally correct; German/titles/options/answers/explanations
LOCKED. Arabic text reviewed against German meaning.

Confirmed fixes (2 empty Arabic question prompts filled):
  1. t-a0-03 Q3 (Wie alt ist die Person im Text?): empty → «كم عمر الشخص في النص؟»
  2. t-a0-04 Q3 (Welcher Tag ist heute im Text?): empty → «ما يوم اليوم في النص؟»

No other Arabic issues found on source review of t-a0-01/02/05 (all Arabic
fields present, translations accurate, particles and register correct).
"""
from __future__ import annotations
import json
from pathlib import Path

TEXTS = Path(__file__).resolve().parents[2] / "content" / "texts.json"
EXPECTED_FIXES = 2


def main() -> None:
    data = json.loads(TEXTS.read_text(encoding="utf-8"))
    applied = 0
    locked_titles = 0
    locked_de_chars = 0

    for t in data:
        if not isinstance(t, dict):
            continue
        locked_titles += 1
        locked_de_chars += len(t.get("de", ""))

        tid = t.get("id")
        if tid == "t-a0-03":
            q = t["questions"][2]
            if not q.get("promptAr", "").strip():
                q["promptAr"] = "كم عمر الشخص في النص؟"
                applied += 1
        elif tid == "t-a0-04":
            q = t["questions"][2]
            if not q.get("promptAr", "").strip():
                q["promptAr"] = "ما يوم اليوم في النص؟"
                applied += 1

    if applied > EXPECTED_FIXES:
        raise RuntimeError(f"too many changes: {applied} (expected ≤{EXPECTED_FIXES})")

    TEXTS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R135> patch complete · changes applied: {applied} · locked titles: {locked_titles} · locked DE chars: {locked_de_chars}")


if __name__ == "__main__":
    main()
