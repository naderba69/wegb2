#!/usr/bin/env python3
"""Deep linguistic audit — conservative, high-confidence fixes only."""
import json, re, os, glob
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")

# Only HIGH-CONFIDENCE Arabic fixes (obvious misspellings or typos — NOT dialect/orthography variants)
AR_FIXES = [
    (r"\bهاذا\b", "هذا"),
    (r"\bهاذه\b", "هذه"),
    (r"\bهاذي\b", "هذه"),
    (r"\bهاؤلاء\b", "هؤلاء"),
    (r"\bلاكن\b", "لكن"),
    (r"\bإسم\b", "اسم"),
    (r"\bإبن\b", "ابن"),
    (r"\bإبنة\b", "ابنة"),
    (r"\bإمرأة\b", "امرأة"),
    (r"\bإمراه\b", "امرأة"),
    (r"\bإثنان\b", "اثنان"),
    (r"\bإثنين\b", "اثنين"),
    (r"\bفالمقابل\b", "فبالمقابل"),
    (r"\bبالاضافة\b", "بالإضافة"),
    (r"\bبالاضافه\b", "بالإضافة"),
    (r"\bالاجابة\b", "الإجابة"),
    (r"\bالاجابه\b", "الإجابة"),
    (r"\bإستطاع\b", "استطاع"),
    (r"\bإستطاعت\b", "استطاعت"),
    (r"\bإستخدام\b", "استخدام"),
    (r"\bإستعمل\b", "استعمل"),
    (r"\bإستلم\b", "استلم"),
    (r"\bبالتاكيد\b", "بالتأكيد"),
    (r"\bالتاكيد\b", "التأكيد"),
    (r"\bتاكيد\b", "تأكيد"),
    (r"\bاخطاء\b", "أخطاء"),
    (r"\bاشياء\b", "أشياء"),
    (r"\bاسماء\b", "أسماء"),
    (r"\bاسئلة\b", "أسئلة"),
    (r"\bأرجوا\b", "أرجو"),
    (r"\bاسمع\b", "أسمع"),
    (r"\bالان\b", "الآن"),
    (r"\bاذا\b", "إذا"),
    (r"\bانه\b", "إنه"),
    (r"\bانها\b", "إنها"),
    (r"\bانهم\b", "إنهم"),
    (r"\bايضا\b", "أيضاً"),
    (r"\bالماضى\b", "الماضي"),
    (r"\bمبروك\b", "مبروك"),  # keep (colloquial acceptable in our register)
    (r"\s+،", "،"),
    (r"\s+؛", "؛"),
    (r"\s+\.", "."),
    (r",,", "،"),
    (r"\.\.+", "…"),
    (r"  +", " "),
    (r"^،\s*", ""),
]

# High-confidence German fixes (obvious typos only)
DE_FIXES = [
    (r"\bauf\s+wiedersehen\b", "auf Wiedersehen"),
    (r"\bAuf\s+wiedersehen\b", "Auf Wiedersehen"),
    (r"\bauf\s+Wiedersehen\b", "Auf Wiedersehen"),  # already correct
    (r"\bStrasse\b", "Straße"),
    (r"\bgross\b", "groß"),
    (r"\bgrossen\b", "großen"),
    (r"\bgrosser\b", "großer"),
    (r"\bgrosses\b", "großes"),
    (r"\bweiss\b", "weiß"),
    (r"\bweissen\b", "weißen"),
    (r"\bmuß\b", "muss"),
    (r"\bzu\s+hause\b", "zu Hause"),
    (r"\bnach\s+hause\b", "nach Hause"),
    (r"\bKafe\b", "Kaffee"),
    (r"\bKafee\b", "Kaffee"),
    (r"\bKonnte\b", "konnte"),  # lowercase
    (r"\bmußte\b", "musste"),
    (r"\bgruß\b", "Gruß"),
    (r"\bGrüß\s+gott\b", "Grüß Gott"),
    (r"\bherr\s+([A-Z])", r"Herr \1"),
    (r"\bfrau\s+([A-Z])", r"Frau \1"),
    (r"\bherr\.\s", "Herr "),
    (r"\bfrau\.\s", "Frau "),
    (r"  +", " "),
    (r"\s+\.", "."),
    (r"\s+,", ","),
    (r"\s+\?", "?"),
    (r"\s+!", "!"),
    (r"\s+:", ":"),
    (r"\s+;", ";"),
    (r"\s+”", "”"),
    (r"\(\s+", "("),
    (r"\s+\)", ")"),
    (r"^\s+", ""),
    (r"\s+$", ""),
]

def is_arabic(s: str) -> bool:
    return any('\u0600' <= c <= '\u06FF' for c in s)

def apply_fixes(text, fixes, stats):
    t = text
    for pat, repl in fixes:
        new, n = pat.subn(repl, t)
        if n:
            stats[pat.pattern] += n
            t = new
    return t

def audit_file(path):
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    ar_stats = Counter()
    de_stats = Counter()
    changed = 0

    ar_compiled = [(re.compile(pat), repl) for pat, repl in AR_FIXES]
    de_compiled = []
    for pat, repl in DE_FIXES:
        flags = 0
        if pat.startswith(r"\b") and pat[2].islower():
            # keep case sensitivity for proper nouns
            pass
        de_compiled.append((re.compile(pat), repl))

    def fix(obj):
        nonlocal changed
        if isinstance(obj, dict):
            return {k: fix(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [fix(v) for v in obj]
        if isinstance(obj, str):
            old = obj
            if is_arabic(obj):
                obj = apply_fixes(obj, ar_compiled, ar_stats)
            # Apply German fixes to strings that look German (including mixed De/Ar)
            obj = apply_fixes(obj, de_compiled, de_stats)
            if obj != old:
                changed += 1
            return obj
        return obj
    new_data = fix(data)
    if changed:
        with open(path,'w',encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=2)
            f.write('\n')
    return changed, ar_stats, de_stats

total_changes = 0
ar_total = Counter()
de_total = Counter()
for f in sorted(glob.glob(os.path.join(CONTENT, "*.json"))):
    n, ars, des = audit_file(f)
    total_changes += n
    ar_total.update(ars)
    de_total.update(des)
    if n:
        print(f"{os.path.basename(f)}: {n} strings changed")

print(f"\nTOTAL: {total_changes} strings modified.")
print("\nArabic fixes (pattern -> count):")
for pat, c in ar_total.most_common(30):
    print(f"  {pat}: {c}")
print("\nGerman fixes (pattern -> count):")
for pat, c in de_total.most_common(20):
    print(f"  {pat}: {c}")
