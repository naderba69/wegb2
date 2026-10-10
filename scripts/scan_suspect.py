#!/usr/bin/env python3
"""Second pass: flag potential issues without auto-fixing (conservative report mode)."""
import json, re, os, glob
from collections import Counter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")

SUSPECT = [
    (re.compile(r"[\.!?]\s+[a-zäöüß]"), "lowercase-after-sentence-end"),
    (re.compile(r"\b(denke|glaube|meine|sage|weiß|hoffe|finde|meinst|glaubst|sagst|denkst|findest|hoffe),\s+das\b"), "possible-das-nach-dass-verb"),
    (re.compile(r"\b(daß)\b"), "daß-obsolete-use-dass"),
    (re.compile(r"ـ{2,}"), "excessive-tatweel"),
    (re.compile(r"\bwiedersehen\b"), "lowercase-wiedersehen"),
    (re.compile(r"\bseid\s+(Jahren|Monaten|Tagen|Wochen|lang|Kurzem)\b"), "seid-since-context-maybe-seit"),
    (re.compile(r"\bwider\s+(einmal|sehen|schreiben|kommen|finden|hören|holen|haben)\b"), "wider-vs-wieder"),
]

def walk_strings(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk_strings(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_strings(v, f"{path}[{i}]")
    elif isinstance(obj, str):
        yield path, obj

findings = []
for f in sorted(glob.glob(os.path.join(CONTENT, "*.json"))):
    with open(f, encoding='utf-8') as fh:
        data = json.load(fh)
    for path, s in walk_strings(data):
        for pat, label in SUSPECT:
            for m in pat.finditer(s):
                start = max(0,m.start()-25)
                end = min(len(s),m.end()+25)
                snippet = s[start:end].replace("\n"," ")
                findings.append((os.path.basename(f), path, label, snippet))

labels = Counter(label for _,_,label,_ in findings)
for lbl, c in labels.most_common():
    print(f"\n=== {lbl} ({c}) ===")
    for fn, path, label, snippet in findings:
        if label == lbl:
            print(f"  {fn}{path}: ...{snippet}...")
