#!/usr/bin/env python3
"""R136 — review A1 texts t-a1-01..03: fill empty promptAr fields.

Scope: 3 A1 texts (Ein neuer Tag / Meine Familie / Im Supermarkt).
Confirmed fixes: 12 Arabic promptAr fills (all 4 questions per text were empty).
German/titles/options/answers/explanations LOCKED.
"""
from __future__ import annotations
import json
from pathlib import Path

TEXTS = Path(__file__).resolve().parents[2] / "content" / "texts.json"
EXPECTED_FIXES = 12

# Arabic prompts to fill, keyed by (text_id, q_index).
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


def main() -> None:
    data = json.loads(TEXTS.read_text(encoding="utf-8"))
    applied = 0
    locked_titles = 0
    locked_de_chars = 0

    for t in data:
        if not isinstance(t, dict): continue
        locked_titles += 1
        locked_de_chars += len(t.get("de",""))
        tid = t.get("id")
        for qi, q in enumerate(t.get("questions", [])):
            key = (tid, qi)
            if key in PROMPTS:
                if not q.get("promptAr", "").strip():
                    q["promptAr"] = PROMPTS[key]
                    applied += 1

    if applied != EXPECTED_FIXES:
        raise RuntimeError(f"expected {EXPECTED_FIXES} changes, got {applied}")

    TEXTS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"<R136> patch complete · changes applied: {applied} · locked titles: {locked_titles} · locked DE chars: {locked_de_chars}")


if __name__ == "__main__":
    main()
